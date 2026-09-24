export type UniverseSlug = "football" | "rugby" | "equitation" | "espace";
export type PlayMode = "cahier" | "qcm";
export type AppRole = "eleve" | "parent" | "enseignant" | "admin";
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
  isAdmin?: boolean;
  /** Rôle adulte actif (portail courant). */
  accountRole?: "parent" | "enseignant" | "admin";
  /** Tous les rôles disponibles pour ce compte (même e-mail). */
  roles?: Array<"parent" | "enseignant" | "admin">;
};

export type Foyer = {
  id: string;
  ownerId: string;
  nom: string;
  code: string;
  createdAt: string;
};

export type EleveFoyer = {
  id: string;
  foyerId: string;
  prenom: string;
  nom: string;
  niveau: GradeLevel | null;
  createdAt: string;
};

export type AbonnementSubjectType = "enseignant" | "foyer";
export type AbonnementStatus = "active" | "past_due" | "canceled" | "expired" | "trialing";
export type AbonnementSource = "stripe" | "admin_grant" | "local";

export type Abonnement = {
  id: string;
  subjectType: AbonnementSubjectType;
  subjectId: string;
  plan: "premium";
  status: AbonnementStatus;
  source: AbonnementSource;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  grantedBy: string | null;
  grantedNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClassRecord = {
  id: string;
  nom: string;
  code: string;
};

/** Couverture d’un thème du programme pour une classe (hors appli). */
export type ClassThemeCoverage = {
  classId: string;
  themeId: string;
  coveredInClass: boolean;
  coveredAt: string | null;
  note: string;
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
  /** Élève a levé la main pour appeler le professeur. */
  handRaised: boolean;
  handRaisedAt: string | null;
};

/** Niveau de difficulté d’une mission (tag studio / catalogue). Vide = non renseigné. */
export type MissionDifficulty = "facile" | "moyen" | "difficile";

export type MissionDef = {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  title: string;
  blurb: string;
  steps: Step[];
  /** Publiée pour les élèves / enseignants (sinon brouillon). */
  available: boolean;
  /** Mission labellisée officielle Happy Learn (sinon création / brouillon éditorial). */
  official: boolean;
  /** Difficulté pédagogique ; `null` = non renseignée. */
  difficulty: MissionDifficulty | null;
  /** Thème du programme (`programmeThemes`) lié à cette mission. */
  themeId: string | null;
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
  /** Narration / passage d’histoire — bouton Continuer. */
  | "continue"
  /** QCM — propositions = expected + distractors. */
  | "choice"
  /** Réponse courte texte libre. */
  | "text"
  /** Texte à trous — consignes avec `___`, réponses dans expected (séparées par |). */
  | "blanks"
  /** Nombre / calcul (saisie numérique). */
  | "number"
  /** Écoute (TTS) puis réponse optionnelle (QCM ou texte). */
  | "audio"
  /** Rappel de méthode / aide. */
  | "method"
  /** Bilan de fin de parcours (choix soft non noté). */
  | "bilan"
  /** Teaser / clôture avant récompense. */
  | "teaser"
  /** Maths spécialisé — tutoriel fraction. */
  | "tutorial"
  /** Maths spécialisé — choix de fraction. */
  | "fraction-choice"
  /** Maths spécialisé — simplification. */
  | "simplify"
  /** Maths spécialisé — direction spatiale (gauche / axe / droite). */
  | "direction";

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
  foyerId?: string | null;
  eleveFoyerId?: string | null;
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
