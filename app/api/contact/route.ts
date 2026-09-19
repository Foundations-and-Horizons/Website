import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[char] || char));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message, subject } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const safe = {
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      subject: String(subject || "General Inquiry").trim(),
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from("contact_submissions").insert({
        first_name: safe.firstName,
        last_name: safe.lastName,
        email: safe.email,
        message: safe.message,
        subject: safe.subject,
      });
      if (error) console.error("Contact submission save error:", error);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "stephen.cook@foundationsandhorizons.com",
      replyTo: safe.email,
      subject: `New Contact Form Submission — ${safe.subject}`,
      html: `
        <h2>New message from your website</h2>
        <p><strong>Name:</strong> ${escapeHtml(safe.firstName)} ${escapeHtml(safe.lastName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safe.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(safe.subject)}</p>
        <hr />
        <p>${escapeHtml(safe.message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
