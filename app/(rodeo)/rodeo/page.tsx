import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barn Ready — Rodeo",
  description: "Your rodeo events, records, horses, and season totals in one place.",
  applicationName: "Barn Ready",
  manifest: "/rodeo/site.webmanifest",
  icons: {
    icon: [{ url: "/rodeo/app-icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/rodeo/app-icon-512.png", sizes: "512x512", type: "image/png" }],
    shortcut: "/rodeo/app-icon-192.png",
    apple: "/rodeo/app-icon-192.png",
  },
};

export default function RodeoPage() {
  return (
    <iframe
      src="/rodeo/barn-ready.html"
      title="Barn Ready rodeo app"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, background: "#fff", zIndex: 9999 }}
      allow="fullscreen"
    />
  );
}
