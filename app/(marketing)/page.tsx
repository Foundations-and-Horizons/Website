import Link from "next/link";

const pillars = [
  {
    title: "Consulting",
    desc: "Strategy, operations, leadership, boards, and process improvement — built on real nonprofit experience, not theory.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    href: "/services",
  },
  {
    title: "FoundationWorks",
    desc: "Custom nonprofit software you own outright. No subscriptions, no dependencies. Built for how nonprofits actually operate.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    href: "/foundationworks",
  },
  {
    title: "Education",
    desc: "Practical resources including the book Strong Foundations, Higher Horizons and four free downloadable guides for nonprofit leaders.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    href: "/education",
  },
  {
    title: "Speaking",
    desc: "Featured speaker at the Nonprofit Alliance Elevate Conference two years running. Topics cover operations, systems, leadership, and volunteer management.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    href: "/speaking",
  },
];

const credibilityPoints = [
  {
    label: "Military Veteran",
    detail: "Retired U.S. military — discipline, systems thinking, and operational rigor applied to nonprofit leadership.",
  },
  {
    label: "Nonprofit Operations",
    detail: "Director of Operations for both global and local nonprofits — built and scaled real systems that allowed organizations to execute with consistency and reach.",
  },
  {
    label: "Elevate Conference",
    detail: "Featured speaker at the Nonprofit Alliance Elevate Conference two consecutive years.",
  },
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative text-white py-28 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1a2a6e]/75" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Helping Nonprofits Build<br />Foundations That Work.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-10">
            Most nonprofits don&apos;t struggle because they lack passion — they struggle because they lack sustainable systems. We help you build the operational foundation your mission deserves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#2a3db4] px-8 py-4 font-semibold hover:bg-blue-50 transition-colors"
            >
              Work With Us
            </Link>
            <Link
              href="/foundationworks"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
            >
              Explore FoundationWorks
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How We Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group p-6 border border-gray-200 rounded-lg hover:border-[#2a3db4] hover:shadow-md transition-all flex flex-col"
              >
                <div className="text-[#2a3db4] mb-4">{p.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#2a3db4] transition-colors">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>
                <p className="text-[#2a3db4] text-sm font-medium mt-4">Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase text-center mb-10">The Path Forward</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {["Learn", "Consult", "Implement", "Grow"].map((step, i, arr) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center px-6 py-4">
                  <div className="w-12 h-12 rounded-full bg-[#2a3db4] text-white flex items-center justify-center font-bold text-lg mb-2">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-gray-800">{step}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block w-12 h-0.5 bg-[#2a3db4]/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Built by Nonprofit Operators. Trusted by Nonprofit Leaders.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">This work comes from time spent in the field — not from a consulting textbook. Stephen Cook has led nonprofit operations at a global scale and brings that experience directly to your organization.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {credibilityPoints.map((pt) => (
            <div key={pt.label} className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-[#2a3db4] mb-2">{pt.label}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pt.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Build a Stronger Foundation?</h2>
          <p className="text-blue-100 mb-8 text-lg">Let&apos;s talk about where your organization is and where you want it to go.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] px-10 py-4 font-semibold hover:bg-blue-50 transition-colors"
          >
            Start the Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
