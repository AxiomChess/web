import type { NextConfig } from "next"

const apiProxyTarget = (
  process.env.API_PROXY_TARGET ?? "http://127.0.0.1:3000"
).replace(/\/+$/u, "")

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Allow both localhost and 127.0.0.1 during `next dev` (HMR / client chunks).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${apiProxyTarget}/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
