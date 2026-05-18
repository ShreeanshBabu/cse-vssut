import { Router } from 'express';
import { getPublishedNotices } from '../controllers/noticeController.js';
import { getAllFaculty } from '../controllers/facultyController.js';
import { getActiveAnnouncements } from '../controllers/announcementController.js';
import { chatLimiter } from '../middleware/rateLimiter.js';
import chatRoutes from './chatRoutes.js';

const router = Router();

router.get('/notices', getPublishedNotices);
router.get('/faculty', getAllFaculty);
router.get('/announcements', getActiveAnnouncements);
router.use('/chat', chatLimiter, chatRoutes);

export default router;
