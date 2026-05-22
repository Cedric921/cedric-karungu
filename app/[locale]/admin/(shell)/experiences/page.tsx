'use client';

import { useState } from 'react';
import { CrudList } from '@/components/admin/CrudList';
import { Modal } from '@/components/admin/Modal';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import { ExperienceForm } from '@/components/admin/forms/ExperienceForm';

type Experience = {
  _id: string;
  role: { en: string; fr: string; es: string };
  company: string;
  period: { en: string; fr: string; es: string };
  location: { en: string; fr: string; es: string };
  description: { en: string; fr: string; es: string };
  order: number;
  published: boolean;
};

export default function ExperiencesAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Experience>('/api/admin/experiences');
  const [editing, setEditing] = useState<Experience | 'new' | null>(null);

  const onDelete = async (x: Experience) => {
    if (!confirm(`Delete experience at "${x.company}"?`)) return;
    await remove(x._id);
  };

  const onSubmit = async (payload: Partial<Experience>) => {
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
      <CrudList<Experience>
        title="Experiences"
        subtitle="Manage your work history"
        items={items}
        loading={loading}
        onCreate={() => setEditing('new')}
        onEdit={setEditing}
        onDelete={onDelete}
        columns={[
          {
            key: 'role',
            header: 'Role',
            render: (x) => (
              <div>
                <div className="font-medium">{x.role.en || '—'}</div>
                <div className="text-xs text-gray-500">{x.company}</div>
              </div>
            ),
          },
          {
            key: 'period',
            header: 'Period',
            render: (x) => <span className="text-gray-600 dark:text-gray-400">{x.period.en || '—'}</span>,
          },
          {
            key: 'location',
            header: 'Location',
            render: (x) => <Badge tone="neutral">{x.location.en || '—'}</Badge>,
          },
          { key: 'order', header: 'Order', render: (x) => <span className="text-gray-500">{x.order}</span> },
        ]}
        emptyTitle="No experiences yet"
        emptyHint="Add your first work experience to populate the timeline."
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New experience' : 'Edit experience'}
        size="lg"
      >
        {editing && (
          <ExperienceForm
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={onSubmit}
          />
        )}
      </Modal>
    </>
  );
}
