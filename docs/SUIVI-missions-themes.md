# Suivi des missions par thème

Document de pilotage éditorial Happy Learn. Source machine : [`SUIVI-missions-themes.csv`](./SUIVI-missions-themes.csv).

Prompt agent : [`PROMPT-agent-missions.md`](./PROMPT-agent-missions.md) · Trame : [`TRAME-mission-type.md`](./TRAME-mission-type.md)

## Tableau de bord

| Indicateur | Valeur |
|---|---|
| Thèmes au total | **79** |
| Traités (`done`) | **79** |
| À faire (`todo`) | **0** |
| En cours (`in_progress`) | **0** |
| Couverture standard | 79/79 |

### Par classe

| Classe | Thèmes | Dont done |
|---|---|---|
| CP | 10 | 10 |
| CE1 | 11 | 11 |
| CE2 | 14 | 14 |
| CM1 | 17 | 17 |
| CM2 | 27 | 27 |

## Légende des statuts

| Champ | Valeurs |
|---|---|
| `statut` | `todo` · `in_progress` · `done` · `blocked` |
| `difficulte_*` | `todo` · `done` · `na` |

**Phase A :** une mission standard (`…-01`) par thème.

**Phase B :** pour chaque thème `done`, créer `…-facile-01` et `…-difficile-01` (même trame).

## Thèmes traités

