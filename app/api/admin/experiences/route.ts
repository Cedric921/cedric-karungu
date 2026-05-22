import { Experience } from '@/lib/models/Experience';
import { ok, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

export const GET = withAdmin(async () => {
  const items = await Experience.find({}).sort({ order: 1, createdAt: -1 }).lean();
  return ok(items);
});

export const POST = withAdmin(async (req) => {
  const body = await readJson<Record<string, unknown>>(req);
  const created = await Experience.create(body);
  return ok(created.toObject(), { status: 201 });
});
