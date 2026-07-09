import Link from "next/link";

export const metadata = {
  title: "Consulting | Foundations & Horizons",
};

const services = [
  {
    title: "Strategic Planning Facilitation",
    idealFor: "Leadership teams that lack clarity on vision, direction, or measurable goals.",
    timeline: "4–6 weeks",
    accent: "#2a3db4",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    deliverables: [
      "Facilitation of 1–2 planning sessions",
      "A 12–18 month strategic plan",
      "Clear objectives, key results, and timeline",
      "Stakeholder input summary (if applicable)",
    ],
  },
  {
    title: "Leadership & OKR Alignment",
    idealFor: "Nonprofit leadership teams that need to unify around shared goals and ensure strategy translates into measurable results.",
    timeline: "4–6 weeks",
    accent: "#1e3a8a",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    deliverables: [
      "Facilitated leadership alignment sessions",
      "Organizational OKRs for the next 12–18 months",
      "Role clarity mapping (who owns what)",
      "Leadership accountability framework",
      "90-day action plan with quarterly OKR review",
    ],
  },
  {
    title: "Program Operations Scaling",
    idealFor: "Organizations preparing to expand a program's reach, funding, or geographic footprint.",
    timeline: "4–6 weeks",
    accent: "#1d4ed8",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    deliverables: [
      "Infrastructure and staffing review",
      "Efficiency improvements and bottleneck reduction",
      "Capacity and scalability planning",
      "Custom growth action plan",
    ],
  },
  {
    title: "Operational Assessment & Optimization",
    idealFor: "Nonprofits that are disorganized, growing quickly, or struggling with internal inefficiencies.",
    timeline: "3–4 weeks",
    accent: "#1e40af",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    deliverables: [
      "Full audit of current workflows and systems",
      "Gap analysis and inefficiency identification",
      "30–60-day implementation roadmap",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a3db4] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">Consulting</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Every engagement is built around your organization&apos;s specific challenges — not a generic playbook.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group border border-gray-100 hover:border-blue-200"
              >
                {/* Accent bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: s.accent }} />

                <div className="p-8">
                  {/* Icon + Title + Timeline */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-lg text-white shrink-0"
                        style={{ backgroundColor: s.accent }}
                      >
                        {s.icon}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 leading-snug">{s.title}</h2>
                    </div>
                    <span className="ml-4 shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {s.timeline}
                    </span>
                  </div>

                  {/* Ideal For */}
                  <div className="bg-blue-50 border-l-4 border-[#2a3db4] rounded-r-lg px-4 py-3 mb-6">
                    <p className="text-xs font-semibold text-[#2a3db4] uppercase tracking-wide mb-1">Ideal For</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{s.idealFor}</p>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What You Get</p>
                    <ul className="space-y-2">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#2a3db4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Not sure which service is right for you?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Let&apos;s have a conversation. We&apos;ll help you identify where to start.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] font-bold px-10 py-4 rounded hover:bg-blue-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
