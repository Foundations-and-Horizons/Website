import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Education | Foundations & Horizons",
  description: "Books, practical resources, and education for nonprofit leaders building stronger organizations.",
};

const guides = [
  ["Burnout Self-Check", "Notice early signs of strain and start a better conversation about sustainability.", "/pdfs/BurnoutSelfCheck.pdf"],
  ["Capacity Map", "Make the organization's real workload visible and identify where capacity is being stretched.", "/pdfs/CapacityMap.pdf"],
  ["Mission Filter Checklist", "Slow the yes down long enough to decide whether a new opportunity truly serves the mission.", "/pdfs/MissionFilterChecklist.pdf"],
  ["Delegation Planner", "Transfer ownership intentionally so people and systems become stronger together.", "/pdfs/DelegationPlanner.pdf"],
];

export default function EducationPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">Learn &amp; Equip</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Ideas are useful when they change what you do.</h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
            The book, workshops, speaking, and practical resources all share the same goal: help nonprofit leaders see the system more clearly and leave with something they can actually use.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">The Book</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Strong Foundations, Higher Horizons</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Stephen Cook&apos;s book brings together a practical philosophy for nonprofit leadership and operations: clarity before complexity, systems that serve people, measurable action, sustainable capacity, and an organization strong enough to support its mission.
            </p>
            <p className="text-gray-600 leading-relaxed mb-7">
              It is the foundation for the workshop series and a way for leaders to get to know how Stephen thinks before deciding whether they want deeper help.
            </p>
            <a href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#2a3db4] text-white px-8 py-3 font-semibold hover:bg-[#1e2e8a]">Get the Book on Amazon</a>
          </div>
          <div className="flex justify-center">
            <a href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/" target="_blank" rel="noopener noreferrer">
              <Image src="/book-cover.jpg" alt="Strong Foundations, Higher Horizons by Stephen Cook" width={280} height={420} className="rounded-lg shadow-2xl" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#eef2ff] border-y border-blue-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Workshops</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">A chapter at a time. A real conversation each month.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            The workshop series turns the book into practical sessions for nonprofit leaders. Each installment focuses on one idea, gives participants a framework they can use, and ends with a concrete action to take back to the organization.
          </p>
          <Link href="/workshops" className="inline-block bg-[#2a3db4] text-white px-8 py-3 font-semibold hover:bg-[#1e2e8a]">Explore the Workshops</Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Free Resources</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Start with something practical.</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Use these tools on your own. If they surface a bigger issue, that is useful too — it tells you where to look next.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map(([title, desc, file]) => (
              <div key={title} className="bg-white border border-gray-200 p-7">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{desc}</p>
                <a href={file} download className="inline-block bg-[#2a3db4] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#1e2e8a]">Download Free</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
