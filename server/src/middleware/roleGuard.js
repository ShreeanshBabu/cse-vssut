import { ApiError } from '../utils/apiError.js';

/**
 * Restrict route to users with allowed roles.
 * @param {...string} allowedRoles
 */
export function roleGuard(...allowedRoles) {
  return function guard(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new ApiError(403, 'Access denied'));
      return;
    }
    next();
  };
}
