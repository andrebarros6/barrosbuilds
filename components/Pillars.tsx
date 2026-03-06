const pillars = [
  { title: "Building in Public", sub: "Every step, documented" },
  { title: "Learning by Doing", sub: "Ship, learn, iterate" },
  { title: "AI + Data in Action", sub: "Real problems, real solutions" },
];

export default function Pillars() {
  return (
    <div
      style={{
        padding: "32px",
        background: "var(--surface2)",
        borderBottom: "1px solid var(--border)",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
      }}
    >
      {pillars.map((p) => (
        <div
          key={p.title}
          style={{ padding: "18px 16px", background: "var(--surface3)" }}
        >
          <div
            style={{
              width: 24,
              height: 2,
              background: "var(--accent)",
              marginBottom: 12,
            }}
          />
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            {p.title}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "var(--muted)",
              letterSpacing: "0.04em",
            }}
          >
            {p.sub}
          </div>
        </div>
      ))}
    </div>
  );
}
