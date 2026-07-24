// Translates problem HTTP requests into problem-service calls and responses.
import { problemService } from '../services/problemService.js';
import { sendSuccess } from '../utils/response.js';

export const problemController = {
  list: async (request, response, next) => {
    try {
      const problems = await problemService.listActiveProblems();
      return sendSuccess(response, { data: problems });
    } catch (error) {
      return next(error);
    }
  },

  getById: async (request, response, next) => {
    try {
      const problem = await problemService.getProblem(request.params.problemId);
      return sendSuccess(response, { data: problem });
    } catch (error) {
      return next(error);
    }
  },
};
