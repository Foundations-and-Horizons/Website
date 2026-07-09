"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Consulting", href: "/services" },
  { label: "Education", href: "/education" },
  { label: "Speaking", href: "/speaking" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <nav className="bg-[#2a3db4] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="Foundations & Horizons"
              width={90}
              height={58}
              className="object-contain brightness-0 invert"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-light tracking-wide">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-blue-200 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}

            <div className="relative">
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className="hover:text-blue-200 transition-colors flex items-center gap-1"
              >
                FoundationWorks
                <svg className="w-3 h-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {solutionsOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded shadow-lg py-1 z-50">
                  <Link
                    href="/foundationworks"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm font-medium"
                    onClick={() => setSolutionsOpen(false)}
                  >
                    FoundationWorks Platform
                  </Link>
                  <div className="border-t border-gray-100 my-1" />
                  <Link
                    href="/solutions/volunteer-management"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                    onClick={() => setSolutionsOpen(false)}
                  >
                    FoundationWorks Volunteers
                  </Link>
                  <Link
                    href="/solutions/warehouse-operations"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                    onClick={() => setSolutionsOpen(false)}
                  >
                    FoundationWorks Warehouse
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#2236a0] px-4 pb-4 flex flex-col gap-3 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="hover:text-blue-200 py-1"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/foundationworks" onClick={() => setMobileOpen(false)}
            className="hover:text-blue-200 py-1 font-medium"
          >
            FoundationWorks Platform
          </Link>
          <Link href="/solutions/volunteer-management" onClick={() => setMobileOpen(false)}
            className="hover:text-blue-200 py-1 pl-3"
          >
            → FoundationWorks Volunteers
          </Link>
          <Link href="/solutions/warehouse-operations" onClick={() => setMobileOpen(false)}
            className="hover:text-blue-200 py-1 pl-3"
          >
            → FoundationWorks Warehouse
          </Link>
        </div>
      )}
    </nav>
  );
}
