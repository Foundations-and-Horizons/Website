import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turn & Burn by Barn Ready — Demo",
  description: "Turn & Burn by Barn Ready barrel-racing app demo.",
  applicationName: "Turn & Burn",
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
      src="/rodeo/turn-and-burn.html"
      title="Turn & Burn by Barn Ready demo"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, background: "#fff", zIndex: 9999 }}
      allow="fullscreen"
    />
  );
}
