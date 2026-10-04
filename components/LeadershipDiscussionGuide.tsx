import Link from "next/link";

export const leadershipGuidePdf = "/pdfs/LeadershipDiscussionGuide.pdf";

const contents = [
  "8 guided sessions with discussion questions",
  "Practical organizational exercises",
  "Facilitator guidance for group conversations",
  "Connections to the book’s existing tools",
  "A Strong Foundations assessment",
  "A 90-Day Action Plan",
];

export default function LeadershipDiscussionGuide() {
  return (
    <section id="leadership-discussion-guide" aria-labelledby="leadership-guide-title" className="scroll-mt-28 bg-[#fcfbf8] px-5 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto border border-[#14213d]/10 bg-white">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="p-8 md:p-12">
            <p className="fh-kicker mb-5">Free book companion · PDF</p>
            <h2 id="leadership-guide-title" className="fh-display text-4xl md:text-5xl leading-tight mb-3">Strong Foundations, Higher Horizons</h2>
            <p className="text-2xl font-bold text-[#14213d] mb-6">Leadership Discussion Guide</p>
            <p className="text-lg text-[#536078] leading-relaxed mb-5">Work through the book together and turn its concepts into practical organizational conversations and action. Designed for nonprofit leadership teams, boards, book clubs, and professional-development cohorts.</p>
            <p className="text-lg text-[#536078] leading-relaxed mb-8">Already own the book or considering it for your group? This companion helps you plan the study and put the ideas to work. The guide is free to download, with no additional purchase required.</p>
            <a href={leadershipGuidePdf} download="Strong-Foundations-Leadership-Discussion-Guide.pdf" className="fh-button inline-block bg-[#2448d8] text-white px-7 py-4 font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2448d8]">Download the free guide →</a>
            <p className="text-sm text-[#536078] mt-3">PDF · No signup required</p>
          </div>
          <div className="bg-[#a7d8c8]/20 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#14213d] mb-6">Inside the guide</h3>
            <ul className="space-y-4 text-[#14213d]">
              {contents.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2448d8]" />
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <figure className="border-t border-[#14213d]/15 mt-9 pt-7">
              <blockquote className="fh-display text-2xl leading-relaxed text-[#14213d]">“The staff said it was hands down the most relatable book we have done so far.”</blockquote>
              <figcaption className="text-sm text-[#536078] leading-relaxed mt-4">— Nonprofit leader who used the book for a staff book study</figcaption>
            </figure>
          </div>
        </div>
        <div className="border-t border-[#14213d]/10 p-8 md:px-12 text-[#536078]">
          <p className="leading-relaxed">Start with the book. Use the guide with your group. If a conversation points to something you want to explore further, F&amp;H offers <Link href="/workshops" className="font-bold text-[#2448d8] underline underline-offset-4">workshops</Link>, <Link href="/speaking" className="font-bold text-[#2448d8] underline underline-offset-4">speaking</Link>, and <Link href="/services" className="font-bold text-[#2448d8] underline underline-offset-4">consulting</Link> to help put those ideas into practice.</p>
        </div>
      </div>
    </section>
  );
}