| Thème | Mission | Fichier | Facile | Difficile |
|---|---|---|---|---|
| Fractions — opérateur (fraction d'une quantité) | `cm2-maths-fractions-01` | `src/data/missions/cm2/maths/cm2-maths-fractions-01.ts` | todo | todo |
| Fractions — nombres (>1 droite graduée encadrement) | `cm2-maths-fractions-nombres-01` | `src/data/missions/cm2/maths/cm2-maths-fractions-nombres-01.ts` | todo | todo |
| Fractions — comparer additionner soustraire | `cm2-maths-fractions-operations-01` | `src/data/missions/cm2/maths/cm2-maths-fractions-operations-01.ts` | todo | todo |
| Nombres décimaux (jusqu'aux millièmes) | `cm2-maths-decimaux-01` | `src/data/missions/cm2/maths/cm2-maths-decimaux-01.ts` | todo | todo |
| Nombres entiers (grands nombres) | `cm2-maths-entiers-01` | `src/data/missions/cm2/maths/cm2-maths-entiers-01.ts` | todo | todo |
| Calcul mental et automatismes | `cm2-maths-calcul-mental-01` | `src/data/missions/cm2/maths/cm2-maths-calcul-mental-01.ts` | todo | todo |
| Résolution de problèmes (structures variées) | `cm2-maths-problemes-01` | `src/data/missions/cm2/maths/cm2-maths-problemes-01.ts` | todo | todo |
| Proportionnalité (linéarité sans produit en croix) | `cm2-maths-proportionnalite-01` | `src/data/missions/cm2/maths/cm2-maths-proportionnalite-01.ts` | todo | todo |
| Grandeurs et mesures (durées angles aires) | `cm2-maths-grandeurs-01` | `src/data/missions/cm2/maths/cm2-maths-grandeurs-01.ts` | todo | todo |
| Espace et géométrie (figures symétrie) | `cm2-maths-geometrie-01` | `src/data/missions/cm2/maths/cm2-maths-geometrie-01.ts` | todo | todo |
| Organisation des données et probabilités | `cm2-maths-donnees-01` | `src/data/missions/cm2/maths/cm2-maths-donnees-01.ts` | todo | todo |
| Initiation pensée algébrique | `cm2-maths-algebre-01` | `src/data/missions/cm2/maths/cm2-maths-algebre-01.ts` | todo | todo |
| Fractions (dénominateur ≤20 opérateur unitaire) | `cm1-maths-fractions-01` | `src/data/missions/cm1/maths/cm1-maths-fractions-01.ts` | todo | todo |
| Nombres décimaux (centièmes) | `cm1-maths-decimaux-01` | `src/data/missions/cm1/maths/cm1-maths-decimaux-01.ts` | todo | todo |
| Nombres entiers jusqu'à 999 999 | `cm1-maths-entiers-01` | `src/data/missions/cm1/maths/cm1-maths-entiers-01.ts` | todo | todo |
| Résolution de problèmes | `cm1-maths-problemes-01` | `src/data/missions/cm1/maths/cm1-maths-problemes-01.ts` | todo | todo |
| Grandeurs et mesures | `cm1-maths-grandeurs-01` | `src/data/missions/cm1/maths/cm1-maths-grandeurs-01.ts` | todo | todo |
| Espace et géométrie | `cm1-maths-geometrie-01` | `src/data/missions/cm1/maths/cm1-maths-geometrie-01.ts` | todo | todo |
| Données et probabilités (vocabulaire) | `cm1-maths-donnees-01` | `src/data/missions/cm1/maths/cm1-maths-donnees-01.ts` | todo | todo |
| Fractions d'unité / égalités (dén. ≤12) | `ce2-maths-fractions-01` | `src/data/missions/ce2/maths/ce2-maths-fractions-01.ts` | todo | todo |
| Nombres entiers jusqu'à 10 000 | `ce2-maths-entiers-01` | `src/data/missions/ce2/maths/ce2-maths-entiers-01.ts` | todo | todo |
| Multiplication posée et division | `ce2-maths-operations-01` | `src/data/missions/ce2/maths/ce2-maths-operations-01.ts` | todo | todo |
| Problèmes 2–3 étapes | `ce2-maths-problemes-01` | `src/data/missions/ce2/maths/ce2-maths-problemes-01.ts` | todo | todo |
| Grandeurs (périmètre contenances durées) | `ce2-maths-grandeurs-01` | `src/data/missions/ce2/maths/ce2-maths-grandeurs-01.ts` | todo | todo |
| Géométrie (losange symétrie patron) | `ce2-maths-geometrie-01` | `src/data/missions/ce2/maths/ce2-maths-geometrie-01.ts` | todo | todo |
| Fractions partie d'un tout | `ce1-maths-fractions-01` | `src/data/missions/ce1/maths/ce1-maths-fractions-01.ts` | todo | todo |
| Nombres entiers jusqu'à 1 000 | `ce1-maths-entiers-01` | `src/data/missions/ce1/maths/ce1-maths-entiers-01.ts` | todo | todo |
| Soustraction et sens des opérations | `ce1-maths-operations-01` | `src/data/missions/ce1/maths/ce1-maths-operations-01.ts` | todo | todo |
| Problèmes 1–2 étapes | `ce1-maths-problemes-01` | `src/data/missions/ce1/maths/ce1-maths-problemes-01.ts` | todo | todo |
| Grandeurs (km masses monnaie centimes) | `ce1-maths-grandeurs-01` | `src/data/missions/ce1/maths/ce1-maths-grandeurs-01.ts` | todo | todo |
| Nombres entiers jusqu'à 100 | `cp-maths-entiers-01` | `src/data/missions/cp/maths/cp-maths-entiers-01.ts` | todo | todo |
| Addition et premiers problèmes | `cp-maths-addition-01` | `src/data/missions/cp/maths/cp-maths-addition-01.ts` | todo | todo |
| Longueurs monnaie heure entière | `cp-maths-grandeurs-01` | `src/data/missions/cp/maths/cp-maths-grandeurs-01.ts` | todo | todo |
| Formes solides repérage spatial | `cp-maths-geometrie-01` | `src/data/missions/cp/maths/cp-maths-geometrie-01.ts` | todo | todo |
| Lecture et compréhension | `cm2-francais-lecture-01` | `src/data/missions/cm2/francais/cm2-francais-lecture-01.ts` | todo | todo |
| Écriture et réécriture | `cm2-francais-ecriture-01` | `src/data/missions/cm2/francais/cm2-francais-ecriture-01.ts` | todo | todo |
| Étude de la langue (grammaire orthographe) | `cm2-francais-langue-01` | `src/data/missions/cm2/francais/cm2-francais-langue-01.ts` | todo | todo |
| Vocabulaire et oral | `cm2-francais-vocabulaire-01` | `src/data/missions/cm2/francais/cm2-francais-vocabulaire-01.ts` | todo | todo |
| Lecture et compréhension | `cm1-francais-lecture-01` | `src/data/missions/cm1/francais/cm1-francais-lecture-01.ts` | todo | todo |
| Écriture | `cm1-francais-ecriture-01` | `src/data/missions/cm1/francais/cm1-francais-ecriture-01.ts` | todo | todo |
| Étude de la langue | `cm1-francais-langue-01` | `src/data/missions/cm1/francais/cm1-francais-langue-01.ts` | todo | todo |
| Lecture fluide et compréhension | `ce2-francais-lecture-01` | `src/data/missions/ce2/francais/ce2-francais-lecture-01.ts` | todo | todo |
| Production d'écrits | `ce2-francais-ecriture-01` | `src/data/missions/ce2/francais/ce2-francais-ecriture-01.ts` | todo | todo |
| Lecture automatisation compréhension | `ce1-francais-lecture-01` | `src/data/missions/ce1/francais/ce1-francais-lecture-01.ts` | todo | todo |
| Écriture phrases et textes courts | `ce1-francais-ecriture-01` | `src/data/missions/ce1/francais/ce1-francais-ecriture-01.ts` | todo | todo |
| Décodage lecture à voix haute | `cp-francais-lecture-01` | `src/data/missions/cp/francais/cp-francais-lecture-01.ts` | todo | todo |
| Geste cursif copie premières phrases | `cp-francais-ecriture-01` | `src/data/missions/cp/francais/cp-francais-ecriture-01.ts` | todo | todo |
| Histoire — Le temps de la République | `cm2-histoire-geo-histoire-republique-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-histoire-republique-01.ts` | todo | todo |
| Histoire — L'âge industriel | `cm2-histoire-geo-histoire-industriel-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-histoire-industriel-01.ts` | todo | todo |
| Histoire — Guerres mondiales à l'UE | `cm2-histoire-geo-histoire-guerres-ue-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-histoire-guerres-ue-01.ts` | todo | todo |
| Géographie — Se déplacer | `cm2-histoire-geo-geo-deplacer-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-geo-deplacer-01.ts` | todo | todo |
| Géographie — Communiquer (internet) | `cm2-histoire-geo-geo-communiquer-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-geo-communiquer-01.ts` | todo | todo |
| Géographie — Mieux habiter | `cm2-histoire-geo-geo-habiter-01` | `src/data/missions/cm2/histoire-geo/cm2-histoire-geo-geo-habiter-01.ts` | todo | todo |
| Histoire — Et avant la France | `cm1-histoire-geo-histoire-avant-france-01` | `src/data/missions/cm1/histoire-geo/cm1-histoire-geo-histoire-avant-france-01.ts` | todo | todo |
| Histoire — Le temps des rois | `cm1-histoire-geo-histoire-rois-01` | `src/data/missions/cm1/histoire-geo/cm1-histoire-geo-histoire-rois-01.ts` | todo | todo |
| Histoire — Révolution et Empire | `cm1-histoire-geo-histoire-revolution-01` | `src/data/missions/cm1/histoire-geo/cm1-histoire-geo-histoire-revolution-01.ts` | todo | todo |
| Sciences — Matière | `cm2-sciences-matiere-01` | `src/data/missions/cm2/sciences/cm2-sciences-matiere-01.ts` | todo | todo |
| Sciences — Vivant | `cm2-sciences-vivant-01` | `src/data/missions/cm2/sciences/cm2-sciences-vivant-01.ts` | todo | todo |
| Sciences — Énergie / objets techniques | `cm2-sciences-energie-01` | `src/data/missions/cm2/sciences/cm2-sciences-energie-01.ts` | todo | todo |
| Sciences — Matière | `cm1-sciences-matiere-01` | `src/data/missions/cm1/sciences/cm1-sciences-matiere-01.ts` | todo | todo |
| Sciences — Vivant | `cm1-sciences-vivant-01` | `src/data/missions/cm1/sciences/cm1-sciences-vivant-01.ts` | todo | todo |
| Questionner le monde — Vivant | `ce2-questionner-le-monde-qdm-vivant-01` | `src/data/missions/ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-vivant-01.ts` | todo | todo |
| Questionner le monde — Matière | `ce2-questionner-le-monde-qdm-matiere-01` | `src/data/missions/ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-matiere-01.ts` | todo | todo |
| Questionner le monde — Objets techniques | `ce2-questionner-le-monde-qdm-objets-01` | `src/data/missions/ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-objets-01.ts` | todo | todo |
| Questionner le monde — Espace et temps | `ce2-questionner-le-monde-qdm-espace-temps-01` | `src/data/missions/ce2/questionner-le-monde/ce2-questionner-le-monde-qdm-espace-temps-01.ts` | todo | todo |
| Questionner le monde — Vivant | `ce1-questionner-le-monde-qdm-vivant-01` | `src/data/missions/ce1/questionner-le-monde/ce1-questionner-le-monde-qdm-vivant-01.ts` | todo | todo |
| Questionner le monde — Matière et objets | `ce1-questionner-le-monde-qdm-matiere-objets-01` | `src/data/missions/ce1/questionner-le-monde/ce1-questionner-le-monde-qdm-matiere-objets-01.ts` | todo | todo |
| Questionner le monde — Vivant matière objets | `cp-questionner-le-monde-qdm-vivant-matiere-01` | `src/data/missions/cp/questionner-le-monde/cp-questionner-le-monde-qdm-vivant-matiere-01.ts` | todo | todo |
| Questionner le monde — Espace et temps | `cp-questionner-le-monde-qdm-espace-temps-01` | `src/data/missions/cp/questionner-le-monde/cp-questionner-le-monde-qdm-espace-temps-01.ts` | todo | todo |
| EMC — Règle droit jugement engagement | `cm2-emc-vivre-ensemble-01` | `src/data/missions/cm2/emc/cm2-emc-vivre-ensemble-01.ts` | todo | todo |
| EMC — Sensibilité règle engagement | `cm1-emc-vivre-ensemble-01` | `src/data/missions/cm1/emc/cm1-emc-vivre-ensemble-01.ts` | todo | todo |
| EMC — Vivre ensemble | `ce2-emc-vivre-ensemble-01` | `src/data/missions/ce2/emc/ce2-emc-vivre-ensemble-01.ts` | todo | todo |
| EMC — Vivre ensemble | `ce1-emc-vivre-ensemble-01` | `src/data/missions/ce1/emc/ce1-emc-vivre-ensemble-01.ts` | todo | todo |
| EMC — Émotions règles coopération | `cp-emc-vivre-ensemble-01` | `src/data/missions/cp/emc/cp-emc-vivre-ensemble-01.ts` | todo | todo |
| Anglais — Oral A1+ thèmes quotidiens | `cm2-anglais-oral-01` | `src/data/missions/cm2/anglais/cm2-anglais-oral-01.ts` | todo | todo |
| Anglais — Oral thèmes soi classe | `cm1-anglais-oral-01` | `src/data/missions/cm1/anglais/cm1-anglais-oral-01.ts` | todo | todo |
| Anglais — Oral A1 | `ce2-anglais-oral-01` | `src/data/missions/ce2/anglais/ce2-anglais-oral-01.ts` | todo | todo |
| Anglais — Oral A1 | `ce1-anglais-oral-01` | `src/data/missions/ce1/anglais/ce1-anglais-oral-01.ts` | todo | todo |
| Anglais — Éveil oral A1 | `cp-anglais-oral-01` | `src/data/missions/cp/anglais/cp-anglais-oral-01.ts` | todo | todo |

## Backlog

Tous les thèmes Phase A standard sont traités (`todo` = 0). Phase B (facile / difficile) reste ouverte.
