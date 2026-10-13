'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search, RotateCcw } from 'lucide-react';
import { Modal } from '@/components/admin/Modal';
import { Badge, Button, Input, Spinner, Textarea, cn } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import en from '@/public/locales/en.json';
import fr from '@/public/locales/fr.json';
import es from '@/public/locales/es.json';

type Lang = 'en' | 'fr' | 'es';
type Lz = Record<Lang, string>;
const LANGS: Lang[] = ['en', 'fr', 'es'];

type Override = { _id: string; key: string; group: string; value: Partial<Lz>; description: string };

/** One editable text: its key, defaults per language, and whether it's a list. */
type Entry = { key: string; section: string; isList: boolean; defaults: Lz };

// Where each translation section shows up, so it's easy to find a text.
const SECTIONS: Record<string, string> = {
  hero: 'Hero — top of the home page',
  about: 'About — bio and quick facts',
  skills: 'Skills',
  portfolio: 'Projects section and /projects',
  projectPage: 'Project detail page',
  experience: 'Experience',
  blog: 'Blog',
  contact: 'Contact — form and email',
  footer: 'Footer',
  nav: 'Navigation menu',
  ui: 'Labels & small interface texts',
  common: 'Common words',
};

const asText = (v: unknown) => (Array.isArray(v) ? v.join('\n') : typeof v === 'string' ? v : '');

function flatten(obj: Record<string, unknown>, prefix = ''): [string, unknown][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v) ? flatten(v as Record<string, unknown>, key) : [[key, v] as [string, unknown]];
  });
}

const get = (obj: unknown, key: string) => key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj);

const CATALOG: Entry[] = flatten(en).map(([key, v]) => ({
  key,
  section: key.split('.')[0],
  isList: Array.isArray(v),
  defaults: { en: asText(v), fr: asText(get(fr, key)), es: asText(get(es, key)) },
}));

/** "about.mainTitle" → "Main title", "hero.titles" → "Titles". */
const humanize = (key: string) => {
  const last = key.split('.').slice(1).join(' › ') || key;
  return last.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase()).replace(/ ([A-Z])/g, (m) => m.toLowerCase());
};

