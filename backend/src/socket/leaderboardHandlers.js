// Registers leaderboard requests and broadcasts updated rankings to every room participant.
import { socketController } from '../controllers/socketController.js';
import { roomChannel, withSocketAcknowledgement } from './socketHelpers.js';

export const broadcastLeaderboard = (io, roomId, leaderboard) => {
  io.to(roomChannel(roomId)).emit('leaderboard-update', {
    roomId,
    leaderboard,
  });
};

export const registerLeaderboardHandlers = (io, socket, controller = socketController) => {
  socket.on(
    'get-leaderboard',
    withSocketAcknowledgement(socket, async ({ roomId }) => {
      const leaderboard = await controller.getLeaderboard({ roomId });
      return { roomId, leaderboard };
    }),
  );

  void io;
};
