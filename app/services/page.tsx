import Link from "next/link";

export const metadata = {
  title: "Services | Foundations & Horizons",
};

const services = [
  {
    title: "Strategic Planning Facilitation",
    idealFor: "Leadership teams that lack clarity on vision, direction, or measurable goals.",
    timeline: "4–6 weeks",
    deliverables: [
      "Facilitation of 1–2 planning sessions",
      "A 12–18 month strategic plan",
      "Clear objectives, key results, and timeline",
      "Stakeholder input summary (if applicable)",
    ],
  },
  {
    title: "Leadership & OKR Alignment",
    idealFor: "Nonprofit leadership teams that need to unify around shared goals, improve accountability, and ensure strategy translates into measurable results.",
    timeline: "4–6 weeks",
    deliverables: [
      "Facilitated leadership alignment sessions",
      "Creation of organizational Objectives & Key Results (OKRs) for the next 12–18 months",
      "Role clarity mapping (who owns what)",
      "Leadership accountability framework",
      "90-day action plan with quarterly OKR review process",
    ],
  },
  {
    title: "Program Operations Scaling",
    idealFor: "Organizations preparing to expand a program's reach, funding, or geographic footprint.",
    timeline: "4–6 weeks",
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
      {/* Banner */}
      <section className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/services-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">Our Services</h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{s.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-semibold text-gray-800">Ideal for:</span> {s.idealFor}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  <span className="font-semibold text-gray-700">Timeline:</span> {s.timeline}
                </p>
                <div>
                  <p className="font-semibold text-gray-700 text-sm mb-2">Deliverables Include:</p>
                  <ul className="space-y-1">
                    {s.deliverables.map((d) => (
                      <li key={d} className="text-gray-600 text-sm text-center">{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Not sure which service is right for you?
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Let&apos;s have a conversation. We&apos;ll help you identify where to start.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#2a3db4] text-white px-10 py-4 hover:bg-[#2236a0] transition-colors"
        >
          Get in Touch
        </Link>
      </section>
    </>
  );
}
