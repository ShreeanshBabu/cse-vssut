import { logger } from '../utils/logger.js';

/** @param {string | undefined} s */
function stripOuterQuotes(s) {
  if (s == null) return '';
  let v = String(s).trim();
  if (v.length >= 2) {
    const q = v[0];
    if ((q === '"' || q === "'") && v[v.length - 1] === q) {
      v = v.slice(1, -1).trim();
    }
  }
  return v;
}

const NORMALIZE_KEYS = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRY',
  'JWT_REFRESH_EXPIRY',
  'CLIENT_URL',
  'HOD_NAME',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GEMINI_API_KEY',
  'GEMINI_MODEL',
];

/**
 * Normalize quoted/whitespace env values and fail fast on common .env mistakes.
 */
export function validateCriticalEnv() {
  for (const key of NORMALIZE_KEYS) {
    if (process.env[key] !== undefined) {
      process.env[key] = stripOuterQuotes(process.env[key]);
    }
  }

  const mongo = process.env.MONGODB_URI;
  if (!mongo) {
    logger.error(
      'MONGODB_URI is missing or empty. Add your MongoDB connection string to .env (e.g. MongoDB Atlas: mongodb+srv://...).'
    );
    process.exit(1);
  }
  if (/[\r\n]/.test(mongo)) {
    logger.error('MONGODB_URI must be a single line with no line breaks inside the value.');
    process.exit(1);
  }

  for (const key of ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']) {
    const v = process.env[key];
    if (!v || v.length < 32) {
      logger.error(
        `${key} must be set and at least 32 characters. Generate one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
      );
      process.exit(1);
    }
    if (/[\r\n]/.test(v)) {
      logger.error(
        `${key} contains a line break. In .env, keep the entire secret on ONE line with matching opening and closing quotes.`
      );
      process.exit(1);
    }
  }
}
