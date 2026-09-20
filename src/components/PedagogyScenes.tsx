import type { ReactNode } from "react";
import type { SubjectSlug, UniverseSlug } from "../data/types";

/** Parse "a/b" fraction strings. */
export function parseFrac(raw?: string): { n: number; d: number } | null {
  if (!raw) return null;
  const m = raw.trim().replace(",", "/").match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!m) return null;
  const n = Number(m[1]);
  const d = Number(m[2]);
  if (!d || d > 24) return null;
  return { n, d };
}

function Board({
  label,
  children,
  tone = "math",
}: {
  label: string;
  children: ReactNode;
  tone?: "math" | "lang" | "world" | "civic";
}) {
  return (
    <div className={`scene-panel scene-pedagogy tone-${tone}`} role="img" aria-label={label}>
      {children}
    </div>
  );
}

/** Barre fractionnaire adaptée à expected (ex. 3/4, 7/4). */
export function FractionBarScene({ expected, ok, label }: { expected?: string; ok: boolean; label?: string }) {
  const frac = parseFrac(expected) ?? { n: 1, d: 2 };
  const wholes = Math.floor(frac.n / frac.d);
  const rem = frac.n % frac.d;
  const bars = Math.max(1, wholes + (rem > 0 ? 1 : 0));
  let remaining = frac.n;
  return (
    <Board label={label ?? `Fraction ${frac.n}/${frac.d}`} tone="math">
      <div className="pedagogy-stack">
        <strong className="pedagogy-title">
          {frac.n}/{frac.d}
          {frac.n > frac.d ? "  ·  plus que 1" : ""}
        </strong>
        <div className="fraction-bars">
          {Array.from({ length: bars }, (_, bi) => {
            const fill = Math.min(frac.d, remaining);
            remaining -= fill;
            return (
              <div key={bi} className="fraction-slices pedagogy-bar">
                {Array.from({ length: frac.d }, (_, i) => (
                  <b key={i} className={ok && i < fill ? "is-filled" : i < fill ? "is-hint" : ""} />
                ))}
              </div>
            );
          })}
        </div>
        <p className="pedagogy-note">
          {ok ? "Fraction repérée" : `${frac.d} parts égales · ${frac.n} parts concernées`}
        </p>
      </div>
    </Board>
  );
}

/** Droite graduée pour encadrement / fractions > 1. */
export function NumberLineScene({
  expected,
  ok,
  label,
}: {
  expected?: string;
  ok: boolean;
  label?: string;
}) {
  const frac = parseFrac(expected);
  let marker = 1.5;
  let caption = "Droite graduée";
  const between = expected?.match(/entre\s+(\d+)\s+et\s+(\d+)/i);
  if (between) {
    marker = (Number(between[1]) + Number(between[2])) / 2;
    caption = `Entre ${between[1]} et ${between[2]}`;
  } else if (frac) {
    marker = frac.n / frac.d;
    caption = `${frac.n}/${frac.d}`;
  } else if (expected && /^\d+$/.test(expected.replace(/\s/g, ""))) {
    marker = Number(expected.replace(/\s/g, ""));
    caption = expected;
  }
  const max = Math.max(4, Math.ceil(marker + 1));
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);
  const x = 40 + (marker / max) * 280;

  return (
    <Board label={label ?? "Droite graduée"} tone="math">
      <svg viewBox="0 0 360 160" className="scene-svg pedagogy-svg" role="img" aria-label={caption}>
        <line x1="30" y1="90" x2="340" y2="90" stroke="currentColor" strokeWidth="4" />
        {ticks.map((t) => {
          const tx = 40 + (t / max) * 280;
          return (
            <g key={t}>
              <line x1={tx} y1="78" x2={tx} y2="102" stroke="currentColor" strokeWidth="3" />
              <text x={tx} y="128" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">
                {t}
              </text>
            </g>
          );
        })}
        <g className={ok ? "is-hot" : undefined}>
          <polygon points={`${x},70 ${x - 10},52 ${x + 10},52`} fill={ok ? "#e8a317" : "#2f6fed"} />
          <circle cx={x} cy={90} r="8" fill={ok ? "#e8a317" : "#2f6fed"} stroke="#fff" strokeWidth="2" />
        </g>
      </svg>
      <p className="pedagogy-note">{ok ? `Position : ${caption}` : caption}</p>
    </Board>
  );
}

