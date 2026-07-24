// Registers realtime code submission events and broadcasts judge results safely.
import { socketController } from '../controllers/socketController.js';
import { broadcastLeaderboard } from './leaderboardHandlers.js';
import { withSocketAcknowledgement } from './socketHelpers.js';

export const registerSubmissionHandlers = (io, socket, controller = socketController) => {
  socket.on(
    'submit-code',
    withSocketAcknowledgement(socket, async ({ roomId, sourceCode }) => {
      const result = await controller.submitCode({ roomId, playerId: socket.data.playerId, sourceCode });
      const feedback = {
        submissionId: result.submission._id,
        judgeStatus: result.submission.judgeStatus,
        results: result.results,
      };

      socket.emit('submission-feedback', feedback);

      if (result.leaderboard) {
        broadcastLeaderboard(io, roomId, result.leaderboard);
      }

      return feedback;
    }),
  );
};
