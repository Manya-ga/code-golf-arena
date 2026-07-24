// Coordinates anonymous player onboarding while keeping controllers independent from persistence.
import { playerRepository } from '../repositories/playerRepository.js';

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeDisplayName = (displayName) => {
  if (typeof displayName !== 'string') {
    throw createError('Display name must be a string.', 400);
  }

  const normalized = displayName.trim();

  if (normalized.length < 2 || normalized.length > 30) {
    throw createError('Display name must be between 2 and 30 characters.', 400);
  }

  return normalized;
};

export const createPlayerService = ({ players = playerRepository } = {}) => ({
  createPlayer: async ({ displayName } = {}) => {
    const normalizedDisplayName = normalizeDisplayName(displayName);
    const existingPlayer = await players.findByDisplayName(normalizedDisplayName);

    if (existingPlayer) {
      throw createError('That display name is already in use.', 409);
    }

    return players.create({ displayName: normalizedDisplayName });
  },

  getPlayer: async (playerId) => {
    const player = await players.findById(playerId);

    if (!player) {
      throw createError('Player not found.', 404);
    }

    return player;
  },
});

export const playerService = createPlayerService();
