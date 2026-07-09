import Link from "next/link";

const pillars = [
  {
    title: "Consulting",
    desc: "We work directly with your leadership team to build the clarity, systems, and operational foundation your organization needs to stop surviving and start growing.",
    cta: "See How We Work",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    href: "/services",
  },
  {
    title: "FoundationWorks",
    desc: "Custom software built specifically for nonprofits — and built around the way your organization actually operates. You own it outright. No subscriptions, no vendor lock-in.",
    cta: "Explore the Platform",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    href: "/foundationworks",
  },
  {
    title: "Education",
    desc: "The book Strong Foundations, Higher Horizons plus four free practical guides — frameworks nonprofit leaders can put to work immediately, not inspiration that fades by Monday.",
    cta: "Get the Resources",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    href: "/education",
  },
  {
    title: "Speaking",
    desc: "Featured speaker at the Nonprofit Leadership Alliance Elevate Conference two years running — practical sessions on operations, systems, and sustainable leadership.",
    cta: "See Speaking Topics",
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
    detail: "Retired U.S. military. Operational discipline, systems thinking, and mission-first leadership applied to every engagement.",
  },
  {
    label: "Nonprofit Operations",
    detail: "Director of Operations for both global and local nonprofits — built and scaled systems that allowed organizations to execute with consistency.",
  },
  {
    label: "Elevate Conference",
    detail: "Featured speaker at the Nonprofit Leadership Alliance Elevate Conference two consecutive years.",
  },
];

const journey = [
  { step: "Learn", sub: "Book & Free Guides" },
  { step: "Consult", sub: "Strategy & Systems" },
  { step: "Implement", sub: "FoundationWorks" },
  { step: "Grow", sub: "Long-Term Impact" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative text-white py-28 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1a2a6e]/75" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            We Help Nonprofits Build<br />Foundations That Work.
          </h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-10">
            Through consulting, FoundationWorks software, leadership development, and practical resources — we help nonprofit organizations reduce burnout, strengthen operations, and increase long-term impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#2a3db4] px-8 py-4 font-semibold hover:bg-blue-50 transition-colors"
            >
              Schedule a Strategy Call
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

      {/* How We Help */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3">One Complete System</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything Your Nonprofit Needs to Build What Lasts</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">These aren&apos;t four separate offerings. They&apos;re four parts of one connected approach — built to work together.</p>
          </div>
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
                <p className="text-[#2a3db4] text-sm font-medium mt-4">{p.cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FoundationWorks spotlight */}
      <section className="py-20 px-4 bg-[#2a3db4] text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">FoundationWorks Software</p>
            <h2 className="text-3xl font-bold mb-5">Built by Nonprofit Operators. Designed Around Your Workflows.</h2>
            <p className="text-blue-100 leading-relaxed mb-4">
              Most software forces nonprofits to adapt their operations to fit a generic platform. FoundationWorks is different — it&apos;s custom-built to the way your organization actually works.
            </p>
            <p className="text-blue-100 leading-relaxed mb-8">
              You own it outright after implementation. No subscriptions. No monthly fees. No vendor you&apos;re permanently dependent on.
            </p>
            <Link
              href="/foundationworks"
              className="inline-block bg-white text-[#2a3db4] px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
            >
              See FoundationWorks
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { outcome: "Spend less time managing volunteers.", detail: "FoundationWorks Volunteers handles scheduling, onboarding, hours, and recognition automatically." },
              { outcome: "Focus more on your mission.", detail: "When administrative systems actually work, your team stops fighting the tools and starts doing the work." },
              { outcome: "Own your systems, not rent them.", detail: "One implementation. No recurring fees. The software is yours." },
              { outcome: "Built from real nonprofit experience.", detail: "Every feature exists because it solved a real operational problem — not because it looked good in a demo." },
            ].map((item) => (
              <div key={item.outcome} className="flex items-start gap-3 bg-white/10 rounded-lg p-4">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-[#2a3db4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{item.outcome}</p>
                  <p className="text-blue-200 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3">How It All Connects</p>
            <h2 className="text-2xl font-bold text-gray-900">One System, Not Four Separate Things</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {journey.map((item, i, arr) => (
              <div key={item.step} className="flex items-center">
                <div className="flex flex-col items-center px-6 py-4">
                  <div className="w-14 h-14 rounded-full bg-[#2a3db4] text-white flex items-center justify-center font-bold text-lg mb-2">
                    {i + 1}
                  </div>
                  <span className="font-bold text-gray-900">{item.step}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{item.sub}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden md:block w-12 h-0.5 bg-[#2a3db4]/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Built on Real Nonprofit Experience. Not Theory.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Stephen Cook has spent years inside nonprofit organizations — building the systems, navigating the constraints, and doing the operational work. That experience is what every engagement is built on.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {credibilityPoints.map((pt) => (
            <div key={pt.label} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-bold text-[#2a3db4] mb-2">{pt.label}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pt.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Build a Stronger Foundation?</h2>
          <p className="text-blue-100 mb-8 text-lg">Let&apos;s talk about where your organization is — and what it would take to get it where it needs to go.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] px-10 py-4 font-semibold hover:bg-blue-50 transition-colors"
          >
            Schedule a Strategy Call
          </Link>
        </div>
      </section>
    </>
  );
}
