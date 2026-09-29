import { createHash } from 'node:crypto';
import { fail, ok } from '@/lib/api';

const FOLDER = 'portfolio/projects';

/**
 * Returns a short-lived Cloudinary signature so the admin browser can upload
 * images straight to Cloudinary. Files never transit through our serverless
 * function, which avoids its request-body size limit and allows parallel uploads.
 * Auth is enforced by the /api/admin proxy boundary.
 */
export async function POST() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return fail('Cloudinary is not configured', 503);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash('sha1')
    .update(`folder=${FOLDER}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  return ok({ cloudName, apiKey, timestamp, folder: FOLDER, signature });
}
