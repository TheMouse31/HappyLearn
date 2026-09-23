/**
 * Upload images / vidéos vers le bucket Supabase `media`.
 * Fallback local : data-URL (mode sans Supabase ou échec réseau).
 */
import { getSupabase } from "./supabase";

export const MEDIA_BUCKET = "media";

const IMAGE_MAX_BYTES = 5_000_000;
const VIDEO_MAX_BYTES = 50_000_000;

function extensionOf(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/webm") return "webm";
  return "bin";
}

function buildObjectPath(kind: "images" | "videos", file: File): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${kind}/${stamp}/${rand}.${extensionOf(file)}`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) reject(new Error("Lecture du fichier impossible."));
      else resolve(result);
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

export type MediaUploadResult = {
  url: string;
  path: string | null;
  via: "supabase" | "local";
};

/** Détecte une URL / chemin vidéo (mp4, webm, ou dossier Storage videos/). */
export function isMediaVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const value = url.toLowerCase();
  if (value.startsWith("data:video/")) return true;
  if (/\.(mp4|webm|ogg)(\?|#|$)/.test(value)) return true;
  if (value.includes("/storage/v1/object/") && value.includes("/videos/")) return true;
  return false;
}

/** Upload une image (PNG/JPG/WebP/GIF) vers Storage, sinon data-URL locale. */
export async function uploadImageFile(file: File): Promise<MediaUploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choisis un fichier image (PNG, JPG, WebP…).");
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new Error("Image trop lourde (max. 5 Mo).");
  }

  const client = getSupabase();
  if (!client) {
    return { url: await readAsDataUrl(file), path: null, via: "local" };
  }

  const path = buildObjectPath("images", file);
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) {
    // Fallback utile en local / si RLS refuse.
    return { url: await readAsDataUrl(file), path: null, via: "local" };
  }
  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, via: "supabase" };
}

/** Upload une vidéo (mp4/webm) vers Storage. */
export async function uploadVideoFile(file: File): Promise<MediaUploadResult> {
  if (!file.type.startsWith("video/")) {
    throw new Error("Choisis un fichier vidéo (MP4 ou WebM).");
  }
  if (file.size > VIDEO_MAX_BYTES) {
    throw new Error("Vidéo trop lourde (max. 50 Mo).");
  }

  const client = getSupabase();
  if (!client) {
    throw new Error("Supabase requis pour stocker une vidéo (trop lourde en local).");
  }

  const path = buildObjectPath("videos", file);
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, via: "supabase" };
}
