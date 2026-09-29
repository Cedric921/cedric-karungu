/* eslint-disable no-console */
/**
 * Backfills project slugs and galleries from screenshots stored in
 * public/images/Projects/<slug>/ (01.jpg, 02.jpg, …), and merges extra tags
 * from scripts/project-enrichment.json.
 *
 *   npx tsx scripts/sync-project-media.ts            # dry run, prints the plan
 *   npx tsx scripts/sync-project-media.ts --apply    # writes to MongoDB
 *
 * If CLOUDINARY_* env vars are set, screenshots are uploaded to Cloudinary
 * (portfolio/projects/<slug>/NN, idempotent) and the CDN URLs are stored;
 * otherwise the local /images/... paths are stored, which only resolve once
 * this repo is deployed.
 */
import 'dotenv/config';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { Project } from '../src/lib/models/Project';
import { MAX_PROJECT_IMAGES, normalizeTags, slugify } from '../src/lib/slug';

const APPLY = process.argv.includes('--apply');
const ROOT = path.resolve(process.cwd(), 'public/images/Projects');
const ENRICH_FILE = path.resolve(process.cwd(), 'scripts/project-enrichment.json');

type Enrichment = Record<string, { tags?: string[]; description?: { en?: string; fr?: string }; link?: string }>;
const { _slugs: slugOverrides = {}, ...enrichment } = (
  existsSync(ENRICH_FILE) ? JSON.parse(readFileSync(ENRICH_FILE, 'utf8')) : {}
) as Enrichment & { _slugs?: Record<string, string> };

const cloud = {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
};
const useCloudinary = !!(cloud.name && cloud.key && cloud.secret);

async function uploadToCloudinary(file: string, slug: string): Promise<string> {
  const publicId = path.parse(file).name;
  const folder = `portfolio/projects/${slug}`;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const toSign = `folder=${folder}&overwrite=true&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = createHash('sha1').update(toSign + cloud.secret).digest('hex');
  const form = new FormData();
  form.append('file', new Blob([readFileSync(file)]), path.basename(file));
  form.append('api_key', cloud.key!);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  form.append('public_id', publicId);
  form.append('overwrite', 'true');
  form.append('signature', signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud.name}/image/upload`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || res.statusText);
  return json.secure_url as string;
}

function localShots(slug: string): string[] {
  const dir = path.join(ROOT, slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'cedric-portfolio' });
  console.log(`[sync] ${APPLY ? 'APPLY' : 'dry run'} · images via ${useCloudinary ? 'Cloudinary' : 'local /images paths'}`);

  const docs = await Project.find({}).sort({ order: 1, createdAt: -1 });
  const taken = new Set(docs.map((d) => d.slug).filter(Boolean));

  for (const doc of docs) {
    const title = doc.title?.en || '';
    let slug = doc.slug || '';
    if (!slug) {
      const base = slugOverrides[title] || slugify(title) || String(doc._id);
      slug = base;
      for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
      taken.add(slug);
    }

    const shots = localShots(slug);
    const extra = enrichment[slug] || {};
    let urls: string[] = [];
    if (shots.length) {
      urls = useCloudinary && APPLY
        ? await Promise.all(shots.map((f) => uploadToCloudinary(f, slug)))
        : shots.map((f) => '/' + path.relative(path.resolve(process.cwd(), 'public'), f).split(path.sep).join('/'));
    }

    const current = [doc.image, ...(doc.gallery || [])].filter(Boolean) as string[];
    const gallery = [...new Set([...current, ...urls])].slice(0, MAX_PROJECT_IMAGES);
    const tags = normalizeTags([...(doc.tags || []), ...(extra.tags || [])]);
    const update: Record<string, unknown> = {};
    if (slug !== doc.slug) update.slug = slug;
    if (JSON.stringify(gallery) !== JSON.stringify(doc.gallery || [])) update.gallery = gallery;
    if (!doc.image && gallery[0]) update.image = gallery[0];
    if (tags.length !== (doc.tags || []).length) update.tags = tags;
    // Only replace descriptions that are still placeholder-short.
    for (const lang of ['en', 'fr'] as const) {
      const text = extra.description?.[lang];
      if (text && (doc.description?.[lang] || '').length < 60) update[`description.${lang}`] = text;
    }
    if (extra.link && doc.link !== extra.link) update.link = extra.link;

    const keys = Object.keys(update);
    console.log(
      `${keys.length ? '•' : ' '} ${title.padEnd(32).slice(0, 32)} ${slug.padEnd(28).slice(0, 28)} shots:${String(shots.length).padStart(2)} gallery:${(doc.gallery || []).length}→${gallery.length} ${keys.length ? `[${keys.join(', ')}]` : ''}`,
    );
    if (APPLY && keys.length) await Project.updateOne({ _id: doc._id }, { $set: update });
  }

  await mongoose.disconnect();
  if (!APPLY) console.log('\nDry run only. Re-run with --apply to write these changes.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
