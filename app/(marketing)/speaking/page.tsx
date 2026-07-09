import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Speaking | Foundations & Horizons",
};

const appearances = [
  {
    org: "Nonprofit Alliance Elevate Conference",
    year: "2026",
    title: "How Organizations Can Sustain Their People",
    desc: "A panel discussion on the systems, structures, and leadership practices that allow nonprofits to retain and sustain their teams — not just recruit them.",
    photo: "/panel-elevate.jpg",
    photoAlt: "Stephen Cook on panel at Nonprofit Alliance Elevate Conference 2026",
  },
  {
    org: "Nonprofit Alliance Elevate Conference",
    year: "2025",
    title: "Sustaining Success: Operational and Fundraising Strategies for Nonprofit Growth",
    desc: "A panel exploring how nonprofits can build the operational and financial foundation to grow sustainably — without burning out their people or losing their mission focus.",
    photo: "/panel-elevate.jpg",
    photoAlt: "Stephen Cook on panel at Nonprofit Alliance Elevate Conference 2025",
  },
  {
    org: "The Nonprofit Hive",
    year: "2025",
    title: "Beyond One Lane: The Power of Understanding Your Full Nonprofit Ecosystem",
    desc: "A panel discussion on how nonprofit leaders can zoom out, understand the full picture of their organization's ecosystem, and make better strategic decisions as a result. 80+ attendees.",
    photo: "/panel-hive.jpg",
    photoAlt: "Stephen Cook on panel at The Nonprofit Hive",
  },
];

const topics = [
  {
    title: "Nonprofit Operations & Systems",
    desc: "How to build the operational infrastructure that lets a nonprofit execute on its mission consistently, at scale, without burning out its team.",
  },
  {
    title: "Sustaining Your People",
    desc: "The systems, culture, and leadership practices that allow organizations to retain and develop their teams for the long haul.",
  },
  {
    title: "Strategic Clarity & Decision-Making",
    desc: "How to filter opportunities, set priorities, and make decisions that serve the mission — not just the moment.",
  },
  {
    title: "Building Sustainable Organizations",
    desc: "The structures and thinking that separate nonprofits that endure from those that struggle year to year.",
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
              <div key={a.title} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-[#2a3db4] flex flex-col items-center justify-center text-white text-center">
                      <p className="text-lg font-bold leading-none">{a.year}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#2a3db4] uppercase tracking-wide mb-1">{a.org}</p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">&ldquo;{a.title}&rdquo;</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </div>
                <div className="relative w-full h-56 md:h-72">
                  <Image src={a.photo} alt={a.photoAlt} fill className="object-cover object-top" />
                </div>
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
