/**
 * Bibliothèque d’illustrations personnalisées.
 * Priorité Supabase (table `illustrations` + URLs Storage), repli localStorage.
 */

import { getSupabase } from "./supabase";

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

function notifyChanged(): void {
  window.dispatchEvent(new Event(CUSTOM_ILLUSTRATIONS_EVENT));
}

function readLocal(): CustomIllustration[] {
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

function writeLocal(items: CustomIllustration[]): void {
  localStorage.setItem(CUSTOM_ILLUSTRATIONS_KEY, JSON.stringify(items));
  notifyChanged();
}

type IllustrationRow = {
  id: string;
  label: string;
  blurb: string | null;
  image_url: string;
  created_at?: string;
  updated_at?: string;
};

function mapRow(row: IllustrationRow): CustomIllustration {
  const created = row.created_at ? Date.parse(row.created_at) : Date.now();
  const updated = row.updated_at ? Date.parse(row.updated_at) : created;
  return {
    id: row.id,
    label: row.label,
    blurb: row.blurb ?? "",
    imageUrl: row.image_url,
    createdAt: Number.isFinite(created) ? created : Date.now(),
    updatedAt: Number.isFinite(updated) ? updated : Date.now(),
  };
}

export function loadCustomIllustrations(): CustomIllustration[] {
  return readLocal();
}

/** Charge depuis Supabase si possible, sinon localStorage. */
export async function fetchCustomIllustrations(): Promise<CustomIllustration[]> {
  const client = getSupabase();
  if (!client) return readLocal();
  const { data, error } = await client
    .from("illustrations")
    .select("id, label, blurb, image_url, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error || !data) return readLocal();
  const remote = data.map((row) => mapRow(row as IllustrationRow));
  writeLocal(remote);
  return remote;
}

/** Accepte un id brut ou une clé `custom:id`. */
export function getCustomIllustration(idOrScene: string): CustomIllustration | null {
  const id = parseCustomSceneId(idOrScene) ?? idOrScene;
  return loadCustomIllustrations().find((item) => item.id === id) ?? null;
}

export async function upsertCustomIllustration(
  input: CustomIllustrationInput,
  existingId?: string,
  teacherId?: string | null,
): Promise<CustomIllustration> {
  const label = input.label.trim();
  const imageUrl = input.imageUrl.trim();
  if (!label) throw new Error("Donne un nom à l’illustration.");
  if (!imageUrl) throw new Error("Ajoute une image ou une vidéo (URL ou fichier).");

  const now = Date.now();
  const items = readLocal();
  const index = existingId ? items.findIndex((item) => item.id === existingId) : -1;
  const id = index >= 0 ? items[index].id : newId(label);
  const created: CustomIllustration = {
    id,
    label,
    blurb: (input.blurb ?? "").trim(),
    imageUrl,
    createdAt: index >= 0 ? items[index].createdAt : now,
    updatedAt: now,
  };

  const nextLocal =
    index >= 0
      ? items.map((item, i) => (i === index ? created : item))
      : [created, ...items];
  writeLocal(nextLocal);

  const client = getSupabase();
  if (client) {
    const payload = {
      id: created.id,
      label: created.label,
      blurb: created.blurb,
      image_url: created.imageUrl,
      teacher_id: teacherId ?? null,
      updated_at: new Date(created.updatedAt).toISOString(),
      ...(index < 0 ? { created_at: new Date(created.createdAt).toISOString() } : {}),
    };
    const { error } = await client.from("illustrations").upsert(payload, { onConflict: "id" });
    if (error) {
      // Local déjà à jour ; on remonte un message soft via console seulement.
      console.warn("illustrations upsert:", error.message);
    }
  }

  return created;
}

export async function deleteCustomIllustration(id: string): Promise<void> {
  writeLocal(readLocal().filter((item) => item.id !== id));
  const client = getSupabase();
  if (client) {
    await client.from("illustrations").delete().eq("id", id);
  }
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
