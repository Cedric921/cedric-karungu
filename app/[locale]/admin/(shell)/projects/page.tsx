'use client';

import { useState } from 'react';
import { CrudList } from '@/components/admin/CrudList';
import { Modal } from '@/components/admin/Modal';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';
import { ProjectForm } from '@/components/admin/forms/ProjectForm';

type Project = {
  _id: string;
  title: { en: string; fr: string; es: string };
  description: { en: string; fr: string; es: string };
  category: { en: string; fr: string; es: string };
  image: string;
  link: string;
  githubLink: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  order: number;
};

export default function ProjectsAdminPage() {
  const { items, loading, create, update, remove } = useCrud<Project>('/api/admin/projects');
  const [editing, setEditing] = useState<Project | 'new' | null>(null);

  const onDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title.en || 'this project'}"?`)) return;
    await remove(p._id);
  };

  const onSubmit = async (payload: Partial<Project>) => {
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
      <CrudList<Project>
        title="Projects"
        subtitle="Manage your portfolio projects"
        items={items}
        loading={loading}
        onCreate={() => setEditing('new')}
        onEdit={setEditing}
        onDelete={onDelete}
        columns={[
          {
            key: 'title',
            header: 'Title',
            render: (p) => (
              <div>
                <div className="font-medium">{p.title.en || '—'}</div>
                <div className="text-xs text-gray-500 truncate max-w-md">{p.description.en?.slice(0, 80)}</div>
              </div>
            ),
          },
          {
            key: 'category',
            header: 'Category',
            render: (p) => <Badge tone="neutral">{p.category.en || '—'}</Badge>,
          },
          {
            key: 'tags',
            header: 'Tags',
            render: (p) => (
              <div className="flex flex-wrap gap-1">
                {(p.tags || []).slice(0, 3).map((t) => (
                  <Badge key={t} tone="accent">{t}</Badge>
                ))}
                {p.tags && p.tags.length > 3 && <Badge tone="neutral">+{p.tags.length - 3}</Badge>}
              </div>
            ),
          },
          { key: 'order', header: 'Order', render: (p) => <span className="text-gray-500">{p.order}</span> },
        ]}
        emptyTitle="No projects yet"
        emptyHint="Create your first project to populate the portfolio section."
      />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New project' : 'Edit project'}
        size="lg"
      >
        {editing && (
          <ProjectForm
            initial={editing === 'new' ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={onSubmit}
          />
        )}
      </Modal>
    </>
  );
}
