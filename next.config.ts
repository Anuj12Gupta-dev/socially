import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    // Disable server source maps to reduce warnings
    serverSourceMaps: false,
  },
  serverExternalPackages: ["@node-rs/argon2"],
  // Disable source maps in development to avoid warnings
  productionBrowserSourceMaps: false,
  // Configure Turbopack to reduce source map warnings
  turbopack: {
    debugIds: false,
  },
  // Configure webpack to handle source maps
  webpack: (config, { dev, isServer }) => {
    // Disable source maps in development to reduce warnings
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
  // Configure images for UploadThing
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  // Configure hashtag rewrites
  rewrites: async () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
};

export default nextConfig;