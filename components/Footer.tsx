import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#17245a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <p className="font-semibold text-lg">Foundations &amp; Horizons</p>
            <p className="text-blue-200 text-sm mt-2 leading-relaxed max-w-sm">Helping nonprofits build strong operations so their missions can depend on systems, not heroics.</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href="/services" className="hover:text-blue-200">How We Help</Link>
            <Link href="/education" className="hover:text-blue-200">Education</Link>
            <Link href="/workshops" className="hover:text-blue-200">Workshops</Link>
            <Link href="/speaking" className="hover:text-blue-200">Speaking</Link>
            <Link href="/foundationworks" className="hover:text-blue-200">FoundationWorks</Link>
            <Link href="/about" className="hover:text-blue-200">About</Link>
            <Link href="/tools" className="hover:text-blue-200">Free Tools</Link>
            <Link href="/contact" className="hover:text-blue-200">Contact</Link>
          </div>
          <div className="md:text-right text-sm text-blue-200">
            <p>© {new Date().getFullYear()} Foundations &amp; Horizons</p>
            <p className="mt-1">Systems, Not Heroics.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
