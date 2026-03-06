export default function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 16,
          color: "var(--text)",
          letterSpacing: "-0.02em",
        }}
      >
        barros<span style={{ color: "var(--accent)" }}>builds</span>
      </div>

      <ul
        style={{
          display: "flex",
          gap: 24,
          listStyle: "none",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: "0.04em",
        }}
      >
        <li><a href="#projects" style={{ color: "var(--muted)", textDecoration: "none" }}>projects</a></li>
        <li><a href="#about" style={{ color: "var(--muted)", textDecoration: "none" }}>about</a></li>
        <li>
          <a
            href="https://www.linkedin.com/in/andrebarros6/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            linkedin
          </a>
        </li>
      </ul>

      <a
        href="mailto:hello@barrosbuilds.com"
        style={{
          background: "var(--accent)",
          color: "var(--bg)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 500,
          padding: "7px 16px",
          borderRadius: 3,
          textDecoration: "none",
          letterSpacing: "0.04em",
        }}
      >
        hire me →
      </a>
    </nav>
  );
}
