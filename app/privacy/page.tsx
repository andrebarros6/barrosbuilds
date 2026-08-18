import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy — Barros Builds",
  description:
    "What data Barros Builds collects, why, where it's stored, and how to get it deleted.",
};

const LAST_UPDATED = "18 August 2026";

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

export default function PrivacyPage() {
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
            Privacy
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
            Short version: I collect your email address so I can send you the
            Learning Log. Nothing else. I don&apos;t sell it, share it for
            marketing, or use it for ads. You can leave at any time and I delete
            it.
          </p>

          <h2 style={h2}>Who&apos;s responsible</h2>
          <p style={p}>
            André Barros, Portugal — reachable at{" "}
            <a href="mailto:andre@barrosbuilds.com" style={{ color: "var(--sand)" }}>
              andre@barrosbuilds.com
            </a>
            . Under GDPR that makes me the data controller for anything described
            here.
          </p>

          <h2 style={h2}>What I collect</h2>
          <p style={p}>
            Your email address, and which page you signed up from. That&apos;s
            it — no name, no company, no profiling.
          </p>
          <p style={p}>
            The site uses Vercel Analytics to count page views. It doesn&apos;t
            use cookies and doesn&apos;t follow you across other sites — it
            tells me which pages get read, not who read them. Vercel also keeps
            short-lived server logs as part of serving any website. I
            don&apos;t store IP addresses myself.
          </p>

          <h2 style={h2}>Why</h2>
          <p style={p}>
            To send you the Learning Log — one email a week with a concept, an
            exercise, and what broke. The legal basis is your consent, given when
            you submitted the form.
          </p>

          <h2 style={h2}>Where it&apos;s stored</h2>
          <p style={p}>
            In a Supabase database hosted in the EU (Frankfurt). Emails are
            delivered through Resend. Both are processors acting on my
            instructions — they don&apos;t get to use your address for anything
            of their own.
          </p>

          <h2 style={h2}>How long</h2>
          <p style={p}>
            Until you unsubscribe. Every email has a one-click unsubscribe link
            in the footer, and you can also just email me. After that your
            address is removed.
          </p>

          <h2 style={h2}>Your rights</h2>
          <p style={p}>
            You can ask me for a copy of what I hold on you, ask me to correct
            it, or ask me to delete it — all of it, permanently. Email{" "}
            <a href="mailto:andre@barrosbuilds.com" style={{ color: "var(--sand)" }}>
              andre@barrosbuilds.com
            </a>{" "}
            and I&apos;ll action it. No form, no hoops.
          </p>
          <p style={p}>
            If you think I&apos;ve handled your data badly, you can complain to
            the Portuguese data protection authority,{" "}
            <a
              href="https://www.cnpd.pt"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--sand)" }}
            >
              CNPD
            </a>
            .
          </p>

          <h2 style={h2}>Changes</h2>
          <p style={p}>
            If this changes in a way that affects you, I&apos;ll say so in the
            Learning Log rather than quietly editing this page.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
