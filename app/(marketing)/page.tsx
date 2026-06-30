import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const pillars = [
  {
    title: "Streamline Operations & Systems",
    desc: "Simplify workflows, reduce bottlenecks, and free up staff to focus on impact.",
    icon: "⚙️",
  },
  {
    title: "Align Leadership Around What Matters",
    desc: "Bring your leadership team together around a shared vision and measurable goals.",
    icon: "🧭",
  },
  {
    title: "Turn Strategy into Sustainable Results",
    desc: "Turn your mission into action with clear plans and accountability.",
    icon: "🛣️",
  },
];

const services = [
  "Operational Assessment & Optimization",
  "Strategic Planning Facilitation",
  "Program Operations Scaling",
  "Leadership & OKR Alignment",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-white/0" />
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-white"
          style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
        />
        <div className="relative z-10 px-4 max-w-3xl pb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2a3db4] mb-8 leading-tight drop-shadow-sm">
            Building Strong Foundations.<br />Guiding Towards New Horizons.
          </h1>
          <p className="text-white text-lg md:text-xl italic mb-10 drop-shadow-md">
            We partner with nonprofit leaders to streamline operations, align leadership teams,
            and create clear strategies for growth, so you can achieve more with the resources you already have.
          </p>
          <div className="text-white drop-shadow-md">
            <p className="font-semibold">
              Author of <em>Strong Foundations, Higher Horizons</em>
            </p>
            <p className="text-sm mb-3">A leader&apos;s guide to nonprofit success</p>
            <a
              href="https://www.amazon.com/Strong-Foundations-Higher-Horizons-nonprofit-ebook/dp/B0G67NDZH7/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              Available on Amazon
            </a>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {pillars.map((p) => (
            <div key={p.title} className="flex flex-col items-center">
              <div className="text-7xl mb-6">{p.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Quote */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#2a3db4] text-lg md:text-xl italic leading-relaxed">
            — At Foundations &amp; Horizons, we know how overwhelming it can feel to run a nonprofit
            with limited time, people, and resources. That&apos;s why we focus on the two areas that
            create the biggest ripple effect: strong operational foundations and aligned leadership
            strategy. With the right systems and clarity, your team can focus on what truly
            matters—serving your community.
          </p>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((s) => (
              <p key={s} className="text-[#2a3db4] text-xl md:text-2xl font-light py-2">{s}</p>
            ))}
          </div>
          <Link
            href="/services"
            className="inline-block border-2 border-[#2a3db4] text-[#2a3db4] px-16 py-4 hover:bg-[#2a3db4] hover:text-white transition-colors tracking-wide"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-28 flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/cta-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2a3db4]">
            Let&apos;s talk about where your organization is stuck … and how to move forward with clarity
          </h2>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-gray-50" id="contact">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Ready to strengthen your nonprofit&apos;s operations and leadership? Share a few details
              below—we look forward to connecting and exploring how we can support your goals.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
