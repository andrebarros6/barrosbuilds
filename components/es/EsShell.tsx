import Link from "next/link";
const mono = "'DM Mono', monospace";

export function EsNav() {
  return (
    <nav style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
        <Link href="/es" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "var(--accent)", fontSize: 16 }}>
          barros builds
        </Link>
        <div style={{ display: "flex", gap: 18, fontFamily: mono, fontSize: 11, color: "var(--muted)" }}>
          <Link href="/es#contacto">contacto</Link>
          <Link href="/">english</Link>
        </div>
      </div>
    </nav>
  );
}

export function EsFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 0", marginTop: 48 }}>
      <div
        className="wrap"
        style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: mono, fontSize: 11, color: "var(--muted)" }}
      >
        <span>André Barros · Almería</span>
        <span style={{ display: "flex", gap: 16 }}>
          <a href="mailto:andre@barrosbuilds.com">andre@barrosbuilds.com</a>
          <a href="https://www.linkedin.com/in/andrebarros-data/" target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
        </span>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 10,
        color: "var(--accent2)",
        letterSpacing: "0.14em",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ display: "inline-block", width: 18, height: 1, background: "var(--accent2)" }} />
      {children}
    </div>
  );
}
