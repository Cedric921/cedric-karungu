import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'ck_admin_session';
const DEFAULT_EXPIRES = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long');
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // user id
  email: string;
  role: 'admin';
};

function parseExpiresToSeconds(input: string | undefined): number {
  const v = (input || DEFAULT_EXPIRES).trim();
  const m = v.match(/^([0-9]+)([smhd])$/);
  if (!m) return 7 * 24 * 60 * 60;
  const n = Number(m[1]);
  const unit = m[2];
  const mult = unit === 's' ? 1 : unit === 'm' ? 60 : unit === 'h' ? 3600 : 86400;
  return n * mult;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const exp = parseExpiresToSeconds(process.env.JWT_EXPIRES_IN);
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${exp}s`)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload && typeof payload === 'object' && 'sub' in payload && 'email' in payload) {
      return {
        sub: String(payload.sub),
        email: String(payload.email),
        role: 'admin',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function setSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  const exp = parseExpiresToSeconds(process.env.JWT_EXPIRES_IN);
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: exp,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSessionFromCookies();
  if (!session) {
    throw new AuthError('Unauthorized', 401);
  }
  return session;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
