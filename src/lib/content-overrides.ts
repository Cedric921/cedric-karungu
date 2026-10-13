import { unstable_cache } from 'next/cache';
import { connectDB } from './db';
import { SiteContent } from './models/SiteContent';
import type { Locale } from './models/shared';

export const SITE_CONTENT_TAG = 'site-content';

type Overrides = Record<string, { en?: string; fr?: string; es?: string }>;

/** All admin overrides keyed by message path ("about.experience"). Cached, invalidated on admin writes. */
export const getContentOverrides = unstable_cache(
  async (): Promise<Overrides> => {
    try {
      await connectDB();
      const docs = await SiteContent.find({}).select('key value').lean();
      const out: Overrides = {};
      for (const d of docs) if (d.key) out[d.key] = (d.value ?? {}) as Overrides[string];
      return out;
    } catch (err) {
      console.error('[content] overrides load failed:', err instanceof Error ? err.message : err);
      return {};
    }
  },
  ['site-content-overrides'],
  { tags: [SITE_CONTENT_TAG], revalidate: 3600 },
);

/**
 * Returns a copy of `messages` with the admin overrides for `locale` applied.
 * Only non-empty values win; list messages (arrays) are stored one item per line.
 */
export function applyOverrides<T extends object>(messages: T, overrides: Overrides, locale: Locale): T {
  const out = structuredClone(messages) as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    const text = value?.[locale];
    if (!text || !text.trim()) continue;
    const path = key.split('.');
    let node = out;
    for (const part of path.slice(0, -1)) {
      if (typeof node[part] !== 'object' || node[part] === null) node[part] = {};
      node = node[part] as Record<string, unknown>;
    }
    const leaf = path[path.length - 1];
    node[leaf] = Array.isArray(node[leaf]) ? text.split('\n').map((s) => s.trim()).filter(Boolean) : text;
  }
  return out as T;
}
