import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const { readFileSync } = await import("fs");
  const { join } = await import("path");

  try {
    const html = readFileSync(join(process.cwd(), "public", "volunteer-hub-demo.html"), "utf-8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
