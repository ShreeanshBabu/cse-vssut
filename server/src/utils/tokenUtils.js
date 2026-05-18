import jwt from 'jsonwebtoken';
import { ApiError } from './apiError.js';

/**
 * @param {string} userId
 * @param {string} role
 * @returns {string}
 */
export function generateAccessToken(userId, role) {
  const secret = process.env.JWT_ACCESS_SECRET?.trim();
  if (!secret) {
    throw new ApiError(500, 'JWT access secret is not configured');
  }
  const expiresIn = process.env.JWT_ACCESS_EXPIRY || '15m';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
}

/**
 * @param {string} userId
 * @returns {string}
 */
export function generateRefreshToken(userId) {
  const secret = process.env.JWT_REFRESH_SECRET?.trim();
  if (!secret) {
    throw new ApiError(500, 'JWT refresh secret is not configured');
  }
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
  return jwt.sign({ id: userId }, secret, { expiresIn });
}

/**
 * @param {string} token
 * @param {string} secret
 * @returns {import('jsonwebtoken').JwtPayload}
 */
export function verifyToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      throw new ApiError(401, 'Invalid token');
    }
    return decoded;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid token');
    }
    throw new ApiError(401, 'Invalid token');
  }
}
