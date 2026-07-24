# Code Golf Arena

A real-time multiplayer competitive programming platform where the shortest correct solution wins.

## Overview

Code Golf Arena is a real-time competitive coding platform where players create or join multiplayer rooms, solve programming challenges together, and compete on more than just correctness.

Most platforms — LeetCode, Codeforces, HackerRank — score you on passing test cases and runtime. Code Golf Arena adds a twist: **Code Golf mode**, where the shortest correct solution wins. It rewards not just whether your code works, but how elegantly and compactly you can make it work, live, against other players, on a real-time leaderboard.

## Features

- Real-time multiplayer coding rooms
- Online code editor with custom test case support
- Judge0-powered, sandboxed code execution
- Automated correctness evaluation on submission
- Live leaderboard updates via WebSockets
- Code Golf scoring — shortest correct solution ranks highest
- JWT-based user authentication
- Submission history and tracking
- Clean, responsive interface

## Tech Stack

**Frontend**
React 19, Vite, Tailwind CSS, React Router, Axios, Socket.IO Client

**Backend**
Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, Socket.IO, Judge0 API

## Project Structure

```
code-golf-arena/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   ├── services/
│   └── package.json
│
├── README.md
└── .gitignore
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Manya-ga/code-golf-arena.git
cd code-golf-arena
```

### Backend setup

```bash
cd backend
npm install
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_SECRET=YOUR_SECRET_KEY

JUDGE0_API_URL=YOUR_JUDGE0_URL
JUDGE0_API_KEY=YOUR_API_KEY
```

Never commit your `.env` file — make sure it is listed in `.gitignore`.

## How It Works

1. Create or join a coding room.
2. Wait for all participants to join.
3. Read the programming challenge.
4. Write a solution in the editor.
5. Run it against sample or custom test cases.
6. Submit the solution for judging.
7. Judge0 evaluates correctness.
8. The leaderboard updates live for everyone in the room.
9. In Code Golf mode, the shortest correct solution takes the top rank.

## Roadmap

- Monaco (VS Code) editor integration
- LeetCode-style problem UI
- Daily challenges
- Contest mode
- Ratings and rankings
- User profiles
- Problem categories
- Editorial solutions
- AI-assisted code review
- Achievements and badges
- Dark / light theme toggle
- Docker support
- GitHub Actions CI/CD

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request.

## Author

**Manya G A**

GitHub: [github.com/Manya-ga](https://github.com/Manya-ga)
LinkedIn: [linkedin.com/in/manya-g-a-8912182a0](https://www.linkedin.com/in/manya-g-a-8912182a0/)


Inspired by LeetCode, Codeforces, and HackerRank — reimagined with a real-time, multiplayer Code Golf twist.
