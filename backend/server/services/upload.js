// server/services/upload.js
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    cb(
      null,
      /image\/(jpeg|png|webp)/.test(file.mimetype) ||
        file.mimetype === 'application/pdf'
    ),
});

export function uploadBuffer(file, folder = 'portfolio', resource_type = 'auto') {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const isPdf = file.mimetype === 'application/pdf';
    const uploadOptions = {
      folder,
      resource_type: isPdf ? 'image' : resource_type,
      ...(isPdf ? { format: 'pdf' } : {}),
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(new Error(error.message || 'Cloudinary upload failed'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
}

export async function destroyAsset(asset, resource_type = 'image') {
  if (asset?.publicId) {
    try {
      await cloudinary.uploader.destroy(asset.publicId, {
        resource_type,
        invalidate: true,
      });
    } catch (err) {
      console.error('Failed to destroy asset on Cloudinary:', err.message);
    }
  }
}