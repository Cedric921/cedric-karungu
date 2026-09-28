import { createHash } from 'node:crypto';
import { fail, ok } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const maxFileSize = 10 * 1024 * 1024;

export const POST = withAdmin(async (req) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return fail('Cloudinary is not configured', 503);
  }
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (contentLength > maxFileSize + 1024 * 1024) {
    return fail('Image must be 10 MB or smaller', 413);
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return fail('An image file is required', 400);
  if (!allowedTypes.has(file.type)) return fail('Unsupported image format', 415);
  if (file.size === 0 || file.size > maxFileSize) {
    return fail('Image must be between 1 byte and 10 MB', 413);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'portfolio/projects';
  const signature = createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('api_key', apiKey);
  uploadData.append('timestamp', timestamp);
  uploadData.append('folder', folder);
  uploadData.append('signature', signature);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
      method: 'POST',
      body: uploadData,
    });
    const result = await response.json();
    if (!response.ok || typeof result.secure_url !== 'string') {
      console.error('[cloudinary] project image upload failed:', result.error?.message || response.statusText);
      return fail('Cloudinary upload failed', 502);
    }
    return ok({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('[cloudinary] project image upload failed:', error);
    return fail('Cloudinary upload failed', 502);
  }
});