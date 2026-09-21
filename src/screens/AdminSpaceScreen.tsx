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
  ILLUSTRATION_FIELDS,
  loadIllustrationOverrides,
  saveIllustrationOverrides,
  type IllustrationOverrides,
} from "../lib/illustrations";
import { loadPlatformStats, type PlatformStats } from "../lib/platformStats";
import { useSession } from "../lib/session";

type AdminTab = "overview" | "missions" | "illustrations" | "admins";

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

  if (role !== "admin" || !teacher?.isAdmin) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  function setTab(next: AdminTab) {
    setSearchParams(next === "overview" ? {} : { tab: next });
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Administration" homeTo="/espace-admin">
      <section className="admin-space">
        <header className="admin-head">
          <div>
            <p className="pilot-eyebrow">Administration</p>
            <h1>Espace admin</h1>
            <p className="lead" data-listen>
              Gère les missions, les illustrations animées, les comptes admin et suis l’usage de la plateforme.
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
            <h2>Illustrations animées</h2>
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
