import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Start a Conversation | Foundations & Horizons",
  description: "Tell Foundations & Horizons what is happening in your nonprofit. Start with a conversation, not a sales pitch.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#16265f] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-200 mb-5">Start with Listening</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Tell us what&apos;s happening.</h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-3xl">
            You do not need to know exactly what you need. Tell us what is getting in the way, what feels harder than it should, or what you are trying to build.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">The first step is a conversation.</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              We are not going to assume that a particular service or tool is the answer. The point of the first conversation is to understand your organization well enough to figure out whether there is a useful way we can help.
            </p>
            <div className="space-y-4 text-gray-700">
              {[
                ["Tell us what is happening.", "The good, the frustrating, and the thing everyone keeps working around."],
                ["We listen and ask questions.", "We want to understand the system behind the symptom."],
                ["Then we decide what makes sense.", "Sometimes that is hands-on work. Sometimes it is education, a resource, a tool, or simply a clearer next step."],
              ].map(([title, text]) => (
                <div key={title} className="border-l-4 border-[#2a3db4] pl-4">
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-600 mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
