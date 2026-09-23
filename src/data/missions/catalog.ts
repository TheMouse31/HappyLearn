import type {
  GradeLevel,
  MissionDef,
  MissionDifficulty,
  Step,
  StepKind,
  SubjectSlug,
} from "../types";
import {
  BUILTIN_MISSIONS,
  defaultBuiltinMission,
  findBuiltinMission,
  listBuiltinMissions,
} from "./index";
import { buildMissionId, isValidMissionId, parseMissionId } from "./ids";
import { getSupabase } from "../../lib/supabase";

const LOCAL_TEACHER_MISSIONS_KEY = "happy-learn-teacher-missions";
const DIFFICULTIES: MissionDifficulty[] = ["facile", "moyen", "difficile"];

/**
 * Palette standardisée du studio — valable pour toutes les matières.
 * Groupe « Maths spécialisé » = kinds historiques fractions (toujours jouables).
 */
export type EditorKindGroup = {
  label: string;
  items: { value: StepKind; label: string; help: string }[];
};

export const EDITOR_KIND_GROUPS: EditorKindGroup[] = [
  {
    label: "Parcours",
    items: [
      {
        value: "continue",
        label: "Narration",
        help: "Texte d’histoire ou consigne sans réponse — bouton Continuer.",
      },
      {
        value: "method",
        label: "Méthode / rappel",
        help: "Affiche une boîte méthode (note) puis Continuer.",
      },
      {
        value: "bilan",
        label: "Bilan",
        help: "Choix soft de fin de parcours (non noté).",
      },
      {
        value: "teaser",
        label: "Clôture / teaser",
        help: "Dernière étape avant la récompense.",
      },
    ],
  },
  {
    label: "Réponses (toutes matières)",
    items: [
      {
        value: "choice",
        label: "QCM",
        help: "Une bonne réponse + distracteurs (séparés par |). Toujours en choix multiples.",
      },
      {
        value: "text",
        label: "Texte libre",
        help: "Réponse courte saisie au clavier (mot, expression).",
      },
      {
        value: "blanks",
        label: "Texte à trous",
        help: "Dans la consigne, écris ___ pour chaque trou. Réponses attendues séparées par |.",
      },
      {
        value: "number",
        label: "Nombre / calcul",
        help: "Saisie numérique (ou QCM si le mode élève est QCM).",
      },
      {
        value: "audio",
        label: "Écoute",
        help: "L’élève écoute la consigne (voix). Avec une réponse attendue = compréhension orale ; sinon écoute seule.",
      },
    ],
  },
  {
    label: "Maths (spécialisé)",
    items: [
      {
        value: "tutorial",
        label: "Tutoriel fraction",
        help: "Montre un exemple de fraction puis saisie numérateur / dénominateur.",
      },
      {
        value: "fraction-choice",
        label: "Choix de fraction",
        help: "Réponse sous forme a/b (cahier ou QCM).",
      },
      {
        value: "simplify",
        label: "Simplifier une fraction",
        help: "Attend la fraction irréductible attendue.",
      },
      {
        value: "direction",
        label: "Direction spatiale",
        help: "QCM gauche / axe / droite (scènes couloirs).",
      },
    ],
  },
];

/** Liste plate (compat selects / itérations). */
export const EDITOR_KINDS: { value: StepKind; label: string }[] = EDITOR_KIND_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ value: item.value, label: item.label })),
);

export const MISSION_DIFFICULTIES: { value: MissionDifficulty; label: string }[] = [
  { value: "facile", label: "Facile" },
  { value: "moyen", label: "Moyen" },
  { value: "difficile", label: "Difficile" },
];

export function editorKindHelp(kind: StepKind): string {
  for (const group of EDITOR_KIND_GROUPS) {
    const found = group.items.find((item) => item.value === kind);
    if (found) return found.help;
  }
  return "";
}

