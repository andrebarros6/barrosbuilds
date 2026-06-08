# BarrosBuilds Homepage — Site Overview

## Purpose

Marketing and portfolio site for the BarrosBuilds brand. Showcases André Barros' mission to ship 10 AI-powered products targeting the Portuguese market in 2026, and links out to each live product.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + PostCSS |
| Runtime | Node.js (Vercel-optimised) |
| Fonts | Syne, DM Mono, DM Sans (Google Fonts) |

## Directory Structure

```
homepage/
├── app/
│   ├── layout.tsx       # Root layout, fonts, metadata
│   ├── page.tsx         # Home page — composes all sections
│   └── globals.css      # CSS custom properties (design tokens)
├── components/
│   ├── Nav.tsx          # Sticky top navigation
│   ├── Hero.tsx         # Hero section with live stats
│   ├── Pillars.tsx      # 3-column philosophy / values
│   ├── FeaturedProducts.tsx  # 2-column featured project cards
│   ├── ProductTracker.tsx    # 5-column grid of all 10 products
│   └── Footer.tsx       # Social links, copyright
├── lib/
│   └── products.ts      # Single source of truth for all product data
└── public/              # Static assets (SVGs)
```

## Data Model

All product data lives in [lib/products.ts](../lib/products.ts). Each product has:

```ts
{
  id: string
  name: string
  tagline: string
  description: string
  status: 'LIVE' | 'IN_PROGRESS' | 'PLANNED'
  url?: string          // only present when live
  launchMonth: string   // e.g. "February 2026"
  tags: string[]
  featured?: boolean
}
```

**Current product statuses (as of April 2026):**
- LIVE: Painel dos Recibos
- IN_PROGRESS: Bitcoin Tools PT
- PLANNED: 8 remaining products (Q2–Q4 2026)

## Design Tokens

Defined in `globals.css` as CSS custom properties on `:root`:

- `--color-bg`: dark background
- `--color-surface`: card/panel background
- `--color-accent`: primary brand accent (earthy/warm)
- `--color-text-*`: typography hierarchy

## No Backend

The site is fully static:
- No API routes
- No environment variables
- No database
- No authentication

Updates to product data require editing `lib/products.ts` and redeploying.
