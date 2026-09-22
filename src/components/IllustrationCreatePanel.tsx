/**
 * Formulaire création / édition d’une illustration personnalisée.
 * Image = URL HTTPS/chemin site, ou data-URL via fichier (max 2,5 Mo).
 */
import { useState } from "react";
import { Button } from "./Button";
import {
  upsertCustomIllustration,
  type CustomIllustration,
} from "../lib/customIllustrations";

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
  const [error, setError] = useState("");

  function readImageFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisis un fichier image (PNG, JPG, WebP…).");
      return;
    }
    if (file.size > 2_500_000) {
      setError("Image trop lourde (max. 2,5 Mo). Compresse-la ou utilise une URL.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setError("Lecture du fichier impossible.");
        return;
      }
      onChange({ ...form, imageUrl: result });
      setError("");
    };
    reader.onerror = () => setError("Lecture du fichier impossible.");
    reader.readAsDataURL(file);
  }

  function submit() {
    try {
      const item = upsertCustomIllustration(form, editingId ?? undefined);
      setError("");
      onSaved(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    }
  }

  return (
    <form
      className={`illust-create${compact ? " is-compact" : ""}`}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
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
            />
          </div>
          <div className="field">
            <label htmlFor="illust-create-url">URL de l’image</label>
            <input
              id="illust-create-url"
              type="text"
              // Masque la data-URL (trop longue) ; le fichier reste dans form.imageUrl.
              value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
              onChange={(event) => onChange({ ...form, imageUrl: event.target.value })}
              placeholder="/images/ma-scene.webp ou https://…"
            />
            <small className="field-help">
              {form.imageUrl.startsWith("data:")
                ? "Fichier local chargé."
                : "Chemin du site ou lien HTTPS."}
            </small>
          </div>
          <div className="field">
            <label htmlFor="illust-create-file">Importer un fichier</label>
            <input
              id="illust-create-file"
              type="file"
              accept="image/*"
              onChange={(event) => readImageFile(event.target.files?.[0] ?? null)}
            />
          </div>
        </div>
        <div className={`illust-create-stage${form.imageUrl ? " has-image" : ""}`}>
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="" />
          ) : (
            <p>Aperçu de l’illustration</p>
          )}
        </div>
      </div>
      <div className="actions">
        <Button variant="primary" type="submit">
          {submitLabel ?? (editingId ? "Enregistrer" : "Ajouter à la bibliothèque")}
        </Button>
        {onCancel ? (
          <Button type="button" onClick={onCancel}>
            Annuler
          </Button>
        ) : null}
      </div>
      {error ? <p className="error">{error}</p> : null}
    </form>
  );
}
