/*
 * Tailored demo dashboards for the Almería outreach.
 * Each company gets a URL like /es/demo/unica with simulated data shaped to its
 * sector. Numbers are seeded by slug so the page looks the same on every visit.
 * Add a company: append an entry to `companies` (slug must be URL-safe).
 */

export type Sector = "agro" | "industria" | "agrotech" | "servicios";

export interface Company {
  slug: string;
  name: string;
  sector: Sector;
  /** The question the demo answers, written for this company. */
  question: string;
  /** One line of context shown under the question. */
  context: string;
  /** What André would do in the first 30 days. 3 items. */
  plan: [string, string, string];
  /** Optional: replace the sector's bar chart title and categories. */
  bars?: { title: string; items: string[] };
}

export interface SectorTemplate {
  label: string;
  kpis: { label: string; unit: string; base: number; spread: number; decimals: number; goodWhenLow?: boolean }[];
  line: { title: string; unit: string; actual: string; reference: string; base: number; trend: number; noise: number };
  bars: { title: string; unit: string; items: string[]; base: number; spread: number; decimals: number };
  insight: (top: string, share: number) => string;
}

export const sectors: Record<Sector, SectorTemplate> = {
  agro: {
    label: "Comercialización hortofrutícola",
    kpis: [
      { label: "Kilos recibidos (semana)", unit: "t", base: 1850, spread: 400, decimals: 0 },
      { label: "Precio medio liquidado", unit: "€/kg", base: 0.92, spread: 0.25, decimals: 2 },
      { label: "Destrío medio", unit: "%", base: 6.8, spread: 2.5, decimals: 1, goodWhenLow: true },
      { label: "Error de previsión de entradas", unit: "%", base: 14, spread: 5, decimals: 0, goodWhenLow: true },
    ],
    line: {
      title: "Entradas semanales: real frente a previsión",
      unit: "t",
      actual: "Real",
      reference: "Previsión",
      base: 1500,
      trend: 45,
      noise: 220,
    },
    bars: {
      title: "Destrío acumulado por socio (los 8 con más peso)",
      unit: "t",
      items: ["Socio 014", "Socio 102", "Socio 037", "Socio 221", "Socio 008", "Socio 156", "Socio 090", "Socio 063"],
      base: 3,
      spread: 40,
      decimals: 1,
    },
    insight: (top, share) =>
      `${top} y otros dos socios explican el ${share}% del destrío de estos 8. Ahí está la primera conversación técnica, no en la media.`,
  },
  industria: {
    label: "Producción industrial",
    kpis: [
      { label: "OEE", unit: "%", base: 68, spread: 8, decimals: 0 },
      { label: "Scrap", unit: "%", base: 3.4, spread: 1.4, decimals: 1, goodWhenLow: true },
      { label: "Cambio de formato medio", unit: "min", base: 46, spread: 15, decimals: 0, goodWhenLow: true },
      { label: "Unidades por turno", unit: "", base: 1240, spread: 260, decimals: 0 },
    ],
    line: {
      title: "Scrap semanal frente a objetivo",
      unit: "%",
      actual: "Scrap real",
      reference: "Objetivo",
      base: 4.2,
      trend: -0.08,
      noise: 0.55,
    },
    bars: {
      title: "Causas de defecto (Pareto, unidades rechazadas)",
      unit: "uds",
      items: ["Ajuste de máquina", "Materia prima", "Cambio de formato", "Temperatura", "Manipulación", "Calibración", "Limpieza", "Otros"],
      base: 40,
      spread: 420,
      decimals: 0,
    },
    insight: (top, share) =>
      `Tres causas, empezando por "${top}", concentran el ${share}% del rechazo. En TE Connectivity, este tipo de análisis ayudó a bajar el scrap un 90%.`,
  },
  agrotech: {
    label: "Producto digital para el campo",
    kpis: [
      { label: "Fincas activas", unit: "", base: 2400, spread: 600, decimals: 0 },
      { label: "Sensores en línea", unit: "%", base: 93, spread: 4, decimals: 1 },
      { label: "Activación a 30 días", unit: "%", base: 58, spread: 12, decimals: 0 },
      { label: "Bajas mensuales", unit: "%", base: 2.6, spread: 1.2, decimals: 1, goodWhenLow: true },
    ],
    line: {
      title: "Fincas activas: real frente a objetivo",
      unit: "fincas",
      actual: "Activas",
      reference: "Objetivo",
      base: 1900,
      trend: 38,
      noise: 70,
    },
    bars: {
      title: "Embudo de activación (de alta a uso semanal)",
      unit: "%",
      items: ["Alta", "Sensor instalado", "Primera alerta", "Primera decisión", "Uso semanal"],
      base: 0,
      spread: 0,
      decimals: 0,
    },
    insight: (top, share) =>
      `La mayor caída está antes de "${top}": solo el ${share}% llega. Medirlo por técnico y comarca dice dónde reforzar el acompañamiento.`,
  },
  servicios: {
    label: "Operaciones y servicio",
    kpis: [
      { label: "Órdenes de trabajo (semana)", unit: "", base: 310, spread: 80, decimals: 0 },
      { label: "Entregadas a tiempo", unit: "%", base: 86, spread: 7, decimals: 0 },
      { label: "Tiempo medio de resolución", unit: "h", base: 7.5, spread: 2.5, decimals: 1, goodWhenLow: true },
      { label: "Horas facturables", unit: "%", base: 71, spread: 8, decimals: 0 },
    ],
    line: {
      title: "Órdenes semanales: real frente a previsión",
      unit: "órdenes",
      actual: "Real",
      reference: "Previsión",
      base: 280,
      trend: 3,
      noise: 35,
    },
    bars: {
      title: "Horas consumidas por tipo de trabajo (mes)",
      unit: "h",
      items: ["Diagnóstico eléctrico", "Frenos", "Frío industrial", "Revisión periódica", "Garantía", "Neumáticos", "Carrocería", "Otros"],
      base: 20,
      spread: 300,
      decimals: 0,
    },
    insight: (top, share) =>
      `"${top}" y las dos siguientes suman el ${share}% de las horas. Estandarizarlas libera capacidad sin contratar.`,
  },
};

