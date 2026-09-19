import Link from "next/link";
import Image from "next/image";

const waysWeHelp = [
  {
    title: "Listen & Diagnose",
    text: "We start with your organization as it actually is — your programs, people, workflows, pressures, and goals. Before recommending anything, we work to understand the system you already have.",
    href: "/services",
  },
  {
    title: "Teach & Equip",
    text: "Through the book, workshops, speaking, and practical resources, we help nonprofit leaders see their operations differently and make better decisions.",
    href: "/education",
  },
  {
    title: "Build & Improve",
    text: "When the answer calls for hands-on work, we help build clearer processes, stronger systems, and practical tools that make the work easier to sustain.",
    href: "/services",
  },
  {
    title: "Put Tools to Work",
    text: "FoundationWorks is one of the tools in the toolbox — practical technology built around the way a nonprofit actually works, when technology is the right answer.",
    href: "/foundationworks",
  },
];

export const metadata = {
  title: "Foundations & Horizons | Systems, Not Heroics",
  description: "Foundations & Horizons helps nonprofits build strong operational systems so their programs can depend on systems, not heroics.",
};

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#16265f] text-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101d4b]/95 via-[#16265f]/85 to-[#16265f]/65" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-blue-200 mb-5">
              Systems, Not Heroics.
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.08] mb-7">
              Build an organization strong enough to carry the mission.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-blue-50 max-w-3xl mb-10">
              Foundations &amp; Horizons helps nonprofits strengthen the way they operate so their programs can rely on clear, sustainable systems — not a handful of people working harder and harder to hold everything together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="bg-white text-[#1f348f] px-8 py-4 font-semibold text-center hover:bg-blue-50 transition-colors">
                Start with a Conversation
              </Link>
              <Link href="#how-we-help" className="border border-white/70 text-white px-8 py-4 font-semibold text-center hover:bg-white/10 transition-colors">
                See How We Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Start with Listening</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            You shouldn&apos;t have to know the answer before you ask for help.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Every nonprofit is different. Before we talk about solutions, we want to understand yours — what you are trying to accomplish, how your programs work, where the friction lives, what your people are carrying, and what you want the organization to become.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Then, and only then, we figure out what would actually help.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ["01", "Understand", "See the whole system — mission, programs, people, processes, capacity, and constraints."],
              ["02", "Strengthen", "Fix the places where the organization is depending on workarounds, memory, or individual heroics."],
              ["03", "Sustain", "Build systems people can actually use, own, measure, and improve over time."],
            ].map(([number, title, text]) => (
              <div key={number} className="bg-white p-7 border border-gray-200">
                <div className="text-sm font-bold text-[#2a3db4] mb-4">{number}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-we-help" className="py-20 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">One Company. Many Ways to Help.</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Think toolbox, not a list of products.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Consulting, education, speaking, practical resources, and FoundationWorks are not separate businesses. They are different tools we can use to help a nonprofit become stronger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {waysWeHelp.map((item) => (
              <Link key={item.title} href={item.href} className="group border border-gray-200 p-7 hover:border-[#2a3db4] hover:shadow-md transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2a3db4]">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-5">{item.text}</p>
                <span className="text-[#2a3db4] font-semibold text-sm">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#eef2ff] border-y border-blue-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">The Book + Workshops</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Strong Foundations, Higher Horizons</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Stephen Cook&apos;s book brings the philosophy behind this work together: clear mission, strong leadership, usable systems, healthy capacity, and organizations built to last.
            </p>
            <p className="text-gray-600 leading-relaxed mb-7">
              The workshop series takes those ideas off the page and puts them into practice, one topic at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/education" className="bg-[#2a3db4] text-white px-7 py-3 font-semibold text-center hover:bg-[#1e2e8a]">Explore Education</Link>
              <Link href="/workshops" className="border border-[#2a3db4] text-[#2a3db4] px-7 py-3 font-semibold text-center hover:bg-white">See Workshops</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src="/book-cover.jpg" alt="Strong Foundations, Higher Horizons by Stephen Cook" width={240} height={360} className="rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <Image src="/about-photo.jpg" alt="Stephen Cook" width={900} height={700} className="w-full max-h-[430px] object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Why This Work</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">Built from the inside out.</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Stephen Cook comes to this work as an operator. His experience is grounded in actually running nonprofit operations, rebuilding processes, creating measurable systems, and seeing what happens when people are asked to carry an organization that should have been carrying them.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              The goal is not organization for organization&apos;s sake. Strong operations are the baseline that allows a nonprofit&apos;s programs, people, and mission to do their best work.
            </p>
            <Link href="/about" className="text-[#2a3db4] font-semibold">Meet Stephen →</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 font-semibold tracking-[0.18em] uppercase text-sm mb-4">Let&apos;s Start Where You Are</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Tell us what&apos;s happening.</h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            You do not need a polished problem statement. Bring the challenge, the question, or the thing that keeps ending up on your plate. We&apos;ll start by listening.
          </p>
          <Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold hover:bg-blue-50 transition-colors">
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
