# BarrosBuilds Homepage — Deployment Guide

## Current Deployment

Live at **https://barrosbuilds.com** — deployed on Vercel.

## Deploy to Vercel (zero-config)

The site requires no environment variables and no build configuration beyond what Next.js provides.

```bash
# 1. Install dependencies
npm install

# 2. Verify build passes locally before pushing
npm run build

# 3. Push to main branch — Vercel auto-deploys on push
git push origin main
```

Vercel detects Next.js automatically. No `vercel.json` is needed unless you want custom redirects or headers (see below).

## Local Development

```bash
npm install
npm run dev        # starts on http://localhost:3000
```

## Pre-Deploy Checklist

- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] Product statuses in `lib/products.ts` are up to date
- [ ] Any new product URLs are correct and live

## Recommended: Add Security Headers

Add this to `next.config.ts` before the next deploy:

```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          },
        ],
      },
    ]
  },
}
```

## Updating Product Data

All product info is in `lib/products.ts`. To mark a product as live:

1. Change `status: 'PLANNED'` → `status: 'LIVE'`
2. Add `url: 'https://your-product-url.com'`
3. Commit and push — Vercel deploys automatically

## Known Security Issues (Resolve Before Next Commit)

Two plaintext credential files exist in the project root (one level above `homepage/`):
- `../stripe_backup_code.txt`
- `../supabase-pw.txt`

These must be deleted and those credentials rotated. They should never be committed to any repository.
