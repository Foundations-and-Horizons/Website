import Link from "next/link";

export const metadata = {
  title: "FoundationWorks | Technology That Fits the Nonprofit",
  description: "FoundationWorks turns real nonprofit workflows into practical technology built around the organization.",
};

const moments = [
  ["The spreadsheet became the system.", "Information is scattered, duplicated, and dependent on the person who knows which tab is current."],
  ["Staff are doing work volunteers could do themselves.", "Routine sign-ups, updates, confirmations, and questions keep flowing back through staff."],
  ["The software technically works—but not for us.", "Your team has built workarounds around a platform that was never designed for the way your organization operates."],
  ["We can see the problem. We just can't find the tool.", "Sometimes the workflow is clear and the missing piece really is technology shaped around it."],
];

export default function FoundationWorksPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0e1b49] text-white py-28 md:py-36 px-5">
        <div className="absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full border border-white/10" />
        <div className="absolute right-[40px] top-[40px] h-[280px] w-[280px] rounded-full border border-white/10" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.22em] uppercase text-blue-200 mb-5">FoundationWorks</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight max-w-5xl mb-7">What if your software actually felt like your organization?</h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mb-10">Not another platform your team has to work around. Practical technology shaped by your programs, people, workflows, and the job that actually needs to get done.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/Volunteer-demo" className="bg-white text-[#2439a6] px-8 py-4 font-semibold text-center">Experience a Working Example</Link>
            <Link href="/contact" className="border border-white/60 px-8 py-4 font-semibold text-center hover:bg-white/10">Tell Us What You Wish Worked Better</Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-14">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">Does Any of This Sound Familiar?</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950">The need for software usually shows up as friction first.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {moments.map(([title,text]) => <div key={title} className="p-8 md:p-10 bg-[#f5f7fc] border border-gray-200"><h3 className="text-2xl font-bold text-gray-950 mb-3">{title}</h3><p className="text-lg text-gray-600 leading-relaxed">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-5 bg-[#eef2ff] border-y border-blue-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">See Yourself in the Possibility</p>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-950 mb-6">This demo is not the product. It is proof of what is possible.</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-5">The Volunteer Hub shows what happens when a system begins with the people doing the work: volunteers can handle more for themselves, managers can see what is happening, and recognition can become part of the operation.</p>
            <p className="text-xl font-semibold text-gray-900 mb-9">As you explore it, the question is not “Do I need this exact software?” It is “What would this look like for us?”</p>
            <Link href="/Volunteer-demo" className="inline-block bg-[#2a3db4] text-white px-8 py-4 font-semibold hover:bg-[#1e2e8a]">Open the Volunteer Demo →</Link>
          </div>
          <div className="bg-[#111f52] text-white shadow-2xl p-7 md:p-10">
            <div className="flex items-center justify-between border-b border-white/15 pb-5 mb-6"><div><p className="text-xs uppercase tracking-[.18em] text-blue-200">Example Experience</p><h3 className="text-2xl font-bold mt-1">Volunteer Hub</h3></div><span className="text-xs bg-emerald-400/15 text-emerald-200 px-3 py-1 rounded-full">Live Demo</span></div>
            <div className="grid sm:grid-cols-2 gap-4">
              {["Find & join opportunities","Manage your own schedule","Track participation & hours","Celebrate milestones","See program activity","Reduce staff follow-up"].map((x)=><div key={x} className="bg-white/8 border border-white/10 p-5"><div className="h-1 w-8 bg-blue-300 mb-4"/><p className="font-semibold">{x}</p></div>)}
            </div>
            <p className="mt-7 text-blue-100">A working example of the principle: give people the right information and the right actions at the right time.</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-14"><p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">How FoundationWorks Begins</p><h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-5">We don't sell you software and then discover your problem.</h2><p className="text-xl text-gray-600">We understand the operation first. Technology earns its place only when it makes the work clearer, easier, or more sustainable.</p></div>
          <div className="grid md:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
            {[["Listen","Show us how the work happens now—including the workarounds."],["Map","Separate the real process from the friction that has accumulated around it."],["Build","Shape the right tool around the workflow instead of forcing the workflow into a template."],["Hand Over","Train the team, hand over the system and its infrastructure, and keep the organization in control."]].map(([t,d])=><div key={t} className="bg-white p-7"><div className="h-1 w-10 bg-[#2a3db4] mb-8"/><h3 className="text-2xl font-bold mb-3">{t}</h3><p className="text-gray-600 leading-relaxed">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-24 px-5 bg-[#f7f2e8]"><div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center"><div><p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#2a3db4] mb-4">Ownership Changes the Relationship</p><h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">We build it for your organization. Then it becomes your organization's system.</h2><p className="text-xl text-gray-700 leading-relaxed mb-5">FoundationWorks is a custom-build service, not a shared software subscription. We can establish the application and supporting infrastructure around your organization, customize the experience to your language and workflows, train your team, and hand it over.</p><p className="text-lg text-gray-600 leading-relaxed">There is no required FoundationWorks software subscription after handoff. The underlying services an organization chooses to use may have their own costs as usage grows. If you want future support or enhancements, F&amp;H can help—but ownership does not depend on keeping us in the middle.</p></div><div className="bg-white border border-gray-200 p-8 md:p-10 shadow-sm"><p className="text-xs uppercase tracking-[.18em] text-[#2a3db4] mb-6">The FoundationWorks model</p>{[["Understand","Start with the operation, not a feature checklist."],["Customize","Use your programs, roles, language, rules, and priorities."],["Build","Create the working system and its supporting infrastructure."],["Hand over","Equip your team and put the organization in control."],["Grow when needed","Add support or enhancements later by choice."]].map(([t,d])=><div key={t} className="py-4 border-b border-gray-200 last:border-0"><h3 className="font-bold text-gray-950">{t}</h3><p className="text-gray-600 mt-1">{d}</p></div>)}</div></div></section>
<section className="py-24 px-5 bg-[#0f1c4b] text-white text-center">
        <div className="max-w-4xl mx-auto"><p className="text-blue-200 uppercase tracking-[.2em] text-sm font-semibold mb-4">Your Organization Is the Starting Point</p><h2 className="text-4xl md:text-6xl font-bold mb-6">You don't need to know what should be built.</h2><p className="text-xl text-blue-100 leading-relaxed mb-9">Tell us what keeps taking too long, falling through the cracks, living in spreadsheets, or depending on one person. We'll figure out whether technology belongs in the answer.</p><Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold">Start With the Problem</Link></div>
      </section>
    </>
  );
}
