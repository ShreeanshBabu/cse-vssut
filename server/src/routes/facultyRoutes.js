import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '../controllers/facultyController.js';
import { auth } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateFaculty, handleValidationErrors } from '../middleware/validate.js';
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    const ext = path.extname(file.originalname).toLowerCase();
    const extOk = ['.jpeg', '.jpg', '.png', '.webp'].includes(ext);
    if (allowedTypes.has(file.mimetype) && extOk) {
      cb(null, true);
      return;
    }
    cb(new Error('Only jpeg, jpg, png, webp images are allowed'));
  },
});

/** Multer middleware: single file field `image` in memory. */
export const uploadFacultyImage = upload.single('image');

const router = Router();

router.use(auth, roleGuard('admin'));

router.get('/', asyncHandler(getAllFaculty));
router.get('/:id', asyncHandler(getFacultyById));
router.post(
  '/',
  uploadFacultyImage,
  validateFaculty,
  handleValidationErrors,
  asyncHandler(createFaculty)
);
router.put(
  '/:id',
  uploadFacultyImage,
  validateFaculty,
  handleValidationErrors,
  asyncHandler(updateFaculty)
);
router.delete('/:id', asyncHandler(deleteFaculty));

export default router;
