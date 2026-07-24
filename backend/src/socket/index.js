// Registers Socket.IO connection lifecycle and all domain event handlers.
import { registerLeaderboardHandlers } from './leaderboardHandlers.js';
import { registerRoomHandlers } from './roomHandlers.js';
import { registerSubmissionHandlers } from './submissionHandlers.js';

export const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.info(`Socket connected: ${socket.id}`);

    registerRoomHandlers(io, socket);
    registerSubmissionHandlers(io, socket);
    registerLeaderboardHandlers(io, socket);

    socket.on('disconnect', () => {
      console.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
