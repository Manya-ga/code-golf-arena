// Provides problem read use cases while keeping controllers independent from repositories.
import { problemRepository } from '../repositories/problemRepository.js';

const createNotFoundError = () => {
  const error = new Error('Problem not found.');
  error.statusCode = 404;
  return error;
};

export const createProblemService = ({ problems = problemRepository } = {}) => ({
  listActiveProblems: async () => problems.findActive(),

  getProblem: async (problemId) => {
    const problem = await problems.findById(problemId);

    if (!problem || !problem.isActive) {
      throw createNotFoundError();
    }

    return problem;
  },
});

export const problemService = createProblemService();
