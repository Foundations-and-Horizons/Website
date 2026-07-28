import { NextRequest, NextResponse } from "next/server";

const ACCESS_CODE = "F&H Volunteer";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (code?.trim() === ACCESS_CODE) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("fh_demo_access", "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid code" }, { status: 401 });
}
