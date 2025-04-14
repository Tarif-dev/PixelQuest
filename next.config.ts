import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 disables lint errors from blocking build
  },
};

export default nextConfig;
