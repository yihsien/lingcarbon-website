import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',  // allow all paths from Unsplash
      },
    ],
  },
  async redirects() {
    return [
      {
        // Redirect all non‑www requests to the www subdomain
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'lingcarbon.com',
          },
        ],
        destination: 'https://www.lingcarbon.com/:path*',
        permanent: true, // Vercel will return 308 (permanent)
      },
    ];
  },
};

export default nextConfig;
