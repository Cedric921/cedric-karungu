import { Article } from '@/lib/models/Article';
import { ok } from '@/lib/api';
import { withPublic } from '@/lib/handler';

/** Published articles, newest first, without their body. */
export const GET = withPublic(async () => {
  const items = await Article.find({ published: true }).select('-content').sort({ publishedAt: -1 }).lean();
  return ok(items);
});
