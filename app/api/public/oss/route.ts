import { unstable_cache } from 'next/cache';
import { ok } from '@/lib/api';
import { fetchOssData, type OssData } from '@/lib/oss';
import snapshot from '@/data/oss-snapshot.json';

// GitHub's unauthenticated limits are low: refresh at most every 6 hours.
const getOss = unstable_cache(fetchOssData, ['oss-contributions'], { revalidate: 6 * 3600, tags: ['oss'] });

/** Open-source contributions (live from GitHub, snapshot when GitHub is unavailable). */
export async function GET() {
  try {
    return ok(await getOss());
  } catch (err) {
    console.error('[oss] live fetch failed, serving snapshot:', err instanceof Error ? err.message : err);
    return ok(snapshot as OssData);
  }
}
