import type { GradeLevel, MissionDef, SubjectSlug } from "../types";
import { mission as cm2MathsFractions01 } from "./cm2/maths/cm2-maths-fractions-01";

/** Missions officielles embarquées (TypeScript). */
export const BUILTIN_MISSIONS: MissionDef[] = [cm2MathsFractions01];

/** @deprecated Utiliser BUILTIN_MISSIONS ou resolveMission. */
export const MISSIONS = BUILTIN_MISSIONS;

export function findBuiltinMission(id: string | null | undefined): MissionDef | null {
  if (!id) return null;
  return BUILTIN_MISSIONS.find((item) => item.id === id) ?? null;
}

export function listBuiltinMissions(
  grade?: GradeLevel | null,
  subject?: SubjectSlug | null,
): MissionDef[] {
  return BUILTIN_MISSIONS.filter((item) => {
    if (grade && item.grade !== grade) return false;
    if (subject && item.subject !== subject) return false;
    return true;
  });
}

export function defaultBuiltinMission(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {
  return listBuiltinMissions(grade, subject).find((item) => item.available) ?? null;
}

// Compat API synchrone (catalogue embarqué uniquement).
export function findMission(id: string | null | undefined): MissionDef | null {
  return findBuiltinMission(id);
}

export function listMissions(grade?: GradeLevel | null, subject?: SubjectSlug | null): MissionDef[] {
  return listBuiltinMissions(grade, subject);
}

export function defaultMissionFor(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {
  return defaultBuiltinMission(grade, subject);
}

export {
  buildMissionId,
  isValidMissionId,
  isValidStepSlug,
  ordinalStepSlug,
  parseMissionId,
  parseStepId,
  stepId,
  stepSlugOf,
} from "./ids";
export { allUniverses, defineMission, defineSteps } from "./define";
export { BILAN_CHOICES, DIRECTION_LABELS } from "./labels";
export {
  deleteTeacherMission,
  EDITOR_KINDS,
  listEditableCatalog,
  listResolvedMissions,
  listTeacherMissions,
  resolveMission,
  saveTeacherMission,
  suggestNextMissionId,
} from "./catalog";
