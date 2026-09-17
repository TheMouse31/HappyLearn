import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Shell } from "../components/Shell";
import { gradeLabel, subjectLabel } from "../data/catalog";
import type { ChildSession, ClasseSession, ClassStudent } from "../data/types";
import { formatStudentName } from "../data/types";
import { UNIVERSES } from "../data/universes";
import { useSession } from "../lib/session";
import { buildStudentStats, universeShortList } from "../lib/studentStats";

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

type TeacherTab = "eleves" | "seances";

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
  const [tab, setTab] = useState<TeacherTab>("eleves");
  const [selectedStudentKey, setSelectedStudentKey] = useState<string | null>(null);
  const [filterEleveId, setFilterEleveId] = useState("");
  const [filterSessionId, setFilterSessionId] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

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
  }, [current?.id]);

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

  const studentStats = useMemo(
    () => (answersReady ? buildStudentStats(sessions, answerRows) : []),
    [answersReady, sessions, answerRows],
  );

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
      <section className="teacher-space">
        <span className="kicker">Suivi de classe</span>
        <h1>Bonjour, {teacher.email}</h1>
        <p className="lead" data-listen>
          Crée tes classes, ajoute les élèves (prénom et nom), puis partage le code permanent. Tu peux aussi lancer une
          session live pour piloter les missions en classe. Les enfants choisissent leur nom dans la liste. Tu suis
          leurs missions sans note ni classement.
        </p>
        {showSetupHint && current ? (
          <div className="teacher-banner" role="status">
            <strong>Première étape :</strong> ajoute les élèves (prénom et nom) de ta classe ci-dessous, puis partage
            le code <code>{current.code}</code>.
          </div>
        ) : null}
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
                <div className="code-hero" aria-label={`Code de ${current.nom}`}>
                  <span>Code · {current.nom}</span>
                  <strong>{current.code}</strong>
                  <div className="actions">
                    <Button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(current.code).then(() => {
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                    >
                      {copied ? "Code copié" : "Copier le code"}
                    </Button>
                  </div>
                </div>

                <div className="actions" style={{ marginBottom: 18 }}>
                  <Button variant="primary" type="button" onClick={() => navigate("/espace-professeur/session")}>
                    Pilotage de session
                  </Button>
                </div>

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

                <section className="roster-panel" aria-label="Liste des élèves">
                  <h2>Liste des élèves ({roster.length})</h2>
                  <p className="field-help">
                    Ces élèves (prénom et nom) apparaissent quand un enfant entre le code {current.code}. Tu peux les
                    modifier à tout moment.
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
                                void renameClassStudent(student.id, editingPrenom, editingNom).then((message) => {
                                  if (message) {
                                    setRosterError(message);
                                    return;
                                  }
                                  setEditingStudentId(null);
                                  setRosterError("");
                                  void refreshRoster(current.id);
                                });
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
                                    void removeClassStudent(student.id).then(() => refreshRoster(current.id));
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
                    <p className="field-help">Aucun élève pour l’instant. Ajoute prénom et nom de ta classe.</p>
                  ) : null}
                  <form
                    className="roster-add"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setRosterError("");
                      void addClassStudent(current.id, newStudentPrenom, newStudentNom).then((result) => {
                        if (typeof result === "string") {
                          setRosterError(result);
                          return;
                        }
                        setNewStudentPrenom("");
                        setNewStudentNom("");
                        void refreshRoster(current.id);
                      });
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
                </section>

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

                <div className="role-tabs teacher-tabs" role="tablist" aria-label="Vue du suivi">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "eleves"}
                    className={tab === "eleves" ? "is-selected" : ""}
                    onClick={() => setTab("eleves")}
                  >
                    Activité ({studentStats.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "seances"}
                    className={tab === "seances" ? "is-selected" : ""}
                    onClick={() => setTab("seances")}
                  >
                    Séances ({sessions.length})
                  </button>
                </div>

                {tab === "eleves" ? (
                  <>
                    <h2>Statistiques par élève</h2>
                    {!answersReady ? (
                      <p>Chargement des statistiques…</p>
                    ) : studentStats.length === 0 ? (
                      <p>
                        Aucune activité pour l’instant. Quand un élève entre le code {current.code}, choisit son nom
                        dans la liste et joue, ses stats apparaissent ici.
                      </p>
                    ) : (
                      <div className="session-table-wrap">
                        <table className="session-table">
                          <thead>
                            <tr>
                              <th>Élève</th>
                              <th>Séances</th>
                              <th>Terminées</th>
                              <th>Réussite réponses</th>
                              <th>Univers gagnés</th>
                              <th>Dernière activité</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentStats.map((student) => (
                              <tr
                                key={student.key}
                                className={selectedStudentKey === student.key ? "is-selected-row" : ""}
                              >
                                <td>
                                  <button
                                    type="button"
                                    className="linkish"
                                    onClick={() =>
                                      setSelectedStudentKey((currentKey) =>
                                        currentKey === student.key ? null : student.key,
                                      )
                                    }
                                  >
                                    {student.prenom}
                                  </button>
                                </td>
                                <td>{student.sessionsStarted}</td>
                                <td>
                                  {student.missionsCompleted}
                                  {student.missionsAbandoned > 0
                                    ? ` · ${student.missionsAbandoned} quittée${student.missionsAbandoned > 1 ? "s" : ""}`
                                    : ""}
                                  {student.missionsInProgress > 0
                                    ? ` · ${student.missionsInProgress} en cours`
                                    : ""}
                                </td>
                                <td>
                                  {student.successRate === null
                                    ? "—"
                                    : `${student.successRate} % (${student.answersCorrect}/${student.answersTotal})`}
                                </td>
                                <td>{universeShortList(student.universesCompleted)}</td>
                                <td>{formatWhen(student.lastActivityAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {selectedStudent ? (
                      <div className="student-detail" aria-live="polite">
                        <h3>Détail · {selectedStudent.prenom}</h3>
                        <p>
                          Parcours :{" "}
                          {selectedStudent.parcours.length > 0 ? selectedStudent.parcours.join(" · ") : "—"}
                        </p>
                        <div className="session-table-wrap">
                          <table className="session-table">
                            <thead>
                              <tr>
                                <th>Parcours</th>
                                <th>Univers</th>
                                <th>Mode</th>
                                <th>Début</th>
                                <th>Résultat</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentSessions.map((session) => (
                                <tr key={session.id}>
                                  <td>
                                    {session.grade && session.subject
                                      ? `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`
                                      : "—"}
                                  </td>
                                  <td>{UNIVERSES[session.universe].label}</td>
                                  <td>{session.mode === "qcm" ? "QCM" : "Cahier"}</td>
                                  <td>{formatWhen(session.startedAt)}</td>
                                  <td>
                                    {session.rewardEarned
                                      ? UNIVERSES[session.universe].rewardShort
                                      : session.finishedAt
                                        ? "Quittée sans étoile"
                                        : "En cours"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <>
                    <h2>Journal des séances</h2>
                    {sessions.length === 0 ? (
                      <p>Pas encore de séance avec ce code.</p>
                    ) : (
                      <div className="session-table-wrap">
                        <table className="session-table">
                          <thead>
                            <tr>
                              <th>Élève</th>
                              <th>Parcours</th>
                              <th>Univers</th>
                              <th>Mode</th>
                              <th>Début</th>
                              <th>Mission</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessions.map((session) => (
                              <tr key={session.id}>
                                <td>{formatStudentName(session.prenom, "")}</td>
                                <td>
                                  {session.grade && session.subject
                                    ? `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`
                                    : "—"}
                                </td>
                                <td>{UNIVERSES[session.universe].label}</td>
                                <td>{session.mode === "qcm" ? "QCM" : "Cahier"}</td>
                                <td>{formatWhen(session.startedAt)}</td>
                                <td>
                                  {session.rewardEarned
                                    ? UNIVERSES[session.universe].rewardShort
                                    : session.finishedAt
                                      ? "Quittée sans étoile"
                                      : "En cours"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
