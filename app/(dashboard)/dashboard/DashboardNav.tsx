"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Command Center", mark: "01", exact: true },
  { href: "/dashboard/prospecting", label: "Prospecting", mark: "02" },
  { href: "/dashboard/inquiries", label: "Inquiries", mark: "03" },
  { href: "/dashboard/tasks", label: "Work Queue", mark: "04" },
  { href: "/dashboard/deals", label: "Relationships", mark: "05" },
  { href: "/dashboard/companies", label: "Organizations", mark: "06" },
  { href: "/dashboard/contacts", label: "People", mark: "07" },
  { href: "/dashboard/linkedin", label: "Visibility", mark: "08" },
  { href: "/dashboard/books", label: "Book", mark: "09" },
  { href: "/dashboard/finance", label: "Business Health", mark: "10" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-[260px] bg-[#10213f] text-white flex-col shrink-0 min-h-screen sticky top-0 h-screen">
      <div className="px-6 pt-5 pb-5 border-b border-white/10">
        <Link href="/" className="block w-[128px]">
          <Image src="/logo.svg" alt="Foundations & Horizons" width={128} height={68} className="w-[128px] h-[62px] object-contain brightness-0 invert" />
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a7d8c8]" />
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">Private workspace</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm transition-all ${active ? "bg-white text-[#10213f] font-bold shadow-sm" : "text-white/65 hover:bg-white/[.07] hover:text-white"}`}>
              <span className={`text-[9px] font-bold tracking-wider ${active ? "text-[#e86f51]" : "text-white/25 group-hover:text-white/45"}`}>{item.mark}</span>
              <span>{item.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e86f51]" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
        <p className="font-serif text-base leading-snug text-white">Systems, not heroics.</p>
        <p className="mt-2 text-[11px] leading-5 text-white/40">The operating system behind Foundations & Horizons.</p>
      </div>
      <div className="px-4 pb-5">
        <button onClick={handleSignOut} className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-white/40 hover:text-white transition">Sign out →</button>
      </div>
    </aside>
  );
}
