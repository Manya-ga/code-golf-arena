// Defines REST endpoints for anonymous player onboarding and profile retrieval.
import { Router } from 'express';

import { playerController } from '../controllers/playerController.js';

export const playerRouter = Router();

playerRouter.post('/', playerController.create);
playerRouter.get('/:playerId', playerController.getById);
