# Security Review

This documents the security measures actually implemented in this codebase
as of Phase 9, and the residual risks/trade-offs that are still open. Written
so it can be defended in an interview — nothing here is aspirational.

## Authentication

- **Passwords**: hashed with bcrypt (12 salt rounds) via `bcryptjs`. Plain-text
  passwords are never stored or logged (`server/src/services/auth.service.ts`).
- **Sessions**: JWT signed with `JWT_SECRET`, stored in an `httpOnly` cookie —
  never accessible to client-side JavaScript, which closes off the most common
  XSS-driven token theft path. `secure: true` + `sameSite: "none"` in
  production (HTTPS-only); `sameSite: "lax"` in dev since the Vite proxy keeps
  requests same-site.
- **No user enumeration**: login failures return the same generic "Invalid
  email or password" whether the email exists or not.
- **Rate limiting**: `/api/auth/register` and `/api/auth/login` are limited to
  20 requests / 15 minutes per IP (`express-rate-limit`), slowing down
  credential-stuffing / brute-force attempts.

## Authorization

- `requireAuth` middleware verifies the JWT and attaches `req.userId` before
  any protected controller runs. Every route that touches user-specific data
  (progress, submissions, badges, streak, analytics, `/auth/me`) is behind it.
- Submissions/progress are always scoped to `req.userId` from the verified
  token — never from a client-supplied user ID — so one user cannot read or
  mutate another user's data by guessing an ID.

## Input validation

- All auth request bodies are validated with `zod` schemas
  (`server/src/utils/validation.ts`) before touching the database — rejects
  malformed emails, short passwords, invalid usernames, etc. with a 400 before
  any business logic runs.
- Submission code has a hard length cap (20,000 chars) checked before a
  container is ever spun up.

## Code execution sandboxing (the highest-risk surface in this app)

Untrusted C++ from any authenticated user is compiled and run. This is
treated as a full sandbox-escape risk, not a "just run g++" problem.
`server/src/execution/dockerRunner.ts` runs every submission in an ephemeral
Docker container with:

| Flag | Purpose |
|---|---|
| `--network none` | No network access in or out — can't exfiltrate data or call out |
| `--memory 128m --cpus 0.5` | Hard resource caps — one submission can't starve the host |
| `--pids-limit 64` | Blocks fork-bombs |
| `--read-only` + small `tmpfs` | Only a tiny in-memory scratch space is writable |
| `-v hostDir:/workspace:ro` | The code/input files are mounted read-only — container can't write back to the host |
| `--cap-drop ALL` | Drops all Linux capabilities |
| `--security-opt no-new-privileges` | Blocks privilege escalation inside the container |
| `--user 1000:1000` | Runs as non-root |
| `--rm` | Container is destroyed immediately after |
| Node-side `timeout` | Kills a hung compile/run after 8s regardless of container state |

Execution is also rate-limited per user (15 executions / 5 minutes) since
compiling+running is expensive, and every temp directory created on the host
is deleted in a `finally` block even if the run throws.

**Known limitation**: this protects the host and other users' data, but does
not defend against a submission that is simply slow/expensive within its
resource cap (e.g. an intentional near-infinite loop that still respects the
8s timeout) — acceptable for a learning platform's threat model, but would
need a queue + worker pool at real scale to avoid one user's submissions
blocking others'.

## Transport / headers

- `helmet()` sets standard security headers (CSP baseline, `X-Frame-Options`,
  `X-Content-Type-Options`, etc.).
- CORS is locked to `CLIENT_URL` with `credentials: true` — no wildcard origin.

## Secrets

- No secrets are hard-coded. `JWT_SECRET`, `DATABASE_URL`, `CLIENT_URL`, etc.
  are all read from environment variables. `.env` (and `.env.test`) are
  gitignored; `.env.example` ships with placeholders only.

## SQL injection

- All database access goes through Prisma's query builder (parameterized
  queries under the hood) — no raw SQL string concatenation anywhere in the
  codebase.

## Known residual risks / not yet hardened

Being upfront about what this review did **not** close off, so it isn't
mistaken for a complete audit:

- **CSRF**: `sameSite: "lax"/"none"` + `credentials`-scoped CORS reduces but
  doesn't eliminate CSRF risk for state-changing `POST` routes. A
  double-submit CSRF token would be the next step before any production use
  with real user data.
- **No refresh-token rotation**: the JWT is a single long-lived (7-day) token
  with no revocation list — logging out clears the cookie client-side but a
  stolen token remains valid until it expires. A production version would
  want short-lived access tokens + rotating refresh tokens, or a server-side
  session/blocklist.
- **No CSP report-only tuning**: `helmet`'s default CSP is a reasonable
  baseline but hasn't been tightened to this app's actual script/style
  sources.
- **Docker execution requires the host process to have Docker socket
  access** — effectively a privileged capability for whatever account runs
  the Node server. In production this should run on dedicated, isolated
  infrastructure (a separate execution-worker host/VM), not the same process
  that also holds the JWT secret and DB connection.
