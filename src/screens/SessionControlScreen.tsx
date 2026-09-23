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
  if (status === "connecte") return "En ligne";
  if (status === "deconnecte") return "Hors ligne";
  return "Absent";
}

function presenceRank(status: PresenceStatus, handRaised: boolean): number {
  if (handRaised) return 0;
  if (status === "connecte") return 1;
  if (status === "deconnecte") return 2;
  return 3;
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
    startHostMission,
    kick,
    clearHand,
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
    return roster
      .map((student) => {
        const participant = byEleve.get(student.id) ?? null;
        const status: PresenceStatus = !participant
          ? "absent"
          : participant.statut === "connecte"
            ? "connecte"
            : "deconnecte";
        return { student, participant, status };
      })
      .sort((a, b) => {
        const rank =
          presenceRank(a.status, Boolean(a.participant?.handRaised)) -
          presenceRank(b.status, Boolean(b.participant?.handRaised));
        if (rank !== 0) return rank;
        return formatStudentName(a.student.prenom, a.student.nom).localeCompare(
          formatStudentName(b.student.prenom, b.student.nom),
          "fr",
          { sensitivity: "base" },
        );
      });
  }, [roster, liveParticipants]);

  if ((role !== "enseignant" && role !== "admin") || !teacher) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  const connectedCount = presenceRows.filter((row) => row.status === "connecte").length;
  const handsUp = presenceRows.filter((row) => row.participant?.handRaised).length;
  const activityActive = Boolean(liveSession?.missionId);
  const canLaunchMission =
    !busy &&
    missions.length > 0 &&
    missions.some((m) => m.id === missionId && m.available);

  const launchSession = () => {
    if (!current) return;
    setBusy(true);
    setError("");
    void launchClassSession(current.id)
      .then((created) => {
        if (!created) setError("Impossible de lancer la session.");
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error && err.message.trim()
            ? err.message
            : "Impossible de lancer la session.";
        setError(message);
      })
      .finally(() => setBusy(false));
  };

  const stopSession = () => {
    const ok = window.confirm("Terminer la session ? Le code ne fonctionnera plus.");
    if (!ok) return;
    setBusy(true);
    void endClassSession().finally(() => setBusy(false));
  };

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Session live"
      homeTo="/espace-professeur"
      backTo="/espace-professeur"
    >
      <section className="session-pilot">
        {!current ? (
          <div className="pilot-idle">
            <h1>Pilotage</h1>
            <p className="lead">Crée d’abord une classe dans l’espace professeur.</p>
            <Button variant="primary" type="button" onClick={() => navigate("/espace-professeur")}>
              Aller à l’espace professeur
            </Button>
          </div>
        ) : !liveSession ? (
          <div className="pilot-idle">
            <p className="pilot-eyebrow">{current.nom}</p>
            <h1>Lancer une session</h1>
            <p className="lead" data-listen>
              Un code s’affiche pour le tableau. Les élèves se connectent, tu lances une mission.
            </p>
            {backend === "local" ? (
              <p className="pilot-note" role="status">
                Mode local : présence temps réel limitée sans Supabase.
              </p>
            ) : null}
            {error ? <p className="error">{error}</p> : null}
            <div className="pilot-idle-actions">
              <Button variant="primary" type="button" disabled={busy} onClick={launchSession}>
                {busy ? "Ouverture…" : "Ouvrir la session"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <header className="pilot-head">
              <div className="pilot-head-main">
                <p className="pilot-eyebrow">{current.nom}</p>
                <h1>Session en cours</h1>
              </div>
              <div className="pilot-head-meta">
                <span className="pilot-live-dot" aria-hidden="true" />
                <span className="pilot-live-label">Live</span>
                <Button type="button" className="ghost-btn pilot-end" disabled={busy} onClick={stopSession}>
                  Terminer
                </Button>
              </div>
            </header>

            {error ? <p className="error">{error}</p> : null}

            <div className="pilot-code" aria-label="Code de session">
              <div className="pilot-code-copy">
                <span className="pilot-code-label">Code à écrire au tableau</span>
                <strong className="pilot-code-value">{liveSession.code}</strong>
              </div>
              <Button
                type="button"
                className="pilot-code-btn"
                onClick={() => {
                  void navigator.clipboard.writeText(liveSession.code).then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  });
                }}
              >
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>

            <div className="pilot-board">
              <section className="pilot-pane pilot-roster" aria-label="Présence des élèves">
                <div className="pilot-pane-head">
                  <h2>Classe</h2>
                  <p className="pilot-stat">
                    <strong>{connectedCount}</strong>/{roster.length} en ligne
                    {handsUp > 0 ? (
                      <>
                        {" · "}
                        <span className="pilot-hand-stat">{handsUp} main{handsUp > 1 ? "s" : ""}</span>
                      </>
                    ) : null}
                  </p>
                </div>

                {!rosterReady ? <p className="pilot-empty">Chargement…</p> : null}
                {rosterReady && roster.length === 0 ? (
                  <p className="pilot-empty">
                    Aucun élève. Ajoute-les dans l’espace professeur.
                  </p>
                ) : null}
                {rosterReady && roster.length > 0 ? (
                  <ul className="pilot-list">
                    {presenceRows.map(({ student, participant, status }) => {
                      const hand = Boolean(participant?.handRaised);
                      return (
                        <li
                          key={student.id}
                          className={`pilot-row status-${status}${hand ? " is-hand" : ""}`}
                        >
                          <div className="pilot-row-main">
                            <span className={`pilot-dot presence-${status}`} aria-hidden="true" />
                            <span className="pilot-name">
                              {formatStudentName(student.prenom, student.nom)}
                            </span>
                            {hand ? <span className="pilot-hand-badge">Main</span> : null}
                            <span className="pilot-status-label">{presenceLabel(status)}</span>
                          </div>
                          <div className="pilot-row-actions">
                            {hand && participant ? (
                              <Button
                                type="button"
                                className="hand-clear-btn pilot-mini"
                                onClick={() => {
                                  void clearHand(participant.id);
                                }}
                              >
                                Vu
                              </Button>
                            ) : null}
                            {participant ? (
                              <button
                                type="button"
                                className="pilot-kick"
                                title="Déconnecter"
                                onClick={() => {
                                  const label = formatStudentName(student.prenom, student.nom);
                                  const ok = window.confirm(
                                    `Déconnecter ${label} ? Le nom redeviendra libre.`,
                                  );
                                  if (!ok) return;
                                  void kick(participant.id);
                                }}
                              >
                                Retirer
                              </button>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>

              <section className="pilot-pane pilot-mission" aria-label="Mission">
                <div className="pilot-pane-head">
                  <h2>Mission</h2>
                  <p className="pilot-stat">
                    {activityActive ? "En cours chez les élèves" : "En attente"}
                  </p>
                </div>

                {activityActive && liveSession ? (
                  <div className="pilot-active" role="status">
                    <strong>{activeMissionTitle ?? liveSession.missionId}</strong>
                    <span>
                      {gradeLabel(liveSession.niveau)} · {subjectLabel(liveSession.matiere)} ·{" "}
                      {liveSession.mode === "cahier" ? "Cahier" : "QCM"}
                    </span>
                  </div>
                ) : (
                  <p className="pilot-hint">Choisis une mission, puis lance-la. Les élèves choisissent leur univers.</p>
                )}

                <div className="pilot-fields">
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
                  <div className="field pilot-field-span">
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
                    <span className="pilot-field-label" id="act-mode-label">
                      Mode
                    </span>
                    <div className="pilot-mode" role="group" aria-labelledby="act-mode-label">
                      <button
                        type="button"
                        className={mode === "qcm" ? "is-selected" : ""}
                        onClick={() => setMode("qcm")}
                      >
                        QCM
                      </button>
                      <button
                        type="button"
                        className={mode === "cahier" ? "is-selected" : ""}
                        onClick={() => setMode("cahier")}
                      >
                        Cahier
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pilot-mission-actions">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={!canLaunchMission}
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
                    {activityActive ? "Changer de mission" : "Lancer la mission"}
                  </Button>
                  <Button
                    type="button"
                    disabled={!canLaunchMission}
                    onClick={() => {
                      setBusy(true);
                      void startHostMission({
                        niveau: grade,
                        matiere: subject,
                        missionId,
                        mode,
                        universe: "football",
                      })
                        .then(() => navigate("/mission"))
                        .finally(() => setBusy(false));
                    }}
                  >
                    Animer au tableau
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
                      Pause — salle d’attente
                    </Button>
                  ) : null}
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </Shell>
  );
}
