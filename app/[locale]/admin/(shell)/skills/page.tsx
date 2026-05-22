'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CrudList } from '@/components/admin/CrudList';
import { Modal } from '@/components/admin/Modal';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import { SkillForm } from '@/components/admin/forms/SkillForm';

type Skill = {
  _id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  logoUrl: string;
  order: number;
  published: boolean;
};

const levelTone = (l: Skill['level']) =>
  l === 'Expert' ? 'success' : l === 'Advanced' ? 'accent' : l === 'Intermediate' ? 'neutral' : 'warning';

export default function SkillsAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Skill>('/api/admin/skills');
  const [editing, setEditing] = useState<Skill | 'new' | null>(null);

  const onDelete = async (s: Skill) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    await remove(s._id);
  };

  const onSubmit = async (payload: Partial<Skill>) => {
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
      <CrudList<Skill>
        title="Skills"
        subtitle="Tech stack & expertise"
        items={items}
        loading={loading}
        onCreate={() => setEditing('new')}
        onEdit={setEditing}
        onDelete={onDelete}
        columns={[
          {
            key: 'name',
            header: 'Skill',
            render: (s) => (
              <div className="flex items-center gap-2">
                {s.logoUrl ? (
                  <Image src={s.logoUrl} alt="" width={20} height={20} className="rounded-sm" unoptimized />
                ) : (
                  <span className="w-5 h-5 rounded-sm bg-gray-100 dark:bg-white/5" />
                )}
                <span className="font-medium">{s.name}</span>
              </div>
            ),
          },
          { key: 'category', header: 'Category', render: (s) => <Badge tone="neutral">{s.category}</Badge> },
          { key: 'level', header: 'Level', render: (s) => <Badge tone={levelTone(s.level)}>{s.level}</Badge> },
          { key: 'order', header: 'Order', render: (s) => <span className="text-gray-500">{s.order}</span> },
        ]}
        emptyTitle="No skills yet"
        emptyHint="Add your first skill to populate the skills section."
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New skill' : 'Edit skill'}
      >
        {editing && (
          <SkillForm
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={onSubmit}
          />
        )}
      </Modal>
    </>
  );
}
