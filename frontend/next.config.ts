import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const rawUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

    if (!rawUrl) {
      return [];
    }

    const baseHost = rawUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${baseHost}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
