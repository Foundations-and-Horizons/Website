import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundations & Horizons | Systems, Not Heroics",
  description: "Foundations & Horizons helps nonprofits build strong operational systems so their programs can rely on systems, not heroics.",
  keywords: ["nonprofit operations", "nonprofit systems", "nonprofit leadership", "volunteer management", "nonprofit workshops"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
