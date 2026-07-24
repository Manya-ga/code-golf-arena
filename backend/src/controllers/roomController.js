// Translates room HTTP requests into room-service calls and standard API responses.
import { roomService } from '../services/roomService.js';
import { sendSuccess } from '../utils/response.js';

const emitRoomEvent = (request, eventName, room) => {
  request.app.get('io')?.to(`room:${room._id}`).emit(eventName, {
    roomId: room._id,
    room,
  });
};

const emitPlayerEvent = (request, eventName, room, playerId) => {
  request.app.get('io')?.to(`room:${room._id}`).emit(eventName, {
    roomId: room._id,
    playerId,
    hostId: room.host,
    room,
  });
};

export const roomController = {
  getById: async (request, response, next) => {
    try {
      const room = await roomService.getRoom(request.params.roomId);
      return sendSuccess(response, { data: room });
    } catch (error) {
      return next(error);
    }
  },

  create: async (request, response, next) => {
    try {
      const room = await roomService.createRoom({ ...request.body, hostId: request.playerId });
      return sendSuccess(response, { statusCode: 201, data: room });
    } catch (error) {
      return next(error);
    }
  },

  join: async (request, response, next) => {
    try {
      const room = await roomService.joinRoom({
        roomCode: request.params.roomCode,
        playerId: request.playerId,
      });
      emitPlayerEvent(request, 'player-joined', room, request.playerId);
      if (room.status === 'in_progress') {
        emitRoomEvent(request, 'match-started', room);
      }
      return sendSuccess(response, { data: room });
    } catch (error) {
      return next(error);
    }
  },

  leave: async (request, response, next) => {
    try {
      const room = await roomService.leaveRoom({
        roomId: request.params.roomId,
        playerId: request.playerId,
      });
      emitPlayerEvent(request, 'player-left', room, request.playerId);
      return sendSuccess(response, { data: room });
    } catch (error) {
      return next(error);
    }
  },

  start: async (request, response, next) => {
    try {
      const room = await roomService.startMatch({
        roomId: request.params.roomId,
        hostId: request.playerId,
      });
      emitRoomEvent(request, 'match-started', room);
      return sendSuccess(response, { data: room });
    } catch (error) {
      return next(error);
    }
  },

  end: async (request, response, next) => {
    try {
      const room = await roomService.endMatch({
        roomId: request.params.roomId,
        hostId: request.playerId,
      });
      emitRoomEvent(request, 'match-ended', room);
      return sendSuccess(response, { data: room });
    } catch (error) {
      return next(error);
    }
  },
};
