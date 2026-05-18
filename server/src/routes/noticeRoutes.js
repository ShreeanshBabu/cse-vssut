import { Router } from 'express';
import {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateNotice, handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.use(auth, roleGuard('admin'));

router.get('/', asyncHandler(getAllNotices));
router.get('/:id', asyncHandler(getNoticeById));
router.post('/', validateNotice, handleValidationErrors, asyncHandler(createNotice));
router.put('/:id', validateNotice, handleValidationErrors, asyncHandler(updateNotice));
router.delete('/:id', asyncHandler(deleteNotice));

export default router;
