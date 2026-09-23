import type { GradeLevel, SubjectSlug } from "./types";

/** Thème du programme (référentiel éditorial pour le suivi enseignant). */
export type ProgrammeTheme = {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  label: string;
  /** Mission builtin liée (si elle existe). */
  missionId: string | null;
  priority: number;
};

export const PROGRAMME_THEMES: ProgrammeTheme[] = [
  { id: "cm2-maths-fractions-operateur", grade: "cm2", subject: "maths", label: "Fractions — opérateur (fraction d'une quantité)", missionId: "cm2-maths-fractions-01", priority: 1 },
  { id: "cm2-maths-fractions-nombres", grade: "cm2", subject: "maths", label: "Fractions — nombres (>1 droite graduée encadrement)", missionId: "cm2-maths-fractions-nombres-01", priority: 1 },
  { id: "cm2-maths-fractions-operations", grade: "cm2", subject: "maths", label: "Fractions — comparer additionner soustraire", missionId: "cm2-maths-fractions-operations-01", priority: 1 },
  { id: "cm2-maths-decimaux", grade: "cm2", subject: "maths", label: "Nombres décimaux (jusqu'aux millièmes)", missionId: "cm2-maths-decimaux-01", priority: 1 },
  { id: "cm2-maths-entiers", grade: "cm2", subject: "maths", label: "Nombres entiers (grands nombres)", missionId: "cm2-maths-entiers-01", priority: 2 },
  { id: "cm2-maths-calcul-mental", grade: "cm2", subject: "maths", label: "Calcul mental et automatismes", missionId: "cm2-maths-calcul-mental-01", priority: 2 },
  { id: "cm2-maths-problemes", grade: "cm2", subject: "maths", label: "Résolution de problèmes (structures variées)", missionId: "cm2-maths-problemes-01", priority: 2 },
  { id: "cm2-maths-proportionnalite", grade: "cm2", subject: "maths", label: "Proportionnalité (linéarité sans produit en croix)", missionId: "cm2-maths-proportionnalite-01", priority: 2 },
  { id: "cm2-maths-grandeurs", grade: "cm2", subject: "maths", label: "Grandeurs et mesures (durées angles aires)", missionId: "cm2-maths-grandeurs-01", priority: 2 },
  { id: "cm2-maths-geometrie", grade: "cm2", subject: "maths", label: "Espace et géométrie (figures symétrie)", missionId: "cm2-maths-geometrie-01", priority: 2 },
  { id: "cm2-maths-donnees", grade: "cm2", subject: "maths", label: "Organisation des données et probabilités", missionId: "cm2-maths-donnees-01", priority: 3 },
  { id: "cm2-maths-algebre", grade: "cm2", subject: "maths", label: "Initiation pensée algébrique", missionId: "cm2-maths-algebre-01", priority: 3 },
  { id: "cm1-maths-fractions", grade: "cm1", subject: "maths", label: "Fractions (dénominateur ≤20 opérateur unitaire)", missionId: "cm1-maths-fractions-01", priority: 1 },
  { id: "cm1-maths-decimaux", grade: "cm1", subject: "maths", label: "Nombres décimaux (centièmes)", missionId: "cm1-maths-decimaux-01", priority: 1 },
  { id: "cm1-maths-entiers", grade: "cm1", subject: "maths", label: "Nombres entiers jusqu'à 999 999", missionId: "cm1-maths-entiers-01", priority: 2 },
  { id: "cm1-maths-problemes", grade: "cm1", subject: "maths", label: "Résolution de problèmes", missionId: "cm1-maths-problemes-01", priority: 2 },
  { id: "cm1-maths-grandeurs", grade: "cm1", subject: "maths", label: "Grandeurs et mesures", missionId: "cm1-maths-grandeurs-01", priority: 2 },
  { id: "cm1-maths-geometrie", grade: "cm1", subject: "maths", label: "Espace et géométrie", missionId: "cm1-maths-geometrie-01", priority: 2 },
  { id: "cm1-maths-donnees", grade: "cm1", subject: "maths", label: "Données et probabilités (vocabulaire)", missionId: "cm1-maths-donnees-01", priority: 3 },
  { id: "ce2-maths-fractions", grade: "ce2", subject: "maths", label: "Fractions d'unité / égalités (dén. ≤12)", missionId: "ce2-maths-fractions-01", priority: 1 },
  { id: "ce2-maths-entiers", grade: "ce2", subject: "maths", label: "Nombres entiers jusqu'à 10 000", missionId: "ce2-maths-entiers-01", priority: 2 },
  { id: "ce2-maths-operations", grade: "ce2", subject: "maths", label: "Multiplication posée et division", missionId: "ce2-maths-operations-01", priority: 2 },
  { id: "ce2-maths-problemes", grade: "ce2", subject: "maths", label: "Problèmes 2–3 étapes", missionId: "ce2-maths-problemes-01", priority: 2 },
  { id: "ce2-maths-grandeurs", grade: "ce2", subject: "maths", label: "Grandeurs (périmètre contenances durées)", missionId: "ce2-maths-grandeurs-01", priority: 2 },
  { id: "ce2-maths-geometrie", grade: "ce2", subject: "maths", label: "Géométrie (losange symétrie patron)", missionId: "ce2-maths-geometrie-01", priority: 3 },
  { id: "ce1-maths-fractions", grade: "ce1", subject: "maths", label: "Fractions partie d'un tout", missionId: "ce1-maths-fractions-01", priority: 1 },
  { id: "ce1-maths-entiers", grade: "ce1", subject: "maths", label: "Nombres entiers jusqu'à 1 000", missionId: "ce1-maths-entiers-01", priority: 2 },
  { id: "ce1-maths-operations", grade: "ce1", subject: "maths", label: "Soustraction et sens des opérations", missionId: "ce1-maths-operations-01", priority: 2 },
  { id: "ce1-maths-problemes", grade: "ce1", subject: "maths", label: "Problèmes 1–2 étapes", missionId: "ce1-maths-problemes-01", priority: 2 },
  { id: "ce1-maths-grandeurs", grade: "ce1", subject: "maths", label: "Grandeurs (km masses monnaie centimes)", missionId: "ce1-maths-grandeurs-01", priority: 3 },
  { id: "cp-maths-entiers", grade: "cp", subject: "maths", label: "Nombres entiers jusqu'à 100", missionId: "cp-maths-entiers-01", priority: 1 },
  { id: "cp-maths-addition", grade: "cp", subject: "maths", label: "Addition et premiers problèmes", missionId: "cp-maths-addition-01", priority: 1 },
  { id: "cp-maths-grandeurs", grade: "cp", subject: "maths", label: "Longueurs monnaie heure entière", missionId: "cp-maths-grandeurs-01", priority: 2 },
  { id: "cp-maths-geometrie", grade: "cp", subject: "maths", label: "Formes solides repérage spatial", missionId: "cp-maths-geometrie-01", priority: 3 },
  { id: "cm2-francais-lecture", grade: "cm2", subject: "francais", label: "Lecture et compréhension", missionId: "cm2-francais-lecture-01", priority: 1 },
  { id: "cm2-francais-ecriture", grade: "cm2", subject: "francais", label: "Écriture et réécriture", missionId: "cm2-francais-ecriture-01", priority: 2 },
  { id: "cm2-francais-langue", grade: "cm2", subject: "francais", label: "Étude de la langue (grammaire orthographe)", missionId: "cm2-francais-langue-01", priority: 2 },
  { id: "cm2-francais-vocabulaire", grade: "cm2", subject: "francais", label: "Vocabulaire et oral", missionId: "cm2-francais-vocabulaire-01", priority: 3 },
  { id: "cm1-francais-lecture", grade: "cm1", subject: "francais", label: "Lecture et compréhension", missionId: "cm1-francais-lecture-01", priority: 1 },
  { id: "cm1-francais-ecriture", grade: "cm1", subject: "francais", label: "Écriture", missionId: "cm1-francais-ecriture-01", priority: 2 },
  { id: "cm1-francais-langue", grade: "cm1", subject: "francais", label: "Étude de la langue", missionId: "cm1-francais-langue-01", priority: 2 },
  { id: "ce2-francais-lecture", grade: "ce2", subject: "francais", label: "Lecture fluide et compréhension", missionId: "ce2-francais-lecture-01", priority: 1 },
  { id: "ce2-francais-ecriture", grade: "ce2", subject: "francais", label: "Production d'écrits", missionId: "ce2-francais-ecriture-01", priority: 2 },
  { id: "ce1-francais-lecture", grade: "ce1", subject: "francais", label: "Lecture automatisation compréhension", missionId: "ce1-francais-lecture-01", priority: 1 },
  { id: "ce1-francais-ecriture", grade: "ce1", subject: "francais", label: "Écriture phrases et textes courts", missionId: "ce1-francais-ecriture-01", priority: 2 },
  { id: "cp-francais-lecture", grade: "cp", subject: "francais", label: "Décodage lecture à voix haute", missionId: "cp-francais-lecture-01", priority: 1 },
  { id: "cp-francais-ecriture", grade: "cp", subject: "francais", label: "Geste cursif copie premières phrases", missionId: "cp-francais-ecriture-01", priority: 1 },
  { id: "cm2-histoire-republique", grade: "cm2", subject: "histoire-geo", label: "Histoire — Le temps de la République", missionId: "cm2-histoire-geo-histoire-republique-01", priority: 2 },
  { id: "cm2-histoire-industriel", grade: "cm2", subject: "histoire-geo", label: "Histoire — L'âge industriel", missionId: "cm2-histoire-geo-histoire-industriel-01", priority: 3 },
  { id: "cm2-histoire-guerres-ue", grade: "cm2", subject: "histoire-geo", label: "Histoire — Guerres mondiales à l'UE", missionId: "cm2-histoire-geo-histoire-guerres-ue-01", priority: 3 },
  { id: "cm2-geo-deplacer", grade: "cm2", subject: "histoire-geo", label: "Géographie — Se déplacer", missionId: "cm2-histoire-geo-geo-deplacer-01", priority: 2 },
  { id: "cm2-geo-communiquer", grade: "cm2", subject: "histoire-geo", label: "Géographie — Communiquer (internet)", missionId: "cm2-histoire-geo-geo-communiquer-01", priority: 3 },
  { id: "cm2-geo-habiter", grade: "cm2", subject: "histoire-geo", label: "Géographie — Mieux habiter", missionId: "cm2-histoire-geo-geo-habiter-01", priority: 3 },
  { id: "cm1-histoire-avant-france", grade: "cm1", subject: "histoire-geo", label: "Histoire — Et avant la France", missionId: "cm1-histoire-geo-histoire-avant-france-01", priority: 2 },
  { id: "cm1-histoire-rois", grade: "cm1", subject: "histoire-geo", label: "Histoire — Le temps des rois", missionId: "cm1-histoire-geo-histoire-rois-01", priority: 3 },
  { id: "cm1-histoire-revolution", grade: "cm1", subject: "histoire-geo", label: "Histoire — Révolution et Empire", missionId: "cm1-histoire-geo-histoire-revolution-01", priority: 3 },
  { id: "cm2-sciences-matiere", grade: "cm2", subject: "sciences", label: "Sciences — Matière", missionId: "cm2-sciences-matiere-01", priority: 2 },
  { id: "cm2-sciences-vivant", grade: "cm2", subject: "sciences", label: "Sciences — Vivant", missionId: "cm2-sciences-vivant-01", priority: 2 },
  { id: "cm2-sciences-energie", grade: "cm2", subject: "sciences", label: "Sciences — Énergie / objets techniques", missionId: "cm2-sciences-energie-01", priority: 3 },
  { id: "cm1-sciences-matiere", grade: "cm1", subject: "sciences", label: "Sciences — Matière", missionId: "cm1-sciences-matiere-01", priority: 2 },
  { id: "cm1-sciences-vivant", grade: "cm1", subject: "sciences", label: "Sciences — Vivant", missionId: "cm1-sciences-vivant-01", priority: 2 },
  { id: "ce2-qdm-vivant", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Vivant", missionId: "ce2-questionner-le-monde-qdm-vivant-01", priority: 2 },
  { id: "ce2-qdm-matiere", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Matière", missionId: "ce2-questionner-le-monde-qdm-matiere-01", priority: 2 },
  { id: "ce2-qdm-objets", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Objets techniques", missionId: "ce2-questionner-le-monde-qdm-objets-01", priority: 3 },
  { id: "ce2-qdm-espace-temps", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Espace et temps", missionId: "ce2-questionner-le-monde-qdm-espace-temps-01", priority: 3 },
  { id: "ce1-qdm-vivant", grade: "ce1", subject: "questionner-le-monde", label: "Questionner le monde — Vivant", missionId: "ce1-questionner-le-monde-qdm-vivant-01", priority: 2 },
  { id: "ce1-qdm-matiere-objets", grade: "ce1", subject: "questionner-le-monde", label: "Questionner le monde — Matière et objets", missionId: "ce1-questionner-le-monde-qdm-matiere-objets-01", priority: 3 },
  { id: "cp-qdm-vivant-matiere", grade: "cp", subject: "questionner-le-monde", label: "Questionner le monde — Vivant matière objets", missionId: "cp-questionner-le-monde-qdm-vivant-matiere-01", priority: 2 },
  { id: "cp-qdm-espace-temps", grade: "cp", subject: "questionner-le-monde", label: "Questionner le monde — Espace et temps", missionId: "cp-questionner-le-monde-qdm-espace-temps-01", priority: 3 },
  { id: "cm2-emc-vivre-ensemble", grade: "cm2", subject: "emc", label: "EMC — Règle droit jugement engagement", missionId: "cm2-emc-vivre-ensemble-01", priority: 2 },
  { id: "cm1-emc-vivre-ensemble", grade: "cm1", subject: "emc", label: "EMC — Sensibilité règle engagement", missionId: "cm1-emc-vivre-ensemble-01", priority: 2 },
  { id: "ce2-emc-vivre-ensemble", grade: "ce2", subject: "emc", label: "EMC — Vivre ensemble", missionId: "ce2-emc-vivre-ensemble-01", priority: 3 },
  { id: "ce1-emc-vivre-ensemble", grade: "ce1", subject: "emc", label: "EMC — Vivre ensemble", missionId: "ce1-emc-vivre-ensemble-01", priority: 3 },
  { id: "cp-emc-vivre-ensemble", grade: "cp", subject: "emc", label: "EMC — Émotions règles coopération", missionId: "cp-emc-vivre-ensemble-01", priority: 3 },
  { id: "cm2-anglais-oral", grade: "cm2", subject: "anglais", label: "Anglais — Oral A1+ thèmes quotidiens", missionId: "cm2-anglais-oral-01", priority: 3 },
  { id: "cm1-anglais-oral", grade: "cm1", subject: "anglais", label: "Anglais — Oral thèmes soi classe", missionId: "cm1-anglais-oral-01", priority: 3 },
  { id: "ce2-anglais-oral", grade: "ce2", subject: "anglais", label: "Anglais — Oral A1", missionId: "ce2-anglais-oral-01", priority: 3 },
  { id: "ce1-anglais-oral", grade: "ce1", subject: "anglais", label: "Anglais — Oral A1", missionId: "ce1-anglais-oral-01", priority: 3 },
  { id: "cp-anglais-oral", grade: "cp", subject: "anglais", label: "Anglais — Éveil oral A1", missionId: "cp-anglais-oral-01", priority: 3 },
];

export function listThemesFor(grade: GradeLevel | null, subject: SubjectSlug | null): ProgrammeTheme[] {
  return PROGRAMME_THEMES.filter((theme) => {
    if (grade && theme.grade !== grade) return false;
    if (subject && theme.subject !== subject) return false;
    return true;
  });
}

/** Matières du programme pour lesquelles un thème existe à ce niveau. */
export function listSubjectsForGrade(grade: GradeLevel): SubjectSlug[] {
  const seen = new Set<SubjectSlug>();
  const ordered: SubjectSlug[] = [];
  for (const theme of PROGRAMME_THEMES) {
    if (theme.grade !== grade) continue;
    if (seen.has(theme.subject)) continue;
    seen.add(theme.subject);
    ordered.push(theme.subject);
  }
  return ordered;
}

export function findThemeById(themeId: string | null | undefined): ProgrammeTheme | null {
  if (!themeId) return null;
  return PROGRAMME_THEMES.find((theme) => theme.id === themeId) ?? null;
}

export function findThemeByMissionId(missionId: string | null | undefined): ProgrammeTheme | null {
  if (!missionId) return null;
  return PROGRAMME_THEMES.find((theme) => theme.missionId === missionId) ?? null;
}

/**
 * Segment slug d’un thème programme pour l’id mission
 * (`cm2-maths-fractions-operateur` → `fractions-operateur`).
 */
export function themeSlugFromId(themeId: string, grade: GradeLevel, subject: SubjectSlug): string {
  const prefix = `${grade}-${subject}-`;
  if (themeId.startsWith(prefix)) {
    const rest = themeId.slice(prefix.length).replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
    if (rest) return rest;
  }
  return (
    themeId
      .replace(new RegExp(`^${grade}-`), "")
      .replace(new RegExp(`^${subject}-`), "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "") || "mission"
  );
}

