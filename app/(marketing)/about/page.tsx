import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | Foundations & Horizons",
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Practical Support for Nonprofits,<br />Built on Real Experience
        </h1>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              At Foundations &amp; Horizons, we believe that strong operations and aligned leadership
              are the backbone of every thriving nonprofit. We help organizations streamline systems,
              clarify strategy, and strengthen their teams so they can focus on what matters most —
              making an impact in their communities.
            </p>
            <p>
              Founded by Stephen Cook, a nonprofit operations leader with both military discipline
              and real-world nonprofit experience, Foundations &amp; Horizons brings a unique
              perspective to organizational growth. Having seen firsthand how resource-strapped
              nonprofits struggle with inefficiency and misaligned teams, Stephen built this practice
              to provide practical, results-focused solutions that make lasting change possible.
            </p>
            <a
              href="https://www.linkedin.com/in/stephenocook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2a3db4] underline hover:text-blue-700 transition-colors"
            >
              www.linkedin.com/in/stephenocook
            </a>

            <div className="pt-4 space-y-3">
              <p>
                <span className="font-bold">Mission:</span> To empower nonprofits to achieve greater
                impact through efficient operations and visionary leadership support.
              </p>
              <p>
                <span className="font-bold">Vision:</span> Every nonprofit leader has the tools,
                systems, and confidence to turn their mission into meaningful results.
              </p>
            </div>

            <p className="italic text-[#2a3db4]">
              Let&apos;s work together to build the systems and strategies your nonprofit needs to
              grow with confidence.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <Image
              src="/about-photo.jpg"
              alt="Mountain landscape"
              width={600}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-700 mb-2">
            Author of <em className="font-semibold">Strong Foundations, Higher Horizons</em> — A leader&apos;s guide to nonprofit success
          </p>
          <a
            href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 hover:bg-[#2a3db4] hover:text-white transition-colors"
          >
            Get the Book on Amazon
          </a>
        </div>
      </section>

      {/* Solutions Teaser */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Also Building Solutions</h2>
          <p className="text-gray-600 mb-6">
            Beyond consulting, we build practical software tools for nonprofits — including a
            custom Volunteer Management Platform.
          </p>
          <Link
            href="/solutions/volunteer-management"
            className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 hover:bg-[#2a3db4] hover:text-white transition-colors"
          >
            See Our Solutions
          </Link>
        </div>
      </section>
    </>
  );
}
