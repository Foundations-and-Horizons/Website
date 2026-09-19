import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About | Foundations & Horizons",
  description: "Meet Stephen Cook and learn why Foundations & Horizons takes a systems-first, people-first approach to nonprofit operations.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr] gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">About Foundations &amp; Horizons</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Strong operations are not the mission. They make the mission possible.</h1>
            <p className="text-blue-100 text-lg leading-relaxed">That is the work Stephen Cook has spent years doing — taking complicated nonprofit operations and making them clearer, more usable, and more sustainable.</p>
          </div>
          <Image src="/about-photo.jpg" alt="Stephen Cook" width={700} height={700} className="w-full max-h-[430px] object-cover" />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Stephen Cook — Founder &amp; CEO</h2>
          <p>Stephen is a nonprofit operations leader, author, speaker, and systems builder. His work has centered on the practical intersection of mission, people, process, data, and execution.</p>
          <p>He is strongest when an organization has a complicated problem that does not fit neatly into a template. He listens to how the work is actually being done, identifies where the system is creating friction, and works from there.</p>
          <p>That philosophy is the reason Foundations &amp; Horizons is intentionally bigger than a consulting label and intentionally smaller than a software-company identity. The company is a toolbox: education, workshops, speaking, practical resources, hands-on operational work, and technology when technology is the right tool.</p>
          <p>The book <em className="font-semibold">Strong Foundations, Higher Horizons</em> is another expression of the same philosophy. It is a way to teach, start conversations, and give nonprofit leaders practical ways to strengthen the organizations they lead.</p>
          <p className="text-[#2a3db4] font-semibold border-l-4 border-[#2a3db4] pl-5">The goal is simple: help nonprofits build systems strong enough that their programs do not have to depend on heroics to function.</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["Operator", "Built around lived nonprofit operations experience, not just outside observation."],
            ["Teacher", "Uses books, workshops, speaking, and practical resources to make complex ideas usable."],
            ["Builder", "Turns good ideas into repeatable processes, systems, and tools people can actually own."],
          ].map(([title, text]) => (
            <div key={title} className="bg-white border border-gray-200 p-7">
              <h3 className="text-xl font-bold text-[#2a3db4] mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Want to understand the thinking behind the work?</h2>
        <p className="text-gray-600 mb-7">Start with the book, a workshop, or simply a conversation.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/education" className="bg-[#2a3db4] text-white px-7 py-3 font-semibold">Explore Education</Link>
          <Link href="/contact" className="border-2 border-[#2a3db4] text-[#2a3db4] px-7 py-3 font-semibold">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
