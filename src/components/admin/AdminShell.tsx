"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  FolderKanban,
  Briefcase,
  Sparkles,
  Link2,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "./ui";

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
};

function buildNav(locale: string): Item[] {
  const base = `/${locale}/admin`;
  return [
    { href: base, label: "Dashboard", Icon: LayoutDashboard },
    { href: `${base}/messages`, label: "Messages", Icon: Mail },
    { href: `${base}/projects`, label: "Projects", Icon: FolderKanban },
    { href: `${base}/experiences`, label: "Experiences", Icon: Briefcase },
    { href: `${base}/skills`, label: "Skills", Icon: Sparkles },
    { href: `${base}/social-links`, label: "Social links", Icon: Link2 },
    { href: `${base}/content`, label: "Site content", Icon: FileText },
  ];
}

export function AdminShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMobile, setOpenMobile] = useState(false);
  const nav = buildNav(locale);

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) return pathname === href;
    return pathname?.startsWith(href);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white">
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur">
        <Link
          href={`/${locale}/admin`}
          className="font-semibold tracking-tight"
        >
          <span className="text-accent-600">●</span> Admin
        </Link>
        <button
          onClick={() => setOpenMobile((v) => !v)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {openMobile ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-64 shrink-0 h-screen lg:h-screen border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] transition-transform duration-200 lg:translate-x-0",
            openMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="h-full flex flex-col">
            <div className="hidden lg:flex items-center h-14 px-5 border-b border-gray-200 dark:border-white/10">
              <Link
                href={`/${locale}/admin`}
                className="font-semibold tracking-tight"
              >
                <span className="text-accent-600">●</span> Admin
              </Link>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {nav.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpenMobile(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition",
                    isActive(href)
                      ? "bg-accent-500/10 text-accent-700 dark:text-accent-300 ring-1 ring-accent-500/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5",
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-gray-200 dark:border-white/10 space-y-1">
              <Link
                href={`/${locale}`}
                target="_blank"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <ExternalLink size={16} />
                <span>View site</span>
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        {openMobile && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/40"
            onClick={() => setOpenMobile(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
