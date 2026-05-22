/* eslint-disable no-console */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { PROJECTS, EXPERIENCES, SKILLS } from '../src/constants/constants';
import { User } from '../src/lib/models/User';
import { Project } from '../src/lib/models/Project';
import { Experience } from '../src/lib/models/Experience';
import { Skill } from '../src/lib/models/Skill';
import { SocialLink } from '../src/lib/models/SocialLink';
import { SiteContent } from '../src/lib/models/SiteContent';

const lz = (s: string) => ({ en: s, fr: s, es: s });

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user');
    return;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] admin already exists: ${email}`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, role: 'admin', name: 'Admin' });
  console.log(`[seed] created admin: ${email}`);
}

async function seedProjects() {
  const count = await Project.countDocuments();
  if (count > 0) {
    console.log(`[seed] projects already populated (${count}) — skipping`);
    return;
  }
  const docs = PROJECTS.map((p, i) => ({
    title: lz(p.title),
    description: lz(p.description),
    category: lz(p.category),
    image: p.image,
    link: p.link,
    githubLink: p.githubLink || '',
    tags: p.tags || [],
    order: i,
    published: true,
  }));
  await Project.insertMany(docs);
  console.log(`[seed] inserted ${docs.length} projects`);
}

async function seedExperiences() {
  const count = await Experience.countDocuments();
  if (count > 0) {
    console.log(`[seed] experiences already populated (${count}) — skipping`);
    return;
  }
  const docs = EXPERIENCES.map((e, i) => ({
    role: lz(e.role),
    company: e.company,
    period: lz(e.period),
    location: lz(e.location),
    description: lz(e.description),
    order: i,
    published: true,
  }));
  await Experience.insertMany(docs);
  console.log(`[seed] inserted ${docs.length} experiences`);
}

async function seedSkills() {
  const count = await Skill.countDocuments();
  if (count > 0) {
    console.log(`[seed] skills already populated (${count}) — skipping`);
    return;
  }
  const docs = SKILLS.map((s, i) => ({
    name: s.name,
    level: s.level,
    category: s.category,
    logoUrl: s.logoUrl,
    order: i,
    published: true,
  }));
  await Skill.insertMany(docs);
  console.log(`[seed] inserted ${docs.length} skills`);
}

async function seedSocialLinks() {
  const count = await SocialLink.countDocuments();
  if (count > 0) {
    console.log(`[seed] social links already populated (${count}) — skipping`);
    return;
  }
  const defaults = [
    { label: 'GitHub', url: 'https://github.com/cedric921', icon: 'Github', order: 0 },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/cedric-karungu/', icon: 'Linkedin', order: 1 },
    { label: 'Email', url: 'mailto:ckarungu921@gmail.com', icon: 'Mail', order: 2 },
  ];
  await SocialLink.insertMany(defaults);
  console.log(`[seed] inserted ${defaults.length} social links`);
}

async function seedSiteContent() {
  const entries = [
    { key: 'hero.headline', group: 'hero', value: lz('Full Stack Developer'), description: 'Hero main headline' },
    { key: 'hero.tagline', group: 'hero', value: lz('Building modern web & mobile experiences'), description: 'Hero secondary line' },
    { key: 'about.bio', group: 'about', value: lz('Passionate full-stack engineer crafting performant, accessible products.'), description: 'About me short bio' },
    { key: 'contact.heading', group: 'contact', value: lz("Let's build something together"), description: 'Contact section heading' },
  ];
  for (const e of entries) {
    await SiteContent.updateOne({ key: e.key }, { $setOnInsert: e }, { upsert: true });
  }
  console.log(`[seed] upserted ${entries.length} site content entries`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI in environment');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'cedric-portfolio' });
  console.log('[seed] connected to MongoDB');

  await seedAdmin();
  await seedProjects();
  await seedExperiences();
  await seedSkills();
  await seedSocialLinks();
  await seedSiteContent();

  await mongoose.disconnect();
  console.log('[seed] done');
}

main().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
