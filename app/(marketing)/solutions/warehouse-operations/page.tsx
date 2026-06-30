import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Warehouse Operations Platform | Foundations & Horizons",
};

export default function WarehouseOperationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a4a2a] to-[#0d3020] text-white py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 text-green-100 text-sm px-4 py-1 rounded-full mb-6 tracking-wide">
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Warehouse Operations Platform
          </h1>
          <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            A comprehensive operations management system built for nonprofit warehouses and
            distribution centers. Streamline inventory, packing, and team coordination.
          </p>
          <a
            href="#notify"
            className="inline-block bg-white text-[#1a4a2a] px-8 py-4 font-semibold hover:bg-green-50 transition-colors"
          >
            Get Notified at Launch
          </a>
        </div>
      </section>

      {/* Placeholder features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s Coming</h2>
          <p className="text-gray-500 mb-12">
            We&apos;re putting the finishing touches on our Warehouse Operations Platform.
            Here&apos;s a preview of what&apos;s included:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📦", title: "Inventory Management", desc: "Track stock levels, donations received, and items distributed in real time." },
              { icon: "👷", title: "Team Coordination", desc: "Manage warehouse shifts, assign tasks, and coordinate pack events across multiple teams." },
              { icon: "📋", title: "Operations Reporting", desc: "Generate reports on throughput, volunteer productivity, and program metrics." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Also see Volunteer Platform */}
      <section className="py-12 px-4 bg-[#2a3db4] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-100 mb-4">In the meantime, check out our Volunteer Management Platform — available now.</p>
          <Link
            href="/solutions/volunteer-management"
            className="inline-block bg-white text-[#2a3db4] px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
          >
            See Volunteer Management Platform
          </Link>
        </div>
      </section>

      {/* Notify form */}
      <section className="py-20 px-4 bg-gray-50" id="notify">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Notified at Launch</h2>
            <p className="text-gray-600 leading-relaxed">
              Leave your details and we&apos;ll reach out when the Warehouse Operations Platform
              is ready — and give you early access.
            </p>
          </div>
          <ContactForm subject="Warehouse Operations Platform — Launch Notification" />
        </div>
      </section>
    </>
  );
}
