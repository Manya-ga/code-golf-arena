// Small signed-token utility for anonymous player sessions; avoids a JWT package dependency.
import { createHmac, timingSafeEqual } from 'node:crypto';

import { env } from '../config/env.js';

const encode = (value) => Buffer.from(value).toString('base64url');
const decode = (value) => Buffer.from(value, 'base64url').toString('utf8');
const sign = (value) => createHmac('sha256', env.jwtSecret).update(value).digest('base64url');

export const createPlayerToken = (playerId) => {
  const payload = encode(JSON.stringify({ sub: String(playerId), exp: Date.now() + env.sessionTtlMs }));
  return `${payload}.${sign(payload)}`;
};

export const verifyPlayerToken = (token) => {
  if (typeof token !== 'string') return null;
  const [payload, signature] = token.split('.');

  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const claims = JSON.parse(decode(payload));
    return typeof claims.sub === 'string' && Number.isFinite(claims.exp) && claims.exp > Date.now()
      ? claims
      : null;
  } catch {
    return null;
  }
};
