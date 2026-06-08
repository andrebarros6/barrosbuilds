# BarrosBuilds — 2026 Product Roadmap

**Mission:** Ship 10 AI-powered products targeting the Portuguese market in 2026.  
**Revenue target:** €500+ MRR by December 2026.

## Product Status

| # | Product | Month | Status | URL |
|---|---------|-------|--------|-----|
| 1 | Painel dos Recibos (IRS Dashboard) | February | LIVE | — |
| 2 | Bitcoin Tools Portugal | March–April | IN_PROGRESS | — |
| 3 | Town Newsletter | April | PLANNED | — |
| 4 | Crypto Portfolio Tracker | May | PLANNED | — |
| 5 | Family Photo Sharing App | June | PLANNED | — |
| 6 | Personal Trainer App | July | PLANNED | — |
| 7 | TBD (based on H1 learnings) | September | PLANNED | — |
| 8 | TBD | October | PLANNED | — |
| 9 | TBD | November | PLANNED | — |

## Quarterly Goals

| Quarter | MRR Target | Users Target |
|---------|-----------|--------------|
| Q1 (Jan–Mar) | €100+ | 300+ |
| Q2 (Apr–Jun) | €250+ | 800+ |
| Q3 (Jul–Sep) | €400+ | 1,500+ |
| Q4 (Oct–Dec) | €500+ | 2,000+ |

## Kill/Pivot/Double-Down Rules

**Kill after 8 weeks if:**
- <50 users AND <€20 MRR
- No growth for 4 consecutive weeks
- >20% monthly churn

**Double down if:**
- >€100 MRR within first 2 months
- Organic growth (no paid marketing)
- <5% churn
- Users actively referring others

**Pivot if:**
- Good engagement but no revenue
- Clear demand but wrong solution

## Updating the Homepage

When a product's status changes, update `lib/products.ts`:

- `'PLANNED'` → `'IN_PROGRESS'`: product is being built
- `'IN_PROGRESS'` → `'LIVE'`: add the `url` field with the live product URL
- To feature a product in the hero grid: set `featured: true`

The homepage reflects these statuses automatically — no other files need changing.

## Full Roadmap Reference

Detailed week-by-week plans are in the project root (outside `homepage/`):
- `barros_builds_2026_overview.md` — weekly schedule, all 12 months
- `barros_builds_2026_detailed.md` — step-by-step build plans for each product
