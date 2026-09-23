import type { UniverseDef, UniverseSlug } from "../data/types";
import { UNIVERSES as BUILTIN_UNIVERSES, UNIVERSE_ORDER } from "../data/universes";
import { customSceneOptions } from "./customIllustrations";

const ILLUSTRATIONS_KEY = "happy-learn-illustration-overrides";

export type NeoAssetKey =
  | "guide"
  | "applaudit"
  | "pouce"
  | "football-mascot"
  | "football-pouce"
  | "football-body"
  | "football-arm"
  | "rugby-mascot"
  | "rugby-pouce"
  | "rugby-body"
  | "rugby-arm"
  | "equitation-mascot"
  | "equitation-pouce"
  | "equitation-body"
  | "equitation-arm"
  | "espace-mascot"
  | "espace-pouce"
  | "espace-body"
  | "espace-arm";

export type IllustrationOverrides = Partial<Record<NeoAssetKey, string>>;

export const ILLUSTRATION_FIELDS: {
  key: NeoAssetKey;
  label: string;
  defaultSrc: string;
  group: string;
}[] = [
  { key: "guide", label: "Néo guide", defaultSrc: "/neo/neo-guide.webp", group: "Néo" },
  {
    key: "applaudit",
    label: "Néo applaudit (sprite animé)",
    defaultSrc: "/neo/neo-applaudit-sprite.webp",
    group: "Néo",
  },
  { key: "pouce", label: "Néo pouce (défaut)", defaultSrc: "/neo/neo-pouce-leve.webp", group: "Néo" },
  ...UNIVERSE_ORDER.flatMap((slug) => {
    const def = BUILTIN_UNIVERSES[slug];
    return [
      {
        key: `${slug}-mascot` as NeoAssetKey,
        label: `${def.label} — mascotte`,
        defaultSrc: def.mascot,
        group: def.label,
      },
      {
        key: `${slug}-pouce` as NeoAssetKey,
        label: `${def.label} — pouce`,
        defaultSrc: def.pouce,
        group: def.label,
      },
      {
        key: `${slug}-body` as NeoAssetKey,
        label: `${def.label} — corps (animé)`,
        defaultSrc: def.body,
        group: def.label,
      },
      {
        key: `${slug}-arm` as NeoAssetKey,
        label: `${def.label} — bras (animé)`,
        defaultSrc: def.arm,
        group: def.label,
      },
    ];
  }),
];

export type SceneGroup = "auto" | "library" | "animated";

export type SceneTone =
  | "auto"
  | "tutorial"
  | "share"
  | "grid"
  | "direction"
  | "narrative"
  | "celebrate"
  | "method"
  | "teaser"
  | "empty"
  | "custom";

export type SceneOption = {
  value: string;
  label: string;
  blurb: string;
  group: SceneGroup;
  tone: SceneTone;
  thumb?: string;
};

