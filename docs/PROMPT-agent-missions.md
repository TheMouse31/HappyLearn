# Prompt agent — Fabrication des missions Happy Learn

> **État septembre 2026 :** Phase&nbsp;A terminée (**79/79** thèmes `done` —
> une mission standard `…-01` par thème). Ce prompt sert désormais surtout à la
> **Phase&nbsp;B** (variantes `…-facile-01` / `…-difficile-01`) ou à des thèmes ajoutés.

Copie-colle ce prompt à un autre agent Cursor (ou Cloud Agent) pour qu’il produise les missions.

---

## Prompt à coller

```text
Tu travailles sur le dépôt Happy Learn (app React/Vite/TS).

## Objectif

Créer **toutes les missions pédagogiques** du catalogue, à raison de **1 mission par thème** pour l’instant (difficulté « standard » uniquement).

Chaque mission doit suivre **la même trame** (structure d’étapes), déclinée au thème (classe × matière × notion).

Tu dois aussi **tenir à jour le document de suivi** pour savoir quels thèmes sont traités.

## Documents de référence (lire avant de coder)

1. `docs/PROMPT-agent-missions.md` — ce fichier (contrat + trame + règles)
2. `docs/SUIVI-missions-themes.md` + `docs/SUIVI-missions-themes.csv` — tracking thèmes
3. `docs/Themes_Programme_Par_Classe_Matiere.pdf` (ou `.html`) — référentiel programme
4. `src/data/missions/CONTRACT.md` — IDs mission/étape
5. Mission modèle : `src/data/missions/cm2/maths/cm2-maths-fractions-01.ts`
6. Helpers : `src/data/missions/define.ts`, `ids.ts`, `index.ts`, `catalog.ts`
7. Types / kinds : `src/data/types.ts` (`StepKind`)
8. Moteur : `src/engine/missionEngine.ts` (ne brancher AUCUNE logique sur un id métier)

## Contrat d’identifiants (obligatoire)

- Mission ID : `{grade}-{subject}-{slug}-{nn}`
  - Ex. `cm2-maths-fractions-01`
  - `nn` = `01` pour la version **standard** (1re mission du thème)
- Étape slug local : `s01`, `s02`… (ou slugs stables type `intro`)
- Étape id canonique : `{missionId}/{slug}` via `defineMission` / `defineSteps`
- Fichier : `src/data/missions/{grade}/{subject}/{missionId}.ts`
- Enregistrer la mission dans `BUILTIN_MISSIONS` (`src/data/missions/index.ts`)

## Trame obligatoire (même squelette pour CHAQUE mission)

Toute mission builtin doit respecter cet ordre logique (les textes changent, la structure non) :

| # | Rôle | kind typique | Notes |
|---|------|--------------|-------|
| 1 | Tutoriel / prise en main interaction | `tutorial` ou `continue` + `text`/`number` | Apprendre le geste de réponse si besoin |
| 2 | Mise en action narrative | `continue` | 4 univers (football, rugby, equitation, espace) |
| 3 | Objectif narratif | `continue` | Idem |
| 4–9 | Cœur pédagogique (6 étapes max recommandées) | `number`, `text`, `choice`, `fraction-choice`, `simplify`… | Progression croissante ; `expected` + `distractors` si QCM |
| 10 | Application / décision | `choice` ou `direction` ou `number` | Réinvestissement |
| 11 | Victoire narrative | `continue` | |
| 12 | Ce que j’ai appris | `method` | Synthèse pédagogique (1 texte → 4 univers OK) |
| 13 | Bilan sans note | `bilan` | |
| 14 | Teaser prochaine mission | `teaser` | |

Règles de trame :
- Utiliser `defineMission({ ... steps })` et `allUniverses()` quand le texte est commun aux 4 univers.
- Pour le cœur pédagogique, préférer des copies **spécifiques par univers** si le contexte narratif change les nombres/objets, sinon `allUniverses`.
- `progress` = index pédagogique 0..N (pas lié à un ancien parcours fractions).
- `scene` : omettre pour les nouvelles missions (scène générique) sauf besoin explicite.
- Ne jamais hardcoder un `step.id` métier dans `missionEngine` / `UniverseScene`.
- Mode cahier + QCM : fournir `expected` et `distractors` dès qu’il y a une réponse.

## Difficultés (prévoir maintenant, implémenter en 2 temps)

### Phase A (maintenant)
- 1 mission / thème, difficulté **standard** uniquement (`nn = 01`).
- Dans le suivi, colonnes `difficulte_facile` / `difficulte_difficile` = `todo`.

### Phase B (ensuite, même trame)
Pour chaque thème déjà couvert en standard, créer 2 variantes :

| Difficulté | Mission ID | Ajustements |
|------------|------------|-------------|
| facile | `{grade}-{subject}-{slug}-facile-01` OU `{slug}` + champ dédié | Nombres plus petits, moins d’étapes cœur (4), indices plus directs, distracteurs plus éloignés |
| standard | `{grade}-{subject}-{slug}-01` | Trame complète actuelle |
| difficile | `{grade}-{subject}-{slug}-difficile-01` | Nombres plus riches, 1 étape cœur en plus ou deux-étapes, distracteurs proches, moins d’indices |

**Convention retenue pour Phase B :** suffixe dans le slug thématique :
- `…-{theme}-01` = standard
- `…-{theme}-facile-01` = facile
- `…-{theme}-difficile-01` = difficile

(Le parsing d’ID accepte déjà des slugs kebab multi-segments.)

Optionnel plus tard : ajouter `difficulty?: "facile" | "standard" | "difficile"` sur `MissionDef` + filtre catalogue.

## Périmètre thèmes

Travaille **uniquement** les lignes du fichier `docs/SUIVI-missions-themes.csv` dont `statut=todo`.

Ordre de priorité (sauf instruction contraire) :
1. CM2 maths (compléter les thèmes fractions non couverts, puis autres thèmes maths CM2)
2. CM1 maths
3. CE2 maths
4. CE1 maths
5. CM2 / CM1 français
6. Autres matières selon le CSV

La mission `cm2-maths-fractions-01` existe déjà : marque-la `done` si ce n’est pas déjà fait, et **ne la recrée pas**.

## Definition of Done pour CHAQUE mission

1. Fichier TS créé via `defineMission`
2. Ajoutée à `BUILTIN_MISSIONS` dans `index.ts`
3. `npm run build` OK
4. Ligne correspondante mise à jour dans `docs/SUIVI-missions-themes.csv` **et** `.md` :
   - `statut=done`
   - `mission_id=…`
   - `fichier=…`
   - `updated_at=YYYY-MM-DD`
5. Commit atomique : `Add mission {mission_id}` + update suivi
6. Pas de régression sur fractions CM2

## Méthode de travail

- Traite les thèmes **par lots de 1 à 3 missions max** par itération (qualité > quantité).
- Après chaque lot : build + commit + push sur une branche `cursor/missions-{sujet}-6a74`.
- Mets à jour le suivi **à chaque mission**, pas à la fin.
- Si un thème du CSV est trop large pour une seule mission, découpe-le en sous-thèmes **dans le CSV** (nouvelles lignes) avant de coder, et documente pourquoi.
- N’édite pas les plans `.plan.md` utilisateur.
- Ne crée pas de PDF docs sauf demande ; le suivi CSV/MD suffit.

## Qualité pédagogique

- Alignement programme officiel FR (voir PDF thèmes) : niveau de classe crédible.
- Énoncés clairs, français correct, indices utiles sans spoiler total.
- Pas de notes / classement ; bilan sans note.
- Univers : football, rugby, équitation, espace — ton Happy Learn (aventure, encouragement).

## Livrable attendu en fin de run

- Missions TS ajoutées
- `BUILTIN_MISSIONS` à jour
- `docs/SUIVI-missions-themes.csv` + `.md` à jour (compteur done/todo)
- Résumé : thèmes traités, thèmes restants, blocages éventuels
```

---

## Notes pour toi (humain)

- Le suivi est dans `docs/SUIVI-missions-themes.csv` (machine) et `docs/SUIVI-missions-themes.md` (lisible).
- La trame détaillée est aussi dans `docs/TRAME-mission-type.md`.
- Phase B (3 difficultés) se déclenche quand la couverture standard d’une matière/classe est solide.
