"use client";

import { products, type ProductStatus } from "@/lib/products";

const statusLabel: Record<ProductStatus, string> = {
  live: "LIVE",
  in_progress: "IN PROGRESS",
  planned: "PLANNED",
};

const statusQuarter: Record<number, string> = {};
products.forEach((p) => {
  statusQuarter[p.id] = p.quarter;
});

export default function ProductTracker() {
  return (
    <section
      id="projects"
      style={{
        padding: "40px 32px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 24,
          paddingBottom: 14,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--accent2)",
              letterSpacing: "0.14em",
              marginBottom: 5,
            }}
          >
            THE BUILD
          </div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            10 Products · 2026
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 2,
        }}
      >
        {products.map((product) => {
          const isLive = product.status === "live";
          const isProg = product.status === "in_progress";
          const borderColor = isLive
            ? "var(--accent)"
            : isProg
            ? "var(--accent2)"
            : "var(--dim)";
          const dotColor = borderColor;
          const label =
            product.status === "planned"
              ? product.quarter
              : statusLabel[product.status];

          return (
            <a
              key={product.id}
              href={product.url ?? undefined}
              target={product.url ? "_blank" : undefined}
              rel={product.url ? "noopener noreferrer" : undefined}
              style={{
                background: "var(--surface2)",
                padding: "14px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 90,
                borderTop: `2px solid ${borderColor}`,
                textDecoration: "none",
                cursor: product.url ? "pointer" : "default",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--surface3)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
              }
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  color: "var(--dim)",
                  marginBottom: 6,
                  letterSpacing: "0.06em",
                }}
              >
                {String(product.id).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  lineHeight: 1.3,
                  color: isLive ? "var(--text)" : "var(--muted)",
                  flex: 1,
                }}
              >
                {product.name}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.05em",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: dotColor,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                {label}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
