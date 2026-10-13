/* eslint-disable no-console */
/**
 * Seeds the 5 demo articles (EN + FR; ES falls back to EN on the site).
 * Idempotent: upserts by slug and never overwrites an article you've edited
 * since (it only fills in missing ones unless --force).
 *
 *   npx tsx scripts/seed-articles.ts [--draft] [--force] [--only=<slug>[,<slug>…]] [--fields=a,b]
 *
 * --fields updates only those fields on existing articles (e.g.
 * --fields=content,excerpt,seoTitle,seoDescription), leaving the cover, dates
 * and publish state set in the admin untouched.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { Article } from '../src/lib/models/Article';
import { readingMinutes } from '../src/lib/article-input';
import { offlineFirst } from './demo-articles/offline-first';
import { twoCurrencies } from './demo-articles/two-currencies';
import { multiTenant } from './demo-articles/multi-tenant';
import { openSourceMonorepo } from './demo-articles/open-source-monorepo';
import { directUploads } from './demo-articles/direct-uploads';
import { codeToBusiness } from './demo-articles/code-to-business';
import { openSourceContributions } from './demo-articles/open-source-contributions';
import { openSourceProjectArticles } from './demo-articles/open-source-projects';

const DRAFT = process.argv.includes('--draft');
const FORCE = process.argv.includes('--force');
const ARTICLES: Seedable[] = [offlineFirst, twoCurrencies, multiTenant, openSourceMonorepo, directUploads, codeToBusiness, openSourceContributions, ...openSourceProjectArticles];
const FIELDS = process.argv.find((a) => a.startsWith('--fields='))?.slice('--fields='.length).split(',');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice('--only='.length);
const lz = (v: { en: string; fr: string; es?: string }) => ({ en: v.en, fr: v.fr, es: v.es ?? '' });
const lzOpt = (v?: { en: string; fr: string; es?: string }) => (v ? lz(v) : { en: '', fr: '', es: '' });
type Seedable = { slug: string; cover: string; tags: string[]; daysAgo: number; title: { en: string; fr: string; es?: string }; excerpt: { en: string; fr: string; es?: string }; content: { en: string; fr: string; es?: string }; seoTitle?: { en: string; fr: string; es?: string }; seoDescription?: { en: string; fr: string; es?: string } };

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'cedric-portfolio' });

  for (const a of ARTICLES) {
    if (ONLY && !ONLY.split(',').includes(a.slug)) continue;
    const exists = await Article.exists({ slug: a.slug });
    if (exists && FIELDS) {
      const all: Record<string, unknown> = {
        title: lz(a.title), excerpt: lz(a.excerpt), content: lz(a.content), tags: a.tags,
        seoTitle: lzOpt(a.seoTitle), seoDescription: lzOpt(a.seoDescription), readingMinutes: readingMinutes(a.content.en),
      };
      const set = Object.fromEntries(FIELDS.map((f) => [f, all[f]]).filter(([, v]) => v !== undefined));
      if (set.content) set.readingMinutes = all.readingMinutes;
      await Article.updateOne({ slug: a.slug }, { $set: set });
      console.log(`  fields ${a.slug} · ${Object.keys(set).join(', ')}`);
      continue;
    }
    if (exists && !FORCE) {
      console.log(`  skip   ${a.slug} (already exists)`);
      continue;
    }
    const doc = {
      slug: a.slug,
      title: lz(a.title),
      excerpt: lz(a.excerpt),
      content: lz(a.content),
      cover: a.cover,
      tags: a.tags,
      published: !DRAFT,
      publishedAt: new Date(Date.now() - a.daysAgo * 86_400_000),
      readingMinutes: readingMinutes(a.content.en),
      seoTitle: lzOpt(a.seoTitle),
      seoDescription: lzOpt(a.seoDescription),
    };
    await Article.updateOne({ slug: a.slug }, { $set: doc }, { upsert: true });
    console.log(`  ${exists ? 'update' : 'create'} ${a.slug} · ${doc.readingMinutes} min · ${DRAFT ? 'draft' : 'published'}`);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
