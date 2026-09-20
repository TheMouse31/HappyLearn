import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import { defaultMissionFor, findMission, resolveMission } from "../data/missions";
import type {
  AppRole,
  ClasseSession,
  ClassRecord,
  ClassStudent,
  GradeLevel,
  PlayMode,
  SessionParticipant,
  SessionStatsFilters,
  SubjectSlug,
  TeacherAccount,
  UniverseSlug,
} from "../data/types";
import { formatStudentName } from "../data/types";
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
  loadLiveParticipant,
  loadLocalTeacher,
  loadPrenom,
  saveActiveClassId,
  saveClassCode,
  saveCourse,
  saveLiveParticipant,
  saveLocalTeacher,
  savePrenom,
} from "./localKeys";
import { createPersistence, localPersistence, type Persistence } from "./persistence";
import { subscribeClasseSession, subscribeSessionParticipants } from "./realtime";
import { getSupabase } from "./supabase";

type SessionState = {
  ready: boolean;
  backend: "local" | "supabase";
  role: AppRole | null;
  prenom: string;
  nom: string;
  displayName: string;
  classCode: string;
  className: string;
  grade: GradeLevel | null;
  subject: SubjectSlug | null;
  universe: UniverseSlug | null;
  mode: PlayMode | null;
  missionId: string | null;
  collection: UniverseSlug[];
  sessionId: string | null;
  rewardPending: boolean;
  teacher: TeacherAccount | null;
  classes: ClassRecord[];
  /** Session de classe live (éphémère). */
  liveSession: ClasseSession | null;
  liveParticipant: SessionParticipant | null;
  liveParticipants: SessionParticipant[];
  lockedSession: boolean;
  kickedFromSession: boolean;
  setPrenom: (value: string) => void;
  setCourse: (grade: GradeLevel, subject: SubjectSlug) => void;
  setUniverse: (value: UniverseSlug) => void;
  setMode: (value: PlayMode) => void;
  loginEleve: (
    prenom: string,
    code: string,
    eleveId?: string,
  ) => Promise<{ ok: true; live: boolean } | { ok: false; error: string }>;
  joinClassSession: (code: string, eleveId: string) => Promise<string | null>;
  leaveClassSession: () => Promise<void>;
  launchClassSession: (classId: string) => Promise<ClasseSession | null>;
  endClassSession: () => Promise<void>;
  refreshLiveSession: () => Promise<void>;
  setClassActivity: (activity: {
    niveau: GradeLevel;
    matiere: SubjectSlug;
    missionId: string;
    /** Optionnel : l'élève choisit l'univers. */
    univers?: UniverseSlug | null;
    mode: PlayMode;
  } | null) => Promise<void>;
  kick: (participantId: string) => Promise<void>;
  clearKicked: () => void;
  listStudentsByClassCode: (code: string) => Promise<ClassStudent[]>;
  listStudentsForSessionCode: (code: string) => Promise<ClassStudent[]>;
  listClassStudents: (classId: string) => Promise<ClassStudent[]>;
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
  loginTeacherPassword: (
    email: string,
    password: string,
    mode: "connexion" | "inscription",
  ) => Promise<string | null>;
  loginTeacherMagic: (email: string) => Promise<string | null>;
  loginTeacherLocal: (email: string) => Promise<string | null>;
  logout: () => Promise<void>;
  ensureClass: (nom?: string) => Promise<ClassRecord | null>;
  createClass: (nom: string) => Promise<ClassRecord | null>;
  renameClass: (classId: string, nom: string) => Promise<void>;
  loadClassSessions: (
    code: string,
    filters?: SessionStatsFilters,
  ) => ReturnType<Persistence["listSessionsByClassCode"]>;
  loadClassAnswers: (sessionIds: string[]) => ReturnType<Persistence["listAnswersBySessionIds"]>;
  listClassMissionsDone: (classId: string) => Promise<string[]>;
  listClassSessionsHistory: (classId: string) => Promise<ClasseSession[]>;
  activeClassId: string | null;
  setActiveClassId: (classId: string) => void;
  startMission: (override?: { universe?: UniverseSlug }) => Promise<void>;
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
  const [nom, setNom] = useState("");
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const [subject, setSubject] = useState<SubjectSlug | null>(null);
  const [universe, setUniverse] = useState<UniverseSlug | null>(null);
  const [mode, setMode] = useState<PlayMode | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [collection, setCollection] = useState<UniverseSlug[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rewardPending, setRewardPending] = useState(false);
  const [teacher, setTeacher] = useState<TeacherAccount | null>(null);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [activeClassId, setActiveClassIdState] = useState<string | null>(null);
  const [liveSession, setLiveSession] = useState<ClasseSession | null>(null);
  const [liveParticipant, setLiveParticipant] = useState<SessionParticipant | null>(null);
  const [liveParticipants, setLiveParticipants] = useState<SessionParticipant[]>([]);
  const [kickedFromSession, setKickedFromSession] = useState(false);
  const [eleveId, setEleveId] = useState<string | null>(null);
  const persistenceRef = useRef<Persistence | null>(null);
  const liveParticipantRef = useRef<SessionParticipant | null>(null);

  useEffect(() => {
    persistenceRef.current = persistence;
  }, [persistence]);

  useEffect(() => {
    liveParticipantRef.current = liveParticipant;
  }, [liveParticipant]);

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
        let list = await store.listClasses(teacherAccount.id);
        if (cancelled) return;
        if (list.length === 0) {
          const created = await store.createClass(teacherAccount.id, "Ma classe");
          list = [created];
        }
        setTeacher(teacherAccount);
        setClasses(list);
        const savedActive = loadActiveClassId();
        const validActive = list.some((item) => item.id === savedActive)
          ? savedActive
          : (list[0]?.id ?? null);
        setActiveClassIdState(validActive);
        if (validActive) saveActiveClassId(validActive);
        setRole("enseignant");
        if (validActive) {
          const active = await store.getActiveClassSession(validActive);
          if (!cancelled && active) {
            setLiveSession(active);
            const parts = await store.listParticipants(active.id);
            if (!cancelled) setLiveParticipants(parts);
          }
        }
      } else {
        const savedPrenom = loadPrenom();
        const savedCode = loadClassCode();
        setPrenomState(savedPrenom);
        setClassCode(savedCode);
        setGrade(loadCourseGrade());
        setSubject(loadCourseSubject());
        if (savedPrenom) setRole("eleve");

        const savedLive = loadLiveParticipant();
        if (savedLive) {
          const session = await store.getClasseSessionById(savedLive.sessionId);
          if (session && session.statut === "ouverte") {
            const parts = await store.listParticipants(session.id);
            const mine = parts.find((item) => item.id === savedLive.participantId);
            if (!mine) {
              setKickedFromSession(true);
              saveLiveParticipant(null);
            } else {
              const result = await store.joinSession(session.code, savedLive.eleveId);
              if (result.ok) {
                setLiveSession(result.session);
                setLiveParticipant(result.participant);
                setLiveParticipants(await store.listParticipants(result.session.id));
                setPrenomState(result.participant.prenom);
                setNom(result.participant.nom);
                setEleveId(result.participant.eleveId);
                setClassCode(result.session.code);
                savePrenom(result.participant.prenom);
                saveClassCode(result.session.code);
                saveLiveParticipant({
                  sessionId: result.session.id,
                  participantId: result.participant.id,
                  eleveId: result.participant.eleveId,
                  prenom: result.participant.prenom,
                  nom: result.participant.nom,
                  sessionCode: result.session.code,
                });
                if (result.session.niveau) setGrade(result.session.niveau);
                if (result.session.matiere) setSubject(result.session.matiere);
                if (result.session.univers) setUniverse(result.session.univers);
                if (result.session.mode) setMode(result.session.mode);
                if (result.session.missionId) setMissionId(result.session.missionId);
                setRole("eleve");
              } else if (result.error.includes("déjà pris")) {
                setKickedFromSession(true);
                saveLiveParticipant(null);
              } else {
                saveLiveParticipant(null);
              }
            }
          } else {
            saveLiveParticipant(null);
          }
        }
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Heartbeat + leave on unload for live participants
  useEffect(() => {
    if (!liveParticipant || !persistence) return;
    const tick = () => {
      void persistence.heartbeat(liveParticipant.id);
    };
    tick();
    const timer = window.setInterval(tick, 20000);
    const onUnload = () => {
      void persistence.leaveSession(liveParticipant.id);
    };
    window.addEventListener("pagehide", onUnload);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [liveParticipant?.id, persistence]);

  // Realtime: student watches session activity + own row; teacher watches participants
  useEffect(() => {
    if (!liveSession || !persistence) return;
    const sessionIdLive = liveSession.id;
    let lastSessionKey = "";
    let lastPartsKey = "";

    const refreshSession = () => {
      void persistence.getClasseSessionById(sessionIdLive).then((next) => {
        if (!next || next.statut === "fermee") {
          setLiveSession(null);
          setLiveParticipant(null);
          setLiveParticipants([]);
          saveLiveParticipant(null);
          return;
        }
        const key = [
          next.id,
          next.statut,
          next.missionId,
          next.niveau,
          next.matiere,
          next.mode,
          next.univers,
          next.code,
        ].join("|");
        if (key === lastSessionKey) return;
        const prevMission = lastSessionKey ? lastSessionKey.split("|")[2] ?? "" : null;
        lastSessionKey = key;
        setLiveSession(next);
        if (next.niveau) setGrade(next.niveau);
        if (next.matiere) setSubject(next.matiere);
        // L'univers est choisi par l'élève : ne pas l'imposer depuis la session.
        if (next.mode) setMode(next.mode);
        setMissionId(next.missionId);
        // Nouvelle activité (changement réel) → l'élève rechoisit son univers.
        if (prevMission !== null && (next.missionId ?? "") !== prevMission) {
          setUniverse(null);
          setSessionId(null);
          setRewardPending(false);
        }
      });
    };

    const refreshParticipants = () => {
      void persistence.listParticipants(sessionIdLive).then((parts) => {
        const key = parts
          .map((item) => `${item.id}:${item.statut}:${item.lastSeenAt}`)
          .sort()
          .join(",");
        if (key === lastPartsKey) return;
        lastPartsKey = key;
        setLiveParticipants(parts);
        const mine = liveParticipantRef.current;
        if (mine) {
          const stillThere = parts.find((item) => item.id === mine.id);
          if (!stillThere) {
            setKickedFromSession(true);
            setLiveParticipant(null);
            setLiveSession(null);
            saveLiveParticipant(null);
          } else if (
            stillThere.statut !== mine.statut ||
            stillThere.lastSeenAt !== mine.lastSeenAt
          ) {
            setLiveParticipant(stillThere);
          }
        }
      });
    };

    refreshParticipants();
    refreshSession();
    const unsubSession = subscribeClasseSession(sessionIdLive, refreshSession);
    // Heartbeats ne doivent pas recharger toute la session (évite les re-renders inutiles).
    const unsubParts = subscribeSessionParticipants(sessionIdLive, refreshParticipants);
    return () => {
      unsubSession();
      unsubParts();
    };
  }, [liveSession?.id, persistence]);

  const lockedSession = Boolean(role === "eleve" && liveSession && liveParticipant);

  const value = useMemo<SessionState>(
    () => ({
      ready,
      backend: persistence?.backend ?? "local",
      role,
      prenom,
      nom,
      displayName: formatStudentName(prenom, nom),
      classCode,
      className,
      grade,
      subject,
      universe,
      mode,
      missionId,
      collection,
      sessionId,
      rewardPending,
      teacher,
      classes,
      liveSession,
      liveParticipant,
      liveParticipants,
      lockedSession,
      kickedFromSession,
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
      loginEleve: async (rawPrenom, rawCode, selectedEleveId) => {
        const store = persistence ?? localPersistence;
        const code = normalizeClassCode(rawCode);

        if (rawCode.trim() && !isValidClassCode(code)) {
          return { ok: false, error: "Le code a 4 à 8 lettres ou chiffres, sans espace." };
        }

        if (code) {
          const live = await store.findActiveSessionByCode(code);
          if (live) {
            if (!selectedEleveId) {
              return { ok: false, error: "Choisis ton nom dans la liste de ta classe." };
            }
            const result = await store.joinSession(code, selectedEleveId);
            if (!result.ok) return { ok: false, error: result.error };
            setLiveSession(result.session);
            setLiveParticipant(result.participant);
            setLiveParticipants(await store.listParticipants(result.session.id));
            setKickedFromSession(false);
            setPrenomState(result.participant.prenom);
            setNom(result.participant.nom);
            setEleveId(result.participant.eleveId);
            savePrenom(result.participant.prenom);
            setClassCode(code);
            saveClassCode(code);
            saveLiveParticipant({
              sessionId: result.session.id,
              participantId: result.participant.id,
              eleveId: result.participant.eleveId,
              prenom: result.participant.prenom,
              nom: result.participant.nom,
              sessionCode: code,
            });
            if (result.session.niveau) setGrade(result.session.niveau);
            if (result.session.matiere) setSubject(result.session.matiere);
            if (result.session.univers) setUniverse(result.session.univers);
            if (result.session.mode) setMode(result.session.mode);
            if (result.session.missionId) setMissionId(result.session.missionId);
            setClassName("");
            setTeacher(null);
            setRole("eleve");
            return { ok: true, live: true };
          }

          const next = rawPrenom.trim().slice(0, 20);
          if (!next && !selectedEleveId) {
            return { ok: false, error: "Écris d’abord ton prénom ou un surnom." };
          }
          const found = await store.findClassByCode(code);
          if (!found) {
            return {
              ok: false,
              error:
                "Ce code n’est pas reconnu. Demande le code de session à ton professeur, ou laisse vide à la maison.",
            };
          }
          const roster = await store.listClassStudents(found.id);
          if (roster.length === 0) {
            return {
              ok: false,
              error:
                "Ton professeur n’a pas encore ajouté les élèves de la classe. Demande-lui, ou laisse le code vide pour jouer seul.",
            };
          }
          const match = selectedEleveId
            ? roster.find((item) => item.id === selectedEleveId)
            : roster.find(
                (item) => item.prenom.localeCompare(next, "fr", { sensitivity: "base" }) === 0,
              );
          if (!match) {
            return { ok: false, error: "Choisis ton nom dans la liste de ta classe." };
          }
          setClassName(found.nom);
          setPrenomState(match.prenom);
          setNom(match.nom);
          setEleveId(match.id);
          savePrenom(match.prenom);
          setClassCode(code);
          saveClassCode(code);
          setLiveSession(null);
          setLiveParticipant(null);
          setTeacher(null);
          setRole("eleve");
          return { ok: true, live: false };
        }

        const next = rawPrenom.trim().slice(0, 20);
        if (!next) return { ok: false, error: "Écris d’abord ton prénom ou un surnom." };
        setClassName("");
        setPrenomState(next);
        setNom("");
        setEleveId(null);
        savePrenom(next);
        setClassCode("");
        saveClassCode("");
        setLiveSession(null);
        setLiveParticipant(null);
        setTeacher(null);
        setRole("eleve");
        return { ok: true, live: false };
      },
      joinClassSession: async (rawCode, selectedEleveId) => {
        const store = persistence ?? localPersistence;
        const code = normalizeClassCode(rawCode);
        if (!isValidClassCode(code)) {
          return "Le code a 4 à 8 lettres ou chiffres, sans espace.";
        }
        const result = await store.joinSession(code, selectedEleveId);
        if (!result.ok) return result.error;
        setLiveSession(result.session);
        setLiveParticipant(result.participant);
        setLiveParticipants(await store.listParticipants(result.session.id));
        setKickedFromSession(false);
        setPrenomState(result.participant.prenom);
        setNom(result.participant.nom);
        setEleveId(result.participant.eleveId);
        savePrenom(result.participant.prenom);
        setClassCode(code);
        saveClassCode(code);
        saveLiveParticipant({
          sessionId: result.session.id,
          participantId: result.participant.id,
          eleveId: result.participant.eleveId,
          prenom: result.participant.prenom,
          nom: result.participant.nom,
          sessionCode: code,
        });
        if (result.session.niveau) setGrade(result.session.niveau);
        if (result.session.matiere) setSubject(result.session.matiere);
        if (result.session.univers) setUniverse(result.session.univers);
        if (result.session.mode) setMode(result.session.mode);
        if (result.session.missionId) setMissionId(result.session.missionId);
        setTeacher(null);
        setRole("eleve");
        return null;
      },
      leaveClassSession: async () => {
        const store = persistence ?? localPersistence;
        if (liveParticipant) await store.leaveSession(liveParticipant.id);
        setLiveSession(null);
        setLiveParticipant(null);
        setLiveParticipants([]);
        saveLiveParticipant(null);
      },
      launchClassSession: async (classId) => {
        const store = persistence ?? localPersistence;
        const created = await store.openClassSession(classId);
        setLiveSession(created);
        setLiveParticipants([]);
        return created;
      },
      endClassSession: async () => {
        const store = persistence ?? localPersistence;
        if (!liveSession) return;
        await store.closeClassSession(liveSession.id);
        setLiveSession(null);
        setLiveParticipants([]);
      },
      refreshLiveSession: async () => {
        const store = persistence ?? localPersistence;
        if (role === "enseignant" && activeClassId) {
          const active = await store.getActiveClassSession(activeClassId);
          setLiveSession((prev) => {
            if (!active && !prev) return prev;
            if (
              active &&
              prev &&
              active.id === prev.id &&
              active.code === prev.code &&
              active.statut === prev.statut &&
              active.missionId === prev.missionId &&
              active.niveau === prev.niveau &&
              active.matiere === prev.matiere &&
              active.mode === prev.mode &&
              active.univers === prev.univers
            ) {
              return prev;
            }
            return active;
          });
          if (active) {
            const parts = await store.listParticipants(active.id);
            setLiveParticipants(parts);
          } else {
            setLiveParticipants([]);
          }
          return;
        }
        if (liveSession) {
          const next = await store.getClasseSessionById(liveSession.id);
          setLiveSession(next && next.statut === "ouverte" ? next : null);
          if (next) setLiveParticipants(await store.listParticipants(next.id));
        }
      },
      setClassActivity: async (activity) => {
        const store = persistence ?? localPersistence;
        if (!liveSession) return;
        const payload = activity
          ? { ...activity, univers: activity.univers ?? null }
          : null;
        const next = await store.setSessionActivity(liveSession.id, payload);
        if (next) {
          setLiveSession(next);
          if (activity) {
            setGrade(activity.niveau);
            setSubject(activity.matiere);
            setMode(activity.mode);
            setMissionId(activity.missionId);
            // Univers laissé au choix de chaque élève.
            setUniverse(null);
            setSessionId(null);
            setRewardPending(false);
          } else {
            setMissionId(null);
            setUniverse(null);
            setSessionId(null);
            setRewardPending(false);
          }
        }
      },
      kick: async (participantId) => {
        const store = persistence ?? localPersistence;
        await store.kickParticipant(participantId);
        if (liveSession) {
          setLiveParticipants(await store.listParticipants(liveSession.id));
        }
      },
      clearKicked: () => setKickedFromSession(false),
      listStudentsByClassCode: async (code) => {
        const store = persistence ?? localPersistence;
        const normalized = normalizeClassCode(code);
        if (!isValidClassCode(normalized)) return [];
        return store.listStudentsByClassCode(normalized);
      },
      listStudentsForSessionCode: async (code) => {
        const store = persistence ?? localPersistence;
        const normalized = normalizeClassCode(code);
        if (!isValidClassCode(normalized)) return [];
        const live = await store.findActiveSessionByCode(normalized);
        if (live) return store.listClassStudents(live.classId);
        return store.listStudentsByClassCode(normalized);
      },
      listClassStudents: async (classId) => {
        const store = persistence ?? localPersistence;
        return store.listClassStudents(classId);
      },
      addClassStudent: async (classId, prenomValue, nomValue) => {
        const store = persistence ?? localPersistence;
        return store.addClassStudent(classId, prenomValue, nomValue);
      },
      renameClassStudent: async (studentId, prenomValue, nomValue) => {
        const store = persistence ?? localPersistence;
        return store.renameClassStudent(studentId, prenomValue, nomValue);
      },
      removeClassStudent: async (studentId) => {
        const store = persistence ?? localPersistence;
        await store.removeClassStudent(studentId);
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
        const store = persistence ?? localPersistence;
        if (liveParticipant) await store.leaveSession(liveParticipant.id);
        const client = getSupabase();
        if (client) await client.auth.signOut();
        clearLocalTeacher();
        clearPrenom();
        clearCourse();
        saveClassCode("");
        saveActiveClassId(null);
        saveLiveParticipant(null);
        setTeacher(null);
        setClasses([]);
        setActiveClassIdState(null);
        setPrenomState("");
        setNom("");
        setEleveId(null);
        setClassCode("");
        setClassName("");
        setGrade(null);
        setSubject(null);
        setUniverse(null);
        setMode(null);
        setMissionId(null);
        setSessionId(null);
        setRewardPending(false);
        setLiveSession(null);
        setLiveParticipant(null);
        setLiveParticipants([]);
        setKickedFromSession(false);
        setRole(null);
      },
      ensureClass: async (nomValue = "Ma classe") => {
        if (!persistence || !teacher) return null;
        if (classes.length > 0) {
          const current = classes.find((item) => item.id === activeClassId) ?? classes[0];
          return current;
        }
        const created = await persistence.createClass(teacher.id, nomValue);
        setClasses([created]);
        setActiveClassIdState(created.id);
        saveActiveClassId(created.id);
        return created;
      },
      createClass: async (nomValue) => {
        if (!persistence || !teacher) return null;
        const label = nomValue.trim().slice(0, 40) || `Classe ${classes.length + 1}`;
        const created = await persistence.createClass(teacher.id, label);
        setClasses((current) => [...current, created]);
        setActiveClassIdState(created.id);
        saveActiveClassId(created.id);
        return created;
      },
      renameClass: async (classId, nomValue) => {
        if (!persistence) return;
        await persistence.renameClass(classId, nomValue);
        setClasses((current) =>
          current.map((item) => (item.id === classId ? { ...item, nom: nomValue } : item)),
        );
      },
      loadClassSessions: async (code, filters) => {
        const store = persistence ?? localPersistence;
        return store.listSessionsByClassCode(code, filters);
      },
      loadClassAnswers: async (sessionIds) => {
        const store = persistence ?? localPersistence;
        return store.listAnswersBySessionIds(sessionIds);
      },
      listClassMissionsDone: async (classId) => {
        const store = persistence ?? localPersistence;
        return store.listClassMissionsDone(classId);
      },
      listClassSessionsHistory: async (classId) => {
        const store = persistence ?? localPersistence;
        return store.listClassSessionsHistory(classId);
      },
      activeClassId,
      setActiveClassId: (classId) => {
        setActiveClassIdState(classId);
        saveActiveClassId(classId);
      },
      startMission: async (override) => {
        const chosenUniverse = override?.universe ?? universe;
        if (override?.universe) setUniverse(override.universe);
        if (!persistence || !prenom || !chosenUniverse || !mode) return;
        const mission =
          (await resolveMission(missionId)) ??
          defaultMissionFor(grade, subject) ??
          findMission("cm2-maths-fractions-01");
        const id = await persistence.startSession(prenom, chosenUniverse, mode, classCode || null, {
          grade,
          subject,
          classId: liveSession?.classId ?? null,
          classeSessionId: liveSession?.id ?? null,
          eleveId: eleveId ?? liveParticipant?.eleveId ?? null,
          missionId: mission?.id ?? null,
        });
        if (mission) setMissionId(mission.id);
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
        if (lockedSession) {
          setSessionId(null);
          setRewardPending(false);
        }
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
        if (!lockedSession) setMissionId(null);
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
      nom,
      classCode,
      className,
      grade,
      subject,
      universe,
      mode,
      missionId,
      collection,
      sessionId,
      rewardPending,
      teacher,
      classes,
      activeClassId,
      liveSession,
      liveParticipant,
      liveParticipants,
      lockedSession,
      kickedFromSession,
      eleveId,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
