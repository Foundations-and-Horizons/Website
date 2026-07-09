import Link from "next/link";

export const metadata = {
  title: "Speaking | Foundations & Horizons",
};

const topics = [
  {
    title: "Nonprofit Operations & Systems",
    desc: "How to build the operational infrastructure that lets a nonprofit execute on its mission consistently, at scale, without burning out its team.",
  },
  {
    title: "Volunteer Management & Engagement",
    desc: "From recruitment to retention — building volunteer programs that run reliably and create real community connection.",
  },
  {
    title: "Leadership Development",
    desc: "Developing leaders at every level of a nonprofit organization — from program managers to executive directors.",
  },
  {
    title: "Building Sustainable Organizations",
    desc: "The systems, structures, and culture that separate nonprofits that endure from those that struggle year to year.",
  },
];

export default function SpeakingPage() {
  return (
    <>
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

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-6 text-center">Featured Appearance</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-2/3 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Nonprofit Alliance Elevate Conference</h2>
                <p className="text-[#2a3db4] font-semibold">Featured Speaker — Two Consecutive Years</p>
                <p className="text-gray-600 leading-relaxed">
                  The Nonprofit Alliance Elevate Conference brings together nonprofit leaders, operators, and change-makers to share what&apos;s working in the sector. Stephen Cook has been a featured speaker at this conference two years running — not because he has a credential on a wall, but because the practitioners in the audience recognize that what he teaches comes from doing the actual work.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  His sessions focus on the operational and systems side of nonprofit management — the conversations that don&apos;t always make it onto conference agendas but that every leader in the room is thinking about.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="w-40 h-40 rounded-full bg-[#2a3db4] flex flex-col items-center justify-center text-white text-center px-4">
                  <p className="text-3xl font-bold">2x</p>
                  <p className="text-xs text-blue-200 mt-1 leading-snug">Elevate Conference Speaker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Speaking Topics</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Each session is built around practical takeaways — not inspiration that fades before the drive home.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What Audiences Take Away</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Every audience leaves with specific, actionable tools they can apply in their organizations immediately. Stephen doesn&apos;t give talks that sound good in the moment and disappear by Monday. He teaches the frameworks, systems, and thinking that have worked in real nonprofit environments — and shows exactly how to apply them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {["Concrete frameworks, not vague principles", "Systems thinking applied to real nonprofit challenges", "Practical steps to take the week they get back"].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2a3db4] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Book Stephen for Your Event</h2>
          <p className="text-blue-100 mb-8">Whether it&apos;s a conference, leadership retreat, or internal training — reach out to discuss availability and fit.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
