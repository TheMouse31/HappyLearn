import type { ReactNode } from "react";
import type { StepKind, SubjectSlug, UniverseSlug } from "../data/types";
import { getCustomIllustration, isCustomSceneKey } from "../lib/customIllustrations";
import {
  CalcBoardScene,
  DataScene,
  FractionBarScene,
  GeometryScene,
  MethodBoardScene,
  NumberLineScene,
  PlaceValueScene,
  ProportionScene,
  TextBoardScene,
  parseFrac,
} from "./PedagogyScenes";

type Props = {
  universe: UniverseSlug;
  stepId: string;
  progress: number;
  success?: boolean;
  selected?: string;
  expected?: string;
  caption?: string;
  kind?: StepKind;
  subject?: SubjectSlug;
  statement?: string;
  title?: string;
};

const ACTOR: Record<number, { x: number; y: number }> = {
  0: { x: 78, y: 330 },
  1: { x: 118, y: 300 },
  2: { x: 158, y: 268 },
  3: { x: 198, y: 228 },
  4: { x: 238, y: 188 },
  5: { x: 278, y: 148 },
  6: { x: 312, y: 108 },
};

const PITCH_TRACES: { x: number; y: number; ax: number; ay: number; zone: boolean }[] = [
  { x: 65, y: 52, ax: 82, ay: 72, zone: false },
  { x: 146, y: 92, ax: 132, ay: 116, zone: false },
  { x: 232, y: 62, ax: 248, ay: 83, zone: false },
  { x: 87, y: 147, ax: 105, ay: 169, zone: false },
  { x: 191, y: 164, ax: 175, ay: 187, zone: false },
  { x: 245, y: 201, ax: 225, ay: 218, zone: false },
  { x: 61, y: 270, ax: 79, ay: 252, zone: true },
  { x: 137, y: 288, ax: 125, ay: 263, zone: true },
  { x: 229, y: 263, ax: 244, ay: 243, zone: true },
  { x: 83, y: 342, ax: 103, ay: 320, zone: true },
  { x: 190, y: 326, ax: 175, ay: 302, zone: true },
  { x: 239, y: 382, ax: 221, ay: 362, zone: true },
];

function isSolved(selected?: string, expected?: string, success?: boolean): boolean {
  return Boolean(success || (selected && expected && selected === expected));
}

function gridPoints(
  count: number,
  columns: number,
  originX: number,
  originY: number,
  gapX: number,
  gapY: number,
): { x: number; y: number; index: number }[] {
  return Array.from({ length: count }, (_, index) => ({
    index,
    x: originX + (index % columns) * gapX,
    y: originY + Math.floor(index / columns) * gapY,
  }));
}

function Stars() {
  const dots = [
    [24, 28],
    [68, 54],
    [112, 22],
    [168, 48],
    [214, 18],
    [268, 40],
    [318, 26],
    [36, 90],
    [330, 120],
    [22, 300],
    [340, 310],
  ];
  return (
    <g fill="#fff7ce" opacity="0.85">
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={y % 3 === 0 ? 2.5 : 1.8} />
      ))}
    </g>
  );
}

function PitchShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 300 450" className="scene-svg" role="img" aria-label={label}>
      <defs>
        <pattern id="grass" width="300" height="72" patternUnits="userSpaceOnUse">
          <rect width="300" height="36" fill="#4d9966" />
          <rect y="36" width="300" height="36" fill="#438d5c" />
        </pattern>
        <marker id="move-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10Z" fill="#ffe16a" />
        </marker>
      </defs>
      <rect x="1" y="1" width="298" height="448" rx="9" fill="url(#grass)" stroke="#f8fffa" strokeWidth="2" />
      <g fill="none" stroke="#f8fffa" strokeWidth="2" opacity="0.9">
        <path d="M1 225H299" />
        <circle cx="150" cy="225" r="47" />
        <path d="M87 1V78H213V1M87 449V372H213V449" />
      </g>
      {children}
    </svg>
  );
}

function SpaceShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 360 420" className="scene-svg" role="img" aria-label={label}>
      <rect width="360" height="420" fill="#07152c" />
      <Stars />
      <ellipse cx="180" cy="190" rx="140" ry="100" fill="none" stroke="#7caed6" strokeWidth="2" strokeDasharray="8 8" opacity="0.55" />
      <circle cx="180" cy="190" r="68" fill="#2679bd" stroke="#8fd5ff" strokeWidth="3" />
      <path d="M130 175 Q155 148 180 158 Q205 168 228 152 Q246 160 246 190 Q228 220 198 218 Q170 236 148 216 Q130 200 130 175Z" fill="#58a66b" />
      <text x="180" y="196" textAnchor="middle" fill="#ddecfa" fontSize="11" fontWeight="700">
        TERRE
      </text>
      <g transform="translate(312 88)">
        <rect x="-24" y="-8" width="48" height="16" rx="6" fill="#b9cadb" />
        <rect x="-5" y="-22" width="10" height="44" fill="#b9cadb" />
        <circle cx="0" cy="0" r="4" fill="#6ec8ef" />
      </g>
      {children}
    </svg>
  );
}

function TrailShell({ children, label, tree }: { children: ReactNode; label: string; tree?: boolean }) {
  return (
    <svg viewBox="0 0 360 420" className="scene-svg" role="img" aria-label={label}>
      <rect width="360" height="420" fill="#d7efdc" />
      <rect width="360" height="140" fill="#b7d9ee" />
      <ellipse cx="80" cy="140" rx="90" ry="28" fill="#9fd0aa" />
      <ellipse cx="280" cy="150" rx="110" ry="34" fill="#8fc49c" />
      <path d="M20 390 C80 320 120 340 170 280 C220 220 250 200 330 90" fill="none" stroke="#c4a574" strokeWidth="22" />
      <path d="M20 390 C80 320 120 340 170 280 C220 220 250 200 330 90" fill="none" stroke="#e8d3a4" strokeWidth="10" />
      <rect x="292" y="58" width="46" height="42" fill="#bd8252" />
      <polygon points="286,58 338,58 312,28" fill="#8b4d2a" />
      {tree ? (
        <g transform="translate(210 210)">
          <rect x="-40" y="-8" width="80" height="14" rx="6" fill="#6b4423" transform="rotate(-18)" />
          <circle cx="-36" cy="-10" r="10" fill="#3f7a48" />
        </g>
      ) : null}
      {children}
    </svg>
  );
}

function Dot({
  x,
  y,
  on,
  wait,
  good = "#ffe16a",
  idle = "#d8efe0",
}: {
  x: number;
  y: number;
  on: boolean;
  wait?: boolean;
  good?: string;
  idle?: string;
}) {
  return (
    <circle
      cx={x}
      cy={y}
      r="8"
      className={wait && !on ? "signal-wait" : on ? "signal-good" : undefined}
      fill={on ? good : idle}
      stroke={on ? "#fff8c8" : "#f8fffa"}
      strokeWidth="2"
    />
  );
}

function QuantityDots({
  count,
  columns,
  active,
  wait,
  originX,
  originY,
  gapX = 28,
  gapY = 28,
  good,
  idle,
}: {
  count: number;
  columns: number;
  active: number;
  wait?: boolean;
  originX: number;
  originY: number;
  gapX?: number;
  gapY?: number;
  good?: string;
  idle?: string;
}) {
  return (
    <g>
      {gridPoints(count, columns, originX, originY, gapX, gapY).map((point) => (
        <Dot
          key={point.index}
          x={point.x}
          y={point.y}
          on={point.index < active}
          wait={wait}
          good={good}
          idle={idle}
        />
      ))}
    </g>
  );
}

function YouMarker({ x = 150, y = 360 }: { x?: number; y?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill="#2468c6" stroke="#fff" strokeWidth="3" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">
        TOI
      </text>
    </g>
  );
}

function PressingPlayers({ success }: { success: boolean }) {
  return (
    <g>
      <circle cx={success ? 110 : 80} cy={success ? 250 : 236} r="14" fill="#d86f24" className="scene-actor" />
      <circle cx={success ? 190 : 220} cy={success ? 250 : 236} r="14" fill="#d86f24" className="scene-actor" />
      <circle cx={150} cy={success ? 200 : 170} r="14" fill="#d86f24" className="scene-actor" />
      {success ? (
        <path d="M150 300 C150 250 150 210 150 120" fill="none" stroke="#ffe16a" strokeWidth="4" strokeDasharray="8 6" />
      ) : null}
    </g>
  );
}

