'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, Badge, Button, Spinner, EmptyState } from '@/components/admin/ui';
import { Modal } from '@/components/admin/Modal';
import { adminFetch } from '@/lib/admin-fetch';
import { Mail, Trash2, Archive, ArchiveRestore, Reply, CheckCheck } from 'lucide-react';

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  locale?: string;
  emailSent?: boolean;
  emailError?: string;
  userAgent?: string;
  ip?: string;
  createdAt: string;
};

type Filter = 'all' | 'unread' | 'read' | 'archived';

export default function MessagesPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Message | null>(null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async (f: Filter) => {
    setLoading(true);
    const qs = f === 'all' ? '' : `?status=${f}`;
    const res = await adminFetch<{ items: Message[]; unread: number }>(`/api/admin/messages${qs}`);
    if (res.ok) {
      setItems(res.data.items);
      setUnread(res.data.unread);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const openMessage = async (m: Message) => {
    setSelected({ ...m, read: true });
    if (!m.read) {
      await adminFetch(`/api/admin/messages/${m._id}`, { method: 'PATCH', body: JSON.stringify({ read: true }) });
      setItems((prev) => prev.map((it) => (it._id === m._id ? { ...it, read: true } : it)));
      setUnread((u) => Math.max(0, u - 1));
    }
  };

  const toggleArchive = async (m: Message) => {
    const next = !m.archived;
    const res = await adminFetch<Message>(`/api/admin/messages/${m._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: next }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it._id === m._id ? { ...it, archived: next } : it)));
      if (selected?._id === m._id) setSelected({ ...m, archived: next });
    }
  };

  const remove = async (m: Message) => {
    if (!confirm('Delete this message permanently?')) return;
    const res = await adminFetch(`/api/admin/messages/${m._id}`, { method: 'DELETE' });
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it._id !== m._id));
      if (selected?._id === m._id) setSelected(null);
    }
  };

  const markAllRead = async () => {
    const unreadOnes = items.filter((m) => !m.read);
    await Promise.all(
      unreadOnes.map((m) =>
        adminFetch(`/api/admin/messages/${m._id}`, { method: 'PATCH', body: JSON.stringify({ read: true }) })
      )
    );
    setItems((prev) => prev.map((it) => ({ ...it, read: true })));
    setUnread(0);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FilterTabs value={filter} onChange={setFilter} />
          <Button variant="secondary" size="sm" onClick={markAllRead} disabled={unread === 0}>
            <CheckCheck size={14} /> Mark all read
          </Button>
        </div>
      </header>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Spinner size={18} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No messages" hint="When visitors submit the contact form, they appear here." />
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-white/5">
            {items.map((m) => (
              <li key={m._id}>
                <button
                  onClick={() => openMessage(m)}
                  className="w-full text-left px-4 sm:px-5 py-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${m.read ? 'bg-gray-300 dark:bg-white/20' : 'bg-accent-500'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{m.subject}</span>
                      {m.archived && <Badge tone="neutral">archived</Badge>}
                      {m.emailSent === false && <Badge tone="warning">email failed</Badge>}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {m.name} · {m.email}
                    </div>
                    <div className="text-xs text-gray-400 truncate mt-1">
                      {m.message.slice(0, 120)}
                      {m.message.length > 120 ? '…' : ''}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <MessageModal
        message={selected}
        onClose={() => setSelected(null)}
        onArchive={toggleArchive}
        onDelete={remove}
      />
    </div>
  );
}

function FilterTabs({ value, onChange }: { value: Filter; onChange: (v: Filter) => void }) {
  const items: { v: Filter; label: string }[] = [
    { v: 'all', label: 'All' },
    { v: 'unread', label: 'Unread' },
    { v: 'read', label: 'Read' },
    { v: 'archived', label: 'Archived' },
  ];
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-0.5">
      {items.map((it) => (
        <button
          key={it.v}
          onClick={() => onChange(it.v)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            value === it.v
              ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

function MessageModal({
  message,
  onClose,
  onArchive,
  onDelete,
}: {
  message: Message | null;
  onClose: () => void;
  onArchive: (m: Message) => void;
  onDelete: (m: Message) => void;
}) {
  if (!message) return null;
  return (
    <Modal open={!!message} onClose={onClose} title={message.subject} size="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="font-medium">{message.name}</div>
            <a href={`mailto:${message.email}`} className="text-sm text-accent-600 hover:underline">
              {message.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {message.locale && <Badge tone="neutral">{message.locale}</Badge>}
            <span>{new Date(message.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] p-4 whitespace-pre-wrap text-sm leading-relaxed">
          {message.message}
        </div>
        {message.emailError && (
          <div className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            Email delivery error: {message.emailError}
          </div>
        )}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="secondary" size="sm" onClick={() => onArchive(message)}>
            {message.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            {message.archived ? 'Unarchive' : 'Archive'}
          </Button>
          <a
            href={`mailto:${message.email}?subject=Re:%20${encodeURIComponent(message.subject)}`}
            className="inline-flex items-center gap-2 h-8 px-3 text-xs font-medium rounded-lg bg-accent-600 hover:bg-accent-500 text-white"
          >
            <Reply size={14} /> Reply
          </a>
          <Button variant="danger" size="sm" onClick={() => onDelete(message)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