const plan = {
  agro: [
    "Unificar entradas, destrío y liquidaciones en un solo modelo de datos.",
    "Panel semanal de destrío y precio por socio y producto para el equipo técnico.",
    "Previsión de entradas a 4 semanas y medición de su error, campaña a campaña.",
  ],
  industria: [
    "Definir OEE, scrap y tiempos de cambio igual en todas las líneas.",
    "Pareto de defectos por línea y turno, actualizado cada día.",
    "Un piloto de mejora en la línea con más rechazo, con antes y después medido.",
  ],
  agrotech: [
    "Plan de tracking de eventos del producto (como hice con 13 eventos en un configurador).",
    "Embudo de activación por técnico, cultivo y comarca.",
    "Alertas de bajas: qué fincas dejan de usar la plataforma antes de irse.",
  ],
  servicios: [
    "Limpiar y cruzar órdenes, horas y facturación en un solo modelo.",
    "Panel de cumplimiento de plazos y tiempos por tipo de trabajo.",
    "Previsión semanal de carga para planificar personal.",
  ],
} as const satisfies Record<Sector, readonly [string, string, string]>;

function c(
  slug: string,
  name: string,
  sector: Sector,
  question: string,
  context: string,
  bars?: Company["bars"],
): Company {
  return { slug, name, sector, question, context, plan: [...plan[sector]] as [string, string, string], bars };
}

