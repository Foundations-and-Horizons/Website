import Link from "next/link";
import Image from "next/image";

const painPoints = [
  { title: "Our team is overwhelmed.", text: "Important work keeps landing on the same few people, and there is never enough room to step back and improve the system.", href: "/services" },
  { title: "Too much lives in people's heads.", text: "Processes depend on memory, workarounds, spreadsheets, and the person who just knows how everything works.", href: "/services" },
  { title: "We're growing faster than our systems.", text: "The mission is expanding, but the operational foundation has not caught up with the complexity.", href: "/services" },
  { title: "Volunteers take too much staff time.", text: "Scheduling, communication, records, recognition, and follow-up create more administration than they should.", href: "/solutions/volunteer-management" },
  { title: "Our tools don't fit how we work.", text: "Technology should remove friction. When the right answer is software, it should reflect the nonprofit—not force the nonprofit to work around it.", href: "/foundationworks" },
  { title: "We don't know what to fix first.", text: "Sometimes the first need is not another tool. It is seeing the whole system clearly enough to know where change will matter.", href: "/contact" },
];

const waysWeHelp = [
  { step: "01", title: "Understand", label: "Listen & Diagnose", text: "We start with the organization you actually have—mission, programs, people, workflows, pressures, capacity, and goals.", href: "/services" },
  { step: "02", title: "Strengthen", label: "Build & Improve", text: "We turn recurring friction into clearer processes, stronger operating systems, and practical ways of working that people can sustain.", href: "/services" },
  { step: "03", title: "Equip", label: "Teach & Develop", text: "Books, workshops, speaking, and practical resources give leaders tools they can understand, use, and carry forward.", href: "/education" },
  { step: "04", title: "Sustain", label: "Put Tools to Work", text: "When technology is the right answer, FoundationWorks can turn a nonprofit's real workflow into software that feels built around them.", href: "/foundationworks" },
];

