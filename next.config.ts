import type { NextConfig } from "next";

/**
 * Security headers. Vercel sets HSTS already; these cover the rest.
 *
 * No CSP yet — the app uses inline styles throughout and loads fonts from
 * Google, so a correct policy needs its own pass rather than a guessed one
 * that breaks the site.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * AI Wrapped lives in its own repo and Vercel project (github.com/andrebarros6/ai-wrapped) and is
 * served here at /wrapped. It's a static site built with basePath "/wrapped", so paths pass through
 * unchanged. Its own security headers (including a strict CSP) come back with each response.
 */
const WRAPPED_ORIGIN = "https://ai-wrapped-tau.vercel.app";

const nextConfig: NextConfig = {
  // The weekly send reads the issue and week files from disk at run time, so
  // they must ship inside that function's bundle.
  outputFileTracingIncludes: {
    "/api/cron/send-weekly": ["./content/learning-log/**/*"],
  },
  async rewrites() {
    return [
      { source: "/wrapped", destination: `${WRAPPED_ORIGIN}/wrapped` },
      { source: "/wrapped/:path*", destination: `${WRAPPED_ORIGIN}/wrapped/:path*` },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
