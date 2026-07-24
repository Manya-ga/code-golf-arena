// Defines REST endpoints for code submission operations.
import { Router } from 'express';

import { submissionController } from '../controllers/submissionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const submissionRouter = Router();

submissionRouter.post(
  '/',
  authenticate,
  validateRequest((body = {}) => {
    if (typeof body.roomId !== 'string' || !body.roomId) throw new Error('roomId is required.');
    if (typeof body.sourceCode !== 'string' || !body.sourceCode.trim()) throw new Error('sourceCode is required.');
  }),
  submissionController.create,
);
submissionRouter.get('/:submissionId', authenticate, submissionController.getById);
