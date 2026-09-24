import type { GradeLevel, SubjectSlug, UniverseSlug } from "./types";
import { UNIVERSES } from "./universes";

/** Offre de mission filtrée par compétence (maquette nav unique). */
export type MissionOffer = {
  missionId: string;
  universe: UniverseSlug;
  title: string;
  blurb: string;
  available: boolean;
};

export type CompetenceNav = {
  id: string;
  grade: GradeLevel;
  subject: SubjectSlug;
  /** Libellé court pour l’enfant. */
  label: string;
  hint: string;
  offers: MissionOffer[];
};

/**
 * Catalogue maquette : CM2 Maths, 2 compétences.
 * Les univers proposés changent selon la compétence (pas une grille fixe de 4).
 */
export const COMPETENCE_NAV: CompetenceNav[] = [
  {
    id: "cm2-maths-fractions-operateur",
    grade: "cm2",
    subject: "maths",
    label: "Fractions d’une quantité",
    hint: "Partager une équipe, une zone ou une réserve",
    offers: [
      {
        missionId: "cm2-maths-fractions-01",
        universe: "football",
        title: "Fractions sur le terrain",
        blurb: UNIVERSES.football.blurb,
        available: true,
      },
      {
        missionId: "cm2-maths-fractions-01",
        universe: "rugby",
        title: "Fractions dans la mêlée",
        blurb: UNIVERSES.rugby.blurb,
        available: true,
      },
      {
        missionId: "cm2-maths-fractions-01",
        universe: "equitation",
        title: "Fractions à l’écurie",
        blurb: UNIVERSES.equitation.blurb,
        available: true,
      },
    ],
  },
  {
    id: "cm2-maths-calcul-mental",
    grade: "cm2",
    subject: "maths",
    label: "Calcul mental",
    hint: "Séries rapides, stats et commandes",
    offers: [
      {
        missionId: "cm2-maths-calcul-mental-01",
        universe: "football",
        title: "Stats flash du match",
        blurb: UNIVERSES.football.blurb,
        available: false,
      },
      {
        missionId: "cm2-maths-calcul-mental-01",
        universe: "espace",
        title: "Commandes orbitales",
        blurb: UNIVERSES.espace.blurb,
        available: false,
      },
    ],
  },
];

export function listCompetencesForCourse(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): CompetenceNav[] {
  if (!grade || !subject) return [];
  return COMPETENCE_NAV.filter((c) => c.grade === grade && c.subject === subject);
}

export function findCompetence(id: string | null | undefined): CompetenceNav | null {
  if (!id) return null;
  return COMPETENCE_NAV.find((c) => c.id === id) ?? null;
}

export function findMissionOffer(
  competenceId: string | null | undefined,
  missionId: string | null | undefined,
  universe: UniverseSlug | null | undefined,
): MissionOffer | null {
  const competence = findCompetence(competenceId);
  if (!competence || !missionId || !universe) return null;
  return (
    competence.offers.find((o) => o.missionId === missionId && o.universe === universe) ?? null
  );
}

export function hasCompetenceNav(grade: GradeLevel | null, subject: SubjectSlug | null): boolean {
  return listCompetencesForCourse(grade, subject).length > 0;
}
