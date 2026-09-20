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

export type ClassStudent = {
  id: string;
  classId: string;
  prenom: string;
  /** Nom de famille (peut être vide pour les anciens enregistrements). */
  nom: string;
};

export type ClasseSessionStatus = "ouverte" | "fermee";

export type ClasseSession = {
  id: string;
  classId: string;
  code: string;
  statut: ClasseSessionStatus;
  niveau: GradeLevel | null;
  matiere: SubjectSlug | null;
  missionId: string | null;
  univers: UniverseSlug | null;
  mode: PlayMode | null;
  createdAt: string;
  closedAt: string | null;
};

export type ParticipantStatus = "connecte" | "deconnecte";

export type SessionParticipant = {
  id: string;
  sessionId: string;
  eleveId: string;
  prenom: string;
  nom: string;
  deviceId: string;
  statut: ParticipantStatus;
  joinedAt: string;
  lastSeenAt: string;
};

export type MissionDef = {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  title: string;
  blurb: string;
  steps: Step[];
  available: boolean;
  /** Incrémente sans changer l’id public. */
  version?: number;
  /** builtin = catalogue embarqué ; teacher = créée in-app. */
  source?: "builtin" | "teacher";
  teacherId?: string | null;
};

export type SessionStatsFilters = {
  eleveId?: string | null;
  classeSessionId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};

export type StepKind =
  | "tutorial"
  | "continue"
  | "fraction-choice"
  | "simplify"
  | "number"
  | "direction"
  | "choice"
  | "text"
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
  /** Id canonique `{missionId}/{slug}` (ou legacy court pendant transition). */
  id: string;
  /** Slug local unique dans la mission (`s01`, `intro`…). */
  slug: string;
  kind: StepKind;
  kicker: string;
  /** Progression visuelle 0..N (dérivée de l’index si besoin). */
  progress: number;
  expected?: string;
  distractors?: string[];
  twoStep?: 1 | 2;
  copy: Record<UniverseSlug, UniverseCopy>;
  /**
   * Clé de scène visuelle (UniverseScene).
   * Pour la mission fractions migrée : anciens ids (T00, M01…).
   * Les nouvelles missions peuvent l’omettre (scène narrative générique).
   */
  scene?: string;
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
  classId?: string | null;
  classeSessionId?: string | null;
  eleveId?: string | null;
  missionId?: string | null;
};

export type StoredAnswer = {
  sessionId: string;
  stepId: string;
  raw: string;
  correct: boolean;
  attempts: number;
  createdAt: string;
};

/** Affiche « Prénom Nom » (sans double espace si nom vide). */
export function formatStudentName(prenom: string, nom = ""): string {
  return `${prenom.trim()} ${nom.trim()}`.trim();
}
