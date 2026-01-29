import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "player.vimeo.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Ensure Turbopack or Webpack handles video files if you import them locally
  // but for remote URLs like the one provided, the remotePatterns above cover the imagery.
};

export default nextConfig;