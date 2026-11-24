import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { companies, getCompany, sectors, buildDemo, insightFor } from "@/lib/es/demo";
import DemoDashboard from "@/components/es/DemoDashboard";
import ShareBox from "@/components/es/ShareBox";
import { EsNav, EsFooter, Eyebrow } from "@/components/es/EsShell";

export const dynamicParams = false;

export function generateStaticParams() {
  return companies.map((c) => ({ empresa: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ empresa: string }> }): Promise<Metadata> {
  const { empresa } = await params;
  const company = getCompany(empresa);
  return {
    title: company ? `Demo para ${company.name} · André Barros` : "Demo · André Barros",
    // Company demos are sent one by one; keep them out of search results.
    robots: { index: false, follow: false },
  };
}

const mono = "'DM Mono', monospace";

export default async function DemoPage({ params }: { params: Promise<{ empresa: string }> }) {
  const { empresa } = await params;
  const company = getCompany(empresa);
  if (!company) notFound();

  const t = sectors[company.sector];
  const data = buildDemo(company);
  const generic = ["agro", "industria", "agrotech", "servicios"].includes(company.slug);

  return (
    <main lang="es">
      <EsNav />
      <section style={{ padding: "44px 0 0" }}>
        <div className="wrap">
          <Eyebrow>{generic ? `DEMO · ${t.label.toUpperCase()}` : `DEMO PREPARADA PARA ${company.name.toUpperCase()}`}</Eyebrow>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 12, maxWidth: 820 }}>
            {company.question}
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, maxWidth: 720, marginBottom: 14 }}>{company.context}</p>
          <p
            style={{
              fontFamily: mono,
              fontSize: 11,
              color: "var(--sand)",
              border: "1px solid var(--border2)",
              borderRadius: 3,
              padding: "6px 10px",
              display: "inline-block",
              marginBottom: 28,
            }}
          >
            DATOS SIMULADOS. Ningún dato es real ni de {generic ? "ninguna empresa" : company.name}. Es una muestra de cómo trabajaría.
          </p>

          <DemoDashboard
            data={data}
            lineTitle={t.line.title}
            lineUnit={t.line.unit}
            actualLabel={t.line.actual}
            referenceLabel={t.line.reference}
            barsTitle={company.bars?.title ?? t.bars.title}
            barsUnit={t.bars.unit}
            barsDecimals={t.bars.decimals}
          />

          <div style={{ marginTop: 28, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 16 }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>LO QUE DIRÍA ESTE PANEL</div>
              <p style={{ fontSize: 16, lineHeight: 1.7 }}>{insightFor(company, data)}</p>
            </div>
            <div>
              <div style={{ fontFamily: mono, fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>MIS PRIMEROS 30 DÍAS{generic ? "" : ` EN ${company.name.toUpperCase()}`}</div>
              <ol style={{ paddingLeft: 18, lineHeight: 1.7, color: "var(--text)" }}>
                {company.plan.map((p) => (
                  <li key={p} style={{ marginBottom: 4 }}>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            style={{
              marginTop: 36,
              padding: 24,
              border: "1px solid var(--accent)",
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, marginBottom: 4 }}>¿Lo hacemos con tus datos reales?</div>
              <div style={{ color: "var(--muted)" }}>20 minutos de café o videollamada. Llego a Almería en enero.</div>
            </div>
            <a
              href={`mailto:andre@barrosbuilds.com?subject=${encodeURIComponent(`Demo ${company.name}`)}`}
              style={{ background: "var(--accent)", color: "var(--bg)", padding: "10px 22px", borderRadius: 3, fontFamily: mono, fontSize: 12 }}
            >
              escríbeme
            </a>
          </div>

          <p style={{ marginTop: 20, color: "var(--muted)" }}>
            Quién soy y qué he hecho: <Link href="/es" style={{ color: "var(--sand)" }}>barrosbuilds.com/es</Link>
          </p>

          <div style={{ marginTop: 28 }}>
            <ShareBox url={`https://barrosbuilds.com/es/demo/${company.slug}`} company={generic ? undefined : company.name} />
          </div>
        </div>
      </section>
      <EsFooter />
    </main>
  );
}
