import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import type { AppRole, ClassRecord, GradeLevel, PlayMode, SubjectSlug, TeacherAccount, UniverseSlug } from "../data/types";
import { isValidClassCode, normalizeClassCode } from "./classCode";
import { teacherAuthMessage, isEmail } from "./authMessages";
import {
  clearCourse,
  clearLocalTeacher,
  clearPrenom,
  loadActiveClassId,
  loadClassCode,
  loadCourseGrade,
  loadCourseSubject,
  loadLocalTeacher,
  loadPrenom,
  saveActiveClassId,
  saveClassCode,
  saveCourse,
  saveLocalTeacher,
  savePrenom,
} from "./localKeys";
import { createPersistence, localPersistence, type Persistence } from "./persistence";
import { getSupabase } from "./supabase";

type SessionState = {
  ready: boolean;
  backend: "local" | "supabase";
  role: AppRole | null;
  prenom: string;
  classCode: string;
  className: string;
  grade: GradeLevel | null;
  subject: SubjectSlug | null;
  universe: UniverseSlug | null;
  mode: PlayMode | null;
  collection: UniverseSlug[];
  sessionId: string | null;
  rewardPending: boolean;
  teacher: TeacherAccount | null;
  classes: ClassRecord[];
  setPrenom: (value: string) => void;
  setCourse: (grade: GradeLevel, subject: SubjectSlug) => void;
  setUniverse: (value: UniverseSlug) => void;
  setMode: (value: PlayMode) => void;
  loginEleve: (prenom: string, code: string) => Promise<string | null>;
  loginTeacherPassword: (email: string, password: string, mode: "connexion" | "inscription") => Promise<string | null>;
  loginTeacherMagic: (email: string) => Promise<string | null>;
  loginTeacherLocal: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  ensureClass: (nom?: string) => Promise<ClassRecord | null>;
  createClass: (nom: string) => Promise<ClassRecord | null>;
  renameClass: (classId: string, nom: string) => Promise<void>;
  loadClassSessions: (code: string) => ReturnType<Persistence["listSessionsByClassCode"]>;
  loadClassAnswers: (sessionIds: string[]) => ReturnType<Persistence["listAnswersBySessionIds"]>;
  activeClassId: string | null;
  setActiveClassId: (classId: string) => void;
  startMission: () => Promise<void>;
  recordAnswer: (stepId: string, raw: string, correct: boolean, attempts: number) => Promise<void>;
  completeMission: () => Promise<void>;
  quitMission: () => Promise<void>;
  resetToHome: () => void;
  pickAnotherUniverse: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

async function restoreTeacher(): Promise<TeacherAccount | null> {
  const client = getSupabase();
  if (client) {
    const { data } = await client.auth.getSession();
    const user = data.session?.user;
    if (user?.email) {
      await client.from("profils_enseignants").upsert({
        user_id: user.id,
        display_name: user.email.split("@")[0],
      });
      return { id: user.id, email: user.email, backend: "supabase" };
    }
  }
  const local = loadLocalTeacher();
  if (!local) return null;
  return { ...local, backend: "local" };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [persistence, setPersistence] = useState<Persistence | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [prenom, setPrenomState] = useState("");
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [subject, setSubject] = useState<SubjectSlug | null>(null);
  const [universe, setUniverse] = useState<UniverseSlug | null>(null);
  const [mode, setMode] = useState<PlayMode | null>(null);
  const [collection, setCollection] = useState<UniverseSlug[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewardPending, setRewardPending] = useState(false);
  const [teacher, setTeacher] = useState<TeacherAccount | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [activeClassId, setActiveClassIdState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const store = await createPersistence();
      const saved = await store.loadCollection();
      const teacherAccount = await restoreTeacher();
      if (cancelled) return;
      setPersistence(store);
      setCollection(saved);
      if (teacherAccount) {
        const list = await store.listClasses(teacherAccount.id);
        if (cancelled) return;
        setTeacher(teacherAccount);
        setClasses(list);
        const savedActive = loadActiveClassId();
        const validActive = list.some((item) => item.id === savedActive) ? savedActive : list[0]?.id ?? null;
        setActiveClassIdState(validActive);
        if (validActive) saveActiveClassId(validActive);
        setRole("enseignant");
      } else {
        const savedPrenom = loadPrenom();
        const savedCode = loadClassCode();
        setPrenomState(savedPrenom);
        setClassCode(savedCode);
        setGrade(loadCourseGrade());
        setSubject(loadCourseSubject());
        if (savedPrenom) setRole("eleve");
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<SessionState>(
    () => ({
      ready,
      backend: persistence?.backend ?? "local",
      role,
      prenom,
      classCode,
      className,
      grade,
      subject,
      universe,
      mode,
      collection,
      sessionId,
      rewardPending,
      teacher,
      classes,
      setPrenom: (value) => {
        const next = value.trim().slice(0, 20);
        setPrenomState(next);
        savePrenom(next);
      },
      setCourse: (nextGrade, nextSubject) => {
        if (!isGradeLevel(nextGrade) || !isSubjectSlug(nextSubject)) return;
        setGrade(nextGrade);
        setSubject(nextSubject);
        saveCourse(nextGrade, nextSubject);
      },
      setUniverse,
      setMode,
      loginEleve: async (rawPrenom, rawCode) => {
        const next = rawPrenom.trim().slice(0, 20);
        if (!next) return "Écris d’abord ton prénom ou un surnom.";
        const store = persistence ?? localPersistence;
        const code = normalizeClassCode(rawCode);
        if (rawCode.trim() && !isValidClassCode(code)) {
          return "Le code classe a 4 à 8 lettres ou chiffres, sans espace.";
        }
        if (code) {
          const found = await store.findClassByCode(code);
          if (found) setClassName(found.nom);
          else if (store.backend === "supabase") {
            return "Ce code classe n’est pas reconnu. Demande-le à ton professeur, ou laisse vide à la maison.";
          }
        } else {
          setClassName("");
        }
        setPrenomState(next);
        savePrenom(next);
        setClassCode(code);
        saveClassCode(code);
        setTeacher(null);
        setRole("eleve");
        return null;
      },
      loginTeacherPassword: async (email, password, authMode) => {
        if (!isEmail(email)) return "Indique un e-mail professionnel valide.";
        if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
        const client = getSupabase();
        if (!client) return "local";
        const result =
          authMode === "inscription"
            ? await client.auth.signUp({ email: email.trim(), password })
            : await client.auth.signInWithPassword({ email: email.trim(), password });
        if (result.error) return teacherAuthMessage(result.error.message);
        const user = result.data.user;
        const session = result.data.session;
        if (!session || !user?.email) {
          return authMode === "inscription"
            ? "Compte créé. Confirme l’e-mail reçu, puis reconnecte-toi."
            : "Connexion incomplète. Réessaie.";
        }
        await client.from("profils_enseignants").upsert({
          user_id: user.id,
          display_name: user.email.split("@")[0],
        });
        const account: TeacherAccount = { id: user.id, email: user.email, backend: "supabase" };
        const store = persistence ?? (await createPersistence());
        setPersistence(store);
        let list = await store.listClasses(account.id);
        if (list.length === 0) {
          const created = await store.createClass(account.id, "Ma classe");
          list = [created];
        }
        setTeacher(account);
        setClasses(list);
        setActiveClassIdState(list[0]?.id ?? null);
        if (list[0]) saveActiveClassId(list[0].id);
        setRole("enseignant");
        return null;
      },
      loginTeacherMagic: async (email) => {
        if (!isEmail(email)) return "Indique un e-mail professionnel valide.";
        const client = getSupabase();
        if (!client) return "local";
        const { error } = await client.auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) return teacherAuthMessage(error.message);
        return "sent";
      },
      loginTeacherLocal: async (email) => {
        if (!isEmail(email)) return "Indique un e-mail valide pour retrouver cet espace sur l’appareil.";
        const account: TeacherAccount = {
          id: `local-${email.trim().toLowerCase()}`,
          email: email.trim().toLowerCase(),
          backend: "local",
        };
        saveLocalTeacher(account);
        const store = persistence ?? localPersistence;
        let list = await store.listClasses(account.id);
        if (list.length === 0) {
          const created = await store.createClass(account.id, "Ma classe");
          list = [created];
        }
        setTeacher(account);
        setClasses(list);
        setActiveClassIdState(list[0]?.id ?? null);
        if (list[0]) saveActiveClassId(list[0].id);
        setRole("enseignant");
        return null;
      },
      logout: async () => {
        const client = getSupabase();
        if (client) await client.auth.signOut();
        clearLocalTeacher();
        clearPrenom();
        clearCourse();
        saveClassCode("");
        saveActiveClassId(null);
        setTeacher(null);
        setClasses([]);
        setActiveClassIdState(null);
        setPrenomState("");
        setClassCode("");
        setClassName("");
        setGrade(null);
        setSubject(null);
        setUniverse(null);
        setMode(null);
        setSessionId(null);
        setRewardPending(false);
        setRole(null);
      },
      ensureClass: async (nom = "Ma classe") => {
        if (!persistence || !teacher) return null;
        if (classes.length > 0) {
          const current = classes.find((item) => item.id === activeClassId) ?? classes[0];
          return current;
        }
        const created = await persistence.createClass(teacher.id, nom);
        setClasses([created]);
        setActiveClassIdState(created.id);
        saveActiveClassId(created.id);
        return created;
      },
      createClass: async (nom) => {
        if (!persistence || !teacher) return null;
        const label = nom.trim().slice(0, 40) || `Classe ${classes.length + 1}`;
        const created = await persistence.createClass(teacher.id, label);
        setClasses((current) => [...current, created]);
        setActiveClassIdState(created.id);
        saveActiveClassId(created.id);
        return created;
      },
      renameClass: async (classId, nom) => {
        if (!persistence) return;
        await persistence.renameClass(classId, nom);
        setClasses((current) => current.map((item) => (item.id === classId ? { ...item, nom } : item)));
      },
      loadClassSessions: async (code) => {
        const store = persistence ?? localPersistence;
        return store.listSessionsByClassCode(code);
      },
      loadClassAnswers: async (sessionIds) => {
        const store = persistence ?? localPersistence;
        return store.listAnswersBySessionIds(sessionIds);
      },
      activeClassId,
      setActiveClassId: (classId) => {
        setActiveClassIdState(classId);
        saveActiveClassId(classId);
      },
      startMission: async () => {
        if (!persistence || !prenom || !universe || !mode) return;
        const id = await persistence.startSession(prenom, universe, mode, classCode || null, {
          grade,
          subject,
        });
        setSessionId(id);
        setRewardPending(false);
      },
      recordAnswer: async (stepId, raw, correct, attempts) => {
        if (!persistence || !sessionId) return;
        await persistence.saveAnswer({ sessionId, stepId, raw, correct, attempts });
      },
      completeMission: async () => {
        if (!persistence || !sessionId || !universe) return;
        setRewardPending(true);
        const next = await persistence.saveReward(sessionId, universe);
        setCollection(next);
      },
      quitMission: async () => {
        if (persistence && sessionId) {
          await persistence.finishSession(sessionId, false);
        }
        setSessionId(null);
        setRewardPending(false);
      },
      resetToHome: () => {
        setUniverse(null);
        setMode(null);
        setSessionId(null);
        setRewardPending(false);
      },
      pickAnotherUniverse: () => {
        setUniverse(null);
        setMode(null);
        setSessionId(null);
        setRewardPending(false);
      },
    }),
    [
      ready,
      persistence,
      role,
      prenom,
      classCode,
      className,
      grade,
      subject,
      universe,
      mode,
      collection,
      sessionId,
      rewardPending,
      teacher,
      classes,
      activeClassId,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
