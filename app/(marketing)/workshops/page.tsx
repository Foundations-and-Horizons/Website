import Link from "next/link";

export const metadata = {
  title: "Workshops | Foundations & Horizons",
  description: "Practical nonprofit leadership and operations workshops based on Strong Foundations, Higher Horizons.",
};

export default function WorkshopsPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">Workshops</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Practical ideas. Real conversation. Something useful to take back with you.</h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
            A workshop series built from <em>Strong Foundations, Higher Horizons</em> — designed to help nonprofit leaders step out of the daily reaction cycle long enough to see what is really happening and choose one meaningful next action.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">The Format</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">A chapter at a time.</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>Each installment focuses on one idea from the book and turns it into a practical conversation for nonprofit leaders.</p>
            <p>The goal is not to cram more information into an already-full calendar. It is to create clarity, give leaders a useful framework, and help each participant identify one thing worth changing.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Challenge the assumption", "Look at a common nonprofit habit or belief that may be creating more work than value."],
            ["See the system", "Use a practical framework to understand how the issue connects to people, process, capacity, and mission."],
            ["Choose one action", "Leave with a concrete next step you can actually take back to the organization."],
          ].map(([title, text], i) => (
            <div key={title} className="bg-white border border-gray-200 p-7">
              <div className="text-sm font-bold text-[#2a3db4] mb-4">0{i + 1}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Why It Matters</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-5">Strong organizations are built on purpose.</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            The workshop series is part of a larger approach: help nonprofit leaders build organizations where the mission can be carried by strong systems and capable people, rather than sustained by constant heroics.
          </p>
          <Link href="/contact" className="inline-block bg-[#2a3db4] text-white px-9 py-4 font-semibold hover:bg-[#1e2e8a]">Ask About Upcoming Workshops</Link>
        </div>
      </section>
    </>
  );
}
