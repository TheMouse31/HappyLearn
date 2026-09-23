import { UNIVERSES } from "../data/universes";
import type {
  ChildSession,
  ClasseSession,
  ClassRecord,
  ClassStudent,
  ClassThemeCoverage,
  GradeLevel,
  PlayMode,
  SessionParticipant,
  SessionStatsFilters,
  StoredAnswer,
  StoredHint,
  SubjectSlug,
  UniverseSlug,
} from "../data/types";
import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import { generateClassCode } from "./classCode";
import {
  getDeviceId,
  loadLocalClassStudents,
  loadLocalClasses,
  loadLocalCollection,
  newId,
  saveLocalClassStudents,
  saveLocalClasses,
  saveLocalCollection,
} from "./localKeys";
import { getSupabase } from "./supabase";

export type CourseContext = {
  grade: GradeLevel | null;
  subject: SubjectSlug | null;
  classId?: string | null;
  classeSessionId?: string | null;
  eleveId?: string | null;
  missionId?: string | null;
};

export type JoinSessionResult =
  | { ok: true; participant: SessionParticipant; session: ClasseSession }
  | { ok: false; error: string };

function normalizeStudentPrenom(raw: string): string {
  return raw.trim().slice(0, 20);
}

function normalizeStudentNom(raw: string): string {
  return raw.trim().slice(0, 40);
}

function sameName(a: string, b: string): boolean {
  return a.localeCompare(b, "fr", { sensitivity: "base" }) === 0;
}

function sortStudents(items: ClassStudent[]): ClassStudent[] {
  return [...items].sort((a, b) => {
    const byPrenom = a.prenom.localeCompare(b.prenom, "fr", { sensitivity: "base" });
    if (byPrenom !== 0) return byPrenom;
    return a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" });
  });
}

const LOCAL_CLASSE_SESSIONS_KEY = "happy-learn-classe-sessions";
const LOCAL_PARTICIPANTS_KEY = "happy-learn-session-participants";
const LOCAL_THEME_COVERAGE_KEY = "happy-learn-class-theme-coverage";

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function isUniverse(value: unknown): value is UniverseSlug {
  return value === "football" || value === "rugby" || value === "equitation" || value === "espace";
}

function isMode(value: unknown): value is PlayMode {
  return value === "cahier" || value === "qcm";
}

function mapLocalClasseSession(row: ClasseSession): ClasseSession {
  return {
    ...row,
    niveau: row.niveau && isGradeLevel(row.niveau) ? row.niveau : null,
    matiere: row.matiere && isSubjectSlug(row.matiere) ? row.matiere : null,
    univers: row.univers && isUniverse(row.univers) ? row.univers : null,
    mode: row.mode && isMode(row.mode) ? row.mode : null,
  };
}

export type Persistence = {
  backend: "local" | "supabase";
  startSession: (
    prenom: string,
    universe: UniverseSlug,
    mode: PlayMode,
    classCode?: string | null,
    course?: CourseContext,
  ) => Promise<string>;
  saveAnswer: (answer: Omit<StoredAnswer, "createdAt">) => Promise<void>;
  saveHint: (hint: Omit<StoredHint, "openedAt">) => Promise<void>;
  finishSession: (sessionId: string, rewardEarned: boolean) => Promise<void>;
  loadCollection: () => Promise<UniverseSlug[]>;
  saveReward: (sessionId: string, universe: UniverseSlug) => Promise<UniverseSlug[]>;
  findClassByCode: (code: string) => Promise<ClassRecord | null>;
  listClasses: (teacherId: string) => Promise<ClassRecord[]>;
  createClass: (teacherId: string, nom: string) => Promise<ClassRecord>;
  renameClass: (classId: string, nom: string) => Promise<void>;
  listClassStudents: (classId: string) => Promise<ClassStudent[]>;
  listStudentsByClassCode: (code: string) => Promise<ClassStudent[]>;
  addClassStudent: (
    classId: string,
    prenom: string,
    nom?: string,
  ) => Promise<ClassStudent | string>;
  renameClassStudent: (
    studentId: string,
    prenom: string,
    nom?: string,
  ) => Promise<string | null>;
  removeClassStudent: (studentId: string) => Promise<void>;
  listSessionsByClassCode: (
    code: string,
    filters?: SessionStatsFilters,
  ) => Promise<ChildSession[]>;
  listAnswersBySessionIds: (sessionIds: string[]) => Promise<StoredAnswer[]>;
  listHintsBySessionIds: (sessionIds: string[]) => Promise<StoredHint[]>;
  openClassSession: (classId: string) => Promise<ClasseSession>;
  closeClassSession: (sessionId: string) => Promise<void>;
  getActiveClassSession: (classId: string) => Promise<ClasseSession | null>;
  findActiveSessionByCode: (code: string) => Promise<ClasseSession | null>;
  getClasseSessionById: (sessionId: string) => Promise<ClasseSession | null>;
  setSessionActivity: (
    sessionId: string,
    activity: {
      niveau: GradeLevel;
      matiere: SubjectSlug;
      missionId: string;
      /** Laissé null : l'élève choisit son univers. */
      univers?: UniverseSlug | null;
      mode: PlayMode;
    } | null,
  ) => Promise<ClasseSession | null>;
  joinSession: (sessionCode: string, eleveId: string) => Promise<JoinSessionResult>;
  heartbeat: (participantId: string) => Promise<void>;
  leaveSession: (participantId: string) => Promise<void>;
  listParticipants: (sessionId: string) => Promise<SessionParticipant[]>;
  kickParticipant: (participantId: string) => Promise<void>;
  setHandRaised: (participantId: string, raised: boolean) => Promise<SessionParticipant | null>;
  listClassMissionsDone: (classId: string) => Promise<string[]>;
  listClassSessionsHistory: (classId: string) => Promise<ClasseSession[]>;
  listClassThemeCoverage: (classId: string) => Promise<ClassThemeCoverage[]>;
  setThemeCoveredInClass: (
    classId: string,
    themeId: string,
    covered: boolean,
    note?: string,
  ) => Promise<ClassThemeCoverage>;
};

