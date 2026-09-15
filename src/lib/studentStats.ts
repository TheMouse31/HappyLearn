import { gradeLabel, subjectLabel } from "../data/catalog";
import type { ChildSession, StoredAnswer, UniverseSlug } from "../data/types";
import { UNIVERSES } from "../data/universes";

export type StudentStats = {
  key: string;
  prenom: string;
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

/** Regroupe les séances d’une classe par élève (prénom + appareil). */
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
    const key = `${normalizePrenom(session.prenom)}::${session.deviceId}`;
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
    const prenom = sorted[0]?.prenom.trim() || "Élève";
    const nameKey = normalizePrenom(prenom);
    const duplicate = (prenomCounts.get(nameKey) ?? 0) > 1;
    const displayName = duplicate ? `${prenom} · ${key.slice(-4)}` : prenom;

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

export function universeShortList(slugs: UniverseSlug[]): string {
  if (slugs.length === 0) return "—";
  return slugs.map((slug) => UNIVERSES[slug].label).join(", ");
}
