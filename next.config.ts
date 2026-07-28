import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/volunteer-demo", destination: "/volunteer-hub.html" },
      { source: "/Volunteer-Demo", destination: "/volunteer-hub.html" },
    ];
  },
};

export default nextConfig;
