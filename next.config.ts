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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
