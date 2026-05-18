import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import app from './src/app.js';
import { logger } from './src/utils/logger.js';
import { ensureFacultySeed } from './src/utils/ensureFacultySeed.js';

const PORT = Number(process.env.PORT) || 5000;

const serverlessApp = async (req, res) => {
  await connectDB();
  return app(req, res);
};

connectDB()
  .then(() => ensureFacultySeed())
  .catch((err) => {
    logger.error('Failed to connect to database', { message: err.message });
  });

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
  });
}

export default serverlessApp;

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason });
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { message: err.message, stack: err.stack });
  process.exit(1);
});
