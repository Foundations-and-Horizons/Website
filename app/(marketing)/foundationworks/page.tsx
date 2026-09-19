import Link from "next/link";

export const metadata = {
  title: "FoundationWorks | Foundations & Horizons",
  description: "FoundationWorks is a practical technology tool within Foundations & Horizons, built around real nonprofit workflows.",
};

export default function FoundationWorksPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">One Tool in the Toolbox</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">FoundationWorks</h1>
          <p className="text-blue-100 text-xl leading-relaxed max-w-3xl">
            Practical technology built around the way a nonprofit actually works — used when technology is the right answer to an operational problem.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Why It Exists</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-7">Technology should serve the system — not become the system.</h2>
          <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
            <p>FoundationWorks grew out of real nonprofit operations work. The starting point was not “build software.” It was “there has to be a better way to do this work.”</p>
            <p>When a process is clear and a tool can remove friction, technology can be powerful. When the underlying process is unclear, adding software usually just makes the confusion more expensive.</p>
            <p>That is why FoundationWorks sits inside the larger Foundations &amp; Horizons approach. We understand the operation first, then determine whether a custom tool makes sense.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Available Now</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">FoundationWorks Volunteers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A customizable volunteer-management system designed to make volunteer operations easier to run, easier to measure, and easier for volunteers to participate in.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["Volunteer profiles & roles", "Keep volunteer information, roles, participation, and history in one place."],
              ["Scheduling & self-service", "Make it easier for volunteers to see opportunities, sign up, and participate without adding administrative work."],
              ["Hours & reporting", "Capture service activity and produce useful operational reports without rebuilding spreadsheets."],
              ["Recognition", "Make milestones and contribution visible so volunteer recognition becomes part of the system, not something someone remembers when there is time."],
            ].map(([title, text]) => (
              <div key={title} className="bg-white border border-gray-200 p-7">
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/solutions/volunteer-management" className="bg-[#2a3db4] text-white px-8 py-3 font-semibold text-center hover:bg-[#1e2e8a]">See the Volunteer Tool</Link>
            <Link href="/contact" className="border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 font-semibold text-center hover:bg-white">Talk Through Your Needs</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">The tool is not the point.</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-7">
            The point is a stronger operation. If the right answer is a process change, training, documentation, or leadership work, that is what we should do. If the right answer includes technology, FoundationWorks is available.
          </p>
          <Link href="/services" className="text-[#2a3db4] font-semibold">See the larger approach →</Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Want to see whether it fits?</h2>
          <p className="text-blue-100 mb-8">Start with a conversation about how your volunteer operation works today.</p>
          <Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold hover:bg-blue-50">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
