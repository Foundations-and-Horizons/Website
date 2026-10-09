import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Turn & Burn — Demo",
  description: "Turn & Burn by Barn Ready barrel-racing app demo.",
};

export default function TurnAndBurnDemoPage() {
  return (
    <iframe
      src="/turn-and-burn-demo/index.html"
      title="Turn & Burn demo"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100dvh", border: 0, background: "#fff", zIndex: 9999 }}
      allow="fullscreen"
    />
  );
}
