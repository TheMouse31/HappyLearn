import { gradeLabel, subjectLabel } from "../data/catalog";
import type { ChildSession, SessionStatsFilters, StoredAnswer, UniverseSlug } from "../data/types";
import { formatStudentName } from "../data/types";
import { UNIVERSES } from "../data/universes";

export type StudentStats = {
  key: string;
  prenom: string;
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
};

function normalizePrenom(value: string): string {
  return value.trim().toLocaleLowerCase("fr-FR");
}

function parcoursLabel(session: ChildSession): string | null {
  if (!session.grade || !session.subject) return null;
  return `${gradeLabel(session.grade)} · ${subjectLabel(session.subject)}`;
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

/** Regroupe les séances d’une classe par élève (eleve_id si dispo, sinon prénom + appareil). */
export function buildStudentStats(
  sessions: ChildSession[],
  answers: StoredAnswer[],
): StudentStats[] {
  const answersBySession = new Map<string, StoredAnswer[]>();
  for (const answer of answers) {
    const list = answersBySession.get(answer.sessionId) ?? [];
    list.push(answer);
    answersBySession.set(answer.sessionId, list);
  }

  const byStudent = new Map<string, ChildSession[]>();
  for (const session of sessions) {
    const key = session.eleveId
      ? `eleve::${session.eleveId}`
      : `${normalizePrenom(session.prenom)}::${session.deviceId}`;
    const list = byStudent.get(key) ?? [];
    list.push(session);
    byStudent.set(key, list);
  }

  const prenomCounts = new Map<string, number>();
  for (const list of byStudent.values()) {
    const name = normalizePrenom(list[0]?.prenom ?? "");
    prenomCounts.set(name, (prenomCounts.get(name) ?? 0) + 1);
  }

  const stats: StudentStats[] = [];
  for (const [key, list] of byStudent) {
    const sorted = [...list].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    const first = sorted[0];
    const prenom = first?.prenom.trim() || "Élève";
    const nameKey = normalizePrenom(prenom);
    const duplicate = (prenomCounts.get(nameKey) ?? 0) > 1;
    const displayName = first?.eleveId
      ? prenom
      : duplicate
        ? `${prenom} · ${key.slice(-4)}`
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

    stats.push({
      key,
      prenom: displayName,
      eleveId: first?.eleveId ?? null,
      sessionsStarted: sorted.length,
      missionsCompleted: completed,
      missionsAbandoned: abandoned,
      missionsInProgress: inProgress,
      universesCompleted: [...universes],
      answersTotal,
      answersCorrect,
      successRate: answersTotal > 0 ? Math.round((answersCorrect / answersTotal) * 100) : null,
      lastActivityAt: sorted[0]?.startedAt ?? "",
      parcours: [...parcours],
    });
  }

  return stats.sort((a, b) => a.prenom.localeCompare(b.prenom, "fr"));
}

export function displaySessionStudent(session: ChildSession): string {
  return formatStudentName(session.prenom, "");
}

export function universeShortList(slugs: UniverseSlug[]): string {
  if (slugs.length === 0) return "—";
  return slugs.map((slug) => UNIVERSES[slug].label).join(", ");
}
