// Provides CRUD-only persistence operations for Player documents.
import { Player } from '../models/Player.js';

export const playerRepository = {
  create: async (playerData) => Player.create(playerData),

  findById: async (playerId) => Player.findById(playerId),

  findByDisplayName: async (displayName) => Player.findOne({ displayName }),

  updateById: async (playerId, updates) =>
    Player.findByIdAndUpdate(playerId, updates, {
      new: true,
      runValidators: true,
    }),
};
