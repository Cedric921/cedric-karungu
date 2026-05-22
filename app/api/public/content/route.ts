import { SiteContent } from '@/lib/models/SiteContent';
import { ok } from '@/lib/api';
import { withPublic } from '@/lib/handler';

export const GET = withPublic(async () => {
  const items = await SiteContent.find({}).sort({ group: 1, key: 1 }).lean();
  return ok(items);
});
