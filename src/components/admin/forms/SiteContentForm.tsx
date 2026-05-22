'use client';

import { useState } from 'react';
import { Button, Input, Label, Textarea, Spinner } from '../ui';
import { LocaleTabs, type Localized } from '../LocaleTabs';

type SiteContentInput = {
  key: string;
  group: string;
  value: Localized;
  description: string;
};

const emptyLz: Localized = { en: '', fr: '', es: '' };

export function SiteContentForm({
  initial,
  onSubmit,
  onCancel,
  isNew,
}: {
  initial?: Partial<SiteContentInput>;
  onSubmit: (v: SiteContentInput) => Promise<void>;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [state, setState] = useState<SiteContentInput>({
    key: initial?.key || '',
    group: initial?.group || 'general',
    value: initial?.value || emptyLz,
    description: initial?.description || '',
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
          <Label htmlFor="key">Key</Label>
          <Input
            id="key"
            value={state.key}
            onChange={(e) => setState((s) => ({ ...s, key: e.target.value }))}
            placeholder="hero.title"
            required
            disabled={!isNew}
          />
        </div>
        <div>
          <Label htmlFor="group">Group</Label>
          <Input
            id="group"
            value={state.group}
            onChange={(e) => setState((s) => ({ ...s, group: e.target.value }))}
            placeholder="hero, about, contact"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description (admin-only helper)</Label>
        <Input
          id="description"
          value={state.description}
          onChange={(e) => setState((s) => ({ ...s, description: e.target.value }))}
          placeholder="Short note about where this is shown"
        />
      </div>

      <LocaleTabs
        label="Value"
        value={state.value}
        onChange={(v) => setState((s) => ({ ...s, value: v }))}
        renderInput={(l, v, set) => <Textarea rows={4} value={v} onChange={(e) => set(e.target.value)} required={l === 'en'} />}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? <Spinner /> : null} Save</Button>
      </div>
    </form>
  );
}