function HalfPitchScene({ ok, corridorLabel }: { ok: boolean; corridorLabel: string }) {
  return (
    <PitchShell label={`Terrain avec douze déplacements. Six dans ${corridorLabel}.`}>
      <rect
        x="12"
        y="235"
        width="276"
        height="202"
        rx="12"
        fill={ok ? "#ffe16a33" : "#ffe16a14"}
        stroke="#f1d166"
        strokeDasharray="7 6"
        strokeWidth="2"
      />
      <text x="150" y="425" textAnchor="middle" fill="#fff7c9" fontSize="14" fontWeight="600">
        {corridorLabel.toUpperCase()}
      </text>
      <g fill="none" stroke="#ffe16a" strokeWidth="3" strokeLinecap="round" markerEnd="url(#move-head)">
        {PITCH_TRACES.map((trace) => (
          <path key={`a-${trace.x}-${trace.y}`} d={`M${trace.x} ${trace.y}L${trace.ax} ${trace.ay}`} />
        ))}
      </g>
      {PITCH_TRACES.map((trace) => (
        <circle
          key={`d-${trace.x}-${trace.y}`}
          cx={trace.x}
          cy={trace.y}
          r="8"
          fill={trace.zone && ok ? "#ffe16a" : "#d8efe0"}
          stroke="#f8fffa"
          strokeWidth="2"
        />
      ))}
      <YouMarker x={144} y={359} />
    </PitchShell>
  );
}

function GroupsScene({ ok }: { ok: boolean }) {
  return (
    <div className="scene-panel scene-groups" role="img" aria-label="Douze éléments en deux groupes égaux">
      <div className={`group-box ${ok ? "is-hot" : ""}`}>
        <span>Groupe 1</span>
        <div className="group-dots">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className="group-dot tone-a" />
          ))}
        </div>
      </div>
      <div className={`group-box ${ok ? "is-hot" : ""}`}>
        <span>Groupe 2</span>
        <div className="group-dots">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} className="group-dot tone-b" />
          ))}
        </div>
      </div>
      {ok ? <p className="group-eq">Les deux groupes sont égaux · une moitié</p> : null}
    </div>
  );
}

function TutorialScene() {
  return (
    <div className="scene-panel scene-tutorial" role="img" aria-label="Exemple trois quarts">
      <div className="tutorial-board">
        <div className="fraction-slices big">
          <b className="is-filled" />
          <b className="is-filled" />
          <b className="is-filled" />
          <b />
        </div>
        <strong>3/4</strong>
      </div>
      <p>Trois parts colorées sur quatre</p>
    </div>
  );
}

function SharePitchScene({
  count,
  columns,
  active,
  wait,
  ok,
  label,
  showPressing,
}: {
  count: number;
  columns: number;
  active: number;
  wait?: boolean;
  ok: boolean;
  label: string;
  showPressing?: boolean;
}) {
  const rows = Math.ceil(count / columns);
  const originY = 70;
  return (
    <PitchShell label={label}>
      {showPressing ? <PressingPlayers success={ok} /> : null}
      <QuantityDots
        count={count}
        columns={columns}
        active={active}
        wait={wait}
        originX={40}
        originY={originY}
        gapX={columns >= 6 ? 40 : 48}
        gapY={rows > 5 ? 34 : 40}
      />
      <YouMarker />
    </PitchShell>
  );
}

