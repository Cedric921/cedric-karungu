import { NextResponse } from 'next/server';
import { AuthError } from './auth';

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function handleError(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return fail(err.message, err.status);
  }
  if (err && typeof err === 'object' && 'message' in err) {
    const m = String((err as { message: unknown }).message);
    console.error('[api] error:', m);
    return fail(m, 500);
  }
  console.error('[api] unknown error:', err);
  return fail('Internal server error', 500);
}

export async function readJson<T = unknown>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error('Invalid JSON body');
  }
}
