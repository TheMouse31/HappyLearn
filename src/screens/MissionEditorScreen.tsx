/**
 * Studio missions (`/espace-admin/missions`) : catalogue + éditeur 3 colonnes
 * (sommaire | panneau étape | aperçu élève). Textes riches + ScenePicker inclus.
 */
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import {
  EMPTY_ILLUSTRATION_FORM,
  IllustrationCreatePanel,
  type IllustrationFormState,
} from "../components/IllustrationCreatePanel";
import { RichTextEditor } from "../components/RichTextEditor";
import { ScenePicker } from "../components/ScenePicker";
import { Shell } from "../components/Shell";
import { UniverseScene } from "../components/UniverseScene";
import { GRADES, SUBJECTS, gradeLabel, subjectLabel } from "../data/catalog";
import {
  EDITOR_KIND_GROUPS,
  editorKindHelp,
  editorKindNeedsAnswer,
  allUniverses,
  defineSteps,
  deleteTeacherMission,
  listAdminCatalog,
  MISSION_DIFFICULTIES,
  ordinalStepSlug,
  parseMissionId,
  resolveMission,
  saveTeacherMission,
  suggestNextMissionId,
  syncBuiltinMissionsToSupabase,
} from "../data/missions/index";
import {
  findThemeById,
  findThemeByMissionId,
  listSubjectsForGrade,
  listThemesFor,
  PROGRAMME_THEMES,
  themeSlugFromId,
} from "../data/programmeThemes";
import type {
  GradeLevel,
  MissionDef,
  MissionDifficulty,
  Step,
  StepKind,
  SubjectSlug,
  UniverseCopy,
  UniverseSlug,
} from "../data/types";
import { UNIVERSE_ORDER, UNIVERSES } from "../data/universes";
import { sceneKeyOf } from "../engine/missionEngine";
import {
  CUSTOM_ILLUSTRATIONS_EVENT,
  customSceneKey,
  type CustomIllustration,
} from "../lib/customIllustrations";
import { getAllSceneOptions } from "../lib/illustrations";
import { sanitizeRichHtml } from "../lib/richText";
import { useSession } from "../lib/session";

/** Formulaire plat d’une étape (les copy multi-univers sont répliquées à l’enregistrement). */
type DraftStep = {
  slug: string;
  kind: StepKind;
  kicker: string;
  progress: number;
  expected: string;
  /** Mauvaises réponses QCM (une case = une proposition). */
  distractors: string[];
  title: string;
  statement: string;
  note: string;
  hint: string;
  caption: string;
  scene: string;
};

/** Sous-panneaux de l’étape courante (onglets workspace). */
type StepPane = "content" | "illustration" | "answer";

/** Kinds joués en QCM (bonne réponse + mauvaises réponses séparées). */
function isQcmKind(kind: StepKind): boolean {
  return (
    kind === "choice" ||
    kind === "number" ||
    kind === "fraction-choice" ||
    kind === "simplify" ||
    kind === "tutorial" ||
    kind === "direction" ||
    kind === "audio"
  );
}

function emptyStep(index: number): DraftStep {
  return {
    slug: ordinalStepSlug(index),
    kind: "continue",
    kicker: `Étape ${index + 1}`,
    progress: Math.min(index + 1, 6),
    expected: "",
    distractors: ["", ""],
    title: "",
    statement: "",
    note: "",
    hint: "",
    caption: "",
    scene: "",
  };
}

function stepToDraft(step: Step): DraftStep {
  const copy = step.copy.football ?? Object.values(step.copy)[0];
  const distractors = [...(step.distractors ?? [])];
  while (distractors.length < 2 && isQcmKind(step.kind)) distractors.push("");
  return {
    slug: step.slug,
    kind: step.kind,
    kicker: step.kicker,
    progress: step.progress,
    expected: step.expected ?? "",
    distractors,
    title: copy?.title ?? "",
    statement: copy?.statement ?? "",
    note: copy?.note ?? "",
    hint: copy?.hint ?? "",
    caption: copy?.caption ?? "",
    scene: step.scene ?? "",
  };
}

/** Convertit les brouillons éditeur → Steps métier (HTML sanitisé + copy partagée). */
function draftToSteps(missionId: string, drafts: DraftStep[]): Step[] {
  return defineSteps(
    missionId,
    drafts.map((draft) => {
      const copy: UniverseCopy = {
        title: draft.title.trim() || draft.kicker,
        statement: sanitizeRichHtml(draft.statement) || "…",
        ...(draft.note.trim() ? { note: sanitizeRichHtml(draft.note) } : {}),
        ...(draft.hint.trim() ? { hint: sanitizeRichHtml(draft.hint) } : {}),
        ...(draft.caption.trim() ? { caption: draft.caption.trim() } : {}),
      };
      const distractors = draft.distractors.map((item) => item.trim()).filter(Boolean);
      return {
        slug: draft.slug.trim() || undefined,
        kind: draft.kind,
        kicker: draft.kicker.trim() || "Étape",
        progress: Number(draft.progress) || 0,
        ...(draft.expected.trim() ? { expected: draft.expected.trim() } : {}),
        ...(draft.kind !== "blanks" && distractors.length ? { distractors } : {}),
        ...(draft.scene.trim() ? { scene: draft.scene.trim() } : {}),
        copy: allUniverses(copy),
      };
    }),
  );
}

