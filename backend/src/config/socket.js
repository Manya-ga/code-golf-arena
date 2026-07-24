// Creates the Socket.IO server with the frontend origin allowed by CORS.
import { Server } from 'socket.io';

import { env } from './env.js';
import { verifyPlayerToken } from '../utils/token.js';

export const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    const claims = verifyPlayerToken(socket.handshake.auth?.token);
    if (!claims) return next(new Error('A valid player session is required.'));
    socket.data.playerId = claims.sub;
    return next();
  });

  return io;
};
