import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { FractionViz } from "../components/FractionViz";
import { HintOverlay } from "../components/HintOverlay";
import { Neo } from "../components/Neo";
import { RichText } from "../components/RichText";
import { Shell } from "../components/Shell";
import { UniverseScene } from "../components/UniverseScene";
import { BILAN_CHOICES } from "../data/missions/labels";
import { defaultMissionFor, findMission, resolveMission } from "../data/missions";
import type { MissionDef, Step } from "../data/types";
import {
  advanceDelay,
  countBlanks,
  needsAnswer,
  optionLabel,
  qcmOptions,
  sceneKeyOf,
  splitBlankSegments,
  usesQcm,
  validateAnswer,
} from "../engine/missionEngine";
import { useSession } from "../lib/session";
import { canSpeak, speakText, stopSpeech, subscribeSpeech } from "../lib/speech";
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
  const {
    prenom,
    universe,
    mode,
    sessionId,
    recordAnswer,
    completeMission,
    quitMission,
    grade,
    subject,
    missionId,
    lockedSession,
    liveSession,
    liveParticipant,
    raiseHand,
  } = useSession();
  const [index, setIndex] = useState(0);
  const [raw, setRaw] = useState("");
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [kind, setKind] = useState<"ok" | "retry" | "hint" | "info">("info");
  const [hint, setHint] = useState("");
  const [showPouce, setShowPouce] = useState(false);
  const [blankValues, setBlankValues] = useState<string[]>([]);
  const [audioHeard, setAudioHeard] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mission, setMission] = useState<MissionDef | null>(
    () => findMission(missionId) ?? defaultMissionFor(grade, subject) ?? findMission("cm2-maths-fractions-01"),
  );

  useEffect(() => {
    let cancelled = false;
    void resolveMission(missionId).then((resolved) => {
      if (cancelled) return;
      setMission(
        resolved ?? defaultMissionFor(grade, subject) ?? findMission("cm2-maths-fractions-01"),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [missionId, grade, subject]);

  const steps = mission?.steps ?? [];
  const step = steps[index];

  const options = useMemo(() => (step ? qcmOptions(step) : []), [step?.id]);

  useEffect(() => {
    setIndex(0);
  }, [mission?.id, sessionId]);

  // Si le prof arrête l'activité, ramener l'élève en salle d'attente.
  useEffect(() => {
    if (!lockedSession) return;
    if (liveSession?.missionId) return;
    if (!sessionId && !universe) {
      navigate("/salle-attente", { replace: true });
      return;
    }
    let cancelled = false;
    void quitMission().then(() => {
      if (!cancelled) navigate("/salle-attente", { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [lockedSession, liveSession?.missionId, sessionId, universe, quitMission, navigate]);

  useEffect(() => {
    setRaw("");
    setTop("");
    setBottom("");
    setAttempts(0);
    setFeedback("");
    setKind("info");
    setHint("");
    setShowPouce(false);
    setAudioHeard(false);
    stopSpeech();
    const blankCount = step ? countBlanks(step.copy[universe ?? "football"]?.statement ?? "") : 0;
    setBlankValues(Array.from({ length: Math.max(blankCount, blankCount === 0 && step?.kind === "blanks" ? 1 : 0) }, () => ""));
  }, [index, step?.id, universe]);

  useEffect(() => subscribeSpeech(setSpeaking), []);

  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject) && !lockedSession) return <Navigate to="/classe" replace />;
  if (!universe || !mode) {
    return <Navigate to={lockedSession ? "/salle-attente" : "/pret"} replace />;
  }
  if (!sessionId) {
    return <Navigate to={lockedSession ? "/salle-attente" : "/pret"} replace />;
  }
  if (!step) {
    return <Navigate to={lockedSession ? "/salle-attente" : "/recompense"} replace />;
  }

  const copy = step.copy[universe];
  const qcm = usesQcm(step, mode);
  const currentValue =
    step.kind === "tutorial" || step.kind === "fraction-choice" || step.kind === "simplify"
      ? `${top}/${bottom}`
      : step.kind === "blanks"
        ? blankValues.join("|")
        : raw;

  function goNext() {
    if (index >= steps.length - 1) {
      void completeMission().then(() => {
        navigate(lockedSession ? "/salle-attente" : "/recompense");
      });
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
    if (
      qcm &&
      (current.kind === "fraction-choice" ||
        current.kind === "simplify" ||
        current.kind === "number" ||
        current.kind === "direction" ||
        current.kind === "choice" ||
        current.kind === "audio")
    ) {
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
    if (current.kind === "blanks") {
      const segments = splitBlankSegments(copy.statement);
      const blankOnly = segments.every((seg) => seg.type === "text") || segments.length === 0;
      if (blankOnly) {
        return (
          <div className="free-row">
            <input
              type="text"
              aria-label="Complète le trou"
              value={blankValues[0] ?? ""}
              onChange={(event) => setBlankValues([event.target.value])}
              placeholder="Ta réponse"
            />
          </div>
        );
      }
      let blankIndex = 0;
      return (
        <p className="blanks-line" aria-label="Texte à trous">
          {segments.map((seg, i) => {
            if (seg.type === "text") {
              return <span key={`t-${i}`}>{seg.value}</span>;
            }
            const idx = blankIndex;
            blankIndex += 1;
            return (
              <input
                key={`b-${idx}`}
                type="text"
                className="blanks-input"
                aria-label={`Trou ${idx + 1}`}
                value={blankValues[idx] ?? ""}
                onChange={(event) => {
                  setBlankValues((prev) => {
                    const next = [...prev];
                    next[idx] = event.target.value;
                    return next;
                  });
                }}
              />
            );
          })}
        </p>
      );
    }
    if (current.kind === "number" || current.kind === "text" || current.kind === "audio") {
      return (
        <div className="free-row">
          <input
            type={current.kind === "number" ? "number" : "text"}
            inputMode={current.kind === "number" ? "numeric" : "text"}
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
      confirmLeaveMission={!lockedSession}
      homeTo={lockedSession ? "/salle-attente" : "/accueil"}
      backTo={lockedSession ? undefined : "/pret"}
      extra={
        lockedSession ? (
          liveParticipant ? (
            <Button
              type="button"
              className={liveParticipant.handRaised ? "hand-raised-btn is-on" : "hand-raised-btn"}
              aria-pressed={liveParticipant.handRaised}
              onClick={() => {
                void raiseHand(!liveParticipant.handRaised);
              }}
            >
              {liveParticipant.handRaised ? "Baisser la main" : "Lever la main"}
            </Button>
          ) : null
        ) : (
          <Button
            onClick={() => {
              const ok = window.confirm("Quitter la mission et revenir à l’accueil ?");
              if (!ok) return;
              void quitMission().then(() => navigate("/accueil"));
            }}
          >
            Quitter
          </Button>
        )
      }
    >
      <div className="mission-layout">
        <UniverseScene
          universe={universe}
          stepId={sceneKeyOf(step)}
          progress={step.progress}
          success={kind === "ok" || step.kind === "teaser" || step.kind === "method" || sceneKeyOf(step) === "N04"}
          selected={currentValue === "/" ? raw : currentValue}
          expected={step.expected}
          caption={copy.caption}
          kind={step.kind}
          subject={mission?.subject ?? subject ?? undefined}
          statement={copy.statement}
          title={copy.title}
        />
        <section>
          <div className="progress" aria-label="Progression">
            {Array.from({ length: Math.max(6, step.progress) }, (_, i) => (
              <i key={i} className={i < step.progress ? "on" : ""} />
            ))}
          </div>
          <span className="kicker">{step.kicker}</span>
          <RichText as="h1" html={copy.title} />
          {step.kind === "blanks" ? null : (
            <RichText className="lead" html={copy.statement} data-listen />
          )}
          {copy.note ? <RichText html={copy.note} /> : null}
          {step.kind === "audio" ? (
            <div className="audio-step">
              <Button
                type="button"
                variant="primary"
                className={audioHeard ? "audio-heard" : ""}
                disabled={!canSpeak()}
                onClick={() => {
                  if (speaking) {
                    stopSpeech();
                    return;
                  }
                  const ok = speakText(
                    [copy.title, copy.statement, copy.note].filter(Boolean).join(". "),
                  );
                  if (ok) setAudioHeard(true);
                }}
              >
                {speaking ? "Stopper l’écoute" : audioHeard ? "Réécouter" : "Écouter la consigne"}
              </Button>
              {!canSpeak() ? (
                <p className="field-help">La lecture vocale n’est pas disponible sur cet appareil.</p>
              ) : null}
            </div>
          ) : null}
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
          {step.kind === "method" ? (
            <div className="method-box">
              <RichText html={copy.note ?? ""} />
            </div>
          ) : null}
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
            <Neo pose={sceneKeyOf(step) === "N04" ? "applaudit" : "pouce"} universe={universe} className="neo-small" />
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
                <Button
                  variant="primary"
                  onClick={() => void onValidate()}
                  disabled={kind === "ok" || !currentValue || currentValue === "/"}
                >
                  Valider
                </Button>
              </>
            ) : step.kind === "teaser" ? (
              <Button variant="primary" onClick={goNext}>
                {lockedSession ? "Terminer" : "Voir ma récompense"}
              </Button>
            ) : step.kind === "bilan" ? null : step.kind === "audio" && !needsAnswer(step) ? (
              <Button variant="primary" onClick={goNext} disabled={!audioHeard && canSpeak()}>
                Continuer
              </Button>
            ) : (
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
