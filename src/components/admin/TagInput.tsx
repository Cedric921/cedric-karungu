'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from './ui';
import { normalizeTags } from '@/lib/slug';

type Props = {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
};

/**
 * Chip-style tag editor. Enter, comma or Tab commits the current text,
 * Backspace on an empty field removes the last tag, and pasting a
 * comma/newline-separated list adds every entry at once.
 */
export function TagInput({ id, value, onChange, suggestions = [], placeholder }: Props) {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const add = (raw: string) => {
    const parts = raw.split(/[,\n]/);
    const next = normalizeTags([...value, ...parts]);
    if (next.length !== value.length) onChange(next);
    setDraft('');
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  const matches = useMemo(() => {
    const q = draft.trim().toLowerCase();
    const taken = new Set(value.map((t) => t.toLowerCase()));
    return normalizeTags(suggestions)
      .filter((s) => !taken.has(s.toLowerCase()) && (!q || s.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [draft, suggestions, value]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || (e.key === 'Tab' && draft.trim())) && !e.nativeEvent.isComposing) {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 text-sm transition dark:bg-white/5',
          focused
            ? 'border-accent-500 ring-2 ring-accent-500/40'
            : 'border-gray-200 dark:border-white/10',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-accent-500/10 py-0.5 pl-2 pr-1 text-xs font-medium text-accent-700 ring-1 ring-accent-500/20 dark:text-accent-300"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(tag);
              }}
              aria-label={`Remove ${tag}`}
              className="rounded p-0.5 hover:bg-accent-500/20"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          value={draft}
          onChange={(e) => {
            const v = e.target.value;
            if (/[,\n]/.test(v)) add(v);
            else setDraft(v);
          }}
          onKeyDown={onKeyDown}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text');
            if (/[,\n]/.test(text)) {
              e.preventDefault();
              add(draft + text);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (draft.trim()) add(draft);
          }}
          aria-autocomplete="list"
          aria-controls={listId}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
        />
      </div>
      {focused && matches.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-900"
        >
          {matches.map((s) => (
            <li key={s} role="option" aria-selected={false}>
              <button
                type="button"
                // mousedown so the click lands before the input blurs
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(s);
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-accent-500/10 dark:text-gray-200"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add · Backspace removes the last tag · {value.length} tag{value.length === 1 ? '' : 's'}
      </p>
    </div>
  );
}