export const metadata = {
  title: "Foundations & Horizons | Systems, Not Heroics",
  description: "Foundations & Horizons helps nonprofits build strong operational systems so their programs can depend on systems, not heroics.",
};

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[690px] overflow-hidden bg-[#101d4b] text-white flex items-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-35 scale-105" style={{ backgroundImage: "url('/hero-bg.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b153c] via-[#13245d]/95 to-[#172a68]/55" />
        <div className="absolute -right-24 -bottom-32 h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute -right-4 -bottom-20 h-[360px] w-[360px] rounded-full border border-white/10" />
        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-blue-200 mb-6">Systems, Not Heroics.</p>
            <h1 className="text-5xl md:text-7xl lg:text-[5.25rem] font-bold leading-[0.98] tracking-tight mb-8">
              Your mission deserves more than people holding everything together.
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-blue-50 max-w-3xl mb-10">
              We help nonprofits turn the way work really happens into clear systems, stronger operations, capable teams, and—when it helps—technology built around them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#recognize" className="bg-white text-[#1f348f] px-8 py-4 font-semibold text-center hover:bg-blue-50 transition-colors">This Sounds Like Us</Link>
              <Link href="/contact" className="border border-white/70 text-white px-8 py-4 font-semibold text-center hover:bg-white/10 transition-colors">Start a Conversation</Link>
            </div>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-blue-100/90">
            <span>Operations</span><span>•</span><span>Leadership</span><span>•</span><span>Volunteer Systems</span><span>•</span><span>Education</span><span>•</span><span>Practical Technology</span>
          </div>
        </div>
      </section>

      <section id="recognize" className="py-24 md:py-32 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-14">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">Start With What You&apos;re Feeling</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-950 mb-6">What&apos;s making your mission harder than it needs to be?</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">You do not need to know the solution before you talk to us. Usually, you already know where the work feels heavier than it should.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPoints.map((item) => (
              <Link key={item.title} href={item.href} className="group min-h-[235px] p-8 border border-gray-200 bg-gray-50 hover:bg-[#16265f] hover:text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="text-[#2a3db4] group-hover:text-blue-200 text-2xl mb-8">↗</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 group-hover:text-blue-50 leading-relaxed">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-5 bg-[#f2f5fb] border-y border-gray-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">A Different Starting Point</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">We don&apos;t arrive with the answer. We learn how your organization works.</h2>
          </div>
          <div className="text-lg md:text-xl text-gray-600 leading-relaxed space-y-5">
            <p>Every nonprofit has its own mission, people, history, pressures, and ways of getting the work done. A solution that ignores that reality becomes one more thing your team has to carry.</p>
            <p className="font-semibold text-gray-900">So we listen first. Then we strengthen what matters, build what is missing, and leave you with systems your people can actually use.</p>
          </div>
        </div>
      </section>

      <section id="how-we-help" className="py-24 md:py-32 px-5 bg-[#0f1c4b] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-16">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-4">One Company. A Connected Toolbox.</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">The right help depends on where you are.</h2>
            <p className="text-xl text-blue-100 leading-relaxed">The work can begin with a conversation, a workshop, an operational challenge, or a tool that no longer fits. These are not separate businesses—they are different ways to build a stronger foundation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/20 border border-white/20">
            {waysWeHelp.map((item) => (
              <Link key={item.step} href={item.href} className="group bg-[#13245d] p-8 lg:p-9 hover:bg-[#1c3278] transition-colors">
                <div className="text-blue-300 font-bold mb-12">{item.step}</div>
                <div className="text-sm uppercase tracking-[0.16em] text-blue-200 mb-2">{item.label}</div>
                <h3 className="text-3xl font-bold mb-5">{item.title}</h3>
                <p className="text-blue-100 leading-relaxed mb-8">{item.text}</p>
                <span className="font-semibold">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-5 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-8 bg-[#eef2ff] -z-10 rotate-2" />
            <div className="bg-[#101d4b] text-white p-8 md:p-10 shadow-2xl">
              <div className="text-sm uppercase tracking-[0.18em] text-blue-200 mb-8">Imagine Your Volunteer Operation</div>
              <div className="space-y-4">
                {["Volunteers see exactly what they need to do.", "Sign-ups and schedules update without staff chasing people.", "Milestones and recognition are visible.", "Managers see the operation clearly instead of piecing it together."].map((text, i) => (
                  <div key={text} className="flex gap-4 items-start border-b border-white/15 pb-4">
                    <span className="h-8 w-8 shrink-0 rounded-full bg-white text-[#2a3db4] flex items-center justify-center font-bold">{i + 1}</span>
                    <p className="text-lg text-blue-50">{text}</p>
                  </div>
                ))}
              </div>
              <Link href="/Volunteer-demo" className="mt-8 inline-block bg-white text-[#2a3db4] px-7 py-3 font-semibold">Experience the Volunteer Demo →</Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">When Technology Is the Right Tool</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">Software should feel like it understands you.</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">You should be able to look at a system and think, <span className="font-semibold text-gray-900">&ldquo;This could be us.&rdquo;</span></p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">FoundationWorks starts with the operation—not a generic feature list. We learn the workflow, find the friction, and when custom technology makes sense, build around the way the nonprofit needs to work.</p>
            <Link href="/foundationworks" className="text-[#2a3db4] font-bold text-lg">See how FoundationWorks fits →</Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-5 bg-[#eef2ff] border-y border-blue-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">Learn It. Use It. Build On It.</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">Strong Foundations, Higher Horizons</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-5">The book brings the philosophy behind the work together: mission, leadership, usable systems, healthy capacity, and organizations built to last.</p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">Workshops take those ideas off the page and into the room, giving nonprofit leaders practical ways to examine and strengthen their own organizations.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/education" className="bg-[#2a3db4] text-white px-7 py-4 font-semibold text-center hover:bg-[#1e2e8a]">Explore the Book & Resources</Link>
              <Link href="/workshops" className="border border-[#2a3db4] text-[#2a3db4] px-7 py-4 font-semibold text-center hover:bg-white">Explore Workshops</Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image src="/book-cover.jpg" alt="Strong Foundations, Higher Horizons by Stephen Cook" width={300} height={450} className="rounded-md shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 px-5 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-center">
          <div className="relative">
            <div className="absolute -left-5 -bottom-5 w-full h-full border-2 border-[#2a3db4] -z-10" />
            <Image src="/about-photo.jpg" alt="Stephen Cook" width={900} height={760} className="w-full max-h-[560px] object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">Built by an Operator</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">This work comes from inside nonprofit operations.</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">Stephen Cook&apos;s approach is grounded in the practical work of running operations, rebuilding processes, creating measurable systems, and helping people do mission-driven work without depending on constant heroics.</p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">The point is never process for process&apos;s sake. Strong operations create the capacity for programs, people, and mission to do their best work.</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/about" className="text-[#2a3db4] font-bold">Meet Stephen →</Link>
              <Link href="/speaking" className="text-[#2a3db4] font-bold">Speaking →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 md:py-28 px-5 bg-[#2a3db4] text-white">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-blue-200 font-semibold tracking-[0.2em] uppercase text-sm mb-4">You Don&apos;t Need a Polished Problem Statement</p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Tell us what keeps ending up on your plate.</h2>
          <p className="text-blue-100 text-xl leading-relaxed mb-10">Bring the challenge, the recurring frustration, the spreadsheet nobody wants to touch, or the process everyone works around. We&apos;ll start there.</p>
          <Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-10 py-4 font-semibold hover:bg-blue-50 transition-colors">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
