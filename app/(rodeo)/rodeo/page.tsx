import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turn & Burn by Barn Ready — Demo",
  description: "Turn & Burn by Barn Ready barrel-racing app demo.",
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
