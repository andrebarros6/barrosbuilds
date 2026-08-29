import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";
import Curriculum from "@/components/Curriculum";
import {
  NEWSLETTER_HEADLINE,
  NEWSLETTER_NAME,
  firstIssueMonth,
} from "@/lib/newsletter";

export const metadata: Metadata = {
  title: "Learning Log — Barros Builds",
  description:
    "Learn AI by building it. A public build log — one concept a week, a hands-on exercise, and the failure log. Free.",
  openGraph: {
    title: "Learning Log — learn AI by building it.",
    description:
      "A public build log — one concept a week, a hands-on exercise you can run, and what broke. Free.",
    url: "https://barrosbuilds.com/log",
    siteName: "Barros Builds",
    type: "website",
  },
};

const paragraph: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 16,
  lineHeight: 1.75,
  marginBottom: 20,
};

export default function NewsletterPage() {
  return (
    <main>
      <Nav />

      <section style={{ padding: "72px 0 40px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 760,
            height: 340,
            background: "radial-gradient(ellipse, var(--accent) 0%, transparent 60%)",
            opacity: 0.06,
            pointerEvents: "none",
          }}
        />

        <div className="wrap" style={{ position: "relative" }}>
          <Link
            href="/"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.04em",
            }}
          >
            ← barrosbuilds
          </Link>

          {/* Wordmark above the headline, per the brief. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "36px 0 18px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                background: "var(--accent)",
              }}
            />
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 19,
                letterSpacing: "-0.01em",
                color: "var(--accent)",
              }}
            >
              {NEWSLETTER_NAME}
            </span>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: "var(--muted)",
                letterSpacing: "0.04em",
              }}
            >
              a public build log
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(30px, 4.4vw, 46px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              marginBottom: 32,
              color: "var(--text)",
              maxWidth: "22ch",
            }}
          >
            {NEWSLETTER_HEADLINE}
          </h1>

          {/* Full pitch — the long-form copy belongs here, where the reader
              has already clicked through and wants the whole case. */}
          <div style={{ maxWidth: "62ch" }}>
            <p style={paragraph}>
              I&apos;m learning to build with AI in public — agents, MCP, RAG, evals,
              context management — one concept at a time. Each week I pick a tool,
              write the theory, build an exercise, and do it myself. What works
              ships as a public repo. What breaks gets written up honestly.
            </p>

            <p style={paragraph}>
              You get the same thing I do: a weekly email with the concept, a
              hands-on exercise you can run, and the failure log from my own week.
              Plus what actually moved in AI over the past seven days, without the
              hype.
            </p>

            <p style={paragraph}>
              The exercises are yours to keep. They live on GitHub, they stay
              updated as the tools change, and they&apos;re designed to be applied
              to your own projects — not just followed.
            </p>

            {/* Load-bearing. Do not soften, shorten, or move. */}
            <p
              style={{
                ...paragraph,
                color: "var(--text)",
                borderLeft: "2px solid var(--accent)",
                paddingLeft: 18,
                marginBottom: 40,
              }}
            >
              I&apos;m not an expert. That&apos;s the point. This is a build log, not
              a course from someone who already figured it out.
            </p>
          </div>

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.06em",
              marginBottom: 14,
            }}
          >
            Free. Weekly. Unsubscribe whenever.
          </div>

          <WaitlistForm source="log-page" />

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 18,
              letterSpacing: "0.04em",
              paddingBottom: 72,
            }}
          >
            First issue ships {firstIssueMonth()}. No spam, no upsell.
          </div>
        </div>
      </section>

      <Curriculum />

      <Footer />
    </main>
  );
}
