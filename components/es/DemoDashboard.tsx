"use client";

import { useState } from "react";
import type { DemoData } from "@/lib/es/demo";

/* Validated on the dark surface (#242019): both pass lightness, chroma, CVD and contrast. */
const SERIES_A = "#d0633f";
const SERIES_B = "#1fa6ad";

const mono = "'DM Mono', monospace";
const fmt = (n: number, d = 0) => n.toLocaleString("es-ES", { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: "always" } as Intl.NumberFormatOptions);

const card: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  padding: 20,
};

const titleStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: "0.06em",
  color: "var(--muted)",
  marginBottom: 14,
};

export default function DemoDashboard({
  data,
  lineTitle,
  lineUnit,
  actualLabel,
  referenceLabel,
  barsTitle,
  barsUnit,
  barsDecimals,
}: {
  data: DemoData;
  lineTitle: string;
  lineUnit: string;
  actualLabel: string;
  referenceLabel: string;
  barsTitle: string;
  barsUnit: string;
  barsDecimals: number;
}) {
  const [showTable, setShowTable] = useState(false);
  const lineDecimals = Math.max(...data.actual) < 20 ? 2 : 0;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* KPI tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {data.kpis.map((k) => {
          const improving = k.goodWhenLow ? k.delta < 0 : k.delta > 0;
          return (
            <div key={k.label} style={card}>
              <div style={{ ...titleStyle, marginBottom: 10 }}>{k.label.toUpperCase()}</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 30,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                }}
              >
                {fmt(k.value, k.decimals)}
                {k.unit && <span style={{ fontSize: 15, color: "var(--muted)", marginLeft: 4 }}>{k.unit}</span>}
              </div>
              <div style={{ fontFamily: mono, fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                <span aria-hidden>{k.delta >= 0 ? "▲" : "▼"}</span> {fmt(Math.abs(k.delta), 1)}% vs. mes anterior
                <span style={{ marginLeft: 6, color: improving ? "var(--sand)" : "var(--muted)" }}>
                  ({improving ? "mejora" : "empeora"})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <div style={card}>
          <div style={titleStyle}>{lineTitle.toUpperCase()}</div>
          <LineChart
            weeks={data.weeks}
            a={data.actual}
            b={data.reference}
            aLabel={actualLabel}
            bLabel={referenceLabel}
            unit={lineUnit}
            decimals={lineDecimals}
          />
        </div>
        <div style={card}>
          <div style={titleStyle}>{barsTitle.toUpperCase()}</div>
          <BarChart bars={data.bars} unit={barsUnit} decimals={barsDecimals} />
        </div>
      </div>

      <div>
        <button
          onClick={() => setShowTable((s) => !s)}
          style={{
            background: "transparent",
            border: "1px solid var(--border2)",
            color: "var(--sand)",
            fontFamily: mono,
            fontSize: 11,
            padding: "6px 12px",
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          {showTable ? "ocultar tabla" : "ver los datos en tabla"}
        </button>
        {showTable && (
          <div style={{ ...card, marginTop: 10, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: mono, fontSize: 12 }}>
              <thead>
                <tr style={{ color: "var(--muted)", textAlign: "left" }}>
                  <th style={{ padding: 6 }}>Semana</th>
                  <th style={{ padding: 6 }}>{actualLabel} ({lineUnit})</th>
                  <th style={{ padding: 6 }}>{referenceLabel} ({lineUnit})</th>
                </tr>
              </thead>
              <tbody>
                {data.weeks.map((w, i) => (
                  <tr key={w} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: 6 }}>{w}</td>
                    <td style={{ padding: 6 }}>{fmt(data.actual[i], lineDecimals)}</td>
                    <td style={{ padding: 6 }}>{fmt(data.reference[i], lineDecimals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LineChart({
  weeks,
  a,
  b,
  aLabel,
  bLabel,
  unit,
  decimals,
}: {
  weeks: string[];
  a: number[];
  b: number[];
  aLabel: string;
  bLabel: string;
  unit: string;
  decimals: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 520;
  const H = 240;
  const pad = { l: 44, r: 12, t: 12, b: 26 };
  const all = [...a, ...b];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const lo = min - span * 0.1;
  const hi = max + span * 0.1;
  const x = (i: number) => pad.l + (i / (weeks.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const ticks = [0, 1, 2, 3].map((k) => lo + ((hi - lo) * k) / 3);

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (weeks.length - 1));
    setHover(Math.max(0, Math.min(weeks.length - 1, i)));
  }

  return (
    <div style={{ position: "relative" }}>
      <Legend
        items={[
          { label: aLabel, color: SERIES_A, dashed: false },
          { label: bLabel, color: SERIES_B, dashed: true },
        ]}
      />
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={`${aLabel} frente a ${bLabel}, 16 semanas`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--muted)" fontFamily="DM Mono, monospace">
              {fmt(t, decimals > 0 ? 1 : 0)}
            </text>
          </g>
        ))}
        {weeks.map((w, i) =>
          i % 3 === 0 ? (
            <text key={w} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--muted)" fontFamily="DM Mono, monospace">
              {w}
            </text>
          ) : null,
        )}
        <path d={path(b)} fill="none" stroke={SERIES_B} strokeWidth={2} strokeDasharray="5 4" />
        <path d={path(a)} fill="none" stroke={SERIES_A} strokeWidth={2} />
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="var(--border2)" strokeWidth={1} />
            <circle cx={x(hover)} cy={y(b[hover])} r={4} fill={SERIES_B} stroke="var(--surface)" strokeWidth={2} />
            <circle cx={x(hover)} cy={y(a[hover])} r={4} fill={SERIES_A} stroke="var(--surface)" strokeWidth={2} />
          </g>
        )}
        <rect
          x={pad.l}
          y={pad.t}
          width={W - pad.l - pad.r}
          height={H - pad.t - pad.b}
          fill="transparent"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        />
      </svg>
      {hover !== null && (
        <div
          style={{
            position: "absolute",
            top: 28,
            left: `${(x(hover) / W) * 100}%`,
            transform: x(hover) > W * 0.6 ? "translateX(-110%)" : "translateX(10%)",
            background: "var(--surface3)",
            border: "1px solid var(--border2)",
            borderRadius: 4,
            padding: "8px 10px",
            fontFamily: mono,
            fontSize: 11,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ color: "var(--muted)", marginBottom: 4 }}>{weeks[hover]}</div>
          {[
            { label: aLabel, v: a[hover], c: SERIES_A },
            { label: bLabel, v: b[hover], c: SERIES_B },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 2, background: r.c, display: "inline-block" }} />
              <strong style={{ color: "var(--text)" }}>
                {fmt(r.v, decimals)} {unit}
              </strong>
              <span style={{ color: "var(--muted)" }}>{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BarChart({ bars, unit, decimals }: { bars: { label: string; value: number }[]; unit: string; decimals: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...bars.map((b) => b.value)) || 1;
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {bars.map((b, i) => (
        <div
          key={b.label}
          tabIndex={0}
          onPointerEnter={() => setHover(i)}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(i)}
          onBlur={() => setHover(null)}
          style={{ display: "grid", gridTemplateColumns: "130px 1fr 70px", alignItems: "center", gap: 8, outline: "none", padding: "2px 0" }}
        >
          <span style={{ fontSize: 12, color: "var(--sand)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {b.label}
          </span>
          <span style={{ background: "var(--surface2)", borderRadius: 4, height: 14, display: "block" }}>
            <span
              style={{
                display: "block",
                height: "100%",
                width: `${Math.max(2, (b.value / max) * 100)}%`,
                background: SERIES_A,
                borderRadius: "0 4px 4px 0",
                opacity: hover === null || hover === i ? 1 : 0.55,
                transition: "opacity 120ms",
              }}
            />
          </span>
          <span style={{ fontFamily: mono, fontSize: 11, color: hover === i ? "var(--text)" : "var(--muted)", textAlign: "right" }}>
            {fmt(b.value, decimals)} {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string; dashed: boolean }[] }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 8, fontFamily: mono, fontSize: 11, color: "var(--muted)" }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="18" height="4" aria-hidden>
            <line x1="0" x2="18" y1="2" y2="2" stroke={it.color} strokeWidth="2" strokeDasharray={it.dashed ? "5 3" : undefined} />
          </svg>
          {it.label}
        </span>
      ))}
    </div>
  );
}
