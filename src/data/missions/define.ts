import type {
  GradeLevel,
  MissionDef,
  MissionDifficulty,
  Step,
  SubjectSlug,
  UniverseCopy,
  UniverseSlug,
} from "../types";
import { findThemeByMissionId } from "../programmeThemes";
import { ordinalStepSlug, stepId } from "./ids";

export function allUniverses(copy: UniverseCopy): Record<UniverseSlug, UniverseCopy> {
  return {
    football: copy,
    rugby: copy,
    equitation: copy,
    espace: copy,
  };
}

type StepInput = Omit<Step, "id" | "slug"> & {
  /** Slug local ; si omis, `s01`, `s02`… selon l’ordre. */
  slug?: string;
  /** Ancien id court conservé comme clé de scène. */
  legacyId?: string;
};

/** Construit des étapes avec ids canoniques `{missionId}/{slug}`. */
export function defineSteps(missionId: string, inputs: StepInput[]): Step[] {
  return inputs.map((input, index) => {
    const slug = input.slug ?? ordinalStepSlug(index);
    const { legacyId, slug: _s, ...rest } = input;
    return {
      ...rest,
      slug,
      id: stepId(missionId, slug),
      scene: input.scene ?? legacyId ?? slug,
    };
  });
}

export function defineMission(def: {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  title: string;
  blurb: string;
  /** @deprecated Préférer laisser false — catalogue non publié par défaut. */
  available?: boolean;
  official?: boolean;
  difficulty?: MissionDifficulty;
  themeId?: string | null;
  version?: number;
  steps: StepInput[];
}): MissionDef {
  const linkedTheme = findThemeByMissionId(def.id);
  return {
    id: def.id,
    grade: def.grade,
    subject: def.subject,
    title: def.title,
    blurb: def.blurb,
    // Catalogue embarqué : non publié, non officiel, difficulté non renseignée.
    available: def.available ?? false,
    official: def.official ?? false,
    difficulty: def.difficulty ?? null,
    themeId: def.themeId ?? linkedTheme?.id ?? null,
    version: def.version ?? 1,
    source: "builtin",
    steps: defineSteps(def.id, def.steps),
  };
}