function ShareSpaceScene({
  count,
  columns,
  active,
  wait,
  label,
  progress,
  ok,
}: {
  count: number;
  columns: number;
  active: number;
  wait?: boolean;
  label: string;
  progress: number;
  ok: boolean;
}) {
  const actor = ACTOR[Math.min(progress, 6)] ?? ACTOR[0];
  return (
    <SpaceShell label={label}>
      <QuantityDots
        count={count}
        columns={columns}
        active={active}
        wait={wait}
        originX={48}
        originY={270}
        gapX={columns >= 6 ? 48 : 56}
        gapY={34}
        good="#63c782"
        idle="#9b6df2"
      />
      <g transform={`translate(${actor.x} ${Math.min(actor.y, 250)})`} className="scene-actor">
        {ok ? <path d="M-8 16 L0 34 L8 16Z" fill="#ffc557" /> : null}
        <path d="M-16 14 L-12 -12 Q0 -26 12 -12 L16 14Z" fill="#e6edf4" stroke="#7890a8" />
        <circle cx="0" cy="-4" r="6" fill="#6ec8ef" />
      </g>
    </SpaceShell>
  );
}

function ShareTrailScene({
  count,
  active,
  wait,
  label,
  tree,
}: {
  count: number;
  active: number;
  wait?: boolean;
  label: string;
  tree?: boolean;
}) {
  const path = gridPoints(count, 1, 0, 0, 0, 0).map((_, index) => {
    const t = index / Math.max(count - 1, 1);
    const x = 40 + t * 270;
    const y = 370 - t * 260;
    return { x, y, index };
  });
  return (
    <TrailShell label={label} tree={tree}>
      {path.map((point) => (
        <Dot
          key={point.index}
          x={point.x}
          y={point.y}
          on={point.index < active}
          wait={wait}
          good="#ffe16a"
          idle="#267d4e"
        />
      ))}
    </TrailShell>
  );
}

function DirectionScene({ selected, ok }: { selected?: string; ok: boolean }) {
  const choice = selected || (ok ? "axe" : "");
  return (
    <PitchShell label="Trois couloirs : gauche, axe, droite">
      <g opacity="0.9">
        <rect x="10" y="20" width="90" height="410" fill={choice === "gauche" ? "#ffffff44" : "#ffffff18"} />
        <rect x="105" y="20" width="90" height="410" fill={choice === "axe" ? "#ffe08a88" : "#ffffff18"} />
        <rect x="200" y="20" width="90" height="410" fill={choice === "droite" ? "#ffffff44" : "#ffffff18"} />
      </g>
      <text x="55" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
        Gauche
      </text>
      <text x="150" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
        Axe
      </text>
      <text x="245" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
        Droite
      </text>
      <YouMarker x={choice === "gauche" ? 55 : choice === "droite" ? 245 : 150} y={300} />
      {ok ? <path d="M150 280 L150 90" fill="none" stroke="#ffe16a" strokeWidth="5" strokeDasharray="10 7" /> : null}
    </PitchShell>
  );
}

function NarrativePitch({ progress, zones }: { progress: number; zones?: boolean }) {
  const y = 380 - progress * 38;
  return (
    <PitchShell label="Terrain de la mission">
      {zones ? (
        <g opacity="0.85">
          <rect x="10" y="20" width="90" height="410" fill="#ffffff22" />
          <rect x="105" y="20" width="90" height="410" fill="#ffe08a44" />
          <rect x="200" y="20" width="90" height="410" fill="#ffffff22" />
          <text x="55" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
            Gauche
          </text>
          <text x="150" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
            Axe
          </text>
          <text x="245" y="48" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800">
            Droite
          </text>
        </g>
      ) : null}
      <circle cx="70" cy="90" r="12" fill="#d86f24" />
      <circle cx="230" cy="80" r="12" fill="#d86f24" />
      <YouMarker x={150} y={y} />
    </PitchShell>
  );
}

function NarrativeSpace({ progress, success }: { progress: number; success?: boolean }) {
  const actor = ACTOR[Math.min(progress, 6)] ?? ACTOR[0];
  return (
    <SpaceShell label="Module en approche de la station">
      <g transform={`translate(${actor.x} ${actor.y})`} className="scene-actor">
        {success ? <path d="M-8 16 L0 34 L8 16Z" fill="#ffc557" /> : null}
        <path d="M-16 14 L-12 -12 Q0 -26 12 -12 L16 14Z" fill="#e6edf4" stroke="#7890a8" />
        <circle cx="0" cy="-4" r="6" fill="#6ec8ef" />
      </g>
    </SpaceShell>
  );
}