const SESSIONS_KEY = "mission-maths-sessions";
const ANSWERS_KEY = "mission-maths-answers";
const HINTS_KEY = "mission-maths-hints";

function applySessionFilters(
  sessions: ChildSession[],
  filters?: SessionStatsFilters,
): ChildSession[] {
  if (!filters) return sessions;
  return sessions.filter((session) => {
    if (filters.eleveId && session.eleveId !== filters.eleveId) return false;
    if (filters.classeSessionId && session.classeSessionId !== filters.classeSessionId) {
      return false;
    }
    if (filters.dateFrom && session.startedAt < filters.dateFrom) return false;
    if (filters.dateTo) {
      const end = filters.dateTo.includes("T") ? filters.dateTo : `${filters.dateTo}T23:59:59.999Z`;
      if (session.startedAt > end) return false;
    }
    return true;
  });
}

function mapRemoteClasseSession(row: {
  id: string;
  class_id: string;
  code: string;
  statut: string;
  niveau: string | null;
  matiere: string | null;
  mission_id: string | null;
  univers: string | null;
  mode: string | null;
  created_at: string;
  closed_at: string | null;
}): ClasseSession | null {
  if (row.statut !== "ouverte" && row.statut !== "fermee") return null;
  return {
    id: row.id,
    classId: row.class_id,
    code: row.code,
    statut: row.statut,
    niveau: isGradeLevel(row.niveau) ? row.niveau : null,
    matiere: isSubjectSlug(row.matiere) ? row.matiere : null,
    missionId: row.mission_id,
    univers: isUniverse(row.univers) ? row.univers : null,
    mode: isMode(row.mode) ? row.mode : null,
    createdAt: row.created_at,
    closedAt: row.closed_at,
  };
}

const PARTICIPANT_COLUMNS =
  "id, session_id, eleve_id, prenom, nom, device_id, statut, joined_at, last_seen_at, hand_raised, hand_raised_at";

function mapRemoteParticipant(row: {
  id: string;
  session_id: string;
  eleve_id: string;
  prenom: string;
  nom: string | null;
  device_id: string;
  statut: string;
  joined_at: string;
  last_seen_at: string;
  hand_raised?: boolean | null;
  hand_raised_at?: string | null;
}): SessionParticipant | null {
  if (row.statut !== "connecte" && row.statut !== "deconnecte") return null;
  return {
    id: row.id,
    sessionId: row.session_id,
    eleveId: row.eleve_id,
    prenom: row.prenom,
    nom: row.nom ?? "",
    deviceId: row.device_id,
    statut: row.statut,
    joinedAt: row.joined_at,
    lastSeenAt: row.last_seen_at,
    handRaised: Boolean(row.hand_raised),
    handRaisedAt: row.hand_raised_at ?? null,
  };
}

function mapRemoteSession(row: {
  id: string;
  device_id: string;
  prenom: string;
  univers: string;
  mode: string;
  started_at: string;
  finished_at: string | null;
  recompense_obtenue: boolean;
  code_classe: string | null;
  niveau?: string | null;
  matiere?: string | null;
  class_id?: string | null;
  classe_session_id?: string | null;
  eleve_id?: string | null;
  mission_id?: string | null;
}): ChildSession | null {
  if (!isUniverse(row.univers) || !isMode(row.mode)) return null;
  return {
    id: row.id,
    deviceId: row.device_id,
    prenom: row.prenom,
    universe: row.univers,
    mode: row.mode,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    rewardEarned: row.recompense_obtenue,
    classCode: row.code_classe,
    grade: isGradeLevel(row.niveau) ? row.niveau : null,
    subject: isSubjectSlug(row.matiere) ? row.matiere : null,
    classId: row.class_id ?? null,
    classeSessionId: row.classe_session_id ?? null,
    eleveId: row.eleve_id ?? null,
    missionId: row.mission_id ?? null,
  };
}

