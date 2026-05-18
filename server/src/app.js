import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { corsOptions } from './config/corsOptions.js';
import { ApiError } from './utils/apiError.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));

// Security: Prevent NoSQL Injection by stripping $ prefixed keys
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith('$')) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
});

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/public', publicRoutes);

// Health check — useful for debugging connectivity
const DB_STATES = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(dbState === 1 ? 200 : 503).json({
    success: dbState === 1,
    server: 'ok',
    database: DB_STATES[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

export default app;
