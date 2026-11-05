import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Server pages read data/practices.json at runtime (compare page, and practice pages built on first visit)
  outputFileTracingIncludes: {
    "/compare": ["./data/practices.json"],
    "/practice/*": ["./data/practices.json"],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
