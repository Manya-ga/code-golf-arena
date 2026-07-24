// Defines REST endpoints for active problem discovery.
import { Router } from 'express';

import { problemController } from '../controllers/problemController.js';

export const problemRouter = Router();

problemRouter.get('/', problemController.list);
problemRouter.get('/:problemId', problemController.getById);
