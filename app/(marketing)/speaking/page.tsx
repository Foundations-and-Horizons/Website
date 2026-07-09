import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Speaking | Foundations & Horizons",
};

const appearances = [
  {
    org: "Nonprofit Leadership Alliance — Elevate Conference",
    years: "2025 & 2026",
    panels: [
      { year: "2026", title: "How Organizations Can Sustain Their People", desc: "A panel discussion on the systems, structures, and leadership practices that allow nonprofits to retain and sustain their teams — not just recruit them." },
      { year: "2025", title: "Sustaining Success: Operational and Fundraising Strategies for Nonprofit Growth", desc: "A panel exploring how nonprofits can build the operational and financial foundation to grow sustainably — without burning out their people or losing their mission focus." },
    ],
    photo: "/panel-elevate.jpg",
    photoAlt: "Stephen Cook on panel at Nonprofit Leadership Alliance Elevate Conference",
  },
  {
    org: "The Nonprofit Hive",
    years: "2025",
    panels: [
      { year: "2025", title: "Beyond One Lane: The Power of Understanding Your Full Nonprofit Ecosystem", desc: "A panel discussion on how nonprofit leaders can zoom out, understand the full picture of their organization's ecosystem, and make better strategic decisions as a result. 80+ attendees." },
    ],
    photo: "/panel-hive.jpg",
    photoAlt: "Stephen Cook on panel at The Nonprofit Hive",
  },
];

const topics = [
  {
    title: "Strategic Clarity & Decision-Making",
    desc: "Everything else depends on this. Before you can build systems or sustain people, you need to know where you're going and what to say no to. This session covers how to filter opportunities, stop mission creep before it starts, and make decisions that serve the organization — not just the moment.",
  },
  {
    title: "Nonprofit Operations & Systems",
    desc: "Clarity without structure is just intention. This session tackles what it actually takes to build the operational foundation that lets a nonprofit execute consistently — because you can't scale chaos, and capacity is a boundary, not a bad word.",
  },
  {
    title: "Sustaining Your People",
    desc: "Systems only work if the people running them aren't burning out. This session addresses the leadership practices, cultural norms, and structural decisions that allow teams to stay in the work for the long haul — not just survive the next season.",
  },
  {
    title: "Building Sustainable Organizations",
    desc: "When clarity, systems, and people all work together, something different becomes possible. This session pulls the full picture together — what separates nonprofits that endure from those that struggle year to year, and how leaders can start building that foundation now.",
  },
];

export default function SpeakingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#2a3db4] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Equipping Nonprofit Leaders<br />to Build What Lasts
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Practical, direct, and grounded in real nonprofit operations experience. No theory, no generic motivation — just what actually works.
          </p>
        </div>
      </section>

      {/* Appearances */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3 text-center">Speaking Appearances</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">On Stage & On Panels</h2>

          <div className="space-y-6">
            {appearances.map((a) => (
              <div key={a.org} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="p-6 md:p-8">
                  <p className="text-xs font-semibold text-[#2a3db4] uppercase tracking-wide mb-4">{a.org}</p>
                  <div className="space-y-4">
                    {a.panels.map((p) => (
                      <div key={p.title} className="flex gap-4 items-start">
                        <div className="shrink-0 w-14 h-14 rounded-lg bg-[#2a3db4] flex items-center justify-center text-white">
                          <p className="text-sm font-bold leading-none">{p.year}</p>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">&ldquo;{p.title}&rdquo;</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Image src={a.photo} alt={a.photoAlt} width={1200} height={800} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Speaking Topics</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Each session is built around practical takeaways — not inspiration that fades before the drive home.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2a3db4]/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#2a3db4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What audiences take away */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Audiences Take Away</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Every session ends with specific, actionable tools people can apply in their organizations immediately. Not inspiration that fades by Monday — frameworks and systems that have worked in real nonprofit environments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Concrete frameworks", detail: "Not vague principles — structured tools they can use the week they get back." },
              { label: "Systems thinking", detail: "Applied to real nonprofit challenges, not theoretical scenarios." },
              { label: "Honest conversation", detail: "The operational realities that don't always make it onto conference agendas." },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-[#2a3db4] flex items-center justify-center mb-4">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Book Stephen for Your Event</h2>
          <p className="text-blue-100 mb-8">Whether it&apos;s a conference, panel discussion, leadership retreat, or internal training — reach out to discuss availability and fit.</p>
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
