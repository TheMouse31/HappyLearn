# Trame type d’une mission Happy Learn

Toute mission builtin suit cette structure. Seuls changent : classe, matière, notions, nombres, textes, kinds du cœur pédagogique.

## Schéma

```text
[1] Tutoriel interaction
[2] Narratif — mise en action          (continue × 4 univers)
[3] Narratif — objectif                (continue × 4 univers)
[4..9] Cœur pédagogique (4 à 6 étapes) (number | text | choice | …)
[10] Application / décision
[11] Victoire narrative                (continue)
[12] Méthode — ce que j’ai appris      (method)
[13] Bilan sans note                   (bilan)
[14] Teaser                            (teaser)
```

## Gabarit TypeScript (à adapter)

```ts
import { defineMission, allUniverses } from "../../define";

export const MISSION_ID = "{grade}-{subject}-{slug}-01";

export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2", // cp | ce1 | ce2 | cm1 | cm2
  subject: "maths",
  title: "Titre élève",
  blurb: "Une phrase pour le catalogue / pilotage.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue", // ou tutorial / text / number
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "…",
        statement: "…",
        hint: "…",
        caption: "…",
      }),
    },
    {
      kind: "continue",
      kicker: "Mise en action",
      progress: 0,
      copy: {
        football: { title: "…", statement: "…", caption: "…" },
        rugby: { title: "…", statement: "…", caption: "…" },
        equitation: { title: "…", statement: "…", caption: "…" },
        espace: { title: "…", statement: "…", caption: "…" },
      },
    },
    // … objectif continue …
    // … 4–6 étapes cœur avec expected + distractors …
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais …",
        statement: "…",
        note: "…",
      }),
    },
    {
      kind: "bilan",
      kicker: "Bilan sans note",
      progress: 6,
      copy: allUniverses({
        title: "Ton bilan",
        statement: "Qu’as-tu réussi aujourd’hui ?",
      }),
    },
    {
      kind: "teaser",
      kicker: "Prochaine mission",
      progress: 6,
      copy: allUniverses({
        title: "Un nouveau défi t’attend",
        statement: "…",
        caption: "…",
      }),
    },
  ],
});
```

## Variantes de difficulté (Phase B)

| | Facile | Standard | Difficile |
|--|--------|----------|-----------|
| Étapes cœur | 4 | 5–6 | 6–7 |
| Nombres | petits, « beaux » | programme de la classe | limite haute du niveau |
| Distracteurs | éloignés | plausibles | très proches |
| Indices | plus directifs | normaux | minimaux |
| Chaînes 2 étapes | rare | 0–1 | 1–2 |
| ID | `…-{theme}-facile-01` | `…-{theme}-01` | `…-{theme}-difficile-01` |

## Checklist qualité

- [ ] ID valide (`parseMissionId`)
- [ ] Enregistrée dans `BUILTIN_MISSIONS`
- [ ] Jouable cahier + QCM (expected / distractors)
- [ ] 4 univers présents sur chaque step.copy
- [ ] Aucun hardcode d’id dans le moteur
- [ ] Ligne suivi CSV/MD mise à jour
