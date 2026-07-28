import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const hasAccess = req.cookies.get("fh_demo_access")?.value === "1";
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  const { readFileSync } = await import("fs");
  const { join } = await import("path");

  try {
    const html = readFileSync(join(process.cwd(), "public", "volunteer-hub.html"), "utf-8");
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
