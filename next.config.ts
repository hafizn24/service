import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",          // when user visits root
        destination: "/home", // send them to /home
        permanent: false,     // use false for temporary redirect (302)
      },
    ];
  },
};

export default nextConfig;
