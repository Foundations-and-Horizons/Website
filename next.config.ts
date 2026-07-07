import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/volunteer-hub",
        destination: "/volunteer-hub.html",
      },
    ];
  },
};

export default nextConfig;
