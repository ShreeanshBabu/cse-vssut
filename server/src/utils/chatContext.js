import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Notice from '../models/Notice.js';
import Faculty from '../models/Faculty.js';
import Announcement from '../models/Announcement.js';
import { logger } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadStaticFaculty() {
  try {
    const raw = readFileSync(join(__dirname, '../../../data/vssut-cse-faculty.json'), 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('Could not load static faculty JSON for chat', { message: err.message });
    return [];
  }
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

/**
 * Load notices, faculty, announcements for chat — never throws; uses static faculty if DB is down.
 */
export async function loadChatContext() {
  const now = new Date();
  let faculty = [];
  let notices = [];
  let announcements = [];

  if (isDbReady()) {
    try {
      [notices, faculty, announcements] = await Promise.all([
        Notice.find({ status: 'published' }).sort({ createdAt: -1 }).limit(25).lean(),
        Faculty.find().sort({ displayOrder: 1 }).lean(),
        Announcement.find({
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
        })
          .sort({ startDate: -1 })
          .lean(),
      ]);
    } catch (err) {
      logger.warn('Chat context DB read failed, using fallbacks', { message: err.message });
    }
  } else {
    logger.warn('MongoDB not connected — chat using static faculty data');
  }

  if (!faculty?.length) {
    faculty = loadStaticFaculty();
  }

  return { faculty, notices: notices ?? [], announcements: announcements ?? [], now };
}
