import { connectDB } from './db';
import { Article } from './models/Article';
import type { ArticleItem } from './public-data';

/** Published articles for server rendering (newest first). Body excluded unless asked. */
export async function getPublishedArticles(withContent = false): Promise<ArticleItem[]> {
  try {
    await connectDB();
    const q = Article.find({ published: true }).sort({ publishedAt: -1 });
    if (!withContent) q.select('-content');
    return JSON.parse(JSON.stringify(await q.lean())) as ArticleItem[];
  } catch (err) {
    console.error('[articles] load failed:', err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getPublishedArticle(slug: string): Promise<ArticleItem | null> {
  try {
    await connectDB();
    const doc = await Article.findOne({ slug, published: true }).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as ArticleItem) : null;
  } catch (err) {
    console.error('[articles] load failed:', err instanceof Error ? err.message : err);
    return null;
  }
}
