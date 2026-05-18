import Notice from '../models/Notice.js';
import { ApiError } from '../utils/apiError.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { logActivity } from '../utils/logActivity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Paginated list of all notices (admin), newest first.
 */
export const getAllNotices = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notice.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name'),
    Notice.countDocuments(),
  ]);
  res.status(200).json(
    apiSuccess({
      notices: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  );
});

/**
 * Published notices for public site, paginated.
 */
export const getPublishedNotices = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const filter = { status: 'published' };
  const [items, total] = await Promise.all([
    Notice.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name'),
    Notice.countDocuments(filter),
  ]);
  res.status(200).json(
    apiSuccess({
      notices: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    })
  );
});

/**
 * Single notice by ID.
 */
export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate('createdBy', 'name');
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
  res.status(200).json(apiSuccess({ notice }));
});

/**
 * Create a notice and log activity.
 */
export const createNotice = asyncHandler(async (req, res) => {
  const { title, body, priority, status } = req.body;
  const notice = await Notice.create({
    title, body, priority, status,
    createdBy: req.user._id,
  });
  await logActivity({
    action: 'CREATE',
    resource: 'notice',
    description: `Created notice "${notice.title}"`,
    performedBy: req.user._id,
    metadata: { noticeId: notice._id.toString() },
  });
  const populated = await Notice.findById(notice._id).populate('createdBy', 'name');
  res.status(201).json(apiSuccess({ notice: populated }));
});

/**
 * Update a notice by ID and log activity.
 */
export const updateNotice = asyncHandler(async (req, res) => {
  const { title, body, priority, status } = req.body;
  const notice = await Notice.findByIdAndUpdate(req.params.id, { title, body, priority, status }, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name');
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
  await logActivity({
    action: 'UPDATE',
    resource: 'notice',
    description: `Updated notice "${notice.title}"`,
    performedBy: req.user._id,
    metadata: { noticeId: notice._id.toString() },
  });
  res.status(200).json(apiSuccess({ notice }));
});

/**
 * Delete a notice by ID and log activity.
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    throw new ApiError(404, 'Notice not found');
  }
  await logActivity({
    action: 'DELETE',
    resource: 'notice',
    description: `Deleted notice "${notice.title}"`,
    performedBy: req.user._id,
    metadata: { noticeId: notice._id.toString() },
  });
  await Notice.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
