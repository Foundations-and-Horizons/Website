"use client";
import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function ContactForm({ subject }: { subject?: string }) {
  const [form, setForm] = useState<FormData>({ firstName: "", lastName: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject }),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-[#2a3db4] text-xl font-semibold mb-2">Thank you for reaching out!</p>
        <p className="text-gray-600">We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              placeholder="First Name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full border-b border-gray-400 bg-transparent py-2 text-sm focus:outline-none focus:border-[#2a3db4]"
            />
            <span className="text-xs text-gray-400">First Name (required)</span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full border-b border-gray-400 bg-transparent py-2 text-sm focus:outline-none focus:border-[#2a3db4]"
            />
            <span className="text-xs text-gray-400">Last Name (required)</span>
          </div>
        </div>
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border-b border-gray-400 bg-transparent py-2 text-sm focus:outline-none focus:border-[#2a3db4]"
        />
        <span className="text-xs text-gray-400">Email (required)</span>
      </div>
      <div>
        <textarea
          placeholder="Message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border-b border-gray-400 bg-transparent py-2 text-sm focus:outline-none focus:border-[#2a3db4] resize-none"
        />
        <span className="text-xs text-gray-400">Message (required)</span>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-[#2a3db4] text-[#2a3db4] px-6 py-2 text-sm hover:bg-[#2a3db4] hover:text-white transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
