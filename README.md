# DSA Learning Web

A full-stack interactive platform for learning Data Structures and Algorithms through structured topics, coding problems, progress tracking, badges, and a leaderboard.

The platform combines DSA learning with an online C++ coding environment, allowing users to read problems, write solutions, run code, and submit solutions directly from the browser.

---

## 🚀 Features

### 📚 DSA Learning

- Structured Data Structures and Algorithms topics
- Topic-wise learning resources
- Algorithm explanations and problem descriptions
- Easy, Medium, and Hard problem classification
- 50+ coding problems available for practice

### 💻 Online C++ Code Execution

- Write C++ solutions directly in the browser
- Run code against provided input
- Submit solutions for evaluation
- Compilation and runtime errors are displayed
- Code execution is isolated inside Docker containers
- Resource limits help prevent excessive CPU/memory usage
- Network access is disabled during code execution

### 🔐 Authentication

- User registration and login
- Protected routes
- User-specific learning progress
- Persistent user data

### 📊 Progress Tracking

- Track solved coding problems
- Maintain user progress
- Update progress after successful submissions
- View learning activity through the dashboard

### 🏆 Gamification

- Achievement badges
- Leaderboard based on user progress
- Progress analytics
- Encourages consistent DSA practice

### 🖥️ Responsive Interface

- Modern dark-themed UI
- Responsive design
- Interactive problem pages
- Clean navigation between learning modules

---

## 🛠️ Tech Stack

### Frontend

- React.js
- TypeScript
- Vite
- Tailwind CSS
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- TypeScript
- REST APIs

### Database

- SQLite
- Prisma ORM

### Code Execution

- Docker
- GCC 13
- C++17

### Development Tools

- Git
- GitHub
- VS Code
- npm

---

## 🏗️ Architecture

The application follows a client-server architecture.

```text
                    ┌──────────────────────┐
                    │      React Frontend  │
                    │   TypeScript + Vite  │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │     TypeScript       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌───────────┐    ┌────────────┐   ┌─────────────┐
        │  Prisma   │    │   Auth &   │   │   Problem   │
        │  + SQLite │    │  Progress  │   │  Evaluation │
        └───────────┘    └────────────┘   └──────┬──────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │ Docker Container│
                                         │   GCC / C++17   │
                                         └─────────────────┘
🔗 LinkedIn: https://linkedin.com/in/your-profile
