import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { GRADES, SUBJECTS, gradeLabel, subjectLabel } from "../data/catalog";
import { findMission } from "../data/missions";
import { listThemesFor, type ProgrammeTheme } from "../data/programmeThemes";
import type {
  ChildSession,
  ClasseSession,
  ClassStudent,
  ClassThemeCoverage,
  GradeLevel,
  SubjectSlug,
} from "../data/types";
import { formatStudentName } from "../data/types";
import { UNIVERSES } from "../data/universes";
import { useSession } from "../lib/session";
import {
  activityStatusLabel,
  buildClassSummary,
  buildStudentStats,
  displaySessionStudent,
  formatTimeOnly,
  sessionDayKey,
  universeShortList,
} from "../lib/studentStats";

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type SuiviMode = "eleves" | "seances" | "programme";

type ThemeRowStatus = "fait" | "partiel_app" | "partiel_classe" | "a_faire";

function themeStatus(doneApp: boolean, doneClass: boolean): ThemeRowStatus {
  if (doneApp && doneClass) return "fait";
  if (doneApp) return "partiel_app";
  if (doneClass) return "partiel_classe";
  return "a_faire";
}

function statusLabel(status: ThemeRowStatus): string {
  if (status === "fait") return "Traité";
  if (status === "partiel_app") return "Fait via l’app";
  if (status === "partiel_classe") return "Traité en classe";
  return "À faire";
}

function missionTitle(missionId: string | null): string | null {
  if (!missionId) return null;
  return findMission(missionId)?.title ?? null;
}

function sessionResultLabel(session: ChildSession): string {
  if (session.rewardEarned) return UNIVERSES[session.universe].rewardShort;
  if (session.finishedAt) return "Quittée sans étoile";
  return "En cours";
}

