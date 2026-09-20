import type { GradeLevel, MissionDef, SubjectSlug } from "../types";
import { mission as cm2_maths_fractions_01 } from "./cm2/maths/cm2-maths-fractions-01";
import { mission as cm2_maths_fractions_nombres_01 } from "./cm2/maths/cm2-maths-fractions-nombres-01";
import { mission as cm2_maths_fractions_operations_01 } from "./cm2/maths/cm2-maths-fractions-operations-01";
import { mission as cm2_maths_decimaux_01 } from "./cm2/maths/cm2-maths-decimaux-01";
import { mission as cm2_maths_entiers_01 } from "./cm2/maths/cm2-maths-entiers-01";
import { mission as cm2_maths_calcul_mental_01 } from "./cm2/maths/cm2-maths-calcul-mental-01";
import { mission as cm2_maths_problemes_01 } from "./cm2/maths/cm2-maths-problemes-01";
import { mission as cm2_maths_proportionnalite_01 } from "./cm2/maths/cm2-maths-proportionnalite-01";
import { mission as cm2_maths_grandeurs_01 } from "./cm2/maths/cm2-maths-grandeurs-01";
import { mission as cm2_maths_geometrie_01 } from "./cm2/maths/cm2-maths-geometrie-01";
import { mission as cm2_maths_donnees_01 } from "./cm2/maths/cm2-maths-donnees-01";
import { mission as cm2_maths_algebre_01 } from "./cm2/maths/cm2-maths-algebre-01";
import { mission as cm1_maths_fractions_01 } from "./cm1/maths/cm1-maths-fractions-01";
import { mission as cm1_maths_decimaux_01 } from "./cm1/maths/cm1-maths-decimaux-01";
import { mission as cm1_maths_entiers_01 } from "./cm1/maths/cm1-maths-entiers-01";
import { mission as cm1_maths_problemes_01 } from "./cm1/maths/cm1-maths-problemes-01";
import { mission as cm1_maths_grandeurs_01 } from "./cm1/maths/cm1-maths-grandeurs-01";
import { mission as cm1_maths_geometrie_01 } from "./cm1/maths/cm1-maths-geometrie-01";
import { mission as cm1_maths_donnees_01 } from "./cm1/maths/cm1-maths-donnees-01";
import { mission as ce2_maths_fractions_01 } from "./ce2/maths/ce2-maths-fractions-01";
import { mission as ce2_maths_entiers_01 } from "./ce2/maths/ce2-maths-entiers-01";
import { mission as ce2_maths_operations_01 } from "./ce2/maths/ce2-maths-operations-01";
import { mission as ce2_maths_problemes_01 } from "./ce2/maths/ce2-maths-problemes-01";
import { mission as ce2_maths_grandeurs_01 } from "./ce2/maths/ce2-maths-grandeurs-01";
import { mission as ce2_maths_geometrie_01 } from "./ce2/maths/ce2-maths-geometrie-01";
import { mission as ce1_maths_fractions_01 } from "./ce1/maths/ce1-maths-fractions-01";
import { mission as ce1_maths_entiers_01 } from "./ce1/maths/ce1-maths-entiers-01";
import { mission as ce1_maths_operations_01 } from "./ce1/maths/ce1-maths-operations-01";
import { mission as ce1_maths_problemes_01 } from "./ce1/maths/ce1-maths-problemes-01";
import { mission as ce1_maths_grandeurs_01 } from "./ce1/maths/ce1-maths-grandeurs-01";
import { mission as cp_maths_entiers_01 } from "./cp/maths/cp-maths-entiers-01";
import { mission as cp_maths_addition_01 } from "./cp/maths/cp-maths-addition-01";
import { mission as cp_maths_grandeurs_01 } from "./cp/maths/cp-maths-grandeurs-01";
import { mission as cp_maths_geometrie_01 } from "./cp/maths/cp-maths-geometrie-01";
import { mission as cm2_francais_lecture_01 } from "./cm2/francais/cm2-francais-lecture-01";
import { mission as cm2_francais_ecriture_01 } from "./cm2/francais/cm2-francais-ecriture-01";
import { mission as cm2_francais_langue_01 } from "./cm2/francais/cm2-francais-langue-01";
import { mission as cm2_francais_vocabulaire_01 } from "./cm2/francais/cm2-francais-vocabulaire-01";
import { mission as cm1_francais_lecture_01 } from "./cm1/francais/cm1-francais-lecture-01";
import { mission as cm1_francais_ecriture_01 } from "./cm1/francais/cm1-francais-ecriture-01";
import { mission as cm1_francais_langue_01 } from "./cm1/francais/cm1-francais-langue-01";
import { mission as ce2_francais_lecture_01 } from "./ce2/francais/ce2-francais-lecture-01";
import { mission as ce2_francais_ecriture_01 } from "./ce2/francais/ce2-francais-ecriture-01";
import { mission as ce1_francais_lecture_01 } from "./ce1/francais/ce1-francais-lecture-01";
import { mission as ce1_francais_ecriture_01 } from "./ce1/francais/ce1-francais-ecriture-01";
import { mission as cp_francais_lecture_01 } from "./cp/francais/cp-francais-lecture-01";
import { mission as cp_francais_ecriture_01 } from "./cp/francais/cp-francais-ecriture-01";
import { mission as cm2_histoire_geo_histoire_republique_01 } from "./cm2/histoire-geo/cm2-histoire-geo-histoire-republique-01";
import { mission as cm2_histoire_geo_histoire_industriel_01 } from "./cm2/histoire-geo/cm2-histoire-geo-histoire-industriel-01";
import { mission as cm2_histoire_geo_histoire_guerres_ue_01 } from "./cm2/histoire-geo/cm2-histoire-geo-histoire-guerres-ue-01";
import { mission as cm2_histoire_geo_geo_deplacer_01 } from "./cm2/histoire-geo/cm2-histoire-geo-geo-deplacer-01";
import { mission as cm2_histoire_geo_geo_communiquer_01 } from "./cm2/histoire-geo/cm2-histoire-geo-geo-communiquer-01";
import { mission as cm2_histoire_geo_geo_habiter_01 } from "./cm2/histoire-geo/cm2-histoire-geo-geo-habiter-01";
import { mission as cm1_histoire_geo_histoire_avant_france_01 } from "./cm1/histoire-geo/cm1-histoire-geo-histoire-avant-france-01";
import { mission as cm1_histoire_geo_histoire_rois_01 } from "./cm1/histoire-geo/cm1-histoire-geo-histoire-rois-01";
import { mission as cm1_histoire_geo_histoire_revolution_01 } from "./cm1/histoire-geo/cm1-histoire-geo-histoire-revolution-01";
import { mission as cm2_sciences_matiere_01 } from "./cm2/sciences/cm2-sciences-matiere-01";
import { mission as cm2_sciences_vivant_01 } from "./cm2/sciences/cm2-sciences-vivant-01";
import { mission as cm2_sciences_energie_01 } from "./cm2/sciences/cm2-sciences-energie-01";
import { mission as cm1_sciences_matiere_01 } from "./cm1/sciences/cm1-sciences-matiere-01";
import { mission as cm1_sciences_vivant_01 } from "./cm1/sciences/cm1-sciences-vivant-01";
import { mission as ce2_questionner_le_monde_qdm_vivant_01 } from "./ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-vivant-01";
import { mission as ce2_questionner_le_monde_qdm_matiere_01 } from "./ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-matiere-01";
import { mission as ce2_questionner_le_monde_qdm_objets_01 } from "./ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-objets-01";
import { mission as ce2_questionner_le_monde_qdm_espace_temps_01 } from "./ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-espace-temps-01";
import { mission as ce1_questionner_le_monde_qdm_vivant_01 } from "./ce1/questionner-le-monde/ce1-questionner-le-monde-qdm-vivant-01";
import { mission as ce1_questionner_le_monde_qdm_matiere_objets_01 } from "./ce1/questionner-le-monde/ce1-questionner-le-monde-qdm-matiere-objets-01";
import { mission as cp_questionner_le_monde_qdm_vivant_matiere_01 } from "./cp/questionner-le-monde/cp-questionner-le-monde-qdm-vivant-matiere-01";
import { mission as cp_questionner_le_monde_qdm_espace_temps_01 } from "./cp/questionner-le-monde/cp-questionner-le-monde-qdm-espace-temps-01";
import { mission as cm2_emc_vivre_ensemble_01 } from "./cm2/emc/cm2-emc-vivre-ensemble-01";
import { mission as cm1_emc_vivre_ensemble_01 } from "./cm1/emc/cm1-emc-vivre-ensemble-01";
import { mission as ce2_emc_vivre_ensemble_01 } from "./ce2/emc/ce2-emc-vivre-ensemble-01";
import { mission as ce1_emc_vivre_ensemble_01 } from "./ce1/emc/ce1-emc-vivre-ensemble-01";
import { mission as cp_emc_vivre_ensemble_01 } from "./cp/emc/cp-emc-vivre-ensemble-01";
import { mission as cm2_anglais_oral_01 } from "./cm2/anglais/cm2-anglais-oral-01";
import { mission as cm1_anglais_oral_01 } from "./cm1/anglais/cm1-anglais-oral-01";
import { mission as ce2_anglais_oral_01 } from "./ce2/anglais/ce2-anglais-oral-01";
import { mission as ce1_anglais_oral_01 } from "./ce1/anglais/ce1-anglais-oral-01";
import { mission as cp_anglais_oral_01 } from "./cp/anglais/cp-anglais-oral-01";

