// Defines REST endpoints for room leaderboard queries.
import { Router } from 'express';

import { leaderboardController } from '../controllers/leaderboardController.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/rooms/:roomId', leaderboardController.getByRoom);
