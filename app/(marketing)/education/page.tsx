import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Education | Foundations & Horizons",
};

const guides = [
  {
    title: "Burnout Self-Check",
    desc: "A reflective tool for nonprofit leaders to surface early warning signs of burnout — not to assign blame, but to identify when systems, expectations, and capacity are out of alignment.",
    file: "/pdfs/BurnoutSelfCheck.pdf",
  },
  {
    title: "Capacity Map",
    desc: "Make the invisible visible. This tool helps leaders honestly assess what the organization is carrying, where strain is showing up, and what tradeoffs need to be named before something breaks.",
    file: "/pdfs/CapacityMap.pdf",
  },
  {
    title: "Mission Filter Checklist",
    desc: "A practical decision tool to slow the yes down just enough to ask the right questions — so every new program, partnership, or initiative truly serves the mission and the team's capacity.",
    file: "/pdfs/MissionFilterChecklist.pdf",
  },
  {
    title: "Delegation Planner",
    desc: "Clarify what truly needs to stay with you and intentionally transfer ownership in a way that strengthens both people and systems — without creating more work in the process.",
    file: "/pdfs/DelegationPlanner.pdf",
  },
];

export default function EducationPage() {
  return (
    <>
      <section className="bg-[#2a3db4] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Learn the Systems That Change Nonprofits
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Practical resources built from real nonprofit operations experience — not academic frameworks or generic advice.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3">The Book</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Strong Foundations, Higher Horizons
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Written by Stephen Cook from two decades of nonprofit operational experience, this book gives leaders a clear path from reactive management to intentional, sustainable growth.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Whether you&apos;re an executive director, operations manager, or board member, this guide gives you the frameworks, language, and practical tools to build an organization that runs the way it should.
            </p>
            <a
              href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#2a3db4] text-white px-8 py-3 font-semibold hover:bg-[#1e2e8a] transition-colors"
            >
              Get the Book on Amazon
            </a>
          </div>
          <div className="flex justify-center">
            <a
              href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/book-cover.jpg"
                alt="Strong Foundations, Higher Horizons by Stephen Cook"
                width={280}
                height={420}
                className="rounded-lg shadow-2xl hover:shadow-blue-200 transition-shadow duration-300"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3">Free Resources</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Downloadable Guides for Nonprofit Leaders</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Practical tools you can use immediately. No fluff, no generic advice — just actionable frameworks drawn from real nonprofit operations work.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => (
              <div key={guide.title} className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col hover:shadow-md hover:border-blue-200 transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-1 w-8 h-8 rounded bg-[#2a3db4]/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#2a3db4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{guide.desc}</p>
                <a
                  href={guide.file}
                  download
                  className="inline-flex items-center gap-2 text-white bg-[#2a3db4] hover:bg-[#1e2e8a] transition-colors text-sm font-semibold px-4 py-2 rounded self-start"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Free
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Want to Go Deeper?</h2>
          <p className="text-blue-100 mb-8">Books and guides are a start. Working directly with someone who has built these systems from the ground up is where real change happens.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
          >
            Work With Us Directly
          </Link>
        </div>
      </section>
    </>
  );
}
