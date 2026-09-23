/**
 * Hub admin (`/espace-admin`) : stats, entrée studio missions,
 * bibliothèque d’illustrations (étapes + overrides Néo), comptes admin.
 * Onglet via `?tab=` (overview | missions | illustrations | admins).
 */
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import {
  EMPTY_ILLUSTRATION_FORM,
  IllustrationCreatePanel,
  type IllustrationFormState,
} from "../components/IllustrationCreatePanel";
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
  deleteCustomIllustration,
  fetchCustomIllustrations,
  loadCustomIllustrations,
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
/** Sous-onglets du studio visuel : bibliothèque d’étapes vs sprites Néo. */
type IllustStudio = "library" | "characters";

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
  const [customForm, setCustomForm] = useState<IllustrationFormState>(EMPTY_ILLUSTRATION_FORM);
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [illustStudio, setIllustStudio] = useState<IllustStudio>("library");
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

  // Resync si une illustration est créée depuis le studio missions (même onglet ou autre).
  useEffect(() => {
    function sync() {
      setCustomItems(loadCustomIllustrations());
    }
    void fetchCustomIllustrations().then(setCustomItems);
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
    // overview = URL propre sans query.
    setSearchParams(next === "overview" ? {} : { tab: next });
  }

  function resetCustomForm() {
    setCustomForm(EMPTY_ILLUSTRATION_FORM);
    setEditingCustomId(null);
    setShowCreatePanel(false);
  }

  function startEditCustom(item: CustomIllustration) {
    setEditingCustomId(item.id);
    setCustomForm({ label: item.label, blurb: item.blurb, imageUrl: item.imageUrl });
    setShowCreatePanel(true);
    setCustomMessage("");
    setIllustStudio("library");
  }

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Administration"
      homeTo="/espace-admin"
      backTo={tab === "overview" ? "/" : undefined}
      onBack={
        tab === "overview"
          ? undefined
          : () => {
              setTab("overview");
            }
      }
    >
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

        {/* Navigation principale : l’état vit dans l’URL (?tab=). */}
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
                Bibliothèque d’illustrations
              </Button>
              <Button type="button" onClick={() => navigate("/espace-professeur/session")}>
                Piloter une session live
              </Button>
              <Button type="button" onClick={() => navigate("/espace-professeur")}>
                Espace professeur
              </Button>
            </div>
          </div>
        ) : null}

        {/* Entrée vers MissionEditorScreen (/espace-admin/missions). */}
        {tab === "missions" ? (
          <div className="admin-panel">
            <h2>Studio missions</h2>
            <p className="lead">
              Catalogue, création et publication des parcours — avec aperçu élève et illustrations
              d’étapes.
            </p>
            <div className="admin-quick">
              <Button variant="primary" type="button" onClick={() => navigate("/espace-admin/missions")}>
                Ouvrir le studio
              </Button>
              <Button type="button" onClick={() => navigate("/espace-admin/missions?new=1")}>
                Nouvelle mission
              </Button>
            </div>
            <p className="field-help">{missionCount} mission{missionCount > 1 ? "s" : ""} au catalogue.</p>
          </div>
        ) : null}

        {/* Studio illustrations : bibliothèque perso (custom:) + overrides personnages. */}
        {tab === "illustrations" ? (
          <div className="admin-panel illust-studio">
            <header className="illust-studio-hero">
              <div>
                <p className="pilot-eyebrow">Studio visuel</p>
                <h2>Illustrations</h2>
                <p className="lead">
                  La bibliothèque alimente les étapes de mission. Les personnages Néo se gèrent à part.
                </p>
              </div>
              <nav className="illust-studio-tabs" aria-label="Type d’illustrations">
                <button
                  type="button"
                  className={illustStudio === "library" ? "is-selected" : ""}
                  onClick={() => setIllustStudio("library")}
                >
                  Bibliothèque d’étapes
                </button>
                <button
                  type="button"
                  className={illustStudio === "characters" ? "is-selected" : ""}
                  onClick={() => setIllustStudio("characters")}
                >
                  Personnages Néo
                </button>
              </nav>
            </header>

            {illustStudio === "library" ? (
              <div className="illust-library">
                <div className="illust-library-toolbar">
                  <p>
                    {customItems.length} illustration{customItems.length > 1 ? "s" : ""} disponible
                    {customItems.length > 1 ? "s" : ""} pour les étapes
                  </p>
                  <div className="actions">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        setEditingCustomId(null);
                        setCustomForm(EMPTY_ILLUSTRATION_FORM);
                        setShowCreatePanel(true);
                        setCustomMessage("");
                      }}
                    >
                      Nouvelle illustration
                    </Button>
                    <Button type="button" onClick={() => navigate("/espace-admin/missions")}>
                      Ouvrir le studio missions
                    </Button>
                  </div>
                </div>

                {showCreatePanel ? (
                  <div className="illust-library-editor">
                    <h3>{editingCustomId ? "Modifier l’illustration" : "Ajouter une illustration"}</h3>
                    <IllustrationCreatePanel
                      form={customForm}
                      onChange={setCustomForm}
                      editingId={editingCustomId}
                      onCancel={resetCustomForm}
                      onSaved={(item) => {
                        setCustomItems(loadCustomIllustrations());
                        setCustomMessage(
                          editingCustomId
                            ? `« ${item.label} » mise à jour.`
                            : `« ${item.label} » ajoutée à la bibliothèque.`,
                        );
                        resetCustomForm();
                      }}
                    />
                  </div>
                ) : null}
                {customMessage ? <p className="feedback ok">{customMessage}</p> : null}

                {customItems.length === 0 && !showCreatePanel ? (
                  <div className="illust-library-empty">
                    <h3>Aucune illustration encore</h3>
                    <p>
                      Ajoute une image (URL ou fichier) : elle apparaîtra dans le sélecteur d’étape du
                      studio missions.
                    </p>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        setShowCreatePanel(true);
                        setCustomForm(EMPTY_ILLUSTRATION_FORM);
                      }}
                    >
                      Créer la première
                    </Button>
                  </div>
                ) : (
                  <ul className="illust-library-grid">
                    {customItems.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="illust-library-card"
                          onClick={() => startEditCustom(item)}
                        >
                          <span className="illust-library-thumb">
                            <img src={item.imageUrl} alt="" />
                          </span>
                          <span className="illust-library-meta">
                            <strong>{item.label}</strong>
                            <span>{item.blurb || "Illustration d’étape"}</span>
                          </span>
                        </button>
                        <div className="illust-library-card-actions">
                          <Button type="button" onClick={() => startEditCustom(item)}>
                            Modifier
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              if (!window.confirm(`Supprimer « ${item.label} » ?`)) return;
                              void deleteCustomIllustration(item.id).then(() => {
                                setCustomItems(loadCustomIllustrations());
                                if (editingCustomId === item.id) resetCustomForm();
                                setCustomMessage("Illustration supprimée.");
                              });
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="illust-characters">
                <p className="lead">
                  Remplace les images de Néo et des univers (sprites animés inclus). Laisse vide pour
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
                      setIllustMessage("Personnages enregistrés.");
                    }}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setOverrides({});
                      saveIllustrationOverrides({});
                      setIllustMessage("Personnages réinitialisés.");
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
                {illustMessage ? <p className="feedback ok">{illustMessage}</p> : null}
              </div>
            )}
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
              Astuce : un admin peut ouvrir l’{" "}
              <Link to="/espace-professeur">espace professeur</Link> ou{" "}
              <Link to="/espace-professeur/session">piloter une session live</Link> pour tester une
              classe.
            </p>
          </div>
        ) : null}
      </section>
    </Shell>
  );
}
