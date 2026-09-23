import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { isGradeLevel, isSubjectSlug } from "../data/catalog";
import { defaultMissionFor, findMission, resolveMission } from "../data/missions";
import type {
  Abonnement,
  AppRole,
  ClasseSession,
  ClassRecord,
  ClassStudent,
  ClassThemeCoverage,
  Foyer,
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
import { canUseRealtime, subscribeClasseSession, subscribeSessionParticipants } from "./realtime";
import { isAdminEmail } from "./admins";
import { getSupabase } from "./supabase";
import {
  ensureFoyer,
  ensureUserProfile,
  getAbonnement,
  getUserProfileRole,
  verifyEleveFoyerPin,
} from "./familyStore";
import { isAbonnementActive } from "./subscription";

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
  /** Foyer maison (parent connecté). */
  foyer: Foyer | null;
  abonnement: Abonnement | null;
  premiumActive: boolean;
  /** Enfant foyer connecté (PIN). */
  eleveFoyerId: string | null;
  foyerId: string | null;
  /** Prof anime au tableau sans élèves. */
  hostMode: boolean;
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
  loginEleveFoyer: (
    eleveId: string,
    pin: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
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
  /** Élève : lever / baisser la main. */
  raiseHand: (raised: boolean) => Promise<void>;
  /** Professeur : baisser la main d’un élève. */
  clearHand: (participantId: string) => Promise<void>;
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
  loginTeacherGoogle: () => Promise<string | null>;
  loginParentPassword: (
    email: string,
    password: string,
    mode: "connexion" | "inscription",
  ) => Promise<string | null>;
  loginParentGoogle: () => Promise<string | null>;
  loginParentLocal: (email: string) => Promise<string | null>;
  refreshAbonnement: () => Promise<void>;
  startHostMission: (params: {
    niveau: GradeLevel;
    matiere: SubjectSlug;
    missionId: string;
    mode: PlayMode;
    universe: UniverseSlug;
  }) => Promise<void>;
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
  listClassThemeCoverage: (classId: string) => Promise<ClassThemeCoverage[]>;
  setThemeCoveredInClass: (
    classId: string,
    themeId: string,
    covered: boolean,
    note?: string,
  ) => Promise<ClassThemeCoverage | null>;
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

async function restoreAdult(): Promise<{
  account: TeacherAccount;
  role: "parent" | "enseignant" | "admin";
  foyer: Foyer | null;
  abonnement: Abonnement | null;
} | null> {
  const client = getSupabase();
  if (client) {
    const { data } = await client.auth.getSession();
    const user = data.session?.user;
    if (user?.email) {
      const admin = isAdminEmail(user.email);
      let role = await getUserProfileRole(user.id);
      const oauthHint = sessionStorage.getItem("hl-oauth-role");
      sessionStorage.removeItem("hl-oauth-role");
      if (!role) {
        if (oauthHint === "parent") role = "parent";
        else role = admin ? "admin" : "enseignant";
      }
      if (admin) role = "admin";
      await ensureUserProfile(user.id, role, user.email.split("@")[0] ?? user.email, user.email);
      const account: TeacherAccount = {
        id: user.id,
        email: user.email,
        backend: "supabase",
        isAdmin: role === "admin",
        accountRole: role,
      };
      let foyer: Foyer | null = null;
      let abonnement: Abonnement | null = null;
      if (role === "parent") {
        foyer = await ensureFoyer(user.id);
        abonnement = await getAbonnement("foyer", foyer.id);
      } else {
        abonnement = await getAbonnement("enseignant", user.id);
      }
      return { account, role, foyer, abonnement };
    }
  }
  const local = loadLocalTeacher();
  if (!local) return null;
  const admin = isAdminEmail(local.email);
  const role = (local as { accountRole?: "parent" | "enseignant" | "admin" }).accountRole
    ?? (admin ? "admin" : "enseignant");
  let foyer: Foyer | null = null;
  let abonnement: Abonnement | null = null;
  if (role === "parent") {
    foyer = await ensureFoyer(local.id);
    abonnement = await getAbonnement("foyer", foyer.id);
  } else {
    abonnement = await getAbonnement("enseignant", local.id);
  }
  return {
    account: {
      ...local,
      backend: "local",
      isAdmin: admin || role === "admin",
      accountRole: role,
    },
    role,
    foyer,
    abonnement,
  };
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
  const [foyer, setFoyer] = useState<Foyer | null>(null);
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [eleveFoyerId, setEleveFoyerId] = useState<string | null>(null);
  const [foyerId, setFoyerId] = useState<string | null>(null);
  const [hostMode, setHostMode] = useState(false);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [activeClassId, setActiveClassIdState] = useState<string | null>(null);
  const [liveSession, setLiveSession] = useState<ClasseSession | null>(null);
  const [liveParticipant, setLiveParticipant] = useState<SessionParticipant | null>(null);
  const [liveParticipants, setLiveParticipants] = useState<SessionParticipant[]>([]);
  const [kickedFromSession, setKickedFromSession] = useState(false);
  const [eleveId, setEleveId] = useState<string | null>(null);
  const persistenceRef = useRef<Persistence | null>(null);
  const liveParticipantRef = useRef<SessionParticipant | null>(null);

  const premiumActive = isAbonnementActive(abonnement);

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
      const restored = await restoreAdult();
      if (cancelled) return;
      setPersistence(store);
      setCollection(saved);
      if (restored) {
        const { account, role: accountRole, foyer: restoredFoyer, abonnement: restoredSub } = restored;
        setTeacher(account);
        setFoyer(restoredFoyer);
        setAbonnement(restoredSub);
        setRole(accountRole);
        if (accountRole === "parent") {
          setClasses([]);
          setActiveClassIdState(null);
        } else {
          let list = await store.listClasses(account.id);
          if (cancelled) return;
          if (list.length === 0) {
            const created = await store.createClass(account.id, "Ma classe");
            list = [created];
          }
          setClasses(list);
          const savedActive = loadActiveClassId();
          const validActive = list.some((item) => item.id === savedActive)
            ? savedActive
            : (list[0]?.id ?? null);
          setActiveClassIdState(validActive);
          if (validActive) saveActiveClassId(validActive);
          if (validActive) {
            const active = await store.getActiveClassSession(validActive);
            if (!cancelled && active) {
              setLiveSession(active);
              const parts = await store.listParticipants(active.id);
              if (!cancelled) setLiveParticipants(parts);
            }
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
          .map(
            (item) =>
              `${item.id}:${item.statut}:${item.lastSeenAt}:${item.handRaised ? "1" : "0"}:${item.handRaisedAt ?? ""}`,
          )
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
            stillThere.lastSeenAt !== mine.lastSeenAt ||
            stillThere.handRaised !== mine.handRaised ||
            stillThere.handRaisedAt !== mine.handRaisedAt
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
    // Sans Realtime (mode local), poll pour la main levée / présence / activité.
    let pollTimer: number | undefined;
    if (!canUseRealtime()) {
      pollTimer = window.setInterval(() => {
        refreshParticipants();
        refreshSession();
      }, 2000);
    }
    return () => {
      unsubSession();
      unsubParts();
      if (pollTimer !== undefined) window.clearInterval(pollTimer);
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
      foyer,
      abonnement,
      premiumActive,
      eleveFoyerId,
      foyerId,
      hostMode,
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
        const canPilotClass = (role === "enseignant" || role === "admin") && Boolean(activeClassId);
        if (canPilotClass && activeClassId) {
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
      raiseHand: async (raised) => {
        const store = persistence ?? localPersistence;
        const mine = liveParticipantRef.current;
        if (!mine) return;
        const updated = await store.setHandRaised(mine.id, raised);
        if (updated) {
          setLiveParticipant(updated);
        }
        if (liveSession) {
          setLiveParticipants(await store.listParticipants(liveSession.id));
        }
      },
      clearHand: async (participantId) => {
        const store = persistence ?? localPersistence;
        await store.setHandRaised(participantId, false);
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
        const admin = isAdminEmail(user.email);
        const accountRole = admin ? "admin" : "enseignant";
        await ensureUserProfile(user.id, accountRole, user.email.split("@")[0] ?? user.email, user.email);
        const account: TeacherAccount = {
          id: user.id,
          email: user.email,
          backend: "supabase",
          isAdmin: admin,
          accountRole,
        };
        const store = persistence ?? (await createPersistence());
        setPersistence(store);
        let list = await store.listClasses(account.id);
        if (list.length === 0) {
          const created = await store.createClass(account.id, "Ma classe");
          list = [created];
        }
        setTeacher(account);
        setClasses(list);
        setFoyer(null);
        setAbonnement(await getAbonnement("enseignant", account.id));
        setActiveClassIdState(list[0]?.id ?? null);
        if (list[0]) saveActiveClassId(list[0].id);
        setRole(accountRole);
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
        const normalized = email.trim().toLowerCase();
        const account: TeacherAccount = {
          id: `local-${normalized}`,
          email: normalized,
          backend: "local",
          isAdmin: isAdminEmail(normalized),
          accountRole: isAdminEmail(normalized) ? "admin" : "enseignant",
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
        setFoyer(null);
        setAbonnement(await getAbonnement("enseignant", account.id));
        setActiveClassIdState(list[0]?.id ?? null);
        if (list[0]) saveActiveClassId(list[0].id);
        setRole(account.isAdmin ? "admin" : "enseignant");
        return null;
      },
      loginTeacherGoogle: async () => {
        const client = getSupabase();
        if (!client) return "Google nécessite Supabase.";
        const { error } = await client.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/connexion/enseignant`,
            queryParams: { access_type: "offline", prompt: "consent" },
          },
        });
        if (error) return teacherAuthMessage(error.message);
        return null;
      },
      loginParentPassword: async (email, password, authMode) => {
        if (!isEmail(email)) return "Indique un e-mail valide.";
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
        await ensureUserProfile(user.id, "parent", user.email.split("@")[0] ?? user.email, user.email);
        const account: TeacherAccount = {
          id: user.id,
          email: user.email,
          backend: "supabase",
          accountRole: "parent",
        };
        const createdFoyer = await ensureFoyer(user.id);
        setTeacher(account);
        setFoyer(createdFoyer);
        setAbonnement(await getAbonnement("foyer", createdFoyer.id));
        setClasses([]);
        setActiveClassIdState(null);
        setRole("parent");
        return null;
      },
      loginParentGoogle: async () => {
        const client = getSupabase();
        if (!client) return "Google nécessite Supabase.";
        sessionStorage.setItem("hl-oauth-role", "parent");
        const { error } = await client.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/connexion/parent` },
        });
        if (error) return teacherAuthMessage(error.message);
        return null;
      },
      loginParentLocal: async (email) => {
        if (!isEmail(email)) return "Indique un e-mail valide.";
        const normalized = email.trim().toLowerCase();
        const account: TeacherAccount = {
          id: `local-parent-${normalized}`,
          email: normalized,
          backend: "local",
          accountRole: "parent",
        };
        saveLocalTeacher(account);
        const createdFoyer = await ensureFoyer(account.id);
        setTeacher(account);
        setFoyer(createdFoyer);
        setAbonnement(await getAbonnement("foyer", createdFoyer.id));
        setClasses([]);
        setRole("parent");
        return null;
      },
      loginEleveFoyer: async (childId, pin) => {
        const child = await verifyEleveFoyerPin(childId, pin);
        if (!child) return { ok: false, error: "Code PIN incorrect." };
        setPrenomState(child.prenom);
        setNom(child.nom);
        savePrenom(child.prenom);
        setEleveFoyerId(child.id);
        setFoyerId(child.foyerId);
        setEleveId(null);
        setLiveSession(null);
        setLiveParticipant(null);
        if (child.niveau) setGrade(child.niveau);
        setRole("eleve");
        return { ok: true };
      },
      refreshAbonnement: async () => {
        if (!teacher) return;
        if (role === "parent" && foyer) {
          setAbonnement(await getAbonnement("foyer", foyer.id));
        } else if (role === "enseignant" || role === "admin") {
          setAbonnement(await getAbonnement("enseignant", teacher.id));
        }
      },
      startHostMission: async (params) => {
        if (!persistence || !teacher) return;
        setHostMode(true);
        setGrade(params.niveau);
        setSubject(params.matiere);
        setMissionId(params.missionId);
        setMode(params.mode);
        setUniverse(params.universe);
        setPrenomState("Tableau");
        const id = await persistence.startSession("Tableau", params.universe, params.mode, null, {
          grade: params.niveau,
          subject: params.matiere,
          classId: liveSession?.classId ?? activeClassId,
          classeSessionId: liveSession?.id ?? null,
          missionId: params.missionId,
          hostMode: true,
        });
        setSessionId(id);
        setRewardPending(false);
        if (liveSession) {
          await persistence.setSessionActivity(liveSession.id, {
            niveau: params.niveau,
            matiere: params.matiere,
            missionId: params.missionId,
            mode: params.mode,
            univers: null,
          });
        }
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
        setFoyer(null);
        setAbonnement(null);
        setEleveFoyerId(null);
        setFoyerId(null);
        setHostMode(false);
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
      listClassThemeCoverage: async (classId) => {
        const store = persistence ?? localPersistence;
        return store.listClassThemeCoverage(classId);
      },
      setThemeCoveredInClass: async (classId, themeId, covered, note) => {
        const store = persistence ?? localPersistence;
        return store.setThemeCoveredInClass(classId, themeId, covered, note);
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
        setHostMode(false);
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
          foyerId: foyerId ?? null,
          eleveFoyerId: eleveFoyerId ?? null,
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
      foyer,
      abonnement,
      premiumActive,
      eleveFoyerId,
      foyerId,
      hostMode,
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
