'use client';

import React from 'react';
import { Card, Button, Badge, Spinner, EmptyState } from './ui';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';

export type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
};

type Props<T extends { _id: string; published?: boolean }> = {
  title: string;
  subtitle?: string;
  items: T[];
  loading: boolean;
  columns: Column<T>[];
  onCreate?: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyTitle?: string;
  emptyHint?: string;
};

export function CrudList<T extends { _id: string; published?: boolean }>({
  title,
  subtitle,
  items,
  loading,
  columns,
  onCreate,
  onEdit,
  onDelete,
  emptyTitle = 'No items yet',
  emptyHint,
}: Props<T>) {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus size={16} /> New
          </Button>
        )}
      </header>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-500">
            <Spinner size={18} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title={emptyTitle} hint={emptyHint} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="w-8 px-3 py-2.5"></th>
                  {columns.map((c) => (
                    <th key={c.key} className={`text-left px-3 py-2.5 font-medium ${c.className || ''}`}>
                      {c.header}
                    </th>
                  ))}
                  <th className="w-24 text-right px-3 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    <td className="px-3 py-3 text-gray-300 dark:text-white/20">
                      <GripVertical size={14} />
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={`px-3 py-3 align-top ${c.className || ''}`}>
                        {c.render(item)}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right whitespace-nowrap">
                      {item.published === false && (
                        <Badge tone="warning">draft</Badge>
                      )}
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-accent-600 hover:bg-accent-500/10 ml-1"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-500/10 ml-1"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
