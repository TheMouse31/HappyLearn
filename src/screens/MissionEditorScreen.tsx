import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
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
import { CUSTOM_ILLUSTRATIONS_EVENT } from "../lib/customIllustrations";
import { getAllSceneOptions } from "../lib/illustrations";
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
        statement: draft.statement.trim() || "…",
        ...(draft.note.trim() ? { note: draft.note.trim() } : {}),
        ...(draft.hint.trim() ? { hint: draft.hint.trim() } : {}),
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
  const customCount = sceneOptions.filter((item) => item.value.startsWith("custom:")).length;

  useEffect(() => {
    setPreviewSuccess(false);
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

  if (role !== "admin" || !teacher?.isAdmin) {
    return <Navigate to="/espace-admin" replace />;
  }

  if (mode === "list") {
    return (
      <Shell
        brand="Happy Learn"
        stepLabel="Missions"
        homeTo="/espace-admin"
        backTo="/espace-admin"
      >
        <section className="mission-editor">
          <span className="kicker">Administration</span>
          <h1>Catalogue des missions</h1>
          <p className="lead" data-listen>
            Toutes les missions (officielles et créées). Modifie-les, duplique-les ou crée-en de nouvelles.
          </p>
          <div className="actions">
            <Button variant="primary" type="button" onClick={startCreate}>
              Créer une mission
            </Button>
            <Button type="button" onClick={() => navigate("/espace-admin?tab=illustrations")}>
              Illustrations animées
            </Button>
          </div>
          <div className="field" style={{ marginTop: "1rem", maxWidth: "28rem" }}>
            <label htmlFor="mission-filter">Rechercher</label>
            <input
              id="mission-filter"
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Titre, id, niveau, matière…"
            />
          </div>
          <h2>Missions ({filteredCatalog.length})</h2>
          <ul className="mission-editor-list">
            {filteredCatalog.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.id} · {gradeLabel(item.grade)} · {subjectLabel(item.subject)} ·{" "}
                    {item.available ? "publiée" : "brouillon"}
                    {item.source === "teacher" ? " · créée" : " · officielle"}
                  </small>
                </div>
                <div className="actions">
                  <Button type="button" onClick={() => openMission(item, false)}>
                    Modifier
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

  return (
    <Shell
      brand="Happy Learn"
      stepLabel={readOnly ? "Mission (lecture seule)" : "Éditeur"}
      homeTo="/espace-admin"
      backTo="/espace-admin/missions"
    >
      <section className="mission-editor">
        <div className="actions">
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
          {!readOnly ? (
            <>
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
        {builtinOverride ? (
          <p className="field-help">
            Mission officielle : l’enregistrement crée un override distant (même id).
          </p>
        ) : null}
        {message ? <p className="feedback ok">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}

        <div className="mission-editor-grid">
          <div className="mission-editor-main">
            <h1>{readOnly ? title || missionId : "Éditer la mission"}</h1>
            <div className="stats-filters">
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
                <label htmlFor="me-slug">Slug thématique</label>
                <input
                  id="me-slug"
                  value={slug}
                  disabled={readOnly || Boolean(editingId)}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="me-id">Identifiant (immuable une fois publié)</label>
              <input id="me-id" value={missionId} readOnly />
              <p className="field-help">Format : niveau-matière-slug-nn — ex. cm2-maths-fractions-01</p>
            </div>
            <div className="field">
              <label htmlFor="me-title">Titre</label>
              <input
                id="me-title"
                value={title}
                disabled={readOnly}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="me-blurb">Accroche</label>
              <input
                id="me-blurb"
                value={blurb}
                disabled={readOnly}
                onChange={(event) => setBlurb(event.target.value)}
              />
            </div>
            <label className="mission-publish">
              <input
                type="checkbox"
                checked={available}
                disabled={readOnly}
                onChange={(event) => setAvailable(event.target.checked)}
              />
              Publier (visible dans le pilotage de session)
            </label>

            <h2>Étapes</h2>
            <div className="mission-step-tabs">
              {steps.map((step, index) => (
                <button
                  key={`${step.slug}-${index}`}
                  type="button"
                  className={index === selectedStep ? "is-selected" : ""}
                  onClick={() => setSelectedStep(index)}
                >
                  {step.slug || `s${index + 1}`}
                </button>
              ))}
              {!readOnly ? (
                <Button type="button" onClick={addStep}>
                  + Étape
                </Button>
              ) : null}
            </div>

            {currentDraft ? (
              <div className="mission-step-editor">
                <div className="stats-filters">
                  <div className="field">
                    <label>Slug local</label>
                    <input
                      value={currentDraft.slug}
                      disabled={readOnly}
                      onChange={(event) => updateStep(selectedStep, { slug: event.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Type</label>
                    <select
                      value={currentDraft.kind}
                      disabled={readOnly}
                      onChange={(event) => updateStep(selectedStep, { kind: event.target.value as StepKind })}
                    >
                      {EDITOR_KINDS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label>Progression</label>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={currentDraft.progress}
                      disabled={readOnly}
                      onChange={(event) =>
                        updateStep(selectedStep, { progress: Number(event.target.value) || 0 })
                      }
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Kicker</label>
                  <input
                    value={currentDraft.kicker}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { kicker: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Titre (appliqué aux 4 univers)</label>
                  <input
                    value={currentDraft.title}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { title: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Consigne / narration</label>
                  <textarea
                    rows={3}
                    value={currentDraft.statement}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { statement: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Note (optionnel)</label>
                  <input
                    value={currentDraft.note}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { note: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Indice (optionnel)</label>
                  <input
                    value={currentDraft.hint}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { hint: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Légende scène (optionnel)</label>
                  <input
                    value={currentDraft.caption}
                    disabled={readOnly}
                    onChange={(event) => updateStep(selectedStep, { caption: event.target.value })}
                  />
                </div>

                <div className="mission-illust-block">
                  <div className="mission-illust-head">
                    <h3>Illustration de l’étape</h3>
                    <p className="field-help">
                      Choisis une scène animée intégrée
                      {customCount > 0
                        ? ` ou une de tes ${customCount} illustration${customCount > 1 ? "s" : ""} personnalisée${customCount > 1 ? "s" : ""}`
                        : ""}
                      . Aperçu à droite (univers + réussite).
                    </p>
                  </div>
                  <div className="mission-scene-grid" role="listbox" aria-label="Illustrations disponibles">
                    {sceneOptions.map((option) => {
                      const selected = (currentDraft.scene || "") === option.value;
                      const isCustom = option.value.startsWith("custom:");
                      return (
                        <button
                          key={option.value || "auto"}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={`mission-scene-card${selected ? " is-selected" : ""}${isCustom ? " is-custom" : ""}`}
                          disabled={readOnly}
                          onClick={() => updateStep(selectedStep, { scene: option.value })}
                        >
                          <strong>{option.label}</strong>
                          <span>{option.blurb}</span>
                          {option.value ? (
                            <small>{isCustom ? "perso" : option.value}</small>
                          ) : (
                            <small>auto</small>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mission-scene-current">
                    Sélection : <strong>{selectedSceneOption?.label}</strong>
                    {previewSceneKey ? (
                      <>
                        {" "}
                        · clé jouée : <code>{previewSceneKey}</code>
                      </>
                    ) : null}
                  </p>
                </div>

                {currentDraft.kind === "number" ||
                currentDraft.kind === "text" ||
                currentDraft.kind === "choice" ||
                currentDraft.kind === "direction" ||
                currentDraft.kind === "fraction-choice" ||
                currentDraft.kind === "simplify" ||
                currentDraft.kind === "tutorial" ? (
                  <>
                    <div className="field">
                      <label>Réponse attendue</label>
                      <input
                        value={currentDraft.expected}
                        disabled={readOnly}
                        onChange={(event) => updateStep(selectedStep, { expected: event.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>Distracteurs (séparés par |)</label>
                      <input
                        value={currentDraft.distractors}
                        disabled={readOnly}
                        onChange={(event) => updateStep(selectedStep, { distractors: event.target.value })}
                      />
                    </div>
                  </>
                ) : null}
                {!readOnly && steps.length > 1 ? (
                  <Button type="button" onClick={() => removeStep(selectedStep)}>
                    Supprimer cette étape
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          <aside className="mission-preview" aria-label="Aperçu illustration">
            <div className="mission-preview-head">
              <h2>Aperçu illustration</h2>
              <p className="field-help">
                Étape {selectedStep + 1}/{Math.max(steps.length, 1)}
                {previewStep ? ` · ${previewStep.kind}` : ""}
              </p>
            </div>

            <div className="mission-preview-universes" role="group" aria-label="Univers d’aperçu">
              {UNIVERSE_ORDER.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  className={previewUniverse === slug ? "is-selected" : ""}
                  onClick={() => setPreviewUniverse(slug)}
                >
                  {UNIVERSES[slug].label}
                </button>
              ))}
            </div>

            <label className="mission-preview-success">
              <input
                type="checkbox"
                checked={previewSuccess}
                onChange={(event) => setPreviewSuccess(event.target.checked)}
              />
              Montrer l’état réussi (animation)
            </label>

            {previewStep ? (
              <>
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
                <span className="kicker">{previewStep.kicker}</span>
                <h3>{previewStep.copy[previewUniverse]?.title ?? previewStep.copy.football.title}</h3>
                <p>
                  {previewStep.copy[previewUniverse]?.statement ?? previewStep.copy.football.statement}
                </p>
                {previewStep.expected ? (
                  <p className="field-help">
                    Attendu : {previewStep.expected}
                    {previewStep.distractors?.length
                      ? ` · distracteurs : ${previewStep.distractors.join(", ")}`
                      : ""}
                  </p>
                ) : null}
                <p className="field-help">
                  Scène : <code>{previewSceneKey || "—"}</code>
                  {currentDraft?.scene ? "" : " (automatique)"}
                </p>
                <div className="actions">
                  <Button
                    type="button"
                    disabled={selectedStep <= 0}
                    onClick={() => setSelectedStep((value) => Math.max(0, value - 1))}
                  >
                    Étape précédente
                  </Button>
                  <Button
                    type="button"
                    disabled={selectedStep >= steps.length - 1}
                    onClick={() =>
                      setSelectedStep((value) => Math.min(steps.length - 1, value + 1))
                    }
                  >
                    Étape suivante
                  </Button>
                </div>
              </>
            ) : (
              <p className="field-help">Ajoute une étape pour voir l’illustration.</p>
            )}
          </aside>
        </div>
      </section>
    </Shell>
  );
}
