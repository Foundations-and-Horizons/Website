"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#10213f] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#e86f51]/20 blur-3xl" /><div className="absolute -left-24 bottom-[-80px] h-72 w-72 rounded-full bg-[#a7d8c8]/15 blur-3xl" /><div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#f2a18c] mb-3">Private workspace</p><h1 className="font-serif text-3xl text-white">Foundations &amp; Horizons</h1>
          <p className="text-white/45 text-sm mt-2">Command Center</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#fcfbf8] rounded-[24px] shadow-2xl p-8 space-y-4 border border-white/10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2448d8]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2448d8]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2448d8] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#10213f] transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
