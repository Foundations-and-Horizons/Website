export const metadata = {
  title: "Tools for Nonprofit Leaders | Foundations & Horizons",
};

const tools = [
  {
    title: "Mission Filter Checklist",
    desc: "A practical decision-making tool to help nonprofit leaders evaluate new programs, partnerships, and opportunities. Designed to bring clarity to \"yes/no\" decisions while protecting mission focus, team capacity, and long-term sustainability.",
    file: "/pdfs/MissionFilterChecklist.pdf",
    label: "Get Checklist",
  },
  {
    title: "Delegation Planner",
    desc: "A leadership tool to help nonprofit leaders transfer ownership intentionally — not just tasks. This planner supports thoughtful delegation that builds team capacity, reduces burnout, and strengthens organizational systems.",
    file: "/pdfs/DelegationPlanner.pdf",
    label: "Get Planner",
  },
  {
    title: "Capacity Map",
    desc: "A practical leadership tool to help nonprofit leaders understand what their organization is truly carrying — and where strain is beginning to show. Designed to make capacity visible, surface hidden costs, and support decisions that align work with people, systems, and long-term sustainability.",
    file: "/pdfs/CapacityMap.pdf",
    label: "Get Map",
  },
  {
    title: "Burnout Self-Check",
    desc: "A reflective tool to help nonprofit leaders notice early burnout signals — personally and organizationally. Designed to surface patterns, not assign blame, and to support conversations about sustainability before strain becomes damage.",
    file: "/pdfs/BurnoutSelfCheck.pdf",
    label: "Get Self-Check",
  },
];

export default function ToolsPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-16 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Tools for Nonprofit Leaders
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-2">
          These tools are designed to help nonprofit leaders make clearer decisions, delegate more
          sustainably, and protect both mission and people as organizations grow.
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm">
          They&apos;re adapted from ideas explored more fully in{" "}
          <em className="text-[#2a3db4]">Strong Foundations, Higher Horizons</em> and are offered
          here as practical resources — no sign-up required.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {tools.map((tool) => (
            <div key={tool.title} className="text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{tool.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">{tool.desc}</p>
              <a
                href={tool.file}
                download
                className="border border-[#2a3db4] text-[#2a3db4] px-10 py-3 text-sm hover:bg-[#2a3db4] hover:text-white transition-colors"
              >
                {tool.label}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Book upsell */}
      <section className="py-12 px-4 bg-gray-50 text-center border-t border-gray-100">
        <p className="text-gray-700 mb-4">
          Want to go deeper? These tools come from the book{" "}
          <em className="font-semibold">Strong Foundations, Higher Horizons</em>.
        </p>
        <a
          href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 hover:bg-[#2a3db4] hover:text-white transition-colors"
        >
          Get the Book on Amazon
        </a>
      </section>
    </>
  );
}
