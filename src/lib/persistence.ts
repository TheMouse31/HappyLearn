import { UNIVERSES } from "../data/universes";
import type { ChildSession, ClassRecord, GradeLevel, PlayMode, StoredAnswer, SubjectSlug, UniverseSlug } from "../data/types";
import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import { generateClassCode } from "./classCode";
import {
  getDeviceId,
  loadLocalClasses,
  loadLocalCollection,
  newId,
  saveLocalClasses,
  saveLocalCollection,
} from "./localKeys";
import { getSupabase } from "./supabase";

export type CourseContext = {
  grade: GradeLevel | null;
  subject: SubjectSlug | null;
};

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
  finishSession: (sessionId: string, rewardEarned: boolean) => Promise<void>;
  loadCollection: () => Promise<UniverseSlug[]>;
  saveReward: (sessionId: string, universe: UniverseSlug) => Promise<UniverseSlug[]>;
  findClassByCode: (code: string) => Promise<ClassRecord | null>;
  listClasses: (teacherId: string) => Promise<ClassRecord[]>;
  createClass: (teacherId: string, nom: string) => Promise<ClassRecord>;
  renameClass: (classId: string, nom: string) => Promise<void>;
  listSessionsByClassCode: (code: string) => Promise<ChildSession[]>;
  listAnswersBySessionIds: (sessionIds: string[]) => Promise<StoredAnswer[]>;
};

const SESSIONS_KEY = "mission-maths-sessions";
const ANSWERS_KEY = "mission-maths-answers";

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function isUniverse(value: unknown): value is UniverseSlug {
  return value === "football" || value === "rugby" || value === "equitation" || value === "espace";
}

function isMode(value: unknown): value is PlayMode {
  return value === "cahier" || value === "qcm";
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
    };
    const sessions = readJson<ChildSession[]>(SESSIONS_KEY, []);
    sessions.push(session);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return session.id;
  },
  async saveAnswer(answer) {
    const answers = readJson<StoredAnswer[]>(ANSWERS_KEY, []);
    answers.push({ ...answer, createdAt: new Date().toISOString() });
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
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
  async listSessionsByClassCode(code) {
    return readJson<ChildSession[]>(SESSIONS_KEY, [])
      .filter((session) => session.classCode === code)
      .map((session) => ({
        ...session,
        grade: session.grade ?? null,
        subject: session.subject ?? null,
      }));
  },
  async listAnswersBySessionIds(sessionIds) {
    if (sessionIds.length === 0) return [];
    const wanted = new Set(sessionIds);
    return readJson<StoredAnswer[]>(ANSWERS_KEY, []).filter((answer) => wanted.has(answer.sessionId));
  },
};

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
  };
}

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
      });
      if (error) await localPersistence.saveAnswer(answer);
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
    async listSessionsByClassCode(code) {
      const { data, error } = await client
        .from("sessions_enfant")
        .select("id, device_id, prenom, univers, mode, started_at, finished_at, recompense_obtenue, code_classe, niveau, matiere")
        .eq("code_classe", code)
        .order("started_at", { ascending: false });
      if (error || !data) return localPersistence.listSessionsByClassCode(code);
      return data
        .map((row) => mapRemoteSession(row as Parameters<typeof mapRemoteSession>[0]))
        .filter((item): item is ChildSession => item !== null);
    },
    async listAnswersBySessionIds(sessionIds) {
      if (sessionIds.length === 0) return [];
      const { data, error } = await client
        .from("reponses")
        .select("session_id, etape_id, brut, correct, attempts, created_at")
        .in("session_id", sessionIds);
      if (error || !data) return localPersistence.listAnswersBySessionIds(sessionIds);
      return data.map((row) => ({
        sessionId: row.session_id as string,
        stepId: row.etape_id as string,
        raw: row.brut as string,
        correct: Boolean(row.correct),
        attempts: Number(row.attempts ?? 1),
        createdAt: (row.created_at as string) ?? new Date().toISOString(),
      }));
    },
  };

  return supabasePersistence;
}
