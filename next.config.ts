import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/PersonPage',
  images: { unoptimized: true },
};

export default nextConfig;