/** Kinds qui ouvrent l’onglet Réponse dans le studio. */
export function editorKindNeedsAnswer(kind: StepKind): boolean {
  return (
    kind === "number" ||
    kind === "text" ||
    kind === "choice" ||
    kind === "blanks" ||
    kind === "audio" ||
    kind === "direction" ||
    kind === "fraction-choice" ||
    kind === "simplify" ||
    kind === "tutorial"
  );
}

function normalizeDifficulty(value: unknown): MissionDifficulty {
  return DIFFICULTIES.includes(value as MissionDifficulty) ? (value as MissionDifficulty) : "moyen";
}

type MissionRow = {
  id: string;
  grade: string;
  subject: string;
  title: string;
  blurb: string;
  available: boolean;
  official?: boolean;
  difficulty?: string;
  theme_id?: string | null;
  steps: unknown;
  version?: number;
  source?: string;
  teacher_id?: string | null;
};

function mapRemoteMission(row: MissionRow): MissionDef | null {
  if (!isValidMissionId(row.id)) return null;
  const steps = Array.isArray(row.steps) ? (row.steps as Step[]) : [];
  return {
    id: row.id,
    grade: row.grade as GradeLevel,
    subject: row.subject as SubjectSlug,
    title: row.title,
    blurb: row.blurb ?? "",
    available: Boolean(row.available),
    official: Boolean(row.official),
    difficulty: normalizeDifficulty(row.difficulty),
    themeId: typeof row.theme_id === "string" && row.theme_id ? row.theme_id : null,
    version: row.version ?? 1,
    source: row.source === "builtin" ? "builtin" : "teacher",
    teacherId: row.teacher_id ?? null,
    steps,
  };
}

const MISSION_SELECT =
  "id, grade, subject, title, blurb, available, official, difficulty, theme_id, steps, version, source, teacher_id" as const;

function isMissionRow(value: unknown): value is MissionRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return typeof row.id === "string" && typeof row.grade === "string" && typeof row.subject === "string";
}

function toMissionPayload(mission: MissionDef) {
  return {
    id: mission.id,
    grade: mission.grade,
    subject: mission.subject,
    title: mission.title,
    blurb: mission.blurb,
    available: mission.available,
    official: mission.official,
    difficulty: mission.difficulty,
    theme_id: mission.themeId,
    steps: mission.steps,
    version: mission.version ?? 1,
    source: mission.source === "builtin" ? "builtin" : "teacher",
    teacher_id: mission.teacherId ?? null,
    updated_at: new Date().toISOString(),
  };
}

function mergeMissions(builtin: MissionDef[], remote: MissionDef[]): MissionDef[] {
  const byId = new Map<string, MissionDef>();
  for (const item of builtin) byId.set(item.id, item);
  for (const item of remote) {
    const existing = byId.get(item.id);
    // Distant gagne pour les overrides / créations ; conserve le builtin si remote incomplet.
    if (!existing || item.source === "teacher" || item.version !== undefined) {
      byId.set(item.id, { ...existing, ...item, steps: item.steps?.length ? item.steps : existing?.steps ?? [] });
    }
  }
  return [...byId.values()];
}

