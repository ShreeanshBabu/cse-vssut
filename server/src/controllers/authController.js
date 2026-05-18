import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/tokenUtils.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

function userPublicFields(user) {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/**
 * Register a new admin user (no tokens returned).
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(400, 'User already exists with this email');
  }
  await User.create({ name, email, password, role: 'admin' });
  logger.info('User registered', { email });
  res.status(201).json(apiSuccess(null, 'Registration successful'));
});

/**
 * Authenticate user, set refresh cookie, return access token and user profile.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const match = await user.comparePassword(password);
  if (!match) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  const refreshToken = generateRefreshToken(user._id.toString());
  res.cookie('refreshToken', refreshToken, cookieOptions);
  res.status(200).json(
    apiSuccess({
      accessToken,
      user: userPublicFields(user),
    })
  );
});

/**
 * Issue a new access token using httpOnly refresh cookie.
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw new ApiError(401, 'No refresh token');
  }
  const secret = process.env.JWT_REFRESH_SECRET?.trim();
  if (!secret) {
    throw new ApiError(500, 'JWT refresh secret is not configured');
  }
  const decoded = verifyToken(token, secret);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const accessToken = generateAccessToken(user._id.toString(), user.role);
  res.status(200).json(apiSuccess({ accessToken }));
});

/**
 * Clear refresh token cookie.
 */
export const logout = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', '', {
    ...cookieOptions,
    maxAge: 0,
  });
  res.status(200).json(apiSuccess(null, 'Logged out successfully'));
});
