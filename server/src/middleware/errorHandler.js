import mongoose from 'mongoose';
import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

/**
 * Global Express error handler.
 */
export function errorHandler(err, req, res, _next) {
  logger.error(err.message, { stack: err.stack, name: err.name });

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File too large (maximum 5MB)' : err.message;
    const body = { success: false, message };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(400).json(body);
  }

  if (err instanceof ApiError) {
    const body = { success: false, message: err.message };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(err.statusCode).json(body);
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.values(err.errors).map((e) => e.message);
    const body = {
      success: false,
      message: 'Validation failed',
      errors: fieldErrors,
    };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(400).json(body);
  }

  if (err instanceof mongoose.Error.CastError) {
    const body = { success: false, message: 'Resource not found' };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(400).json(body);
  }

  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    const body = { success: false, message: 'Unauthorized' };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(401).json(body);
  }

  if (err.code === 11000) {
    const body = { success: false, message: 'Duplicate field value' };
    if (process.env.NODE_ENV === 'development') body.stack = err.stack;
    return res.status(400).json(body);
  }

  const body = { success: false, message: 'Something went wrong' };
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;
  return res.status(500).json(body);
}
