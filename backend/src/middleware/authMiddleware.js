// Validates a signed anonymous-player session and exposes its player ID to controllers.
import { verifyPlayerToken } from '../utils/token.js';

export const authenticate = (request, response, next) => {
  const [scheme, token] = (request.get('authorization') ?? '').split(' ');
  const claims = scheme === 'Bearer' ? verifyPlayerToken(token) : null;

  if (!claims) {
    return response.status(401).json({ success: false, message: 'A valid player session is required.' });
  }

  request.playerId = claims.sub;
  next();
};
