'use client';

import { useRef, useState } from 'react';
import { Button, Input, Label, Textarea, Spinner } from '../ui';
import { LocaleTabs, type Localized } from '../LocaleTabs';

type ProjectInput = {
  title: Localized;
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
}: {
  initial?: Partial<ProjectInput>;
  onSubmit: (v: ProjectInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState<ProjectInput>({
    title: initial?.title || emptyLz,
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
  const [uploadError, setUploadError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadError('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/admin/uploads/projects', {
          method: 'POST',
          body: formData,
          credentials: 'same-origin',
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Upload failed');
        urls.push(result.data.url);
      }
      setState((current) => ({
        ...current,
        gallery: [...current.gallery, ...urls],
        image: current.image || urls[0],
      }));
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

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
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInput}
            id="project-images"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            disabled={uploading}
            onChange={(e) => uploadImages(e.target.files)}
            className="block w-full max-w-sm text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-accent-600 file:px-3 file:py-2 file:text-white disabled:opacity-50"
          />
          {uploading && <Spinner />}
        </div>
        <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WebP, GIF or AVIF. Maximum 10 MB per image.</p>
        {uploadError && <p role="alert" className="mt-2 text-sm text-red-600">{uploadError}</p>}
        {state.gallery.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {state.gallery.map((url) => (
              <div key={url} className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                <img src={url} alt="Project gallery" className="h-28 w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => setState((current) => ({ ...current, image: url }))}
                    className="text-xs text-accent-600 hover:underline"
                  >
                    {state.image === url ? 'Cover image' : 'Set as cover'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setState((current) => {
                      const gallery = current.gallery.filter((item) => item !== url);
                      return { ...current, gallery, image: current.image === url ? gallery[0] || '' : current.image };
                    })}
                    aria-label="Remove image"
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Cover image</Label>
          <p className="truncate py-3 text-sm text-gray-500">{state.image || 'Upload an image and set it as cover'}</p>
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
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={state.tags.join(', ')}
          onChange={(e) => setState((s) => ({ ...s, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
          placeholder="React, Node.js, MongoDB"
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
