// Adapts Socket.IO payloads to existing services without putting business rules in handlers.
import { leaderboardService } from '../services/leaderboardService.js';
import { roomService } from '../services/roomService.js';
import { submissionService } from '../services/submissionService.js';

export const socketController = {
  joinRoom: async ({ roomCode, playerId }) => roomService.joinRoom({ roomCode, playerId }),

  leaveRoom: async ({ roomId, playerId }) => roomService.leaveRoom({ roomId, playerId }),

  submitCode: async ({ roomId, playerId, sourceCode }) =>
    submissionService.submitCode({ roomId, playerId, sourceCode }),

  getLeaderboard: async ({ roomId }) => leaderboardService.getRoomLeaderboard(roomId),
};
