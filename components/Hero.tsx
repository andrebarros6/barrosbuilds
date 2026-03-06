import { stats } from "@/lib/products";

export default function Hero() {
  return (
    <section
      id="about"
      style={{
        padding: "60px 32px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 320,
          height: 280,
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 65%)",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--accent2)",
          letterSpacing: "0.14em",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ display: "inline-block", width: 18, height: 1, background: "var(--accent2)" }} />
        BARROS BUILDS · 2026
      </div>

      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(36px, 5vw, 64px)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          marginBottom: 20,
        }}
      >
        I build{" "}
        <span style={{ color: "var(--accent)" }}>data & AI</span>
        <br />
        <span style={{ color: "var(--dim)" }}>products.</span>
      </h1>

      <p
        style={{
          color: "var(--muted)",
          fontSize: 14,
          maxWidth: 420,
          marginBottom: 32,
          lineHeight: 1.7,
          fontWeight: 300,
        }}
      >
        Data analyst turned product builder. Shipping 10 AI-powered products in 2026 — building in public every step of the way.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href="#projects"
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            padding: "10px 22px",
            borderRadius: 3,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          see the build →
        </a>
        <a
          href="https://www.linkedin.com/in/andrebarros6/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "transparent",
            color: "var(--sand)",
            padding: "10px 22px",
            borderRadius: 3,
            border: "1px solid var(--border2)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          my data work
        </a>
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: 44,
          display: "flex",
          gap: 32,
          paddingTop: 28,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: "var(--accent2)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {stats.total}
          </div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.07em",
              marginTop: 3,
            }}
          >
            PRODUCTS IN 2026
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: "var(--accent2)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {stats.live}
          </div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.07em",
              marginTop: 3,
            }}
          >
            LIVE NOW
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: "var(--accent2)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {stats.yearsExp}
          </div>
          <div
            style={{
              color: "var(--muted)",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.07em",
              marginTop: 3,
            }}
          >
            YRS DATA EXP.
          </div>
        </div>
      </div>
    </section>
  );
}
