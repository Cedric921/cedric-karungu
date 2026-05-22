'use client';

import { useState } from 'react';
import { Button, Input, Label, Spinner } from '../ui';

type SkillInput = {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  logoUrl: string;
  order: number;
  published: boolean;
};

const LEVELS: SkillInput['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export function SkillForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<SkillInput>;
  onSubmit: (v: SkillInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState<SkillInput>({
    name: initial?.name || '',
    level: initial?.level || 'Intermediate',
    category: initial?.category || '',
    logoUrl: initial?.logoUrl || '',
    order: initial?.order ?? 0,
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(state);
    setSaving(false);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={state.name} onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))} required placeholder="React, TypeScript, …" />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={state.category} onChange={(e) => setState((s) => ({ ...s, category: e.target.value }))} required placeholder="Frontend, Backend, DevOps" />
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            value={state.level}
            onChange={(e) => setState((s) => ({ ...s, level: e.target.value as SkillInput['level'] }))}
            className="w-full h-10 px-3 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" value={state.order} onChange={(e) => setState((s) => ({ ...s, order: Number(e.target.value) }))} />
        </div>
      </div>

      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input id="logo" value={state.logoUrl} onChange={(e) => setState((s) => ({ ...s, logoUrl: e.target.value }))} placeholder="/images/skills/react.svg" />
      </div>

      <div className="flex items-center gap-6 pt-1">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.published} onChange={(e) => setState((s) => ({ ...s, published: e.target.checked }))} className="rounded border-gray-300" />
          Published
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? <Spinner /> : null} Save</Button>
      </div>
    </form>
  );
}
