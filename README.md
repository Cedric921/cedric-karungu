# Cédric Karungu — Portfolio

Personal portfolio, blog and admin of **Cédric Karungu (Lord VB)**, full-stack engineer.
**Live:** [cedric-karungu.vercel.app](https://cedric-karungu.vercel.app) · EN / FR / ES

## ✨ Features

- **Portfolio** — hero, about, skills, projects (auto-playing galleries), experience as a `git log`, contact form
- **Blog** — Markdown articles in three languages, table of contents, RSS, per-article social images
- **Admin** — manage projects, experiences, skills, social links, messages and articles; edit **every text** of the site
- **SEO** — per-article title/description, canonical + hreflang, JSON-LD, `sitemap.xml`, `robots.txt`
- **Interactions** — stacked "full-stack" name, inspector cursor, scroll-driven effects (respecting reduced motion)
- **Dark / light** theme, responsive, accessible

## 🛠️ Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · next-intl · MongoDB (Mongoose) · Cloudinary · Brevo · Vercel

## 🚀 Getting started

```bash
npm install
cp .env.example .env   # fill in MongoDB, admin, JWT, Cloudinary, Brevo
npm run seed           # create the admin user and initial data
npm run dev            # http://localhost:3000
```

Admin: `/en/admin` (credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Develop, build and serve |
| `npm run seed` | Seed the admin user and initial content |
| `npm run seed:articles` | Seed blog articles (`--draft`, `--only=a,b`, `--fields=content,seoTitle`, `--force`) |
| `npm run sync:media` | Attach screenshots from `public/images/Projects/<slug>/` to projects (`-- --apply` to write) |

## 📁 Structure

```
app/            Routes: [locale]/ (site, blog, projects, admin), api/, sitemap, robots
src/components  UI, sections, blog, admin, fx (animations)
src/lib         Models, data access, SEO, uploads
public/locales  Translations (en, fr, es) — overridable from Admin → Site content
scripts/        Seeders and article sources
```

## 👤 Authors

- **Cedric Karungu** — [GitHub](https://github.com/Cedric921) · [LinkedIn](https://linkedin.com/in/cedric-karungu)
- **Gabriel Buhendwa**

## 📝 License

MIT
