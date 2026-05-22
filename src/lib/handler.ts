import { connectDB } from './db';
import { handleError } from './api';
import type { NextResponse } from 'next/server';

/**
 * Wrap an admin handler with DB connection + error handling.
 * Auth is enforced at the middleware boundary.
 */
export function withAdmin<TArgs extends unknown[]>(
  fn: (req: Request, ...args: TArgs) => Promise<NextResponse>
): (req: Request, ...args: TArgs) => Promise<NextResponse> {
  return async (req, ...args) => {
    try {
      await connectDB();
      return await fn(req, ...args);
    } catch (err) {
      return handleError(err);
    }
  };
}

export function withPublic<TArgs extends unknown[]>(
  fn: (req: Request, ...args: TArgs) => Promise<NextResponse>
): (req: Request, ...args: TArgs) => Promise<NextResponse> {
  return async (req, ...args) => {
    try {
      await connectDB();
      return await fn(req, ...args);
    } catch (err) {
      return handleError(err);
    }
  };
}
