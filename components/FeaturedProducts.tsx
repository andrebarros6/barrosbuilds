"use client";

import { featuredProducts } from "@/lib/products";

export default function FeaturedProducts() {
  return (
    <section
      style={{
        padding: "40px 32px",
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
            WORK
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
            Live Projects
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {featuredProducts.map((product, i) => (
          <a
            key={product.id}
            href={product.url ?? "#projects"}
            target={product.url ? "_blank" : undefined}
            rel={product.url ? "noopener noreferrer" : undefined}
            style={{
              background: "var(--surface)",
              padding: 28,
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              display: "block",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "var(--surface)")
            }
          >
            {/* Status dot + tag row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: product.status === "live" ? "var(--color-live)" : "var(--color-progress)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  padding: "3px 8px",
                  border: "1px solid var(--border2)",
                  borderRadius: 2,
                }}
              >
                {product.tag}
              </span>
            </div>

            <h4
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              {product.name}
            </h4>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                lineHeight: 1.7,
                marginBottom: 16,
                fontWeight: 300,
                maxWidth: "42ch",
              }}
            >
              {product.description}
            </p>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: product.status === "live" ? "var(--accent)" : "var(--muted)",
                letterSpacing: "0.04em",
              }}
            >
              {product.url ? "View project →" : "In progress →"}
            </div>

            {/* Ghost month */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                right: 22,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 56,
                color: "var(--surface2)",
                lineHeight: 1,
                letterSpacing: "-0.05em",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {product.month.split(" ")[0].toUpperCase()}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
