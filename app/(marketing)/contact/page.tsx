import ContactForm from "@/components/ContactForm";
import Image from "next/image";

export const metadata = {
  title: "Contact | Foundations & Horizons",
};

export default function ContactPage() {
  return (
    <>
      {/* CTA Banner */}
      <section className="relative py-24 flex items-center justify-center text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/cta-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#2a3db4]">
            Let&apos;s talk about where your organization is stuck … and how to move forward with clarity
          </h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              At Foundations &amp; Horizons, we specialize in helping nonprofits strengthen their
              operations, align their leadership, and create clear strategic plans for the future.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you&apos;re ready to build stronger systems, set a clear direction, or explore how
              we can support your mission, we&apos;d love to hear from you. Send us a message below.
            </p>
            <div className="mt-8 rounded-lg overflow-hidden shadow-md">
              <Image
                src="/contact-photo.jpg"
                alt="Mountain road"
                width={500}
                height={350}
                className="w-full object-cover"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
