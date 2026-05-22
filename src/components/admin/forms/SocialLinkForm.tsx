'use client';

import { useState } from 'react';
import { Button, Input, Label, Spinner } from '../ui';

type SocialLinkInput = {
  label: string;
  url: string;
  icon: string;
  order: number;
  published: boolean;
};

export function SocialLinkForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<SocialLinkInput>;
  onSubmit: (v: SocialLinkInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [state, setState] = useState<SocialLinkInput>({
    label: initial?.label || '',
    url: initial?.url || '',
    icon: initial?.icon || '',
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
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={state.label} onChange={(e) => setState((s) => ({ ...s, label: e.target.value }))} required placeholder="GitHub, LinkedIn, …" />
        </div>
        <div>
          <Label htmlFor="icon">Icon key</Label>
          <Input id="icon" value={state.icon} onChange={(e) => setState((s) => ({ ...s, icon: e.target.value }))} placeholder="github, linkedin, twitter" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" type="url" value={state.url} onChange={(e) => setState((s) => ({ ...s, url: e.target.value }))} required placeholder="https://…" />
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input id="order" type="number" value={state.order} onChange={(e) => setState((s) => ({ ...s, order: Number(e.target.value) }))} />
        </div>
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
