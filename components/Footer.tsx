export default function Footer() {
  return (
    <footer
      style={{
        padding: "28px 32px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 15,
          color: "var(--text)",
        }}
      >
        barros<span style={{ color: "var(--accent)" }}>builds</span>
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--muted)",
        }}
      >
        Building in public · 2026
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: "var(--muted)",
        }}
      >
        <a
          href="https://www.linkedin.com/in/andrebarros6/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/andrebarros6"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          GitHub
        </a>
        <a
          href="mailto:hello@barrosbuilds.com"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          hello@barrosbuilds.com
        </a>
      </div>
    </footer>
  );
}
