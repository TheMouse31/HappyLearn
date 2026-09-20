/**
 * Contrat de nommage multi-matières (missions + étapes).
 *
 * Mission ID : `{grade}-{subject}-{slug}-{nn}`
 *   ex. cm2-maths-fractions-01
 *
 * Étape :
 *   - slug local : `s01`, `s02`, … (unique dans la mission)
 *   - id canonique : `{missionId}/{stepSlug}`
 *     ex. cm2-maths-fractions-01/s01
 */

import { isGradeLevel, isSubjectSlug } from "../catalog";
import type { GradeLevel, SubjectSlug } from "../types";

const MISSION_ID_RE =
  /^(cp|ce1|ce2|cm1|cm2)-([a-z0-9-]+)-([a-z0-9]+(?:-[a-z0-9]+)*)-(\d{2})$/;
const STEP_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ParsedMissionId = {
  grade: GradeLevel;
  subject: SubjectSlug;
  slug: string;
  nn: string;
};

export function buildMissionId(
  grade: GradeLevel,
  subject: SubjectSlug,
  slug: string,
  nn: number | string,
): string {
  const cleanSlug = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const num = String(nn).padStart(2, "0").slice(-2);
  return `${grade}-${subject}-${cleanSlug}-${num}`;
}

export function parseMissionId(id: string): ParsedMissionId | null {
  const match = MISSION_ID_RE.exec(id);
  if (!match) return null;
  const grade = match[1];
  const subject = match[2];
  const slug = match[3];
  const nn = match[4];
  if (!grade || !subject || !slug || !nn) return null;
  if (!isGradeLevel(grade) || !isSubjectSlug(subject)) return null;
  return { grade, subject, slug, nn };
}

export function isValidMissionId(id: string): boolean {
  return parseMissionId(id) !== null;
}

export function isValidStepSlug(slug: string): boolean {
  return STEP_SLUG_RE.test(slug);
}

/** Id canonique d’étape : `{missionId}/{stepSlug}`. */
export function stepId(missionId: string, slug: string): string {
  return `${missionId}/${slug}`;
}

export function parseStepId(id: string): { missionId: string; slug: string } | null {
  const idx = id.lastIndexOf("/");
  if (idx <= 0 || idx === id.length - 1) return null;
  const missionId = id.slice(0, idx);
  const slug = id.slice(idx + 1);
  if (!isValidMissionId(missionId) || !isValidStepSlug(slug)) return null;
  return { missionId, slug };
}

/** Extrait le slug local (suffixe) même pour d’anciens ids courts. */
export function stepSlugOf(id: string): string {
  const parsed = parseStepId(id);
  if (parsed) return parsed.slug;
  return id;
}

export function ordinalStepSlug(index: number): string {
  return `s${String(index + 1).padStart(2, "0")}`;
}
