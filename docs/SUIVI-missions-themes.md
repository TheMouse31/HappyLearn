# Suivi des missions par thème

Document de pilotage éditorial Happy Learn. Source machine : [`SUIVI-missions-themes.csv`](./SUIVI-missions-themes.csv).

Prompt agent : [`PROMPT-agent-missions.md`](./PROMPT-agent-missions.md) · Trame : [`TRAME-mission-type.md`](./TRAME-mission-type.md)

## Tableau de bord

| Indicateur | Valeur |
|---|---|
| Thèmes au total | **79** |
| Traités (`done`) | **1** |
| À faire (`todo`) | **78** |
| En cours (`in_progress`) | **0** |
| Couverture standard | 1/79 |

### Par priorité

| Priorité | Nombre |
|---|---|
| 1 | 16 |
| 2 | 37 |
| 3 | 26 |

### Par classe

| Classe | Thèmes | Dont done |
|---|---|---|
| CP | 10 | 0 |
| CE1 | 11 | 0 |
| CE2 | 14 | 0 |
| CM1 | 17 | 0 |
| CM2 | 27 | 1 |

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

## Backlog (todo) — priorité 1

| ID | Classe | Matière | Thème |
|---|---|---|---|
| `cm2-maths-fractions-nombres` | cm2 | maths | Fractions — nombres (>1 droite graduée encadrement) |
| `cm2-maths-fractions-operations` | cm2 | maths | Fractions — comparer additionner soustraire |
| `cm2-maths-decimaux` | cm2 | maths | Nombres décimaux (jusqu'aux millièmes) |
| `cm1-maths-fractions` | cm1 | maths | Fractions (dénominateur ≤20 opérateur unitaire) |
| `cm1-maths-decimaux` | cm1 | maths | Nombres décimaux (centièmes) |
| `ce2-maths-fractions` | ce2 | maths | Fractions d'unité / égalités (dén. ≤12) |
| `ce1-maths-fractions` | ce1 | maths | Fractions partie d'un tout |
| `cp-maths-entiers` | cp | maths | Nombres entiers jusqu'à 100 |
| `cp-maths-addition` | cp | maths | Addition et premiers problèmes |
| `cm2-francais-lecture` | cm2 | francais | Lecture et compréhension |
| `cm1-francais-lecture` | cm1 | francais | Lecture et compréhension |
| `ce2-francais-lecture` | ce2 | francais | Lecture fluide et compréhension |
| `ce1-francais-lecture` | ce1 | francais | Lecture automatisation compréhension |
| `cp-francais-lecture` | cp | francais | Décodage lecture à voix haute |
| `cp-francais-ecriture` | cp | francais | Geste cursif copie premières phrases |

## Backlog — priorités 2 et 3

<details><summary>Afficher la liste complète</summary>

| Prio | ID | Classe | Matière | Thème |
|---|---|---|---|---|
| 2 | `cm2-maths-entiers` | cm2 | maths | Nombres entiers (grands nombres) |
| 2 | `cm2-maths-calcul-mental` | cm2 | maths | Calcul mental et automatismes |
| 2 | `cm2-maths-problemes` | cm2 | maths | Résolution de problèmes (structures variées) |
| 2 | `cm2-maths-proportionnalite` | cm2 | maths | Proportionnalité (linéarité sans produit en croix) |
| 2 | `cm2-maths-grandeurs` | cm2 | maths | Grandeurs et mesures (durées angles aires) |
| 2 | `cm2-maths-geometrie` | cm2 | maths | Espace et géométrie (figures symétrie) |
| 3 | `cm2-maths-donnees` | cm2 | maths | Organisation des données et probabilités |
| 3 | `cm2-maths-algebre` | cm2 | maths | Initiation pensée algébrique |
| 2 | `cm1-maths-entiers` | cm1 | maths | Nombres entiers jusqu'à 999 999 |
| 2 | `cm1-maths-problemes` | cm1 | maths | Résolution de problèmes |
| 2 | `cm1-maths-grandeurs` | cm1 | maths | Grandeurs et mesures |
| 2 | `cm1-maths-geometrie` | cm1 | maths | Espace et géométrie |
| 3 | `cm1-maths-donnees` | cm1 | maths | Données et probabilités (vocabulaire) |
| 2 | `ce2-maths-entiers` | ce2 | maths | Nombres entiers jusqu'à 10 000 |
| 2 | `ce2-maths-operations` | ce2 | maths | Multiplication posée et division |
| 2 | `ce2-maths-problemes` | ce2 | maths | Problèmes 2–3 étapes |
| 2 | `ce2-maths-grandeurs` | ce2 | maths | Grandeurs (périmètre contenances durées) |
| 3 | `ce2-maths-geometrie` | ce2 | maths | Géométrie (losange symétrie patron) |
| 2 | `ce1-maths-entiers` | ce1 | maths | Nombres entiers jusqu'à 1 000 |
| 2 | `ce1-maths-operations` | ce1 | maths | Soustraction et sens des opérations |
| 2 | `ce1-maths-problemes` | ce1 | maths | Problèmes 1–2 étapes |
| 3 | `ce1-maths-grandeurs` | ce1 | maths | Grandeurs (km masses monnaie centimes) |
| 2 | `cp-maths-grandeurs` | cp | maths | Longueurs monnaie heure entière |
| 3 | `cp-maths-geometrie` | cp | maths | Formes solides repérage spatial |
| 2 | `cm2-francais-ecriture` | cm2 | francais | Écriture et réécriture |
| 2 | `cm2-francais-langue` | cm2 | francais | Étude de la langue (grammaire orthographe) |
| 3 | `cm2-francais-vocabulaire` | cm2 | francais | Vocabulaire et oral |
| 2 | `cm1-francais-ecriture` | cm1 | francais | Écriture |
| 2 | `cm1-francais-langue` | cm1 | francais | Étude de la langue |
| 2 | `ce2-francais-ecriture` | ce2 | francais | Production d'écrits |
| 2 | `ce1-francais-ecriture` | ce1 | francais | Écriture phrases et textes courts |
| 2 | `cm2-histoire-republique` | cm2 | histoire-geo | Histoire — Le temps de la République |
| 3 | `cm2-histoire-industriel` | cm2 | histoire-geo | Histoire — L'âge industriel |
| 3 | `cm2-histoire-guerres-ue` | cm2 | histoire-geo | Histoire — Guerres mondiales à l'UE |
| 2 | `cm2-geo-deplacer` | cm2 | histoire-geo | Géographie — Se déplacer |
| 3 | `cm2-geo-communiquer` | cm2 | histoire-geo | Géographie — Communiquer (internet) |
| 3 | `cm2-geo-habiter` | cm2 | histoire-geo | Géographie — Mieux habiter |
| 2 | `cm1-histoire-avant-france` | cm1 | histoire-geo | Histoire — Et avant la France |
| 3 | `cm1-histoire-rois` | cm1 | histoire-geo | Histoire — Le temps des rois |
| 3 | `cm1-histoire-revolution` | cm1 | histoire-geo | Histoire — Révolution et Empire |
| 2 | `cm2-sciences-matiere` | cm2 | sciences | Sciences — Matière |
| 2 | `cm2-sciences-vivant` | cm2 | sciences | Sciences — Vivant |
| 3 | `cm2-sciences-energie` | cm2 | sciences | Sciences — Énergie / objets techniques |
| 2 | `cm1-sciences-matiere` | cm1 | sciences | Sciences — Matière |
| 2 | `cm1-sciences-vivant` | cm1 | sciences | Sciences — Vivant |
| 2 | `ce2-qdm-vivant` | ce2 | questionner-le-monde | Questionner le monde — Vivant |
| 2 | `ce2-qdm-matiere` | ce2 | questionner-le-monde | Questionner le monde — Matière |
| 3 | `ce2-qdm-objets` | ce2 | questionner-le-monde | Questionner le monde — Objets techniques |
| 3 | `ce2-qdm-espace-temps` | ce2 | questionner-le-monde | Questionner le monde — Espace et temps |
| 2 | `ce1-qdm-vivant` | ce1 | questionner-le-monde | Questionner le monde — Vivant |
| 3 | `ce1-qdm-matiere-objets` | ce1 | questionner-le-monde | Questionner le monde — Matière et objets |
| 2 | `cp-qdm-vivant-matiere` | cp | questionner-le-monde | Questionner le monde — Vivant matière objets |
| 3 | `cp-qdm-espace-temps` | cp | questionner-le-monde | Questionner le monde — Espace et temps |
| 2 | `cm2-emc-vivre-ensemble` | cm2 | emc | EMC — Règle droit jugement engagement |
| 2 | `cm1-emc-vivre-ensemble` | cm1 | emc | EMC — Sensibilité règle engagement |
| 3 | `ce2-emc-vivre-ensemble` | ce2 | emc | EMC — Vivre ensemble |
| 3 | `ce1-emc-vivre-ensemble` | ce1 | emc | EMC — Vivre ensemble |
| 3 | `cp-emc-vivre-ensemble` | cp | emc | EMC — Émotions règles coopération |
| 3 | `cm2-anglais-oral` | cm2 | anglais | Anglais — Oral A1+ thèmes quotidiens |
| 3 | `cm1-anglais-oral` | cm1 | anglais | Anglais — Oral thèmes soi classe |
| 3 | `ce2-anglais-oral` | ce2 | anglais | Anglais — Oral A1 |
| 3 | `ce1-anglais-oral` | ce1 | anglais | Anglais — Oral A1 |
| 3 | `cp-anglais-oral` | cp | anglais | Anglais — Éveil oral A1 |

</details>

## Comment mettre à jour

1. Passer `statut` à `in_progress` quand tu commences un thème.
2. À la fin : `statut=done`, renseigner `mission_id`, `fichier`, `updated_at`.
3. Phase B : passer `difficulte_facile` / `difficulte_difficile` à `done` quand les variantes existent.
4. Resynchroniser ce `.md` (compteurs) après modification du CSV — ou laisser l’agent le régénérer.

