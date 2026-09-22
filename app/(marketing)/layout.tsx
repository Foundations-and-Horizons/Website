import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteMotion from "@/components/SiteMotion";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteMotion />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
