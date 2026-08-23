# 📘 DSA Learning Web App

A full-stack **DSA (Data Structures & Algorithms) learning platform** — real
accounts, a real database, and real in-browser C++ code execution in a
sandboxed Docker environment. Started as a static React frontend and was
upgraded in phases into a genuine full-stack application; this README
reflects what's actually implemented, not a roadmap.

---

## 📌 Features

| Feature | Status |
|---|---|
| Real authentication (bcrypt + JWT httpOnly cookies) | ✅ |
| 55 DSA problems across 15+ topics, backed by a real database | ✅ |
| In-browser C++ editor with sandboxed Run/Submit execution | ✅ for 8 problems, see [Known Limitations](#known-limitations) |
| Real progress tracking (per-topic, per-difficulty) | ✅ |
| Daily solving streaks | ✅ |
| Automatic badge awarding | ✅ |
| Leaderboard | ✅ |
| Analytics (accuracy, breakdowns) | ✅ |
| Rule-based chatbot | ✅ (unchanged from original — not LLM-powered) |
| Automated test suite + security review | ✅ |

---

## 🏗️ Architecture

```
DSA-Learning-Web/
├── src/                    # React 18 + Vite frontend
│   ├── api/                 # fetch wrappers per backend resource
│   ├── context/AuthContext  # session state, login/register/logout
│   ├── routes/ProtectedRoute
│   ├── pages/                # Home, Problems, ProblemDetail, Dashboard, Leaderboard, ...
│   └── components/           # Navbar, Footer, Chatbot
│
└── server/                  # Express + TypeScript + Prisma + SQLite backend
    ├── prisma/schema.prisma  # User, Problem, Submission, Progress, Badge, UserBadge, UserStreak
    ├── prisma/seedData/      # the 55 problems, migrated from the original frontend
    ├── src/routes|controllers|services/
    └── src/execution/        # Docker-sandboxed C++ compile+run
```

The frontend talks to the backend over `/api/*`, proxied by Vite in dev so
the httpOnly auth cookie works same-origin with no CORS complexity. See
`server/README.md` for the full API reference and `server/SECURITY.md` for
the security review.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Framer Motion, Monaco Editor |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite via Prisma ORM |
| Auth | bcrypt, JWT (httpOnly cookies), zod validation |
| Code execution | Docker (network-isolated, resource-capped containers) |
| Testing | Vitest, Supertest |

---

## 📦 Setup

### Prerequisites
- Node.js 18+
- **Docker** (Desktop on macOS/Windows, Engine on Linux) — only required for
  the code-execution feature; everything else works without it.

### 1. Clone and install
```bash
git clone https://github.com/Ishitapathunda/DSA-Learning-Web.git
cd DSA-Learning-Web
npm install
cd server && npm install && cd ..
```

### 2. Configure environment variables
```bash
cp .env.example .env                    # frontend (optional overrides)
cp server/.env.example server/.env      # backend — defaults work for local dev
```
Never commit `.env` files — see `.gitignore`.

### 3. Set up the database
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### 4. Pull the code-execution image (one-time)
```bash
docker pull gcc:13-slim
```

### 5. Run it
```bash
npm run dev:all
```
This starts the backend on `http://localhost:5000` and the frontend on
`http://localhost:5173` together. (Or run `npm run dev:server` and `npm run
dev` in separate terminals.)

### 6. Run the backend test suite
```bash
cd server
npm test
```

---

## 📸 Screenshots

<img width="2838" height="1483" alt="image" src="https://github.com/user-attachments/assets/221c7d3d-73fc-4a0e-b3b2-292fa5670dfa" />

<img width="2818" height="1489" alt="image" src="https://github.com/user-attachments/assets/de624020-dd70-4241-ab0e-ac558dc9a910" />

---

## Known limitations

Being upfront about the current gaps rather than overstating scope:

- **Code execution harnesses**: 8 of the 55 problems (Two Sum, Reverse
  String, Valid Parentheses, Best Time to Buy/Sell Stock, Contains
  Duplicate, Valid Anagram, Maximum Subarray, Climbing Stairs) have real
  stdin/stdout judge test cases and a working editor. The remaining 47 show
  a read-only problem statement — extending the judge to tree/graph/linked-
  list-shaped problems needs per-problem input parsing, which is future work.
- **Security**: see `server/SECURITY.md` for what's covered (bcrypt, httpOnly
  JWT, Docker sandbox flags, rate limiting, input validation, no hardcoded
  secrets) and what's explicitly not yet hardened (no CSRF token, no
  refresh-token rotation/revocation).
- **Leaderboard** computes rankings by loading all users into memory and
  sorting — fine at this scale, would want a SQL aggregation at real scale
  (documented in `leaderboard.service.ts`).
- **Languages**: only C++ is supported, per the original spec.

---

## 🤝 Contributing

Contributions are welcome! Feel free to create issues or submit PRs for
improvements.

## 📧 Contact

Ishita Pathunda
🔗 LinkedIn: https://linkedin.com/in/your-profile
