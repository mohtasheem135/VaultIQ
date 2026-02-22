import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",  // ✅
      "img-src 'self' blob: data: https:",
      "font-src 'self' https://fonts.gstatic.com",                      // ✅
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com`,
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  // ✅ Fix 1: moved out of experimental
  serverExternalPackages: [
    "pdf-parse",
    "mammoth",
    "@langchain/community",
  ],

  // ✅ Fix 2: silence the webpack/turbopack conflict warning
  turbopack: {},

  // Keep webpack for non-Turbopack builds (e.g. next build)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    return config;
  },
};

export default nextConfig;
