// Provides CRUD-only persistence operations for Submission documents.
import { Submission } from '../models/Submission.js';

export const submissionRepository = {
  create: async (submissionData) => Submission.create(submissionData),

  findById: async (submissionId) => Submission.findById(submissionId),

  findPendingFeedback: async () =>
    Submission.find({ feedbackStatus: 'pending' }).sort({ createdAt: 1 }).limit(25),

  findByRoom: async (roomId) => Submission.find({ room: roomId }).sort({ createdAt: -1 }),

  findAcceptedByRoom: async (roomId) =>
    Submission.find({ room: roomId, judgeStatus: 'accepted' }).sort({ codeLength: 1, createdAt: 1 }),

  updateById: async (submissionId, updates) =>
    Submission.findByIdAndUpdate(submissionId, updates, {
      new: true,
      runValidators: true,
    }),
};
