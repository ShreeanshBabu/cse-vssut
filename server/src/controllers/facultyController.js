import Faculty from '../models/Faculty.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { logActivity } from '../utils/logActivity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getLocalFaculty } from '../utils/mockData.js';

const FACULTY_CLOUD_FOLDER = 'cse/faculty';

/**
 * Derive Cloudinary public_id from a secure_url.
 * @param {string} url
 * @returns {string|null}
 */
function getPublicIdFromCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const withoutQuery = url.split('?')[0];
    const marker = '/upload/';
    const idx = withoutQuery.indexOf(marker);
    if (idx === -1) return null;
    const rest = withoutQuery.slice(idx + marker.length);
    const segments = rest.split('/');
    let i = 0;
    while (i < segments.length && !/^v\d+$/i.test(segments[i])) {
      i += 1;
    }
    if (i >= segments.length) return null;
    const pathAfterVersion = segments.slice(i + 1).join('/');
    if (!pathAfterVersion) return null;
    return pathAfterVersion.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

function parseFacultyBody(body) {
  const {
    name,
    designation,
    email,
    phone,
    bio,
    googleScholarUrl,
    displayOrder,
    researchAreas
  } = body;
  
  const data = {};
  if (name !== undefined) data.name = name;
  if (designation !== undefined) data.designation = designation;
  if (email !== undefined) data.email = email;
  if (phone !== undefined) data.phone = phone;
  if (bio !== undefined) data.bio = bio;
  if (googleScholarUrl !== undefined) data.googleScholarUrl = googleScholarUrl;
  if (displayOrder !== undefined) data.displayOrder = displayOrder;
  if (researchAreas !== undefined) data.researchAreas = researchAreas;

  if (typeof data.researchAreas === 'string') {
    try {
      data.researchAreas = JSON.parse(data.researchAreas);
    } catch {
      data.researchAreas = data.researchAreas.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  if (data.displayOrder !== undefined && data.displayOrder !== '') {
    data.displayOrder = Number(data.displayOrder);
  }
  return data;
}

/**
 * All faculty sorted by display order. Fallback to local data if DB is empty or offline.
 */
export const getAllFaculty = asyncHandler(async (req, res) => {
  let faculty = [];
  try {
    faculty = await Faculty.find().sort({ displayOrder: 1, createdAt: 1 });
  } catch (err) {
    // DB error, fallback to local
  }

  if (!faculty || faculty.length === 0) {
    faculty = getLocalFaculty();
  }
  
  res.status(200).json(apiSuccess({ faculty }));
});

/**
 * Single faculty member by ID.
 */
export const getFacultyById = asyncHandler(async (req, res) => {
  const member = await Faculty.findById(req.params.id);
  if (!member) {
    throw new ApiError(404, 'Faculty not found');
  }
  res.status(200).json(apiSuccess({ faculty: member }));
});

/**
 * Create faculty; optional image upload to Cloudinary.
 */
export const createFaculty = asyncHandler(async (req, res) => {
  const payload = parseFacultyBody(req.body);
  if (req.file?.buffer) {
    payload.imageUrl = await uploadImage(req.file.buffer, FACULTY_CLOUD_FOLDER);
  }
  const faculty = await Faculty.create(payload);
  await logActivity({
    action: 'CREATE',
    resource: 'faculty',
    description: `Created faculty "${faculty.name}"`,
    performedBy: req.user._id,
    metadata: { facultyId: faculty._id.toString() },
  });
  res.status(201).json(apiSuccess({ faculty }));
});

/**
 * Update faculty; replace image in Cloudinary when a new file is sent.
 */
export const updateFaculty = asyncHandler(async (req, res) => {
  const existing = await Faculty.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Faculty not found');
  }
  const payload = parseFacultyBody(req.body);
  if (req.file?.buffer) {
    const oldId = getPublicIdFromCloudinaryUrl(existing.imageUrl);
    if (oldId) {
      await deleteImage(oldId);
    }
    payload.imageUrl = await uploadImage(req.file.buffer, FACULTY_CLOUD_FOLDER);
  }
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  await logActivity({
    action: 'UPDATE',
    resource: 'faculty',
    description: `Updated faculty "${faculty.name}"`,
    performedBy: req.user._id,
    metadata: { facultyId: faculty._id.toString() },
  });
  res.status(200).json(apiSuccess({ faculty }));
});

/**
 * Delete faculty and remove Cloudinary asset when present.
 */
export const deleteFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) {
    throw new ApiError(404, 'Faculty not found');
  }
  const publicId = getPublicIdFromCloudinaryUrl(faculty.imageUrl);
  if (publicId) {
    await deleteImage(publicId);
  }
  await logActivity({
    action: 'DELETE',
    resource: 'faculty',
    description: `Deleted faculty "${faculty.name}"`,
    performedBy: req.user._id,
    metadata: { facultyId: faculty._id.toString() },
  });
  await Faculty.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
