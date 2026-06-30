import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundations & Horizons | Nonprofit Consulting",
  description: "We partner with nonprofit leaders to streamline operations, align leadership teams, and create clear strategies for growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
