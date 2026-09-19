import Link from "next/link";

export const metadata = {
  title: "How We Help | Foundations & Horizons",
  description: "A listening-first approach to helping nonprofits strengthen operations, leadership, systems, and capacity.",
};

const examples = [
  { title: "Operational clarity", text: "Understand how work actually moves through the organization, where it gets stuck, and what needs to change first." },
  { title: "Systems & process design", text: "Turn informal, fragile, or person-dependent work into clear processes people can understand, use, own, and improve." },
  { title: "Leadership & alignment", text: "Create clearer priorities, roles, goals, and decision-making so leadership can move together." },
  { title: "Program operations", text: "Strengthen the infrastructure behind programs so growth does not simply multiply the chaos underneath them." },
  { title: "Capacity & sustainability", text: "Look honestly at what the organization is carrying and redesign work before the people carrying it break." },
  { title: "Implementation", text: "When the answer is known, help turn the plan into something real — with practical tools, documentation, training, and follow-through." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">How We Help</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Start with the organization. Not a package.</h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
            There is no universal nonprofit operating model. We listen first, understand what is actually happening, and then determine which combination of ideas, services, education, and tools will help.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">The Process</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Listen. Understand. Build.</h2>
          <div className="space-y-8">
            {[
              ["01", "Listen", "Tell us what is happening. What works, what does not, what your team is carrying, and what you want the organization to be able to do."],
              ["02", "Understand", "We map the system behind the symptoms — programs, people, workflows, capacity, handoffs, information, and decisions."],
              ["03", "Build", "Only after we understand the problem do we decide what belongs in the toolbox: a clearer process, leadership work, training, a practical resource, technology, or some combination."],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[56px_1fr] gap-5 items-start">
                <div className="w-14 h-14 bg-[#2a3db4] text-white flex items-center justify-center font-bold">{number}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">What That Can Look Like</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The toolbox changes with the problem.</h2>
            <p className="text-gray-600">These are examples of the work. They are not rigid packages.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 p-7">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">The goal is not better operations for their own sake.</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Operations are the baseline. The point of strengthening them is to give the people and programs inside the organization a stronger platform from which to carry out the mission.
          </p>
          <p className="text-2xl font-semibold text-[#2a3db4] mb-8">Systems, not heroics.</p>
          <Link href="/contact" className="inline-block bg-[#2a3db4] text-white px-9 py-4 font-semibold hover:bg-[#1e2e8a]">Start with a Conversation</Link>
        </div>
      </section>
    </>
  );
}
