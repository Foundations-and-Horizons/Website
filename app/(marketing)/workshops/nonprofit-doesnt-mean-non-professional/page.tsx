import Link from "next/link";

export const metadata = {
  title: "Nonprofit Doesn't Mean Non-Professional | Foundations & Horizons",
  description:
    "A practical, conversational workshop for nonprofit leaders to identify trust leaks, choose practical improvements, and leave with a clear 30-day action.",
};

const checkoutUrl = "https://square.link/u/QRt78Sjv";

export default function WorkshopOnePage() {
  return (
    <>
      <section className="bg-[#101d4b] text-white py-24 md:py-32 px-5">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-12 items-start">
          <div>
            <p className="uppercase tracking-[.22em] text-blue-200 text-sm font-semibold mb-5">
              Strong Foundations Workshop Series
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight max-w-5xl mb-7">
              Nonprofit Doesn&apos;t Mean Non-Professional
            </h1>
            <p className="text-2xl md:text-3xl text-blue-100 max-w-4xl leading-relaxed mb-8">
              Professionalism isn&apos;t about looking corporate. It&apos;s about showing people that your organization can be trusted with the mission you&apos;ve asked them to support.
            </p>
            <a href={checkoutUrl} target="_blank" rel="noreferrer" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold">
              Reserve Your Seat — $29
            </a>
          </div>
          <aside className="bg-white text-gray-950 p-8 shadow-xl">
            <p className="uppercase tracking-[.18em] text-[#2a3db4] text-xs font-bold mb-5">Live Online Workshop</p>
            <div className="space-y-5 text-lg">
              <div><p className="text-sm text-gray-500">Date</p><p className="font-bold">Wednesday, October 14, 2026</p></div>
              <div><p className="text-sm text-gray-500">Workshop</p><p className="font-bold">6:00–7:00 PM Mountain Time</p></div>
              <div><p className="text-sm text-gray-500">Optional help &amp; Q&amp;A</p><p className="font-bold">7:00–7:30 PM Mountain Time</p></div>
              <div><p className="text-sm text-gray-500">Registration</p><p className="font-bold">$29 per person</p></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="uppercase tracking-[.2em] text-[#2a3db4] text-sm font-semibold mb-4">This Is Not About Looking Fancy</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-6">Your mission can be grassroots. Your standards don&apos;t have to be.</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              This isn&apos;t a workshop about making your nonprofit look like a Fortune 500 company. If you leave thinking you need a branding agency and a $50,000 website, we&apos;ve missed the point.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              Instead, we&apos;ll look at the everyday signals your organization sends to donors, volunteers, partners, employees, and the people you serve—and ask one practical question: does the way we operate make it easier or harder for people to trust us?
            </p>
          </div>
          <div className="bg-[#f5f7fc] border border-gray-200 p-9">
            <p className="text-3xl font-bold text-[#101d4b] leading-tight mb-5">Scrappy resources don&apos;t have to mean scrappy standards.</p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Small teams and limited budgets are real. The goal isn&apos;t perfection. It&apos;s being intentional, clear, consistent, and reliable where it matters.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-5 bg-[#eef2ff] border-y border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="uppercase tracking-[.2em] text-[#2a3db4] text-sm font-semibold mb-4">What We&apos;ll Work On</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-5">See your organization through someone else&apos;s eyes.</h2>
            <p className="text-xl text-gray-600">This is a working conversation. You&apos;ll apply the ideas to your own organization as we go.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              ["How we look","Does what people see reflect who your organization is today?"],
              ["How we communicate","When someone reaches out, are your responses and expectations clear?"],
              ["How people experience us","Does a first-time donor, volunteer, partner, or participant know what to expect?"],
              ["How we follow through","Do your systems reliably deliver what you said they would?"],
            ].map(([t,d],i) => (
              <div key={t} className="bg-white border border-blue-100 p-7">
                <div className="text-[#2a3db4] font-bold mb-7">0{i+1}</div>
                <h3 className="text-xl font-bold mb-3">{t}</h3>
                <p className="text-gray-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_.95fr] gap-16">
          <div>
            <p className="uppercase tracking-[.2em] text-[#2a3db4] text-sm font-semibold mb-4">You&apos;ll Leave With</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-950 mb-7">Not twenty more things to do. A place to start.</h2>
            <div className="space-y-5 text-lg text-gray-700">
              <p><strong>An Organizational Trust Audit</strong> to help you spot places where trust may be leaking.</p>
              <p><strong>One quick win</strong> you can address without a major project or budget.</p>
              <p><strong>One larger priority</strong> worth giving real attention.</p>
              <p><strong>A clear 30-day action</strong> you can take back to work immediately.</p>
            </div>
          </div>
          <div className="border-l-4 border-[#2a3db4] pl-8">
            <p className="uppercase tracking-[.2em] text-[#2a3db4] text-sm font-semibold mb-4">Who It&apos;s For</p>
            <h3 className="text-3xl font-bold mb-5">People carrying the real work of a nonprofit.</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-5">
              Executive directors, operations leaders, program leaders, development leaders, and people wearing several of those hats at once.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              You don&apos;t need to have read <em>Strong Foundations, Higher Horizons</em> first. The workshop stands completely on its own.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-5 bg-[#101d4b] text-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="uppercase tracking-[.2em] text-blue-200 text-sm font-semibold mb-4">One Hour. Complete Workshop.</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">At 7:00, you&apos;ve gotten what you came for.</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              The formal workshop ends after 60 minutes. If you need to go, go. I&apos;ll stay for another 30 minutes at no additional cost for anyone who wants to bring a question, talk through something the audit uncovered, or get practical help with a situation they&apos;re facing.
            </p>
          </div>
          <div className="bg-white text-gray-950 p-9">
            <p className="text-sm uppercase tracking-[.18em] text-[#2a3db4] font-bold mb-4">October 14 · Live Online</p>
            <p className="text-3xl font-bold mb-2">6:00–7:00 PM MT</p>
            <p className="text-gray-600 mb-7">Optional help &amp; Q&amp;A until 7:30 PM MT</p>
            <a href={checkoutUrl} target="_blank" rel="noreferrer" className="block text-center bg-[#2a3db4] text-white px-8 py-4 font-semibold">
              Register for $29
            </a>
            <p className="text-sm text-gray-500 mt-4 text-center">Secure checkout through Square.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-5 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[.2em] text-[#2a3db4] text-sm font-semibold mb-4">Foundations &amp; Horizons</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-5">Practical nonprofit leadership for real humans.</h2>
          <p className="text-lg text-gray-600 mb-8">Strong foundations aren&apos;t about perfection. They&apos;re about building organizations that can carry the mission well.</p>
          <Link href="/workshops" className="font-semibold text-[#2a3db4]">Explore the workshop series →</Link>
        </div>
      </section>
    </>
  );
}
