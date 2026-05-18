import { Router } from 'express';
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateAnnouncement, handleValidationErrors } from '../middleware/validate.js';

const router = Router();

router.use(auth, roleGuard('admin'));

router.get('/', asyncHandler(getAllAnnouncements));
router.get('/:id', asyncHandler(getAnnouncementById));
router.post(
  '/',
  validateAnnouncement,
  handleValidationErrors,
  asyncHandler(createAnnouncement)
);
router.put(
  '/:id',
  validateAnnouncement,
  handleValidationErrors,
  asyncHandler(updateAnnouncement)
);
router.delete('/:id', asyncHandler(deleteAnnouncement));

export default router;
