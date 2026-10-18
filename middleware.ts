import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If authenticated user visits /admin, redirect to /admin/dashboard
    if (req.nextUrl.pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || "leastpass-super-secure-jwt-secret-key-2026-auth",
    callbacks: {
      authorized: ({ token, req }) => {
        // /admin/login is always accessible
        if (req.nextUrl.pathname.startsWith("/admin/login")) {
          return true;
        }
        // All other /admin paths require a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard/:path*",
    "/admin/posts/:path*",
    "/admin/settings/:path*",
  ],
};
