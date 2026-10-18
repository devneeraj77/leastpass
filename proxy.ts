import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js 16+ Proxy Request Interceptor (replacement for middleware.ts)
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public route: /admin/login is always accessible
  if (pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "leastpass-super-secure-jwt-secret-key-2026-auth",
    });
    // If already logged in, redirect directly to dashboard
    if (token) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Check token for protected administrator routes
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "leastpass-super-secure-jwt-secret-key-2026-auth",
  });

  // If not authenticated, redirect to /admin/login with callbackUrl
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If authenticated user visits /admin, redirect to /admin/dashboard
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
