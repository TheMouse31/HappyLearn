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

/** Catalogue des parcours : tous les couples classe×matière couverts par une mission builtin. */
export const COURSE_OFFERS: CourseOffer[] = [
  {
    grade: "cm2",
    subject: "maths",
    available: true,
    title: "Mathématiques — missions",
    blurb: "Nombres, calculs et problèmes",
  },
  {
    grade: "cm1",
    subject: "maths",
    available: true,
    title: "Mathématiques — missions",
    blurb: "Nombres, calculs et problèmes",
  },
  {
    grade: "ce2",
    subject: "maths",
    available: true,
    title: "Mathématiques — missions",
    blurb: "Nombres, calculs et problèmes",
  },
  {
    grade: "ce1",
    subject: "maths",
    available: true,
    title: "Mathématiques — missions",
    blurb: "Nombres, calculs et problèmes",
  },
  {
    grade: "cp",
    subject: "maths",
    available: true,
    title: "Mathématiques — missions",
    blurb: "Nombres, calculs et problèmes",
  },
  {
    grade: "cm2",
    subject: "francais",
    available: true,
    title: "Français — missions",
    blurb: "Lecture, écriture et langue",
  },
  {
    grade: "cm1",
    subject: "francais",
    available: true,
    title: "Français — missions",
    blurb: "Lecture, écriture et langue",
  },
  {
    grade: "ce2",
    subject: "francais",
    available: true,
    title: "Français — missions",
    blurb: "Lecture, écriture et langue",
  },
  {
    grade: "ce1",
    subject: "francais",
    available: true,
    title: "Français — missions",
    blurb: "Lecture, écriture et langue",
  },
  {
    grade: "cp",
    subject: "francais",
    available: true,
    title: "Français — missions",
    blurb: "Lecture, écriture et langue",
  },
  {
    grade: "cm2",
    subject: "histoire-geo",
    available: true,
    title: "Histoire-Géographie — missions",
    blurb: "Le temps et l’espace",
  },
  {
    grade: "cm1",
    subject: "histoire-geo",
    available: true,
    title: "Histoire-Géographie — missions",
    blurb: "Le temps et l’espace",
  },
  {
    grade: "cm2",
    subject: "sciences",
    available: true,
    title: "Sciences et technologie — missions",
    blurb: "Expériences, objets et vivant",
  },
  {
    grade: "cm1",
    subject: "sciences",
    available: true,
    title: "Sciences et technologie — missions",
    blurb: "Expériences, objets et vivant",
  },
  {
    grade: "ce2",
    subject: "questionner-le-monde",
    available: true,
    title: "Questionner le monde — missions",
    blurb: "Vivant, matière, temps et espace",
  },
  {
    grade: "ce1",
    subject: "questionner-le-monde",
    available: true,
    title: "Questionner le monde — missions",
    blurb: "Vivant, matière, temps et espace",
  },
  {
    grade: "cp",
    subject: "questionner-le-monde",
    available: true,
    title: "Questionner le monde — missions",
    blurb: "Vivant, matière, temps et espace",
  },
  {
    grade: "cm2",
    subject: "emc",
    available: true,
    title: "EMC — missions",
    blurb: "Enseignement moral et civique",
  },
  {
    grade: "cm1",
    subject: "emc",
    available: true,
    title: "EMC — missions",
    blurb: "Enseignement moral et civique",
  },
  {
    grade: "ce2",
    subject: "emc",
    available: true,
    title: "EMC — missions",
    blurb: "Enseignement moral et civique",
  },
  {
    grade: "ce1",
    subject: "emc",
    available: true,
    title: "EMC — missions",
    blurb: "Enseignement moral et civique",
  },
  {
    grade: "cp",
    subject: "emc",
    available: true,
    title: "EMC — missions",
    blurb: "Enseignement moral et civique",
  },
  {
    grade: "cm2",
    subject: "anglais",
    available: true,
    title: "Anglais — missions",
    blurb: "Langue vivante",
  },
  {
    grade: "cm1",
    subject: "anglais",
    available: true,
    title: "Anglais — missions",
    blurb: "Langue vivante",
  },
  {
    grade: "ce2",
    subject: "anglais",
    available: true,
    title: "Anglais — missions",
    blurb: "Langue vivante",
  },
  {
    grade: "ce1",
    subject: "anglais",
    available: true,
    title: "Anglais — missions",
    blurb: "Langue vivante",
  },
  {
    grade: "cp",
    subject: "anglais",
    available: true,
    title: "Anglais — missions",
    blurb: "Langue vivante",
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
