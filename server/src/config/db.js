import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { validateCriticalEnv } from './validateEnv.js';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

let isConnected = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Connect to MongoDB with retry logic and connection event handlers.
 */
export async function connectDB() {
  if (isConnected) {
    logger.info('Using existing MongoDB connection');
    return;
  }

  validateCriticalEnv();
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    logger.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  // ── Connection lifecycle events ──────────────────────────────────────
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected — the driver will attempt to reconnect automatically');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { message: err.message });
  });

  // ── Graceful shutdown ────────────────────────────────────────────────
  const gracefulClose = async (signal) => {
    logger.info(`Received ${signal} — closing MongoDB connection`);
    try {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed gracefully');
    } catch (err) {
      logger.error('Error closing MongoDB connection', { message: err.message });
    }
    process.exit(0);
  };
  process.on('SIGINT', () => gracefulClose('SIGINT'));
  process.on('SIGTERM', () => gracefulClose('SIGTERM'));

  // ── Retry logic ──────────────────────────────────────────────────────
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      logger.info('MongoDB connected');
      isConnected = true;
      return;
    } catch (err) {
      lastError = err;
      logger.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await delay(RETRY_DELAY_MS);
      }
    }
  }

  logger.error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);

  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }

  logger.warn(
    'Continuing without MongoDB in development — CMS and DB-backed features are limited; chatbot uses static faculty data.'
  );
}
