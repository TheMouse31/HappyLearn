import { DIRECTION_LABELS } from "../data/missions/labels";
import type { PlayMode, Step, ValidationResult } from "../data/types";

function normalize(raw: string): string {
  return raw.trim().replace(/\s+/g, "").replace(",", "/").toLowerCase();
}

export function parseFraction(raw: string): { top: string; bottom: string } | null {
  const n = normalize(raw);
  const match = n.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  return { top: match[1], bottom: match[2] };
}

export function validateAnswer(step: Step, raw: string): ValidationResult {
  const expected = step.expected ?? "";
  const value = normalize(raw);

  if (step.kind === "tutorial" || step.kind === "fraction-choice" || step.kind === "simplify") {
    const frac = parseFraction(raw);
    if (!frac) {
      return {
        ok: false,
        kind: "retry",
        message: "Écris le nombre du haut, puis le nombre du bas.",
      };
    }
    const got = `${frac.top}/${frac.bottom}`;
    if (got === expected) {
      return {
        ok: true,
        kind: "ok",
        message:
          step.kind === "tutorial"
            ? "Oui : tu as écrit la fraction correctement."
            : "Oui. Cette fraction est la bonne.",
      };
    }
    if (step.kind === "simplify" && expected.includes("/") && got !== expected) {
      // Même quantité non réduite : message générique (sans hardcoder 6/12).
      const [eTop, eBot] = expected.split("/");
      if (eTop && eBot && Number(frac.bottom) > Number(eBot)) {
        return {
          ok: false,
          kind: "retry",
          message: "C’est la même quantité, mais on cherche une fraction plus simple.",
        };
      }
    }
    return {
      ok: false,
      kind: "retry",
      message: "Observe bien les deux nombres, puis réessaie.",
    };
  }

  if (step.kind === "number" || step.kind === "text") {
    if (value === normalize(expected)) {
      const extra = step.twoStep === 1 ? " Garde ce résultat pour l’étape suivante." : "";
      return { ok: true, kind: "ok", message: `Oui.${extra}` };
    }
    return {
      ok: false,
      kind: "retry",
      message: step.kind === "text" ? "Relis la consigne et réessaie." : "Reprends le calcul, puis réessaie.",
    };
  }

  if (step.kind === "direction" || step.kind === "choice") {
    if (value === normalize(expected)) {
      return { ok: true, kind: "ok", message: "Oui, c’est la bonne réponse." };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Ce n’est pas encore la bonne réponse. Réessaie.",
    };
  }

  return { ok: true, kind: "info", message: "" };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = copy[i];
    const swap = copy[j];
    if (current === undefined || swap === undefined) continue;
    copy[i] = swap;
    copy[j] = current;
  }
  return copy;
}

export function qcmOptions(step: Step): string[] {
  if (!step.expected) return [];
  const values = [step.expected, ...(step.distractors ?? [])];
  return shuffle(values);
}

export function optionLabel(step: Step, value: string): string {
  if (step.kind === "direction") return DIRECTION_LABELS[value] ?? value;
  return value;
}

export function needsAnswer(step: Step): boolean {
  return (
    step.kind === "tutorial" ||
    step.kind === "fraction-choice" ||
    step.kind === "simplify" ||
    step.kind === "number" ||
    step.kind === "text" ||
    step.kind === "direction" ||
    step.kind === "choice"
  );
}

export function usesQcm(step: Step, mode: PlayMode): boolean {
  if (step.kind === "direction" || step.kind === "choice") return true;
  if (step.kind === "tutorial" || step.kind === "text") return false;
  if (!needsAnswer(step)) return false;
  return mode === "qcm";
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function advanceDelay(): number {
  return prefersReducedMotion() ? 0 : 2200;
}

/** Clé visuelle pour UniverseScene (scene > slug > id). */
export function sceneKeyOf(step: Step): string {
  return step.scene ?? step.slug ?? step.id;
}

export function isCelebrationStep(step: Step): boolean {
  const key = sceneKeyOf(step);
  return step.kind === "teaser" || key === "N04" || key === "L01" || step.slug === "s14" || step.slug === "s15";
}
