// Provides CRUD-only persistence operations for Problem documents.
import { Problem } from '../models/Problem.js';

export const problemRepository = {
  create: async (problemData) => Problem.create(problemData),

  findById: async (problemId, { includeTestCases = false } = {}) => {
    const query = Problem.findById(problemId);

    return includeTestCases ? query.select('+testCases') : query;
  },

  findActive: async () => Problem.find({ isActive: true }),

  updateById: async (problemId, updates) =>
    Problem.findByIdAndUpdate(problemId, updates, {
      new: true,
      runValidators: true,
    }),
};
