/**
 * Learning Log — the curriculum table of contents.
 *
 * Two rules from the curriculum definition are load-bearing here:
 *
 *  1. The five committed vocabulary terms — MCP, RAG, agents, evals and
 *     context engineering — were named in the announcement post and must
 *     appear by name in the published table of contents. They are marked
 *     with `key: true` below and rendered in the accent colour.
 *
 *  2. The archive groups by track, not chronologically, so a late
 *     subscriber can enter at any track. This list is ordered but the
 *     track is the primary unit — hence the grouping.
 *
 * Issue titles are shortened from the curriculum's working titles for
 * scanning. The full framing lives in the issues themselves.
 */

type Issue = {
  n: number;
  title: string;
  key?: boolean;
};

type Track = {
  n: number;
  name: string;
  blurb: string;
  issues: Issue[];
};

const TRACKS: Track[] = [
  {
    n: 1,
    name: "Working with the models",
    blurb: "Getting real output from the chat products.",
    issues: [
      { n: 1, title: "What the model actually sees" },
      { n: 2, title: "Prompting as engineering" },
      { n: 3, title: "Structured outputs" },
      { n: 4, title: "Reusable setup" },
      { n: 5, title: "Context engineering", key: true },
    ],
  },
  {
    n: 2,
    name: "Coding with agents",
    blurb: "Handing real work to a coding agent, and reviewing what comes back.",
    issues: [
      { n: 6, title: "First real task" },
      { n: 7, title: "CLAUDE.md" },
      { n: 8, title: "Plan before code" },
      { n: 9, title: "Review loops" },
      { n: 10, title: "What not to delegate" },
      { n: 11, title: "Long tasks" },
    ],
  },
  {
    n: 3,
    name: "Knowing it worked",
    blurb: "Replacing “it looks good” with something you can measure.",
    issues: [
      { n: 12, title: "Evals", key: true },
      { n: 13, title: "Building a golden dataset" },
      { n: 14, title: "LLM-as-judge" },
    ],
  },
  {
    n: 4,
    name: "Extending the tools",
    blurb: "Connecting models to your own systems.",
    issues: [
      { n: 15, title: "MCP", key: true },
      { n: 16, title: "Using existing MCP servers" },
      { n: 17, title: "Building your first MCP server" },
      { n: 18, title: "Connecting a model to your own database" },
      { n: 19, title: "Skills" },
      { n: 20, title: "Why drop below the products" },
    ],
  },
  {
    n: 5,
    name: "Building your own",
    blurb: "Below the products, to the API.",
    issues: [
      { n: 21, title: "The request loop" },
      { n: 22, title: "Tool use" },
      { n: 23, title: "Embeddings and vector search" },
      { n: 24, title: "Agents", key: true },
      { n: 25, title: "RAG, end to end", key: true },
      { n: 26, title: "Prompt injection and guardrails" },
    ],
  },
  {
    n: 6,
    name: "Agents that run without you",
    blurb: "Scheduled, persistent, and bounded — the ones you are not watching.",
    issues: [
      { n: 27, title: "Retrieval quality and its limits" },
      { n: 28, title: "Memory that outlives the session" },
      { n: 29, title: "Delegation" },
      { n: 30, title: "Agents on a schedule" },
    ],
  },
];

const mono: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
};

export default function Curriculum() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "72px 0 88px",
      }}
      aria-labelledby="curriculum-heading"
    >
      <div className="wrap">
        <div
          style={{
            ...mono,
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.06em",
            marginBottom: 14,
          }}
        >
          The curriculum
        </div>

        <h2
          id="curriculum-heading"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(24px, 3vw, 32px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--text)",
            marginBottom: 18,
            maxWidth: "24ch",
          }}
        >
          Thirty issues. Six tracks.
        </h2>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.75,
            maxWidth: "62ch",
            marginBottom: 12,
          }}
        >
          Every issue is one concept, one exercise, and the log of what broke.
          The sequence runs from getting useful output out of a chat window to
          shipping an agent that runs on a schedule without you.
        </p>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.75,
            maxWidth: "62ch",
            marginBottom: 48,
          }}
        >
          You start at issue 1 whenever you join — the sequence does not assume
          you read last week&apos;s.
        </p>

        <ol
          style={{
            listStyle: "none",
            display: "grid",
            gap: 40,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {TRACKS.map((track) => (
            <li key={track.n}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    ...mono,
                    fontSize: 11,
                    color: "var(--dim)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {String(track.n).padStart(2, "0")}
                </span>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 16,
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                  }}
                >
                  {track.name}
                </h3>
              </div>

              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 16,
                  paddingLeft: 24,
                  maxWidth: "38ch",
                }}
              >
                {track.blurb}
              </p>

              <ul style={{ listStyle: "none", paddingLeft: 24 }}>
                {track.issues.map((issue) => (
                  <li
                    key={issue.n}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "baseline",
                      padding: "5px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        ...mono,
                        fontSize: 11,
                        color: "var(--dim)",
                        minWidth: 18,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {issue.n}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: issue.key ? "var(--accent)" : "var(--sand)",
                      }}
                    >
                      {issue.title}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p
          style={{
            ...mono,
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            marginTop: 40,
            maxWidth: "62ch",
          }}
        >
          Every issue ships a public exercise repo. The concepts stay put; the
          exercises get updated as the tools change.
        </p>
      </div>
    </section>
  );
}
