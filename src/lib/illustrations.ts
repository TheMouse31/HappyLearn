import type { UniverseDef, UniverseSlug } from "../data/types";
import { UNIVERSES as BUILTIN_UNIVERSES, UNIVERSE_ORDER } from "../data/universes";

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

/** Scènes animées sélectionnables dans le créateur de missions. */
export const SCENE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Automatique (selon l’étape)" },
  { value: "T00", label: "Tutoriel fraction (T00)" },
  { value: "M01", label: "Fraction interactive (M01)" },
  { value: "M01B", label: "Simplifier (M01B)" },
  { value: "M02", label: "Nombre / parts (M02)" },
  { value: "M03", label: "Nombre / parts (M03)" },
  { value: "M04", label: "Nombre / parts (M04)" },
  { value: "M05A", label: "Deux étapes A (M05A)" },
  { value: "M05B", label: "Deux étapes B (M05B)" },
  { value: "M06", label: "Complément (M06)" },
  { value: "D01", label: "Direction (D01)" },
  { value: "N02", label: "Narration tokens (N02)" },
  { value: "N04", label: "Célébration (N04)" },
  { value: "L01", label: "Méthode (L01)" },
  { value: "Z01", label: "Teaser (Z01)" },
  { value: "B01", label: "Bilan (B01)" },
];

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
