import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FractionViz } from "../components/FractionViz";
import { HintOverlay } from "../components/HintOverlay";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { UniverseScene } from "../components/UniverseScene";
import { BILAN_CHOICES, STEPS } from "../data/steps";
import type { Step } from "../data/types";
import {
  advanceDelay,
  needsAnswer,
  optionLabel,
  qcmOptions,
  usesQcm,
  validateAnswer,
} from "../engine/missionEngine";
import { useSession } from "../lib/session";
import { isCoursePlayable } from "../data/catalog";

function FractionFields({
  top,
  bottom,
  onTop,
  onBottom,
}: {
  top: string;
  bottom: string;
  onTop: (value: string) => void;
  onBottom: (value: string) => void;
}) {
  return (
    <div className="fraction-entry">
      <input
        type="number"
        inputMode="numeric"
        aria-label="Nombre du haut"
        value={top}
        onChange={(event) => onTop(event.target.value)}
      />
      <i />
      <input
        type="number"
        inputMode="numeric"
        aria-label="Nombre du bas"
        value={bottom}
        onChange={(event) => onBottom(event.target.value)}
      />
    </div>
  );
}

export function MissionScreen() {
  const navigate = useNavigate();
  const { prenom, universe, mode, sessionId, recordAnswer, completeMission, quitMission, grade, subject } =
    useSession();
  const [index, setIndex] = useState(0);
  const [raw, setRaw] = useState("");
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [kind, setKind] = useState<"ok" | "retry" | "hint" | "info">("info");
  const [hint, setHint] = useState("");
  const [showPouce, setShowPouce] = useState(false);
  const step = STEPS[index];

  const options = useMemo(() => (step ? qcmOptions(step) : []), [step?.id]);

  useEffect(() => {
    setRaw("");
    setTop("");
    setBottom("");
    setAttempts(0);
    setFeedback("");
    setKind("info");
    setHint("");
    setShowPouce(false);
  }, [index]);

  if (!prenom) return <Navigate to="/" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (!universe || !mode) return <Navigate to="/pret" replace />;
  if (!sessionId) return <Navigate to="/pret" replace />;
  if (!step) return <Navigate to="/recompense" replace />;

  const copy = step.copy[universe];
  const qcm = usesQcm(step, mode);
  const currentValue =
    step.kind === "tutorial" || step.kind === "fraction-choice" || step.kind === "simplify"
      ? `${top}/${bottom}`
      : raw;

  function goNext() {
    if (index >= STEPS.length - 1) {
      void completeMission().then(() => navigate("/recompense"));
      return;
    }
    setIndex((value) => value + 1);
  }

  function succeed(message: string) {
    setKind("ok");
    setFeedback(message);
    setShowPouce(true);
    setHint("");
    const delay = advanceDelay();
    if (delay === 0) return;
    window.setTimeout(goNext, delay);
  }

  async function onValidate() {
    if (!step || !needsAnswer(step)) return;
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    const result = validateAnswer(step, currentValue);
    await recordAnswer(step.id, currentValue, result.ok, nextAttempts);
    if (result.ok) succeed(result.message);
    else {
      setKind("retry");
      setFeedback(result.message);
      setShowPouce(false);
    }
  }

  function renderAnswer(current: Step) {
    if (current.kind === "tutorial") {
      return (
        <div className="free-row">
          <div className="method-box" aria-hidden="true">
            <FractionViz top={3} bottom={4} label="trois quarts" />
          </div>
          <FractionFields top={top} bottom={bottom} onTop={setTop} onBottom={setBottom} />
        </div>
      );
    }
    if (qcm && (current.kind === "fraction-choice" || current.kind === "simplify" || current.kind === "number" || current.kind === "direction")) {
      return (
        <div className="qcm" role="group" aria-label="Propositions">
          {options.map((value) => (
            <button
              key={value}
              type="button"
              className={raw === value ? "is-selected" : ""}
              aria-pressed={raw === value}
              onClick={() => {
                setRaw(value);
                if (value.includes("/")) {
                  const [a, b] = value.split("/");
                  setTop(a ?? "");
                  setBottom(b ?? "");
                }
              }}
            >
              {value.includes("/") ? (
                <FractionViz top={value.split("/")[0] ?? ""} bottom={value.split("/")[1] ?? ""} />
              ) : (
                optionLabel(current, value)
              )}
            </button>
          ))}
        </div>
      );
    }
    if (current.kind === "fraction-choice" || current.kind === "simplify") {
      return <FractionFields top={top} bottom={bottom} onTop={setTop} onBottom={setBottom} />;
    }
    if (current.kind === "number") {
      return (
        <div className="free-row">
          <input
            type="number"
            inputMode="numeric"
            aria-label="Ta réponse"
            value={raw}
            onChange={(event) => setRaw(event.target.value)}
          />
        </div>
      );
    }
    return null;
  }

  return (
    <Shell
      stepLabel={`Mission ${copy.title}`}
      extra={
        <Button
          onClick={() => {
            void quitMission().then(() => navigate("/pret"));
          }}
        >
          Quitter la mission
        </Button>
      }
    >
      <div className="mission-layout">
        <UniverseScene
          universe={universe}
          stepId={step.id}
          progress={step.progress}
          success={kind === "ok" || step.kind === "teaser" || step.id === "N04"}
          selected={currentValue === "/" ? raw : currentValue}
          expected={step.expected}
          caption={copy.caption}
        />
        <section>
          <div className="progress" aria-label="Progression">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className={i < step.progress ? "on" : ""} />
            ))}
          </div>
          <span className="kicker">{step.kicker}</span>
          <h1>{copy.title}</h1>
          <p className="lead" data-listen>{copy.statement}</p>
          {copy.note ? <p>{copy.note}</p> : null}
          {step.twoStep ? (
            <div className="two-steps">
              <div className={`step-card ${step.twoStep === 1 ? "active" : ""}`}>
                <strong>1. Premier calcul</strong>
                <div>{step.twoStep === 2 ? "18 conservé" : "À calculer maintenant"}</div>
              </div>
              <div className={`step-card ${step.twoStep === 2 ? "active" : ""}`}>
                <strong>2. Deuxième calcul</strong>
                <div>{step.twoStep === 2 ? "À calculer maintenant" : "Juste après"}</div>
              </div>
            </div>
          ) : null}
          {step.kind === "method" ? <div className="method-box">{copy.note}</div> : null}
          {step.kind === "bilan" ? (
            <div className="choice-grid">
              {BILAN_CHOICES[universe].map((choice) => (
                <Button
                  key={choice.value}
                  onClick={() => {
                    setFeedback("Ton choix est enregistré.");
                    setKind("ok");
                    window.setTimeout(goNext, advanceDelay() || 400);
                  }}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          ) : null}
          {renderAnswer(step)}
          {hint ? <HintOverlay text={hint} universe={universe} /> : null}
          {showPouce ? (
            <Neo pose={step.id === "N04" ? "applaudit" : "pouce"} universe={universe} className="neo-small" />
          ) : null}
          <p className={`feedback ${kind}`} aria-live="polite">
            {feedback}
          </p>
          <div className="actions">
            {needsAnswer(step) ? (
              <>
                <Button
                  onClick={() => {
                    setHint(copy.hint ?? "Commence par trouver la valeur d’une seule part.");
                    setKind("hint");
                  }}
                >
                  Un indice
                </Button>
                <Button variant="primary" onClick={() => void onValidate()} disabled={kind === "ok" || !currentValue || currentValue === "/"}>
                  Valider
                </Button>
              </>
            ) : step.kind === "teaser" ? (
              <Button variant="primary" onClick={goNext}>
                Voir ma récompense
              </Button>
            ) : step.kind === "bilan" ? null : (
              <Button variant="primary" onClick={goNext}>
                Continuer
              </Button>
            )}
            {kind === "ok" && needsAnswer(step) && advanceDelay() === 0 ? (
              <Button variant="primary" onClick={goNext}>
                Continuer
              </Button>
            ) : null}
          </div>
        </section>
      </div>
    </Shell>
  );
}
