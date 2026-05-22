import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const LOCALES = ["en", "fr", "es"] as const;
const DEFAULT_LOCALE = "en";
const SESSION_COOKIE = "ck_admin_session";

const intlMiddleware = createMiddleware({
  locales: LOCALES as unknown as string[],
  defaultLocale: DEFAULT_LOCALE,
});

function getSecret(): Uint8Array | null {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function localeFromPath(pathname: string): string {
  const seg = pathname.split("/")[1];
  return (LOCALES as readonly string[]).includes(seg) ? seg : DEFAULT_LOCALE;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const authed = await isAuthenticated(req);
    if (!authed) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  const adminMatch = pathname.match(/^\/(en|fr|es)\/admin(\/.*)?$/);
  if (adminMatch) {
    const sub = adminMatch[2] || "";
    const isLogin = sub.startsWith("/login");
    const authed = await isAuthenticated(req);
    if (!authed && !isLogin) {
      const locale = adminMatch[1];
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (authed && isLogin) {
      const locale = adminMatch[1];
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/admin`;
      url.search = "";
      return NextResponse.redirect(url);
    }
    return intlMiddleware(req);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = req.nextUrl.clone();
    const locale = localeFromPath(pathname) || DEFAULT_LOCALE;
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|fr|es)/:path*", "/admin/:path*", "/api/admin/:path*"],
};
