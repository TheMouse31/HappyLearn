import { STEPS } from "./steps";
import type { GradeLevel, MissionDef, SubjectSlug } from "./types";

export const MISSIONS: MissionDef[] = [
  {
    id: "cm2-maths-fractions-01",
    grade: "cm2",
    subject: "maths",
    title: "Fractions en mission",
    blurb: "Une séance de fractions racontée comme une aventure.",
    steps: STEPS,
    available: true,
  },
];

export function findMission(id: string | null | undefined): MissionDef | null {
  if (!id) return null;
  return MISSIONS.find((item) => item.id === id) ?? null;
}

export function listMissions(grade?: GradeLevel | null, subject?: SubjectSlug | null): MissionDef[] {
  return MISSIONS.filter((item) => {
    if (grade && item.grade !== grade) return false;
    if (subject && item.subject !== subject) return false;
    return true;
  });
}

export function defaultMissionFor(grade: GradeLevel | null, subject: SubjectSlug | null): MissionDef | null {
  return listMissions(grade, subject).find((item) => item.available) ?? null;
}
