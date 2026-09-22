import { DIRECTION_LABELS } from "../data/missions/labels";
import type { PlayMode, Step, ValidationResult } from "../data/types";

function normalize(raw: string): string {
  return raw.trim().replace(/\s+/g, "").replace(",", "/").toLowerCase();
}

/** Compare texte (trous, réponses libres, audio) : casse ignorée, espaces normalisés. */
function normalizeText(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").toLowerCase();
}

export function parseFraction(raw: string): { top: string; bottom: string } | null {
  const n = normalize(raw);
  const match = n.match(/^(\d+)\/(\d+)$/);
  if (!match) return null;
  return { top: match[1], bottom: match[2] };
}

/** Compte les marqueurs `___` dans une consigne (texte à trous). */
export function countBlanks(statement: string): number {
  const plain = statement.replace(/<[^>]*>/g, " ");
  const matches = plain.match(/_{2,}/g);
  return matches?.length ?? 0;
}

/** Découpe une consigne en segments texte / trous pour le player. */
export function splitBlankSegments(statement: string): { type: "text" | "blank"; value: string }[] {
  const plain = statement
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const parts = plain.split(/_{2,}/);
  const segments: { type: "text" | "blank"; value: string }[] = [];
  parts.forEach((part, index) => {
    if (part) segments.push({ type: "text", value: part });
    if (index < parts.length - 1) segments.push({ type: "blank", value: "" });
  });
  return segments;
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

  if (step.kind === "number") {
    if (value === normalize(expected)) {
      const extra = step.twoStep === 1 ? " Garde ce résultat pour l’étape suivante." : "";
      return { ok: true, kind: "ok", message: `Oui.${extra}` };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Reprends le calcul, puis réessaie.",
    };
  }

  if (step.kind === "text" || step.kind === "audio") {
    if (normalizeText(raw) === normalizeText(expected)) {
      return { ok: true, kind: "ok", message: "Oui, c’est la bonne réponse." };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Relis ou réécoute la consigne, puis réessaie.",
    };
  }

  if (step.kind === "blanks") {
    const expectedParts = expected
      .split("|")
      .map((part) => normalizeText(part))
      .filter(Boolean);
    const gotParts = raw
      .split("|")
      .map((part) => normalizeText(part))
      .filter((part, index, arr) => part || index < arr.length - 1);

    if (expectedParts.length === 0) {
      return { ok: true, kind: "info", message: "" };
    }

    // Une seule réponse attendue : accepter aussi une saisie sans séparateur.
    if (expectedParts.length === 1) {
      const single = normalizeText(raw.replace(/\|/g, " "));
      if (single === expectedParts[0]) {
        return { ok: true, kind: "ok", message: "Oui, le trou est bien rempli." };
      }
      return { ok: false, kind: "retry", message: "Relis la phrase et complète le trou." };
    }

    if (
      gotParts.length === expectedParts.length &&
      gotParts.every((part, index) => part === expectedParts[index])
    ) {
      return { ok: true, kind: "ok", message: "Oui, tous les trous sont justes." };
    }
    return {
      ok: false,
      kind: "retry",
      message: "Vérifie chaque trou, puis réessaie.",
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
  if (step.kind === "audio") return Boolean(step.expected?.trim());
  return (
    step.kind === "tutorial" ||
    step.kind === "fraction-choice" ||
    step.kind === "simplify" ||
    step.kind === "number" ||
    step.kind === "text" ||
    step.kind === "blanks" ||
    step.kind === "direction" ||
    step.kind === "choice"
  );
}

export function usesQcm(step: Step, mode: PlayMode): boolean {
  if (step.kind === "direction" || step.kind === "choice") return true;
  if (step.kind === "audio" && (step.distractors?.length ?? 0) > 0) return true;
  if (step.kind === "tutorial" || step.kind === "text" || step.kind === "blanks") return false;
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
  return step.kind === "teaser" || step.kind === "method" || key === "N04" || key === "L01" || key === "Z01";
}
