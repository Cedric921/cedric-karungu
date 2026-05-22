import { SocialLink } from '@/lib/models/SocialLink';
import { ok } from '@/lib/api';
import { withPublic } from '@/lib/handler';

export const GET = withPublic(async () => {
  const items = await SocialLink.find({ published: true }).sort({ order: 1 }).lean();
  return ok(items);
});
