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

Transverses MVP : `continue`, `number`, `text`, `choice`, `method`, `bilan`, `teaser`  
Spécialisés maths : `fraction-choice`, `simplify`, `tutorial`, `direction`  
Le créateur n’expose que les kinds supportés par le player.
