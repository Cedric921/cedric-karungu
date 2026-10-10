import mongoose from 'mongoose';
import { Article } from '@/lib/models/Article';
import { ok, fail, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import { sanitizeArticleInput } from '@/lib/article-input';

type Params = { params: Promise<{ id: string }> };
const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const GET = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const doc = await Article.findById(id).lean();
  if (!doc) return fail('Not found', 404);
  return ok(doc);
});

export const PATCH = withAdmin(async (req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const body = await readJson<Record<string, unknown>>(req);
  const doc = await Article.findByIdAndUpdate(id, { $set: await sanitizeArticleInput(body, id) }, { new: true, runValidators: true }).lean();
  if (!doc) return fail('Not found', 404);
  return ok(doc);
});

export const DELETE = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const res = await Article.findByIdAndDelete(id).lean();
  if (!res) return fail('Not found', 404);
  return ok({ deleted: true });
});
