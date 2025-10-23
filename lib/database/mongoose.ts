import mongoose, { Mongoose } from 'mongoose';
import logger from '@/lib/logger';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    logger.info('MongoDB: Using cached connection');
    return cached.conn;
  }

  if (!MONGODB_URL) throw new Error('Missing MongoDB URL');

  logger.info('MongoDB: Connecting...');
  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
    dbName: 'webtools',
    bufferCommands: false,
  });

  try {
    cached.conn = await cached.promise;
    logger.info('MongoDB: Connected successfully');
    return cached.conn;
  } catch (err) {
    logger.error('MongoDB: Connection failed: %o', err);
    throw err;
  }
};