function NarrativeTrail({ progress, tree }: { progress: number; tree?: boolean }) {
  const actor = ACTOR[Math.min(progress, 6)] ?? ACTOR[0];
  return (
    <TrailShell label="Chemin vers l’écurie" tree={tree}>
      <g transform={`translate(${actor.x} ${actor.y})`}>
        <ellipse cx="0" cy="8" rx="18" ry="10" fill="#5b3a1e" />
        <ellipse cx="10" cy="-2" rx="12" ry="8" fill="#7a4c24" />
        <circle cx="18" cy="-6" r="5" fill="#3d2918" />
      </g>
    </TrailShell>
  );
}

function Celebration({ text }: { text: string }) {
  return (
    <div className="scene-panel scene-celebrate" role="img" aria-label={text}>
      <strong>{text}</strong>
    </div>
  );
}

function ShareScene({
  universe,
  count,
  columns,
  active,
  wait,
  ok,
  label,
  progress,
  showPressing,
  tree,
}: {
  universe: UniverseSlug;
  count: number;
  columns: number;
  active: number;
  wait?: boolean;
  ok: boolean;
  label: string;
  progress: number;
  showPressing?: boolean;
  tree?: boolean;
}) {
  if (universe === "espace") {
    return (
      <ShareSpaceScene
        count={count}
        columns={columns}
        active={active}
        wait={wait}
        label={label}
        progress={progress}
        ok={ok}
      />
    );
  }
  if (universe === "equitation") {
    return <ShareTrailScene count={count} active={active} wait={wait} label={label} tree={tree} />;
  }
  return (
    <SharePitchScene
      count={count}
      columns={columns}
      active={active}
      wait={wait}
      ok={ok}
      label={label}
      showPressing={showPressing}
    />
  );
}

/** Scènes legacy de la mission fractions CM2 uniquement (pas les slugs s01…). */
const FRACTIONS_LEGACY = new Set([
  "T00",
  "M01",
  "M01B",
  "M02",
  "M03",
  "M04",
  "M05A",
  "M05B",
  "M06",
  "D01",
  "N01",
  "N02",
  "N03",
  "N04",
  "L01",
  "B01",
  "Z01",
]);

function mathsPedagogy(expected: string | undefined, ok: boolean, statement?: string, title?: string): ReactNode {
  const text = `${title ?? ""} ${statement ?? ""} ${expected ?? ""}`.toLowerCase();
  if (/entre\s+\d+\s+et\s+\d+/.test(expected ?? "") || text.includes("droite") || text.includes("encadr")) {
    return <NumberLineScene expected={expected} ok={ok} />;
  }
  if (parseFrac(expected) || text.includes("fraction") || text.includes("quarts") || text.includes("tiers")) {
    return <FractionBarScene expected={expected} ok={ok} />;
  }
  if (
    (expected?.includes(",") && /0,\d|\d,\d/.test(expected)) ||
    text.includes("décimal") ||
    text.includes("dixième") ||
    text.includes("centième") ||
    text.includes("millième") ||
    text.includes("virgule")
  ) {
    return <PlaceValueScene expected={expected} ok={ok} decimal />;
  }
  if (
    text.includes("carré") ||
    text.includes("triangle") ||
    text.includes("losange") ||
    text.includes("hexagone") ||
    text.includes("symétr") ||
    text.includes("géométr") ||
    text.includes("angle") ||
    text.includes("côté")
  ) {
    return <GeometryScene expected={expected} ok={ok} />;
  }
  if (text.includes("proportion") || text.includes("coefficient") || text.includes("unitaire")) {
    return <ProportionScene expected={expected} ok={ok} />;
  }
  if (text.includes("diagramme") || text.includes("probab") || text.includes("donnée") || text.includes("votes")) {
    return <DataScene expected={expected} ok={ok} />;
  }
  if (
    (expected && /^\d{1,3}(\s\d{3})+$/.test(expected.trim())) ||
    text.includes("million") ||
    text.includes("millier") ||
    text.includes("numération") ||
    text.includes("classe")
  ) {
    return <PlaceValueScene expected={expected} ok={ok} />;
  }
  return <CalcBoardScene expected={expected} ok={ok} statement={statement} />;
}

