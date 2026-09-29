'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Link2, Star, Trash2 } from 'lucide-react';
import { Button, Input, cn } from './ui';
import { MAX_PROJECT_IMAGES } from '@/lib/slug';

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE = 20 * 1024 * 1024;
const CONCURRENCY = 3;

type Signature = { cloudName: string; apiKey: string; timestamp: string; folder: string; signature: string };
type Pending = { id: string; name: string; progress: number; error?: string };

type Props = {
  gallery: string[];
  cover: string;
  onChange: (next: { gallery: string[]; image: string }) => void;
  onBusyChange?: (busy: boolean) => void;
};

async function getSignature(): Promise<Signature> {
  const res = await fetch('/api/admin/uploads/projects/sign', { method: 'POST', credentials: 'same-origin' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || 'Could not authorise upload');
  return json.data;
}

function uploadToCloudinary(file: File, sig: Signature, onProgress: (p: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', sig.timestamp);
    form.append('folder', sig.folder);
    form.append('signature', sig.signature);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && typeof body.secure_url === 'string') resolve(body.secure_url);
        else reject(new Error(body.error?.message || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

/**
 * Project gallery editor: multi-file drag & drop straight to Cloudinary
 * (parallel, with progress), add-by-URL, reorder, cover selection, and a
 * hard cap of MAX_PROJECT_IMAGES images.
 */
export function GalleryInput({ gallery, cover, onChange, onBusyChange }: Props) {
  const [pending, setPending] = useState<Pending[]>([]);
  const [notice, setNotice] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  // Latest gallery for async callbacks that resolve after re-renders.
  const galleryRef = useRef(gallery);
  galleryRef.current = gallery;
  const coverRef = useRef(cover);
  coverRef.current = cover;

  const remaining = MAX_PROJECT_IMAGES - gallery.length - pending.filter((p) => !p.error).length;

  const commit = (next: string[], nextCover = coverRef.current) => {
    const image = next.includes(nextCover) ? nextCover : next[0] || '';
    galleryRef.current = next;
    coverRef.current = image;
    onChange({ gallery: next, image });
  };

  const addFiles = async (list: FileList | File[] | null) => {
    const files = Array.from(list || []);
    if (!files.length) return;
    setNotice('');

    const valid = files.filter((f) => ACCEPT.includes(f.type) && f.size > 0 && f.size <= MAX_SIZE);
    const rejected = files.length - valid.length;
    const accepted = valid.slice(0, Math.max(0, remaining));
    const overflow = valid.length - accepted.length;
    const msgs: string[] = [];
    if (rejected) msgs.push(`${rejected} file(s) skipped (JPEG/PNG/WebP/GIF/AVIF up to 20 MB).`);
    if (overflow) msgs.push(`${overflow} file(s) skipped: maximum ${MAX_PROJECT_IMAGES} images per project.`);
    setNotice(msgs.join(' '));
    if (!accepted.length) return;

    const jobs = accepted.map((file) => ({ file, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }));
    setPending((p) => [...p, ...jobs.map((j) => ({ id: j.id, name: j.file.name, progress: 0 }))]);
    onBusyChange?.(true);

    let sig: Signature;
    try {
      sig = await getSignature();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setPending((p) => p.map((x) => (jobs.some((j) => j.id === x.id) ? { ...x, error: message } : x)));
      onBusyChange?.(false);
      return;
    }

    // Keep upload order stable in the gallery even though uploads finish out of order.
    const results: (string | null)[] = new Array(jobs.length).fill(null);
    let cursor = 0;
    const worker = async () => {
      while (cursor < jobs.length) {
        const i = cursor++;
        const job = jobs[i];
        try {
          results[i] = await uploadToCloudinary(job.file, sig, (progress) =>
            setPending((p) => p.map((x) => (x.id === job.id ? { ...x, progress } : x))),
          );
          setPending((p) => p.filter((x) => x.id !== job.id));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed';
          setPending((p) => p.map((x) => (x.id === job.id ? { ...x, error: message } : x)));
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

    const urls = results.filter((u): u is string => !!u);
    if (urls.length) commit([...galleryRef.current, ...urls].slice(0, MAX_PROJECT_IMAGES));
    onBusyChange?.(false);
    if (fileInput.current) fileInput.current.value = '';
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    if (!/^(https?:\/\/|\/)/.test(url)) return setNotice('Image URL must start with https:// or /');
    if (gallery.includes(url)) return setNotice('This image is already in the gallery.');
    if (remaining <= 0) return setNotice(`Maximum ${MAX_PROJECT_IMAGES} images per project.`);
    setNotice('');
    commit([...gallery, url]);
    setUrlDraft('');
  };

  const move = (index: number, delta: number) => {
    const to = index + delta;
    if (to < 0 || to >= gallery.length) return;
    const next = [...gallery];
    [next[index], next[to]] = [next[to], next[index]];
    commit(next);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition',
          dragOver ? 'border-accent-500 bg-accent-500/5' : 'border-gray-200 dark:border-white/10',
          remaining <= 0 && 'opacity-60',
        )}
      >
        <ImagePlus className="text-accent-500" size={22} />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Drop images here or{' '}
          <button
            type="button"
            disabled={remaining <= 0}
            onClick={() => fileInput.current?.click()}
            className="font-medium text-accent-600 hover:underline disabled:cursor-not-allowed disabled:no-underline"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          {gallery.length}/{MAX_PROJECT_IMAGES} images · select several at once · JPEG, PNG, WebP, GIF, AVIF up to 20 MB
        </p>
        <input
          ref={fileInput}
          id="project-images"
          type="file"
          accept={ACCEPT.join(',')}
          multiple
          hidden
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="…or paste an image URL"
            className="pl-8"
          />
        </div>
        <Button type="button" variant="secondary" onClick={addUrl} disabled={remaining <= 0}>
          Add
        </Button>
      </div>

      {notice && (
        <p role="alert" className="text-sm text-amber-600 dark:text-amber-400">
          {notice}
        </p>
      )}

      {pending.length > 0 && (
        <ul className="space-y-1.5">
          {pending.map((p) => (
            <li key={p.id} className="text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-gray-600 dark:text-gray-300">{p.name}</span>
                {p.error ? (
                  <button
                    type="button"
                    onClick={() => setPending((all) => all.filter((x) => x.id !== p.id))}
                    className="shrink-0 text-red-600 hover:underline"
                  >
                    {p.error} · dismiss
                  </button>
                ) : (
                  <span className="shrink-0 tabular-nums text-gray-500">{Math.round(p.progress * 100)}%</span>
                )}
              </div>
              {!p.error && (
                <div className="mt-1 h-1 overflow-hidden rounded bg-gray-100 dark:bg-white/10">
                  <div className="h-full bg-accent-500 transition-[width]" style={{ width: `${p.progress * 100}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {gallery.length > 0 && (
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((url, i) => {
            const isCover = cover === url;
            return (
              <li
                key={url}
                className={cn(
                  'group overflow-hidden rounded-lg border',
                  isCover ? 'border-accent-500 ring-2 ring-accent-500/30' : 'border-gray-200 dark:border-white/10',
                )}
              >
                <div className="relative">
                  <img src={url} alt={`Project image ${i + 1}`} className="h-28 w-full object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {isCover && (
                    <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-accent-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      <Star size={10} fill="currentColor" /> Cover
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <div className="flex">
                    <IconBtn label="Move left" onClick={() => move(i, -1)} disabled={i === 0}>
                      <ArrowLeft size={14} />
                    </IconBtn>
                    <IconBtn label="Move right" onClick={() => move(i, 1)} disabled={i === gallery.length - 1}>
                      <ArrowRight size={14} />
                    </IconBtn>
                  </div>
                  <div className="flex">
                    {!isCover && (
                      <IconBtn label="Set as cover" onClick={() => commit(gallery, url)}>
                        <Star size={14} />
                      </IconBtn>
                    )}
                    <IconBtn label="Remove image" danger onClick={() => commit(gallery.filter((u) => u !== url))}>
                      <Trash2 size={14} />
                    </IconBtn>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-md p-1.5 transition disabled:opacity-30',
        danger
          ? 'text-red-600 hover:bg-red-500/10'
          : 'text-gray-500 hover:bg-gray-100 hover:text-accent-600 dark:hover:bg-white/10',
      )}
    >
      {children}
    </button>
  );
}
