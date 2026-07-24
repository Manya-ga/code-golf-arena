// In-process background queue for asynchronous Claude feedback generation.
import { submissionRepository } from '../repositories/submissionRepository.js';
import { aiFeedbackService } from '../services/aiFeedbackService.js';

let isRunning = false;

const processSubmission = async (submission) => {
  try {
    const feedback = await aiFeedbackService.generate(submission);
    await submissionRepository.updateById(submission._id, {
      feedbackStatus: 'completed',
      aiFeedback: feedback,
      feedbackError: null,
    });
  } catch (error) {
    await submissionRepository.updateById(submission._id, {
      feedbackStatus: 'error',
      feedbackError: error.message,
    });
  }
};

export const runAiWorker = async () => {
  if (isRunning || !aiFeedbackService.isConfigured()) return;
  isRunning = true;

  try {
    const pending = await submissionRepository.findPendingFeedback();
    for (const submission of pending) await processSubmission(submission);
  } finally {
    isRunning = false;
  }
};

export const enqueueAiFeedback = () => {
  if (aiFeedbackService.isConfigured()) queueMicrotask(() => void runAiWorker());
};
