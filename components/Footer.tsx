import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2a3db4] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-light">© {new Date().getFullYear()} Foundations & Horizons. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-blue-200 transition-colors">About</Link>
          <Link href="/services" className="hover:text-blue-200 transition-colors">Services</Link>
          <Link href="/tools" className="hover:text-blue-200 transition-colors">Tools</Link>
          <Link href="/contact" className="hover:text-blue-200 transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
