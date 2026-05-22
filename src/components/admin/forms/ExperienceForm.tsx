'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea, Spinner } from '../ui';
import { LocaleTabs, type Localized } from '../LocaleTabs';

type ExperienceInput = {
  role: Localized;
  company: string;
  period: Localized;
  location: Localized;
  description: Localized;
  order: number;
  published: boolean;
};

const emptyLz: Localized = { en: '', fr: '', es: '' };

export function ExperienceForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ExperienceInput>;
  onSubmit: (v: ExperienceInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState<ExperienceInput>({
    role: initial?.role || emptyLz,
    company: initial?.company || '',
    period: initial?.period || emptyLz,
    location: initial?.location || emptyLz,
    description: initial?.description || emptyLz,
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
      <LocaleTabs
        label="Role"
        value={state.role}
        onChange={(v) => setState((s) => ({ ...s, role: v }))}
        renderInput={(l, v, set) => <Input value={v} onChange={(e) => set(e.target.value)} required={l === 'en'} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" value={state.company} onChange={(e) => setState((s) => ({ ...s, company: e.target.value }))} required />
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" value={state.order} onChange={(e) => setState((s) => ({ ...s, order: Number(e.target.value) }))} />
        </div>
      </div>

      <LocaleTabs
        label="Period"
        value={state.period}
        onChange={(v) => setState((s) => ({ ...s, period: v }))}
        renderInput={(l, v, set) => <Input value={v} onChange={(e) => set(e.target.value)} placeholder="Jan 2023 — Present" required={l === 'en'} />}
      />
      <LocaleTabs
        label="Location"
        value={state.location}
        onChange={(v) => setState((s) => ({ ...s, location: v }))}
        renderInput={(l, v, set) => <Input value={v} onChange={(e) => set(e.target.value)} placeholder="Remote, Kigali, …" required={l === 'en'} />}
      />
      <LocaleTabs
        label="Description"
        value={state.description}
        onChange={(v) => setState((s) => ({ ...s, description: v }))}
        renderInput={(l, v, set) => <Textarea rows={4} value={v} onChange={(e) => set(e.target.value)} required={l === 'en'} />}
      />

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
