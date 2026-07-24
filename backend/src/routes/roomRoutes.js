// Defines REST endpoints for room lifecycle operations.
import { Router } from 'express';

import { roomController } from '../controllers/roomController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const roomRouter = Router();

const requireFields = (...fields) => (body = {}) => {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      throw new Error(`${field} is required.`);
    }
  }
};

roomRouter.post('/', authenticate, validateRequest(requireFields('problemId', 'language')), roomController.create);
roomRouter.post('/:roomCode/join', authenticate, roomController.join);
roomRouter.post('/:roomId/leave', authenticate, roomController.leave);
roomRouter.post('/:roomId/start', authenticate, roomController.start);
roomRouter.post('/:roomId/end', authenticate, roomController.end);
roomRouter.get('/:roomId', roomController.getById);
