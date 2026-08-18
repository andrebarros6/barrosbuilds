"use client";

import { useState } from "react";
import { firstIssueMonth } from "@/lib/newsletter";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Shared email capture. Used by the compact homepage section and the
 * full /log page — both POST to the same endpoint, so the
 * validation and duplicate handling live in one place.
 */
export default function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState(false);

  const inputId = `waitlist-email-${source}`;
  const errorId = `waitlist-error-${source}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, source }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something broke. Try again.");
        return;
      }

      setStatus("done");
      setMessage(
        data.alreadySubscribed ? "You're already on the list." : "You're on the list."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          color: "var(--accent)",
          minHeight: 46,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 6px rgba(196,89,58,0.6)",
            flexShrink: 0,
          }}
        />
        {message} First issue ships {firstIssueMonth()}.
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        noValidate
        style={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: 520 }}
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={status === "submitting"}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? errorId : undefined}
          style={{
            flex: "1 1 240px",
            minWidth: 0,
            background: "var(--surface)",
            border: `1px solid ${focused ? "var(--accent)" : "var(--border2)"}`,
            color: "var(--text)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            padding: "13px 16px",
            borderRadius: 3,
            outline: "none",
            transition: "border-color 0.15s",
          }}
        />

        {/* Honeypot — hidden from users, catches naive bots. */}
        <input
          type="text"
          name="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            border: 0,
            opacity: 0,
            pointerEvents: "none",
            left: -9999,
          }}
        />

        <button
          type="submit"
          disabled={status === "submitting"}
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 500,
            padding: "13px 24px",
            border: "none",
            borderRadius: 3,
            letterSpacing: "0.04em",
            cursor: status === "submitting" ? "default" : "pointer",
            opacity: status === "submitting" ? 0.6 : 1,
            boxShadow: "var(--shadow-glow)",
            whiteSpace: "nowrap",
          }}
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist →"}
        </button>
      </form>

      {status === "error" && (
        <div
          id={errorId}
          role="alert"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: "var(--accent2)",
            marginTop: 10,
          }}
        >
          {message}
        </div>
      )}
    </>
  );
}
