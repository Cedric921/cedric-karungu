import mongoose from 'mongoose';
import { Project } from './models/Project';
import { MAX_PROJECT_IMAGES, normalizeTags, slugify } from './slug';

/**
 * Normalises an admin project payload: dedupes tags, caps the gallery and
 * derives a unique slug from the English title when none is provided.
 */
export async function sanitizeProjectInput(
  body: Record<string, unknown>,
  currentId?: string,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = { ...body };
  delete out._id;
  delete out.createdAt;
  delete out.updatedAt;

  if ('tags' in out) out.tags = normalizeTags(out.tags);

  if ('gallery' in out) {
    const gallery = Array.isArray(out.gallery)
      ? [...new Set(out.gallery.map((u) => String(u).trim()).filter(Boolean))]
      : [];
    if (gallery.length > MAX_PROJECT_IMAGES) {
      throw new Error(`A project can have at most ${MAX_PROJECT_IMAGES} images`);
    }
    out.gallery = gallery;
    if (!out.image || !gallery.includes(String(out.image))) out.image = gallery[0] || out.image || '';
  }

  const title = out.title as { en?: string } | undefined;
  const base = slugify(String(out.slug || '')) || slugify(title?.en || '');
  if (base) out.slug = await uniqueSlug(base, currentId);

  return out;
}

async function uniqueSlug(base: string, currentId?: string): Promise<string> {
  const exclude = currentId && mongoose.Types.ObjectId.isValid(currentId) ? { _id: { $ne: currentId } } : {};
  let slug = base;
  for (let i = 2; await Project.exists({ slug, ...exclude }); i++) slug = `${base}-${i}`;
  return slug;
}
