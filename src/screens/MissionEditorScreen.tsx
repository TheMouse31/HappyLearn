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
  EDITOR_KINDS,
  allUniverses,
  defineSteps,
  deleteTeacherMission,
  listAdminCatalog,
  ordinalStepSlug,
  parseMissionId,
  resolveMission,
  saveTeacherMission,
  suggestNextMissionId,
} from "../data/missions/index";
import type {
  GradeLevel,
  MissionDef,
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

type DraftStep = {
  slug: string;
  kind: StepKind;
  kicker: string;
  progress: number;
  expected: string;
  distractors: string;
  title: string;
  statement: string;
  note: string;
  hint: string;
  caption: string;
  scene: string;
};

type StepPane = "content" | "illustration" | "answer";

function emptyStep(index: number): DraftStep {
  return {
    slug: ordinalStepSlug(index),
    kind: "continue",
    kicker: `Étape ${index + 1}`,
    progress: Math.min(index + 1, 6),
    expected: "",
    distractors: "",
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
  return {
    slug: step.slug,
    kind: step.kind,
    kicker: step.kicker,
    progress: step.progress,
    expected: step.expected ?? "",
    distractors: (step.distractors ?? []).join(" | "),
    title: copy?.title ?? "",
    statement: copy?.statement ?? "",
    note: copy?.note ?? "",
    hint: copy?.hint ?? "",
    caption: copy?.caption ?? "",
    scene: step.scene ?? "",
  };
}

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
      const distractors = draft.distractors
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);
      return {
        slug: draft.slug.trim() || undefined,
        kind: draft.kind,
        kicker: draft.kicker.trim() || "Étape",
        progress: Number(draft.progress) || 0,
        ...(draft.expected.trim() ? { expected: draft.expected.trim() } : {}),
        ...(distractors.length ? { distractors } : {}),
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
  steps: DraftStep[];
} {
  const parsed = parseMissionId(mission.id);
  return {
    grade: mission.grade,
    subject: mission.subject,
    slug: parsed?.slug ?? "mission",
    title: mission.title,
    blurb: mission.blurb,
    available: mission.available,
    steps: mission.steps.map(stepToDraft),
  };
}

function needsAnswer(kind: StepKind): boolean {
  return (
    kind === "number" ||
    kind === "text" ||
    kind === "choice" ||
    kind === "direction" ||
    kind === "fraction-choice" ||
    kind === "simplify" ||
    kind === "tutorial"
  );
}

export function MissionEditorScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { role, teacher } = useSession();

  const [catalog, setCatalog] = useState<MissionDef[]>([]);
  const [filter, setFilter] = useState("");
  const [mode, setMode] = useState<"list" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [builtinOverride, setBuiltinOverride] = useState(false);

  const [grade, setGrade] = useState<GradeLevel>("cm2");
  const [subject, setSubject] = useState<SubjectSlug>("maths");
  const [slug, setSlug] = useState("nouvelle-mission");
  const [missionId, setMissionId] = useState("");
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [available, setAvailable] = useState(false);
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

  async function refreshCatalog() {
    const rows = await listAdminCatalog();
    setCatalog(rows);
  }

  useEffect(() => {
    void refreshCatalog();
  }, [teacher?.id]);

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

  const filteredCatalog = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.grade.includes(q) ||
        item.subject.includes(q),
    );
  }, [catalog, filter]);

  function openMission(mission: MissionDef, asReadOnly: boolean) {
    const draft = missionToDrafts(mission);
    setGrade(draft.grade);
    setSubject(draft.subject);
    setSlug(draft.slug);
    setMissionId(mission.id);
    setTitle(draft.title);
    setBlurb(draft.blurb);
    setAvailable(draft.available);
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
    setEditingId(null);
    setReadOnly(false);
    setBuiltinOverride(false);
    setGrade("cm2");
    setSubject("maths");
    setSlug("nouvelle-mission");
    setTitle("");
    setBlurb("");
    setAvailable(false);
    setSteps([emptyStep(0)]);
    setSelectedStep(0);
    setMode("edit");
    setMessage("");
    setError("");
    void suggestNextMissionId("cm2", "maths", "nouvelle-mission").then(setMissionId);
  }

  function duplicateBuiltin(mission: MissionDef) {
    const draft = missionToDrafts(mission);
    setEditingId(null);
    setReadOnly(false);
    setBuiltinOverride(false);
    setGrade(draft.grade);
    setSubject(draft.subject);
    setSlug(`${draft.slug}-copie`);
    setTitle(`${draft.title} (copie)`);
    setBlurb(draft.blurb);
    setAvailable(false);
    setSteps(draft.steps);
    setSelectedStep(0);
    setMode("edit");
    setMessage("");
    setError("");
    void suggestNextMissionId(draft.grade, draft.subject, `${draft.slug}-copie`).then(setMissionId);
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

          <div className="mission-studio-toolbar">
            <div className="field mission-studio-search">
              <label htmlFor="mission-filter">Rechercher</label>
              <input
                id="mission-filter"
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Titre, niveau, matière…"
              />
            </div>
            <p className="mission-studio-count">
              {filteredCatalog.length} mission{filteredCatalog.length > 1 ? "s" : ""}
            </p>
          </div>

          <ul className="mission-studio-catalog">
            {filteredCatalog.map((item) => (
              <li key={item.id}>
                <div className="mission-studio-card-body">
                  <div className="mission-studio-badges">
                    <span className={`mission-badge${item.available ? " is-live" : ""}`}>
                      {item.available ? "Publiée" : "Brouillon"}
                    </span>
                    <span className="mission-badge">
                      {item.source === "teacher" ? "Créée" : "Officielle"}
                    </span>
                  </div>
                  <strong>{item.title}</strong>
                  <p>
                    {gradeLabel(item.grade)} · {subjectLabel(item.subject)} · {item.steps.length}{" "}
                    étape{item.steps.length > 1 ? "s" : ""}
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
      backTo="/espace-admin/missions"
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
            Mission officielle : l’enregistrement crée une version adaptée (même identifiant).
          </p>
        ) : null}
        {message ? <p className="feedback ok">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <details className="mission-studio-meta">
          <summary>Identité de la mission</summary>
          <div className="mission-studio-meta-grid">
            <div className="field">
              <label htmlFor="me-grade">Niveau</label>
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
                disabled={readOnly || Boolean(editingId)}
                onChange={(event) => setSubject(event.target.value as SubjectSlug)}
              >
                {SUBJECTS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="me-slug">Thème (slug)</label>
              <input
                id="me-slug"
                value={slug}
                disabled={readOnly || Boolean(editingId)}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="me-blurb">Accroche catalogue</label>
              <input
                id="me-blurb"
                value={blurb}
                disabled={readOnly}
                onChange={(event) => setBlurb(event.target.value)}
                placeholder="Une phrase pour le professeur"
              />
            </div>
          </div>
        </details>

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
                          onChange={(event) =>
                            updateStep(selectedStep, { kind: event.target.value as StepKind })
                          }
                        >
                          {EDITOR_KINDS.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
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
                        placeholder="Écris la consigne. Tu peux mettre du gras, de l’italique et de la couleur."
                        onChange={(statement) => updateStep(selectedStep, { statement })}
                      />
                    </div>
                    <div className="mission-studio-two">
                      <RichTextEditor
                        label="Note (optionnel)"
                        value={currentDraft.note}
                        disabled={readOnly}
                        minHeight={88}
                        onChange={(note) => updateStep(selectedStep, { note })}
                      />
                      <RichTextEditor
                        label="Indice (optionnel)"
                        value={currentDraft.hint}
                        disabled={readOnly}
                        minHeight={88}
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
                    <div className="field">
                      <label>Réponse attendue</label>
                      <input
                        value={currentDraft.expected}
                        disabled={readOnly}
                        onChange={(event) =>
                          updateStep(selectedStep, { expected: event.target.value })
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Distracteurs</label>
                      <input
                        value={currentDraft.distractors}
                        disabled={readOnly}
                        onChange={(event) =>
                          updateStep(selectedStep, { distractors: event.target.value })
                        }
                        placeholder="Sépare les distracteurs par |"
                      />
                      <small className="field-help">Exemple : 1/2 | 2/3 | 3/4</small>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="field-help">Ajoute une étape pour commencer.</p>
            )}
          </div>

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