export const localPersistence: Persistence = {
  backend: "local",
  async startSession(prenom, universe, mode, classCode, course) {
    const session: ChildSession = {
      id: newId(),
      deviceId: getDeviceId(),
      prenom,
      universe,
      mode,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      rewardEarned: false,
      classCode: classCode || null,
      grade: course?.grade ?? null,
      subject: course?.subject ?? null,
      classId: course?.classId ?? null,
      classeSessionId: course?.classeSessionId ?? null,
      eleveId: course?.eleveId ?? null,
      missionId: course?.missionId ?? null,
    };
    const sessions = readJson<ChildSession[]>(SESSIONS_KEY, []);
    sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return session.id;
  },
  async saveAnswer(answer) {
    const answers = readJson<StoredAnswer[]>(ANSWERS_KEY, []);
    answers.push({
      ...answer,
      hintUsed: Boolean(answer.hintUsed),
      qcmOptionCount: answer.qcmOptionCount ?? null,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  },
  async saveHint(hint) {
    const hints = readJson<StoredHint[]>(HINTS_KEY, []);
    hints.push({ ...hint, openedAt: new Date().toISOString() });
    localStorage.setItem(HINTS_KEY, JSON.stringify(hints));
  },
  async finishSession(sessionId, rewardEarned) {
    const sessions = readJson<ChildSession[]>(SESSIONS_KEY, []);
    const next = sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            finishedAt: new Date().toISOString(),
            rewardEarned,
          }
        : session,
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
  },
  async loadCollection() {
    return loadLocalCollection();
  },
  async saveReward(sessionId, universe) {
    const current = loadLocalCollection();
    if (!current.includes(universe)) current.push(universe);
    saveLocalCollection(current);
    const sessions = readJson<ChildSession[]>(SESSIONS_KEY, []);
    const next = sessions.map((session) =>
      session.id === sessionId
        ? { ...session, rewardEarned: true, finishedAt: new Date().toISOString() }
        : session,
    );
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
    return current;
  },
  async findClassByCode(code) {
    const found = loadLocalClasses().find((item) => item.code === code);
    return found ? { id: found.id, nom: found.nom, code: found.code } : null;
  },
  async listClasses(teacherId) {
    return loadLocalClasses()
      .filter((item) => item.teacherId === teacherId)
      .map(({ id, nom, code }) => ({ id, nom, code }));
  },
  async createClass(teacherId, nom) {
    const classes = loadLocalClasses();
    let code = generateClassCode();
    while (classes.some((item) => item.code === code)) code = generateClassCode();
    const record = { id: newId(), nom, code, teacherId };
    classes.push(record);
    saveLocalClasses(classes);
    return { id: record.id, nom: record.nom, code: record.code };
  },
  async renameClass(classId, nom) {
    const next = loadLocalClasses().map((item) => (item.id === classId ? { ...item, nom } : item));
    saveLocalClasses(next);
  },
  async listClassStudents(classId) {
    return sortStudents(loadLocalClassStudents().filter((item) => item.classId === classId));
  },
  async listStudentsByClassCode(code) {
    const found = loadLocalClasses().find((item) => item.code === code);
    if (!found) return [];
    return localPersistence.listClassStudents(found.id);
  },
  async addClassStudent(classId, prenom, nom = "") {
    const nextPrenom = normalizeStudentPrenom(prenom);
    const nextNom = normalizeStudentNom(nom);
    if (!nextPrenom) return "Indique un prénom.";
    const all = loadLocalClassStudents();
    const duplicate = all.some(
      (item) =>
        item.classId === classId &&
        sameName(item.prenom, nextPrenom) &&
        sameName(item.nom, nextNom),
    );
    if (duplicate) return "Cet élève est déjà dans la liste.";
    const record: ClassStudent = { id: newId(), classId, prenom: nextPrenom, nom: nextNom };
    all.push(record);
    saveLocalClassStudents(all);
    return record;
  },
  async renameClassStudent(studentId, prenom, nom) {
    const nextPrenom = normalizeStudentPrenom(prenom);
    if (!nextPrenom) return "Indique un prénom.";
    const all = loadLocalClassStudents();
    const current = all.find((item) => item.id === studentId);
    if (!current) return "Élève introuvable.";
    const nextNom = nom === undefined ? current.nom : normalizeStudentNom(nom);
    const duplicate = all.some(
      (item) =>
        item.id !== studentId &&
        item.classId === current.classId &&
        sameName(item.prenom, nextPrenom) &&
        sameName(item.nom, nextNom),
    );
    if (duplicate) return "Cet élève est déjà dans la liste.";
    saveLocalClassStudents(
      all.map((item) =>
        item.id === studentId ? { ...item, prenom: nextPrenom, nom: nextNom } : item,
      ),
    );
    return null;
  },
  async removeClassStudent(studentId) {
    saveLocalClassStudents(loadLocalClassStudents().filter((item) => item.id !== studentId));
  },
  async listSessionsByClassCode(code, filters) {
    const sessions = readJson<ChildSession[]>(SESSIONS_KEY, [])
      .filter((session) => session.classCode === code)
      .map((session) => ({
        ...session,
        grade: session.grade ?? null,
        subject: session.subject ?? null,
        classId: session.classId ?? null,
        classeSessionId: session.classeSessionId ?? null,
        eleveId: session.eleveId ?? null,
        missionId: session.missionId ?? null,
      }));
    return applySessionFilters(sessions, filters);
  },
  async listAnswersBySessionIds(sessionIds) {
    if (sessionIds.length === 0) return [];
    const wanted = new Set(sessionIds);
    return readJson<StoredAnswer[]>(ANSWERS_KEY, []).filter((answer) => wanted.has(answer.sessionId));
  },
  async listHintsBySessionIds(sessionIds) {
    if (sessionIds.length === 0) return [];
    const wanted = new Set(sessionIds);
    return readJson<StoredHint[]>(HINTS_KEY, []).filter((hint) => wanted.has(hint.sessionId));
  },
  async openClassSession(classId) {
    const sessions = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []).map(mapLocalClasseSession);
    const now = new Date().toISOString();
    const next = sessions.map((item) =>
      item.classId === classId && item.statut === "ouverte"
        ? { ...item, statut: "fermee" as const, closedAt: now, missionId: null, univers: null, mode: null, niveau: null, matiere: null }
        : item,
    );
    let code = generateClassCode();
    while (next.some((item) => item.code === code)) code = generateClassCode();
    const created: ClasseSession = {
      id: newId(),
      classId,
      code,
      statut: "ouverte",
      niveau: null,
      matiere: null,
      missionId: null,
      univers: null,
      mode: null,
      createdAt: now,
      closedAt: null,
    };
    next.push(created);
    writeJson(LOCAL_CLASSE_SESSIONS_KEY, next);
    return created;
  },
  async closeClassSession(sessionId) {
    const sessions = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []);
    writeJson(
      LOCAL_CLASSE_SESSIONS_KEY,
      sessions.map((item) =>
        item.id === sessionId
          ? {
              ...item,
              statut: "fermee" as const,
              closedAt: new Date().toISOString(),
              missionId: null,
              univers: null,
              mode: null,
              niveau: null,
              matiere: null,
            }
          : item,
      ),
    );
  },
  async getActiveClassSession(classId) {
    const found = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []).find(
      (item) => item.classId === classId && item.statut === "ouverte",
    );
    return found ? mapLocalClasseSession(found) : null;
  },
  async findActiveSessionByCode(code) {
    const found = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []).find(
      (item) => item.code === code && item.statut === "ouverte",
    );
    return found ? mapLocalClasseSession(found) : null;
  },
  async getClasseSessionById(sessionId) {
    const found = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []).find(
      (item) => item.id === sessionId,
    );
    return found ? mapLocalClasseSession(found) : null;
  },
  async setSessionActivity(sessionId, activity) {
    const sessions = readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, []);
    let updated: ClasseSession | null = null;
    const next = sessions.map((item) => {
      if (item.id !== sessionId) return item;
      updated = mapLocalClasseSession({
        ...item,
        niveau: activity?.niveau ?? null,
        matiere: activity?.matiere ?? null,
        missionId: activity?.missionId ?? null,
        univers: activity?.univers ?? null,
        mode: activity?.mode ?? null,
      });
      return updated;
    });
    writeJson(LOCAL_CLASSE_SESSIONS_KEY, next);
    return updated;
  },
  async joinSession(sessionCode, eleveId) {
    const session = await localPersistence.findActiveSessionByCode(sessionCode);
    if (!session) return { ok: false, error: "Aucune session ouverte avec ce code." };
    const roster = await localPersistence.listClassStudents(session.classId);
    const eleve = roster.find((item) => item.id === eleveId);
    if (!eleve) return { ok: false, error: "Choisis ton nom dans la liste de ta classe." };
    const deviceId = getDeviceId();
    const participants = readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const existing = participants.find(
      (item) => item.sessionId === session.id && item.eleveId === eleveId,
    );
    if (existing) {
      if (existing.deviceId !== deviceId && existing.statut === "connecte") {
        return { ok: false, error: "Ce nom est déjà pris dans la session." };
      }
      if (existing.deviceId !== deviceId) {
        return { ok: false, error: "Ce nom est déjà pris dans la session." };
      }
      const reconnected: SessionParticipant = {
        ...existing,
        statut: "connecte",
        lastSeenAt: new Date().toISOString(),
        handRaised: existing.handRaised ?? false,
        handRaisedAt: existing.handRaisedAt ?? null,
      };
      writeJson(
        LOCAL_PARTICIPANTS_KEY,
        participants.map((item) => (item.id === existing.id ? reconnected : item)),
      );
      return { ok: true, participant: reconnected, session };
    }
    const created: SessionParticipant = {
      id: newId(),
      sessionId: session.id,
      eleveId,
      prenom: eleve.prenom,
      nom: eleve.nom,
      deviceId,
      statut: "connecte",
      joinedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      handRaised: false,
      handRaisedAt: null,
    };
    participants.push(created);
    writeJson(LOCAL_PARTICIPANTS_KEY, participants);
    return { ok: true, participant: created, session };
  },
  async heartbeat(participantId) {
    const participants = readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, []);
    writeJson(
      LOCAL_PARTICIPANTS_KEY,
      participants.map((item) =>
        item.id === participantId
          ? { ...item, lastSeenAt: new Date().toISOString(), statut: "connecte" as const }
          : item,
      ),
    );
  },
  async leaveSession(participantId) {
    const participants = readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, []);
    writeJson(
      LOCAL_PARTICIPANTS_KEY,
      participants.map((item) =>
        item.id === participantId
          ? {
              ...item,
              statut: "deconnecte" as const,
              lastSeenAt: new Date().toISOString(),
              handRaised: false,
              handRaisedAt: null,
            }
          : item,
      ),
    );
  },
  async listParticipants(sessionId) {
    return readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, [])
      .filter((item) => item.sessionId === sessionId)
      .map((item) => ({
        ...item,
        handRaised: Boolean(item.handRaised),
        handRaisedAt: item.handRaisedAt ?? null,
      }))
      .sort((a, b) => a.prenom.localeCompare(b.prenom, "fr", { sensitivity: "base" }));
  },
  async kickParticipant(participantId) {
    writeJson(
      LOCAL_PARTICIPANTS_KEY,
      readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, []).filter(
        (item) => item.id !== participantId,
      ),
    );
  },
  async setHandRaised(participantId, raised) {
    const participants = readJson<SessionParticipant[]>(LOCAL_PARTICIPANTS_KEY, []);
    const now = new Date().toISOString();
    let updated: SessionParticipant | null = null;
    writeJson(
      LOCAL_PARTICIPANTS_KEY,
      participants.map((item) => {
        if (item.id !== participantId) return item;
        updated = {
          ...item,
          handRaised: raised,
          handRaisedAt: raised ? now : null,
        };
        return updated;
      }),
    );
    return updated;
  },
  async listClassMissionsDone(classId) {
    const done = new Set<string>();
    for (const session of readJson<ChildSession[]>(SESSIONS_KEY, [])) {
      if (session.classId === classId && session.rewardEarned && session.missionId) {
        done.add(session.missionId);
      }
    }
    return [...done];
  },
  async listClassSessionsHistory(classId) {
    return readJson<ClasseSession[]>(LOCAL_CLASSE_SESSIONS_KEY, [])
      .filter((item) => item.classId === classId)
      .map(mapLocalClasseSession)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async listClassThemeCoverage(classId) {
    return readJson<ClassThemeCoverage[]>(LOCAL_THEME_COVERAGE_KEY, []).filter(
      (item) => item.classId === classId,
    );
  },
  async setThemeCoveredInClass(classId, themeId, covered, note = "") {
    const all = readJson<ClassThemeCoverage[]>(LOCAL_THEME_COVERAGE_KEY, []);
    const now = new Date().toISOString();
    const next: ClassThemeCoverage = {
      classId,
      themeId,
      coveredInClass: covered,
      coveredAt: covered ? now : null,
      note: note.trim(),
    };
    const idx = all.findIndex((item) => item.classId === classId && item.themeId === themeId);
    if (idx >= 0) all[idx] = next;
    else all.push(next);
    writeJson(LOCAL_THEME_COVERAGE_KEY, all);
    return next;
  },
};

