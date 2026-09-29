'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea, Spinner } from '../ui';
import { LocaleTabs, type Localized } from '../LocaleTabs';
import { TagInput } from '../TagInput';
import { GalleryInput } from '../GalleryInput';
import { slugify } from '@/lib/slug';

type ProjectInput = {
  title: Localized;
  slug: string;
  description: Localized;
  category: Localized;
  image: string;
  gallery: string[];
  link: string;
  githubLink: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
};

const emptyLz: Localized = { en: '', fr: '', es: '' };

export function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  tagSuggestions = [],
}: {
  initial?: Partial<ProjectInput>;
  tagSuggestions?: string[];
  onSubmit: (v: ProjectInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState<ProjectInput>({
    title: initial?.title || emptyLz,
    slug: initial?.slug || '',
    description: initial?.description || emptyLz,
    category: initial?.category || emptyLz,
    image: initial?.image || '',
    gallery: initial?.gallery?.length ? initial.gallery : (initial?.image ? [initial.image] : []),
    link: initial?.link || '',
    githubLink: initial?.githubLink || '',
    tags: initial?.tags || [],
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    order: initial?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(state);
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <LocaleTabs
        label="Title"
        value={state.title}
        onChange={(v) => setState((s) => ({ ...s, title: v }))}
        renderInput={(_l, v, set) => <Input value={v} onChange={(e) => set(e.target.value)} required={_l === 'en'} />}
      />
      <LocaleTabs
        label="Description"
        value={state.description}
        onChange={(v) => setState((s) => ({ ...s, description: v }))}
        renderInput={(_l, v, set) => <Textarea rows={4} value={v} onChange={(e) => set(e.target.value)} required={_l === 'en'} />}
      />
      <LocaleTabs
        label="Category"
        value={state.category}
        onChange={(v) => setState((s) => ({ ...s, category: v }))}
        renderInput={(_l, v, set) => <Input value={v} onChange={(e) => set(e.target.value)} placeholder="Web, App, …" />}
      />

      <div>
        <Label htmlFor="project-images">Project images</Label>
        <GalleryInput
          gallery={state.gallery}
          cover={state.image}
          onChange={({ gallery, image }) => setState((s) => ({ ...s, gallery, image }))}
          onBusyChange={setUploading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            value={state.slug}
            onChange={(e) => setState((s) => ({ ...s, slug: e.target.value }))}
            placeholder={slugify(state.title.en) || 'auto from English title'}
          />
        </div>
        <div>
          <Label htmlFor="link">Live URL</Label>
          <Input id="link" value={state.link} onChange={(e) => setState((s) => ({ ...s, link: e.target.value }))} placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input id="github" value={state.githubLink} onChange={(e) => setState((s) => ({ ...s, githubLink: e.target.value }))} placeholder="https://github.com/…" />
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" value={state.order} onChange={(e) => setState((s) => ({ ...s, order: Number(e.target.value) }))} />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          id="tags"
          value={state.tags}
          onChange={(tags) => setState((s) => ({ ...s, tags }))}
          suggestions={tagSuggestions}
          placeholder="React, Node.js, MongoDB…"
        />
      </div>

      <div className="flex items-center gap-6 pt-1">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.featured} onChange={(e) => setState((s) => ({ ...s, featured: e.target.checked }))} className="rounded border-gray-300" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.published} onChange={(e) => setState((s) => ({ ...s, published: e.target.checked }))} className="rounded border-gray-300" />
          Published
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={uploading}>Cancel</Button>
        <Button type="submit" disabled={saving || uploading}>{saving || uploading ? <Spinner /> : null} Save</Button>
      </div>
    </form>
  );
}
