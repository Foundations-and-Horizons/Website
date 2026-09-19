import Link from "next/link";

export const metadata = {
  title: "FoundationWorks Volunteers | Foundations & Horizons",
  description: "A customizable volunteer-management tool designed around how nonprofit volunteer programs actually work.",
};

const features = [
  ["Volunteer profiles & roles", "Keep volunteer information, roles, participation, and history organized in one place."],
  ["Scheduling & sign-up", "Give volunteers an easier way to find opportunities and sign up while reducing administrative work."],
  ["Self-service participation", "Shift routine updates and participation tasks toward volunteers themselves where it makes sense."],
  ["Hours & reporting", "Capture service activity and produce useful reports without rebuilding spreadsheets every month."],
  ["Recognition & milestones", "Make contributions visible so recognition becomes a repeatable part of the volunteer program."],
  ["Program visibility", "Give volunteer leaders a clearer view of participation, capacity, and what needs attention."],
];

export default function VolunteerManagementPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">A FoundationWorks Tool</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Volunteer management without making volunteers harder to manage.</h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl mb-9">
            FoundationWorks Volunteers is a customizable system designed to make volunteer programs easier to run, easier for volunteers to participate in, and easier for nonprofit leaders to understand.
          </p>
          <Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold hover:bg-blue-50">Talk Through Your Volunteer Program</Link>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">Built Around the Work</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The point is not more features. The point is less friction.</h2>
            <p className="text-gray-600 text-lg leading-relaxed">The system starts with how your volunteer program actually operates. Then we configure the right pieces around your roles, workflows, participation model, reporting needs, and recognition practices.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(([title, text]) => (
              <div key={title} className="border border-gray-200 p-7">
                <h3 className="font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#2a3db4] mb-3">How It Starts</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">We do not start with the software.</h2>
          <div className="space-y-7">
            {[
              ["Listen", "Understand your volunteers, staff, current tools, pain points, and goals."],
              ["Design", "Determine what the system actually needs to do and what should stay out of it."],
              ["Build", "Configure the system around your organization rather than asking your organization to conform to the system."],
              ["Train & hand over", "Get your team comfortable using it and keep ownership with the nonprofit."],
            ].map(([title, text], i) => (
              <div key={title} className="grid grid-cols-[44px_1fr] gap-4">
                <div className="w-11 h-11 bg-[#2a3db4] text-white flex items-center justify-center font-bold">{i + 1}</div>
                <div><h3 className="font-bold text-gray-900 mb-1">{title}</h3><p className="text-gray-600 leading-relaxed">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Is volunteer management becoming a bottleneck?</h2>
          <p className="text-blue-100 mb-8">Tell us how your program works today. We&apos;ll start by listening.</p>
          <Link href="/contact" className="inline-block bg-white text-[#2a3db4] px-9 py-4 font-semibold hover:bg-blue-50">Start a Conversation</Link>
        </div>
      </section>
    </>
  );
}
