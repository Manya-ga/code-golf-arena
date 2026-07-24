// Translates leaderboard HTTP requests into leaderboard-service calls and responses.
import { leaderboardService } from '../services/leaderboardService.js';
import { sendSuccess } from '../utils/response.js';

export const leaderboardController = {
  getByRoom: async (request, response, next) => {
    try {
      const leaderboard = await leaderboardService.getRoomLeaderboard(request.params.roomId);
      return sendSuccess(response, { data: leaderboard });
    } catch (error) {
      return next(error);
    }
  },
};
