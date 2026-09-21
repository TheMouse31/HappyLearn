import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { listAdminCatalog } from "../data/missions/index";
import {
  addAdminEmail,
  readAdminEmails,
  removeAdminEmail,
  SEED_ADMIN_EMAILS,
} from "../lib/admins";
import {
  CUSTOM_ILLUSTRATIONS_EVENT,
  customSceneKey,
  deleteCustomIllustration,
  loadCustomIllustrations,
  upsertCustomIllustration,
  type CustomIllustration,
} from "../lib/customIllustrations";
import {
  ILLUSTRATION_FIELDS,
  loadIllustrationOverrides,
  saveIllustrationOverrides,
  type IllustrationOverrides,
} from "../lib/illustrations";
import { loadPlatformStats, type PlatformStats } from "../lib/platformStats";
import { useSession } from "../lib/session";

type AdminTab = "overview" | "missions" | "illustrations" | "admins";

const emptyCustomForm = { label: "", blurb: "", imageUrl: "" };

export function AdminSpaceScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { role, teacher, logout, backend } = useSession();
  const tabParam = searchParams.get("tab");
  const tab: AdminTab =
    tabParam === "missions" ||
    tabParam === "illustrations" ||
    tabParam === "admins" ||
    tabParam === "overview"
      ? tabParam
      : "overview";

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [missionCount, setMissionCount] = useState(0);
  const [adminEmails, setAdminEmails] = useState<string[]>(() => readAdminEmails());
  const [newAdmin, setNewAdmin] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");
  const [overrides, setOverrides] = useState<IllustrationOverrides>(() => loadIllustrationOverrides());
  const [illustMessage, setIllustMessage] = useState("");
  const [customItems, setCustomItems] = useState<CustomIllustration[]>(() => loadCustomIllustrations());
  const [customForm, setCustomForm] = useState(emptyCustomForm);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [customError, setCustomError] = useState("");
  const [previewPose, setPreviewPose] = useState<"guide" | "applaudit" | "pouce" | "a06">("applaudit");
  const [previewUniverse, setPreviewUniverse] = useState<"football" | "rugby" | "equitation" | "espace">(
    "football",
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof ILLUSTRATION_FIELDS>();
    for (const field of ILLUSTRATION_FIELDS) {
      const list = map.get(field.group) ?? [];
      list.push(field);
      map.set(field.group, list);
    }
    return [...map.entries()];
  }, []);

  useEffect(() => {
    let cancelled = false;
    void listAdminCatalog().then((rows) => {
      if (cancelled) return;
      setMissionCount(rows.length);
      void loadPlatformStats(rows.length).then((next) => {
        if (!cancelled) setStats(next);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    function sync() {
      setCustomItems(loadCustomIllustrations());
    }
    window.addEventListener(CUSTOM_ILLUSTRATIONS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CUSTOM_ILLUSTRATIONS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (role !== "admin" || !teacher?.isAdmin) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  function setTab(next: AdminTab) {
    setSearchParams(next === "overview" ? {} : { tab: next });
  }

  function resetCustomForm() {
    setCustomForm(emptyCustomForm);
    setEditingCustomId(null);
    setCustomError("");
  }

  function startEditCustom(item: CustomIllustration) {
    setEditingCustomId(item.id);
    setCustomForm({ label: item.label, blurb: item.blurb, imageUrl: item.imageUrl });
    setCustomError("");
    setCustomMessage("");
  }

  function saveCustomForm() {
    try {
      upsertCustomIllustration(customForm, editingCustomId ?? undefined);
      setCustomItems(loadCustomIllustrations());
      setCustomMessage(editingCustomId ? "Illustration mise à jour." : "Illustration créée.");
      resetCustomForm();
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : "Enregistrement impossible.");
      setCustomMessage("");
    }
  }

  function readImageFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCustomError("Choisis un fichier image (PNG, JPG, WebP…).");
      return;
    }
    if (file.size > 2_500_000) {
      setCustomError("Image trop lourde (max. 2,5 Mo). Compresse-la ou utilise une URL.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setCustomError("Lecture du fichier impossible.");
        return;
      }
      setCustomForm((current) => ({ ...current, imageUrl: result }));
      setCustomError("");
    };
    reader.onerror = () => setCustomError("Lecture du fichier impossible.");
    reader.readAsDataURL(file);
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Administration" homeTo="/espace-admin">
      <section className="admin-space">
        <header className="admin-head">
          <div>
            <p className="pilot-eyebrow">Administration</p>
            <h1>Espace admin</h1>
            <p className="lead" data-listen>
              Gère les missions, crée des illustrations, gère les comptes admin et suis l’usage de la plateforme.
            </p>
          </div>
          <div className="admin-head-actions">
            <span className="admin-email">{teacher.email}</span>
            <Button
              type="button"
              onClick={() => {
                void logout().then(() => navigate("/"));
              }}
            >
              Déconnexion
            </Button>
          </div>
        </header>

        <nav className="admin-tabs" aria-label="Sections administration">
          {(
            [
              ["overview", "Vue d’ensemble"],
              ["missions", "Missions"],
              ["illustrations", "Illustrations"],
              ["admins", "Admins"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={tab === id ? "is-selected" : ""}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "overview" ? (
          <div className="admin-panel">
            <h2>Utilisation de la plateforme</h2>
            <p className="field-help">
              Indicateurs globaux ({stats?.backend ?? backend}
              ).
            </p>
            <div className="admin-stats">
              <div className="admin-stat">
                <strong>{stats?.teachers ?? "…"}</strong>
                <span>Enseignants</span>
              </div>
              <div className="admin-stat">
                <strong>{stats?.classes ?? "…"}</strong>
                <span>Classes</span>
              </div>
              <div className="admin-stat">
                <strong>{stats?.students ?? "…"}</strong>
                <span>Élèves</span>
              </div>
              <div className="admin-stat">
                <strong>{stats?.childSessions ?? "…"}</strong>
                <span>Sessions jouées</span>
              </div>
              <div className="admin-stat">
                <strong>{stats?.missionsCompleted ?? "…"}</strong>
                <span>Missions réussies</span>
              </div>
              <div className="admin-stat">
                <strong>{stats?.liveSessionsOpen ?? "…"}</strong>
                <span>Sessions live ouvertes</span>
              </div>
              <div className="admin-stat">
                <strong>{missionCount || stats?.catalogMissions || "…"}</strong>
                <span>Missions catalogue</span>
              </div>
            </div>
            <div className="admin-quick">
              <Button variant="primary" type="button" onClick={() => navigate("/espace-admin/missions")}>
                Gérer les missions
              </Button>
              <Button type="button" onClick={() => setTab("illustrations")}>
                Modifier les illustrations
              </Button>
            </div>
          </div>
        ) : null}

        {tab === "missions" ? (
          <div className="admin-panel">
            <h2>Missions</h2>
            <p className="lead">
              Liste complète des missions officielles et créées : créer, modifier, publier.
            </p>
            <div className="admin-quick">
              <Button variant="primary" type="button" onClick={() => navigate("/espace-admin/missions")}>
                Ouvrir le catalogue missions
              </Button>
              <Button type="button" onClick={() => navigate("/espace-admin/missions?new=1")}>
                Créer une mission
              </Button>
            </div>
            <p className="field-help">{missionCount} mission{missionCount > 1 ? "s" : ""} au catalogue.</p>
          </div>
        ) : null}

        {tab === "illustrations" ? (
          <div className="admin-panel">
            <h2>Créer des illustrations</h2>
            <p className="lead">
              Ajoute des images personnalisées (URL ou fichier). Elles apparaissent ensuite dans le
              sélecteur d’illustration de chaque étape de mission.
            </p>

            <form
              className="admin-custom-form"
              onSubmit={(event) => {
                event.preventDefault();
                saveCustomForm();
              }}
            >
              <div className="field">
                <label htmlFor="custom-illust-label">Nom</label>
                <input
                  id="custom-illust-label"
                  type="text"
                  value={customForm.label}
                  onChange={(event) =>
                    setCustomForm((current) => ({ ...current, label: event.target.value }))
                  }
                  placeholder="Ex. Partage de pizza"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="custom-illust-blurb">Description courte</label>
                <input
                  id="custom-illust-blurb"
                  type="text"
                  value={customForm.blurb}
                  onChange={(event) =>
                    setCustomForm((current) => ({ ...current, blurb: event.target.value }))
                  }
                  placeholder="Affichée dans le créateur de missions"
                />
              </div>
              <div className="field">
                <label htmlFor="custom-illust-url">URL de l’image</label>
                <input
                  id="custom-illust-url"
                  type="text"
                  value={customForm.imageUrl.startsWith("data:") ? "" : customForm.imageUrl}
                  onChange={(event) =>
                    setCustomForm((current) => ({ ...current, imageUrl: event.target.value }))
                  }
                  placeholder="/images/ma-scene.webp ou https://…"
                />
                <small className="field-help">
                  {customForm.imageUrl.startsWith("data:")
                    ? "Fichier local chargé (data URL)."
                    : "Chemin local du site ou lien HTTPS."}
                </small>
              </div>
              <div className="field">
                <label htmlFor="custom-illust-file">Ou importer un fichier</label>
                <input
                  id="custom-illust-file"
                  type="file"
                  accept="image/*"
                  onChange={(event) => readImageFile(event.target.files?.[0] ?? null)}
                />
              </div>
              {customForm.imageUrl ? (
                <div className="admin-custom-thumb-wrap" aria-hidden={!customForm.imageUrl}>
                  <img
                    className="admin-custom-thumb"
                    src={customForm.imageUrl}
                    alt=""
                  />
                </div>
              ) : null}
              <div className="actions">
                <Button variant="primary" type="submit">
                  {editingCustomId ? "Mettre à jour" : "Créer l’illustration"}
                </Button>
                {editingCustomId ? (
                  <Button type="button" onClick={resetCustomForm}>
                    Annuler
                  </Button>
                ) : null}
              </div>
            </form>
            {customError ? <p className="error">{customError}</p> : null}
            {customMessage ? <p className="feedback ok">{customMessage}</p> : null}

            <section className="admin-custom-list" aria-label="Illustrations personnalisées">
              <h3>Tes illustrations ({customItems.length})</h3>
              {customItems.length === 0 ? (
                <p className="field-help">Aucune illustration personnalisée pour l’instant.</p>
              ) : (
                <ul className="admin-custom-cards">
                  {customItems.map((item) => (
                    <li key={item.id}>
                      <img src={item.imageUrl} alt="" className="admin-custom-thumb" />
                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.blurb || "Illustration personnalisée"}</p>
                        <small>
                          Clé scène : <code>{customSceneKey(item.id)}</code>
                        </small>
                      </div>
                      <div className="admin-custom-actions">
                        <Button type="button" onClick={() => startEditCustom(item)}>
                          Modifier
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (!window.confirm(`Supprimer « ${item.label} » ?`)) return;
                            deleteCustomIllustration(item.id);
                            setCustomItems(loadCustomIllustrations());
                            if (editingCustomId === item.id) resetCustomForm();
                            setCustomMessage("Illustration supprimée.");
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <h2>Assets Néo & univers</h2>
            <p className="lead">
              Remplace les images de Néo et des univers (y compris les sprites qui bougent). Laisse vide pour
              l’asset par défaut.
            </p>
            <div className="admin-illust-preview">
              <div className="admin-illust-controls">
                <label>
                  Aperçu pose
                  <select
                    value={previewPose}
                    onChange={(event) =>
                      setPreviewPose(event.target.value as typeof previewPose)
                    }
                  >
                    <option value="guide">Guide</option>
                    <option value="applaudit">Applaudit (animé)</option>
                    <option value="pouce">Pouce</option>
                    <option value="a06">Corps + bras (animé)</option>
                  </select>
                </label>
                <label>
                  Univers
                  <select
                    value={previewUniverse}
                    onChange={(event) =>
                      setPreviewUniverse(event.target.value as typeof previewUniverse)
                    }
                  >
                    <option value="football">Football</option>
                    <option value="rugby">Rugby</option>
                    <option value="equitation">Équitation</option>
                    <option value="espace">Espace</option>
                  </select>
                </label>
              </div>
              <div className="admin-illust-stage">
                <Neo
                  pose={previewPose}
                  universe={previewUniverse}
                  className={previewPose === "a06" ? "" : "neo-small"}
                />
              </div>
            </div>
            {groups.map(([group, fields]) => (
              <section key={group} className="admin-illust-group">
                <h3>{group}</h3>
                <div className="admin-illust-grid">
                  {fields.map((field) => (
                    <div className="field" key={field.key}>
                      <label htmlFor={`illust-${field.key}`}>{field.label}</label>
                      <input
                        id={`illust-${field.key}`}
                        type="text"
                        placeholder={field.defaultSrc}
                        value={overrides[field.key] ?? ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setOverrides((current) => {
                            const next = { ...current };
                            if (!value.trim()) delete next[field.key];
                            else next[field.key] = value;
                            return next;
                          });
                        }}
                      />
                      <small className="field-help">Défaut : {field.defaultSrc}</small>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <div className="actions">
              <Button
                variant="primary"
                type="button"
                onClick={() => {
                  saveIllustrationOverrides(overrides);
                  setIllustMessage("Illustrations enregistrées.");
                }}
              >
                Enregistrer
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setOverrides({});
                  saveIllustrationOverrides({});
                  setIllustMessage("Illustrations réinitialisées.");
                }}
              >
                Réinitialiser
              </Button>
            </div>
            {illustMessage ? <p className="feedback ok">{illustMessage}</p> : null}
          </div>
        ) : null}

        {tab === "admins" ? (
          <div className="admin-panel">
            <h2>Comptes administrateurs</h2>
            <p className="lead">
              Les e-mails listés ici ouvrent l’espace admin à la connexion enseignant.{" "}
              <code>{SEED_ADMIN_EMAILS[0]}</code> est toujours admin.
            </p>
            <ul className="admin-email-list">
              {adminEmails.map((email) => {
                const locked = SEED_ADMIN_EMAILS.some((item) => item.toLowerCase() === email);
                return (
                  <li key={email}>
                    <strong>{email}</strong>
                    {locked ? <span className="pilot-hand-badge">référence</span> : null}
                    {!locked ? (
                      <button
                        type="button"
                        className="pilot-kick"
                        onClick={() => {
                          const result = removeAdminEmail(email);
                          if (!result.ok) {
                            setAdminError(result.error);
                            return;
                          }
                          setAdminEmails(readAdminEmails());
                          setAdminMessage("Administrateur retiré.");
                          setAdminError("");
                        }}
                      >
                        Retirer
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <form
              className="admin-add-admin"
              onSubmit={(event) => {
                event.preventDefault();
                const result = addAdminEmail(newAdmin);
                if (!result.ok) {
                  setAdminError(result.error);
                  setAdminMessage("");
                  return;
                }
                setAdminEmails(readAdminEmails());
                setNewAdmin("");
                setAdminMessage("Administrateur ajouté.");
                setAdminError("");
              }}
            >
              <div className="field">
                <label htmlFor="new-admin">Ajouter un e-mail admin</label>
                <input
                  id="new-admin"
                  type="email"
                  value={newAdmin}
                  onChange={(event) => setNewAdmin(event.target.value)}
                  placeholder="prenom.nom@ecole.fr"
                />
              </div>
              <Button variant="primary" type="submit">
                Ajouter
              </Button>
            </form>
            {adminError ? <p className="error">{adminError}</p> : null}
            {adminMessage ? <p className="feedback ok">{adminMessage}</p> : null}
            <p className="field-help">
              Astuce : un admin peut aussi ouvrir l’{" "}
              <Link to="/espace-professeur">espace professeur</Link> pour tester une classe.
            </p>
          </div>
        ) : null}
      </section>
    </Shell>
  );
}
