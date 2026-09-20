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
  { id: "cm2-maths-fractions-nombres", grade: "cm2", subject: "maths", label: "Fractions — nombres (>1 droite graduée encadrement)", missionId: null, priority: 1 },
  { id: "cm2-maths-fractions-operations", grade: "cm2", subject: "maths", label: "Fractions — comparer additionner soustraire", missionId: null, priority: 1 },
  { id: "cm2-maths-decimaux", grade: "cm2", subject: "maths", label: "Nombres décimaux (jusqu'aux millièmes)", missionId: null, priority: 1 },
  { id: "cm2-maths-entiers", grade: "cm2", subject: "maths", label: "Nombres entiers (grands nombres)", missionId: null, priority: 2 },
  { id: "cm2-maths-calcul-mental", grade: "cm2", subject: "maths", label: "Calcul mental et automatismes", missionId: null, priority: 2 },
  { id: "cm2-maths-problemes", grade: "cm2", subject: "maths", label: "Résolution de problèmes (structures variées)", missionId: null, priority: 2 },
  { id: "cm2-maths-proportionnalite", grade: "cm2", subject: "maths", label: "Proportionnalité (linéarité sans produit en croix)", missionId: null, priority: 2 },
  { id: "cm2-maths-grandeurs", grade: "cm2", subject: "maths", label: "Grandeurs et mesures (durées angles aires)", missionId: null, priority: 2 },
  { id: "cm2-maths-geometrie", grade: "cm2", subject: "maths", label: "Espace et géométrie (figures symétrie)", missionId: null, priority: 2 },
  { id: "cm2-maths-donnees", grade: "cm2", subject: "maths", label: "Organisation des données et probabilités", missionId: null, priority: 3 },
  { id: "cm2-maths-algebre", grade: "cm2", subject: "maths", label: "Initiation pensée algébrique", missionId: null, priority: 3 },
  { id: "cm1-maths-fractions", grade: "cm1", subject: "maths", label: "Fractions (dénominateur ≤20 opérateur unitaire)", missionId: null, priority: 1 },
  { id: "cm1-maths-decimaux", grade: "cm1", subject: "maths", label: "Nombres décimaux (centièmes)", missionId: null, priority: 1 },
  { id: "cm1-maths-entiers", grade: "cm1", subject: "maths", label: "Nombres entiers jusqu'à 999 999", missionId: null, priority: 2 },
  { id: "cm1-maths-problemes", grade: "cm1", subject: "maths", label: "Résolution de problèmes", missionId: null, priority: 2 },
  { id: "cm1-maths-grandeurs", grade: "cm1", subject: "maths", label: "Grandeurs et mesures", missionId: null, priority: 2 },
  { id: "cm1-maths-geometrie", grade: "cm1", subject: "maths", label: "Espace et géométrie", missionId: null, priority: 2 },
  { id: "cm1-maths-donnees", grade: "cm1", subject: "maths", label: "Données et probabilités (vocabulaire)", missionId: null, priority: 3 },
  { id: "ce2-maths-fractions", grade: "ce2", subject: "maths", label: "Fractions d'unité / égalités (dén. ≤12)", missionId: null, priority: 1 },
  { id: "ce2-maths-entiers", grade: "ce2", subject: "maths", label: "Nombres entiers jusqu'à 10 000", missionId: null, priority: 2 },
  { id: "ce2-maths-operations", grade: "ce2", subject: "maths", label: "Multiplication posée et division", missionId: null, priority: 2 },
  { id: "ce2-maths-problemes", grade: "ce2", subject: "maths", label: "Problèmes 2–3 étapes", missionId: null, priority: 2 },
  { id: "ce2-maths-grandeurs", grade: "ce2", subject: "maths", label: "Grandeurs (périmètre contenances durées)", missionId: null, priority: 2 },
  { id: "ce2-maths-geometrie", grade: "ce2", subject: "maths", label: "Géométrie (losange symétrie patron)", missionId: null, priority: 3 },
  { id: "ce1-maths-fractions", grade: "ce1", subject: "maths", label: "Fractions partie d'un tout", missionId: null, priority: 1 },
  { id: "ce1-maths-entiers", grade: "ce1", subject: "maths", label: "Nombres entiers jusqu'à 1 000", missionId: null, priority: 2 },
  { id: "ce1-maths-operations", grade: "ce1", subject: "maths", label: "Soustraction et sens des opérations", missionId: null, priority: 2 },
  { id: "ce1-maths-problemes", grade: "ce1", subject: "maths", label: "Problèmes 1–2 étapes", missionId: null, priority: 2 },
  { id: "ce1-maths-grandeurs", grade: "ce1", subject: "maths", label: "Grandeurs (km masses monnaie centimes)", missionId: null, priority: 3 },
  { id: "cp-maths-entiers", grade: "cp", subject: "maths", label: "Nombres entiers jusqu'à 100", missionId: null, priority: 1 },
  { id: "cp-maths-addition", grade: "cp", subject: "maths", label: "Addition et premiers problèmes", missionId: null, priority: 1 },
  { id: "cp-maths-grandeurs", grade: "cp", subject: "maths", label: "Longueurs monnaie heure entière", missionId: null, priority: 2 },
  { id: "cp-maths-geometrie", grade: "cp", subject: "maths", label: "Formes solides repérage spatial", missionId: null, priority: 3 },
  { id: "cm2-francais-lecture", grade: "cm2", subject: "francais", label: "Lecture et compréhension", missionId: null, priority: 1 },
  { id: "cm2-francais-ecriture", grade: "cm2", subject: "francais", label: "Écriture et réécriture", missionId: null, priority: 2 },
  { id: "cm2-francais-langue", grade: "cm2", subject: "francais", label: "Étude de la langue (grammaire orthographe)", missionId: null, priority: 2 },
  { id: "cm2-francais-vocabulaire", grade: "cm2", subject: "francais", label: "Vocabulaire et oral", missionId: null, priority: 3 },
  { id: "cm1-francais-lecture", grade: "cm1", subject: "francais", label: "Lecture et compréhension", missionId: null, priority: 1 },
  { id: "cm1-francais-ecriture", grade: "cm1", subject: "francais", label: "Écriture", missionId: null, priority: 2 },
  { id: "cm1-francais-langue", grade: "cm1", subject: "francais", label: "Étude de la langue", missionId: null, priority: 2 },
  { id: "ce2-francais-lecture", grade: "ce2", subject: "francais", label: "Lecture fluide et compréhension", missionId: null, priority: 1 },
  { id: "ce2-francais-ecriture", grade: "ce2", subject: "francais", label: "Production d'écrits", missionId: null, priority: 2 },
  { id: "ce1-francais-lecture", grade: "ce1", subject: "francais", label: "Lecture automatisation compréhension", missionId: null, priority: 1 },
  { id: "ce1-francais-ecriture", grade: "ce1", subject: "francais", label: "Écriture phrases et textes courts", missionId: null, priority: 2 },
  { id: "cp-francais-lecture", grade: "cp", subject: "francais", label: "Décodage lecture à voix haute", missionId: null, priority: 1 },
  { id: "cp-francais-ecriture", grade: "cp", subject: "francais", label: "Geste cursif copie premières phrases", missionId: null, priority: 1 },
  { id: "cm2-histoire-republique", grade: "cm2", subject: "histoire-geo", label: "Histoire — Le temps de la République", missionId: null, priority: 2 },
  { id: "cm2-histoire-industriel", grade: "cm2", subject: "histoire-geo", label: "Histoire — L'âge industriel", missionId: null, priority: 3 },
  { id: "cm2-histoire-guerres-ue", grade: "cm2", subject: "histoire-geo", label: "Histoire — Guerres mondiales à l'UE", missionId: null, priority: 3 },
  { id: "cm2-geo-deplacer", grade: "cm2", subject: "histoire-geo", label: "Géographie — Se déplacer", missionId: null, priority: 2 },
  { id: "cm2-geo-communiquer", grade: "cm2", subject: "histoire-geo", label: "Géographie — Communiquer (internet)", missionId: null, priority: 3 },
  { id: "cm2-geo-habiter", grade: "cm2", subject: "histoire-geo", label: "Géographie — Mieux habiter", missionId: null, priority: 3 },
  { id: "cm1-histoire-avant-france", grade: "cm1", subject: "histoire-geo", label: "Histoire — Et avant la France", missionId: null, priority: 2 },
  { id: "cm1-histoire-rois", grade: "cm1", subject: "histoire-geo", label: "Histoire — Le temps des rois", missionId: null, priority: 3 },
  { id: "cm1-histoire-revolution", grade: "cm1", subject: "histoire-geo", label: "Histoire — Révolution et Empire", missionId: null, priority: 3 },
  { id: "cm2-sciences-matiere", grade: "cm2", subject: "sciences", label: "Sciences — Matière", missionId: null, priority: 2 },
  { id: "cm2-sciences-vivant", grade: "cm2", subject: "sciences", label: "Sciences — Vivant", missionId: null, priority: 2 },
  { id: "cm2-sciences-energie", grade: "cm2", subject: "sciences", label: "Sciences — Énergie / objets techniques", missionId: null, priority: 3 },
  { id: "cm1-sciences-matiere", grade: "cm1", subject: "sciences", label: "Sciences — Matière", missionId: null, priority: 2 },
  { id: "cm1-sciences-vivant", grade: "cm1", subject: "sciences", label: "Sciences — Vivant", missionId: null, priority: 2 },
  { id: "ce2-qdm-vivant", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Vivant", missionId: null, priority: 2 },
  { id: "ce2-qdm-matiere", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Matière", missionId: null, priority: 2 },
  { id: "ce2-qdm-objets", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Objets techniques", missionId: null, priority: 3 },
  { id: "ce2-qdm-espace-temps", grade: "ce2", subject: "questionner-le-monde", label: "Questionner le monde — Espace et temps", missionId: null, priority: 3 },
  { id: "ce1-qdm-vivant", grade: "ce1", subject: "questionner-le-monde", label: "Questionner le monde — Vivant", missionId: null, priority: 2 },
  { id: "ce1-qdm-matiere-objets", grade: "ce1", subject: "questionner-le-monde", label: "Questionner le monde — Matière et objets", missionId: null, priority: 3 },
  { id: "cp-qdm-vivant-matiere", grade: "cp", subject: "questionner-le-monde", label: "Questionner le monde — Vivant matière objets", missionId: null, priority: 2 },
  { id: "cp-qdm-espace-temps", grade: "cp", subject: "questionner-le-monde", label: "Questionner le monde — Espace et temps", missionId: null, priority: 3 },
  { id: "cm2-emc-vivre-ensemble", grade: "cm2", subject: "emc", label: "EMC — Règle droit jugement engagement", missionId: null, priority: 2 },
  { id: "cm1-emc-vivre-ensemble", grade: "cm1", subject: "emc", label: "EMC — Sensibilité règle engagement", missionId: null, priority: 2 },
  { id: "ce2-emc-vivre-ensemble", grade: "ce2", subject: "emc", label: "EMC — Vivre ensemble", missionId: null, priority: 3 },
  { id: "ce1-emc-vivre-ensemble", grade: "ce1", subject: "emc", label: "EMC — Vivre ensemble", missionId: null, priority: 3 },
  { id: "cp-emc-vivre-ensemble", grade: "cp", subject: "emc", label: "EMC — Émotions règles coopération", missionId: null, priority: 3 },
  { id: "cm2-anglais-oral", grade: "cm2", subject: "anglais", label: "Anglais — Oral A1+ thèmes quotidiens", missionId: null, priority: 3 },
  { id: "cm1-anglais-oral", grade: "cm1", subject: "anglais", label: "Anglais — Oral thèmes soi classe", missionId: null, priority: 3 },
  { id: "ce2-anglais-oral", grade: "ce2", subject: "anglais", label: "Anglais — Oral A1", missionId: null, priority: 3 },
  { id: "ce1-anglais-oral", grade: "ce1", subject: "anglais", label: "Anglais — Oral A1", missionId: null, priority: 3 },
  { id: "cp-anglais-oral", grade: "cp", subject: "anglais", label: "Anglais — Éveil oral A1", missionId: null, priority: 3 },
];

export function listThemesFor(grade?: GradeLevel | null, subject?: SubjectSlug | null): ProgrammeTheme[] {
  return PROGRAMME_THEMES.filter((item) => {
    if (grade && item.grade !== grade) return false;
    if (subject && item.subject !== subject) return false;
    return true;
  });
}

export function themeById(id: string): ProgrammeTheme | null {
  return PROGRAMME_THEMES.find((item) => item.id === id) ?? null;
}

