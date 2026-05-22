import { Skill } from '@/lib/models/Skill';
import { ok, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

export const GET = withAdmin(async () => {
  const items = await Skill.find({}).sort({ category: 1, order: 1 }).lean();
  return ok(items);
});

export const POST = withAdmin(async (req) => {
  const body = await readJson<Record<string, unknown>>(req);
  const created = await Skill.create(body);
  return ok(created.toObject(), { status: 201 });
});
