export type ProductStatus = "live" | "in_progress" | "planned";

export interface Product {
  id: number;
  name: string;
  tag: string;
  description: string;
  status: ProductStatus;
  month: string;   /* e.g. "Feb 2026", "Jul 2026" — shown in tracker */
  url?: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Painel dos Recibos",
    tag: "DATA · FINTECH · PORTUGAL",
    description:
      "Dashboard for Portuguese independent workers to track income by month and client, and understand IRS retention — no spreadsheet needed.",
    status: "live",
    month: "Feb 2026",
    url: "https://paineldosrecibos.barrosbuilds.com/",
    featured: true,
  },
  {
    id: 2,
    name: "OUT Newsletter",
    tag: "MEDIA · LOCAL · EUROPE",
    description:
      "A weekly events newsletter that gets you off your screen and out into the world.",
    status: "live",
    month: "Mar 2026",
    url: "https://out.barrosbuilds.com/",
    featured: true,
  },
  {
    id: 3,
    name: "Crafted",
    tag: "PRODUCT · AI · CAREER",
    description:
      "An AI-powered CV and cover letter tailoring engine that gets career transitioners past the ATS screen and into the interview.",
    status: "in_progress",
    month: "Apr 2026",
    featured: true,
  },
  {
    id: 4,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on H1 learnings.",
    status: "planned",
    month: "Q3 2026",
  },
  {
    id: 5,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on H1 learnings.",
    status: "planned",
    month: "Q3 2026",
  },
  {
    id: 6,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on market feedback.",
    status: "planned",
    month: "Q3 2026",
  },
  {
    id: 7,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on market feedback.",
    status: "planned",
    month: "Q3 2026",
  },
  {
    id: 8,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on success patterns.",
    status: "planned",
    month: "Q4 2026",
  },
  {
    id: 9,
    name: "Coming Soon",
    tag: "TBD",
    description: "Chosen based on success patterns.",
    status: "planned",
    month: "Q4 2026",
  },
  {
    id: 10,
    name: "Coming Soon",
    tag: "TBD",
    description: "Year-end project.",
    status: "planned",
    month: "Q4 2026",
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export const stats = {
  total: 10,
  live: products.filter((p) => p.status === "live").length,
  inProgress: products.filter((p) => p.status === "in_progress").length,
  users: 20,  /* 13 OUT + 7 Painel — update manually as it grows */
  yearsExp: "8+",
};
