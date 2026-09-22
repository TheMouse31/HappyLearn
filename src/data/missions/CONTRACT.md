# Contrat missions multi-matières

## Mission ID

Format : `{grade}-{subject}-{slug}-{nn}`

Exemples : `cm2-maths-fractions-01`, `ce1-francais-lecture-01`

- `grade` ∈ catalogue (`cp`…`cm2`)
- `subject` ∈ catalogue (`maths`, `francais`, …)
- `slug` : kebab-case, thème pédagogique (pas l’univers)
- `nn` : compteur `01`, `02`… (révisions / variantes)
- **Immutabilité** une fois publiée (clé stats / « déjà faite »)

Helpers : `buildMissionId`, `parseMissionId`, `isValidMissionId` dans `ids.ts`.

## Étape ID

| Couche | Format | Usage |
|--------|--------|--------|
| slug local | `s01`, `s02`, … | édition, ordre dans la mission |
| id canonique | `{missionId}/{stepSlug}` | réponses, analytics, logs |

Exemple : `cm2-maths-fractions-01/s01`

- Unicité du slug **dans** la mission ; unicité globale de l’id canonique
- Ordre = tableau `steps[]`
- Le moteur / les scènes ne se branchent **pas** sur le slug métier : utiliser `kind` et `scene`

Helpers : `stepId`, `parseStepId`, `ordinalStepSlug`, `sceneKeyOf`.

## Stockage

Une mission = un document `{ MissionDef + steps[] }` :

- TS embarqué : `src/data/missions/{grade}/{subject}/{id}.ts`
- DB : table `missions` (`steps` jsonb), `source` = `builtin` | `teacher`
- Catalogue unifié : `resolveMission` / `listResolvedMissions` (TS + DB)

Table legacy `etapes` : dépréciée pour le runtime.

## Kinds (primitives d’interaction)

Palette **standardisée pour toutes les matières** (studio + player) :

| Groupe | Kinds | Usage |
|--------|--------|--------|
| Parcours | `continue`, `method`, `bilan`, `teaser` | Narration, rappel, bilan soft, clôture |
| Réponses | `choice`, `text`, `blanks`, `number`, `audio` | QCM, texte libre, texte à trous (`___`), nombre, écoute TTS |
| Maths spécialisé | `tutorial`, `fraction-choice`, `simplify`, `direction` | Fractions / spatial (missions maths avancées) |

### Conventions studio

- **QCM (`choice`)** : `expected` + `distractors[]` (toujours en propositions).
- **Texte à trous (`blanks`)** : dans la consigne, `___` par trou ; réponses dans `expected` séparées par `|`.
- **Écoute (`audio`)** : TTS de la consigne. Sans `expected` = écoute seule ; avec `expected` (+ distracteurs optionnels) = compréhension orale.
- **Nombre (`number`)** : saisie numérique ; passe en QCM si le mode élève est QCM.
- Le créateur expose **tous** ces kinds pour **chaque** matière (pas de filtre sujet).

Le player ignore un kind inconnu (continue sans bloquer) — ne pas inventer de kinds hors liste.
