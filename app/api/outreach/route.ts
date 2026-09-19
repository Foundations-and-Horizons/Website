import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[char] || char));
}

export async function POST(req: NextRequest) {
  try {
    const auth = await createClient();
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { to, subject, body, dealId, companyId, contactName } = await req.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const safeTo = String(to).trim();
    const safeSubject = String(subject).trim();
    const safeBody = String(body).trim();

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: "Stephen Cook <stephen.cook@foundationsandhorizons.com>",
      to: safeTo,
      subject: safeSubject,
      html: escapeHtml(safeBody).replace(/\n/g, "<br />"),
      replyTo: "stephen.cook@foundationsandhorizons.com",
    });
    if (emailError) {
      console.error("Outreach send error:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey && dealId) {
      const supabase = createAdminClient(supabaseUrl, supabaseKey);
      const { error: logError } = await supabase.from("activities").insert({
        deal_id: dealId,
        company_id: companyId || null,
        type: "email",
        subject: safeSubject,
        body: `To: ${contactName || safeTo}\n\n${safeBody}`,
        occurred_at: new Date().toISOString(),
      });
      if (logError) console.error("Outreach activity log error:", logError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Outreach email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
