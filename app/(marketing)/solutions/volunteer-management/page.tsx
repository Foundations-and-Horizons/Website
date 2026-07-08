import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "FoundationOS Volunteers | Foundations & Horizons",
};

const features = [
  {
    icon: "📊",
    title: "Real-Time Impact Dashboard",
    desc: "See total volunteer hours, estimated dollar value, and FTE equivalents at a glance — automatically calculated every session.",
  },
  {
    icon: "📅",
    title: "Pack & Event Scheduling",
    desc: "Schedule packing events, assign roles (Pack Lead, Host, Assistants), and manage open signups with a clean calendar view.",
  },
  {
    icon: "👥",
    title: "Volunteer Profiles & Tracking",
    desc: "Track every volunteer's hours, roles, and engagement level. Visual card grid with role badges and activity tiers (Seedling, Rising, Anchor).",
  },
  {
    icon: "🚚",
    title: "Delivery Management",
    desc: "Assign drivers and assistants to delivery routes. Track weekly delivery schedules with driver/team pairings.",
  },
  {
    icon: "🏢",
    title: "Warehouse Operations",
    desc: "Manage warehouse shifts, inventory packing, and team coordination all from one centralized hub.",
  },
  {
    icon: "📱",
    title: "Volunteer Self Sign-In",
    desc: "Volunteers sign themselves in via a public portal — no admin overhead. Hours are logged automatically.",
  },
  {
    icon: "🏆",
    title: "Milestones & Anniversaries",
    desc: "Automatically surface volunteer birthdays, service anniversaries, and milestone achievements to recognize your team.",
  },
  {
    icon: "📈",
    title: "Reports & Analytics",
    desc: "Full reporting on volunteer activity, hours by time period, and organizational impact — ready to share with your board.",
  },
];

export default function VolunteerManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2a3db4] to-[#1a2a8a] text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 text-blue-100 text-sm px-4 py-1 rounded-full mb-6 tracking-wide">
            Custom-Built for Nonprofits
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            FoundationOS Volunteers
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            A purpose-built platform that gives your nonprofit complete visibility into volunteer
            hours, schedules, and impact — so you can run your program with confidence.
          </p>
          <a
            href="/volunteer-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#2a3db4] px-10 py-4 font-semibold hover:bg-blue-50 transition-colors"
          >
            Try the Interactive Demo →
          </a>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">See It in Action</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            A clean, modern interface built specifically for nonprofit volunteer programs.
          </p>
          <div className="space-y-8">
            {/* Dashboard screenshot */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
                <span className="ml-3 text-xs text-gray-400 font-mono">volunteer-hub — Dashboard</span>
              </div>
              <Image
                src="/screenshots/volunteer-dashboard.png"
                alt="Volunteer Hub Dashboard"
                width={1200}
                height={700}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                  <div className="w-3 h-3 rounded-full bg-green-400"/>
                  <span className="ml-3 text-xs text-gray-400 font-mono">Pack Schedule</span>
                </div>
                <Image
                  src="/screenshots/volunteer-schedule.png"
                  alt="Pack Schedule"
                  width={700}
                  height={500}
                  className="w-full"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                  <div className="w-3 h-3 rounded-full bg-green-400"/>
                  <span className="ml-3 text-xs text-gray-400 font-mono">Volunteer Roster</span>
                </div>
                <Image
                  src="/screenshots/volunteer-cards.png"
                  alt="Volunteer Roster"
                  width={700}
                  height={500}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Everything You Need</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Built from the ground up for food pantries, youth programs, and community nonprofits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center p-4">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#2a3db4] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Custom-Built for Your Organization</h2>
          <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto">
            This isn&apos;t off-the-shelf software. Every deployment is configured specifically for
            how your nonprofit operates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Discovery Call", desc: "We learn how your volunteer program works — roles, schedules, reporting needs." },
              { step: "2", title: "Custom Setup", desc: "We configure the platform to match your organization's structure and branding." },
              { step: "3", title: "Go Live + Support", desc: "Your team is onboarded and supported as you launch." },
            ].map((s) => (
              <div key={s.step} className="bg-white/10 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-200 mb-3">{s.step}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-blue-100 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Request */}
      {/* Live demo CTA */}
      <section className="py-14 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">See It Live — Right Now</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Explore the full platform in your browser. No login required — real features, real data, zero setup.
          </p>
          <a
            href="/volunteer-hub"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#2a3db4] font-bold px-10 py-4 rounded hover:bg-blue-50 transition-colors text-lg"
          >
            Try the Interactive Demo →
          </a>
        </div>
      </section>

    </>
  );
}
