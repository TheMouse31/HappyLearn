/**
 * Bibliothèque d’illustrations personnalisées (localStorage).
 * Les clés de scène côté mission utilisent le préfixe `custom:` + id.
 */

const CUSTOM_ILLUSTRATIONS_KEY = "happy-learn-custom-illustrations";
export const CUSTOM_SCENE_PREFIX = "custom:";
/** Événement fenêtre : synchro entre onglets / écrans (admin ↔ studio missions). */
export const CUSTOM_ILLUSTRATIONS_EVENT = "happy-learn-custom-illustrations";

export type CustomIllustration = {
  id: string;
  label: string;
  blurb: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
};

export type CustomIllustrationInput = {
  label: string;
  blurb?: string;
  imageUrl: string;
};

/** Slug URL-safe (sans accents) pour préfixer l’id. */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function newId(label: string): string {
  const base = slugify(label) || "illustration";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export function customSceneKey(id: string): string {
  return `${CUSTOM_SCENE_PREFIX}${id}`;
}

/** Extrait l’id depuis `custom:…`, ou null si ce n’est pas une scène perso. */
export function parseCustomSceneId(scene: string): string | null {
  if (!scene.startsWith(CUSTOM_SCENE_PREFIX)) return null;
  const id = scene.slice(CUSTOM_SCENE_PREFIX.length).trim();
  return id || null;
}

export function isCustomSceneKey(scene: string): boolean {
  return parseCustomSceneId(scene) !== null;
}

export function loadCustomIllustrations(): CustomIllustration[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ILLUSTRATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomIllustration[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.label === "string" &&
          typeof item.imageUrl === "string" &&
          item.imageUrl.trim(),
      )
      .map((item) => ({
        id: item.id,
        label: item.label.trim(),
        blurb: typeof item.blurb === "string" ? item.blurb.trim() : "",
        imageUrl: item.imageUrl.trim(),
        createdAt: typeof item.createdAt === "number" ? item.createdAt : Date.now(),
        updatedAt: typeof item.updatedAt === "number" ? item.updatedAt : Date.now(),
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

function persist(items: CustomIllustration[]): void {
  localStorage.setItem(CUSTOM_ILLUSTRATIONS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CUSTOM_ILLUSTRATIONS_EVENT));
}

/** Accepte un id brut ou une clé `custom:id`. */
export function getCustomIllustration(idOrScene: string): CustomIllustration | null {
  const id = parseCustomSceneId(idOrScene) ?? idOrScene;
  return loadCustomIllustrations().find((item) => item.id === id) ?? null;
}

export function upsertCustomIllustration(
  input: CustomIllustrationInput,
  existingId?: string,
): CustomIllustration {
  const label = input.label.trim();
  const imageUrl = input.imageUrl.trim();
  if (!label) throw new Error("Donne un nom à l’illustration.");
  if (!imageUrl) throw new Error("Ajoute une image (URL ou fichier).");

  const now = Date.now();
  const items = loadCustomIllustrations();
  const index = existingId ? items.findIndex((item) => item.id === existingId) : -1;

  if (index >= 0) {
    const next: CustomIllustration = {
      ...items[index],
      label,
      blurb: (input.blurb ?? "").trim(),
      imageUrl,
      updatedAt: now,
    };
    items[index] = next;
    persist(items);
    return next;
  }

  const created: CustomIllustration = {
    id: newId(label),
    label,
    blurb: (input.blurb ?? "").trim(),
    imageUrl,
    createdAt: now,
    updatedAt: now,
  };
  persist([created, ...items]);
  return created;
}

export function deleteCustomIllustration(id: string): void {
  persist(loadCustomIllustrations().filter((item) => item.id !== id));
}

/** Options prêtes pour ScenePicker (groupe « library », ton custom). */
export function customSceneOptions(): {
  value: string;
  label: string;
  blurb: string;
  group: "library";
  tone: "custom";
  thumb: string;
}[] {
  return loadCustomIllustrations().map((item) => ({
    value: customSceneKey(item.id),
    label: item.label,
    blurb: item.blurb || "Illustration personnalisée",
    group: "library" as const,
    tone: "custom" as const,
    thumb: item.imageUrl,
  }));
}
