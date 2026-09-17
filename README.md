# Happy Learn

Apprentissages du CP au CM2, racontés comme une mission. Application web React (Vite). Le catalogue couvre **toutes les matières du primaire** ; pour l’instant, **seul le parcours mathématiques CM2** est jouable (fractions, quatre univers, modes cahier ou QCM).

**Démo en ligne :** [https://happy-learn.pages.dev](https://happy-learn.pages.dev)

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
2. Exécuter dans l’ordre : `20260915_init.sql`, `20260915_classes_enseignants.sql`, `20260915_happy_learn_course.sql`, `20260917_eleves_classe.sql`, puis `seed.sql` (ou `scripts/run-supabase-migrations.mjs` avec un access token).
3. Storage (plus tard) : bucket public `neo` pour les visuels webp. En local / Pages, les fichiers sont dans `public/neo/`.
4. Authentication
   - **Élèves** : pas de compte e-mail. Sans code : prénom libre. Avec code classe : choix du prénom dans la liste saisie par le professeur.
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

- **Élève** : `/connexion/eleve` — sans code : prénom libre. Avec code classe : sélection du prénom dans la liste du professeur.
- **Professeur** : `/connexion/enseignant` — e-mail + mot de passe, ou lien magique. Crée des classes, gère la liste d’élèves, partage un code. L’espace enseignant montre les stats par élève (séances, missions terminées, réussite aux réponses, univers gagnés) et le journal des séances, **sans note ni classement**.

## Parcours enfant

Connexion élève → A00 accueil → `/classe` (niveau + matière) → A02 présentation → A03 univers → A04 cahier ou QCM → A05 confirmation → mission → A06 récompense.

A01 (changer de prénom) reste accessible depuis l’accueil **seulement sans code classe**.

Séquence unique (nombres identiques) :

1. Écrire 3/4  
2. Moitié 6/12  
3. Simplifier 1/2  
4. 1/4 de 20 = 5  
5. 3/4 de 20 = 15  
6. 2/3 de 18 = 12  
7. 3/4 de 24 puis 1/3 de 18  
8. Complément 30 − 15 − 10 = 5  
9. Décision dans l’axe  
10. Méthode + bilan sans note  

Quitter une mission = retour sans étoile. Checklist : `docs/PARCOURS-8.md`.

## Fait

- SPA Vite + React + TypeScript strict + React Router
- Page de connexion élèves / professeurs
- Catalogue CP–CM2 + matières du primaire (jouable : CM2 maths)
- Écrans A00–A06 et mission sans iframe
- Moteur unique, 4 univers, modes cahier et QCM
- Distrateurs QCM construits, ordre mélangé
- Indices avec Néo habillé, pouce après une bonne réponse, applaudissement en fin de mission, A06 corps/bras
- Visuels Néo en webp (`public/neo/`)
- Collection + traces localStorage / Supabase
- Plusieurs classes par enseignant, liste d’élèves éditable, stats élèves par classe
- Supabase Auth (self-signup) + migrations + seed
- Déploiement Cloudflare Pages (`happy-learn.pages.dev`)
- Lecture à voix haute, `lang=fr`, `aria-live`, `prefers-reduced-motion`

## Reste

- Reserrer les politiques RLS (écriture des séances encore large)
- Export CSV
- Tests automatisés des 8 parcours
- Nouveaux parcours (autres niveaux / matières)
- Uploader `public/neo/` vers Storage si besoin
- Domaine custom Cloudflare
