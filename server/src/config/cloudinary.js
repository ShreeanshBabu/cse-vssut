import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ApiError } from '../utils/apiError.js';

function cloudinaryEnv(name) {
  const v = process.env[name];
  if (v == null) return '';
  return String(v).trim();
}

cloudinary.config({
  cloud_name: cloudinaryEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: cloudinaryEnv('CLOUDINARY_API_KEY'),
  api_secret: cloudinaryEnv('CLOUDINARY_API_SECRET'),
});

/**
 * Upload an image buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<string>} secure_url
 */
export function uploadImage(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, 'Image upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Delete an image from Cloudinary by public_id.
 * @param {string} publicId
 * @returns {Promise<void>}
 */
export async function deleteImage(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