function resolvePedagogy(props: {
  kind?: StepKind;
  subject?: SubjectSlug;
  expected?: string;
  ok: boolean;
  statement?: string;
  title?: string;
  universe: UniverseSlug;
  progress: number;
  success?: boolean;
  selected?: string;
}): ReactNode {
  const { kind, subject, expected, ok, statement, title, universe, progress, success, selected } = props;

  if (kind === "bilan") return null;
  if (kind === "teaser") return <Celebration text="?" />;
  if (kind === "method") return <MethodBoardScene subject={subject ?? "maths"} />;
  if (kind === "direction") {
    if (universe === "espace") {
      return (
        <SpaceShell label="Choix de l’axe final">
          <g>
            <rect x="40" y="250" width="80" height="120" rx="12" fill={selected === "gauche" ? "#ffffff33" : "#ffffff14"} />
            <rect x="140" y="250" width="80" height="120" rx="12" fill={ok || selected === "axe" ? "#ffe08a88" : "#ffffff14"} />
            <rect x="240" y="250" width="80" height="120" rx="12" fill={selected === "droite" ? "#ffffff33" : "#ffffff14"} />
            <text x="80" y="320" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">
              Gauche
            </text>
            <text x="180" y="320" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">
              Axe
            </text>
            <text x="280" y="320" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">
              Droite
            </text>
          </g>
        </SpaceShell>
      );
    }
    if (universe === "equitation") {
      return (
        <TrailShell label="Regard dans l’axe" tree>
          <path
            d="M120 360 L180 220 L240 120"
            fill="none"
            stroke={ok || selected === "axe" ? "#ffe16a" : "#267d4e"}
            strokeWidth="8"
            strokeDasharray="10 8"
          />
        </TrailShell>
      );
    }
    return <DirectionScene selected={selected} ok={ok} />;
  }

  if (kind === "continue") {
    if (universe === "espace") return <NarrativeSpace progress={progress} success={success} />;
    if (universe === "equitation") return <NarrativeTrail progress={progress} tree={progress >= 5} />;
    return <NarrativePitch progress={progress} />;
  }

  if (kind === "tutorial") {
    if (parseFrac(expected)) return <FractionBarScene expected={expected} ok={ok} />;
    if (subject === "maths") return <CalcBoardScene expected={expected} ok={ok} statement={statement} />;
    return <TextBoardScene subject={subject ?? "francais"} expected={expected} ok={ok} title={title} />;
  }

  if (kind === "fraction-choice" || kind === "simplify") {
    return <FractionBarScene expected={expected} ok={ok} />;
  }

  if (subject === "maths" || !subject) {
    return mathsPedagogy(expected, ok, statement, title);
  }

  return <TextBoardScene subject={subject} expected={expected} ok={ok} title={title} />;
}

