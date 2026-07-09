import Link from "next/link";

export const metadata = {
  title: "FoundationWorks | Foundations & Horizons",
};

const currentSolutions = [
  {
    title: "FoundationWorks Volunteers",
    status: "Available Now",
    desc: "A complete volunteer management system — custom-built for your organization. Track volunteers, manage schedules, handle onboarding, and run reports. You own the system after implementation.",
    href: "/solutions/volunteer-management",
  },
];

const comingSoon = [
  { title: "FoundationWorks Warehouse", desc: "Inventory and warehouse operations management built for nonprofits running distribution programs." },
  { title: "FoundationWorks Programs", desc: "Program tracking and participant management for nonprofits delivering services at scale." },
  { title: "FoundationWorks Inventory", desc: "Donation intake, inventory control, and asset tracking for nonprofits managing physical goods." },
  { title: "FoundationWorks Reporting", desc: "Operational reporting and dashboards built around how nonprofits actually measure impact." },
  { title: "FoundationWorks Analytics", desc: "Data analysis and trend tracking to help nonprofit leaders make better decisions with the data they already have." },
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
            Built by Nonprofit Operators, for Nonprofit Operators.
          </p>
          <p className="text-blue-200 text-base leading-relaxed">
            Software your organization owns. No subscriptions. No ongoing vendor dependency. Custom-built to the way you actually work.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-900">Software That Works the Way You Do</h2>
            <p>
              Most software is built by people who have never run a nonprofit. FoundationWorks was built by someone who has — and who got frustrated watching nonprofit staff force their work into tools designed for corporate environments.
            </p>
            <p>
              Every FoundationWorks implementation is custom-built for your organization. You work with our team to configure the system around your actual processes, not the other way around. When the implementation is complete, you own the system entirely. No monthly fees. No platform lock-in. No renewals.
            </p>
            <p>
              This is a different model — and it&apos;s intentional. Nonprofits shouldn&apos;t have to depend on a vendor indefinitely just to access their own data and processes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "You own the system", detail: "After implementation, the software is yours." },
              { label: "No subscriptions", detail: "One implementation cost. No recurring fees." },
              { label: "Custom-built", detail: "Configured for your workflows, not generic defaults." },
              { label: "Built by operators", detail: "Designed by someone who has run nonprofit operations." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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

      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Current Platform</h2>
          <p className="text-gray-500 text-center mb-10">Available now and ready for implementation.</p>
          <div className="grid grid-cols-1 gap-6">
            {currentSolutions.map((sol) => (
              <div key={sol.title} className="bg-white rounded-lg border border-[#2a3db4] p-8 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{sol.title}</h3>
                    <span className="text-xs font-semibold bg-[#2a3db4] text-white px-2 py-0.5 rounded">{sol.status}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{sol.desc}</p>
                </div>
                <Link
                  href={sol.href}
                  className="inline-block bg-[#2a3db4] text-white px-6 py-3 font-semibold hover:bg-[#1e2e8a] transition-colors whitespace-nowrap"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Coming Soon</h2>
          <p className="text-gray-500 text-center mb-10">The FoundationWorks platform is expanding. These modules are in development.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comingSoon.map((item) => (
              <div key={item.title} className="p-6 border border-gray-200 rounded-lg opacity-75">
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

      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Pricing</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Custom implementations starting at <span className="font-bold text-[#2a3db4]">$5,000</span>. The exact scope depends on your organization&apos;s size, existing processes, and what you need the system to do.
          </p>
          <p className="text-gray-500 text-sm mb-8">After implementation, you own the system. There are no ongoing fees or recurring charges.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solutions/volunteer-management"
              className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-8 py-3 font-semibold hover:bg-[#2a3db4] hover:text-white transition-colors"
            >
              See FoundationWorks Volunteers
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-[#2a3db4] text-white px-8 py-3 font-semibold hover:bg-[#1e2e8a] transition-colors"
            >
              Schedule a Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
