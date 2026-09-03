import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  const pathname = req.nextUrl.pathname;

  // Ignore static assets & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/downloads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Jika sudah login dan mencoba buka /login, lempar ke /overview
  if (pathname === "/login" && userId) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // Jika belum login dan buka halaman selain /login, lempar ke /login
  if (pathname !== "/login" && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Jika sudah login dan buka root (/), lempar ke /overview
  if (pathname === "/" && userId) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
