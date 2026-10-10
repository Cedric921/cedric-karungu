import { Article } from '@/lib/models/Article';
import { ok, readJson } from '@/lib/api';
import { withAdmin } from '@/lib/handler';
import { sanitizeArticleInput } from '@/lib/article-input';

export const GET = withAdmin(async () => {
  // Content omitted from the list; the editor loads one article by id.
  const items = await Article.find({}).select('-content').sort({ updatedAt: -1 }).lean();
  return ok(items);
});

export const POST = withAdmin(async (req) => {
  const body = await readJson<Record<string, unknown>>(req);
  const created = await Article.create(await sanitizeArticleInput(body));
  return ok(created.toObject(), { status: 201 });
});