export default function SiteContentAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Override>('/api/admin/content');
  const [query, setQuery] = useState('');
  const [section, setSection] = useState('all');
  const [onlyModified, setOnlyModified] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);

  const overrides = useMemo(() => new Map(items.map((o) => [o.key, o])), [items]);

  // Catalog + any custom keys that exist only in the database.
  const entries = useMemo<Entry[]>(() => {
    const known = new Set(CATALOG.map((e) => e.key));
    const extra = items
      .filter((o) => !known.has(o.key))
      .map((o) => ({ key: o.key, section: 'other', isList: false, defaults: { en: '', fr: '', es: '' } }));
    return [...CATALOG, ...extra];
  }, [items]);

  const isModified = (e: Entry) => {
    const o = overrides.get(e.key);
    return !!o && LANGS.some((l) => (o.value?.[l] ?? '').trim() && o.value?.[l] !== e.defaults[l]);
  };
  const current = (e: Entry, l: Lang) => (overrides.get(e.key)?.value?.[l] || '').trim() ? overrides.get(e.key)!.value[l]! : e.defaults[l];

  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    (e) =>
      (section === 'all' || e.section === section) &&
      (!onlyModified || isModified(e)) &&
      (!q || e.key.toLowerCase().includes(q) || LANGS.some((l) => current(e, l).toLowerCase().includes(q))),
  );
  const grouped = visible.reduce<Record<string, Entry[]>>((acc, e) => ((acc[e.section] ||= []).push(e), acc), {});
  const sections = ['all', ...Array.from(new Set(entries.map((e) => e.section)))];
  const modifiedCount = entries.filter(isModified).length;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Site content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Every text on the public site, in EN / FR / ES. Click a line to edit it — changes go live right after saving.
            {modifiedCount > 0 && <> · <span className="text-accent-600 dark:text-accent-300">{modifiedCount} modified</span></>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a text, e.g. “freelance” or “Kiswahili”" className="pl-8" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={onlyModified} onChange={(e) => setOnlyModified(e.target.checked)} className="accent-accent-500" />
            Modified only
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition',
                section === s
                  ? 'bg-accent-500/15 text-accent-700 ring-1 ring-accent-500/30 dark:text-accent-300'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-900 dark:bg-white/5 dark:hover:text-white',
              )}
            >
              {s === 'projectPage' ? 'project page' : s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Spinner size={20} />
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">No text matches.</p>
        ) : (
          Object.entries(grouped).map(([sec, list]) => (
            <section key={sec} className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/[0.02]">
              <header className="border-b border-gray-200 px-4 py-3 dark:border-white/10">
                <h2 className="text-sm font-semibold">{SECTIONS[sec] ?? (sec === 'other' ? 'Custom keys' : sec)}</h2>
              </header>
              <ul className="divide-y divide-gray-100 dark:divide-white/5">
                {list.map((e) => (
                  <li key={e.key}>
                    <button
                      type="button"
                      onClick={() => setEditing(e)}
                      className="grid w-full gap-1 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-white/[0.03] md:grid-cols-[220px_minmax(0,1fr)_auto] md:items-center md:gap-4"
                    >
                      <span>
                        <span className="block text-sm font-medium">{humanize(e.key)}</span>
                        <span className="block font-mono text-[11px] text-gray-400">{e.key}</span>
                      </span>
                      <span className="line-clamp-2 whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
                        {current(e, 'en') || <span className="italic text-gray-400">empty</span>}
                      </span>
                      <span className="flex gap-1.5">
                        {e.isList && <Badge tone="neutral">list</Badge>}
                        {isModified(e) && <Badge tone="accent">Modified</Badge>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? humanize(editing.key) : ''} size="lg">
        {editing && (
          <EditForm
            entry={editing}
            override={overrides.get(editing.key)}
            onCancel={() => setEditing(null)}
            onSave={async (value) => {
              const o = overrides.get(editing.key);
              const sameAsDefault = LANGS.every((l) => value[l] === editing.defaults[l]);
              const res = sameAsDefault
                ? o
                  ? await remove(o._id)
                  : { ok: true as const }
                : o
                  ? await update(o._id, { value })
                  : await create({ key: editing.key, group: editing.section, value, description: '' });
              if (res.ok) {
                toast.success('Saved — live on the site');
                setEditing(null);
              } else toast.error('error' in res ? String(res.error) : 'Save failed');
            }}
            onReset={async () => {
              const o = overrides.get(editing.key);
              if (!o) return setEditing(null);
              const res = await remove(o._id);
              if (res.ok) {
                toast.success('Back to the default text');
                setEditing(null);
              }
            }}
          />
        )}
      </Modal>
    </>
  );
}

function EditForm({
  entry,
  override,
  onSave,
  onReset,
  onCancel,
}: {
  entry: Entry;
  override?: Override;
  onSave: (value: Lz) => Promise<void>;
  onReset: () => Promise<void>;
  onCancel: () => void;
}) {
  const initial = Object.fromEntries(
    LANGS.map((l) => [l, (override?.value?.[l] || '').trim() ? override!.value[l]! : entry.defaults[l]]),
  ) as Lz;
  const [value, setValue] = useState<Lz>(initial);
  const [busy, setBusy] = useState(false);
  const long = LANGS.some((l) => entry.defaults[l].length > 80 || entry.isList);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    await fn();
    setBusy(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => onSave(value));
      }}
      className="space-y-5"
    >
      <p className="font-mono text-xs text-gray-500">
        {entry.key}
        {entry.isList && ' · one item per line'}
      </p>
      {LANGS.map((l) => (
        <div key={l}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{l}</span>
            {value[l] !== entry.defaults[l] && entry.defaults[l] && (
              <button
                type="button"
                onClick={() => setValue((v) => ({ ...v, [l]: entry.defaults[l] }))}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <RotateCcw size={12} /> default
              </button>
            )}
          </div>
          {long ? (
            <Textarea rows={entry.isList ? 5 : 4} value={value[l]} onChange={(e) => setValue((v) => ({ ...v, [l]: e.target.value }))} />
          ) : (
            <Input value={value[l]} onChange={(e) => setValue((v) => ({ ...v, [l]: e.target.value }))} />
          )}
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          {override && (
            <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={() => run(onReset)}>
              <RotateCcw size={14} /> Reset all to default
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy && <Spinner size={14} />} Save
          </Button>
        </div>
      </div>
    </form>
  );
}