export async function createPersistence(): Promise<Persistence> {
  const client = getSupabase();
  if (!client) return localPersistence;
  const deviceId = getDeviceId();

  const supabasePersistence: Persistence = {
    backend: "supabase",
    async startSession(prenom, universe, mode, classCode, course) {
      const { data, error } = await client
        .from("sessions_enfant")
        .insert({
          device_id: deviceId,
          prenom,
          univers: universe,
          mode,
          code_classe: classCode || null,
          niveau: course?.grade ?? null,
          matiere: course?.subject ?? null,
          class_id: course?.classId ?? null,
          classe_session_id: course?.classeSessionId ?? null,
          eleve_id: course?.eleveId ?? null,
          mission_id: course?.missionId ?? null,
        })
        .select("id")
        .single();
      if (error || !data) {
        return localPersistence.startSession(prenom, universe, mode, classCode, course);
      }
      return data.id as string;
    },
    async saveAnswer(answer) {
      const { error } = await client.from("reponses").insert({
        session_id: answer.sessionId,
        etape_id: answer.stepId,
        brut: answer.raw,
        correct: answer.correct,
        attempts: answer.attempts,
        hint_used: Boolean(answer.hintUsed),
        qcm_option_count: answer.qcmOptionCount ?? null,
      });
      if (error) await localPersistence.saveAnswer(answer);
    },
    async saveHint(hint) {
      const { error } = await client.from("session_hints").insert({
        session_id: hint.sessionId,
        etape_id: hint.stepId,
      });
      if (error) await localPersistence.saveHint(hint);
    },
    async finishSession(sessionId, rewardEarned) {
      const { error } = await client
        .from("sessions_enfant")
        .update({
          finished_at: new Date().toISOString(),
          recompense_obtenue: rewardEarned,
        })
        .eq("id", sessionId);
      if (error) await localPersistence.finishSession(sessionId, rewardEarned);
    },
    async loadCollection() {
      const { data, error } = await client
        .from("collection")
        .select("univers")
        .eq("device_id", deviceId);
      if (error || !data) return localPersistence.loadCollection();
      const remote = data.map((row) => row.univers).filter(isUniverse);
      saveLocalCollection(remote);
      return remote;
    },
    async saveReward(sessionId, universe) {
      await client
        .from("sessions_enfant")
        .update({
          finished_at: new Date().toISOString(),
          recompense_obtenue: true,
        })
        .eq("id", sessionId);
      const { error } = await client.from("collection").upsert(
        {
          device_id: deviceId,
          session_id: sessionId,
          univers: universe,
          recompense: UNIVERSES[universe].rewardShort,
        },
        { onConflict: "device_id,univers" },
      );
      if (error) return localPersistence.saveReward(sessionId, universe);
      return supabasePersistence.loadCollection();
    },
    async findClassByCode(code) {
      const { data, error } = await client.from("classes").select("id, nom, code").eq("code", code).maybeSingle();
      if (error || !data) return localPersistence.findClassByCode(code);
      return data as ClassRecord;
    },
    async listClasses(teacherId) {
      const { data, error } = await client
        .from("classes")
        .select("id, nom, code")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: true });
      if (error || !data) return localPersistence.listClasses(teacherId);
      return data as ClassRecord[];
    },
    async createClass(teacherId, nom) {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const code = generateClassCode();
        const { data, error } = await client
          .from("classes")
          .insert({ teacher_id: teacherId, nom, code })
          .select("id, nom, code")
          .single();
        if (!error && data) return data as ClassRecord;
      }
      return localPersistence.createClass(teacherId, nom);
    },
    async renameClass(classId, nom) {
      const { error } = await client.from("classes").update({ nom }).eq("id", classId);
      if (error) await localPersistence.renameClass(classId, nom);
    },
    async listClassStudents(classId) {
      const { data, error } = await client
        .from("eleves_classe")
        .select("id, class_id, prenom, nom")
        .eq("class_id", classId)
        .order("prenom", { ascending: true });
      if (error || !data) return localPersistence.listClassStudents(classId);
      return sortStudents(
        data.map((row) => ({
          id: row.id as string,
          classId: row.class_id as string,
          prenom: row.prenom as string,
          nom: (row.nom as string | null) ?? "",
        })),
      );
    },
    async listStudentsByClassCode(code) {
      const found = await supabasePersistence.findClassByCode(code);
      if (!found) return [];
      return supabasePersistence.listClassStudents(found.id);
    },
    async addClassStudent(classId, prenom, nom = "") {
      const nextPrenom = normalizeStudentPrenom(prenom);
      const nextNom = normalizeStudentNom(nom);
      if (!nextPrenom) return "Indique un prénom.";
      const { data, error } = await client
        .from("eleves_classe")
        .insert({ class_id: classId, prenom: nextPrenom, nom: nextNom })
        .select("id, class_id, prenom, nom")
        .single();
      if (error || !data) {
        if (error?.code === "23505") return "Cet élève est déjà dans la liste.";
        return localPersistence.addClassStudent(classId, nextPrenom, nextNom);
      }
      return {
        id: data.id as string,
        classId: data.class_id as string,
        prenom: data.prenom as string,
        nom: (data.nom as string | null) ?? "",
      };
    },
    async renameClassStudent(studentId, prenom, nom) {
      const nextPrenom = normalizeStudentPrenom(prenom);
      if (!nextPrenom) return "Indique un prénom.";
      const patch: { prenom: string; nom?: string } = { prenom: nextPrenom };
      if (nom !== undefined) patch.nom = normalizeStudentNom(nom);
      const { error } = await client.from("eleves_classe").update(patch).eq("id", studentId);
      if (error) {
        if (error.code === "23505") return "Cet élève est déjà dans la liste.";
        return localPersistence.renameClassStudent(studentId, nextPrenom, nom);
      }
      return null;
    },
    async removeClassStudent(studentId) {
      const { error } = await client.from("eleves_classe").delete().eq("id", studentId);
      if (error) await localPersistence.removeClassStudent(studentId);
    },
    async listSessionsByClassCode(code, filters) {
      let query = client
        .from("sessions_enfant")
        .select(
          "id, device_id, prenom, univers, mode, started_at, finished_at, recompense_obtenue, code_classe, niveau, matiere, class_id, classe_session_id, eleve_id, mission_id",
        )
        .eq("code_classe", code)
        .order("started_at", { ascending: false });
      if (filters?.eleveId) query = query.eq("eleve_id", filters.eleveId);
      if (filters?.classeSessionId) query = query.eq("classe_session_id", filters.classeSessionId);
      if (filters?.dateFrom) query = query.gte("started_at", filters.dateFrom);
      if (filters?.dateTo) {
        const end = filters.dateTo.includes("T") ? filters.dateTo : `${filters.dateTo}T23:59:59.999Z`;
        query = query.lte("started_at", end);
      }
      const { data, error } = await query;
      if (error || !data) return localPersistence.listSessionsByClassCode(code, filters);
      return data
        .map((row) => mapRemoteSession(row as Parameters<typeof mapRemoteSession>[0]))
        .filter((item): item is ChildSession => item !== null);
    },
    async listAnswersBySessionIds(sessionIds) {
      if (sessionIds.length === 0) return [];
      const { data, error } = await client
        .from("reponses")
        .select("session_id, etape_id, brut, correct, attempts, created_at, hint_used, qcm_option_count")
        .in("session_id", sessionIds);
      if (error || !data) return localPersistence.listAnswersBySessionIds(sessionIds);
      return data.map((row) => ({
        sessionId: row.session_id as string,
        stepId: row.etape_id as string,
        raw: row.brut as string,
        correct: Boolean(row.correct),
        attempts: Number(row.attempts ?? 1),
        createdAt: (row.created_at as string) ?? new Date().toISOString(),
        hintUsed: Boolean(row.hint_used),
        qcmOptionCount:
          row.qcm_option_count == null ? null : Number(row.qcm_option_count),
      }));
    },
    async listHintsBySessionIds(sessionIds) {
      if (sessionIds.length === 0) return [];
      const { data, error } = await client
        .from("session_hints")
        .select("session_id, etape_id, opened_at")
        .in("session_id", sessionIds);
      if (error || !data) return localPersistence.listHintsBySessionIds(sessionIds);
      return data.map((row) => ({
        sessionId: row.session_id as string,
        stepId: row.etape_id as string,
        openedAt: (row.opened_at as string) ?? new Date().toISOString(),
      }));
    },
    async openClassSession(classId) {
      const now = new Date().toISOString();
      const closeRes = await client
        .from("classe_sessions")
        .update({
          statut: "fermee",
          closed_at: now,
          mission_id: null,
          univers: null,
          mode: null,
          niveau: null,
          matiere: null,
        })
        .eq("class_id", classId)
        .eq("statut", "ouverte");
      if (closeRes.error) {
        throw new Error(
          closeRes.error.message || "Impossible de fermer la session précédente.",
        );
      }

      let lastInsertError: string | null = null;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const code = generateClassCode();
        const { data, error } = await client
          .from("classe_sessions")
          .insert({ class_id: classId, code, statut: "ouverte" })
          .select(
            "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
          )
          .single();
        if (!error && data) {
          const mapped = mapRemoteClasseSession(data as Parameters<typeof mapRemoteClasseSession>[0]);
          if (mapped) return mapped;
          lastInsertError = "Réponse session invalide.";
          continue;
        }
        lastInsertError = error?.message ?? "Insertion refusée.";
        // Collision de code → réessayer ; autres erreurs (RLS, contrainte) → arrêter.
        const isCodeCollision =
          error?.code === "23505" ||
          /duplicate|unique|code/i.test(error?.message ?? "");
        if (!isCodeCollision) break;
      }
      throw new Error(
        lastInsertError ||
          "Impossible d’ouvrir la session live (Supabase). Réessaie ou reconnecte-toi.",
      );
    },
    async closeClassSession(sessionId) {
      const { error } = await client
        .from("classe_sessions")
        .update({
          statut: "fermee",
          closed_at: new Date().toISOString(),
          mission_id: null,
          univers: null,
          mode: null,
          niveau: null,
          matiere: null,
        })
        .eq("id", sessionId);
      if (error) await localPersistence.closeClassSession(sessionId);
    },
    async getActiveClassSession(classId) {
      const { data, error } = await client
        .from("classe_sessions")
        .select(
          "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
        )
        .eq("class_id", classId)
        .eq("statut", "ouverte")
        .maybeSingle();
      if (error || !data) return localPersistence.getActiveClassSession(classId);
      return mapRemoteClasseSession(data as Parameters<typeof mapRemoteClasseSession>[0]);
    },
    async findActiveSessionByCode(code) {
      const { data, error } = await client
        .from("classe_sessions")
        .select(
          "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
        )
        .eq("code", code)
        .eq("statut", "ouverte")
        .maybeSingle();
      if (error || !data) return localPersistence.findActiveSessionByCode(code);
      return mapRemoteClasseSession(data as Parameters<typeof mapRemoteClasseSession>[0]);
    },
    async getClasseSessionById(sessionId) {
      const { data, error } = await client
        .from("classe_sessions")
        .select(
          "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
        )
        .eq("id", sessionId)
        .maybeSingle();
      if (error || !data) return localPersistence.getClasseSessionById(sessionId);
      return mapRemoteClasseSession(data as Parameters<typeof mapRemoteClasseSession>[0]);
    },
    async setSessionActivity(sessionId, activity) {
      const { data, error } = await client
        .from("classe_sessions")
        .update({
          niveau: activity?.niveau ?? null,
          matiere: activity?.matiere ?? null,
          mission_id: activity?.missionId ?? null,
          univers: activity?.univers ?? null,
          mode: activity?.mode ?? null,
        })
        .eq("id", sessionId)
        .select(
          "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
        )
        .single();
      if (error || !data) return localPersistence.setSessionActivity(sessionId, activity);
      return mapRemoteClasseSession(data as Parameters<typeof mapRemoteClasseSession>[0]);
    },
    async joinSession(sessionCode, eleveId) {
      const session = await supabasePersistence.findActiveSessionByCode(sessionCode);
      if (!session) return { ok: false, error: "Aucune session ouverte avec ce code." };
      const roster = await supabasePersistence.listClassStudents(session.classId);
      const eleve = roster.find((item) => item.id === eleveId);
      if (!eleve) return { ok: false, error: "Choisis ton nom dans la liste de ta classe." };

      const { data: existingRows, error: existingError } = await client
        .from("session_participants")
        .select(PARTICIPANT_COLUMNS)
        .eq("session_id", session.id)
        .eq("eleve_id", eleveId)
        .maybeSingle();

      if (!existingError && existingRows) {
        const existing = mapRemoteParticipant(
          existingRows as Parameters<typeof mapRemoteParticipant>[0],
        );
        if (!existing) return { ok: false, error: "Impossible de rejoindre la session." };
        if (existing.deviceId !== deviceId) {
          return { ok: false, error: "Ce nom est déjà pris dans la session." };
        }
        const { data: updated, error: updateError } = await client
          .from("session_participants")
          .update({
            statut: "connecte",
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select(PARTICIPANT_COLUMNS)
          .single();
        if (updateError || !updated) {
          return localPersistence.joinSession(sessionCode, eleveId);
        }
        const participant = mapRemoteParticipant(
          updated as Parameters<typeof mapRemoteParticipant>[0],
        );
        if (!participant) return { ok: false, error: "Impossible de rejoindre la session." };
        return { ok: true, participant, session };
      }

      const { data, error } = await client
        .from("session_participants")
        .insert({
          session_id: session.id,
          eleve_id: eleveId,
          prenom: eleve.prenom,
          nom: eleve.nom,
          device_id: deviceId,
          statut: "connecte",
        })
        .select(PARTICIPANT_COLUMNS)
        .single();

      if (error || !data) {
        if (error?.code === "23505") {
          return { ok: false, error: "Ce nom est déjà pris dans la session." };
        }
        return localPersistence.joinSession(sessionCode, eleveId);
      }
      const participant = mapRemoteParticipant(data as Parameters<typeof mapRemoteParticipant>[0]);
      if (!participant) return { ok: false, error: "Impossible de rejoindre la session." };
      return { ok: true, participant, session };
    },
    async heartbeat(participantId) {
      const { error } = await client
        .from("session_participants")
        .update({
          last_seen_at: new Date().toISOString(),
          statut: "connecte",
        })
        .eq("id", participantId);
      if (error) await localPersistence.heartbeat(participantId);
    },
    async leaveSession(participantId) {
      const { error } = await client
        .from("session_participants")
        .update({
          statut: "deconnecte",
          last_seen_at: new Date().toISOString(),
          hand_raised: false,
          hand_raised_at: null,
        })
        .eq("id", participantId);
      if (error) await localPersistence.leaveSession(participantId);
    },
    async listParticipants(sessionId) {
      const { data, error } = await client
        .from("session_participants")
        .select(PARTICIPANT_COLUMNS)
        .eq("session_id", sessionId)
        .order("prenom", { ascending: true });
      if (error || !data) return localPersistence.listParticipants(sessionId);
      return data
        .map((row) => mapRemoteParticipant(row as Parameters<typeof mapRemoteParticipant>[0]))
        .filter((item): item is SessionParticipant => item !== null);
    },
    async kickParticipant(participantId) {
      const { error } = await client.from("session_participants").delete().eq("id", participantId);
      if (error) await localPersistence.kickParticipant(participantId);
    },
    async setHandRaised(participantId, raised) {
      const now = new Date().toISOString();
      const { data, error } = await client
        .from("session_participants")
        .update({
          hand_raised: raised,
          hand_raised_at: raised ? now : null,
        })
        .eq("id", participantId)
        .select(PARTICIPANT_COLUMNS)
        .single();
      if (error || !data) return localPersistence.setHandRaised(participantId, raised);
      return mapRemoteParticipant(data as Parameters<typeof mapRemoteParticipant>[0]);
    },
    async listClassMissionsDone(classId) {
      const { data, error } = await client
        .from("sessions_enfant")
        .select("mission_id")
        .eq("class_id", classId)
        .eq("recompense_obtenue", true)
        .not("mission_id", "is", null);
      if (error || !data) return localPersistence.listClassMissionsDone(classId);
      return [
        ...new Set(
          data
            .map((row) => row.mission_id as string | null)
            .filter((id): id is string => typeof id === "string" && id.length > 0),
        ),
      ];
    },
    async listClassSessionsHistory(classId) {
      const { data, error } = await client
        .from("classe_sessions")
        .select(
          "id, class_id, code, statut, niveau, matiere, mission_id, univers, mode, created_at, closed_at",
        )
        .eq("class_id", classId)
        .order("created_at", { ascending: false });
      if (error || !data) return localPersistence.listClassSessionsHistory(classId);
      return data
        .map((row) => mapRemoteClasseSession(row as Parameters<typeof mapRemoteClasseSession>[0]))
        .filter((item): item is ClasseSession => item !== null);
    },
    async listClassThemeCoverage(classId) {
      const { data, error } = await client
        .from("classe_programme_couverture")
        .select("class_id, theme_id, covered_in_class, covered_at, note")
        .eq("class_id", classId);
      if (error || !data) return localPersistence.listClassThemeCoverage(classId);
      return data.map((row) => ({
        classId: row.class_id as string,
        themeId: row.theme_id as string,
        coveredInClass: Boolean(row.covered_in_class),
        coveredAt: (row.covered_at as string | null) ?? null,
        note: (row.note as string) ?? "",
      }));
    },
    async setThemeCoveredInClass(classId, themeId, covered, note = "") {
      const payload = {
        class_id: classId,
        theme_id: themeId,
        covered_in_class: covered,
        covered_at: covered ? new Date().toISOString() : null,
        note: note.trim(),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await client
        .from("classe_programme_couverture")
        .upsert(payload, { onConflict: "class_id,theme_id" })
        .select("class_id, theme_id, covered_in_class, covered_at, note")
        .maybeSingle();
      if (error || !data) {
        return localPersistence.setThemeCoveredInClass(classId, themeId, covered, note);
      }
      return {
        classId: data.class_id as string,
        themeId: data.theme_id as string,
        coveredInClass: Boolean(data.covered_in_class),
        coveredAt: (data.covered_at as string | null) ?? null,
        note: (data.note as string) ?? "",
      };
    },
  };

  return supabasePersistence;
}
