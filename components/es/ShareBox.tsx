"use client";

import { useState } from "react";

const mono = "'DM Mono', monospace";

/* Referral ask: every visitor who is not the right person can pass it on in one tap. */
export default function ShareBox({ url, company }: { url: string; company?: string }) {
  const [copied, setCopied] = useState(false);
  const text = company
    ? `Mira esto: André, ingeniero industrial y analista de datos, ha preparado una demo para ${company}. ${url}`
    : `Mira esto: André, ingeniero industrial y analista de datos, acaba de llegar a Almería. ${url}`;

  const btn: React.CSSProperties = {
    background: "transparent",
    border: "1px solid var(--border2)",
    color: "var(--sand)",
    fontFamily: mono,
    fontSize: 12,
    padding: "9px 16px",
    borderRadius: 3,
    cursor: "pointer",
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the link stays visible below */
    }
  }

  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: 24,
      }}
    >
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, marginBottom: 8 }}>¿No eres la persona indicada?</h2>
      <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: 16, maxWidth: 640 }}>
        Reenvíaselo a quien lleve producción, operaciones o datos. Y si me presentas a alguien en Almería con quien acabo
        trabajando, la comida corre de mi cuenta.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a style={btn} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
          enviar por WhatsApp
        </a>
        <a
          style={btn}
          href={`mailto:?subject=${encodeURIComponent("Un perfil de datos que te puede interesar")}&body=${encodeURIComponent(text)}`}
        >
          enviar por email
        </a>
        <button style={btn} onClick={copy}>
          {copied ? "enlace copiado" : "copiar enlace"}
        </button>
      </div>
    </section>
  );
}
