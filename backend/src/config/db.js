import mongoose from 'mongoose';

import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDatabase = async () => {
  const connection = await mongoose.connect(env.mongodbUri);
  return connection.connection.host;
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
};
