import { SiteContent } from '@/lib/models/SiteContent';
import { ok, fail, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import { revalidatePath, revalidateTag } from 'next/cache';
import { SITE_CONTENT_TAG } from '@/lib/content-overrides';

/** Pushes edits to every page (layout merges the overrides into translations). */
const refresh = () => {
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
};
import mongoose from 'mongoose';

type Params = { params: Promise<{ id: string }> };
const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const GET = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const doc = await SiteContent.findById(id).lean();
  if (!doc) return fail('Not found', 404);
  return ok(doc);
});

export const PATCH = withAdmin(async (req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const body = await readJson<Record<string, unknown>>(req);
  const doc = await SiteContent.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  if (!doc) return fail('Not found', 404);
  refresh();
  return ok(doc);
});

export const DELETE = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const res = await SiteContent.findByIdAndDelete(id).lean();
  if (!res) return fail('Not found', 404);
  refresh();
  return ok({ deleted: true });
});
