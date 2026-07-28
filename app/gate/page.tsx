"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GatePage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const res = await fetch("/api/gate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1b6e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-blue-300 uppercase mb-2">F&H</p>
          <h1 className="text-2xl font-bold text-white mb-1">Foundations &amp; Horizons</h1>
          <p className="text-blue-300 text-sm">Enter your access code to view the demo.</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wide mb-2">Access Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              placeholder="Enter code"
              autoFocus
              className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${error ? "border-red-400" : "border-white/20"}`}
            />
            {error && <p className="text-red-400 text-xs mt-2">Incorrect code. Please try again.</p>}
          </div>
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-40 shadow-lg"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
        <p className="text-center text-blue-400/50 text-xs mt-6">Don't have a code? Contact stephen@foundationsandhorizons.com</p>
      </div>
    </div>
  );
}
