export default function Signal() {
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
        FOLLOW THE BUILD
      </div>

      <div>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          1 year. 10 products.
        </p>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 13,
            lineHeight: 1.6,
            marginBottom: 28,
            fontWeight: 300,
          }}
        >
          Follow along on LinkedIn or GitHub — every ship gets documented.
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://www.linkedin.com/in/andrebarros-data/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              padding: "9px 18px",
              borderRadius: 3,
              letterSpacing: "0.04em",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            LinkedIn →
          </a>
          <a
            href="https://github.com/andrebarros6/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "transparent",
              color: "var(--sand)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 500,
              padding: "9px 18px",
              borderRadius: 3,
              border: "1px solid var(--border2)",
              letterSpacing: "0.04em",
            }}
          >
            GitHub →
          </a>
          <a
            href="mailto:andre@barrosbuilds.com"
            style={{
              background: "transparent",
              color: "var(--muted)",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              padding: "9px 18px",
              borderRadius: 3,
              border: "1px solid var(--border)",
              letterSpacing: "0.04em",
            }}
          >
            andre@barrosbuilds.com
          </a>
        </div>
      </div>
    </section>
  );
}
