import { DIRECTION_LABELS } from "../data/steps";
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
            ? "Oui : tu as écrit trois quarts."
            : "Oui. Cette fraction est la bonne.",
      };
    }
    if (step.kind === "simplify" && got === "6/12") {
      return {
        ok: false,
        kind: "retry",
        message: "C’est la même quantité, mais on cherche une fraction plus simple.",
      };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Observe bien les deux nombres, puis réessaie.",
    };
  }

  if (step.kind === "number") {
    if (value === expected) {
      const extra =
        step.twoStep === 1
          ? " Garde ce résultat pour l’étape suivante."
          : "";
      return { ok: true, kind: "ok", message: `Oui.${extra}` };
    }
    if (step.expected === "18" && value === "6") {
      return {
        ok: false,
        kind: "retry",
        message: "6 est la valeur d’un quart. La situation en demande trois.",
      };
    }
    if (step.expected === "5" && value === "4" && step.id === "M02") {
      return {
        ok: false,
        kind: "retry",
        message: "Le 4 indique le nombre de parts, pas la valeur d’une part.",
      };
    }
    if (step.expected === "5" && value === "15" && step.id === "M02") {
      return {
        ok: false,
        kind: "retry",
        message: "15 représente trois quarts. Ici, tu cherches seulement un quart.",
      };
    }
    if (step.expected === "15" && value === "5") {
      return {
        ok: false,
        kind: "retry",
        message: "5 est la valeur d’une part. Il en faut trois.",
      };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Reprends le partage, une part après l’autre.",
    };
  }

  if (step.kind === "direction") {
    if (value === expected) {
      return { ok: true, kind: "ok", message: "Oui, c’est dans l’axe." };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Cette direction ne convient pas encore. Regarde droit devant.",
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
    step.kind === "direction"
  );
}

export function usesQcm(step: Step, mode: PlayMode): boolean {
  if (step.kind === "direction") return true;
  if (step.kind === "tutorial") return false;
  if (!needsAnswer(step)) return false;
  return mode === "qcm";
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function advanceDelay(): number {
  return prefersReducedMotion() ? 0 : 2200;
}
