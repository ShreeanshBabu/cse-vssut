import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import User from './src/models/User.js';
import { logger } from './src/utils/logger.js';

async function seed() {
  await connectDB();
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    logger.info('Admin user already exists — seed skipped');
  } else {
    const email = process.env.ADMIN_EMAIL || 'admin@csevssut.ac.in';
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 12) {
      logger.error(
        'Set ADMIN_PASSWORD in .env (min 12 characters) before running seed. Example: node -e "console.log(require(\'crypto\').randomBytes(24).toString(\'hex\'))"'
      );
      process.exit(1);
    }
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email,
      password,
      role: 'admin',
    });
    logger.info(`Admin created — email: ${email} (password from ADMIN_PASSWORD env var only)`);
  }
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  logger.error('Seed failed', { message: err.message, stack: err.stack });
  process.exit(1);
});
