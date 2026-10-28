import { AnalyticsEvent } from '@/lib/models/AnalyticsEvent';
import { ok } from '@/lib/api';
import { withAdmin } from '@/lib/handler';

const TZ = 'Africa/Kigali';
const DAY = 24 * 3600 * 1000;
const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(d); // YYYY-MM-DD

type Totals = { visitors: number; pageviews: number; cvDownloads: number; socialClicks: number };

async function totals(from: Date, to: Date): Promise<Totals> {
  const [row] = await AnalyticsEvent.aggregate([
    { $match: { createdAt: { $gte: from, $lt: to } } },
    {
      $group: {
        _id: null,
        visitors: { $addToSet: '$visitorId' },
        pageviews: { $sum: { $cond: [{ $eq: ['$type', 'pageview'] }, 1, 0] } },
        cvDownloads: { $sum: { $cond: [{ $eq: ['$type', 'cv_download'] }, 1, 0] } },
        socialClicks: { $sum: { $cond: [{ $eq: ['$type', 'social_click'] }, 1, 0] } },
      },
    },
    { $project: { _id: 0, visitors: { $size: '$visitors' }, pageviews: 1, cvDownloads: 1, socialClicks: 1 } },
  ]);
  return row ?? { visitors: 0, pageviews: 0, cvDownloads: 0, socialClicks: 0 };
}

const topBy = (field: string, match: Record<string, unknown>, limit = 8) =>
  AnalyticsEvent.aggregate<{ key: string; count: number }>([
    { $match: { ...match, [field]: { $ne: '' } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { _id: 0, key: '$_id', count: 1 } },
  ]);

/** Visitors, CV downloads and social clicks over the last `days` days (7, 30 or 90). */
export const GET = withAdmin(async (req) => {
  const asked = Number(new URL(req.url).searchParams.get('days'));
  const days = [7, 30, 90].includes(asked) ? asked : 30;
  const now = new Date();
  const from = new Date(now.getTime() - days * DAY);
  const prevFrom = new Date(from.getTime() - days * DAY);
  const inRange = { createdAt: { $gte: from } };

  const [current, previous, daily, social, pages, referrers, countries, devices, allTime] = await Promise.all([
    totals(from, now),
    totals(prevFrom, from),
    AnalyticsEvent.aggregate<{ _id: string; visitors: number; pageviews: number; cvDownloads: number; socialClicks: number }>([
      { $match: inRange },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
          visitors: { $addToSet: '$visitorId' },
          pageviews: { $sum: { $cond: [{ $eq: ['$type', 'pageview'] }, 1, 0] } },
          cvDownloads: { $sum: { $cond: [{ $eq: ['$type', 'cv_download'] }, 1, 0] } },
          socialClicks: { $sum: { $cond: [{ $eq: ['$type', 'social_click'] }, 1, 0] } },
        },
      },
      { $project: { visitors: { $size: '$visitors' }, pageviews: 1, cvDownloads: 1, socialClicks: 1 } },
    ]),
    topBy('platform', { ...inRange, type: 'social_click' }, 12),
    topBy('path', { ...inRange, type: 'pageview' }),
    topBy('referrer', { ...inRange, type: 'pageview' }),
    topBy('country', { ...inRange, type: 'pageview' }),
    topBy('device', { ...inRange, type: 'pageview' }),
    totals(new Date(0), now),
  ]);

  // One point per day, zeros included, oldest first.
  const byDay = new Map(daily.map((d) => [d._id, d]));
  const series = Array.from({ length: days }, (_, i) => {
    const date = dayKey(new Date(now.getTime() - (days - 1 - i) * DAY));
    const d = byDay.get(date);
    return {
      date,
      visitors: d?.visitors ?? 0,
      pageviews: d?.pageviews ?? 0,
      cvDownloads: d?.cvDownloads ?? 0,
      socialClicks: d?.socialClicks ?? 0,
    };
  });

  return ok({ days, current, previous, allTime, series, social, pages, referrers, countries, devices });
});
