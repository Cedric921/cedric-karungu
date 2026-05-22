import { Message } from '@/lib/models/Message';
import { ok, fail, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import mongoose from 'mongoose';

type Params = { params: Promise<{ id: string }> };

function isValidId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export const GET = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const doc = await Message.findById(id).lean();
  if (!doc) return fail('Not found', 404);
  // Auto-mark as read on open
  if ('read' in doc && !doc.read) {
    await Message.updateOne({ _id: id }, { $set: { read: true } });
  }
  return ok(doc);
});

export const PATCH = withAdmin(async (req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const body = await readJson<{ read?: boolean; archived?: boolean }>(req);
  const update: Record<string, unknown> = {};
  if (typeof body.read === 'boolean') update.read = body.read;
  if (typeof body.archived === 'boolean') update.archived = body.archived;
  const doc = await Message.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
  if (!doc) return fail('Not found', 404);
  return ok(doc);
});

export const DELETE = withAdmin(async (_req, ctx: Params) => {
  const { id } = await ctx.params;
  if (!isValidId(id)) return fail('Invalid id', 400);
  const res = await Message.findByIdAndDelete(id).lean();
  if (!res) return fail('Not found', 404);
  return ok({ deleted: true });
});
