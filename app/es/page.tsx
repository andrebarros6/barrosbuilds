import Link from "next/link";
import type { Metadata } from "next";
import { EsNav, EsFooter, Eyebrow } from "@/components/es/EsShell";
import ShareBox from "@/components/es/ShareBox";

export const metadata: Metadata = {
  title: "André Barros · Ingeniero industrial y analista de datos en Almería",
  description:
    "8 años en planta en TE Connectivity, ahora analista de datos en Almería. Paneles, modelos de datos y mejora continua medida.",
  alternates: { languages: { en: "https://barrosbuilds.com", es: "https://barrosbuilds.com/es" } },
};

const mono = "'DM Mono', monospace";
const syne = "'Syne', sans-serif";

const results = [
  { num: "-90%", label: "scrap en 7 líneas de producto, con paneles Power BI para los responsables" },
  { num: "-70%", label: "tiempo de cambio de formato, analizando los cuellos de botella" },
  { num: "+40%", label: "producción, con KPIs definidos igual en toda la planta" },
  { num: "6", label: "productos de datos e IA lanzados en 2026, con más de 120 usuarios" },
];

const offer = [
  {
    title: "Paneles que el equipo usa",
    body: "Power BI, SQL y Python para convertir exportaciones del ERP y hojas sueltas en KPIs que se miran cada mañana.",
  },
  {
    title: "Datos en orden",
    body: "Modelos de datos, definiciones únicas de cada métrica y controles de calidad. En mi último proyecto, 17 tablas a partir de registros desordenados.",
  },
  {
    title: "Mejora continua medida",
    body: "Lean, Six Sigma y control estadístico de procesos. Cada mejora con su antes y su después en números.",
  },
];

const demos = [
  { href: "/es/demo/agro", label: "Cooperativas y comercializadoras", note: "destrío, previsión de entradas, precio" },
  { href: "/es/demo/industria", label: "Plantas de producción", note: "OEE, scrap, Pareto de defectos" },
  { href: "/es/demo/agrotech", label: "Software e IoT agrícola", note: "activación, uso, bajas" },
  { href: "/es/demo/servicios", label: "Talleres, logística y servicios", note: "plazos, horas, carga de trabajo" },
];

const builds = [
  { name: "Painel dos Recibos", body: "SaaS de BI que convierte la exportación de Hacienda portuguesa en paneles de ingresos por cliente y año.", url: "https://paineldosrecibos.barrosbuilds.com/" },
  { name: "Crafted", body: "Plataforma de IA que adapta CVs a cada oferta y puntúa el encaje en 5 dimensiones. 103 usuarios.", url: "https://crafted.barrosbuilds.com" },
  { name: "Bitcoin PT", body: "Compara la rentabilidad anual de Bitcoin con la inflación portuguesa para medir poder de compra.", url: "https://bitcoinpt.barrosbuilds.com/" },
  { name: "OUT", body: "Newsletter semanal de eventos locales, con su propio pipeline de datos.", url: "https://out.barrosbuilds.com/" },
];

export default function EsHome() {
  return (
    <main lang="es">
      <EsNav />

      <section style={{ padding: "60px 0 48px", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>ALMERÍA · DATOS · OPERACIONES</Eyebrow>
          <h1 style={{ fontFamily: syne, fontWeight: 800, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 20 }}>
            Ingeniero industrial <span style={{ color: "var(--accent)" }}>que habla datos.</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.7, maxWidth: 680, marginBottom: 28 }}>
            Soy André Barros. Pasé 8 años en planta en TE Connectivity, donde llevé Power BI a las líneas de producción. Ahora
            trabajo como analista de datos y me instalo en Almería en enero. Busco un equipo donde aportar desde el primer mes.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="mailto:andre@barrosbuilds.com"
              style={{ background: "var(--accent)", color: "var(--bg)", padding: "10px 22px", borderRadius: 3, fontFamily: mono, fontSize: 12, boxShadow: "var(--shadow-glow)" }}
            >
              escríbeme
            </a>
            <a href="#demos" style={{ color: "var(--sand)", padding: "10px 22px", borderRadius: 3, border: "1px solid var(--border2)", fontFamily: mono, fontSize: 12 }}>
              ver una demo
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: "44px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>RESULTADOS</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {results.map((r) => (
              <div key={r.label}>
                <div style={{ fontFamily: syne, fontWeight: 800, fontSize: 36, color: "var(--accent2)", letterSpacing: "-0.03em" }}>{r.num}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "44px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>QUÉ PUEDO HACER POR TU EMPRESA</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {offer.map((o) => (
              <div key={o.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 20 }}>
                <h3 style={{ fontFamily: syne, fontSize: 18, marginBottom: 8 }}>{o.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: 14 }}>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "44px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>CÓMO EMPEZAR SIN RIESGO</Eyebrow>
          <p style={{ fontSize: 16, lineHeight: 1.75, maxWidth: 720, marginBottom: 12 }}>
            Un proyecto piloto de 4 a 6 semanas, con un objetivo y un entregable concretos. Si funciona, hablamos de algo
            estable. Si no, el trabajo se queda en tu empresa.
          </p>
          <p style={{ color: "var(--sand)", fontSize: 16, lineHeight: 1.75, maxWidth: 720 }}>
            También estoy abierto a un puesto de entrada. Prefiero demostrar lo que valgo dentro de tu equipo que en una entrevista.
          </p>
        </div>
      </section>

      <section id="demos" style={{ padding: "44px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>DEMOS POR SECTOR</Eyebrow>
          <p style={{ color: "var(--muted)", marginBottom: 18, lineHeight: 1.7 }}>
            Paneles de ejemplo con datos simulados, construidos como los haría para tu empresa.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {demos.map((d) => (
              <Link key={d.href} href={d.href} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 18, display: "block" }}>
                <div style={{ fontFamily: syne, fontSize: 16, marginBottom: 6 }}>{d.label} →</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: "var(--muted)" }}>{d.note}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "44px 0", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <Eyebrow>LO QUE HE CONSTRUIDO EN 2026</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {builds.map((b) => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                <div style={{ fontFamily: syne, fontSize: 16, color: "var(--accent)", marginBottom: 6 }}>{b.name} ↗</div>
                <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{b.body}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" style={{ padding: "44px 0" }}>
        <div className="wrap" style={{ display: "grid", gap: 24 }}>
          <div>
            <Eyebrow>CONTACTO</Eyebrow>
            <p style={{ fontSize: 16, lineHeight: 1.75 }}>
              <a href="mailto:andre@barrosbuilds.com" style={{ color: "var(--accent)" }}>andre@barrosbuilds.com</a>
              {" · "}
              <a href="https://www.linkedin.com/in/andrebarros-data/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--sand)" }}>
                LinkedIn
              </a>
            </p>
            <p style={{ color: "var(--muted)", marginTop: 6 }}>Español, portugués e inglés. Disponible desde enero de 2027.</p>
          </div>
          <ShareBox url="https://barrosbuilds.com/es" />
        </div>
      </section>

      <EsFooter />
    </main>
  );
}