export function UniverseScene({
  universe,
  stepId,
  progress,
  success,
  selected,
  expected,
  caption,
  kind,
  subject,
  statement,
  title,
}: Props) {
  // stepId = clé de scène (step.scene ou legacy), pas l’id canonique mission/slug.
  const scene = stepId.includes("/") ? stepId.slice(stepId.lastIndexOf("/") + 1) : stepId;
  const ok = isSolved(selected, expected, success);
  const corridorLabel = universe === "rugby" ? "Ton couloir" : "Ta zone";

  let body: ReactNode = null;

  // Illustrations perso (préfixe custom:) : image pleine zone, pas de scène procédurale.
  const custom = isCustomSceneKey(scene) ? getCustomIllustration(scene) : null;
  if (custom) {
    body = (
      <div className="scene-panel scene-custom" role="img" aria-label={custom.label}>
        <img className="scene-custom-img" src={custom.imageUrl} alt={custom.label} />
      </div>
    );
  } else if (FRACTIONS_LEGACY.has(scene)) {
    if (scene === "B01") body = null;
    else if (scene === "T00") body = <TutorialScene />;
    else if (scene === "M01") {
      if (universe === "espace") {
        body = (
          <ShareSpaceScene
            count={12}
            columns={4}
            active={ok ? 6 : 0}
            wait={!ok}
            label="Douze signaux de navigation"
            progress={progress}
            ok={ok}
          />
        );
      } else if (universe === "equitation") {
        body = <ShareTrailScene count={12} active={ok ? 6 : 0} wait={!ok} label="Douze passages sur le sentier" />;
      } else {
        body = <HalfPitchScene ok={ok} corridorLabel={corridorLabel} />;
      }
    } else if (scene === "M01B") {
      if (universe === "espace") {
        body = (
          <ShareSpaceScene
            count={12}
            columns={4}
            active={ok ? 12 : 6}
            wait={!ok}
            label="Douze signaux en deux groupes"
            progress={progress}
            ok={ok}
          />
        );
      } else if (universe === "equitation") {
        body = <ShareTrailScene count={12} active={ok ? 12 : 6} wait={!ok} label="Douze passages en deux groupes" />;
      } else {
        body = <GroupsScene ok={ok} />;
      }
    } else if (scene === "M02") {
      body = (
        <ShareScene
          universe={universe}
          count={20}
          columns={5}
          active={ok ? 5 : 0}
          wait={!ok}
          ok={ok}
          label="Vingt éléments : un quart à trouver"
          progress={progress}
          showPressing
        />
      );
    } else if (scene === "M03") {
      body = (
        <ShareScene
          universe={universe}
          count={20}
          columns={5}
          active={ok ? 15 : 5}
          wait={!ok}
          ok={ok}
          label="Vingt éléments : trois quarts à trouver"
          progress={progress}
        />
      );
    } else if (scene === "M04") {
      body = (
        <ShareScene
          universe={universe}
          count={18}
          columns={6}
          active={ok ? 12 : 0}
          wait={!ok}
          ok={ok}
          label="Dix-huit éléments : deux tiers à trouver"
          progress={progress}
        />
      );
    } else if (scene === "M05A") {
      body = (
        <ShareScene
          universe={universe}
          count={24}
          columns={6}
          active={ok ? 18 : 0}
          wait={!ok}
          ok={ok}
          label="Vingt-quatre éléments : trois quarts"
          progress={progress}
        />
      );
    } else if (scene === "M05B") {
      body = (
        <ShareScene
          universe={universe}
          count={18}
          columns={6}
          active={ok ? 6 : 0}
          wait={!ok}
          ok={ok}
          label="Dix-huit éléments restants : un tiers"
          progress={progress}
          tree
        />
      );
    } else if (scene === "M06") {
      body = (
        <ShareScene
          universe={universe}
          count={30}
          columns={6}
          active={ok ? 5 : 0}
          wait={!ok}
          ok={ok}
          label="Trente repères. Le reste se calcule."
          progress={progress}
          tree
        />
      );
    } else if (scene === "D01") {
      body = resolvePedagogy({
        kind: "direction",
        subject,
        expected,
        ok,
        statement,
        title,
        universe,
        progress,
        success,
        selected,
      });
    } else if (scene === "N04" || scene === "L01") body = <Celebration text="Mission réussie" />;
    else if (scene === "Z01") body = <Celebration text="?" />;
    else if (scene === "N02") {
      if (universe === "espace") body = <NarrativeSpace progress={progress} success={success} />;
      else if (universe === "equitation") body = <NarrativeTrail progress={progress} tree={progress >= 5} />;
      else body = <NarrativePitch progress={progress} zones />;
    } else {
      // N01, N03 : narratif univers
      if (universe === "espace") body = <NarrativeSpace progress={progress} success={success} />;
      else if (universe === "equitation") body = <NarrativeTrail progress={progress} tree={progress >= 5} />;
      else body = <NarrativePitch progress={progress} />;
    }
  } else {
    // Toutes les autres missions : illustration selon kind + matière + énoncé
    body = resolvePedagogy({
      kind,
      subject,
      expected,
      ok,
      statement,
      title,
      universe,
      progress,
      success,
      selected,
    });
  }

  return (
    <figure className={`scene scene-${universe} is-dedicated`}>
      {body}
      {caption ? <figcaption className="scene-caption">{caption}</figcaption> : null}
    </figure>
  );
}
