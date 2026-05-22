import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminShellLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AdminShell locale={locale}>{children}</AdminShell>;
}
