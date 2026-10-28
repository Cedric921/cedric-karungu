import { userAgent } from 'next/server';
import { connectDB, isDbConfigured } from '@/lib/db';
import { AnalyticsEvent, ANALYTICS_TYPES, type AnalyticsType } from '@/lib/models/AnalyticsEvent';
import { getSessionFromCookies } from '@/lib/auth';
import { socialPlatformOf } from '@/lib/analytics';

type TrackPayload = {
  type?: string;
  visitorId?: string;
  path?: string;
  target?: string;
  referrer?: string;
  locale?: string;
};

const clip = (s: unknown, n: number) => (typeof s === 'string' ? s.slice(0, n) : '');

function referrerHost(ref: string, ownHost: string): string {
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '');
    return host === ownHost ? '' : host;
  } catch {
    return '';
  }
}

/** Records a page view, CV download or social link click. Always answers 204 so it never breaks the page. */
export async function POST(req: Request) {
  const done = new Response(null, { status: 204 });
  try {
    if (!isDbConfigured()) return done;
    const ua = userAgent(req);
    if (ua.isBot || !ua.ua) return done;
    // The owner's own visits (logged into the admin) are not counted.
    if (await getSessionFromCookies().catch(() => null)) return done;

    const body = (await req.json().catch(() => ({}))) as TrackPayload;
    const type = body.type as AnalyticsType;
    const visitorId = clip(body.visitorId, 64);
    if (!ANALYTICS_TYPES.includes(type) || !/^[\w-]{8,64}$/.test(visitorId)) return done;

    const target = clip(body.target, 500);
    const platform = type === 'social_click' ? socialPlatformOf(target) : null;
    if (type === 'social_click' && !platform) return done;

    const ownHost = new URL(req.url).hostname.replace(/^www\./, '');
    await connectDB();
    await AnalyticsEvent.create({
      type,
      visitorId,
      path: clip(body.path, 300),
      platform: platform ?? '',
      target,
      referrer: referrerHost(clip(body.referrer, 500), ownHost),
      country: clip(req.headers.get('x-vercel-ip-country'), 2),
      device: ua.device.type || 'desktop',
      locale: clip(body.locale, 5),
    });
  } catch (err) {
    console.error('[track] failed:', err instanceof Error ? err.message : err);
  }
  return done;
}
