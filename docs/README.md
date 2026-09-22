# Documentation Happy Learn

Index des documents du dossier `docs/`.

## Documents utilisateurs (HTML → PDF)

| Source HTML | PDF | Rôle |
|-------------|-----|------|
| `HappyLearn-Documentation.html` | `HappyLearn-Documentation.pdf` (+ alias `HappyLearn_Documentation_Complete.pdf`) | Produit & technique |
| `HappyLearn-Guide-Utilisateur.html` | `HappyLearn_Guide_Utilisateur.pdf` (+ alias `Guide_Utilisateur_HappyLearn.pdf`) | Guide enseignant / admin / élève |
| `HappyLearn-Themes-Par-Classe-Matiere.html` | `HappyLearn_Themes_Par_Classe_Matiere.pdf` (+ alias `Themes_Programme_Par_Classe_Matiere.pdf`) | Thèmes programme |

Régénération : `node scripts/generate-docs-pdf.mjs`  
Captures : `docs/pdf-assets/` (uniquement les images référencées par les HTML).

## Référentiels missions

| Fichier | Rôle |
|---------|------|
| `PROMPT-agent-missions.md` | Prompt pour fabriquer / mettre à jour les missions |
| `TRAME-mission-type.md` | Structure type d’une mission |
| `SUIVI-missions-themes.md` + `.csv` | Suivi éditorial thèmes Phase A/B |
| `../src/data/missions/CONTRACT.md` | IDs + kinds d’étapes standardisés |

## Archive

`docs/archive/` — documents historiques (spécif. sessions live, checklist fractions PARCOURS-8). Ne plus les traiter comme source de vérité produit.
