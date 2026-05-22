'use client';

import { useState, useMemo } from 'react';
import { CrudList } from '@/components/admin/CrudList';
import { Modal } from '@/components/admin/Modal';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import { SiteContentForm } from '@/components/admin/forms/SiteContentForm';

type SiteContent = {
  _id: string;
  key: string;
  group: string;
  value: { en: string; fr: string; es: string };
  description: string;
};

export default function SiteContentAdminPage() {
  const { items, loading, create, update, remove } = useCrud<SiteContent>('/api/admin/content');
  const [editing, setEditing] = useState<SiteContent | 'new' | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>('all');

  const groups = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.group || 'general'));
    return ['all', ...Array.from(set).sort()];
  }, [items]);

  const filtered = groupFilter === 'all' ? items : items.filter((i) => (i.group || 'general') === groupFilter);

  const onDelete = async (c: SiteContent) => {
    if (!confirm(`Delete "${c.key}"?`)) return;
    await remove(c._id);
  };

  const onSubmit = async (payload: Partial<SiteContent>) => {
    if (editing === 'new') {
      const res = await create(payload);
      if (res.ok) setEditing(null);
    } else if (editing) {
      const res = await update(editing._id, payload);
      if (res.ok) setEditing(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {groups.map((g) => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                groupFilter === g
                  ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500/30'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <CrudList<SiteContent>
          title="Site content"
          subtitle="Editable text snippets across the site"
          items={filtered}
          loading={loading}
          onCreate={() => setEditing('new')}
          onEdit={setEditing}
          onDelete={onDelete}
          columns={[
            {
              key: 'key',
              header: 'Key',
              render: (c) => (
                <div>
                  <div className="font-mono text-xs font-medium">{c.key}</div>
                  {c.description && <div className="text-xs text-gray-500 mt-0.5">{c.description}</div>}
                </div>
              ),
            },
            { key: 'group', header: 'Group', render: (c) => <Badge tone="neutral">{c.group || 'general'}</Badge> },
            {
              key: 'value',
              header: 'Value (EN)',
              render: (c) => (
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-md">
                  {c.value.en?.slice(0, 100) || '—'}
                  {(c.value.en?.length || 0) > 100 ? '…' : ''}
                </div>
              ),
            },
          ]}
          emptyTitle="No content entries"
          emptyHint="Create your first key (e.g. hero.title)."
        />
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New content entry' : 'Edit content entry'}
        size="lg"
      >
        {editing && (
          <SiteContentForm
            isNew={editing === 'new'}
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={onSubmit}
          />
        )}
      </Modal>
    </>
  );
}
