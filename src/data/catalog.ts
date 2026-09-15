import type { GradeLevel, SubjectSlug } from "./types";

export type GradeDef = {
  slug: GradeLevel;
  label: string;
  cycle: string;
};

export type SubjectDef = {
  slug: SubjectSlug;
  label: string;
  blurb: string;
};

export type CourseOffer = {
  grade: GradeLevel;
  subject: SubjectSlug;
  available: boolean;
  title: string;
  blurb: string;
};

export const GRADES: GradeDef[] = [
  { slug: "cp", label: "CP", cycle: "Cycle 2" },
  { slug: "ce1", label: "CE1", cycle: "Cycle 2" },
  { slug: "ce2", label: "CE2", cycle: "Cycle 2" },
  { slug: "cm1", label: "CM1", cycle: "Cycle 3" },
  { slug: "cm2", label: "CM2", cycle: "Cycle 3" },
];

/** Domaines du programme de l’école élémentaire (cycles 2 et 3). */
export const SUBJECTS: SubjectDef[] = [
  { slug: "francais", label: "Français", blurb: "Lecture, écriture et langue" },
  { slug: "maths", label: "Mathématiques", blurb: "Nombres, calculs et problèmes" },
  {
    slug: "questionner-le-monde",
    label: "Questionner le monde",
    blurb: "Vivant, matière, temps et espace (cycle 2)",
  },
  {
    slug: "histoire-geo",
    label: "Histoire-Géographie",
    blurb: "Le temps et l’espace (cycle 3)",
  },
  {
    slug: "sciences",
    label: "Sciences et technologie",
    blurb: "Expériences, objets et vivant (cycle 3)",
  },
  { slug: "emc", label: "EMC", blurb: "Enseignement moral et civique" },
  { slug: "anglais", label: "Anglais", blurb: "Langue vivante" },
  { slug: "eps", label: "EPS", blurb: "Éducation physique et sportive" },
  { slug: "arts-plastiques", label: "Arts plastiques", blurb: "Créer et regarder" },
  {
    slug: "education-musicale",
    label: "Éducation musicale",
    blurb: "Chanter, écouter, inventer",
  },
];

const SUBJECT_SLUGS = new Set(SUBJECTS.map((item) => item.slug));

/** Catalogue des parcours. Seul CM2 maths est jouable pour l’instant. */
export const COURSE_OFFERS: CourseOffer[] = [
  {
    grade: "cm2",
    subject: "maths",
    available: true,
    title: "Fractions en mission",
    blurb: "Une séance de fractions racontée comme une aventure.",
  },
];

export function gradeLabel(slug: GradeLevel | null): string {
  return GRADES.find((item) => item.slug === slug)?.label ?? "";
}

export function subjectLabel(slug: SubjectSlug | null): string {
  return SUBJECTS.find((item) => item.slug === slug)?.label ?? "";
}

export function findOffer(grade: GradeLevel | null, subject: SubjectSlug | null): CourseOffer | null {
  if (!grade || !subject) return null;
  return COURSE_OFFERS.find((item) => item.grade === grade && item.subject === subject) ?? null;
}

export function isCoursePlayable(grade: GradeLevel | null, subject: SubjectSlug | null): boolean {
  return findOffer(grade, subject)?.available === true;
}

export function isGradeLevel(value: unknown): value is GradeLevel {
  return value === "cp" || value === "ce1" || value === "ce2" || value === "cm1" || value === "cm2";
}

export function isSubjectSlug(value: unknown): value is SubjectSlug {
  return typeof value === "string" && SUBJECT_SLUGS.has(value as SubjectSlug);
}
