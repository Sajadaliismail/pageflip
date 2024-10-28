import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iameonline.com",
        port: "",
        pathname: "/books/class-1/bubbles-class-1-sem-2/pages/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
