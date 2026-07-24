// Creates and reuses one Mongoose connection for the application process.
import mongoose from 'mongoose';

import { env } from './env.js';

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.info('Connected to MongoDB.');

    return mongoose.connection;
  } catch (error) {
    console.error('Unable to connect to MongoDB.', error);
    throw error;
  }
};
