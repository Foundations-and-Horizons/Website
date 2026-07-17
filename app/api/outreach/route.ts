import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body, dealId, companyId, contactName } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Stephen Cook <stephen.cook@foundationsandhorizons.com>",
      to,
      subject,
      html: body.replace(/\n/g, "<br />"),
      replyTo: "stephen.cook@foundationsandhorizons.com",
    });

    // Log as activity in the deal timeline
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey && dealId) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("activities").insert({
        deal_id: dealId,
        company_id: companyId || null,
        type: "email",
        subject,
        body: `To: ${contactName || to}\n\n${body}`,
        occurred_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Outreach email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
