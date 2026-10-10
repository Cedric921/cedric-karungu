import mongoose from 'mongoose';
import { Article } from './models/Article';
import { normalizeTags, slugify } from './slug';

const WORDS_PER_MINUTE = 220;

export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Normalises an admin article payload: unique slug from the English title,
 * deduped tags, reading time from the longest locale, and publishedAt set the
 * first time the article goes live.
 */
export async function sanitizeArticleInput(
  body: Record<string, unknown>,
  currentId?: string,
): Promise<Record<string, unknown>> {
  const out: Record<string, unknown> = { ...body };
  delete out._id;
  delete out.createdAt;
  delete out.updatedAt;

  if ('tags' in out) out.tags = normalizeTags(out.tags);

  const title = out.title as { en?: string; fr?: string; es?: string } | undefined;
  const base =
    slugify(String(out.slug || '')) || slugify(title?.en || title?.fr || title?.es || '') || `article-${Date.now()}`;
  if ('slug' in out || 'title' in out) out.slug = await uniqueSlug(base, currentId);

  const content = out.content as Record<string, string> | undefined;
  if (content) {
    const longest = Object.values(content).reduce((a, b) => ((b || '').length > a.length ? b || '' : a), '');
    out.readingMinutes = readingMinutes(longest);
  }

  if (out.published === true) {
    const existing = currentId ? await Article.findById(currentId).select('publishedAt').lean() : null;
    if (!out.publishedAt) out.publishedAt = existing?.publishedAt ?? new Date();
  }
  if (out.publishedAt === '') out.publishedAt = null;

  return out;
}

async function uniqueSlug(base: string, currentId?: string): Promise<string> {
  const exclude = currentId && mongoose.Types.ObjectId.isValid(currentId) ? { _id: { $ne: currentId } } : {};
  let slug = base;
  for (let i = 2; await Article.exists({ slug, ...exclude }); i++) slug = `${base}-${i}`;
  return slug;
}
