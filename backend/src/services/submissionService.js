// Orchestrates one code submission without exposing HTTP, Socket.IO, or AI concerns.
import { executeCode, getLanguages } from './judge0.js';
import { leaderboardService } from './leaderboardService.js';
import { problemRepository } from '../repositories/problemRepository.js';
import { roomRepository } from '../repositories/roomRepository.js';
import { submissionRepository } from '../repositories/submissionRepository.js';
import { calculateCodeLength } from '../utils/codeLength.js';
import { aiFeedbackService } from './aiFeedbackService.js';
import { enqueueAiFeedback } from '../workers/aiWorker.js';

const ACCEPTED_STATUS_ID = 3;

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getId = (value) => (value?._id ?? value).toString();

const resolveJudge0LanguageId = (languages, requestedLanguage) => {
  const normalizedLanguage = requestedLanguage.trim().toLowerCase();
  const exactMatch = languages.find((language) => language.name.trim().toLowerCase() === normalizedLanguage);
  const prefixMatch = languages.find((language) =>
    language.name.trim().toLowerCase().startsWith(`${normalizedLanguage} (`),
  );

  const language = exactMatch ?? prefixMatch;

  if (!language) {
    throw createError(`The selected language is not available in Judge0: ${requestedLanguage}.`, 400);
  }

  return language.id;
};

const collectExecutionMetrics = (results) => ({
  executionTime: results.reduce((total, result) => total + (Number(result.time) || 0), 0),
  memoryUsed: Math.max(...results.map((result) => Number(result.memory) || 0)),
  compilerOutput: results.find((result) => result.compile_output)?.compile_output ?? null,
});

export const createSubmissionService = ({
  rooms = roomRepository,
  problems = problemRepository,
  submissions = submissionRepository,
  leaderboards = leaderboardService,
  judge0 = { executeCode, getLanguages },
  getCodeLength = calculateCodeLength,
} = {}) => ({
  getSubmission: async ({ submissionId, playerId }) => {
    const submission = await submissions.findById(submissionId);
    if (!submission) throw createError('Submission not found.', 404);
    if (getId(submission.player) !== getId(playerId)) {
      throw createError('You cannot view another player\'s submission.', 403);
    }
    return submission;
  },

  // Runs a room submission against every hidden test case and records the Judge0 outcome.
  submitCode: async ({ roomId, playerId, sourceCode }) => {
    if (typeof sourceCode !== 'string' || !sourceCode.trim()) {
      throw createError('Source code is required.', 400);
    }

    const room = await rooms.findById(roomId);

    if (!room) {
      throw createError('Room not found.', 404);
    }

    if (room.status !== 'in_progress') {
      throw createError('The room is not accepting submissions.', 409);
    }

    if (!room.problem) {
      throw createError('The room does not have a problem.', 409);
    }

    const isParticipant = room.players.some(({ player }) => getId(player) === getId(playerId));

    if (!isParticipant) {
      throw createError('Player is not a participant in this room.', 403);
    }

    const problem = await problems.findById(room.problem, { includeTestCases: true });

    if (!problem) {
      throw createError('Problem not found.', 404);
    }

    if (!problem.supportedLanguages.includes(room.language)) {
      throw createError('The room language is not supported by this problem.', 409);
    }

    const availableLanguages = await judge0.getLanguages();
    const languageId = resolveJudge0LanguageId(availableLanguages, room.language);
    const submission = await submissions.create({
      player: playerId,
      room: roomId,
      problem: problem._id,
      sourceCode,
      language: room.language,
      codeLength: getCodeLength(sourceCode),
      judgeStatus: 'pending',
      feedbackStatus: aiFeedbackService.isConfigured() ? 'pending' : 'disabled',
    });

    const results = [];

    try {
      for (const testCase of problem.testCases) {
        results.push(
          await judge0.executeCode({
            sourceCode,
            languageId,
            stdin: testCase.input,
            expectedOutput: testCase.expectedOutput,
          }),
        );
      }

    } catch (error) {
      await submissions.updateById(submission._id, {
        judgeStatus: 'error',
        compilerOutput: error.message,
      });

      throw error;
    }

    const isAccepted = results.every((result) => result.status?.id === ACCEPTED_STATUS_ID);
    const metrics = collectExecutionMetrics(results);
    const updatedSubmission = await submissions.updateById(submission._id, {
      judgeStatus: isAccepted ? 'accepted' : 'rejected',
      ...metrics,
    });

    enqueueAiFeedback();

    return {
      submission: updatedSubmission,
      results,
      leaderboard: isAccepted ? await leaderboards.getRoomLeaderboard(roomId) : null,
    };
  },
});

export const submissionService = createSubmissionService();
