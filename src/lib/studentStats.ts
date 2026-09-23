import { gradeLabel, subjectLabel } from "../data/catalog";
import type {
  ChildSession,
  ClassStudent,
  SessionStatsFilters,
  StoredAnswer,
  UniverseSlug,
} from "../data/types";
import { formatStudentName } from "../data/types";
import { UNIVERSES } from "../data/universes";

export type ActivityStatus = "recent" | "pause" | "never";

export type StudentStats = {
  key: string;
  prenom: string;
  nom: string;
  displayName: string;
  eleveId: string | null;
  sessionsStarted: number;
  missionsCompleted: number;
  missionsAbandoned: number;
  missionsInProgress: number;
  universesCompleted: UniverseSlug[];
  answersTotal: number;
  answersCorrect: number;
  successRate: number | null;
  lastActivityAt: string;
  parcours: string[];
  activityStatus: ActivityStatus;
};

export type ClassSummary = {
  activeStudents: number;
  missionsCompleted: number;
  missionsInProgress: number;
  avgSuccessRate: number | null;
};

const RECENT_MS = 7 * 24 * 60 * 60 * 1000;

function normalizePrenom(value: string): string {
  return value.trim().toLocaleLowerCase("fr-FR");
}

function parcoursLabel(session: ChildSession): string | null {
  if (!session.grade || !session.subject) return null;
  return `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`;
}

function activityStatusFor(lastActivityAt: string): ActivityStatus {
  if (!lastActivityAt) return "never";
  const age = Date.now() - new Date(lastActivityAt).getTime();
  if (Number.isNaN(age)) return "pause";
  return age <= RECENT_MS ? "recent" : "pause";
}

export function filterSessions(
  sessions: ChildSession[],
  filters: SessionStatsFilters,
): ChildSession[] {
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

function statsFromSessions(
  key: string,
  list: ChildSession[],
  answersBySession: Map<string, StoredAnswer[]>,
  rosterById: Map<string, ClassStudent>,
): StudentStats {
  const sorted = [...list].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const first = sorted[0];
  const rosterHit = first?.eleveId ? rosterById.get(first.eleveId) : undefined;
  const prenom = rosterHit?.prenom.trim() || first?.prenom.trim() || "Élève";
  const nom = rosterHit?.nom.trim() || "";
  const displayName = rosterHit
    ? formatStudentName(rosterHit.prenom, rosterHit.nom)
    : prenom;

  let completed = 0;
  let abandoned = 0;
  let inProgress = 0;
  const universes = new Set<UniverseSlug>();
  const parcours = new Set<string>();
  let answersTotal = 0;
  let answersCorrect = 0;

  for (const session of sorted) {
    if (session.rewardEarned) {
      completed += 1;
      universes.add(session.universe);
    } else if (session.finishedAt) {
      abandoned += 1;
    } else {
      inProgress += 1;
    }
    const label = parcoursLabel(session);
    if (label) parcours.add(label);
    for (const answer of answersBySession.get(session.id) ?? []) {
      answersTotal += 1;
      if (answer.correct) answersCorrect += 1;
    }
  }

  const lastActivityAt = sorted[0]?.startedAt ?? "";

  return {
    key,
    prenom,
    nom,
    displayName,
    eleveId: first?.eleveId ?? rosterHit?.id ?? null,
    sessionsStarted: sorted.length,
    missionsCompleted: completed,
    missionsAbandoned: abandoned,
    missionsInProgress: inProgress,
    universesCompleted: [...universes],
    answersTotal,
    answersCorrect,
    successRate: answersTotal > 0 ? Math.round((answersCorrect / answersTotal) * 100) : null,
    lastActivityAt,
    parcours: [...parcours],
    activityStatus: activityStatusFor(lastActivityAt),
  };
}

/** Regroupe les séances d’une classe par élève ; joint le roster pour les noms complets. */
export function buildStudentStats(
  sessions: ChildSession[],
  answers: StoredAnswer[],
  roster: ClassStudent[] = [],
): StudentStats[] {
  const answersBySession = new Map<string, StoredAnswer[]>();
  for (const answer of answers) {
    const list = answersBySession.get(answer.sessionId) ?? [];
    list.push(answer);
    answersBySession.set(answer.sessionId, list);
  }

  const rosterById = new Map(roster.map((student) => [student.id, student]));
  const byStudent = new Map<string, ChildSession[]>();
  const seenEleveIds = new Set<string>();

  for (const session of sessions) {
    const key = session.eleveId
      ? `eleve::${session.eleveId}`
      : `${normalizePrenom(session.prenom)}::${session.deviceId}`;
    const list = byStudent.get(key) ?? [];
    list.push(session);
    byStudent.set(key, list);
    if (session.eleveId) seenEleveIds.add(session.eleveId);
  }

  const stats: StudentStats[] = [];
  for (const [key, list] of byStudent) {
    stats.push(statsFromSessions(key, list, answersBySession, rosterById));
  }

  for (const student of roster) {
    if (seenEleveIds.has(student.id)) continue;
    stats.push({
      key: `eleve::${student.id}`,
      prenom: student.prenom.trim() || "Élève",
      nom: student.nom.trim(),
      displayName: formatStudentName(student.prenom, student.nom),
      eleveId: student.id,
      sessionsStarted: 0,
      missionsCompleted: 0,
      missionsAbandoned: 0,
      missionsInProgress: 0,
      universesCompleted: [],
      answersTotal: 0,
      answersCorrect: 0,
      successRate: null,
      lastActivityAt: "",
      parcours: [],
      activityStatus: "never",
    });
  }

  return stats.sort((a, b) => {
    if (a.lastActivityAt && b.lastActivityAt) {
      return b.lastActivityAt.localeCompare(a.lastActivityAt);
    }
    if (a.lastActivityAt) return -1;
    if (b.lastActivityAt) return 1;
    return a.displayName.localeCompare(b.displayName, "fr");
  });
}

export function buildClassSummary(stats: StudentStats[]): ClassSummary {
  const withActivity = stats.filter((item) => item.sessionsStarted > 0);
  const missionsCompleted = stats.reduce((sum, item) => sum + item.missionsCompleted, 0);
  const missionsInProgress = stats.reduce((sum, item) => sum + item.missionsInProgress, 0);
  const rated = stats.filter((item) => item.successRate !== null);
  const avgSuccessRate =
    rated.length === 0
      ? null
      : Math.round(rated.reduce((sum, item) => sum + (item.successRate ?? 0), 0) / rated.length);

  return {
    activeStudents: withActivity.length,
    missionsCompleted,
    missionsInProgress,
    avgSuccessRate,
  };
}

export function activityStatusLabel(status: ActivityStatus): string {
  if (status === "recent") return "Actif";
  if (status === "pause") return "En pause";
  return "Pas encore";
}

export function displaySessionStudent(session: ChildSession, roster: ClassStudent[] = []): string {
  if (session.eleveId) {
    const hit = roster.find((item) => item.id === session.eleveId);
    if (hit) return formatStudentName(hit.prenom, hit.nom);
  }
  return formatStudentName(session.prenom, "");
}

export function universeShortList(slugs: UniverseSlug[]): string {
  if (slugs.length === 0) return "—";
  return slugs.map((slug) => UNIVERSES[slug].label).join(", ");
}

export function sessionDayKey(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export function formatTimeOnly(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}
