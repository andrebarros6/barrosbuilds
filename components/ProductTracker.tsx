"use client";

import { products, type ProductStatus } from "@/lib/products";

const statusLabel: Record<ProductStatus, string> = {
  live: "LIVE",
  in_progress: "IN PROGRESS",
  planned: "PLANNED",
};

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

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: "var(--muted)",
            letterSpacing: "0.06em",
            alignItems: "center",
          }}
        >
          {[
            { color: "var(--color-live)", label: "LIVE" },
            { color: "var(--color-progress)", label: "IN PROGRESS" },
            { color: "var(--color-planned)", label: "PLANNED" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: color,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>

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
            ? "var(--color-live)"
            : isProg
            ? "var(--color-progress)"
            : "var(--color-planned)";
          const label = statusLabel[product.status];

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
                  fontVariantNumeric: "tabular-nums",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{String(product.id).padStart(2, "0")}</span>
                <span style={{ color: "var(--muted)" }}>{product.month}</span>
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
                    background: borderColor,
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
