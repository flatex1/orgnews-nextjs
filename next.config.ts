import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rugged-retriever-468.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
      {
        protocol: "https",
        hostname: "marvelous-ibis-283.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },
};

export default nextConfig;
