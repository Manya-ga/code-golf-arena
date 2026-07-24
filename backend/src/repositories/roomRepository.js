// Provides CRUD-only persistence operations for Room documents.
import { Room } from '../models/Room.js';

export const roomRepository = {
  create: async (roomData) => Room.create(roomData),

  findById: async (roomId) => Room.findById(roomId),

  findByCode: async (roomCode) => Room.findOne({ code: roomCode }),

  addPlayerIfJoinable: async (roomId, playerId) =>
    Room.findOneAndUpdate(
      {
        _id: roomId,
        status: 'waiting',
        'players.player': { $ne: playerId },
        $expr: { $lt: [{ $size: '$players' }, '$maxPlayers'] },
      },
      { $push: { players: { player: playerId } } },
      { new: true },
    ),

  updateById: async (roomId, updates) =>
    Room.findByIdAndUpdate(roomId, updates, {
      new: true,
      runValidators: true,
    }),
};
