'use client';

import { useEffect, useState } from 'react';
import { Users, Eye, FileDown, Share2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, Spinner, cn } from './ui';
import { adminFetch } from '@/lib/admin-fetch';
import { platformLabel } from '@/lib/analytics';

type Totals = { visitors: number; pageviews: number; cvDownloads: number; socialClicks: number };
type Top = { key: string; count: number }[];
type Analytics = {
  days: number;
  current: Totals;
  previous: Totals;
  allTime: Totals;
  series: (Totals & { date: string })[];
  social: Top;
  pages: Top;
  referrers: Top;
  countries: Top;
  devices: Top;
};

const RANGES = [7, 30, 90] as const;
const ACCENT = '#a855f7';

const tiles: { key: keyof Totals; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'visitors', label: 'Visitors', Icon: Users },
  { key: 'pageviews', label: 'Page views', Icon: Eye },
  { key: 'cvDownloads', label: 'CV downloads', Icon: FileDown },
  { key: 'socialClicks', label: 'Social clicks', Icon: Share2 },
];

const tick = { fontSize: 11, fill: 'currentColor', opacity: 0.6 };
const tooltipStyle = {
  contentStyle: { background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' },
  labelStyle: { color: ACCENT },
  cursor: { fill: 'rgba(127,127,127,0.08)' },
};
const shortDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

function Delta({ now, before }: { now: number; before: number }) {
  if (!before) return now ? <span className="text-xs text-gray-500">new</span> : null;
  const pct = Math.round(((now - before) / before) * 100);
  const up = pct >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn('inline-flex items-center text-xs font-medium', up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
      <Icon size={12} />
      {Math.abs(pct)}%
    </span>
  );
}

/** Horizontal bars with the value written next to each one. */
function BarList({ rows, label = (k: string) => k, empty }: { rows: Top; label?: (k: string) => string; empty: string }) {
  if (!rows.length) return <p className="text-sm text-gray-500">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.key} className="text-sm" title={`${label(r.key)}: ${r.count}`}>
          <div className="flex justify-between gap-3 mb-1">
            <span className="truncate">{label(r.key)}</span>
            <span className="tabular-nums text-gray-500 dark:text-gray-400">{r.count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5">
            <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: ACCENT }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const countryName = (code: string) => {
  try {
    return new Intl.DisplayNames(undefined, { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
};

export default function AnalyticsPanel() {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    setLoading(true);
    adminFetch<Analytics>(`/api/admin/analytics?days=${days}`).then((res) => {
      if (!live) return;
      setData(res.ok ? res.data : null);
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, [days]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Audience</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visitors, CV downloads and clicks to your social profiles (your own visits while logged in are not counted)
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-white/10 p-0.5 text-xs" role="group" aria-label="Period">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              aria-pressed={days === r}
              className={cn(
                'px-3 py-1.5 rounded-md transition-colors',
                days === r ? 'bg-accent-500/15 text-accent-700 dark:text-accent-300 font-medium' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white',
              )}
            >
              {r} days
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Spinner size={20} />
        </div>
      ) : !data ? (
        <div className="text-sm text-red-500">Failed to load audience statistics.</div>
      ) : (
        <div className={cn('space-y-4 transition-opacity', loading && 'opacity-60')}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {tiles.map(({ key, label, Icon }) => (
              <Card key={key} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
                  <Icon size={16} className="text-gray-400" />
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-semibold tabular-nums">{data.current[key]}</div>
                  <Delta now={data.current[key]} before={data.previous[key]} />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 tabular-nums">{data.allTime[key]} all time</div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-sm font-semibold">Visitors per day</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Unique visitors, last {data.days} days</p>
              <div className="h-56 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series}>
                    <defs>
                      <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={ACCENT} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={shortDate} tick={tick} minTickGap={24} />
                    <YAxis allowDecimals={false} tick={tick} width={28} />
                    <Tooltip {...tooltipStyle} cursor={{ stroke: 'rgba(127,127,127,0.4)' }} labelFormatter={(d) => shortDate(String(d))} />
                    <Area type="monotone" dataKey="visitors" name="Visitors" stroke={ACCENT} strokeWidth={2} fill="url(#gradVisitors)" activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-semibold">CV downloads per day</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {data.current.cvDownloads} downloads, last {data.days} days
              </p>
              <div className="h-56 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.15)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={shortDate} tick={tick} minTickGap={24} />
                    <YAxis allowDecimals={false} tick={tick} width={28} />
                    <Tooltip {...tooltipStyle} labelFormatter={(d) => shortDate(String(d))} />
                    <Bar dataKey="cvDownloads" name="CV downloads" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Social profiles opened</h3>
              <BarList rows={data.social} label={platformLabel} empty="No clicks yet." />
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Top pages</h3>
              <BarList rows={data.pages} empty="No visits yet." />
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Where visitors come from</h3>
              <BarList rows={data.referrers} empty="Only direct visits so far." />
            </Card>
            <Card className="p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold mb-3">Countries</h3>
                <BarList rows={data.countries} label={countryName} empty="No country data yet." />
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-3">Devices</h3>
                <BarList rows={data.devices} label={(k) => k.charAt(0).toUpperCase() + k.slice(1)} empty="No visits yet." />
              </div>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
