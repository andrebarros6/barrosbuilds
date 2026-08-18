export default function FollowTheBuild() {
  return (
    <section
      style={{
        padding: "56px 0",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Secondary CTA — the newsletter waitlist directly above owns the
          terracotta fill and the glow, so this one stays understated. */}
      <div className="wrap" style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--accent2)",
              letterSpacing: "0.14em",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ display: "inline-block", width: 18, height: 1, background: "var(--accent2)" }} />
            FOLLOW THE BUILD
          </div>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(22px, 2.8vw, 30px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 16,
              color: "var(--text)",
            }}
          >
            Watch all 10 get built.
          </h2>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 32,
              fontWeight: 400,
            }}
          >
            Every product — what shipped, what broke, the real numbers. Building in public on LinkedIn, every step.
          </p>

          <a
            href="https://www.linkedin.com/in/andrebarros-data/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
              color: "var(--sand)",
              border: "1px solid var(--border2)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              fontWeight: 500,
              padding: "12px 24px",
              borderRadius: 3,
              letterSpacing: "0.04em",
            }}
          >
            Follow on LinkedIn →
          </a>
      </div>
    </section>
  );
}
