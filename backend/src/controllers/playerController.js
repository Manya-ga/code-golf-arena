// Translates player HTTP requests into player-service calls and standard API responses.
import { playerService } from '../services/playerService.js';
import { sendSuccess } from '../utils/response.js';
import { createPlayerToken } from '../utils/token.js';

export const playerController = {
  create: async (request, response, next) => {
    try {
      const player = await playerService.createPlayer(request.body);
      return sendSuccess(response, {
        statusCode: 201,
        data: { player, token: createPlayerToken(player._id) },
      });
    } catch (error) {
      return next(error);
    }
  },

  getById: async (request, response, next) => {
    try {
      const player = await playerService.getPlayer(request.params.playerId);
      return sendSuccess(response, { data: player });
    } catch (error) {
      return next(error);
    }
  },
};
