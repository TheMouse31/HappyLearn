/**
 * Formulaire création / édition d’une illustration personnalisée.
 * Image ou vidéo → upload Supabase Storage (`media`), sinon data-URL locale (images).
 */
import { useState } from "react";
import { Button } from "./Button";
import {
  upsertCustomIllustration,
  type CustomIllustration,
} from "../lib/customIllustrations";
import { isMediaVideoUrl, uploadImageFile, uploadVideoFile } from "../lib/mediaStorage";
import { useSession } from "../lib/session";

export type IllustrationFormState = {
  label: string;
  blurb: string;
  imageUrl: string;
};

export const EMPTY_ILLUSTRATION_FORM: IllustrationFormState = {
  label: "",
  blurb: "",
  imageUrl: "",
};

type Props = {
  form: IllustrationFormState;
  onChange: (next: IllustrationFormState) => void;
  editingId?: string | null;
  onSaved: (item: CustomIllustration) => void;
  onCancel?: () => void;
  compact?: boolean;
  submitLabel?: string;
};

export function IllustrationCreatePanel({
  form,
  onChange,
  editingId,
  onSaved,
  onCancel,
  compact,
  submitLabel,
}: Props) {
  const { teacher } = useSession();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadNote, setUploadNote] = useState("");
  const isVideo = isMediaVideoUrl(form.imageUrl);

  async function readImageFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    setUploadNote("Envoi de l’image…");
    try {
      const uploaded = await uploadImageFile(file);
      onChange({ ...form, imageUrl: uploaded.url });
      setUploadNote(
        uploaded.via === "supabase"
          ? "Image stockée sur Supabase Storage."
          : "Image en local (data-URL) — Supabase indisponible ou refus RLS.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload impossible.");
      setUploadNote("");
    } finally {
      setBusy(false);
    }
  }

  async function readVideoFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    setUploadNote("Envoi de la vidéo…");
    try {
      const uploaded = await uploadVideoFile(file);
      onChange({ ...form, imageUrl: uploaded.url });
      setUploadNote("Vidéo stockée sur Supabase Storage.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload vidéo impossible.");
      setUploadNote("");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const item = await upsertCustomIllustration(
        form,
        editingId ?? undefined,
        teacher?.id ?? null,
      );
      onSaved(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className={`illust-create${compact ? " is-compact" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="illust-create-grid">
        <div className="illust-create-fields">
          <div className="field">
            <label htmlFor="illust-create-label">Nom</label>
            <input
              id="illust-create-label"
              type="text"
              value={form.label}
              onChange={(event) => onChange({ ...form, label: event.target.value })}
              placeholder="Ex. Partage de pizza"
              required
              disabled={busy}
            />
          </div>
          <div className="field">
            <label htmlFor="illust-create-blurb">Description</label>
            <input
              id="illust-create-blurb"
              type="text"
              value={form.blurb}
              onChange={(event) => onChange({ ...form, blurb: event.target.value })}
              placeholder="Courte aide pour le créateur de missions"
              disabled={busy}
            />
          </div>
          <div className="field">
            <label htmlFor="illust-create-url">URL média</label>
            <input
              id="illust-create-url"
              type="text"
              value={
                form.imageUrl.startsWith("data:") || form.imageUrl.includes("/storage/v1/object/")
                  ? ""
                  : form.imageUrl
              }
              onChange={(event) => onChange({ ...form, imageUrl: event.target.value })}
              placeholder="/images/ma-scene.webp, https://… ou URL vidéo"
              disabled={busy}
            />
            <small className="field-help">
              {form.imageUrl.startsWith("data:")
                ? "Fichier local (data-URL)."
                : form.imageUrl.includes("/storage/v1/object/")
                  ? isVideo
                    ? "Vidéo sur Supabase Storage."
                    : "Image sur Supabase Storage."
                  : "Chemin du site, lien HTTPS, ou importe un fichier ci-dessous."}
            </small>
          </div>
          <div className="field">
            <label htmlFor="illust-create-file">Importer une image</label>
            <input
              id="illust-create-file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={busy}
              onChange={(event) => void readImageFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className="field">
            <label htmlFor="illust-create-video">Importer une vidéo</label>
            <input
              id="illust-create-video"
              type="file"
              accept="video/mp4,video/webm"
              disabled={busy}
              onChange={(event) => void readVideoFile(event.target.files?.[0] ?? null)}
            />
            <small className="field-help">MP4 ou WebM, max. 50 Mo (Supabase requis).</small>
            {uploadNote ? <small className="field-help">{uploadNote}</small> : null}
          </div>
        </div>
        <div className={`illust-create-stage${form.imageUrl ? " has-image" : ""}`}>
          {form.imageUrl ? (
            isVideo ? (
              <video src={form.imageUrl} controls playsInline muted loop />
            ) : (
              <img src={form.imageUrl} alt="" />
            )
          ) : (
            <p>Aperçu de l’illustration</p>
          )}
        </div>
      </div>
      <div className="actions">
        <Button variant="primary" type="submit" disabled={busy}>
          {busy
            ? "Enregistrement…"
            : (submitLabel ?? (editingId ? "Enregistrer" : "Ajouter à la bibliothèque"))}
        </Button>
        {onCancel ? (
          <Button type="button" onClick={onCancel} disabled={busy}>
            Annuler
          </Button>
        ) : null}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
