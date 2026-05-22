'use client';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function adminFetch<T = unknown>(
  url: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      credentials: 'same-origin',
    });
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        const parts = window.location.pathname.split('/');
        const locale = ['en', 'fr', 'es'].includes(parts[1]) ? parts[1] : 'en';
        window.location.href = `/${locale}/admin/login`;
      }
      return { ok: false, error: 'Unauthorized' };
    }
    const json = (await res.json()) as ApiResult<T>;
    return json;
  } catch (e) {
    const msg = (e as { message?: string })?.message || 'Network error';
    return { ok: false, error: msg };
  }
}
