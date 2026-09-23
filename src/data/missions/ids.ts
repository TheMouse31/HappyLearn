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

import { GRADES, SUBJECTS, isGradeLevel, isSubjectSlug } from "../catalog";
import type { GradeLevel, SubjectSlug } from "../types";

const STEP_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GRADE_PREFIXES = GRADES.map((item) => item.slug).sort((a, b) => b.length - a.length);
const SUBJECT_PREFIXES = SUBJECTS.map((item) => item.slug).sort((a, b) => b.length - a.length);

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
  const grade = GRADE_PREFIXES.find((item) => id.startsWith(`${item}-`));
  if (!grade || !isGradeLevel(grade)) return null;
  const afterGrade = id.slice(grade.length + 1);
  const subject = SUBJECT_PREFIXES.find((item) => afterGrade.startsWith(`${item}-`));
  if (!subject || !isSubjectSlug(subject)) return null;
  const afterSubject = afterGrade.slice(subject.length + 1);
  const nnMatch = /-(\d{2})$/.exec(afterSubject);
  if (!nnMatch) return null;
  const slug = afterSubject.slice(0, -(nnMatch[0].length));
  if (!slug || !STEP_SLUG_RE.test(slug)) return null;
  return { grade, subject, slug, nn: nnMatch[1]! };
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
