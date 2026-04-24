export default function Context() {
  return (
    <section
      style={{
        padding: "48px 32px",
        borderBottom: "1px solid var(--border)",
      }}
    >
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
        ABOUT
      </div>

      <p
        style={{
          color: "var(--text)",
          fontSize: 15,
          lineHeight: 1.7,
          marginBottom: 16,
          fontWeight: 400,
        }}
      >
        8 years on a manufacturing floor at TE Connectivity. First to bring Power BI to the lines — 70% faster changeovers, 40% more output, 80% fewer defects. The data existed. I built the lens to read it differently.
      </p>

      <p
        style={{
          color: "var(--muted)",
          fontSize: 15,
          lineHeight: 1.7,
          fontWeight: 300,
        }}
      >
        Same instinct, new tools. AI products in 2026.
      </p>
    </section>
  );
}
