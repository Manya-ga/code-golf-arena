// Configures and exports the Express application without starting its server.
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { leaderboardRouter } from './routes/leaderboardRoutes.js';
import { playerRouter } from './routes/playerRoutes.js';
import { problemRouter } from './routes/problemRoutes.js';
import { roomRouter } from './routes/roomRoutes.js';
import { submissionRouter } from './routes/submissionRoutes.js';

const frontendSourceDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend');
const frontendBuildDirectory = path.join(frontendSourceDirectory, 'dist');
const frontendDirectory = existsSync(frontendBuildDirectory) ? frontendBuildDirectory : frontendSourceDirectory;

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (request, response) => {
    void request;
    response.status(200).json({
      success: true,
      message: 'Code Golf Arena backend is running.',
    });
  });

  app.use('/api/rooms', roomRouter);
  app.use('/api/submissions', submissionRouter);
  app.use('/api/problems', problemRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/api/players', playerRouter);
  app.use(express.static(frontendDirectory));

  // Lets client-side routes refresh correctly while API routes remain explicit above.
  app.get('/{*splat}', (request, response, next) => {
    if (!request.accepts('html')) return next();
    return response.sendFile(path.join(frontendDirectory, 'index.html'));
  });

  app.use((request, response) => {
    response.status(404).json({
      success: false,
      message: `Route not found: ${request.method} ${request.originalUrl}`,
    });
  });

  app.use(errorHandler);

  return app;
};
