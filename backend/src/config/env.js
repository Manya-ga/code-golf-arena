// Loads and validates required runtime configuration before the application starts.
import 'dotenv/config';

const getRequiredVariable = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getPort = () => {
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
};

const getPositiveInteger = (name, fallback) => {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
};

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: getPort(),
  mongoUri: getRequiredVariable('MONGODB_URI'),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  jwtSecret: getRequiredVariable('JWT_SECRET'),
  sessionTtlMs: getPositiveInteger('SESSION_TTL_MS', 7 * 24 * 60 * 60 * 1000),
  judge0BaseUrl: getRequiredVariable('JUDGE0_BASE_URL').replace(/\/$/, ''),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || null,
});
