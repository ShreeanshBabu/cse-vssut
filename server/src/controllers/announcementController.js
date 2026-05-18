import Announcement from '../models/Announcement.js';
import { ApiError } from '../utils/apiError.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { logActivity } from '../utils/logActivity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * All announcements sorted by start date descending.
 */
export const getAllAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ startDate: -1 })
    .populate('createdBy', 'name');
  res.status(200).json(apiSuccess({ announcements }));
});

/**
 * Announcements currently active by schedule and isActive flag.
 */
export const getActiveAnnouncements = asyncHandler(async (req, res) => {
  const now = new Date();
  const announcements = await Announcement.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  })
    .sort({ startDate: -1 })
    .populate('createdBy', 'name');
  res.status(200).json(apiSuccess({ announcements }));
});

/**
 * Single announcement by ID.
 */
export const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'name');
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }
  res.status(200).json(apiSuccess({ announcement }));
});

/**
 * Create a scheduled announcement.
 */
export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    ...req.body,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    createdBy: req.user._id,
  });
  await logActivity({
    action: 'CREATE',
    resource: 'announcement',
    description: `Created announcement "${announcement.title}"`,
    performedBy: req.user._id,
    metadata: { announcementId: announcement._id.toString() },
  });
  const populated = await Announcement.findById(announcement._id).populate('createdBy', 'name');
  res.status(201).json(apiSuccess({ announcement: populated }));
});

/**
 * Update an announcement.
 */
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (req.body.startDate) update.startDate = new Date(req.body.startDate);
  if (req.body.endDate) update.endDate = new Date(req.body.endDate);
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name');
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }
  await logActivity({
    action: 'UPDATE',
    resource: 'announcement',
    description: `Updated announcement "${announcement.title}"`,
    performedBy: req.user._id,
    metadata: { announcementId: announcement._id.toString() },
  });
  res.status(200).json(apiSuccess({ announcement }));
});

/**
 * Delete an announcement.
 */
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }
  await logActivity({
    action: 'DELETE',
    resource: 'announcement',
    description: `Deleted announcement "${announcement.title}"`,
    performedBy: req.user._id,
    metadata: { announcementId: announcement._id.toString() },
  });
  await Announcement.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
