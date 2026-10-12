import type { NextConfig } from "next";

const adminPath = process.env.ADMIN_PATH || "/studio-control";
const normalizedAdminPath = adminPath.startsWith("/") ? adminPath : `/${adminPath}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/studio-control/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  async rewrites() {
    if (normalizedAdminPath !== "/studio-control") {
      return [
        {
          source: normalizedAdminPath,
          destination: "/studio-control",
        },
        {
          source: `${normalizedAdminPath}/:path*`,
          destination: "/studio-control/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
