import Link from "next/link";

export const metadata = {
  title: "FoundationWorks | Foundations & Horizons",
};

const comingSoon = [
  { title: "FoundationWorks Warehouse", desc: "Manage inventory, donations, and distribution operations without spreadsheets or workarounds." },
  { title: "FoundationWorks Operations", desc: "Track programs, participants, and daily workflows in one place — built around how nonprofits actually deliver services." },
  { title: "FoundationWorks Reporting", desc: "Stop pulling reports manually. Get the operational data you need, in a format that actually helps you make decisions." },
  { title: "FoundationWorks Inventory", desc: "Know exactly what you have, where it is, and where it&apos;s going — without a full-time staff member managing a spreadsheet." },
];

export default function FoundationWorksPage() {
  return (
    <>
      <section className="bg-[#2a3db4] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            FoundationWorks
          </h1>
          <p className="text-blue-100 text-xl leading-relaxed mb-2">
            Custom nonprofit software you own outright.
          </p>
          <p className="text-blue-200 text-base leading-relaxed">
            Built by nonprofit operators. Designed around your workflows. No subscriptions, no vendor dependency — just software that works the way you do.
          </p>
        </div>
      </section>

      {/* Why it exists */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3 text-center">Why FoundationWorks Exists</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">It Wasn&apos;t Built Because Nonprofits Needed More Software</h2>
          <div className="max-w-3xl mx-auto space-y-5 text-gray-700 leading-relaxed text-lg">
            <p>
              FoundationWorks was built after years of designing and running operational systems for real nonprofit organizations — managing volunteers, coordinating logistics, tracking programs, and keeping teams aligned across everything a nonprofit has to do.
            </p>
            <p>
              The tools that existed didn&apos;t fit. Generic platforms required nonprofits to reshape their operations around software designed for corporate environments. The workarounds piled up. The spreadsheets multiplied. Staff time got absorbed into administration instead of mission.
            </p>
            <p>
              So we built something different. Every feature in FoundationWorks exists because it solved a real problem — not because it looked good in a product demo.
            </p>
            <p className="italic text-[#2a3db4] font-medium border-l-4 border-[#2a3db4] pl-4">
              This is the software we wished existed when we were running nonprofit operations. Now it does.
            </p>
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-900">A Different Model — By Design</h2>
            <p>
              Every FoundationWorks implementation is built specifically for your organization. You work with our team to configure the system around your actual workflows, not a set of generic defaults. When the build is complete, the software is yours entirely.
            </p>
            <p>
              No monthly fees. No platform lock-in. No renewals. No vendor you&apos;re permanently dependent on to access your own data.
            </p>
            <p>
              Nonprofits already operate on tight margins. The last thing you need is another recurring expense that grows every year regardless of whether the software keeps working for you.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "You own the system", detail: "After implementation, the software is yours — no ongoing fees." },
              { label: "Built for your workflows", detail: "Configured around how your organization actually operates, not how a vendor thinks you should." },
              { label: "No subscriptions", detail: "One implementation cost. What you pay is what you pay." },
              { label: "Designed by operators", detail: "Built by someone who has run nonprofit operations — not just sold software to them." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                <div className="w-5 h-5 rounded-full bg-[#2a3db4] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current platform */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3 text-center">Available Now</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">FoundationWorks Volunteers</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">A complete volunteer management system — custom-built for your organization and ready for implementation.</p>
          <div className="bg-gray-50 border border-[#2a3db4] rounded-xl p-8 md:p-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[
                { outcome: "Spend less time managing volunteers.", detail: "Scheduling, onboarding, and communication handled in one place." },
                { outcome: "Never lose track of volunteer hours again.", detail: "Accurate records without manual spreadsheet updates." },
                { outcome: "Recognize your volunteers consistently.", detail: "Know who is serving, how much, and make sure they feel it." },
                { outcome: "Save administrative time every week.", detail: "Free your staff to focus on programs, not paperwork." },
              ].map((item) => (
                <div key={item.outcome} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#2a3db4] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.outcome}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/solutions/volunteer-management"
                className="inline-block bg-[#2a3db4] text-white px-8 py-3 font-semibold hover:bg-[#1e2e8a] transition-colors text-center"
              >
                See FoundationWorks Volunteers
              </Link>
              <Link
                href="/contact"
                className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 font-semibold hover:bg-[#2a3db4] hover:text-white transition-colors text-center"
              >
                Schedule a Discovery Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-[#2a3db4] uppercase mb-3 text-center">Growing Platform</p>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">FoundationWorks Is Expanding</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">FoundationWorks Volunteers is live and available now. Additional modules are in development — each one built to solve a specific operational challenge nonprofits face.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comingSoon.map((item) => (
              <div key={item.title} className="p-6 border border-gray-200 rounded-lg bg-white opacity-80">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Coming Soon</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">One Cost. No Ongoing Fees.</h2>
          <p className="text-blue-100 leading-relaxed mb-3 text-lg">
            Custom implementations starting at <span className="font-bold text-white">$5,000</span>. The scope depends on your organization&apos;s size, existing processes, and what you need the system to do.
          </p>
          <p className="text-blue-200 text-sm mb-8">After implementation, you own the system outright. There are no recurring charges, no renewals, and no vendor you&apos;re locked into.</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#2a3db4] px-10 py-4 font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Building Stronger Systems
          </Link>
        </div>
      </section>
    </>
  );
}
