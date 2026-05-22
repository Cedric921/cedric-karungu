import { SiteContent } from '@/lib/models/SiteContent';
import { ok, readJson, fail } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

export const GET = withAdmin(async () => {
  const items = await SiteContent.find({}).sort({ group: 1, key: 1 }).lean();
  return ok(items);
});

export const POST = withAdmin(async (req) => {
  const body = await readJson<Record<string, unknown>>(req);
  if (!body.key || typeof body.key !== 'string') return fail('key is required', 400);
  const created = await SiteContent.create(body);
  return ok(created.toObject(), { status: 201 });
});
