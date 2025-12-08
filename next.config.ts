import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 30,
    }
  },
  serverExternalPackages: ["@node-rs/argon2"],
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
};

export default nextConfig;