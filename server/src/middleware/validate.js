import { body, validationResult } from 'express-validator';

export const validateNotice = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('priority')
    .optional()
    .isIn(['urgent', 'normal', 'low'])
    .withMessage('Priority must be urgent, normal, or low'),
  body('status')
    .optional()
    .isIn(['published', 'draft'])
    .withMessage('Status must be published or draft'),
];

export const validateFaculty = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString(),
  body('researchAreas')
    .optional({ checkFalsy: true })
    .custom((val) => {
      if (val === undefined || val === null) return true;
      if (Array.isArray(val)) return true;
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed);
        } catch {
          return false;
        }
      }
      return false;
    })
    .withMessage('researchAreas must be an array or JSON array string'),
  body('bio').optional().isString(),
  body('googleScholarUrl').optional().isString(),
  body('displayOrder').optional().isNumeric(),
];

export const validateAnnouncement = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('endDate').custom((endVal, { req }) => {
    const start = new Date(req.body.startDate);
    const end = new Date(endVal);
    if (end <= start) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
  body('isActive').optional().isBoolean(),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters'),
];

/**
 * Send 400 with validation errors if express-validator found issues.
 */
export function handleValidationErrors(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, errors: result.array() });
  }
  next();
}
