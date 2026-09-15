export type UniverseSlug = "football" | "rugby" | "equitation" | "espace";
export type PlayMode = "cahier" | "qcm";
export type AppRole = "eleve" | "enseignant";
export type GradeLevel = "cp" | "ce1" | "ce2" | "cm1" | "cm2";
export type SubjectSlug =
  | "francais"
  | "maths"
  | "questionner-le-monde"
  | "histoire-geo"
  | "sciences"
  | "emc"
  | "anglais"
  | "eps"
  | "arts-plastiques"
  | "education-musicale";


export type TeacherAccount = {
  id: string;
  email: string;
  backend: "local" | "supabase";
};

export type ClassRecord = {
  id: string;
  nom: string;
  code: string;
};

export type StepKind =
  | "tutorial"
  | "continue"
  | "fraction-choice"
  | "simplify"
  | "number"
  | "direction"
  | "method"
  | "bilan"
  | "teaser";

export type UniverseCopy = {
  title: string;
  statement: string;
  note?: string;
  hint?: string;
  caption?: string;
};

export type Step = {
  id: string;
  kind: StepKind;
  kicker: string;
  progress: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  expected?: string;
  distractors?: string[];
  twoStep?: 1 | 2;
  copy: Record<UniverseSlug, UniverseCopy>;
};

export type UniverseDef = {
  slug: UniverseSlug;
  label: string;
  blurb: string;
  icon: string;
  reward: string;
  rewardShort: string;
  cta: string;
  instruction: string;
  mascot: string;
  pouce: string;
  body: string;
  arm: string;
};

export type FeedbackKind = "ok" | "retry" | "hint" | "info";

export type ValidationResult = {
  ok: boolean;
  message: string;
  kind: FeedbackKind;
};

export type ChildSession = {
  id: string;
  deviceId: string;
  prenom: string;
  universe: UniverseSlug;
  mode: PlayMode;
  startedAt: string;
  finishedAt: string | null;
  rewardEarned: boolean;
  classCode: string | null;
  grade: GradeLevel | null;
  subject: SubjectSlug | null;
};

export type StoredAnswer = {
  sessionId: string;
  stepId: string;
  raw: string;
  correct: boolean;
  attempts: number;
  createdAt: string;
};
