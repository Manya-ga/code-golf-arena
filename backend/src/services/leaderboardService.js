// Builds Golf Mode leaderboard views from repository data without Socket.IO concerns.
import { playerRepository } from '../repositories/playerRepository.js';
import { roomRepository } from '../repositories/roomRepository.js';
import { submissionRepository } from '../repositories/submissionRepository.js';

const getId = (value) => (value?._id ?? value).toString();

const createNotFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const selectBestSubmissionByPlayer = (submissions) => {
  const bestSubmissions = new Map();

  for (const submission of submissions) {
    const playerId = getId(submission.player);
    const currentBest = bestSubmissions.get(playerId);

    const isShorter = !currentBest || submission.codeLength < currentBest.codeLength;
    const isEarlierTie =
      currentBest &&
      submission.codeLength === currentBest.codeLength &&
      new Date(submission.createdAt) < new Date(currentBest.createdAt);

    if (isShorter || isEarlierTie) {
      bestSubmissions.set(playerId, submission);
    }
  }

  return bestSubmissions;
};

const assignRanks = (entries) => {
  let previousScore = null;
  let currentRank = 0;

  return entries.map((entry, index) => {
    if (entry.codeLength === null) {
      return { ...entry, rank: null };
    }

    if (entry.codeLength !== previousScore) {
      currentRank = index + 1;
      previousScore = entry.codeLength;
    }

    return { ...entry, rank: currentRank };
  });
};

export const createLeaderboardService = ({
  players = playerRepository,
  rooms = roomRepository,
  submissions = submissionRepository,
} = {}) => ({
  // Returns ranked participants for one room using only their shortest accepted submission.
  getRoomLeaderboard: async (roomId) => {
    const room = await rooms.findById(roomId);

    if (!room) {
      throw createNotFoundError('Room not found.');
    }

    const acceptedSubmissions = await submissions.findAcceptedByRoom(roomId);
    const bestSubmissions = selectBestSubmissionByPlayer(acceptedSubmissions);

    const entries = await Promise.all(
      room.players.map(async ({ player }) => {
        const playerId = getId(player);
        const playerDocument = await players.findById(playerId);
        const bestSubmission = bestSubmissions.get(playerId);

        return {
          playerId,
          displayName: playerDocument?.displayName ?? 'Unknown player',
          codeLength: bestSubmission?.codeLength ?? null,
          submittedAt: bestSubmission?.createdAt ?? null,
        };
      }),
    );

    const orderedEntries = entries.sort((left, right) => {
      if (left.codeLength === null && right.codeLength === null) return 0;
      if (left.codeLength === null) return 1;
      if (right.codeLength === null) return -1;

      return left.codeLength - right.codeLength || new Date(left.submittedAt) - new Date(right.submittedAt);
    });

    return assignRanks(orderedEntries);
  },
});

export const leaderboardService = createLeaderboardService();
