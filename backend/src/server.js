// Boots MongoDB, Express, HTTP, and Socket.IO as one application process.
import http from 'node:http';

import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { configureSocket } from './config/socket.js';
import { registerSocketHandlers } from './socket/index.js';

export const startServer = async () => {
  await connectDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = configureSocket(httpServer);

  app.set('io', io);
  registerSocketHandlers(io);

  httpServer.listen(env.port, () => {
    console.info(`Server listening on port ${env.port}.`);
    console.info(`Open Code Golf Arena: http://localhost:${env.port}`);
  });

  return { app, httpServer, io };
};

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exitCode = 1;
});
