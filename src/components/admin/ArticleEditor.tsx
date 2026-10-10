'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bold,
  Code,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  SquareCode,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/admin-fetch';
import { getSignature, uploadToCloudinary } from '@/lib/cloudinary-upload';
import { slugify } from '@/lib/slug';
import Markdown from '@/components/Markdown';
import { Button, Input, Label, Spinner, Textarea, cn } from './ui';
import { TagInput } from './TagInput';

type Lz = { en: string; fr: string; es: string };
type Lang = keyof Lz;
const LANGS: Lang[] = ['en', 'fr', 'es'];
const empty: Lz = { en: '', fr: '', es: '' };

export type ArticleInput = {
  _id?: string;
  title: Lz;
  slug: string;
  excerpt: Lz;
  content: Lz;
  cover: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  readingMinutes?: number;
};

const blank: ArticleInput = {
  title: { ...empty },
  slug: '',
  excerpt: { ...empty },
  content: { ...empty },
  cover: '',
  tags: [],
  published: false,
  publishedAt: null,
};

async function uploadImage(file: File, onProgress?: (p: number) => void) {
  const sig = await getSignature('articles');
  return uploadToCloudinary(file, sig, onProgress ?? (() => {}));
}

/** Full-page Markdown editor for one article (id = "new" to create). */
export function ArticleEditor({ id, locale }: { id: string; locale: string }) {
  const router = useRouter();
  const isNew = id === 'new';
  const [state, setState] = useState<ArticleInput>(blank);
  const [saved, setSaved] = useState<string>(JSON.stringify(blank));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [view, setView] = useState<'write' | 'split' | 'preview'>('split');
  const [uploading, setUploading] = useState<string | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const dirty = JSON.stringify(state) !== saved;

  // Load the article + tag suggestions from other articles.
  useEffect(() => {
    adminFetch<ArticleInput[]>('/api/admin/articles').then((r) => r.ok && setTagSuggestions(r.data.flatMap((a) => a.tags || [])));
    if (isNew) return;
    adminFetch<ArticleInput>(`/api/admin/articles/${id}`).then((r) => {
      if (r.ok) {
        const next: ArticleInput = {
          ...blank,
          ...r.data,
          title: { ...empty, ...r.data.title },
          excerpt: { ...empty, ...r.data.excerpt },
          content: { ...empty, ...r.data.content },
          publishedAt: r.data.publishedAt ? String(r.data.publishedAt).slice(0, 10) : null,
        };
        setState(next);
        setSaved(JSON.stringify(next));
      } else toast.error('Article not found');
      setLoading(false);
    });
  }, [id, isNew]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBefore = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, [dirty]);

  const save = useCallback(
    async (overrides: Partial<ArticleInput> = {}) => {
      const payload = { ...state, ...overrides };
      if (!payload.title.en.trim() && !payload.title.fr.trim() && !payload.title.es.trim()) {
        toast.error('Give the article a title first');
        return;
      }
      setSaving(true);
      const res = isNew
        ? await adminFetch<ArticleInput>('/api/admin/articles', { method: 'POST', body: JSON.stringify(payload) })
        : await adminFetch<ArticleInput>(`/api/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      setSaving(false);
      if (!res.ok) {
        toast.error('error' in res ? res.error : 'Save failed');
        return;
      }
      const next: ArticleInput = {
        ...payload,
        slug: res.data.slug,
        publishedAt: res.data.publishedAt ? String(res.data.publishedAt).slice(0, 10) : null,
        readingMinutes: res.data.readingMinutes,
      };
      setState(next);
      setSaved(JSON.stringify(next));
      toast.success(overrides.published === true ? 'Published' : overrides.published === false ? 'Moved to drafts' : 'Saved');
      if (isNew && res.data._id) router.replace(`/${locale}/admin/articles/${res.data._id}`);
    },
    [state, isNew, id, locale, router],
  );

  // ⌘/Ctrl + S saves.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  const setLz = (field: 'title' | 'excerpt' | 'content', value: string) =>
    setState((s) => ({ ...s, [field]: { ...s[field], [lang]: value } }));

  /** Wraps the selection (or inserts at the caret) in the content editor. */
  const wrap = (before: string, after = '', placeholder = '') => {
    const ta = editorRef.current;
    if (!ta) {
      // Preview-only mode: append at the end.
      setState((s) => ({ ...s, content: { ...s.content, [lang]: s.content[lang] + before + placeholder + after } }));
      return;
    }
    const { selectionStart: a, selectionEnd: b, value } = ta;
    const selected = value.slice(a, b) || placeholder;
    const next = value.slice(0, a) + before + selected + after + value.slice(b);
    setLz('content', next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(a + before.length, a + before.length + selected.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const ta = editorRef.current;
    if (!ta) return;
    const { selectionStart: a, value } = ta;
    const lineStart = value.lastIndexOf('\n', a - 1) + 1;
    setLz('content', value.slice(0, lineStart) + prefix + value.slice(lineStart));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(a + prefix.length, a + prefix.length);
    });
  };

  const insertImages = async (files: FileList | File[] | null) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith('image/'));
    for (const file of list) {
      setUploading(file.name);
      try {
        const url = await uploadImage(file);
        wrap(`\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Upload failed');
      }
    }
    setUploading(null);
  };

  const uploadCover = async (file?: File) => {
    if (!file) return;
    setUploading('cover');
    try {
      const url = await uploadImage(file);
      setState((s) => ({ ...s, cover: url }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
    setUploading(null);
  };

  const words = useMemo(() => state.content[lang].split(/\s+/).filter(Boolean).length, [state.content, lang]);

  if (loading)
    return (
      <div className="grid place-items-center py-24">
        <Spinner size={22} />
      </div>
    );

  const tools = [
    { Icon: Bold, label: 'Bold', run: () => wrap('**', '**', 'bold') },
    { Icon: Italic, label: 'Italic', run: () => wrap('_', '_', 'italic') },
    { Icon: Heading2, label: 'Heading 2', run: () => linePrefix('## ') },
    { Icon: Heading3, label: 'Heading 3', run: () => linePrefix('### ') },
    { Icon: Quote, label: 'Quote', run: () => linePrefix('> ') },
    { Icon: List, label: 'Bullet list', run: () => linePrefix('- ') },
    { Icon: ListOrdered, label: 'Numbered list', run: () => linePrefix('1. ') },
    { Icon: Link2, label: 'Link', run: () => wrap('[', '](https://)', 'link text') },
    { Icon: Code, label: 'Inline code', run: () => wrap('`', '`', 'code') },
    { Icon: SquareCode, label: 'Code block', run: () => wrap('\n```ts\n', '\n```\n', '// code') },
  ];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-gray-50/90 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#050505]/90 sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/admin/articles`} className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5" aria-label="Back to articles">
            <ArrowLeft size={18} />
          </Link>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 text-xs font-medium',
              state.published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300',
            )}
          >
            {state.published ? 'Published' : 'Draft'}
          </span>
          <span className="text-xs text-gray-500">
            {dirty ? 'Unsaved changes' : 'All changes saved'} · {words} words · ~{Math.max(1, Math.round(words / 220))} min
          </span>
        </div>
        <div className="flex items-center gap-2">
          {state.published && state.slug && (
            <a href={`/${locale}/blog/${state.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 text-xs text-accent-600 hover:underline">
              View <ExternalLink size={12} />
            </a>
          )}
          <Button variant="secondary" size="sm" onClick={() => save()} disabled={saving || !!uploading}>
            {saving ? <Spinner size={14} /> : null} Save <kbd className="hidden text-[10px] opacity-60 sm:inline">⌘S</kbd>
          </Button>
          <Button size="sm" onClick={() => save({ published: !state.published })} disabled={saving || !!uploading}>
            {state.published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex items-center gap-1">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium uppercase transition',
              lang === l ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white',
            )}
          >
            {l}
            <span className={cn('h-1.5 w-1.5 rounded-full', state.content[l].trim() ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/20')} />
          </button>
        ))}
        <span className="ml-2 text-xs text-gray-500">Empty languages fall back to English on the site.</span>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-4">
          <input
            value={state.title[lang]}
            onChange={(e) => setLz('title', e.target.value)}
            placeholder="Article title"
            className="w-full bg-transparent text-3xl font-bold tracking-tight text-gray-900 outline-none placeholder:text-gray-300 dark:text-white dark:placeholder:text-white/20 md:text-4xl"
          />
          <Textarea
            rows={2}
            value={state.excerpt[lang]}
            onChange={(e) => setLz('excerpt', e.target.value)}
            placeholder="Short excerpt shown in lists and link previews (1–2 sentences)"
            className="min-h-0"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex flex-wrap items-center">
              {tools.map(({ Icon, label, run }) => (
                <button key={label} type="button" title={label} aria-label={label} onClick={run} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white">
                  <Icon size={16} />
                </button>
              ))}
              <label title="Insert image" className="cursor-pointer rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white">
                {uploading && uploading !== 'cover' ? <Spinner size={16} /> : <ImagePlus size={16} />}
                <input type="file" accept="image/*" multiple hidden onChange={(e) => { insertImages(e.target.files); e.target.value = ''; }} />
              </label>
            </div>
            <div className="flex rounded-md bg-gray-100 p-0.5 text-xs dark:bg-white/5">
              {(['write', 'split', 'preview'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={cn('rounded px-2.5 py-1 capitalize', view === v ? 'bg-white shadow-sm dark:bg-white/10' : 'text-gray-500')}
                >
                  {v === 'preview' ? <Eye size={14} className="inline" /> : v}
                </button>
              ))}
            </div>
          </div>

          <div className={cn('grid gap-4', view === 'split' && 'lg:grid-cols-2')}>
            {view !== 'preview' && (
              <textarea
                ref={editorRef}
                value={state.content[lang]}
                onChange={(e) => setLz('content', e.target.value)}
                onDrop={(e) => {
                  if (e.dataTransfer.files.length) {
                    e.preventDefault();
                    insertImages(e.dataTransfer.files);
                  }
                }}
                onPaste={(e) => {
                  const files = Array.from(e.clipboardData.files);
                  if (files.length) {
                    e.preventDefault();
                    insertImages(files);
                  }
                }}
                placeholder={'Start writing in Markdown…\n\n## A section\n\nParagraphs, **bold**, `code`, lists, > quotes, images (drop or paste them here).'}
                spellCheck
                className="min-h-[60vh] w-full resize-y rounded-lg border border-gray-200 bg-white p-4 font-mono text-[14px] leading-7 text-gray-900 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 dark:border-white/10 dark:bg-white/[0.02] dark:text-gray-100"
              />
            )}
            {view !== 'write' && (
              <div className="min-h-[60vh] overflow-auto rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-[#0f0f0f]">
                {state.content[lang].trim() ? (
                  <Markdown className="prose-base">{state.content[lang]}</Markdown>
                ) : (
                  <p className="text-sm text-gray-400">Preview appears here.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <aside className="space-y-6">
          <div>
            <Label>Cover image</Label>
            <label className="group relative block cursor-pointer overflow-hidden rounded-lg border border-dashed border-gray-300 dark:border-white/15">
              {state.cover ? (
                <img src={state.cover} alt="" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <span className="grid aspect-[16/9] place-items-center text-xs text-gray-500">
                  {uploading === 'cover' ? <Spinner /> : 'Click to upload'}
                </span>
              )}
              <input type="file" accept="image/*" hidden onChange={(e) => uploadCover(e.target.files?.[0])} />
            </label>
            <div className="mt-2 flex gap-2">
              <Input
                value={state.cover}
                onChange={(e) => setState((s) => ({ ...s, cover: e.target.value }))}
                placeholder="…or image URL"
                className="h-8 text-xs"
              />
              {state.cover && (
                <Button variant="ghost" size="sm" onClick={() => setState((s) => ({ ...s, cover: '' }))}>
                  Remove
                </Button>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              value={state.slug}
              onChange={(e) => setState((s) => ({ ...s, slug: e.target.value }))}
              placeholder={slugify(state.title.en || state.title.fr || state.title.es) || 'auto from title'}
            />
            <p className="mt-1 truncate text-xs text-gray-500">/{locale}/blog/{state.slug || slugify(state.title.en || state.title.fr || state.title.es) || '…'}</p>
          </div>
          <div>
            <Label htmlFor="tags">Tags</Label>
            <TagInput id="tags" value={state.tags} onChange={(tags) => setState((s) => ({ ...s, tags }))} suggestions={tagSuggestions} placeholder="Next.js, Career…" />
          </div>
          <div>
            <Label htmlFor="date">Publish date</Label>
            <Input
              id="date"
              type="date"
              value={state.publishedAt ?? ''}
              onChange={(e) => setState((s) => ({ ...s, publishedAt: e.target.value || null }))}
            />
            <p className="mt-1 text-xs text-gray-500">Set automatically the first time you publish.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
