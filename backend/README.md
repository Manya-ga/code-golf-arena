# Real-Time Multiplayer Code Golf Arena

Production-oriented backend scaffold using Node.js, Express, MongoDB/Mongoose, Socket.IO, Judge0, and Claude.

## Status

The core gameplay backend is implemented: anonymous players, rooms, hidden-test Judge0
submissions, room leaderboards, and Socket.IO room/submission events. Claude feedback,
authentication, and background jobs are intentionally still unimplemented.

## Getting started

1. Copy `.env.example` to `.env` and supply real values.
2. Install dependencies with `npm install`.
3. Start development with `npm run dev`.

## First API call

Create the anonymous player required to create, join, and submit to a room:

```http
POST /api/players
Content-Type: application/json

{ "displayName": "Ada" }
```
