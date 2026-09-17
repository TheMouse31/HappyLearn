import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { GRADES, SUBJECTS, gradeLabel, subjectLabel } from "../data/catalog";
import { listMissions } from "../data/missions";
import type { GradeLevel, PlayMode, SubjectSlug, UniverseSlug } from "../data/types";
import { formatStudentName } from "../data/types";
import { UNIVERSES } from "../data/universes";
import { useSession } from "../lib/session";

const UNIVERSE_OPTIONS = Object.values(UNIVERSES);

export function SessionControlScreen() {
  const navigate = useNavigate();
  const {
    role,
    teacher,
    backend,
    classes,
    activeClassId,
    liveSession,
    liveParticipants,
    launchClassSession,
    endClassSession,
    refreshLiveSession,
    setClassActivity,
    kick,
    listClassMissionsDone,
  } = useSession();

  const current = classes.find((item) => item.id === activeClassId) ?? classes[0] ?? null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [doneMissions, setDoneMissions] = useState<string[]>([]);
  const [grade, setGrade] = useState<GradeLevel>("cm2");
  const [subject, setSubject] = useState<SubjectSlug>("maths");
  const [missionId, setMissionId] = useState("cm2-maths-fractions-01");
  const [universe, setUniverse] = useState<UniverseSlug>("football");
  const [mode, setMode] = useState<PlayMode>("qcm");

  const missions = useMemo(() => listMissions(grade, subject), [grade, subject]);

  useEffect(() => {
    void refreshLiveSession();
  }, [current?.id, refreshLiveSession]);

  useEffect(() => {
    if (!current) {
      setDoneMissions([]);
      return;
    }
    let cancelled = false;
    void listClassMissionsDone(current.id).then((ids) => {
      if (!cancelled) setDoneMissions(ids);
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id, listClassMissionsDone, liveSession?.missionId]);

  useEffect(() => {
    if (missions.length === 0) return;
    if (!missions.some((item) => item.id === missionId)) {
      setMissionId(missions[0]!.id);
    }
  }, [missions, missionId]);

  if (role !== "enseignant" || !teacher) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  const connected = liveParticipants.filter((item) => item.statut === "connecte");
  const activityActive = Boolean(liveSession?.missionId);

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Session live"
      homeTo="/espace-professeur"
      backTo="/espace-professeur"
    >
      <section className="teacher-space session-control">
        <span className="kicker">Pilotage de session</span>
        <h1>Session de classe</h1>
        <p className="lead" data-listen>
          Lance une session pour {current?.nom ?? "ta classe"} : un nouveau code à chaque démarrage. Les élèves
          rejoignent, tu lances les missions, tu vois qui est connecté.
        </p>

        {backend === "local" ? (
          <div className="teacher-banner" role="status">
            <strong>Mode local :</strong> les fonctions live (verrou entre appareils, présence temps réel, exclusion)
            nécessitent Supabase. Sur cet appareil, tu peux tout de même tester le flux de base.
          </div>
        ) : null}

        {!current ? (
          <p>Crée d’abord une classe dans l’espace professeur.</p>
        ) : (
          <>
            <div className="actions" style={{ marginBottom: "1rem" }}>
              <Button
                variant="primary"
                type="button"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  setError("");
                  void launchClassSession(current.id)
                    .then((created) => {
                      if (!created) setError("Impossible de lancer la session.");
                    })
                    .finally(() => setBusy(false));
                }}
              >
                {liveSession ? "Relancer une nouvelle session" : "Lancer une session"}
              </Button>
              {liveSession ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    void endClassSession().finally(() => setBusy(false));
                  }}
                >
                  Terminer la session
                </Button>
              ) : null}
              <Button type="button" onClick={() => navigate("/espace-professeur")}>
                Retour à la classe
              </Button>
            </div>
            {error ? <p className="error">{error}</p> : null}

            {liveSession ? (
              <>
                <div className="code-hero" aria-label="Code de session">
                  <span>Code de session · {current.nom}</span>
                  <strong>{liveSession.code}</strong>
                  <div className="actions">
                    <Button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(liveSession.code).then(() => {
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                    >
                      {copied ? "Code copié" : "Copier le code"}
                    </Button>
                  </div>
                </div>

                <section className="roster-panel" aria-label="Élèves connectés">
                  <h2>
                    Élèves connectés ({connected.length}/{liveParticipants.length})
                  </h2>
                  {liveParticipants.length === 0 ? (
                    <p className="field-help">En attente des élèves… Partage le code ci-dessus.</p>
                  ) : (
                    <ul className="roster-list">
                      {liveParticipants.map((participant) => (
                        <li key={participant.id}>
                          <div className="roster-row">
                            <strong>
                              {formatStudentName(participant.prenom, participant.nom)}
                              <span className="field-help" style={{ marginLeft: "0.5rem" }}>
                                {participant.statut === "connecte" ? "· connecté" : "· déconnecté"}
                              </span>
                            </strong>
                            <div className="roster-row-actions">
                              <Button
                                type="button"
                                onClick={() => {
                                  const label = formatStudentName(participant.prenom, participant.nom);
                                  const ok = window.confirm(`Déconnecter ${label} ? Le nom redeviendra libre.`);
                                  if (!ok) return;
                                  void kick(participant.id);
                                }}
                              >
                                Déconnecter
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="roster-panel" aria-label="Lancer une activité">
                  <h2>Activité</h2>
                  <p className="field-help">
                    Les élèves en salle d’attente sont poussés dans la mission. Tu peux enchaîner plusieurs exercices
                    dans la même session.
                  </p>
                  <div className="activity-grid">
                    <div className="field">
                      <label htmlFor="act-niveau">Niveau</label>
                      <select
                        id="act-niveau"
                        value={grade}
                        onChange={(event) => setGrade(event.target.value as GradeLevel)}
                      >
                        {GRADES.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="act-matiere">Matière</label>
                      <select
                        id="act-matiere"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value as SubjectSlug)}
                      >
                        {SUBJECTS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="act-mission">Mission</label>
                      <select
                        id="act-mission"
                        value={missionId}
                        onChange={(event) => setMissionId(event.target.value)}
                      >
                        {missions.length === 0 ? (
                          <option value="">Aucune mission</option>
                        ) : (
                          missions.map((item) => (
                            <option key={item.id} value={item.id} disabled={!item.available}>
                              {item.title}
                              {doneMissions.includes(item.id) ? " · déjà faite" : ""}
                              {!item.available ? " · bientôt" : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="act-univers">Univers</label>
                      <select
                        id="act-univers"
                        value={universe}
                        onChange={(event) => setUniverse(event.target.value as UniverseSlug)}
                      >
                        {UNIVERSE_OPTIONS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="act-mode">Mode</label>
                      <select
                        id="act-mode"
                        value={mode}
                        onChange={(event) => setMode(event.target.value as PlayMode)}
                      >
                        <option value="qcm">QCM</option>
                        <option value="cahier">Cahier</option>
                      </select>
                    </div>
                  </div>
                  <div className="actions">
                    <Button
                      variant="primary"
                      type="button"
                      disabled={busy || missions.length === 0 || !missions.some((m) => m.id === missionId && m.available)}
                      onClick={() => {
                        setBusy(true);
                        void setClassActivity({
                          niveau: grade,
                          matiere: subject,
                          missionId,
                          univers: universe,
                          mode,
                        })
                          .then(() => listClassMissionsDone(current.id).then(setDoneMissions))
                          .finally(() => setBusy(false));
                      }}
                    >
                      {activityActive ? "Changer / relancer l’activité" : "Lancer l’activité"}
                    </Button>
                    {activityActive ? (
                      <Button
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setBusy(true);
                          void setClassActivity(null).finally(() => setBusy(false));
                        }}
                      >
                        Arrêter l’activité (salle d’attente)
                      </Button>
                    ) : null}
                  </div>
                  {activityActive && liveSession ? (
                    <p className="field-help">
                      En cours : {gradeLabel(liveSession.niveau)} · {subjectLabel(liveSession.matiere)} ·{" "}
                      {listMissions().find((item) => item.id === liveSession.missionId)?.title ??
                        liveSession.missionId}
                    </p>
                  ) : null}
                </section>
              </>
            ) : (
              <p className="field-help">Aucune session ouverte. Clique sur « Lancer une session » pour générer un code.</p>
            )}
          </>
        )}
      </section>
    </Shell>
  );
}
