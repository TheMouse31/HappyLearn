# Happy Learn

Apprentissages du CP au CM2, racontés comme une mission. Application web React (Vite).

Le catalogue couvre **toutes les matières du primaire**. **79 missions officielles** (une par thème du programme, Phase A) sont jouables ; les **27 couples niveau × matière** du primaire sont ouverts. Les enseignants peuvent aussi créer et publier leurs propres missions.

**Démo en ligne :** [https://happy-learn.pages.dev](https://happy-learn.pages.dev)

**Documentation :**
- **Prompt agent (fabriquer les missions)** : [`docs/PROMPT-agent-missions.md`](./docs/PROMPT-agent-missions.md)
- **Suivi thèmes / missions** : [`docs/SUIVI-missions-themes.md`](./docs/SUIVI-missions-themes.md) · CSV [`docs/SUIVI-missions-themes.csv`](./docs/SUIVI-missions-themes.csv)
- **Trame type** : [`docs/TRAME-mission-type.md`](./docs/TRAME-mission-type.md)
- **Thèmes du programme par classe × matière (PDF)** : [`docs/Themes_Programme_Par_Classe_Matiere.pdf`](./docs/Themes_Programme_Par_Classe_Matiere.pdf)
- **Guide utilisateur (PDF)** : [`docs/HappyLearn_Guide_Utilisateur.pdf`](./docs/HappyLearn_Guide_Utilisateur.pdf)
- **Documentation produit & technique (PDF)** : [`docs/HappyLearn_Documentation_Complete.pdf`](./docs/HappyLearn_Documentation_Complete.pdf)
- **Plan sessions live** : [`docs/PLAN-sessions-classe-live.md`](./docs/PLAN-sessions-classe-live.md)

Le prototype HTML du dossier voisin `mini-produit` est la spécification produit. Ce dépôt est le logiciel.

## Lancer en local

```bash
cd mission-maths
npm install
npm run dev
```

Ouvre l’URL Vite (souvent `http://localhost:5173`).

Sans fichier `.env.local`, l’app utilise un adaptateur **localStorage** avec la même interface que Supabase. Le parcours enfant est jouable hors ligne. L’espace enseignant existe aussi en local (e-mail comme identifiant d’appareil, sans mot de passe).

## Variables d’environnement

Copier `.env.example` vers `.env.local` :

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Ne jamais committer `.env.local`.

Quand ces deux variables sont présentes, sessions, réponses et collection partent vers Supabase. Sinon, même code, stockage navigateur.

Pour un build Pages, les mêmes variables doivent être définies **au moment du build** (`VITE_*` sont injectées par Vite).

## Supabase

Projet actuel branché : migrations `supabase/migrations/` + `supabase/seed.sql` déjà appliquées.

1. Créer un projet (si besoin).
2. Exécuter dans l’ordre : `20260915_init.sql`, `20260915_classes_enseignants.sql`, `20260915_happy_learn_course.sql`, `20260917_eleves_classe.sql`, `20260918_sessions_classe_live.sql`, `20260920_missions_catalog.sql`, `20260921_classe_programme_couverture.sql`, puis `seed.sql` (ou `scripts/run-supabase-migrations.mjs` avec un access token).
3. Storage (plus tard) : bucket public `neo` pour les visuels webp. En local / Pages, les fichiers sont dans `public/neo/`.
4. Authentication
   - **Élèves** : pas de compte e-mail. Sans code : prénom libre. Avec code classe / session : choix du prénom dans la liste saisie par le professeur.
   - **Professeurs** : inscription libre (e-mail + mot de passe) ou lien magique. Self-signup ouvert, confirmation e-mail désactivée pour les tests.
   - **URL Configuration** (déjà en place pour la démo) :
     - Site URL : `https://happy-learn.pages.dev`
     - Redirect allow-list : `http://localhost:5173/**`, `http://127.0.0.1:5173/**`, `https://happy-learn.pages.dev/**`, `https://*.happy-learn.pages.dev/**`

Politiques RLS MVP : lecture publique de `univers` et `etapes` ; écriture ouverte sur `sessions_enfant`, `reponses` et `collection` via la clé anon. À resserrer après les premiers tests en classe.

## Cloudflare Pages

**URL de production :** https://happy-learn.pages.dev

Build :

```bash
# avec .env.local chargé, ou variables exportées
npm run build
```

Sortie : `dist/`. Fallback SPA : `public/_redirects` (`/* /index.html 200`).

Déploiement :

```bash
npx wrangler login
npx wrangler pages deploy dist --project-name happy-learn
```

`wrangler.toml` : projet `happy-learn`, `pages_build_output_dir = "dist"`.

## Connexion (écoles et particuliers)

La page d’accueil `/` présente Happy Learn. La connexion est sur `/connexion` (élève ou professeur).

- **Élève** : `/connexion/eleve` — sans code : prénom libre. Avec code classe / session : sélection du prénom dans la liste du professeur.
- **Professeur** : `/connexion/enseignant` — e-mail + mot de passe, ou lien magique. Crée des classes, gère la liste d’élèves, partage un code.

### Espace enseignant

- **Suivi de classe** (plein écran) : modes Élèves / Séances / Programme ; sélecteur de classe en popup.
- **Couverture du programme** : pour chaque thème, marque *App* (fait dans Happy Learn) et *En classe* (traité hors app).
- **Pilotage de session live** : code du jour, présence, lancement d’activité.
- **Créateur de missions** : missions multi-matières publiables.
- Stats et journal **sans note ni classement**.

## Sessions live

Le professeur lance une session éphémère (code à 6 caractères). Les élèves rejoignent, attendent en salle d’attente, puis jouent la mission poussée. Navigation verrouillée pendant le live. Arrêt d’activité → retour salle d’attente.

## Interface & accessibilité

- Bascule **Classic / NewFront** dans la barre (préférence `happy-learn-skin`).
  NewFront : home plein écran sans scroll, typo Fraunces + Plus Jakarta Sans.
- Bouton **Écouter** dans la topbar : lecture à voix haute (cliquer pour arrêter).
- Bouton **Couleurs** : panneau avec
  - **Mode daltonien** (deutéranopie, pastilles à motifs) — `happy-learn-colorblind`
  - **Couleur du site** (pastilles + color picker) — accents / boutons / hero — `happy-learn-theme-color`
- `lang=fr`, `aria-live`, respect de `prefers-reduced-motion`.

## Parcours enfant

Connexion élève → A00 accueil → `/classe` (niveau + matière) → A02 présentation → A03 univers → A04 cahier ou QCM → A05 confirmation → mission → A06 récompense.

A01 (changer de prénom) reste accessible depuis l’accueil **seulement sans code classe**.

Exemple historique (fractions CM2, checklist `docs/PARCOURS-8.md`) : 10 étapes nombres / fractions / bilan. Quitter une mission = retour sans étoile.

## Fait

- SPA Vite + React + TypeScript strict + React Router
- Page de connexion élèves / professeurs
- Catalogue CP–CM2 × matières du primaire (**79** missions officielles Phase A, **27** offres de cours ouvertes)
- Écrans A00–A06 et mission sans iframe
- Moteur unique, 4 univers, modes cahier et QCM
- Distrateurs QCM construits, ordre mélangé
- Indices avec Néo, pouce après une bonne réponse, applaudissement en fin de mission
- Visuels Néo en webp (`public/neo/`)
- Collection + traces localStorage / Supabase
- Plusieurs classes par enseignant, roster prénom + nom
- Suivi de classe plein écran (Élèves / Séances / Programme) + popup classes
- Couverture programme (App + En classe) par classe
- Sessions de classe live (Realtime)
- Créateur de missions multi-matières
- Mode daltonien + teinte personnalisable (panneau Couleurs) + lecture à voix haute (topbar)
- Bascule d’interface Classic / NewFront
- Supabase Auth + migrations + seed
- Déploiement Cloudflare Pages (`happy-learn.pages.dev`)

## Reste

- Reserrer les politiques RLS (écriture des séances encore large)
- Export CSV / PDF des traces
- Suite e2e complète des parcours
- Phase B : variantes facile / difficile par thème
- Uploader `public/neo/` vers Storage si besoin
- Domaine custom Cloudflare / SSO ENT

## Régénérer les PDF de documentation

Sources HTML : `docs/HappyLearn-Documentation.html`, `docs/HappyLearn-Guide-Utilisateur.html`, `docs/HappyLearn-Themes-Par-Classe-Matiere.html`.

```bash
node scripts/generate-docs-pdf.mjs
```

Produit les PDF, les alias français, et les HTML offline (images embarquées).
