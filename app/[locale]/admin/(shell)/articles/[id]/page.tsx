'use client';

import { use } from 'react';
import { ArticleEditor } from '@/components/admin/ArticleEditor';

export default function ArticleEditPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = use(params);
  return <ArticleEditor id={id} locale={locale} />;
}
