import ActivityLog from '../models/ActivityLog.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const ACTIONS = new Set(['CREATE', 'UPDATE', 'DELETE']);
const RESOURCES = new Set(['notice', 'faculty', 'announcement']);

/**
 * Paginated activity logs with optional filters.
 */
export const getActivityLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.action && ACTIONS.has(req.query.action)) {
    filter.action = req.query.action;
  }
  if (req.query.resource && RESOURCES.has(req.query.resource)) {
    filter.resource = req.query.resource;
  }
  const [items, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('performedBy', 'name'),
    ActivityLog.countDocuments(filter),
  ]);
  res.status(200).json(
    apiSuccess({
      logs: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  );
});
