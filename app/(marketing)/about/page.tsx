import Link from "next/link";

export const metadata = {
  title: "About | Foundations & Horizons",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#2a3db4] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Real Experience.<br />Real Systems. Real Results.
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Foundations &amp; Horizons exists because one person decided to stop watching nonprofits struggle with problems that have solutions.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8 text-gray-700 leading-relaxed text-lg">
          <h2 className="text-3xl font-bold text-gray-900">Stephen Cook — Founder &amp; CEO</h2>
          <p>
            Stephen Cook is a retired U.S. military veteran who spent years learning that the difference between an organization that thrives and one that survives comes down to one thing: operational foundation. The military taught him that clarity, systems, and accountability aren&apos;t bureaucratic overhead — they&apos;re what make mission possible.
          </p>
          <p>
            After his military career, Stephen took that same discipline into the nonprofit world. As Director of Global Operations at the USANA Foundation, he didn&apos;t manage programs from a distance — he built the systems, workflows, and operational infrastructure that allowed a global humanitarian organization to execute with consistency and scale. He knows what it looks like when a nonprofit runs well, and he knows exactly what breaks when it doesn&apos;t.
          </p>
          <p>
            That firsthand experience is what separates Foundations &amp; Horizons from consulting firms that approach nonprofits with generic frameworks. Stephen has been in the rooms where decisions get made, seen the budget constraints, navigated volunteer turnover, and built processes that actually held up under pressure. He didn&apos;t learn nonprofit operations from a course — he learned it by doing the work.
          </p>
          <p>
            Out of that experience, he wrote <em className="font-semibold">Strong Foundations, Higher Horizons</em> — a practical guide for nonprofit leaders who are ready to move from reactive to intentional. And when he couldn&apos;t find software that fit the way nonprofits actually operate, he built it himself. FoundationWorks is the platform that came from that effort: custom-built systems that organizations own outright, with no ongoing subscriptions or vendor dependency.
          </p>
          <p>
            Stephen is also a featured speaker at the Nonprofit Alliance Elevate Conference, where he has presented two years running on topics including nonprofit operations, volunteer management, systems building, and sustainable leadership. His approach in every room is the same as it is in consulting: practical, direct, and grounded in what actually works.
          </p>
          <p className="italic text-[#2a3db4] font-medium">
            Foundations &amp; Horizons isn&apos;t built on theory. It&apos;s built on the systems, failures, lessons, and hard-won wins of someone who has been doing this work for years. That&apos;s the difference.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold text-[#2a3db4] mb-2">Military Veteran</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Retired U.S. military. Operational discipline, systems thinking, and mission-first leadership applied to every engagement.</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold text-[#2a3db4] mb-2">USANA Foundation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Director of Global Operations — built and scaled nonprofit systems at a global humanitarian organization serving communities across multiple countries.</p>
          </div>
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="font-semibold text-[#2a3db4] mb-2">Elevate Conference</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Featured speaker at the Nonprofit Alliance Elevate Conference two consecutive years — practical sessions on operations, systems, and nonprofit leadership.</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Author of <em>Strong Foundations, Higher Horizons</em></h2>
          <p className="text-gray-600 leading-relaxed">
            A practical guide for nonprofit leaders ready to build the systems, clarity, and operational strength their organizations need to grow with confidence.
          </p>
          <a
            href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 font-semibold hover:bg-[#2a3db4] hover:text-white transition-colors"
          >
            Get the Book on Amazon
          </a>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Work Together?</h2>
          <p className="text-blue-100 mb-8">Let&apos;s talk about your organization and what it needs to run at its best.</p>
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
