/**
 * Hub admin (`/espace-admin`) : stats, entrée studio missions,
 * bibliothèque d’illustrations (étapes + overrides Néo), comptes admin.
 * Onglet via `?tab=` (overview | missions | illustrations | admins).
 */
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, Image, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "../components/Button";
import { HubTiles } from "../components/HubTiles";
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
import type { Abonnement } from "../data/types";
import {
  ensureFoyer,
  findUserIdByEmail,
  listAbonnementsAdmin,
  upsertAbonnement,
} from "../lib/familyStore";
import { abonnementLabel } from "../lib/subscription";
import { StatusBadge, abonnementTone } from "../components/StatusBadge";
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
import { isMediaVideoUrl } from "../lib/mediaStorage";
import { loadPlatformStats, type PlatformStats } from "../lib/platformStats";
import { useSession } from "../lib/session";

type AdminTab = "overview" | "missions" | "illustrations" | "admins" | "abonnements";
/** Sous-onglets du studio visuel : bibliothèque d’étapes vs sprites Néo. */
type IllustStudio = "library" | "characters";

export function AdminSpaceScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { role, teacher, backend } = useSession();
  const tabParam = searchParams.get("tab");
  const tab: AdminTab =
    tabParam === "missions" ||
    tabParam === "illustrations" ||
    tabParam === "admins" ||
    tabParam === "abonnements" ||
    tabParam === "overview"
      ? tabParam
      : "overview";

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [missionCount, setMissionCount] = useState(0);
  const [adminEmails, setAdminEmails] = useState<string[]>(() => readAdminEmails());
  const [newAdmin, setNewAdmin] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");
  const [grantEmail, setGrantEmail] = useState("");
  const [grantDays, setGrantDays] = useState("365");
  const [grantNote, setGrantNote] = useState("");
  const [grantSubject, setGrantSubject] = useState<"enseignant" | "foyer">("enseignant");
  const [grantMessage, setGrantMessage] = useState("");
  const [grantError, setGrantError] = useState("");
  const [grants, setGrants] = useState<Abonnement[]>([]);
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

  useEffect(() => {
    if (tab !== "abonnements") return;
    void listAbonnementsAdmin().then(setGrants);
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
        <HubTiles
          title="Tableau de bord"
          lead="Raccourcis vers les outils d’administration Happy Learn."
          tiles={[
            {
              to: "/espace-admin?tab=overview",
              label: "Vue d’ensemble",
              description: "Stats et activité",
              icon: Sparkles,
            },
            {
              to: "/espace-admin?tab=missions",
              label: "Missions",
              description: "Studio pédagogique",
              icon: Shield,
            },
            {
              to: "/espace-admin?tab=illustrations",
              label: "Illustrations",
              description: "Bibliothèque visuelle",
              icon: Image,
            },
            {
              to: "/espace-admin?tab=admins",
              label: "Admins",
              description: "Comptes administrateurs",
              icon: Users,
            },
            {
              to: "/espace-admin?tab=abonnements",
              label: "Abonnements",
              description: "Grants Premium",
              icon: CreditCard,
            },
            {
              to: "/espace-professeur",
              label: "Espace enseignant",
              description: "Même compte, autre portail",
              icon: Users,
            },
          ]}
        />
        <header className="admin-head space-hub-header">
          <div>
            <p className="pilot-eyebrow">Administration</p>
            <h1>Espace admin</h1>
            <p className="lead" data-listen>
              Gère les missions, crée des illustrations, gère les comptes admin et suis l’usage de la plateforme.
            </p>
          </div>
          <div className="admin-head-actions">
            <span className="admin-email">{teacher.email}</span>
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
              ["abonnements", "Abonnements"],
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
                            {isMediaVideoUrl(item.imageUrl) ? (
                              <video src={item.imageUrl} muted playsInline preload="metadata" />
                            ) : (
                              <img src={item.imageUrl} alt="" />
                            )}
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
              {SEED_ADMIN_EMAILS.join(", ")} {SEED_ADMIN_EMAILS.length > 1 ? "sont" : "est"} toujours admin.
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

        {tab === "abonnements" ? (
          <div className="admin-panel">
            <h2>Accorder le Premium</h2>
            <p className="lead">
              Offre ou prolonge un abonnement sans Stripe (enseignant ou foyer parent).
            </p>
            <form
              className="login-form"
              onSubmit={(event) => {
                event.preventDefault();
                setGrantError("");
                setGrantMessage("");
                void (async () => {
                  const found = await findUserIdByEmail(grantEmail);
                  if (!found) {
                    setGrantError(
                      "Utilisateur introuvable. Il doit s’être connecté au moins une fois (profil créé).",
                    );
                    return;
                  }
                  let subjectId = found.id;
                  let subjectType: "enseignant" | "foyer" = grantSubject;
                  if (grantSubject === "foyer") {
                    if (found.role !== "parent") {
                      setGrantError("Cet e-mail n’est pas un compte parent.");
                      return;
                    }
                    const foyer = await ensureFoyer(found.id);
                    subjectId = foyer.id;
                    subjectType = "foyer";
                  } else if (found.role === "parent") {
                    setGrantError("Compte parent : choisis le sujet « Foyer ».");
                    return;
                  }
                  const days = Math.max(1, Number(grantDays) || 365);
                  const end = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();
                  await upsertAbonnement({
                    subjectType,
                    subjectId,
                    source: "admin_grant",
                    status: "active",
                    currentPeriodEnd: end,
                    grantedBy: teacher?.id ?? null,
                    grantedNote: grantNote.trim() || `Grant ${days}j`,
                  });
                  setGrantMessage(`Premium accordé jusqu’au ${new Date(end).toLocaleDateString("fr-FR")}.`);
                  setGrants(await listAbonnementsAdmin());
                })();
              }}
            >
              <div className="field">
                <label htmlFor="grant-email">E-mail du compte</label>
                <input
                  id="grant-email"
                  type="email"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="grant-subject">Sujet</label>
                <select
                  id="grant-subject"
                  value={grantSubject}
                  onChange={(e) => setGrantSubject(e.target.value as "enseignant" | "foyer")}
                >
                  <option value="enseignant">Enseignant</option>
                  <option value="foyer">Foyer (parent)</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="grant-days">Durée (jours)</label>
                <input
                  id="grant-days"
                  type="number"
                  min={1}
                  value={grantDays}
                  onChange={(e) => setGrantDays(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="grant-note">Note</label>
                <input
                  id="grant-note"
                  value={grantNote}
                  onChange={(e) => setGrantNote(e.target.value)}
                  placeholder="Offre partenaire, démo…"
                />
              </div>
              <Button variant="primary" type="submit">
                Accorder Premium
              </Button>
            </form>
            {grantError ? <p className="error">{grantError}</p> : null}
            {grantMessage ? <p className="feedback ok">{grantMessage}</p> : null}
            <h3>Abonnements récents</h3>
            <ul className="admin-email-list">
              {grants.map((g) => (
                <li key={g.id} className="admin-grant-row">
                  <strong>
                    {g.subjectType} · {g.subjectId.slice(0, 8)}…
                  </strong>{" "}
                  <StatusBadge tone={abonnementTone(g)} icon={abonnementTone(g) === "premium" ? "✦" : undefined}>
                    {abonnementLabel(g)}
                  </StatusBadge>
                  {g.currentPeriodEnd
                    ? ` · jusqu’au ${new Date(g.currentPeriodEnd).toLocaleDateString("fr-FR")}`
                    : ""}
                  {g.source === "admin_grant" ? (
                    <StatusBadge tone="info">Grant</StatusBadge>
                  ) : (
                    <StatusBadge tone="neutral">{g.source}</StatusBadge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </Shell>
  );
}
