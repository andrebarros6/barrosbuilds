import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms — Barros Builds",
  description:
    "The terms for using barrosbuilds.com and receiving the Learning Log.",
};

const LAST_UPDATED = "4 October 2026";

const h2: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: 19,
  letterSpacing: "-0.01em",
  color: "var(--text)",
  margin: "36px 0 12px",
};

const p: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 15,
  lineHeight: 1.75,
  marginBottom: 14,
};

export default function TermsPage() {
  return (
    <main>
      <Nav />

      <section style={{ padding: "56px 0 80px" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
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

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 40px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text)",
              margin: "32px 0 10px",
            }}
          >
            Terms
          </h1>

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: "0.04em",
              marginBottom: 34,
            }}
          >
            Last updated {LAST_UPDATED}
          </div>

          <p style={{ ...p, color: "var(--text)" }}>
            Short version: the Learning Log is free, you can leave whenever you
            like, and everything in it is one person learning in public — use
            it at your own judgement.
          </p>

          <h2 style={h2}>What these cover</h2>
          <p style={p}>
            This website, barrosbuilds.com, and the Learning Log emails sent
            from it. The other products linked from here are separate sites and
            these terms don&apos;t cover them.
          </p>
          <p style={p}>
            The site and the Learning Log are run by André Barros, an individual
            based in Portugal — reachable at{" "}
            <a href="mailto:andre@barrosbuilds.com" style={{ color: "var(--sand)" }}>
              andre@barrosbuilds.com
            </a>
            .
          </p>

          <h2 style={h2}>What you get</h2>
          <p style={p}>
            If you sign up, one email a week with a concept, an exercise, and
            what broke. It&apos;s free. There&apos;s no account, no payment, and
            nothing to cancel beyond unsubscribing.
          </p>
          <p style={p}>
            I aim for weekly, but this is a build log written by one person.
            An issue may arrive late or skip a week, and I may change or stop
            the Learning Log.
          </p>

          <h2 style={h2}>Leaving</h2>
          <p style={p}>
            Every email has a one-click unsubscribe link in the footer. What
            happens to your address after that is in the{" "}
            <Link href="/privacy" style={{ color: "var(--sand)" }}>
              privacy policy
            </Link>
            .
          </p>

          <h2 style={h2}>No guarantees</h2>
          <p style={p}>
            I&apos;m not an expert, and nothing here is professional advice. The
            write-ups and exercises are what I learned that week, mistakes
            included. They&apos;re provided as they are, with no warranty that
            they&apos;re correct, complete, or fit for your project.
          </p>
          <p style={p}>
            If you run an exercise, you&apos;re running it on your own machine
            and your own accounts. Any API usage it incurs with a third-party
            provider is billed to you by that provider, so read the code before
            you run it. To the extent the law allows, I&apos;m not liable for
            loss that results from relying on anything published here. Nothing
            in these terms limits rights you have under consumer law that
            can&apos;t be waived.
          </p>

          <h2 style={h2}>Using the content</h2>
          <p style={p}>
            The text on this site and in the emails is mine. Quote it and link
            to it freely; please don&apos;t republish whole issues as your own.
            Exercise code lives in public GitHub repositories, and each
            repository states its own licence — that licence, not this page,
            governs the code.
          </p>

          <h2 style={h2}>Law</h2>
          <p style={p}>
            These terms are governed by Portuguese law. If you&apos;re a
            consumer living elsewhere in the EU, you keep the protections of the
            law where you live.
          </p>

          <h2 style={h2}>Changes</h2>
          <p style={p}>
            If these change in a way that affects you, I&apos;ll say so in the
            Learning Log rather than quietly editing this page.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
