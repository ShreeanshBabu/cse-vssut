import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.use(auth, roleGuard('admin'));

router.get('/', asyncHandler(getActivityLogs));

export default router;
