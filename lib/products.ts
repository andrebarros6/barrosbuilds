export type ProductStatus = "live" | "in_progress" | "planned";

export interface Product {
  id: number;
  name: string;
  tag: string;
  description: string;
  status: ProductStatus;
  quarter: string;
  url?: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Painel dos Recibos",
    tag: "DATA · FINTECH · PORTUGAL",
    description:
      "Dashboard for Portuguese independent workers to manage and understand their IRS recibos verdes — tax filing made simple.",
    status: "live",
    quarter: "Q1 2026",
    url: "https://paineldosrecibos.barrosbuilds.com/",
    featured: true,
  },
  {
    id: 2,
    name: "Bitcoin Tools PT",
    tag: "DATA · BITCOIN · PORTUGAL",
    description:
      "A suite of tools comparing real asset prices in Bitcoin and EUR for the Portuguese market — houses, food, PPR, solar.",
    status: "in_progress",
    quarter: "Q1 2026",
    featured: true,
  },
  {
    id: 3,
    name: "Town Newsletter",
    tag: "MEDIA · LOCAL",
    description: "Hyper-local newsletter for small Portuguese towns.",
    status: "planned",
    quarter: "Q2 2026",
  },
  {
    id: 4,
    name: "Crypto Portfolio Tracker",
    tag: "DATA · CRYPTO",
    description: "Aggregate all your CEX and wallet holdings in one dashboard.",
    status: "planned",
    quarter: "Q2 2026",
  },
  {
    id: 5,
    name: "Family Photo App",
    tag: "PRODUCT · FAMILY",
    description: "Private, simple photo sharing for families.",
    status: "planned",
    quarter: "Q2 2026",
  },
  {
    id: 6,
    name: "Personal Trainer App",
    tag: "PRODUCT · FITNESS",
    description: "Workout assignment and client tracking for independent trainers.",
    status: "planned",
    quarter: "Q3 2026",
  },
  {
    id: 7,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on H1 learnings.",
    status: "planned",
    quarter: "Q3 2026",
  },
  {
    id: 8,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on market feedback.",
    status: "planned",
    quarter: "Q4 2026",
  },
  {
    id: 9,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on success patterns.",
    status: "planned",
    quarter: "Q4 2026",
  },
  {
    id: 10,
    name: "Coming Soon",
    tag: "TBD",
    description: "Year-end project.",
    status: "planned",
    quarter: "Q4 2026",
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export const stats = {
  total: 10,
  live: products.filter((p) => p.status === "live").length,
  yearsExp: "8+",
};
