// Registers realtime room join and leave events, then broadcasts room membership changes.
import { socketController } from '../controllers/socketController.js';
import { roomChannel, withSocketAcknowledgement } from './socketHelpers.js';

export const registerRoomHandlers = (io, socket, controller = socketController) => {
  socket.on(
    'join-room',
    withSocketAcknowledgement(socket, async ({ roomCode }) => {
      const playerId = socket.data.playerId;
      const room = await controller.joinRoom({ roomCode, playerId });
      const channel = roomChannel(room._id);

      await socket.join(channel);
      io.to(channel).emit('player-joined', {
        roomId: room._id,
        playerId,
      });

      if (room.status === 'in_progress') {
        io.to(channel).emit('match-started', {
          roomId: room._id,
          room,
        });
      }

      return room;
    }),
  );

  socket.on(
    'leave-room',
    withSocketAcknowledgement(socket, async ({ roomId }) => {
      const playerId = socket.data.playerId;
      const room = await controller.leaveRoom({ roomId, playerId });
      const channel = roomChannel(roomId);

      await socket.leave(channel);
      io.to(channel).emit('player-left', {
        roomId,
        playerId,
        hostId: room.host,
      });

      return room;
    }),
  );
};