export const companies: Company[] = [
  // Generic sector demos, for when there is no tailored version yet.
  c("agro", "tu empresa", "agro", "¿Dónde se pierde margen entre la finca y la liquidación?", "Ejemplo para comercializadoras y cooperativas hortofrutícolas."),
  c("industria", "tu planta", "industria", "¿Qué tres causas explican la mayor parte del rechazo?", "Ejemplo para plantas de producción."),
  c("agrotech", "tu producto", "agrotech", "¿En qué paso del embudo se pierden los agricultores?", "Ejemplo para empresas de software e IoT agrícola."),
  c("servicios", "tu equipo", "servicios", "¿Qué trabajos se comen la capacidad del equipo?", "Ejemplo para talleres, logística y servicios."),

  // Agro
  c("unica", "Unica Group", "agro", "¿Qué socios y productos concentran el destrío y cuánto cuesta en liquidación?", "Con 16 cooperativas comercializando juntas, comparar socios con la misma vara es la base de todo lo demás."),
  c("casi", "CASI", "agro", "¿Cuánto se desvía la entrada real de tomate de la previsión, semana a semana?", "Para una cooperativa de tomate, saber cuánto entra la semana que viene es dinero en la negociación."),
  c("vicasol", "Vicasol", "agro", "¿Qué socios y productos concentran el destrío esta campaña?", "Ejemplo con datos simulados, construido con la estructura típica de una cooperativa hortofrutícola."),
  c("agroponiente", "Agroponiente", "agro", "¿Dónde se pierde margen entre la finca y la liquidación?", "Ejemplo con datos simulados, construido con la estructura típica de una comercializadora."),
  c("murgiverde", "Murgiverde", "agro", "¿Qué socios y productos concentran el destrío esta campaña?", "Ejemplo con datos simulados para una cooperativa de segundo grado."),
  c("la-union", "La Unión", "agro", "¿Cómo se comporta el precio de subasta frente a las entradas previstas?", "Ejemplo con datos simulados para una alhóndiga."),
  c("primaflor", "Primaflor", "agro", "¿Qué fincas y productos concentran la merma esta campaña?", "Ejemplo con datos simulados para producción y transformación de hoja."),
  c("coexphal", "Coexphal", "agro", "¿Qué tan buena es la previsión de entradas del sector, semana a semana?", "Ejemplo con datos simulados: medir el error de previsión es el primer paso para mejorarla."),

  // Industria
  c("cosentino", "Cosentino", "industria", "¿Qué tres causas explican la mayor parte del rechazo por línea y turno?", "En TE Connectivity hice este análisis en planta: scrap -90% y cambios de formato -70%."),
  c("deretil", "Deretil", "industria", "¿Qué tres causas explican la mayor parte de los lotes fuera de especificación?", "Ejemplo con datos simulados para una planta química y de nutrición vegetal.", {
    title: "Causas de lote fuera de especificación (Pareto, lotes)",
    items: ["Pureza", "Humedad", "Tiempo de reacción", "Materia prima", "Temperatura", "Filtración", "Envasado", "Otros"],
  }),
  c("kimitec", "Kimitec", "industria", "¿Qué tres causas explican la mayor parte del rechazo en producción?", "Ejemplo con datos simulados para una planta de bioinsumos que crece rápido."),
  c("biorizon", "Biorizon Biotech", "industria", "¿Qué tres causas explican la mayor parte de los lotes rechazados?", "Ejemplo con datos simulados para una planta de bioestimulantes en plena ampliación."),
  c("michelin-cema", "Michelin CEMA", "industria", "¿Qué ensayos y condiciones concentran las repeticiones de prueba?", "Ejemplo con datos simulados con la lógica de un centro de ensayos.", {
    title: "Repeticiones de ensayo por causa (Pareto)",
    items: ["Condición de pista", "Montaje", "Instrumentación", "Meteorología", "Vehículo", "Protocolo", "Piloto", "Otros"],
  }),

  // Agrotech
  c("ikos", "IKOS Advanced", "agrotech", "¿En qué paso se quedan los agricultores entre la instalación y el uso semanal?", "Con un modelo de renting, cada finca que se activa tarde es ingreso recurrente en riesgo."),
  c("hispatec", "Hispatec", "agrotech", "¿En qué paso se quedan los usuarios entre el alta y el uso semanal?", "Ejemplo con datos simulados para un ERP agrícola con clientes en varios países."),
  c("groditech", "GrodiTech", "agrotech", "¿Qué invernaderos sacan más valor de la solución y por qué?", "Ejemplo con datos simulados para robótica y visión artificial en invernadero."),
  c("tecnova", "Fundación Tecnova", "agrotech", "¿Qué proyectos y empresas socias generan más uso de los servicios del centro?", "Ejemplo con datos simulados para un centro tecnológico."),

  // Servicios
  c("cajamar", "Cajamar", "servicios", "¿Qué tipos de solicitud consumen más capacidad del equipo?", "Ejemplo con datos simulados para operaciones de servicio.", {
    title: "Horas consumidas por tipo de solicitud (mes)",
    items: ["Incidencias de acceso", "Altas de cliente", "Reclamaciones", "Cambios de datos", "Consultas de producto", "Tarjetas", "Transferencias", "Otros"],
  }),
  c("r1-gama", "R1 Gama", "servicios", "¿Qué intervenciones de taller se comen las horas y retrasan las entregas?", "Pensado para la digitalización de postventa: órdenes, horas y plazos en un solo panel."),
  c("jcarrion", "Transportes J. Carrión", "servicios", "¿Qué rutas y clientes concentran los retrasos?", "Ejemplo con datos simulados para transporte refrigerado.", {
    title: "Horas de retraso acumuladas por ruta (mes)",
    items: ["Almería a Rotterdam", "Almería a Rungis", "Almería a Perpiñán", "Almería a Milán", "Almería a Múnich", "Almería a Londres", "Almería a Madrid", "Otras"],
  }),
];

