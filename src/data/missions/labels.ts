import type { UniverseSlug } from "../types";

export const BILAN_CHOICES: Record<UniverseSlug, { value: string; label: string }[]> = {
  football: [
    { value: "pressing", label: "Sortir du pressing" },
    { value: "passes", label: "Réussir les passes" },
    { value: "but", label: "Marquer le but" },
  ],
  rugby: [
    { value: "espace", label: "Trouver l’espace" },
    { value: "passes", label: "Réussir les passes" },
    { value: "essai", label: "Marquer l’essai" },
  ],
  equitation: [
    { value: "sentier", label: "Choisir le sentier" },
    { value: "allure", label: "Garder l’allure" },
    { value: "saut", label: "Réussir le saut" },
  ],
  espace: [
    { value: "signaux", label: "Analyser les signaux" },
    { value: "trajectoire", label: "Corriger la trajectoire" },
    { value: "arrimage", label: "Réussir l’arrimage" },
  ],
};

export const DIRECTION_LABELS: Record<string, string> = {
  gauche: "À gauche",
  axe: "Dans l’axe",
  droite: "À droite",
};
