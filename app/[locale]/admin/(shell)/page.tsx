'use client';

import { useEffect, useState } from 'react';
import { Card, Badge, Spinner } from '@/components/admin/ui';
import { adminFetch } from '@/lib/admin-fetch';
import {
  Mail,
  FolderKanban,
  Briefcase,
  Sparkles,
  Link2,
  FileText,
  Inbox,
  Archive,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Metrics = {
  counts: {
    messages: number;
    messagesUnread: number;
    messagesArchived: number;
    projects: number;
    experiences: number;
    skills: number;
    socialLinks: number;
    content: number;
  };
  messagesPerDay: { date: string; count: number }[];
  recentMessages: {
    _id: string;
    name: string;
    email: string;
    subject: string;
    read: boolean;
    createdAt: string;
  }[];
};

const cards = [
  { key: 'messages', label: 'Messages', Icon: Mail, tone: 'accent' as const },
  { key: 'projects', label: 'Projects', Icon: FolderKanban, tone: 'neutral' as const },
  { key: 'experiences', label: 'Experiences', Icon: Briefcase, tone: 'neutral' as const },
  { key: 'skills', label: 'Skills', Icon: Sparkles, tone: 'neutral' as const },
  { key: 'socialLinks', label: 'Social links', Icon: Link2, tone: 'neutral' as const },
  { key: 'content', label: 'Site content', Icon: FileText, tone: 'neutral' as const },
];

export default function DashboardPage() {
  const [data, setData] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await adminFetch<Metrics>('/api/admin/metrics');
      if (res.ok) setData(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        <Spinner size={20} />
      </div>
    );
  }
  if (!data) return <div className="text-red-500">Failed to load metrics.</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your portfolio activity
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone="accent">
            <Inbox size={12} className="mr-1" />
            {data.counts.messagesUnread} unread
          </Badge>
          <Badge tone="neutral">
            <Archive size={12} className="mr-1" />
            {data.counts.messagesArchived} archived
          </Badge>
        </div>
      </header>

      {/* Counts grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map(({ key, label, Icon, tone }) => (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
              <Icon size={16} className="text-gray-400" />
            </div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-semibold">
                {data.counts[key as keyof typeof data.counts]}
              </div>
              {key === 'messages' && data.counts.messagesUnread > 0 && (
                <Badge tone={tone}>{data.counts.messagesUnread} new</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Messages — last 30 days</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Daily volume of incoming messages</p>
          </div>
        </div>
        <div className="h-64 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.messagesPerDay}>
              <defs>
                <linearGradient id="gradMsg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }} width={28} />
              <Tooltip
                contentStyle={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }}
                labelStyle={{ color: '#a855f7' }}
              />
              <Area type="monotone" dataKey="count" stroke="#a855f7" strokeWidth={2} fill="url(#gradMsg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent messages */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold mb-3">Recent messages</h2>
        {data.recentMessages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {data.recentMessages.map((m) => (
              <li key={m._id} className="py-3 flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${m.read ? 'bg-gray-300 dark:bg-white/20' : 'bg-accent-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.subject}</div>
                  <div className="text-xs text-gray-500 truncate">{m.name} · {m.email}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
