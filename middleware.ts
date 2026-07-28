import { NextRequest, NextResponse } from "next/server";

const PUBLIC_BYPASS = ["/gate", "/api/gate", "/dashboard", "/_next", "/favicon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow dashboard, gate page, API routes, and static assets
  if (PUBLIC_BYPASS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Check for access cookie
  const hasAccess = req.cookies.get("fh_demo_access")?.value === "1";
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
