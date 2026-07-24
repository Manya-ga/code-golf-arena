// Coordinates room lifecycle rules while repositories perform all database access.
import { randomBytes } from 'node:crypto';

import { playerRepository } from '../repositories/playerRepository.js';
import { problemRepository } from '../repositories/problemRepository.js';
import { roomRepository } from '../repositories/roomRepository.js';

const MAX_CREATE_ATTEMPTS = 5;

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getId = (value) => (value?._id ?? value).toString();
const createRoomCode = () => randomBytes(4).toString('hex').toUpperCase();

const normalizeLanguage = (language) => {
  if (typeof language !== 'string' || !language.trim()) {
    throw createError('A room language is required.', 400);
  }

  return language.trim().toLowerCase();
};

export const createRoomService = ({
  players = playerRepository,
  problems = problemRepository,
  rooms = roomRepository,
  generateRoomCode = createRoomCode,
} = {}) => ({
  getRoom: async (roomId) => {
    const room = await rooms.findById(roomId);
    if (!room) throw createError('Room not found.', 404);
    return room;
  },

  // Creates a waiting room with its host already included as the first participant.
  createRoom: async ({ hostId, problemId, language, maxPlayers }) => {
    const roomLanguage = normalizeLanguage(language);
    const [host, problem] = await Promise.all([
      players.findById(hostId),
      problems.findById(problemId),
    ]);

    if (!host) {
      throw createError('Host player not found.', 404);
    }

    if (!problem || !problem.isActive) {
      throw createError('Active problem not found.', 404);
    }

    if (!problem.supportedLanguages.includes(roomLanguage)) {
      throw createError('The selected language is not supported by this problem.', 400);
    }

    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt += 1) {
      try {
        return await rooms.create({
          code: generateRoomCode(),
          host: hostId,
          problem: problemId,
          language: roomLanguage,
          players: [{ player: hostId }],
          ...(maxPlayers === undefined ? {} : { maxPlayers }),
        });
      } catch (error) {
        if (error.code !== 11000 || attempt === MAX_CREATE_ATTEMPTS - 1) {
          throw error;
        }
      }
    }

    throw createError('Unable to generate a unique room code.', 503);
  },

  // Adds a player to a waiting room while protecting against duplicate or over-capacity joins.
  joinRoom: async ({ roomCode, playerId }) => {
    const [room, player] = await Promise.all([
      rooms.findByCode(roomCode),
      players.findById(playerId),
    ]);

    if (!room) {
      throw createError('Room not found.', 404);
    }

    if (!player) {
      throw createError('Player not found.', 404);
    }

    if (room.status !== 'waiting') {
      throw createError('This room has already started or ended.', 409);
    }

    if (room.players.some(({ player: roomPlayer }) => getId(roomPlayer) === getId(playerId))) {
      return room;
    }

    if (room.players.length >= room.maxPlayers) {
      throw createError('This room is full.', 409);
    }

    const updatedRoom = await rooms.addPlayerIfJoinable(room._id, playerId);

    if (!updatedRoom) {
      throw createError('The room changed before the player could join. Please try again.', 409);
    }

    // A room configured for an exact player count is ready immediately when it fills.
    if (updatedRoom.players.length === updatedRoom.maxPlayers) {
      return rooms.updateById(updatedRoom._id, {
        status: 'in_progress',
        startedAt: new Date(),
      });
    }

    return updatedRoom;
  },

  // Removes a participant and transfers host ownership to the next waiting participant if needed.
  leaveRoom: async ({ roomId, playerId }) => {
    const room = await rooms.findById(roomId);

    if (!room) {
      throw createError('Room not found.', 404);
    }

    if (room.status === 'finished') {
      throw createError('Cannot leave a finished room.', 409);
    }

    const remainingPlayers = room.players.filter(({ player }) => getId(player) !== getId(playerId));

    if (remainingPlayers.length === room.players.length) {
      throw createError('Player is not a participant in this room.', 403);
    }

    const isHost = getId(room.host) === getId(playerId);
    const updates = { players: remainingPlayers };

    if (isHost && remainingPlayers.length > 0) {
      updates.host = remainingPlayers[0].player;
    }

    if (remainingPlayers.length === 0) {
      updates.status = 'finished';
      updates.endedAt = new Date();
    }

    return rooms.updateById(roomId, updates);
  },

  // Starts a waiting room when requested by its host.
  startMatch: async ({ roomId, hostId }) => {
    const room = await rooms.findById(roomId);

    if (!room) {
      throw createError('Room not found.', 404);
    }

    if (getId(room.host) !== getId(hostId)) {
      throw createError('Only the room host can start the match.', 403);
    }

    if (room.status !== 'waiting') {
      throw createError('Only a waiting room can be started.', 409);
    }

    if (room.players.length < 2) {
      throw createError('At least two players are required to start a match.', 409);
    }

    return rooms.updateById(roomId, {
      status: 'in_progress',
      startedAt: new Date(),
    });
  },

  // Ends an in-progress room when requested by its host.
  endMatch: async ({ roomId, hostId }) => {
    const room = await rooms.findById(roomId);

    if (!room) {
      throw createError('Room not found.', 404);
    }

    if (getId(room.host) !== getId(hostId)) {
      throw createError('Only the room host can end the match.', 403);
    }

    if (room.status !== 'in_progress') {
      throw createError('Only an active room can be ended.', 409);
    }

    return rooms.updateById(roomId, {
      status: 'finished',
      endedAt: new Date(),
    });
  },
});

export const roomService = createRoomService();