export function getCompany(slug: string): Company | undefined {
  return companies.find((x) => x.slug === slug);
}

/* Small deterministic RNG so each company's numbers stay stable. */
function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d;

export interface DemoData {
  kpis: { label: string; unit: string; value: number; delta: number; decimals: number; goodWhenLow?: boolean }[];
  weeks: string[];
  actual: number[];
  reference: number[];
  bars: Bar[];
  topShare: number;
}

export interface Bar {
  label: string;
  value: number;
  /** Agrotech funnel: the step after the biggest drop. */
  worst?: boolean;
}

export function buildDemo(company: Company): DemoData {
  const t = sectors[company.sector];
  const r = rng(seedFrom(company.slug));

  const kpis = t.kpis.map((k) => ({
    label: k.label,
    unit: k.unit,
    decimals: k.decimals,
    goodWhenLow: k.goodWhenLow,
    value: round(k.base + (r() - 0.5) * k.spread, k.decimals),
    delta: round((r() - 0.45) * 12, 1),
  }));

  const n = 16;
  const weeks = Array.from({ length: n }, (_, i) => `S${i + 1}`);
  const reference: number[] = [];
  const actual: number[] = [];
  for (let i = 0; i < n; i++) {
    const season = Math.sin((i / n) * Math.PI) * t.line.noise * 0.8;
    const ref = t.line.base + t.line.trend * i + season;
    reference.push(round(ref, t.line.base < 10 ? 2 : 0));
    actual.push(round(ref + (r() - 0.5) * 2 * t.line.noise, t.line.base < 10 ? 2 : 0));
  }

  let bars: Bar[];
  if (company.sector === "agrotech") {
    let v = 100;
    bars = t.bars.items.map((label, i) => {
      if (i > 0) v = v * (0.55 + r() * 0.35);
      return { label, value: Math.round(v) };
    });
  } else {
    bars = (company.bars?.items ?? t.bars.items)
      .map((label) => ({ label, value: round(t.bars.base + r() ** 2 * t.bars.spread, t.bars.decimals) }))
      .sort((a, b) => b.value - a.value);
  }

  let topShare: number;
  if (company.sector === "agrotech") {
    // Biggest relative drop: report the share that reaches the step after it.
    let worst = 1;
    for (let i = 1; i < bars.length; i++) {
      if (bars[i].value / bars[i - 1].value < bars[worst].value / bars[worst - 1].value) worst = i;
    }
    topShare = bars[worst].value;
    bars[worst] = { ...bars[worst], worst: true };
  } else {
    const total = bars.reduce((s, b) => s + b.value, 0);
    topShare = Math.round(((bars[0].value + bars[1].value + bars[2].value) / total) * 100);
  }

  return { kpis, weeks, actual, reference, bars, topShare };
}

export function insightFor(company: Company, data: DemoData): string {
  const t = sectors[company.sector];
  const top =
    company.sector === "agrotech"
      ? data.bars.find((b) => b.worst)?.label ?? data.bars[1].label
      : data.bars[0].label;
  return t.insight(top, data.topShare);
}
