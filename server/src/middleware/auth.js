import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/tokenUtils.js';

/**
 * Verify JWT access token and attach user to req.user.
 */
export async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    next(new ApiError(401, 'Unauthorized'));
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    next(new ApiError(401, 'Unauthorized'));
    return;
  }
  try {
    const secret = process.env.JWT_ACCESS_SECRET?.trim();
    if (!secret) {
      next(new ApiError(500, 'JWT access secret is not configured'));
      return;
    }
    const decoded = verifyToken(token, secret);
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      next(new ApiError(401, 'Unauthorized'));
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
