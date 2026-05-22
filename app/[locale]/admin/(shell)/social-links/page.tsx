'use client';

import { useState } from 'react';
import { CrudList } from '@/components/admin/CrudList';
import { Modal } from '@/components/admin/Modal';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import { SocialLinkForm } from '@/components/admin/forms/SocialLinkForm';
import { ExternalLink } from 'lucide-react';

type SocialLink = {
  _id: string;
  label: string;
  url: string;
  icon: string;
  order: number;
  published: boolean;
};

export default function SocialLinksAdminPage() {
  const { items, loading, create, update, remove } = useCrud<SocialLink>('/api/admin/social-links');
  const [editing, setEditing] = useState<SocialLink | 'new' | null>(null);

  const onDelete = async (s: SocialLink) => {
    if (!confirm(`Delete "${s.label}"?`)) return;
    await remove(s._id);
  };

  const onSubmit = async (payload: Partial<SocialLink>) => {
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
      <CrudList<SocialLink>
        title="Social links"
        subtitle="Profiles displayed across the site"
        items={items}
        loading={loading}
        onCreate={() => setEditing('new')}
        onEdit={setEditing}
        onDelete={onDelete}
        columns={[
          { key: 'label', header: 'Label', render: (s) => <span className="font-medium">{s.label}</span> },
          { key: 'icon', header: 'Icon', render: (s) => <Badge tone="neutral">{s.icon || '—'}</Badge> },
          {
            key: 'url',
            header: 'URL',
            render: (s) => (
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent-600 hover:underline text-xs truncate max-w-xs"
              >
                <span className="truncate">{s.url}</span>
                <ExternalLink size={12} />
              </a>
            ),
          },
          { key: 'order', header: 'Order', render: (s) => <span className="text-gray-500">{s.order}</span> },
        ]}
        emptyTitle="No social links yet"
        emptyHint="Add your profiles (GitHub, LinkedIn, X, …)."
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New social link' : 'Edit social link'}
      >
        {editing && (
          <SocialLinkForm
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={onSubmit}
          />
        )}
      </Modal>
    </>
  );
}