/** Scènes animées intégrées sélectionnables dans le créateur de missions. */
export const SCENE_OPTIONS: SceneOption[] = [
  {
    value: "",
    label: "Automatique",
    blurb: "Choisie selon le type d’étape et la matière",
    group: "auto",
    tone: "auto",
  },
  {
    value: "T00",
    label: "Tutoriel fraction",
    blurb: "Tableau de parts animé",
    group: "animated",
    tone: "tutorial",
  },
  {
    value: "M01",
    label: "Partage / moitié",
    blurb: "Terrain, sentier ou signaux",
    group: "animated",
    tone: "share",
  },
  {
    value: "M01B",
    label: "Simplifier",
    blurb: "Parts qui se regroupent",
    group: "animated",
    tone: "share",
  },
  {
    value: "M02",
    label: "Nombre — parts",
    blurb: "Grille de jetons animés",
    group: "animated",
    tone: "grid",
  },
  {
    value: "M03",
    label: "Nombre — parts 2",
    blurb: "Grille de jetons animés",
    group: "animated",
    tone: "grid",
  },
  {
    value: "M04",
    label: "Nombre — parts 3",
    blurb: "Grille de jetons animés",
    group: "animated",
    tone: "grid",
  },
  {
    value: "M05A",
    label: "Deux étapes A",
    blurb: "Progression en deux temps",
    group: "animated",
    tone: "grid",
  },
  {
    value: "M05B",
    label: "Deux étapes B",
    blurb: "Suite de la progression",
    group: "animated",
    tone: "grid",
  },
  {
    value: "M06",
    label: "Complément",
    blurb: "Jetons / salles restantes",
    group: "animated",
    tone: "grid",
  },
  {
    value: "D01",
    label: "Direction",
    blurb: "Choix gauche / axe / droite",
    group: "animated",
    tone: "direction",
  },
  {
    value: "N02",
    label: "Narration",
    blurb: "Jetons qui clignent",
    group: "animated",
    tone: "narrative",
  },
  {
    value: "N04",
    label: "Célébration",
    blurb: "Animation de réussite",
    group: "animated",
    tone: "celebrate",
  },
  {
    value: "L01",
    label: "Méthode",
    blurb: "Carte méthode",
    group: "animated",
    tone: "method",
  },
  {
    value: "Z01",
    label: "Teaser",
    blurb: "Mystère / suite",
    group: "animated",
    tone: "teaser",
  },
  {
    value: "B01",
    label: "Bilan",
    blurb: "Sans illustration dédiée",
    group: "animated",
    tone: "empty",
  },
];

export const SCENE_GROUP_LABELS: Record<SceneGroup, string> = {
  auto: "Suggestion",
  library: "Ta bibliothèque",
  animated: "Scènes animées",
};

/** Scènes intégrées + illustrations personnalisées créées dans l’espace admin. */
export function getAllSceneOptions(): SceneOption[] {
  const custom = customSceneOptions();
  return [SCENE_OPTIONS[0], ...custom, ...SCENE_OPTIONS.slice(1)];
}

export function groupSceneOptions(options: SceneOption[]): { group: SceneGroup; items: SceneOption[] }[] {
  const order: SceneGroup[] = ["auto", "library", "animated"];
  return order
    .map((group) => ({ group, items: options.filter((item) => item.group === group) }))
    .filter((entry) => entry.items.length > 0);
}

export function loadIllustrationOverrides(): IllustrationOverrides {
  try {
    const raw = localStorage.getItem(ILLUSTRATIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as IllustrationOverrides;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveIllustrationOverrides(overrides: IllustrationOverrides): void {
  const cleaned: IllustrationOverrides = {};
  for (const field of ILLUSTRATION_FIELDS) {
    const value = overrides[field.key]?.trim();
    if (value && value !== field.defaultSrc) cleaned[field.key] = value;
  }
  localStorage.setItem(ILLUSTRATIONS_KEY, JSON.stringify(cleaned));
  window.dispatchEvent(new Event("happy-learn-illustrations"));
}

export function resolveAsset(key: NeoAssetKey): string {
  const overrides = loadIllustrationOverrides();
  const field = ILLUSTRATION_FIELDS.find((item) => item.key === key);
  return overrides[key]?.trim() || field?.defaultSrc || "";
}

export function resolveUniverses(): Record<UniverseSlug, UniverseDef> {
  const out = { ...BUILTIN_UNIVERSES } as Record<UniverseSlug, UniverseDef>;
  for (const slug of UNIVERSE_ORDER) {
    out[slug] = {
      ...BUILTIN_UNIVERSES[slug],
      mascot: resolveAsset(`${slug}-mascot` as NeoAssetKey),
      pouce: resolveAsset(`${slug}-pouce` as NeoAssetKey),
      body: resolveAsset(`${slug}-body` as NeoAssetKey),
      arm: resolveAsset(`${slug}-arm` as NeoAssetKey),
    };
  }
  return out;
}
