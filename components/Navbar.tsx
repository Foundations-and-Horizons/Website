"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "How We Help", href: "/services" },
  { label: "Education", href: "/education" },
  { label: "Workshops", href: "/workshops" },
  { label: "Speaking", href: "/speaking" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <nav className="bg-[#2a3db4] text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
            <Image src="/logo.svg" alt="Foundations & Horizons" width={170} height={105} className="object-contain brightness-0 invert" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-200 transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button onClick={() => setSolutionsOpen(!solutionsOpen)} className="hover:text-blue-200 transition-colors flex items-center gap-1">
                FoundationWorks
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {solutionsOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-white text-gray-800 shadow-xl py-2 z-50 border border-gray-100">
                  <Link href="/foundationworks" className="block px-4 py-3 hover:bg-blue-50 text-sm font-semibold" onClick={() => setSolutionsOpen(false)}>
                    FoundationWorks
                    <span className="block text-xs text-gray-500 font-normal mt-1">A tool within Foundations &amp; Horizons</span>
                  </Link>
                  <Link href="/solutions/volunteer-management" className="block px-4 py-3 hover:bg-blue-50 text-sm" onClick={() => setSolutionsOpen(false)}>
                    FoundationWorks Volunteers
                  </Link>
                </div>
              )}
            </div>
            <Link href="/contact" className="bg-white text-[#2a3db4] px-5 py-2.5 font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap">
              Start a Conversation
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#2236a0] px-4 pb-5 pt-2 flex flex-col gap-2 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="py-2 hover:text-blue-200">
              {link.label}
            </Link>
          ))}
          <Link href="/foundationworks" onClick={() => setMobileOpen(false)} className="py-2 font-semibold">FoundationWorks</Link>
          <Link href="/solutions/volunteer-management" onClick={() => setMobileOpen(false)} className="py-2 pl-4">→ Volunteers</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="mt-2 bg-white text-[#2a3db4] px-5 py-3 font-semibold text-center">Start a Conversation</Link>
        </div>
      )}
    </nav>
  );
}
