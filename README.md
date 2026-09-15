# Happy Learn

Apprentissages du CP au CM2, racontés comme une mission. Application web React (Vite). Le catalogue couvre **toutes les matières du primaire** ; pour l’instant, **seul le parcours mathématiques CM2** est jouable (fractions, quatre univers, modes cahier ou QCM).

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

## Supabase

1. Créer un projet.
2. SQL Editor : exécuter `supabase/migrations/20260915_init.sql` puis `supabase/seed.sql`.
3. Storage (plus tard) : bucket public `neo` pour les visuels webp. En local, les fichiers sont dans `public/neo/` (guide compressé ~155 Ko, plus 2,2 Mo).
4. Authentication
   - **Élèves** : pas de compte e-mail. Prénom ou surnom (20 caractères) + code classe facultatif.
   - **Professeurs / parents** : e-mail + mot de passe, ou lien magique (OTP). Dans Authentication → URL configuration, ajouter `http://localhost:5173` et le domaine Pages.
   - Exécuter aussi `supabase/migrations/20260915_classes_enseignants.sql` (tables `classes`, `profils_enseignants`, colonne `code_classe`).
   - Puis `supabase/migrations/20260915_happy_learn_course.sql` (colonnes `niveau` / `matiere` sur les séances).
5. CORS / URL : ajouter `http://localhost:5173`, `https://*.pages.dev` et le domaine custom.

Politiques RLS MVP : lecture publique de `univers` et `etapes` ; écriture ouverte sur `sessions_enfant`, `reponses` et `collection` via la clé anon. Documenté dans la migration. À resserrer (code classe) après le test en classe.

## Cloudflare Pages

Build :

```bash
npm run build
```

Sortie : `dist/`. Fallback SPA : `public/_redirects` (`/* /index.html 200`).

Déploiement :

```bash
npx wrangler pages deploy dist --project-name mission-maths
```

`wrangler.toml` pointe `pages_build_output_dir = "dist"`. Dans le tableau de bord Pages : build command `npm run build`, output `dist`.

## Connexion (écoles et particuliers)

La page d’accueil `/` est la page de connexion.

- **Élève** : prénom ou surnom, pas d’e-mail. Code classe facultatif (fourni par le professeur). À la maison, le code peut rester vide.
- **Professeur ou parent** : e-mail + mot de passe, ou lien magique. Plusieurs classes possibles, chacune avec son code. L’espace enseignant montre les stats par élève (séances, missions terminées, réussite aux réponses, univers gagnés) et le journal des séances, **sans note ni classement**.

## Parcours enfant

Connexion élève → A00 accueil → A02 présentation → A03 univers → A04 cahier ou QCM → A05 confirmation → mission → A06 récompense.

A01 (changer de prénom) reste accessible depuis l’accueil.

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
- Page de connexion élèves / professeurs-parents
- Écrans A00–A06 et mission sans iframe
- Moteur unique, 4 univers, modes cahier et QCM
- Distrateurs QCM construits, ordre mélangé
- Indices avec Néo habillé, pouce après une bonne réponse, applaudissement en fin de mission, A06 corps/bras
- Visuels Néo convertis en webp (`neo-guide` 2,2 Mo → ~155 Ko)
- Collection + traces en localStorage, même API Supabase si clés présentes
- Code classe, espace enseignant, migrations élèves + enseignants
- Lecture à voix haute, `lang=fr`, `aria-live`, `prefers-reduced-motion`
- wrangler.toml, `_redirects`, `.env.example`

## Reste

- Brancher un vrai projet Supabase et vérifier CORS Pages + Auth redirect
- Uploader `public/neo/` vers Storage si tu ne veux plus servir les images avec Pages
- Reserrer les politiques RLS (aujourd’hui lecture des codes classe ouverte, écriture des séances encore large)
- Plusieurs classes par enseignant, stats élèves par classe
- Export CSV
- Compresser encore les scènes SVG (illustrations plus riches type prototype)
- Tests automatisés des 8 parcours
- Domaine custom Cloudflare
