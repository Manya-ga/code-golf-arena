// Translates submission HTTP requests into submission-service calls and responses.
import { submissionService } from '../services/submissionService.js';
import { sendSuccess } from '../utils/response.js';

export const submissionController = {
  getById: async (request, response, next) => {
    try {
      const submission = await submissionService.getSubmission({
        submissionId: request.params.submissionId,
        playerId: request.playerId,
      });
      return sendSuccess(response, { data: submission });
    } catch (error) {
      return next(error);
    }
  },

  create: async (request, response, next) => {
    try {
      const result = await submissionService.submitCode({ ...request.body, playerId: request.playerId });
      return sendSuccess(response, { statusCode: 201, data: result });
    } catch (error) {
      return next(error);
    }
  },
};
