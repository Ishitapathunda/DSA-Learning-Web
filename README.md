# DSA Learning Web

A full-stack interactive platform for learning Data Structures and Algorithms through structured topics, coding problems, progress tracking, badges, and a leaderboard.

The platform combines DSA learning with an online C++ coding environment, allowing users to read problems, write solutions, run code, and submit solutions directly from the browser.

---

DSA Learning Web — Live: dsa-learning-web.vercel.app

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


🔄 How It Works
1. User Authentication

A user creates an account and logs into the platform.

The backend authenticates the user and provides access to protected features.

2. Browse DSA Problems

Users can navigate through different DSA topics and select a problem.

Each problem contains:

Problem description
Examples
Input/output information
Difficulty level
Coding editor
3. Write C++ Code

The user writes a C++ solution inside the browser-based code editor.

For example:

#include <bits/stdc++.h>
using namespace std;


int main() {
    // solution
    return 0;
}
4. Run / Submit

When the user runs or submits the solution, the frontend sends the code to the backend.

The backend prepares the source code and input for execution.

5. Secure Docker Execution

The backend runs the C++ program inside an isolated Docker container.

The execution environment uses restrictions such as:

No network access
Memory limits
CPU limits
Process limits
Read-only mounted workspace
Non-root user
Dropped Linux capabilities
No privilege escalation

This prevents submitted code from directly interacting with the host machine.

6. Result

The backend returns the execution result to the frontend.

The user can see:

Program output
Compilation errors
Runtime errors
Timeout information
Submission status
7. Progress Update

After a successful submission, the user's problem progress is updated.

The platform can then use this information for:

Progress tracking
Badges
Leaderboard
Analytics
📁 Project Structure
DSA-Learning-Web/
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── execution/
│   │   │   ├── dockerRunner.ts
│   │   │   └── judges/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   │
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── features/
│   ├── hooks/
│   ├── types/
│   └── ...
│
├── public/
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
⚙️ Local Setup
Prerequisites

Make sure the following are installed:

Node.js 18+
npm
Docker Desktop
Git

Docker is required for the C++ code execution feature.

1. Clone the Repository
git clone https://github.com/Ishitapathunda/DSA-Learning-Web.git
cd DSA-Learning-Web
2. Install Frontend Dependencies
npm install
3. Install Backend Dependencies
cd server
npm install
4. Configure Environment Variables

Create a .env file inside the server directory.

You can use the example file:

cp .env.example .env

Configure the required environment variables according to your local setup.

5. Setup Database

Run Prisma migrations:

npx prisma migrate dev
6. Seed Problems and Badges
npx prisma db seed

This populates the database with the available coding problems and badge definitions.

7. Start Backend

From the server directory:

npm run dev
8. Start Frontend

Open another terminal from the root project directory:

npm run dev

The frontend will be available at the local Vite development URL.

🐳 Docker Code Execution

The C++ execution system uses Docker to isolate user-submitted programs.

The backend creates an ephemeral container and executes the submitted code inside it.

The execution environment includes restrictions such as:

Network        → Disabled
Memory         → Limited
CPU            → Limited
Processes      → Limited
Filesystem     → Read-only
User           → Non-root
Capabilities   → Dropped
Privileges     → Restricted

The C++ program is compiled using:

GCC
C++17

The container is removed after execution.

📈 Learning Flow
Register / Login
       ↓
Browse DSA Topics
       ↓
Select Problem
       ↓
Read Description
       ↓
Write C++ Solution
       ↓
Run / Submit
       ↓
Docker Code Execution
       ↓
Evaluation Result
       ↓
Successful Submission
       ↓
Update Progress
       ↓
Badges / Leaderboard / Analytics
🎯 Project Goals

The goal of DSA Learning Web is to provide a single platform where students can:

Learn DSA concepts
Practice interview-oriented problems
Write and test C++ solutions
Track their learning progress
Earn achievements
Compare progress through a leaderboard

Instead of switching between a learning website, coding environment, and progress tracker, the platform combines these workflows into one application.

🔒 Security Considerations

Since the platform executes user-submitted C++ code, code execution is isolated using Docker.

The execution environment applies:

Network isolation
CPU and memory limits
Process limits
Read-only filesystem mounting
Non-root execution
Linux capability restrictions
No-new-privileges security option
Temporary container lifecycle

This provides an additional security boundary between submitted code and the host environment.

🧪 Testing

The project includes backend tests for important application functionality.

Before running the application, make sure Docker Desktop is running if you want to test C++ code execution.

📌 Future Improvements

Possible future improvements include:

Support for additional programming languages
More DSA problems
Advanced analytics
Personalized learning recommendations
Difficulty-based learning paths
Contest mode
More detailed submission history
Cloud deployment
Automated CI/CD pipeline
👩‍💻 Author

Ishita Pathunda

B.S. (Hons.) in Exploration Geophysics
Indian Institute of Technology Kharagpur

Links
GitHub: https://github.com/Ishitapathunda
Project Repository: https://github.com/Ishitapathunda/DSA-Learning-Web
