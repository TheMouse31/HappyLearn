import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { GRADES, SUBJECTS, gradeLabel, subjectLabel } from "../data/catalog";
import { listResolvedMissions } from "../data/missions";
import type { ClassStudent, GradeLevel, MissionDef, PlayMode, SubjectSlug } from "../data/types";
import { formatStudentName } from "../data/types";
import { useSession } from "../lib/session";

type PresenceStatus = "connecte" | "deconnecte" | "absent";

function presenceLabel(status: PresenceStatus): string {
  if (status === "connecte") return "connecté";
  if (status === "deconnecte") return "déconnecté";
  return "pas encore connecté";
}

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
    listClassStudents,
  } = useSession();

  const current = classes.find((item) => item.id === activeClassId) ?? classes[0] ?? null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [doneMissions, setDoneMissions] = useState<string[]>([]);
  const [roster, setRoster] = useState<ClassStudent[]>([]);
  const [rosterReady, setRosterReady] = useState(false);
  const [grade, setGrade] = useState<GradeLevel>("cm2");
  const [subject, setSubject] = useState<SubjectSlug>("maths");
  const [missionId, setMissionId] = useState("cm2-maths-fractions-01");
  const [mode, setMode] = useState<PlayMode>("qcm");
  const [missions, setMissions] = useState<MissionDef[]>([]);
  const [activeMissionTitle, setActiveMissionTitle] = useState<string | null>(null);

  const refreshLiveSessionRef = useRef(refreshLiveSession);
  const listClassMissionsDoneRef = useRef(listClassMissionsDone);
  const listClassStudentsRef = useRef(listClassStudents);
  refreshLiveSessionRef.current = refreshLiveSession;
  listClassMissionsDoneRef.current = listClassMissionsDone;
  listClassStudentsRef.current = listClassStudents;

  useEffect(() => {
    let cancelled = false;
    void listResolvedMissions(grade, subject).then((rows) => {
      if (!cancelled) setMissions(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [grade, subject]);

  useEffect(() => {
    const id = liveSession?.missionId;
    if (!id) {
      setActiveMissionTitle(null);
      return;
    }
    const local = missions.find((item) => item.id === id);
    if (local) {
      setActiveMissionTitle(local.title);
      return;
    }
    let cancelled = false;
    void listResolvedMissions().then((rows) => {
      if (cancelled) return;
      setActiveMissionTitle(rows.find((item) => item.id === id)?.title ?? id);
    });
    return () => {
      cancelled = true;
    };
  }, [liveSession?.missionId, missions]);

  // Ne dépend pas de l'identité de refreshLiveSession (sinon boucle de re-renders).
  useEffect(() => {
    void refreshLiveSessionRef.current();
  }, [current?.id]);

  useEffect(() => {
    if (!current) {
      setRoster([]);
      setRosterReady(true);
      return;
    }
    let cancelled = false;
    setRosterReady(false);
    void listClassStudentsRef.current(current.id).then((rows) => {
      if (cancelled) return;
      setRoster(rows);
      setRosterReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id]);

  useEffect(() => {
    if (!current) {
      setDoneMissions([]);
      return;
    }
    let cancelled = false;
    void listClassMissionsDoneRef.current(current.id).then((ids) => {
      if (!cancelled) setDoneMissions(ids);
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id, liveSession?.missionId]);

  useEffect(() => {
    if (missions.length === 0) return;
    if (!missions.some((item) => item.id === missionId)) {
      setMissionId(missions[0]!.id);
    }
  }, [missions, missionId]);

  const presenceRows = useMemo(() => {
    const byEleve = new Map(liveParticipants.map((item) => [item.eleveId, item]));
    return roster.map((student) => {
      const participant = byEleve.get(student.id) ?? null;
      const status: PresenceStatus = !participant
        ? "absent"
        : participant.statut === "connecte"
          ? "connecte"
          : "deconnecte";
      return { student, participant, status };
    });
  }, [roster, liveParticipants]);

  if (role !== "enseignant" || !teacher) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  const connectedCount = presenceRows.filter((row) => row.status === "connecte").length;
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
          rejoignent, tu lances les missions, tu vois qui est connecté. Chaque élève choisit ensuite son univers.
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

                <section className="roster-panel" aria-label="Présence des élèves">
                  <h2>
                    Élèves ({connectedCount}/{roster.length} connectés)
                  </h2>
                  <p className="field-help">
                    Liste complète de la classe avec le statut de connexion pour cette session.
                  </p>
                  {!rosterReady ? <p>Chargement de la liste…</p> : null}
                  {rosterReady && roster.length === 0 ? (
                    <p className="field-help">
                      Aucun élève dans la liste. Ajoute-les d’abord dans l’espace professeur.
                    </p>
                  ) : null}
                  {rosterReady && roster.length > 0 ? (
                    <ul className="roster-list">
                      {presenceRows.map(({ student, participant, status }) => (
                        <li key={student.id}>
                          <div className="roster-row">
                            <strong>
                              {formatStudentName(student.prenom, student.nom)}
                              <span
                                className={`presence-pill presence-${status}`}
                                style={{ marginLeft: "0.5rem" }}
                              >
                                {presenceLabel(status)}
                              </span>
                            </strong>
                            <div className="roster-row-actions">
                              {participant ? (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const label = formatStudentName(student.prenom, student.nom);
                                    const ok = window.confirm(
                                      `Déconnecter ${label} ? Le nom redeviendra libre.`,
                                    );
                                    if (!ok) return;
                                    void kick(participant.id);
                                  }}
                                >
                                  Déconnecter
                                </Button>
                              ) : (
                                <span className="field-help">—</span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>

                <section className="roster-panel" aria-label="Lancer une activité">
                  <h2>Activité</h2>
                  <p className="field-help">
                    Tu choisis le parcours et le mode. Les élèves choisissent ensuite leur univers, puis démarrent la
                    mission. Tu peux enchaîner plusieurs exercices dans la même session.
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
                      disabled={
                        busy ||
                        missions.length === 0 ||
                        !missions.some((m) => m.id === missionId && m.available)
                      }
                      onClick={() => {
                        setBusy(true);
                        void setClassActivity({
                          niveau: grade,
                          matiere: subject,
                          missionId,
                          mode,
                        })
                          .then(() => listClassMissionsDoneRef.current(current.id).then(setDoneMissions))
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
                      {activeMissionTitle ?? liveSession.missionId}{" "}
                      · mode {liveSession.mode === "cahier" ? "cahier" : "QCM"} (univers au choix de l’élève)
                    </p>
                  ) : null}
                </section>
              </>
            ) : (
              <p className="field-help">
                Aucune session ouverte. Clique sur « Lancer une session » pour générer un code.
              </p>
            )}
          </>
        )}
      </section>
    </Shell>
  );
}