export function TeacherSpaceScreen() {
  const navigate = useNavigate();
  const {
    role,
    teacher,
    classes,
    activeClassId,
    setActiveClassId,
    ensureClass,
    createClass,
    renameClass,
    listClassStudents,
    addClassStudent,
    renameClassStudent,
    removeClassStudent,
    loadClassSessions,
    loadClassAnswers,
    listClassSessionsHistory,
    listClassMissionsDone,
    listClassThemeCoverage,
    setThemeCoveredInClass,
    logout,
    backend,
  } = useSession();

  const current = classes.find((item) => item.id === activeClassId) ?? classes[0] ?? null;
  const [nom, setNom] = useState(current?.nom ?? "");
  const [newClassName, setNewClassName] = useState("");
  const [sessions, setSessions] = useState<ChildSession[]>([]);
  const [sessionHistory, setSessionHistory] = useState<ClasseSession[]>([]);
  const [roster, setRoster] = useState<ClassStudent[]>([]);
  const [rosterReady, setRosterReady] = useState(false);
  const [newStudentPrenom, setNewStudentPrenom] = useState("");
  const [newStudentNom, setNewStudentNom] = useState("");
  const [rosterError, setRosterError] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingPrenom, setEditingPrenom] = useState("");
  const [editingNom, setEditingNom] = useState("");
  const [copied, setCopied] = useState(false);
  const [busyCreate, setBusyCreate] = useState(false);
  const [createError, setCreateError] = useState("");
  const [mode, setMode] = useState<SuiviMode>("eleves");
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [selectedStudentKey, setSelectedStudentKey] = useState<string | null>(null);
  const [filterEleveId, setFilterEleveId] = useState("");
  const [filterSessionId, setFilterSessionId] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [progGrade, setProgGrade] = useState<GradeLevel>("cm2");
  const [progSubject, setProgSubject] = useState<SubjectSlug>("maths");
  const [missionsDone, setMissionsDone] = useState<string[]>([]);
  const [themeCoverage, setThemeCoverage] = useState<ClassThemeCoverage[]>([]);
  const [progReady, setProgReady] = useState(false);
  const [progBusyId, setProgBusyId] = useState<string | null>(null);

  async function refreshRoster(classId: string) {
    setRosterReady(false);
    const rows = await listClassStudents(classId);
    setRoster(rows);
    setRosterReady(true);
  }

  useEffect(() => {
    if (classes.length === 0) {
      void ensureClass();
      return;
    }
    if (!current && classes[0]) setActiveClassId(classes[0].id);
  }, [classes, current, ensureClass, setActiveClassId]);

  useEffect(() => {
    if (current) setNom(current.nom);
  }, [current?.id, current?.nom]);

  useEffect(() => {
    if (!current) {
      setRoster([]);
      setRosterReady(true);
      setNewStudentPrenom("");
      setNewStudentNom("");
      setRosterError("");
      setEditingStudentId(null);
      setPrepareOpen(false);
      return;
    }
    let cancelled = false;
    setRosterReady(false);
    void listClassStudents(current.id).then((rows) => {
      if (!cancelled) {
        setRoster(rows);
        setRosterReady(true);
        setRosterError("");
        setEditingStudentId(null);
        setPrepareOpen(rows.length === 0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id, listClassStudents]);

  useEffect(() => {
    setFilterEleveId("");
    setFilterSessionId("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSelectedStudentKey(null);
  }, [current?.id]);

  useEffect(() => {
    if (!current) {
      setMissionsDone([]);
      setThemeCoverage([]);
      setProgReady(true);
      return;
    }
    let cancelled = false;
    setProgReady(false);
    void Promise.all([
      listClassMissionsDone(current.id),
      listClassThemeCoverage(current.id),
    ]).then(([done, coverage]) => {
      if (cancelled) return;
      setMissionsDone(done);
      setThemeCoverage(coverage);
      setProgReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id, listClassMissionsDone, listClassThemeCoverage]);

  useEffect(() => {
    if (!current) {
      setSessionHistory([]);
      return;
    }
    let cancelled = false;
    void listClassSessionsHistory(current.id).then((rows) => {
      if (!cancelled) setSessionHistory(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [current?.id, listClassSessionsHistory]);

  useEffect(() => {
    if (!current) {
      setSessions([]);
      return;
    }
    let cancelled = false;
    void loadClassSessions(current.code, {
      eleveId: filterEleveId || null,
      classeSessionId: filterSessionId || null,
      dateFrom: filterDateFrom || null,
      dateTo: filterDateTo || null,
    }).then((rows) => {
      if (!cancelled) {
        setSessions(rows);
        setSelectedStudentKey(null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [
    current?.id,
    current?.code,
    filterEleveId,
    filterSessionId,
    filterDateFrom,
    filterDateTo,
    loadClassSessions,
  ]);

  const [answersReady, setAnswersReady] = useState(false);
  const [answerRows, setAnswerRows] = useState<Awaited<ReturnType<typeof loadClassAnswers>>>([]);

  useEffect(() => {
    let cancelled = false;
    setAnswersReady(false);
    const ids = sessions.map((session) => session.id);
    void loadClassAnswers(ids).then((rows) => {
      if (cancelled) return;
      setAnswerRows(rows);
      setAnswersReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [sessions, loadClassAnswers]);

  const rosterForStats = useMemo(() => {
    if (!filterEleveId) return roster;
    return roster.filter((student) => student.id === filterEleveId);
  }, [roster, filterEleveId]);

  const studentStats = useMemo(
    () => (answersReady ? buildStudentStats(sessions, answerRows, rosterForStats) : []),
    [answersReady, sessions, answerRows, rosterForStats],
  );

  const classSummary = useMemo(() => buildClassSummary(studentStats), [studentStats]);

  const programmeThemes = useMemo(
    () => listThemesFor(progGrade, progSubject),
    [progGrade, progSubject],
  );

  const coverageByTheme = useMemo(() => {
    const map = new Map<string, ClassThemeCoverage>();
    for (const row of themeCoverage) map.set(row.themeId, row);
    return map;
  }, [themeCoverage]);

  const doneMissionSet = useMemo(() => new Set(missionsDone), [missionsDone]);

  const programmeRows = useMemo(() => {
    return programmeThemes.map((theme: ProgrammeTheme) => {
      const manual = coverageByTheme.get(theme.id);
      const doneApp = Boolean(theme.missionId && doneMissionSet.has(theme.missionId));
      const doneClass = Boolean(manual?.coveredInClass);
      const status = themeStatus(doneApp, doneClass);
      return { theme, doneApp, doneClass, status, manual };
    });
  }, [programmeThemes, coverageByTheme, doneMissionSet]);

  const programmeProgress = useMemo(() => {
    const total = programmeRows.length;
    const covered = programmeRows.filter((row) => row.doneApp || row.doneClass).length;
    return { total, covered };
  }, [programmeRows]);

  const journalByDay = useMemo(() => {
    const groups = new Map<string, ChildSession[]>();
    const sorted = [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    for (const session of sorted) {
      const day = sessionDayKey(session.startedAt);
      const list = groups.get(day) ?? [];
      list.push(session);
      groups.set(day, list);
    }
    return [...groups.entries()];
  }, [sessions]);

  async function toggleCoveredInClass(themeId: string, next: boolean) {
    if (!current) return;
    setProgBusyId(themeId);
    try {
      const saved = await setThemeCoveredInClass(current.id, themeId, next);
      if (!saved) return;
      setThemeCoverage((rows) => {
        const others = rows.filter((item) => item.themeId !== themeId);
        return [...others, saved];
      });
    } finally {
      setProgBusyId(null);
    }
  }

  const selectedStudent = studentStats.find((item) => item.key === selectedStudentKey) ?? null;
  const studentSessions = useMemo(() => {
    if (!selectedStudent) return [];
    if (selectedStudent.eleveId) {
      return sessions.filter((session) => session.eleveId === selectedStudent.eleveId);
    }
    const [prenomPart, deviceId] = selectedStudent.key.split("::");
    return sessions.filter(
      (session) =>
        session.deviceId === deviceId &&
        session.prenom.trim().toLocaleLowerCase("fr-FR") === prenomPart,
    );
  }, [selectedStudent, sessions]);

  if (role !== "enseignant" || !teacher) return <Navigate to="/connexion/enseignant" replace />;

  const showSetupHint = rosterReady && roster.length === 0;
  const showActivityFilters = mode === "eleves" || mode === "seances";

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Espace enseignant"
      homeTo="/espace-professeur"
      extra={
        <Button
          onClick={() => {
            void logout().then(() => navigate("/"));
          }}
        >
          Se déconnecter
        </Button>
      }
    >
      <section className="teacher-space suivi-classe">
        <span className="kicker">Suivi de classe</span>
        <p className="suivi-greeting">Connecté · {teacher.email}</p>
        {backend === "local" ? (
          <p className="field-help">
            Espace local sur cet appareil. Avec Supabase, les mêmes codes fonctionnent sur les tablettes de l’école.
          </p>
        ) : null}

        <div className="teacher-layout">
          <aside className="class-panel" aria-label="Tes classes">
            <h2>Tes classes</h2>
            {classes.length === 0 ? (
              <p className="field-help">Création de ta première classe…</p>
            ) : (
              <ul className="class-list">
                {classes.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`class-item ${current?.id === item.id ? "is-selected" : ""}`}
                      aria-pressed={current?.id === item.id}
                      onClick={() => setActiveClassId(item.id)}
                    >
                      <strong>{item.nom}</strong>
                      <span>{item.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="field create-class">
              <label htmlFor="nouvelle-classe">Nouvelle classe</label>
              <input
                id="nouvelle-classe"
                value={newClassName}
                maxLength={40}
                placeholder="Ex. CM2 A"
                onChange={(event) => {
                  setNewClassName(event.target.value);
                  setCreateError("");
                }}
              />
              <Button
                variant="primary"
                type="button"
                disabled={busyCreate}
                onClick={() => {
                  setBusyCreate(true);
                  setCreateError("");
                  void createClass(newClassName)
                    .then((created) => {
                      if (!created) setCreateError("Impossible de créer la classe. Réessaie.");
                      else setNewClassName("");
                    })
                    .finally(() => setBusyCreate(false));
                }}
              >
                Créer une classe
              </Button>
              {createError ? <p className="error">{createError}</p> : null}
            </div>
          </aside>

          <div className="class-detail">
            {!current ? (
              <p>Sélectionne ou crée une classe pour commencer.</p>
            ) : (
              <>
                <header className="suivi-header">
                  <div className="suivi-header-main">
                    <h1>{current.nom}</h1>
                    <div className="suivi-code" aria-label={`Code de ${current.nom}`}>
                      <span className="suivi-code-label">Code</span>
                      <strong>{current.code}</strong>
                      <Button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard.writeText(current.code).then(() => {
                            setCopied(true);
                            window.setTimeout(() => setCopied(false), 2000);
                          });
                        }}
                      >
                        {copied ? "Copié" : "Copier"}
                      </Button>
                    </div>
                  </div>
                  <div className="suivi-header-actions">
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => navigate("/espace-professeur/session")}
                    >
                      Piloter une session
                    </Button>
                    <Button type="button" onClick={() => navigate("/espace-professeur/missions")}>
                      Créer une mission
                    </Button>
                    <button
                      type="button"
                      className="suivi-prepare-toggle"
                      aria-expanded={prepareOpen}
                      onClick={() => setPrepareOpen((open) => !open)}
                    >
                      {prepareOpen ? "Masquer la préparation" : "Gérer les élèves / renommer"}
                    </button>
                  </div>
                </header>

                {showSetupHint ? (
                  <div className="teacher-banner" role="status">
                    <strong>Première étape :</strong> ajoute les élèves (prénom et nom), puis partage le code{" "}
                    <code>{current.code}</code>.
                  </div>
                ) : null}

                {prepareOpen ? (
                  <section className="suivi-prepare" aria-label="Préparer la classe">
                    <h2>Préparer la classe</h2>
                    <div className="field" style={{ maxWidth: 420 }}>
                      <label htmlFor="nom-classe">Nom de la classe</label>
                      <input
                        id="nom-classe"
                        value={nom}
                        maxLength={40}
                        onChange={(event) => setNom(event.target.value)}
                        onBlur={() => {
                          if (nom.trim() && nom.trim() !== current.nom) {
                            void renameClass(current.id, nom.trim());
                          }
                        }}
                      />
                    </div>

                    <div className="roster-panel" aria-label="Liste des élèves">
                      <h3>Liste des élèves ({roster.length})</h3>
                      <p className="field-help">
                        Ces élèves apparaissent quand un enfant entre le code {current.code}.
                      </p>
                      {!rosterReady ? <p>Chargement de la liste…</p> : null}
                      {rosterReady ? (
                        <ul className="roster-list">
                          {roster.map((student) => (
                            <li key={student.id}>
                              {editingStudentId === student.id ? (
                                <form
                                  className="roster-edit-row"
                                  onSubmit={(event) => {
                                    event.preventDefault();
                                    void renameClassStudent(student.id, editingPrenom, editingNom).then(
                                      (message) => {
                                        if (message) {
                                          setRosterError(message);
                                          return;
                                        }
                                        setEditingStudentId(null);
                                        setRosterError("");
                                        void refreshRoster(current.id);
                                      },
                                    );
                                  }}
                                >
                                  <input
                                    value={editingPrenom}
                                    maxLength={20}
                                    placeholder="Prénom"
                                    aria-label={`Modifier le prénom de ${formatStudentName(student.prenom, student.nom)}`}
                                    onChange={(event) => setEditingPrenom(event.target.value)}
                                  />
                                  <input
                                    value={editingNom}
                                    maxLength={40}
                                    placeholder="Nom"
                                    aria-label={`Modifier le nom de ${formatStudentName(student.prenom, student.nom)}`}
                                    onChange={(event) => setEditingNom(event.target.value)}
                                  />
                                  <Button type="submit" variant="primary">
                                    Enregistrer
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setEditingStudentId(null);
                                      setRosterError("");
                                    }}
                                  >
                                    Annuler
                                  </Button>
                                </form>
                              ) : (
                                <div className="roster-row">
                                  <strong>{formatStudentName(student.prenom, student.nom)}</strong>
                                  <div className="roster-row-actions">
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        setEditingStudentId(student.id);
                                        setEditingPrenom(student.prenom);
                                        setEditingNom(student.nom);
                                        setRosterError("");
                                      }}
                                    >
                                      Modifier
                                    </Button>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        const label = formatStudentName(student.prenom, student.nom);
                                        const ok = window.confirm(`Retirer ${label} de la liste ?`);
                                        if (!ok) return;
                                        void removeClassStudent(student.id).then(() =>
                                          refreshRoster(current.id),
                                        );
                                      }}
                                    >
                                      Retirer
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {rosterReady && roster.length === 0 ? (
                        <p className="field-help">Aucun élève pour l’instant. Ajoute prénom et nom.</p>
                      ) : null}
                      <form
                        className="roster-add"
                        onSubmit={(event) => {
                          event.preventDefault();
                          setRosterError("");
                          void addClassStudent(current.id, newStudentPrenom, newStudentNom).then(
                            (result) => {
                              if (typeof result === "string") {
                                setRosterError(result);
                                return;
                              }
                              setNewStudentPrenom("");
                              setNewStudentNom("");
                              void refreshRoster(current.id);
                            },
                          );
                        }}
                      >
                        <div className="field">
                          <label htmlFor="nouvel-eleve-prenom">Prénom</label>
                          <input
                            id="nouvel-eleve-prenom"
                            value={newStudentPrenom}
                            maxLength={20}
                            placeholder="Prénom"
                            onChange={(event) => setNewStudentPrenom(event.target.value)}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="nouvel-eleve-nom">Nom</label>
                          <input
                            id="nouvel-eleve-nom"
                            value={newStudentNom}
                            maxLength={40}
                            placeholder="Nom"
                            onChange={(event) => setNewStudentNom(event.target.value)}
                          />
                        </div>
                        <Button type="submit" variant="primary" disabled={!newStudentPrenom.trim()}>
                          Ajouter
                        </Button>
                      </form>
                      {rosterError ? (
                        <p className="error" aria-live="polite">
                          {rosterError}
                        </p>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                <div className="suivi-summary" aria-label="Synthèse de la classe">
                  <div className="suivi-summary-item">
                    <span className="suivi-summary-value">
                      {answersReady ? classSummary.activeStudents : "—"}
                    </span>
                    <span className="suivi-summary-label">Élèves actifs</span>
                  </div>
                  <div className="suivi-summary-item">
                    <span className="suivi-summary-value">
                      {answersReady
                        ? `${classSummary.missionsCompleted}${classSummary.missionsInProgress > 0 ? ` · ${classSummary.missionsInProgress} en cours` : ""}`
                        : "—"}
                    </span>
                    <span className="suivi-summary-label">Missions terminées</span>
                  </div>
                  <div className="suivi-summary-item">
                    <span className="suivi-summary-value">
                      {answersReady
                        ? classSummary.avgSuccessRate === null
                          ? "—"
                          : `${classSummary.avgSuccessRate} %`
                        : "—"}
                    </span>
                    <span className="suivi-summary-label">Réussite moyenne</span>
                  </div>
                  <div className="suivi-summary-item">
                    <span className="suivi-summary-value">
                      {progReady
                        ? `${programmeProgress.covered}/${programmeProgress.total || "—"}`
                        : "—"}
                    </span>
                    <span className="suivi-summary-label">
                      Programme ({gradeLabel(progGrade)} · {subjectLabel(progSubject)})
                    </span>
                  </div>
                </div>

                <div className="suivi-modes" role="tablist" aria-label="Vue du suivi">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "eleves"}
                    className={mode === "eleves" ? "is-selected" : ""}
                    onClick={() => setMode("eleves")}
                  >
                    Élèves ({rosterReady ? studentStats.length : "—"})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "seances"}
                    className={mode === "seances" ? "is-selected" : ""}
                    onClick={() => setMode("seances")}
                  >
                    Journal ({sessions.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "programme"}
                    className={mode === "programme" ? "is-selected" : ""}
                    onClick={() => setMode("programme")}
                  >
                    Programme ({programmeProgress.covered}/{programmeProgress.total || "—"})
                  </button>
                </div>

                {showActivityFilters ? (
                  <div className="stats-filters" aria-label="Filtres du suivi">
                    <div className="field">
                      <label htmlFor="filtre-eleve">Élève</label>
                      <select
                        id="filtre-eleve"
                        value={filterEleveId}
                        onChange={(event) => setFilterEleveId(event.target.value)}
                      >
                        <option value="">Tous les élèves</option>
                        {roster.map((student) => (
                          <option key={student.id} value={student.id}>
                            {formatStudentName(student.prenom, student.nom)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="filtre-session">Séance live</label>
                      <select
                        id="filtre-session"
                        value={filterSessionId}
                        onChange={(event) => setFilterSessionId(event.target.value)}
                      >
                        <option value="">Toutes les séances</option>
                        {sessionHistory.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.code} · {formatWhen(item.createdAt)}
                            {item.statut === "ouverte" ? " (ouverte)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="filtre-date-from">Du</label>
                      <input
                        id="filtre-date-from"
                        type="date"
                        value={filterDateFrom}
                        onChange={(event) => setFilterDateFrom(event.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="filtre-date-to">Au</label>
                      <input
                        id="filtre-date-to"
                        type="date"
                        value={filterDateTo}
                        onChange={(event) => setFilterDateTo(event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                {mode === "eleves" ? (
                  <div className="suivi-panel suivi-eleves">
                    <h2>Élèves</h2>
                    {!answersReady || !rosterReady ? (
                      <p>Chargement…</p>
                    ) : studentStats.length === 0 ? (
                      <p>
                        Ajoute des élèves dans « Gérer les élèves », puis partage le code {current.code}. Leur activité
                        apparaîtra ici.
                      </p>
                    ) : (
                      <ul className="suivi-eleve-list">
                        {studentStats.map((student) => {
                          const open = selectedStudentKey === student.key;
                          return (
                            <li key={student.key}>
                              <button
                                type="button"
                                className={`suivi-eleve-row ${open ? "is-open" : ""}`}
                                aria-expanded={open}
                                onClick={() =>
                                  setSelectedStudentKey((currentKey) =>
                                    currentKey === student.key ? null : student.key,
                                  )
                                }
                              >
                                <span className="suivi-eleve-name">{student.displayName}</span>
                                <span
                                  className={`suivi-activity status-${student.activityStatus}`}
                                >
                                  {activityStatusLabel(student.activityStatus)}
                                </span>
                                <span className="suivi-eleve-meta">
                                  {student.missionsCompleted} terminée
                                  {student.missionsCompleted > 1 ? "s" : ""}
                                  {student.missionsInProgress > 0
                                    ? ` · ${student.missionsInProgress} en cours`
                                    : ""}
                                </span>
                                <span className="suivi-eleve-rate">
                                  {student.successRate === null ? "—" : `${student.successRate} %`}
                                </span>
                              </button>
                              {open ? (
                                <div className="suivi-eleve-detail student-detail" aria-live="polite">
                                  <p>
                                    Dernière activité :{" "}
                                    {student.lastActivityAt ? formatWhen(student.lastActivityAt) : "—"}
                                  </p>
                                  <p>
                                    Parcours :{" "}
                                    {student.parcours.length > 0 ? student.parcours.join(" · ") : "—"}
                                  </p>
                                  <p>
                                    Univers : {universeShortList(student.universesCompleted)}
                                  </p>
                                  {studentSessions.length === 0 ? (
                                    <p className="field-help">Pas encore de séance pour cet élève.</p>
                                  ) : (
                                    <div className="session-table-wrap">
                                      <table className="session-table">
                                        <thead>
                                          <tr>
                                            <th>Parcours</th>
                                            <th>Résultat</th>
                                            <th>Quand</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {studentSessions.map((session) => (
                                            <tr key={session.id}>
                                              <td>
                                                <div>
                                                  {session.grade && session.subject
                                                    ? `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`
                                                    : "—"}
                                                </div>
                                                <div className="muted suivi-subline">
                                                  {UNIVERSES[session.universe].label} ·{" "}
                                                  {session.mode === "qcm" ? "QCM" : "Cahier"}
                                                </div>
                                              </td>
                                              <td>{sessionResultLabel(session)}</td>
                                              <td>{formatWhen(session.startedAt)}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : null}

                {mode === "seances" ? (
                  <div className="suivi-panel suivi-journal">
                    <h2>Journal</h2>
                    {sessions.length === 0 ? (
                      <p>Pas encore de séance avec ce code.</p>
                    ) : (
                      journalByDay.map(([day, daySessions]) => (
                        <section key={day} className="suivi-day-group">
                          <h3 className="suivi-day-title">{day}</h3>
                          <div className="session-table-wrap">
                            <table className="session-table suivi-journal-table">
                              <thead>
                                <tr>
                                  <th>Élève</th>
                                  <th>Parcours</th>
                                  <th>Résultat</th>
                                  <th>Heure</th>
                                </tr>
                              </thead>
                              <tbody>
                                {daySessions.map((session) => (
                                  <tr key={session.id}>
                                    <td>{displaySessionStudent(session, roster)}</td>
                                    <td>
                                      <div>
                                        {session.grade && session.subject
                                          ? `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`
                                          : "—"}
                                      </div>
                                      <div className="muted suivi-subline">
                                        {UNIVERSES[session.universe].label} ·{" "}
                                        {session.mode === "qcm" ? "QCM" : "Cahier"}
                                      </div>
                                    </td>
                                    <td>{sessionResultLabel(session)}</td>
                                    <td>{formatTimeOnly(session.startedAt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>
                      ))
                    )}
                  </div>
                ) : null}

                {mode === "programme" ? (
                  <div className="suivi-panel suivi-programme">
                    <h2>Programme</h2>
                    <p className="field-help">
                      Thèmes couverts via Happy Learn (mission terminée par au moins un élève) ou marqués traités en
                      classe sans l’appli.
                    </p>
                    <div className="stats-filters">
                      <div className="field">
                        <label htmlFor="prog-grade">Niveau</label>
                        <select
                          id="prog-grade"
                          value={progGrade}
                          onChange={(event) => setProgGrade(event.target.value as GradeLevel)}
                        >
                          {GRADES.map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="prog-subject">Matière</label>
                        <select
                          id="prog-subject"
                          value={progSubject}
                          onChange={(event) => setProgSubject(event.target.value as SubjectSlug)}
                        >
                          {SUBJECTS.map((item) => (
                            <option key={item.slug} value={item.slug}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {!progReady ? (
                      <p>Chargement du programme…</p>
                    ) : programmeProgress.total === 0 ? (
                      <p>Aucun thème pour ce couple niveau / matière.</p>
                    ) : (
                      <>
                        <p className="programme-progress" aria-live="polite">
                          <strong>
                            {programmeProgress.covered} / {programmeProgress.total}
                          </strong>{" "}
                          thèmes couverts ({gradeLabel(progGrade)} · {subjectLabel(progSubject)})
                        </p>
                        <div
                          className="programme-progress-bar"
                          role="progressbar"
                          aria-valuenow={programmeProgress.covered}
                          aria-valuemin={0}
                          aria-valuemax={programmeProgress.total}
                        >
                          <i
                            style={{
                              width: `${Math.round(
                                (100 * programmeProgress.covered) /
                                  Math.max(1, programmeProgress.total),
                              )}%`,
                            }}
                          />
                        </div>
                        <ul className="programme-legend" aria-label="Légende des statuts">
                          <li>
                            <span className="programme-status status-fait">Traité</span>
                          </li>
                          <li>
                            <span className="programme-status status-partiel_app">Fait via l’app</span>
                          </li>
                          <li>
                            <span className="programme-status status-partiel_classe">Traité en classe</span>
                          </li>
                          <li>
                            <span className="programme-status status-a_faire">À faire</span>
                          </li>
                        </ul>
                        <div className="session-table-wrap">
                          <table className="session-table programme-table">
                            <thead>
                              <tr>
                                <th>Thème</th>
                                <th>Mission</th>
                                <th>App</th>
                                <th>En classe</th>
                                <th>Statut</th>
                              </tr>
                            </thead>
                            <tbody>
                              {programmeRows.map((row) => {
                                const title = missionTitle(row.theme.missionId);
                                return (
                                  <tr key={row.theme.id} className={`status-${row.status}`}>
                                    <td>{row.theme.label}</td>
                                    <td>
                                      {title ? (
                                        <span>{title}</span>
                                      ) : row.theme.missionId ? (
                                        <span className="muted">{row.theme.missionId}</span>
                                      ) : (
                                        <span className="muted">Pas encore de mission</span>
                                      )}
                                    </td>
                                    <td>{row.doneApp ? "Oui" : "Non"}</td>
                                    <td>
                                      <label className="programme-check">
                                        <input
                                          type="checkbox"
                                          checked={row.doneClass}
                                          disabled={progBusyId === row.theme.id}
                                          onChange={(event) =>
                                            void toggleCoveredInClass(
                                              row.theme.id,
                                              event.target.checked,
                                            )
                                          }
                                        />
                                        <span>En classe</span>
                                      </label>
                                    </td>
                                    <td>
                                      <span className={`programme-status status-${row.status}`}>
                                        {statusLabel(row.status)}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