/** Missions officielles embarquées (TypeScript). */
export const BUILTIN_MISSIONS: MissionDef[] = [
  cm2_maths_fractions_01,
  cm2_maths_fractions_nombres_01,
  cm2_maths_fractions_operations_01,
  cm2_maths_decimaux_01,
  cm2_maths_entiers_01,
  cm2_maths_calcul_mental_01,
  cm2_maths_problemes_01,
  cm2_maths_proportionnalite_01,
  cm2_maths_grandeurs_01,
  cm2_maths_geometrie_01,
  cm2_maths_donnees_01,
  cm2_maths_algebre_01,
  cm1_maths_fractions_01,
  cm1_maths_decimaux_01,
  cm1_maths_entiers_01,
  cm1_maths_problemes_01,
  cm1_maths_grandeurs_01,
  cm1_maths_geometrie_01,
  cm1_maths_donnees_01,
  ce2_maths_fractions_01,
  ce2_maths_entiers_01,
  ce2_maths_operations_01,
  ce2_maths_problemes_01,
  ce2_maths_grandeurs_01,
  ce2_maths_geometrie_01,
  ce1_maths_fractions_01,
  ce1_maths_entiers_01,
  ce1_maths_operations_01,
  ce1_maths_problemes_01,
  ce1_maths_grandeurs_01,
  cp_maths_entiers_01,
  cp_maths_addition_01,
  cp_maths_grandeurs_01,
  cp_maths_geometrie_01,
  cm2_francais_lecture_01,
  cm2_francais_ecriture_01,
  cm2_francais_langue_01,
  cm2_francais_vocabulaire_01,
  cm1_francais_lecture_01,
  cm1_francais_ecriture_01,
  cm1_francais_langue_01,
  ce2_francais_lecture_01,
  ce2_francais_ecriture_01,
  ce1_francais_lecture_01,
  ce1_francais_ecriture_01,
  cp_francais_lecture_01,
  cp_francais_ecriture_01,
  cm2_histoire_geo_histoire_republique_01,
  cm2_histoire_geo_histoire_industriel_01,
  cm2_histoire_geo_histoire_guerres_ue_01,
  cm2_histoire_geo_geo_deplacer_01,
  cm2_histoire_geo_geo_communiquer_01,
  cm2_histoire_geo_geo_habiter_01,
  cm1_histoire_geo_histoire_avant_france_01,
  cm1_histoire_geo_histoire_rois_01,
  cm1_histoire_geo_histoire_revolution_01,
  cm2_sciences_matiere_01,
  cm2_sciences_vivant_01,
  cm2_sciences_energie_01,
  cm1_sciences_matiere_01,
  cm1_sciences_vivant_01,
  ce2_questionner_le_monde_qdm_vivant_01,
  ce2_questionner_le_monde_qdm_matiere_01,
  ce2_questionner_le_monde_qdm_objets_01,
  ce2_questionner_le_monde_qdm_espace_temps_01,
  ce1_questionner_le_monde_qdm_vivant_01,
  ce1_questionner_le_monde_qdm_matiere_objets_01,
  cp_questionner_le_monde_qdm_vivant_matiere_01,
  cp_questionner_le_monde_qdm_espace_temps_01,
  cm2_emc_vivre_ensemble_01,
  cm1_emc_vivre_ensemble_01,
  ce2_emc_vivre_ensemble_01,
  ce1_emc_vivre_ensemble_01,
  cp_emc_vivre_ensemble_01,
  cm2_anglais_oral_01,
  cm1_anglais_oral_01,
  ce2_anglais_oral_01,
  ce1_anglais_oral_01,
  cp_anglais_oral_01,
];

