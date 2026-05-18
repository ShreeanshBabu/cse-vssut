import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.post(
  '/register',
  auth,
  roleGuard('admin'),
  validateRegister,
  handleValidationErrors,
  asyncHandler(register)
);
router.post(
  '/login',
  loginLimiter,
  validateLogin,
  handleValidationErrors,
  asyncHandler(login)
);
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));

export default router;
