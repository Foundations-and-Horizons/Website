import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const hasAccess = req.cookies.get("fh_demo_access")?.value === "1";
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  try {
    const html = readFileSync(join(process.cwd(), "public", "volunteer-hub.html"), "utf-8");
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