/** Tableau de numération (entiers ou décimaux). */
export function PlaceValueScene({
  expected,
  ok,
  decimal,
}: {
  expected?: string;
  ok: boolean;
  decimal?: boolean;
}) {
  const raw = (expected ?? "0").replace(/\s/g, "").replace(",", ".");
  const isDec = decimal || raw.includes(".") || (expected?.includes(",") ?? false);
  if (isDec) {
    const [whole = "0", frac = ""] = raw.split(".");
    const digits = [whole.slice(-1) || "0", frac[0] || "0", frac[1] || "0", frac[2] || "0"];
    const headers = ["U", "d", "c", "m"];
    const names = ["unités", "dixièmes", "centièmes", "millièmes"];
    return (
      <Board label="Tableau des décimaux" tone="math">
        <strong className="pedagogy-title">{expected ?? raw}</strong>
        <div className="place-grid">
          {headers.map((h, i) => (
            <div key={h} className={`place-cell ${ok ? "is-hot" : ""}`}>
              <span>{h}</span>
              <strong>{digits[i]}</strong>
              <small>{names[i]}</small>
            </div>
          ))}
        </div>
        <p className="pedagogy-note">Virgule entre unités et dixièmes</p>
      </Board>
    );
  }
  const n = raw.replace(/\D/g, "") || "0";
  const padded = n.padStart(9, "0").slice(-9);
  const classes = [
    ["C", "D", "U"],
    ["C", "D", "U"],
    ["C", "D", "U"],
  ];
  const labels = ["millions", "milliers", "unités"];
  return (
    <Board label="Tableau de numération" tone="math">
      <strong className="pedagogy-title">{expected ?? n}</strong>
      <div className="place-classes">
        {labels.map((lab, ci) => (
          <div key={lab} className="place-class">
            <small>{lab}</small>
            <div className="place-row">
              {classes[ci]!.map((h, di) => (
                <div key={`${lab}-${h}`} className={`place-cell ${ok ? "is-hot" : ""}`}>
                  <span>{h}</span>
                  <strong>{padded[ci * 3 + di]}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Board>
  );
}

/** Figures géométriques. */
export function GeometryScene({ expected, ok }: { expected?: string; ok: boolean }) {
  const e = (expected ?? "").toLowerCase();
  let shape: ReactNode = (
    <rect x="70" y="50" width="120" height="120" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />
  );
  if (e.includes("triangle")) {
    shape = <polygon points="130,40 50,170 210,170" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />;
  } else if (e.includes("cercle") || e.includes("circle")) {
    shape = <circle cx="130" cy="110" r="70" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />;
  } else if (e.includes("rectangle")) {
    shape = <rect x="50" y="60" width="160" height="100" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />;
  } else if (e.includes("losange")) {
    shape = <polygon points="130,35 210,110 130,185 50,110" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />;
  } else if (e.includes("hexagone") || e.includes("6")) {
    shape = <polygon points="130,30 190,60 190,120 130,150 70,120 70,60" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="4" />;
  } else if (e.includes("symétr")) {
    shape = (
      <g>
        <rect x="40" y="50" width="70" height="120" fill="#cfe8d8" stroke="#1f5b3a" strokeWidth="3" />
        <line x1="130" y1="30" x2="130" y2="190" stroke="#e8a317" strokeWidth="3" strokeDasharray="6 4" />
        <rect x="150" y="50" width="70" height="120" fill={ok ? "#6ecf8e" : "#cfe8d8"} stroke="#1f5b3a" strokeWidth="3" />
      </g>
    );
  }
  return (
    <Board label="Géométrie" tone="math">
      <svg viewBox="0 0 260 220" className="scene-svg pedagogy-svg">
        {shape}
      </svg>
      <p className="pedagogy-note">{expected ?? "Figure"}</p>
    </Board>
  );
}

/** Tableau de proportionnalité. */
export function ProportionScene({ expected, ok }: { expected?: string; ok: boolean }) {
  return (
    <Board label="Proportionnalité" tone="math">
      <strong className="pedagogy-title">Même coefficient</strong>
      <div className="prop-table">
        <div>Quantité</div>
        <div>1</div>
        <div>2</div>
        <div>4</div>
        <div>Prix (€)</div>
        <div className={ok ? "is-hot" : ""}>5</div>
        <div className={ok ? "is-hot" : ""}>10</div>
        <div className={ok ? "is-hot" : ""}>{expected && /^\d+$/.test(expected) ? expected : "20"}</div>
      </div>
      <p className="pedagogy-note">On multiplie les deux lignes par le même nombre</p>
    </Board>
  );
}

/** Mini diagramme / données. */
export function DataScene({ expected, ok }: { expected?: string; ok: boolean }) {
  const bars = [
    { label: "A", h: 70 },
    { label: "B", h: 110 },
    { label: "C", h: 50 },
  ];
  return (
    <Board label="Données" tone="math">
      <svg viewBox="0 0 280 180" className="scene-svg pedagogy-svg">
        {bars.map((b, i) => (
          <g key={b.label}>
            <rect
              x={40 + i * 80}
              y={150 - b.h}
              width="48"
              height={b.h}
              rx="6"
              fill={ok && i === 1 ? "#e8a317" : "#5b8def"}
            />
            <text x={64 + i * 80} y={168} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
              {b.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="pedagogy-note">{expected ?? "Lecture du diagramme"}</p>
    </Board>
  );
}

/** Plateau de calcul mental / opérations. */
export function CalcBoardScene({ expected, ok, statement }: { expected?: string; ok: boolean; statement?: string }) {
  const op = statement?.match(/(\d[\d\s]*)\s*([+\-×x*÷/])\s*(\d[\d\s]*)/);
  return (
    <Board label="Calcul" tone="math">
      <div className="calc-board">
        {op ? (
          <div className="calc-expr">
            <span>{op[1]}</span>
            <span className="calc-op">{op[2]}</span>
            <span>{op[3]}</span>
          </div>
        ) : (
          <div className="calc-expr">
            <span>?</span>
          </div>
        )}
        <div className={`calc-result ${ok ? "is-hot" : ""}`}>{ok ? expected ?? "✓" : "…"}</div>
      </div>
      <p className="pedagogy-note">{ok ? "Résultat trouvé" : "Calcule, puis valide"}</p>
    </Board>
  );
}

/** Planche langue / EMC / histoire / anglais. */
export function TextBoardScene({
  subject,
  expected,
  ok,
  title,
}: {
  subject: SubjectSlug;
  expected?: string;
  ok: boolean;
  title?: string;
}) {
  const tone =
    subject === "emc" || subject === "anglais"
      ? "civic"
      : subject === "histoire-geo" || subject === "sciences" || subject === "questionner-le-monde"
        ? "world"
        : "lang";
  const badge =
    subject === "anglais"
      ? "EN"
      : subject === "emc"
        ? "EMC"
        : subject === "histoire-geo"
          ? "HG"
          : subject === "sciences" || subject === "questionner-le-monde"
            ? "Sci"
            : "Fr";
  return (
    <Board label={title ?? "Planche pédagogique"} tone={tone}>
      <div className="text-board">
        <span className="text-badge">{badge}</span>
        <div className={`text-card ${ok ? "is-hot" : ""}`}>
          <small>Réponse</small>
          <strong>{ok ? expected ?? "✓" : "…"}</strong>
        </div>
        {!ok && expected ? (
          <div className="text-hints" aria-hidden>
            <i />
            <i />
            <i />
          </div>
        ) : null}
      </div>
      <p className="pedagogy-note">{ok ? "Bonne lecture" : "Lis, choisis, valide"}</p>
    </Board>
  );
}

/** Méthode / synthèse. */
export function MethodBoardScene({ subject }: { subject: SubjectSlug }) {
  return (
    <Board label="Ce que j’ai appris" tone={subject === "maths" ? "math" : "lang"}>
      <div className="method-board">
        <strong>Méthode</strong>
        <ol>
          <li>Je lis la consigne</li>
          <li>Je cherche un modèle</li>
          <li>Je vérifie ma réponse</li>
        </ol>
      </div>
    </Board>
  );
}

export function narrativeFallback(
  universe: UniverseSlug,
  progress: number,
  success: boolean | undefined,
  NarrativePitch: (p: { progress: number; zones?: boolean }) => ReactNode,
  NarrativeSpace: (p: { progress: number; success?: boolean }) => ReactNode,
  NarrativeTrail: (p: { progress: number; tree?: boolean }) => ReactNode,
  zones?: boolean,
): ReactNode {
  if (universe === "espace") return <NarrativeSpace progress={progress} success={success} />;
  if (universe === "equitation") return <NarrativeTrail progress={progress} tree={progress >= 5} />;
  return <NarrativePitch progress={progress} zones={zones} />;
}
