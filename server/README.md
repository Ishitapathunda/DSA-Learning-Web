# DSA Learning Web — Backend

Express + TypeScript + Prisma + SQLite API for the DSA Learning Web platform.
This document covers backend setup only. The root project README (updated in
the final cleanup pass) covers the app as a whole.

## Prerequisites

- Node.js 18+
- **Docker** (Desktop on macOS/Windows, or Engine on Linux) — required for
  the code execution feature (Phase 4). Everything else works without it.

## Setup

```bash
npm install
cp .env.example .env          # defaults are fine for local dev
npx prisma migrate dev --name init
npx prisma db seed
docker pull gcc:13-slim       # one-time, needed before running/submitting code
npm run dev                   # starts on http://localhost:5000
```

Health check: `curl http://localhost:5000/api/health`

## Environment variables

See `.env.example` for the full list with placeholder values. Never commit
`.env` or `.env.test`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite file path |
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Session token signing |
| `COOKIE_NAME` | Name of the httpOnly auth cookie |

## Testing

```bash
npm test          # pushes schema + seeds a separate test.db, then runs vitest once
npm run test:watch
```

Tests use `.env.test` (a separate SQLite file from your dev DB) and mock the
Docker execution boundary (`src/execution/judge.ts`) so the suite doesn't
require Docker to be installed — see `tests/submissions.test.ts` for why.
Coverage: registration, login, duplicate-account rejection, protected-route
authorization (across every protected endpoint), problem listing/detail,
hidden-test-case leakage prevention, submission → progress → streak → badge
side effects (including duplicate-submission and compile-error edge cases),
and leaderboard ranking.

See `SECURITY.md` for the accompanying security review.

## API reference

All routes are prefixed `/api`.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Log in |
| POST | `/auth/logout` | — | Clear session |
| GET | `/auth/me` | ✓ | Current user |
| GET | `/problems` | — | List problems (`?topic=&difficulty=&search=`) |
| GET | `/problems/topics` | — | Distinct topic list |
| GET | `/problems/:slug` | — | Problem detail |
| POST | `/submissions/run` | ✓ | Run code against public examples |
| POST | `/submissions` | ✓ | Submit code against the full hidden test suite |
| GET | `/submissions` | ✓ | Submission history (`?slug=`) |
| GET | `/progress` | ✓ | Solved counts, topic/difficulty breakdown |
| GET | `/badges` | ✓ | Badge catalog with earned status |
| GET | `/streak` | ✓ | Current/longest streak |
| GET | `/leaderboard` | — | Top users by solved count |
| GET | `/analytics` | ✓ | Progress + submission accuracy |

## Known limitations (see SECURITY.md for detail)

- Judge harnesses (hidden test cases) currently exist for 8 of the 55
  problems; the rest show a read-only problem statement.
- No CSRF token yet; no refresh-token rotation/session revocation.
