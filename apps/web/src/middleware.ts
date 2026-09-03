import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const pathname = req.nextUrl.pathname;

  // Protected dashboard routes
  const isDashboard =
    pathname === "/" ||
    pathname.startsWith("/overview") ||
    pathname.startsWith("/activity") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/languages") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/download");

  if (isDashboard && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" && userId) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/overview/:path*",
    "/activity/:path*",
    "/projects/:path*",
    "/languages/:path*",
    "/settings/:path*",
    "/download/:path*",
    "/login",
  ],
};
