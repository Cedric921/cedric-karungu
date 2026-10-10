'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { CrudList } from '@/components/admin/CrudList';
import { Badge } from '@/components/admin/ui';
import { useCrud } from '@/components/admin/useCrud';

type Lz = { en: string; fr: string; es: string };
type ArticleRow = {
  _id: string;
  title: Lz;
  slug: string;
  excerpt: Lz;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  readingMinutes: number;
  updatedAt: string;
};

const firstOf = (v: Lz) => v?.en || v?.fr || v?.es || '';

export default function ArticlesAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const { items, loading, remove } = useCrud<ArticleRow>('/api/admin/articles');

  return (
    <CrudList<ArticleRow>
      title="Articles"
      subtitle="Write and publish on your blog"
      items={items}
      loading={loading}
      onCreate={() => router.push(`/${locale}/admin/articles/new`)}
      onEdit={(a) => router.push(`/${locale}/admin/articles/${a._id}`)}
      onDelete={async (a) => {
        if (confirm(`Delete "${firstOf(a.title) || 'this article'}"? This cannot be undone.`)) await remove(a._id);
      }}
      columns={[
        {
          key: 'title',
          header: 'Title',
          render: (a) => (
            <div>
              <div className="font-medium">{firstOf(a.title) || 'Untitled'}</div>
              <div className="max-w-md truncate text-xs text-gray-500">{firstOf(a.excerpt) || `/${a.slug}`}</div>
            </div>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (a) => <Badge tone={a.published ? 'success' : 'neutral'}>{a.published ? 'Published' : 'Draft'}</Badge>,
        },
        {
          key: 'date',
          header: 'Date',
          render: (a) => (
            <span className="text-xs text-gray-500">
              {new Date(a.publishedAt || a.updatedAt).toLocaleDateString()} · {a.readingMinutes || 1} min
            </span>
          ),
        },
        {
          key: 'langs',
          header: 'Languages',
          render: (a) => (
            <div className="flex gap-1">
              {(['en', 'fr', 'es'] as const).filter((l) => a.title?.[l]).map((l) => (
                <Badge key={l} tone="accent">{l.toUpperCase()}</Badge>
              ))}
            </div>
          ),
        },
      ]}
      emptyTitle="No articles yet"
      emptyHint="Click “New” to write your first article."
    />
  );
}
