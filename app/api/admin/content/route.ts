import { SiteContent } from '@/lib/models/SiteContent';
import { ok, readJson, fail } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_CONTENT_TAG } from '@/lib/content-overrides';

/** Pushes edits to every page (layout merges the overrides into translations). */
const refresh = () => {
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
};

export const GET = withAdmin(async () => {
  const items = await SiteContent.find({}).sort({ group: 1, key: 1 }).lean();
  return ok(items);
});

export const POST = withAdmin(async (req) => {
  const body = await readJson<Record<string, unknown>>(req);
  if (!body.key || typeof body.key !== 'string') return fail('key is required', 400);
  const created = await SiteContent.create(body);
  refresh();
  return ok(created.toObject(), { status: 201 });
});
