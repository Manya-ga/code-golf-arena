# Code Golf Arena

This repository contains the Real-Time Multiplayer Code Golf Arena application.

`backend/` contains the Express, MongoDB, Judge0, Socket.IO, and optional Claude-feedback
service. `frontend/` is a no-build browser client served by the backend at the root URL.

## Run locally

1. Copy `backend/.env.example` to `backend/.env` and set a strong `JWT_SECRET`.
2. Start MongoDB, then run `npm install`, `npm run seed`, and `npm run dev` from `backend/`.
3. Open `http://localhost:3000` in two browser windows to play a match.

Judge0 must be reachable at `JUDGE0_BASE_URL`. Claude feedback is automatically enabled only
when `ANTHROPIC_API_KEY` is set to a real API key.
