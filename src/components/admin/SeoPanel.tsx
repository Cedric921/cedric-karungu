'use client';

import { cn } from './ui';

type Props = {
  lang: string;
  title: string;
  excerpt: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  onChange: (next: { seoTitle?: string; seoDescription?: string }) => void;
};

const TITLE = { min: 30, max: 60 };
const DESC = { min: 110, max: 158 };

function Counter({ n, min, max }: { n: number; min: number; max: number }) {
  const tone = n === 0 ? 'text-gray-400' : n < min ? 'text-amber-600' : n > max ? 'text-red-600' : 'text-emerald-600';
  return <span className={cn('tabular-nums', tone)}>{n}/{max}</span>;
}

/**
 * Search-result settings for one language: title and meta description with
 * length guidance, plus a Google-style preview of how the result will look.
 * Empty fields fall back to the article title and excerpt.
 */
export function SeoPanel({ lang, title, excerpt, slug, seoTitle, seoDescription, onChange }: Props) {
  const shownTitle = seoTitle || title || 'Article title';
  const shownDesc = seoDescription || excerpt || 'The excerpt is used when no description is set.';
  const host = typeof window !== 'undefined' ? window.location.host : 'your-site';

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-white/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search (SEO) · {lang}</span>
      </div>

      <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-gray-100 dark:bg-white/[0.03] dark:ring-white/10">
        <p className="truncate text-xs text-gray-500">
          {host} › {lang} › blog › {slug || '…'}
        </p>
        <p className="mt-0.5 line-clamp-1 text-[15px] text-[#1a0dab] dark:text-[#8ab4f8]">{shownTitle}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{shownDesc}</p>
      </div>

      <label className="block">
        <span className="flex justify-between text-xs text-gray-500">
          Title in search results <Counter n={seoTitle.length} {...TITLE} />
        </span>
        <input
          value={seoTitle}
          onChange={(e) => onChange({ seoTitle: e.target.value })}
          placeholder={title}
          className="mt-1 h-8 w-full rounded-md border border-gray-200 bg-transparent px-2 text-sm outline-none focus:border-accent-500 dark:border-white/10"
        />
      </label>
      <label className="block">
        <span className="flex justify-between text-xs text-gray-500">
          Meta description <Counter n={seoDescription.length} {...DESC} />
        </span>
        <textarea
          rows={3}
          value={seoDescription}
          onChange={(e) => onChange({ seoDescription: e.target.value })}
          placeholder={excerpt}
          className="mt-1 w-full rounded-md border border-gray-200 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-accent-500 dark:border-white/10"
        />
      </label>
      <p className="text-[11px] leading-relaxed text-gray-500">
        Aim for {TITLE.min}–{TITLE.max} characters for the title and {DESC.min}–{DESC.max} for the description, with the main
        keyword early. Empty fields use the title and excerpt.
      </p>
    </div>
  );
}