function missionToDrafts(mission: MissionDef): {
  grade: GradeLevel;
  subject: SubjectSlug;
  slug: string;
  title: string;
  blurb: string;
  available: boolean;
  official: boolean;
  difficulty: MissionDifficulty | "";
  themeId: string;
  steps: DraftStep[];
} {
  const parsed = parseMissionId(mission.id);
  const theme =
    findThemeById(mission.themeId) ?? findThemeByMissionId(mission.id) ?? null;
  return {
    grade: mission.grade,
    subject: mission.subject,
    slug: parsed?.slug ?? "mission",
    title: mission.title,
    blurb: mission.blurb,
    available: mission.available,
    official: Boolean(mission.official),
    difficulty: mission.difficulty ?? "",
    themeId: theme?.id ?? mission.themeId ?? "",
    steps: mission.steps.map(stepToDraft),
  };
}

function needsAnswer(kind: StepKind): boolean {
  return editorKindNeedsAnswer(kind);
}

export function MissionEditorScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, teacher } = useSession();

  const [catalog, setCatalog] = useState<MissionDef[]>([]);
  const [filter, setFilter] = useState("");
  const [filterGrade, setFilterGrade] = useState<GradeLevel | "">("");
  const [filterSubject, setFilterSubject] = useState<SubjectSlug | "">("");
  const [filterThemeId, setFilterThemeId] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [filterOfficial, setFilterOfficial] = useState<"all" | "yes" | "no">("all");
  const [filterDifficulty, setFilterDifficulty] = useState<MissionDifficulty | "none" | "">("");
  const [showThemeCoverage, setShowThemeCoverage] = useState(false);
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [builtinOverride, setBuiltinOverride] = useState(false);

  const [grade, setGrade] = useState<GradeLevel>("cm2");
  const [subject, setSubject] = useState<SubjectSlug>("maths");
  const [themeId, setThemeId] = useState("");
  const [slug, setSlug] = useState("nouvelle-mission");
  const [missionId, setMissionId] = useState("");
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [available, setAvailable] = useState(false);
  const [official, setOfficial] = useState(false);
  const [difficulty, setDifficulty] = useState<MissionDifficulty | "">("");
  const [steps, setSteps] = useState<DraftStep[]>([emptyStep(0)]);
  const [selectedStep, setSelectedStep] = useState(0);
  const [previewUniverse, setPreviewUniverse] = useState<UniverseSlug>("football");
  const [previewSuccess, setPreviewSuccess] = useState(false);
  const [sceneOptions, setSceneOptions] = useState(() => getAllSceneOptions());
  const [stepPane, setStepPane] = useState<StepPane>("content");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creatingIllust, setCreatingIllust] = useState(false);
  const [illustForm, setIllustForm] = useState<IllustrationFormState>(EMPTY_ILLUSTRATION_FORM);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [syncNote, setSyncNote] = useState("");

  const subjectsForGrade = useMemo(() => {
    const slugs = listSubjectsForGrade(grade);
    return SUBJECTS.filter((item) => slugs.includes(item.slug));
  }, [grade]);

  const themesForSelection = useMemo(
    () => listThemesFor(grade, subject),
    [grade, subject],
  );

  async function refreshCatalog() {
    const rows = await listAdminCatalog();
    setCatalog(rows);
  }

  useEffect(() => {
    void refreshCatalog();
  }, [teacher?.id]);

  useEffect(() => {
    if (role !== "admin" || !teacher?.isAdmin) return;
    let cancelled = false;
    void syncBuiltinMissionsToSupabase().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setSyncNote(`${result.upserted} missions synchronisées dans Supabase.`);
        void refreshCatalog();
      } else if (result.error) {
        setSyncNote(`Sync catalogue : ${result.error}`);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [role, teacher?.isAdmin]);

  // Cascade : si la matière n’existe pas pour le niveau, prendre la 1ʳᵉ disponible.
  useEffect(() => {
    if (!subjectsForGrade.length) return;
    if (!subjectsForGrade.some((item) => item.slug === subject)) {
      setSubject(subjectsForGrade[0].slug);
    }
  }, [subjectsForGrade, subject]);

  // Cascade : thème cohérent avec niveau × matière.
  useEffect(() => {
    if (!themesForSelection.length) {
      if (themeId) setThemeId("");
      return;
    }
    if (!themesForSelection.some((theme) => theme.id === themeId)) {
      const first = themesForSelection[0];
      setThemeId(first.id);
      if (!editingId && !builtinOverride) {
        setSlug(themeSlugFromId(first.id, grade, subject));
      }
    }
  }, [themesForSelection, themeId, editingId, builtinOverride, grade, subject]);

  // Rafraîchit ScenePicker quand la bibliothèque perso change (admin ou création inline).
  useEffect(() => {
    function syncScenes() {
      setSceneOptions(getAllSceneOptions());
    }
    syncScenes();
    window.addEventListener(CUSTOM_ILLUSTRATIONS_EVENT, syncScenes);
    window.addEventListener("storage", syncScenes);
    return () => {
      window.removeEventListener(CUSTOM_ILLUSTRATIONS_EVENT, syncScenes);
      window.removeEventListener("storage", syncScenes);
    };
  }, []);

  // Deep-links : ?new=1 (création) et ?id=… (ouverture).
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      startCreate();
    }
  }, [searchParams]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id || !teacher) return;
    void resolveMission(id).then((mission) => {
      if (!mission) return;
      openMission(mission, false);
    });
  }, [searchParams, teacher?.id]);

  useEffect(() => {
    if (mode !== "edit" || readOnly || editingId || builtinOverride) return;
    let cancelled = false;
    void suggestNextMissionId(grade, subject, slug).then((id) => {
      if (!cancelled) setMissionId(id);
    });
    return () => {
      cancelled = true;
    };
  }, [grade, subject, slug, mode, readOnly, editingId, builtinOverride]);

  const currentDraft = steps[selectedStep] ?? null;
  const previewSteps = useMemo(
    () => (missionId ? draftToSteps(missionId, steps) : []),
    [missionId, steps],
  );
  const previewStep = previewSteps[selectedStep] ?? previewSteps[0] ?? null;
  const previewSceneKey = previewStep ? sceneKeyOf(previewStep) : "";
  const selectedSceneOption =
    sceneOptions.find((item) => item.value === (currentDraft?.scene ?? "")) ?? sceneOptions[0];

  useEffect(() => {
    setPreviewSuccess(false);
    setStepPane("content");
    setCreatingIllust(false);
  }, [selectedStep]);

  // Si le type d’étape n’a plus de réponse, quitter le panneau « answer » (évite un workspace vide).
  useEffect(() => {
    if (stepPane === "answer" && currentDraft && !needsAnswer(currentDraft.kind)) {
      setStepPane("content");
    }
  }, [stepPane, currentDraft?.kind]);

  const filterSubjects = useMemo(() => {
    if (!filterGrade) return SUBJECTS;
    const slugs = listSubjectsForGrade(filterGrade);
    return SUBJECTS.filter((item) => slugs.includes(item.slug));
  }, [filterGrade]);

  const filterThemes = useMemo(
    () => listThemesFor(filterGrade || null, filterSubject || null),
    [filterGrade, filterSubject],
  );

  // Cascade filtres catalogue.
  useEffect(() => {
    if (!filterGrade) return;
    if (filterSubject && !filterSubjects.some((item) => item.slug === filterSubject)) {
      setFilterSubject("");
      setFilterThemeId("");
    }
  }, [filterGrade, filterSubject, filterSubjects]);

  useEffect(() => {
    if (!filterThemeId) return;
    if (!filterThemes.some((theme) => theme.id === filterThemeId)) {
      setFilterThemeId("");
    }
  }, [filterThemes, filterThemeId]);

  const filteredCatalog = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return catalog.filter((item) => {
      if (filterGrade && item.grade !== filterGrade) return false;
      if (filterSubject && item.subject !== filterSubject) return false;
      if (filterThemeId && item.themeId !== filterThemeId) return false;
      if (filterStatus === "published" && !item.available) return false;
      if (filterStatus === "draft" && item.available) return false;
      if (filterOfficial === "yes" && !item.official) return false;
      if (filterOfficial === "no" && item.official) return false;
      if (filterDifficulty === "none" && item.difficulty != null) return false;
      if (
        filterDifficulty &&
        filterDifficulty !== "none" &&
        item.difficulty !== filterDifficulty
      ) {
        return false;
      }
      if (!q) return true;
      const themeLabel = findThemeById(item.themeId)?.label?.toLowerCase() ?? "";
      return (
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.grade.includes(q) ||
        item.subject.includes(q) ||
        themeLabel.includes(q)
      );
    });
  }, [
    catalog,
    filter,
    filterGrade,
    filterSubject,
    filterThemeId,
    filterStatus,
    filterOfficial,
    filterDifficulty,
  ]);

  const themeCoverageRows = useMemo(() => {
    return PROGRAMME_THEMES.map((theme) => {
      const count = catalog.filter(
        (mission) =>
          mission.themeId === theme.id ||
          (theme.missionId != null && mission.id === theme.missionId),
      ).length;
      return { ...theme, count };
    });
  }, [catalog]);

  const themeCoverageByGrade = useMemo(() => {
    const grades = GRADES.map((g) => g.slug);
    return grades
      .map((g) => {
        const rows = themeCoverageRows.filter((row) => row.grade === g);
        const withMission = rows.filter((row) => row.count > 0).length;
        return { grade: g, rows, withMission, total: rows.length };
      })
      .filter((block) => block.total > 0);
  }, [themeCoverageRows]);

  function openMission(mission: MissionDef, asReadOnly: boolean) {
    const draft = missionToDrafts(mission);
    setGrade(draft.grade);
    setSubject(draft.subject);
    setThemeId(draft.themeId);
    setSlug(draft.slug);
    setMissionId(mission.id);
    setTitle(draft.title);
    setBlurb(draft.blurb);
    setAvailable(draft.available);
    setOfficial(draft.official);
    setDifficulty(draft.difficulty);
    setSteps(draft.steps.length ? draft.steps : [emptyStep(0)]);
    setSelectedStep(0);
    setEditingId(asReadOnly ? null : mission.id);
    setReadOnly(asReadOnly);
    setBuiltinOverride(mission.source !== "teacher");
    setMode("edit");
    setMessage("");
    setError("");
  }

  function startCreate() {
    const initialGrade: GradeLevel = "cm2";
    const subjects = listSubjectsForGrade(initialGrade);
    const initialSubject = subjects[0] ?? "maths";
    const themes = listThemesFor(initialGrade, initialSubject);
    const initialTheme = themes[0] ?? null;
    const initialSlug = initialTheme
      ? themeSlugFromId(initialTheme.id, initialGrade, initialSubject)
      : "nouvelle-mission";
    setEditingId(null);
    setReadOnly(false);
    setBuiltinOverride(false);
    setGrade(initialGrade);
    setSubject(initialSubject);
    setThemeId(initialTheme?.id ?? "");
    setSlug(initialSlug);
    setTitle("");
    setBlurb("");
    setAvailable(false);
    setOfficial(false);
    setDifficulty("");
    setSteps([emptyStep(0)]);
    setSelectedStep(0);
    setMode("edit");
    setMessage("");
    setError("");
    void suggestNextMissionId(initialGrade, initialSubject, initialSlug).then(setMissionId);
  }

  function duplicateBuiltin(mission: MissionDef) {
    const draft = missionToDrafts(mission);
    const copySlug = `${draft.slug}-copie`;
    setEditingId(null);
    setReadOnly(false);
    setBuiltinOverride(false);
    setGrade(draft.grade);
    setSubject(draft.subject);
    setThemeId(draft.themeId);
    setSlug(copySlug);
    setTitle(`${draft.title} (copie)`);
    setBlurb(draft.blurb);
    setAvailable(false);
    setOfficial(false);
    setDifficulty(draft.difficulty);
    setSteps(draft.steps);
    setSelectedStep(0);
    setMode("edit");
    setMessage("");
    setError("");
    void suggestNextMissionId(draft.grade, draft.subject, copySlug).then(setMissionId);
  }

  function updateStep(index: number, patch: Partial<DraftStep>) {
    setSteps((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addStep() {
    setSteps((current) => {
      const next = [...current, emptyStep(current.length)];
      setSelectedStep(next.length - 1);
      return next;
    });
  }

  function removeStep(index: number) {
    setSteps((current) => {
      if (current.length <= 1) return current;
      const next = current.filter((_, i) => i !== index).map((item, i) => ({
        ...item,
        slug: item.slug.startsWith("s") ? ordinalStepSlug(i) : item.slug,
        progress: Math.min(i + 1, 6),
      }));
      setSelectedStep(Math.min(index, next.length - 1));
      return next;
    });
  }

  async function onSave() {
    if (!teacher || readOnly) return;
    setBusy(true);
    setError("");
    setMessage("");
    const builtSteps = draftToSteps(missionId, steps);
    const result = await saveTeacherMission({
      id: missionId,
      grade,
      subject,
      title,
      blurb,
      available,
      official,
      difficulty: difficulty || null,
      themeId: themeId || null,
      steps: builtSteps,
      teacherId: teacher.id,
      version: 1,
      allowBuiltinOverride: builtinOverride || role === "admin",
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEditingId(result.mission.id);
    setBuiltinOverride(false);
    setMessage(available ? "Mission enregistrée et publiée." : "Brouillon enregistré.");
    await refreshCatalog();
  }

  async function onDelete() {
    if (!teacher || !editingId || readOnly) return;
    const ok = window.confirm(
      builtinOverride
        ? "Supprimer l’override distant de cette mission officielle ?"
        : "Supprimer cette mission ?",
    );
    if (!ok) return;
    setBusy(true);
    const result = await deleteTeacherMission(editingId, teacher.id, {
      allowBuiltinOverride: role === "admin",
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setMode("list");
    await refreshCatalog();
  }

  /** Après création inline : sélectionne immédiatement la scène `custom:id`. */
  function onIllustrationCreated(item: CustomIllustration) {
    setSceneOptions(getAllSceneOptions());
    updateStep(selectedStep, { scene: customSceneKey(item.id) });
    setIllustForm(EMPTY_ILLUSTRATION_FORM);
    setCreatingIllust(false);
    setMessage(`Illustration « ${item.label} » ajoutée et sélectionnée.`);
  }

  if (role !== "admin" || !teacher?.isAdmin) {
    return <Navigate to="/espace-admin" replace />;
  }

  if (mode === "list") {
    return (
      <Shell brand="Happy Learn" stepLabel="Missions" homeTo="/espace-admin" backTo="/espace-admin">
        <section className="mission-studio">
          <header className="mission-studio-hero">
            <div>
              <p className="pilot-eyebrow">Studio missions</p>
              <h1>Catalogue</h1>
              <p className="lead" data-listen>
                Crée, publie et affine les parcours. Les illustrations d’étapes se gèrent dans la bibliothèque.
              </p>
            </div>
            <div className="mission-studio-hero-actions">
              <Button variant="primary" type="button" onClick={startCreate}>
                Nouvelle mission
              </Button>
              <Button type="button" onClick={() => navigate("/espace-admin?tab=illustrations")}>
                Bibliothèque d’illustrations
              </Button>
            </div>
          </header>
          {syncNote ? <p className="field-help">{syncNote}</p> : null}

          <div className="mission-studio-toolbar">
            <div className="field mission-studio-search">
              <label htmlFor="mission-filter">Rechercher</label>
              <input
                id="mission-filter"
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Titre, id, thème…"
              />
            </div>
            <div className="mission-studio-toolbar-actions">
              <Button
                type="button"
                onClick={() => setShowThemeCoverage((value) => !value)}
              >
                {showThemeCoverage
                  ? "Masquer la couverture"
                  : `Couverture thèmes (${themeCoverageRows.filter((r) => r.count > 0).length}/${themeCoverageRows.length})`}
              </Button>
              <p className="mission-studio-count">
                {filteredCatalog.length} mission{filteredCatalog.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="mission-studio-filters" aria-label="Filtres catalogue">
            <div className="field">
              <label htmlFor="cat-grade">Classe</label>
              <select
                id="cat-grade"
                value={filterGrade}
                onChange={(event) => {
                  setFilterGrade(event.target.value as GradeLevel | "");
                  setFilterSubject("");
                  setFilterThemeId("");
                }}
              >
                <option value="">Toutes</option>
                {GRADES.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cat-subject">Matière</label>
              <select
                id="cat-subject"
                value={filterSubject}
                onChange={(event) => {
                  setFilterSubject(event.target.value as SubjectSlug | "");
                  setFilterThemeId("");
                }}
              >
                <option value="">Toutes</option>
                {filterSubjects.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cat-theme">Thème</label>
              <select
                id="cat-theme"
                value={filterThemeId}
                onChange={(event) => setFilterThemeId(event.target.value)}
              >
                <option value="">Tous</option>
                {filterThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cat-status">Publication</label>
              <select
                id="cat-status"
                value={filterStatus}
                onChange={(event) =>
                  setFilterStatus(event.target.value as "all" | "published" | "draft")
                }
              >
                <option value="all">Toutes</option>
                <option value="published">Publiées</option>
                <option value="draft">Brouillons</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cat-official">Officiel</label>
              <select
                id="cat-official"
                value={filterOfficial}
                onChange={(event) =>
                  setFilterOfficial(event.target.value as "all" | "yes" | "no")
                }
              >
                <option value="all">Tous</option>
                <option value="yes">Officielles</option>
                <option value="no">Non officielles</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="cat-difficulty">Difficulté</label>
              <select
                id="cat-difficulty"
                value={filterDifficulty}
                onChange={(event) =>
                  setFilterDifficulty(event.target.value as MissionDifficulty | "none" | "")
                }
              >
                <option value="">Toutes</option>
                <option value="none">Non renseignée</option>
                {MISSION_DIFFICULTIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showThemeCoverage ? (
            <section className="mission-studio-coverage" aria-label="Couverture des thèmes">
              <header className="mission-studio-coverage-head">
                <h2>Missions par thème (classe × matière)</h2>
                <p className="field-help">
                  Nombre de missions liées à chaque thème du programme.
                </p>
              </header>
              {themeCoverageByGrade.map((block) => (
                <div key={block.grade} className="mission-studio-coverage-grade">
                  <h3>
                    {gradeLabel(block.grade)}{" "}
                    <span>
                      {block.withMission}/{block.total} thèmes couverts
                    </span>
                  </h3>
                  <ul>
                    {block.rows.map((row) => (
                      <li key={row.id}>
                        <button
                          type="button"
                          className={row.count === 0 ? "is-empty" : ""}
                          onClick={() => {
                            setFilterGrade(row.grade);
                            setFilterSubject(row.subject);
                            setFilterThemeId(row.id);
                            setShowThemeCoverage(false);
                          }}
                        >
                          <span className="mission-studio-coverage-meta">
                            {subjectLabel(row.subject)}
                          </span>
                          <span className="mission-studio-coverage-label">{row.label}</span>
                          <strong>
                            {row.count} mission{row.count > 1 ? "s" : ""}
                          </strong>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ) : null}

          <ul className="mission-studio-catalog">
            {filteredCatalog.map((item) => (
              <li key={item.id}>
                <div className="mission-studio-card-body">
                  <div className="mission-studio-badges">
                    <span className={`mission-badge${item.available ? " is-live" : ""}`}>
                      {item.available ? "Publiée" : "Brouillon"}
                    </span>
                    <span className={`mission-badge${item.official ? " is-official" : ""}`}>
                      {item.official ? "Officielle" : "Non officielle"}
                    </span>
                    <span className="mission-badge">
                      {MISSION_DIFFICULTIES.find((d) => d.value === item.difficulty)?.label ??
                        "Sans difficulté"}
                    </span>
                  </div>
                  <strong>{item.title}</strong>
                  <p>
                    {gradeLabel(item.grade)} · {subjectLabel(item.subject)}
                    {item.themeId
                      ? ` · ${findThemeById(item.themeId)?.label ?? item.themeId}`
                      : ""}{" "}
                    · {item.steps.length} étape{item.steps.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="actions">
                  <Button type="button" variant="primary" onClick={() => openMission(item, false)}>
                    Ouvrir
                  </Button>
                  {item.source !== "teacher" ? (
                    <Button type="button" onClick={() => duplicateBuiltin(item)}>
                      Dupliquer
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          {filteredCatalog.length === 0 ? (
            <p className="field-help">Aucune mission ne correspond aux filtres.</p>
          ) : null}
        </section>
      </Shell>
    );
  }

  const answerNeeded = currentDraft ? needsAnswer(currentDraft.kind) : false;

  return (
    <Shell
      brand="Happy Learn"
      stepLabel={readOnly ? "Lecture seule" : "Éditeur"}
      homeTo="/espace-admin"
      onBack={() => {
        setMode("list");
        setMessage("");
        setError("");
        // Nettoyer ?new=1 / ?id= pour un catalogue propre.
        navigate("/espace-admin/missions", { replace: true });
      }}
    >
      <section className={`mission-studio is-editing${previewOpen ? " has-preview" : ""}`}>
        <header className="mission-studio-bar">
          <div className="mission-studio-bar-main">
            <Button
              type="button"
              onClick={() => {
                setMode("list");
                setMessage("");
                setError("");
                navigate("/espace-admin/missions", { replace: true });
              }}
            >
              Catalogue
            </Button>
            <div className="mission-studio-title-block">
              <input
                className="mission-studio-title-input"
                value={title}
                disabled={readOnly}
                placeholder="Titre de la mission"
                onChange={(event) => setTitle(event.target.value)}
                aria-label="Titre de la mission"
              />
              <p>
                {gradeLabel(grade)} · {subjectLabel(subject)}
                {available ? " · publiée" : " · brouillon"}
                {official ? " · officielle" : " · non officielle"}
                {difficulty
                  ? ` · ${MISSION_DIFFICULTIES.find((d) => d.value === difficulty)?.label ?? difficulty}`
                  : ""}
              </p>
            </div>
          </div>
          <div className="mission-studio-bar-actions">
            <Button
              type="button"
              className={previewOpen ? "is-active-toggle" : ""}
              aria-pressed={previewOpen}
              onClick={() => setPreviewOpen((value) => !value)}
            >
              {previewOpen ? "Masquer l’aperçu" : "Aperçu élève"}
            </Button>
            {!readOnly ? (
              <>
                <label className="mission-publish-chip">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(event) => setAvailable(event.target.checked)}
                  />
                  Publier
                </label>
                <label className="mission-publish-chip">
                  <input
                    type="checkbox"
                    checked={official}
                    onChange={(event) => setOfficial(event.target.checked)}
                  />
                  Officielle
                </label>
                <Button variant="primary" type="button" disabled={busy} onClick={() => void onSave()}>
                  Enregistrer
                </Button>
                {editingId ? (
                  <Button type="button" disabled={busy} onClick={() => void onDelete()}>
                    Supprimer
                  </Button>
                ) : null}
              </>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const source = catalog.find((item) => item.id === missionId);
                  if (source) duplicateBuiltin(source);
                }}
              >
                Dupliquer pour éditer
              </Button>
            )}
          </div>
        </header>

        {builtinOverride ? (
          <p className="field-help mission-studio-note">
            Mission du catalogue embarqué : l’enregistrement met à jour la version Supabase (même
            identifiant).
          </p>
        ) : null}
        {message ? <p className="feedback ok">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <section className="mission-studio-meta" aria-label="Identité de la mission">
          <h2 className="mission-studio-meta-title">Identité de la mission</h2>
          <div className="mission-studio-meta-grid">
            <div className="field">
              <label htmlFor="me-grade">Classe</label>
              <select
                id="me-grade"
                value={grade}
                disabled={readOnly || Boolean(editingId)}
                onChange={(event) => setGrade(event.target.value as GradeLevel)}
              >
                {GRADES.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="me-subject">Matière</label>
              <select
                id="me-subject"
                value={subject}
                disabled={readOnly || Boolean(editingId) || subjectsForGrade.length === 0}
                onChange={(event) => setSubject(event.target.value as SubjectSlug)}
              >
                {subjectsForGrade.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field mission-studio-meta-theme">
              <label htmlFor="me-theme">Thème du programme</label>
              <select
                id="me-theme"
                value={themeId}
                disabled={readOnly || Boolean(editingId) || themesForSelection.length === 0}
                onChange={(event) => {
                  const nextId = event.target.value;
                  setThemeId(nextId);
                  const theme = findThemeById(nextId);
                  if (theme && !editingId && !builtinOverride) {
                    setSlug(themeSlugFromId(theme.id, grade, subject));
                  }
                }}
              >
                {themesForSelection.length === 0 ? (
                  <option value="">Aucun thème pour cette matière</option>
                ) : (
                  themesForSelection.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="me-difficulty">Difficulté</label>
              <select
                id="me-difficulty"
                value={difficulty}
                disabled={readOnly}
                onChange={(event) =>
                  setDifficulty(event.target.value as MissionDifficulty | "")
                }
              >
                <option value="">—</option>
                {MISSION_DIFFICULTIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field mission-studio-meta-blurb">
              <label htmlFor="me-blurb">Accroche catalogue</label>
              <input
                id="me-blurb"
                value={blurb}
                disabled={readOnly}
                onChange={(event) => setBlurb(event.target.value)}
                placeholder="Une phrase pour le professeur"
              />
            </div>
            <div className="field">
              <label htmlFor="me-id">Identifiant</label>
              <input id="me-id" value={missionId} readOnly disabled />
            </div>
          </div>
          <div className="mission-studio-meta-flags">
            <label className="mission-publish-chip">
              <input
                type="checkbox"
                checked={available}
                disabled={readOnly}
                onChange={(event) => setAvailable(event.target.checked)}
              />
              Publiée
            </label>
            <label className="mission-publish-chip">
              <input
                type="checkbox"
                checked={official}
                disabled={readOnly}
                onChange={(event) => setOfficial(event.target.checked)}
              />
              Officielle
            </label>
          </div>
        </section>

        {/* Layout studio : rail étapes | workspace (onglets) | aperçu élève. */}
        <div className="mission-studio-layout">
          <aside className="mission-studio-rail" aria-label="Sommaire des étapes">
            <div className="mission-studio-rail-head">
              <h2>Sommaire</h2>
              {!readOnly ? (
                <button type="button" className="mission-studio-rail-add" onClick={addStep}>
                  +
                </button>
              ) : null}
            </div>
            <ol className="mission-studio-steps">
              {steps.map((step, index) => {
                const label = step.title.trim() || step.kicker || `Étape ${index + 1}`;
                return (
                  <li key={`${step.slug}-${index}`}>
                    <button
                      type="button"
                      className={index === selectedStep ? "is-selected" : ""}
                      onClick={() => setSelectedStep(index)}
                      title={label}
                    >
                      <span className="mission-studio-step-num">{index + 1}</span>
                      <span className="mission-studio-step-label">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          <div className="mission-studio-workspace">
            {currentDraft ? (
              <>
                <div className="mission-studio-doc-head">
                  <div>
                    <p className="mission-studio-doc-kicker">
                      Étape {selectedStep + 1} sur {steps.length}
                    </p>
                    <h2>{currentDraft.title.trim() || currentDraft.kicker || `Étape ${selectedStep + 1}`}</h2>
                  </div>
                  <div className="mission-studio-doc-nav">
                    <Button
                      type="button"
                      disabled={selectedStep <= 0}
                      onClick={() => setSelectedStep((value) => Math.max(0, value - 1))}
                    >
                      Précédente
                    </Button>
                    <Button
                      type="button"
                      disabled={selectedStep >= steps.length - 1}
                      onClick={() =>
                        setSelectedStep((value) => Math.min(steps.length - 1, value + 1))
                      }
                    >
                      Suivante
                    </Button>
                  </div>
                </div>

                {/* Onglets contenu / illustration / réponse (si le kind le nécessite). */}
                <nav className="mission-studio-panes" aria-label="Sections de l’étape">
                  {(
                    [
                      ["content", "Contenu"],
                      ["illustration", "Illustration"],
                      ...(answerNeeded ? ([["answer", "Réponse"]] as const) : []),
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={stepPane === id ? "is-selected" : ""}
                      onClick={() => setStepPane(id)}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {stepPane === "content" ? (
                  <div className="mission-studio-panel">
                    <div className="mission-studio-field-row">
                      <div className="field">
                        <label>Type d’étape</label>
                        <select
                          value={currentDraft.kind}
                          disabled={readOnly}
                          onChange={(event) => {
                            const kind = event.target.value as StepKind;
                            const patch: Partial<DraftStep> = { kind };
                            if (isQcmKind(kind) && currentDraft.distractors.length < 2) {
                              patch.distractors = [
                                ...currentDraft.distractors,
                                ...Array.from(
                                  { length: 2 - currentDraft.distractors.length },
                                  () => "",
                                ),
                              ];
                            }
                            updateStep(selectedStep, patch);
                            if (editorKindNeedsAnswer(kind)) setStepPane("answer");
                          }}
                        >
                          {EDITOR_KIND_GROUPS.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                              {group.items.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <small className="field-help">{editorKindHelp(currentDraft.kind)}</small>
                      </div>
                    </div>
                    <div className="field">
                      <label>Titre affiché à l’élève</label>
                      <input
                        value={currentDraft.title}
                        disabled={readOnly}
                        onChange={(event) => updateStep(selectedStep, { title: event.target.value })}
                      />
                    </div>
                    <div className="field-statement">
                      <RichTextEditor
                        label="Consigne / narration"
                        value={currentDraft.statement}
                        disabled={readOnly}
                        minHeight={200}
                        placeholder={
                          currentDraft.kind === "blanks"
                            ? "Ex. Le ___ court dans le jardin. (utilise ___ pour chaque trou)"
                            : currentDraft.kind === "audio"
                              ? "Texte lu à voix haute à l’élève (puis réponse si tu en définis une)."
                              : "Écris la consigne. Tu peux mettre du gras, de l’italique et de la couleur."
                        }
                        onChange={(statement) => updateStep(selectedStep, { statement })}
                      />
                    </div>
                    <div className="mission-studio-two">
                      <RichTextEditor
                        label="Note (optionnel)"
                        value={currentDraft.note}
                        disabled={readOnly}
                        minHeight={110}
                        onChange={(note) => updateStep(selectedStep, { note })}
                      />
                      <RichTextEditor
                        label="Indice (optionnel)"
                        value={currentDraft.hint}
                        disabled={readOnly}
                        minHeight={110}
                        onChange={(hint) => updateStep(selectedStep, { hint })}
                      />
                    </div>

                    <button
                      type="button"
                      className="mission-studio-advanced-toggle"
                      onClick={() => setShowAdvanced((value) => !value)}
                    >
                      {showAdvanced ? "Masquer" : "Afficher"} les réglages avancés
                    </button>
                    {showAdvanced ? (
                      <div className="mission-studio-two">
                        <div className="field">
                          <label>Libellé court</label>
                          <input
                            value={currentDraft.kicker}
                            disabled={readOnly}
                            onChange={(event) =>
                              updateStep(selectedStep, { kicker: event.target.value })
                            }
                          />
                        </div>
                        <div className="field">
                          <label>Progression (0–12)</label>
                          <input
                            type="number"
                            min={0}
                            max={12}
                            value={currentDraft.progress}
                            disabled={readOnly}
                            onChange={(event) =>
                              updateStep(selectedStep, {
                                progress: Number(event.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : null}

                    {!readOnly && steps.length > 1 ? (
                      <div className="mission-studio-danger">
                        <Button type="button" onClick={() => removeStep(selectedStep)}>
                          Supprimer cette étape
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Scène d’étape : picker + création inline (custom:). */}
                {stepPane === "illustration" ? (
                  <div className="mission-studio-panel">
                    <div className="mission-studio-illust-head">
                      <div>
                        <h3>Illustration de l’étape</h3>
                        <p className="field-help">
                          Sélection : <strong>{selectedSceneOption?.label}</strong>
                        </p>
                      </div>
                      <div className="field mission-studio-caption-field">
                        <label>Légende (optionnel)</label>
                        <input
                          value={currentDraft.caption}
                          disabled={readOnly}
                          onChange={(event) =>
                            updateStep(selectedStep, { caption: event.target.value })
                          }
                        />
                      </div>
                    </div>

                    {creatingIllust && !readOnly ? (
                      <div className="mission-studio-inline-create">
                        <h4>Nouvelle illustration</h4>
                        <IllustrationCreatePanel
                          form={illustForm}
                          onChange={setIllustForm}
                          compact
                          onCancel={() => {
                            setCreatingIllust(false);
                            setIllustForm(EMPTY_ILLUSTRATION_FORM);
                          }}
                          onSaved={onIllustrationCreated}
                          submitLabel="Créer et sélectionner"
                        />
                      </div>
                    ) : (
                      <ScenePicker
                        options={sceneOptions}
                        value={currentDraft.scene || ""}
                        disabled={readOnly}
                        onChange={(scene) => updateStep(selectedStep, { scene })}
                        onCreateRequest={() => {
                          setCreatingIllust(true);
                          setIllustForm(EMPTY_ILLUSTRATION_FORM);
                        }}
                      />
                    )}
                  </div>
                ) : null}

                {stepPane === "answer" && answerNeeded ? (
                  <div className="mission-studio-panel">
                    {currentDraft.kind === "blanks" ? (
                      <div className="field">
                        <label>Réponses des trous</label>
                        <input
                          value={currentDraft.expected}
                          disabled={readOnly}
                          onChange={(event) =>
                            updateStep(selectedStep, { expected: event.target.value })
                          }
                          placeholder="Ex. chat | chien"
                        />
                        <small className="field-help">
                          Une réponse par trou, séparées par |. Dans la consigne, utilise ___ pour
                          chaque trou.
                        </small>
                      </div>
                    ) : (
                      <div className="mission-studio-qcm">
                        <p className="mission-studio-qcm-lead">
                          Remplis la bonne réponse, puis les mauvaises. Les propositions seront
                          mélangées pour l’élève.
                        </p>
                        <div className="field mission-studio-qcm-correct">
                          <label htmlFor={`qcm-ok-${selectedStep}`}>Bonne réponse</label>
                          <input
                            id={`qcm-ok-${selectedStep}`}
                            value={currentDraft.expected}
                            disabled={readOnly}
                            onChange={(event) =>
                              updateStep(selectedStep, { expected: event.target.value })
                            }
                            placeholder={
                              currentDraft.kind === "fraction-choice" ||
                              currentDraft.kind === "simplify" ||
                              currentDraft.kind === "tutorial"
                                ? "Ex. 3/4"
                                : currentDraft.kind === "direction"
                                  ? "Ex. axe"
                                  : currentDraft.kind === "number"
                                    ? "Ex. 12"
                                    : "Ex. Paris"
                            }
                          />
                        </div>
                        <div className="mission-studio-qcm-wrongs">
                          <p className="mission-studio-qcm-wrongs-label">Mauvaises réponses</p>
                          {currentDraft.distractors.map((value, wrongIndex) => (
                            <div
                              key={`wrong-${selectedStep}-${wrongIndex}`}
                              className="mission-studio-qcm-wrong-row"
                            >
                              <label
                                className="visually-hidden"
                                htmlFor={`qcm-wrong-${selectedStep}-${wrongIndex}`}
                              >
                                Mauvaise réponse {wrongIndex + 1}
                              </label>
                              <input
                                id={`qcm-wrong-${selectedStep}-${wrongIndex}`}
                                value={value}
                                disabled={readOnly}
                                onChange={(event) => {
                                  const next = [...currentDraft.distractors];
                                  next[wrongIndex] = event.target.value;
                                  updateStep(selectedStep, { distractors: next });
                                }}
                                placeholder={`Proposition ${wrongIndex + 1}`}
                              />
                              {!readOnly && currentDraft.distractors.length > 1 ? (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const next = currentDraft.distractors.filter(
                                      (_, i) => i !== wrongIndex,
                                    );
                                    updateStep(selectedStep, {
                                      distractors: next.length ? next : [""],
                                    });
                                  }}
                                >
                                  Retirer
                                </Button>
                              ) : null}
                            </div>
                          ))}
                          {!readOnly ? (
                            <Button
                              type="button"
                              onClick={() =>
                                updateStep(selectedStep, {
                                  distractors: [...currentDraft.distractors, ""],
                                })
                              }
                            >
                              + Ajouter une proposition
                            </Button>
                          ) : null}
                        </div>
                        {currentDraft.kind === "audio" ? (
                          <small className="field-help">
                            Sans bonne réponse : écoute seule puis Continuer. Avec bonne réponse
                            seulement : saisie texte. Avec mauvaises réponses : QCM après écoute.
                          </small>
                        ) : null}
                        {currentDraft.kind === "direction" ? (
                          <small className="field-help">
                            Valeurs habituelles : gauche, axe, droite.
                          </small>
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="field-help">Ajoute une étape pour commencer.</p>
            )}
          </div>

          {/* Aperçu live via UniverseScene (y compris scènes custom:). */}
          {previewOpen ? (
            <aside className="mission-preview mission-studio-preview" aria-label="Aperçu élève">
              <div className="mission-preview-head">
                <div>
                  <h2>Aperçu</h2>
                  <p className="field-help">
                    Étape {selectedStep + 1}/{Math.max(steps.length, 1)}
                  </p>
                </div>
                <button
                  type="button"
                  className="mission-preview-close"
                  onClick={() => setPreviewOpen(false)}
                  aria-label="Fermer l’aperçu"
                >
                  ×
                </button>
              </div>

              <div className="mission-preview-universes" role="group" aria-label="Univers d’aperçu">
                {UNIVERSE_ORDER.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={previewUniverse === item ? "is-selected" : ""}
                    onClick={() => setPreviewUniverse(item)}
                  >
                    {UNIVERSES[item].label}
                  </button>
                ))}
              </div>

              <label className="mission-preview-success">
                <input
                  type="checkbox"
                  checked={previewSuccess}
                  onChange={(event) => setPreviewSuccess(event.target.checked)}
                />
                État réussi
              </label>

              {previewStep ? (
                <div className="mission-preview-stage">
                  <UniverseScene
                    universe={previewUniverse}
                    stepId={previewSceneKey}
                    progress={previewStep.progress}
                    success={previewSuccess}
                    selected={previewSuccess ? previewStep.expected : undefined}
                    expected={previewStep.expected}
                    caption={
                      previewStep.copy[previewUniverse]?.caption ?? previewStep.copy.football.caption
                    }
                    kind={previewStep.kind}
                    subject={subject}
                    statement={
                      previewStep.copy[previewUniverse]?.statement ??
                      previewStep.copy.football.statement
                    }
                    title={
                      previewStep.copy[previewUniverse]?.title ?? previewStep.copy.football.title
                    }
                  />
                </div>
              ) : (
                <p className="field-help">Aperçu indisponible.</p>
              )}
            </aside>
          ) : null}
        </div>
      </section>
    </Shell>
  );
}