function readLocalTeacherMissions(): MissionDef[] {
  try {
    const raw = localStorage.getItem(LOCAL_TEACHER_MISSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MissionDef[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => isValidMissionId(item.id))
      .map((item) => ({
        ...item,
        official: Boolean(item.official),
        difficulty: normalizeDifficulty(item.difficulty),
        themeId: item.themeId ?? null,
      }));
  } catch {
    return [];
  }
}

function writeLocalTeacherMissions(items: MissionDef[]): void {
  localStorage.setItem(LOCAL_TEACHER_MISSIONS_KEY, JSON.stringify(items));
}

export async function fetchRemoteMissions(filters?: {
  grade?: GradeLevel | null;
  subject?: SubjectSlug | null;
  teacherId?: string | null;
  includeDrafts?: boolean;
}): Promise<MissionDef[]> {
  const local = readLocalTeacherMissions().filter((item) => {
    if (filters?.grade && item.grade !== filters.grade) return false;
    if (filters?.subject && item.subject !== filters.subject) return false;
    if (filters?.teacherId && item.teacherId !== filters.teacherId) return false;
    if (!filters?.includeDrafts && !item.available) return false;
    return true;
  });

  const client = getSupabase();
  if (!client) return local;

  let query = client
    .from("missions")
    .select(MISSION_SELECT)
    .order("updated_at", { ascending: false });
  if (filters?.grade) query = query.eq("grade", filters.grade);
  if (filters?.subject) query = query.eq("subject", filters.subject);
  if (filters?.teacherId) query = query.eq("teacher_id", filters.teacherId);
  if (!filters?.includeDrafts) query = query.eq("available", true);
  const { data, error } = await query;
  if (error || !data) return local;
  const rows = (data as unknown[]).filter(isMissionRow);
  const remote = rows
    .map((row) => mapRemoteMission(row))
    .filter((item): item is MissionDef => item !== null);
  return mergeMissions(remote, local);
}

export async function resolveMission(id: string | null | undefined): Promise<MissionDef | null> {
  if (!id) return null;
  const builtin = findBuiltinMission(id);
  const local = readLocalTeacherMissions().find((item) => item.id === id) ?? null;
  const client = getSupabase();
  if (!client) return local ?? builtin;
  const { data, error } = await client
    .from("missions")
    .select(MISSION_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return local ?? builtin;
  const row = data as unknown;
  if (!isMissionRow(row)) return local ?? builtin;
  const remote = mapRemoteMission(row);
  return remote ?? local ?? builtin;
}

export async function listResolvedMissions(
  grade?: GradeLevel | null,
  subject?: SubjectSlug | null,
): Promise<MissionDef[]> {
  const builtin = listBuiltinMissions(grade, subject);
  const remote = await fetchRemoteMissions({ grade, subject, includeDrafts: false });
  return mergeMissions(builtin, remote).filter((item) => item.available);
}

export async function listTeacherMissions(teacherId: string): Promise<MissionDef[]> {
  const remote = await fetchRemoteMissions({ teacherId, includeDrafts: true });
  return remote.filter((item) => item.source === "teacher");
}

/** Catalogue éditeur professeur (legacy) : builtins + missions du professeur. */
export async function listEditableCatalog(teacherId: string): Promise<MissionDef[]> {
  const teacher = await listTeacherMissions(teacherId);
  return mergeMissions(BUILTIN_MISSIONS, teacher);
}

/**
 * Pousse le catalogue embarqué vers Supabase (admin).
 * Idempotent : upsert par id, marque non publiées / non officielles si besoin.
 */
export async function syncBuiltinMissionsToSupabase(): Promise<{
  ok: boolean;
  upserted: number;
  error?: string;
}> {
  const client = getSupabase();
  if (!client) return { ok: false, upserted: 0, error: "Supabase indisponible." };

  const payload = BUILTIN_MISSIONS.map((mission) =>
    toMissionPayload({
      ...mission,
      available: false,
      official: false,
      source: "builtin",
      teacherId: null,
    }),
  );

  // Upsert par lots pour rester sous les limites payload.
  const chunkSize = 20;
  let upserted = 0;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    const { error } = await client.from("missions").upsert(chunk, { onConflict: "id" });
    if (error) return { ok: false, upserted, error: error.message };
    upserted += chunk.length;
  }
  return { ok: true, upserted };
}

/** Catalogue administrateur : toutes les missions (builtins + overrides / créations). */
export async function listAdminCatalog(): Promise<MissionDef[]> {
  const remote = await fetchRemoteMissions({ includeDrafts: true });
  return mergeMissions(BUILTIN_MISSIONS, remote).sort((a, b) => {
    const gradeCmp = a.grade.localeCompare(b.grade);
    if (gradeCmp !== 0) return gradeCmp;
    const subjectCmp = a.subject.localeCompare(b.subject);
    if (subjectCmp !== 0) return subjectCmp;
    return a.title.localeCompare(b.title, "fr", { sensitivity: "base" });
  });
}

export async function suggestNextMissionId(
  grade: GradeLevel,
  subject: SubjectSlug,
  slug: string,
): Promise<string> {
  const cleanSlug =
    slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "mission";
  const all = mergeMissions(
    BUILTIN_MISSIONS,
    await fetchRemoteMissions({ grade, subject, includeDrafts: true }),
  );
  let maxNn = 0;
  for (const item of all) {
    const parsed = parseMissionId(item.id);
    if (!parsed) continue;
    if (parsed.grade !== grade || parsed.subject !== subject || parsed.slug !== cleanSlug) continue;
    maxNn = Math.max(maxNn, Number(parsed.nn));
  }
  return buildMissionId(grade, subject, cleanSlug, maxNn + 1);
}

export type SaveMissionInput = {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  title: string;
  blurb: string;
  available: boolean;
  official: boolean;
  difficulty: MissionDifficulty;
  themeId: string | null;
  steps: Step[];
  version?: number;
  teacherId: string;
  /** Admin : autorise l’écrasement d’une mission officielle (override distant). */
  allowBuiltinOverride?: boolean;
};

export async function saveTeacherMission(
  input: SaveMissionInput,
): Promise<{ ok: true; mission: MissionDef } | { ok: false; error: string }> {
  if (!isValidMissionId(input.id)) {
    return { ok: false, error: "Identifiant de mission invalide." };
  }
  if (findBuiltinMission(input.id) && !input.allowBuiltinOverride) {
    return { ok: false, error: "Une mission porte déjà cet id. Duplique-la ou change le thème." };
  }
  const mission: MissionDef = {
    id: input.id,
    grade: input.grade,
    subject: input.subject,
    title: input.title.trim() || "Sans titre",
    blurb: input.blurb.trim(),
    available: input.available,
    official: input.official,
    difficulty: normalizeDifficulty(input.difficulty),
    themeId: input.themeId,
    version: input.version ?? 1,
    source: input.allowBuiltinOverride && findBuiltinMission(input.id) ? "builtin" : "teacher",
    teacherId: input.teacherId,
    steps: input.steps,
  };

  const client = getSupabase();
  if (!client) {
    const current = readLocalTeacherMissions().filter((item) => item.id !== mission.id);
    current.unshift(mission);
    writeLocalTeacherMissions(current);
    return { ok: true, mission };
  }

  const payload = toMissionPayload(mission);
  const { error } = await client.from("missions").upsert(payload, { onConflict: "id" });
  if (error) {
    const current = readLocalTeacherMissions().filter((item) => item.id !== mission.id);
    current.unshift(mission);
    writeLocalTeacherMissions(current);
    return { ok: true, mission };
  }
  return { ok: true, mission };
}

export async function deleteTeacherMission(
  id: string,
  teacherId: string,
  options?: { allowBuiltinOverride?: boolean },
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (findBuiltinMission(id) && !options?.allowBuiltinOverride) {
    return { ok: false, error: "Impossible de supprimer une mission du catalogue embarqué." };
  }
  const client = getSupabase();
  if (client) {
    let query = client.from("missions").delete().eq("id", id);
    if (!options?.allowBuiltinOverride) {
      query = query.eq("teacher_id", teacherId);
    }
    const { error } = await query;
    if (error) {
      writeLocalTeacherMissions(readLocalTeacherMissions().filter((item) => item.id !== id));
      return { ok: false, error: error.message };
    }
  }
  writeLocalTeacherMissions(readLocalTeacherMissions().filter((item) => item.id !== id));
  return { ok: true };
}

export function listCatalogSync(grade?: GradeLevel | null, subject?: SubjectSlug | null): MissionDef[] {
  return listBuiltinMissions(grade, subject);
}

export function defaultMissionSync(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {
  return defaultBuiltinMission(grade, subject);
}

export { BUILTIN_MISSIONS, findBuiltinMission, listBuiltinMissions };