/** @deprecated Utiliser BUILTIN_MISSIONS ou resolveMission. */
export const MISSIONS = BUILTIN_MISSIONS;

export function findBuiltinMission(id: string | null | undefined): MissionDef | null {
  if (!id) return null;
  return BUILTIN_MISSIONS.find((item) => item.id === id) ?? null;
}

export function listBuiltinMissions(
  grade?: GradeLevel | null,
  subject?: SubjectSlug | null,
): MissionDef[] {
  return BUILTIN_MISSIONS.filter((item) => {
    if (grade && item.grade !== grade) return false;
    if (subject && item.subject !== subject) return false;
    return true;
  });
}

export function defaultBuiltinMission(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {
  return listBuiltinMissions(grade, subject).find((item) => item.available) ?? null;
}

export function findMission(id: string | null | undefined): MissionDef | null {
  return findBuiltinMission(id);
}

export function listMissions(grade?: GradeLevel | null, subject?: SubjectSlug | null): MissionDef[] {
  return listBuiltinMissions(grade, subject);
}

export function defaultMissionFor(
  grade: GradeLevel | null,
  subject: SubjectSlug | null,
): MissionDef | null {
  return defaultBuiltinMission(grade, subject);
}

export {
  buildMissionId,
  isValidMissionId,
  isValidStepSlug,
  ordinalStepSlug,
  parseMissionId,
  parseStepId,
  stepId,
  stepSlugOf,
} from "./ids";
export { allUniverses, defineMission, defineSteps } from "./define";
export { BILAN_CHOICES, DIRECTION_LABELS } from "./labels";
export {
  deleteTeacherMission,
  EDITOR_KINDS,
  listEditableCatalog,
  listResolvedMissions,
  listTeacherMissions,
  resolveMission,
  saveTeacherMission,
  suggestNextMissionId,
} from "./catalog";
