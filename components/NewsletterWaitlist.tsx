import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import {
  NEWSLETTER_HEADLINE,
  NEWSLETTER_NAME,
  firstIssueMonth,
} from "@/lib/newsletter";

/**
 * Compact homepage block. The full pitch lives on /log — this stays
 * in the page's register (~25 words, comparable to Context) so it reads as a
 * standing invitation rather than a landing page bolted into the scroll.
 */
export default function NewsletterWaitlist() {
  return (
    <section
      style={{
        padding: "64px 0",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 300,
          background: "radial-gradient(ellipse, var(--accent) 0%, transparent 60%)",
          opacity: 0.05,
          pointerEvents: "none",
        }}
      />

      <div className="wrap" style={{ position: "relative" }}>
        {/* Wordmark sits above the headline (Syne 800); the headline text
            itself stays fixed and does not absorb the name. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 1,
              background: "var(--accent)",
            }}
          />
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "-0.01em",
              color: "var(--accent)",
            }}
          >
            {NEWSLETTER_NAME}
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(24px, 3.2vw, 34px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: 14,
            color: "var(--text)",
            maxWidth: "24ch",
          }}
        >
          {NEWSLETTER_HEADLINE}
        </h2>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 12,
            maxWidth: "54ch",
          }}
        >
          One concept a week: theory, a hands-on exercise, and my failure log.
        </p>

        {/* Own line — it's the differentiator, not a trailing clause. */}
        <p
          style={{
            color: "var(--text)",
            fontSize: 15,
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          I&apos;m not an expert — that&apos;s the point.
        </p>

        <WaitlistForm source="homepage" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginTop: 18,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: "var(--muted)" }}>
            Free. Weekly. First issue ships {firstIssueMonth()}.
          </span>
          <Link
            href="/log"
            style={{ color: "var(--sand)", borderBottom: "1px solid var(--border2)" }}
          >
            What this is →
          </Link>
        </div>
      </div>
    </section>
  );
}
