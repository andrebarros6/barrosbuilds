/**
 * Learning Log — audience expectation, shown between the CTA and the curriculum.
 *
 * The purpose is self-selection BEFORE signup. Without this, a reader with no
 * technical background joins, gets issue 1 on tokenizers and context windows,
 * and churns — bad for them and bad for the list.
 *
 * The bar leads with VERIFICATION, not code reading. Per the curriculum
 * definition: most of the sequence trains building the apparatus that tells
 * you whether output is right (all of Track 3, plus issues 17, 26, 27), which
 * needs little code reading. Code reading is the secondary floor — issues 9
 * and 22 turn on bugs you would never have thought to write a test for, and
 * those two collapse without it.
 *
 * Order matters here: validation first because it is the daily skill, code
 * reading second because it is a floor. "You must be a developer" would
 * wrongly exclude people who ship real things with Claude and check its work.
 *
 * Tone rule: this states a starting line, it does not gatekeep. The whole
 * posture of Learning Log is "I'm not an expert" — an audience note that reads
 * as exclusive contradicts the thing it is attached to.
 */

const mono: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
};

const listItem: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "var(--sand)",
  paddingLeft: 20,
  position: "relative",
  marginBottom: 10,
};

const marker: React.CSSProperties = {
  position: "absolute",
  left: 0,
  color: "var(--accent)",
};

export default function WhoThisIsFor() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "64px 0 8px",
      }}
      aria-labelledby="who-heading"
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
          Before you sign up
        </div>

        <h2
          id="who-heading"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(22px, 2.6vw, 28px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: "var(--text)",
            marginBottom: 28,
            maxWidth: "26ch",
          }}
        >
          Where this starts from.
        </h2>

        <div
          style={{
            display: "grid",
            gap: 40,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            maxWidth: 860,
          }}
        >
          <div>
            <h3
              style={{
                ...mono,
                fontSize: 12,
                color: "var(--text)",
                letterSpacing: "0.04em",
                marginBottom: 14,
              }}
            >
              What I assume you have
            </h3>
            <ul style={{ listStyle: "none" }}>
              <li style={listItem}>
                <span style={marker}>→</span>
                You&apos;ve used a chat model — Claude, ChatGPT, something. I
                won&apos;t be explaining what a prompt is.
              </li>
              <li style={listItem}>
                <span style={marker}>→</span>
                You can set up checks that tell you whether the output is
                right — tests, a validation script, a comparison against
                something you trust. Not because you enjoy it, but because
                &ldquo;it looks fine&rdquo; stops working fast.
              </li>
              <li style={listItem}>
                <span style={marker}>→</span>
                You can read code when the checks aren&apos;t enough. You
                won&apos;t write much of it — increasingly that&apos;s the whole
                point — but some bugs are ones you&apos;d never have thought to
                test for.
              </li>
              <li style={listItem}>
                <span style={marker}>→</span>
                You have something of your own to point this at. A repo, a
                dataset, a workflow. Every exercise ends by applying it to your
                own work.
              </li>
            </ul>
          </div>

          <div>
            <h3
              style={{
                ...mono,
                fontSize: 12,
                color: "var(--text)",
                letterSpacing: "0.04em",
                marginBottom: 14,
              }}
            >
              What you don&apos;t need
            </h3>
            <ul style={{ listStyle: "none" }}>
              <li style={listItem}>
                <span style={marker}>→</span>
                Any experience building with an LLM. If you&apos;ve only ever
                used the chat window, you&apos;re exactly who this is written
                for.
              </li>
              <li style={listItem}>
                <span style={marker}>→</span>
                An ML background. No training, no fine-tuning, no maths. This is
                about building with these tools, not about how they work
                inside.
              </li>
              <li style={listItem}>
                <span style={marker}>→</span>
                To be a professional engineer. If you ship things with Claude
                and check its work rather than trusting it, that counts.
              </li>
            </ul>
          </div>
        </div>

        <p
          style={{
            ...mono,
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: "0.04em",
            lineHeight: 1.7,
            marginTop: 36,
            maxWidth: "62ch",
          }}
        >
          If none of that sounds like you yet, the archive stays free and open —
          come back when it does.
        </p>
      </div>
    </section>
  );
}
