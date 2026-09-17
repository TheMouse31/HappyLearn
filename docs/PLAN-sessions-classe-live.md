# Plan — Sessions de classe live (pilotées par le professeur)

Ajouter des sessions de classe pilotées par le professeur (code éphémère
régénérable), avec verrouillage d'un nom élève (nom + prénom) par session et
reconnexion, une page de pilotage live (présence, exclusion, lancement
d'activité, navigation élève verrouillée), un registre de missions rangées par
niveau/matière avec détection « déjà faite », et des statistiques filtrables par
élève/session/date. Construit sur Supabase Realtime, avec dégradation propre en
mode localStorage.

## Décisions validées

- **Backend** : Supabase + Realtime. Le mode localStorage reste mono-appareil
  (fonctions live désactivées).
- **Missions** : registre léger en TS (`mission_id` stable + niveau + matière +
  titre + steps) + suivi en base des missions faites par la classe.
- **Code de session** : classe permanente + roster conservés ; ajout d'une
  **session de classe éphémère** avec code régénéré à chaque lancement.
- **Roster** : ajout du **nom de famille** (nom + prénom) ; affichage
  « Prénom Nom » côté élève.
- **Périmètre** : une seule PR.

## Pré-requis (secrets — isolation option B)

Noms uniques pour ne pas entrer en collision avec les secrets Supabase d'autres
projets (portée personnelle) :

- `VITE_HL_SUPABASE_URL` — URL du projet Supabase de test Happy Learn.
- `VITE_HL_SUPABASE_ANON_KEY` — clé anon publique de ce projet.
- `HL_SUPABASE_ACCESS_TOKEN` *(optionnel)* — jeton pour appliquer les migrations
  via `scripts/run-supabase-migrations.mjs`. Sinon, appliquer le `.sql` à la main
  dans le SQL Editor Supabase.

Adaptations de code liées à l'isolation :

- `src/lib/supabase.ts` : lire en priorité `VITE_HL_SUPABASE_URL` /
  `VITE_HL_SUPABASE_ANON_KEY`, avec repli sur les noms standards
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
- `scripts/run-supabase-migrations.mjs` : le `ref` du projet est **codé en dur
  sur la production** (`caoxbewivbsoysxfhblg`). Le **déduire de l'URL Supabase**
  (`VITE_HL_SUPABASE_URL`) au lieu du ref figé, et lire le jeton depuis
  `HL_SUPABASE_ACCESS_TOKEN` (repli `SUPABASE_ACCESS_TOKEN`), pour éviter tout
  écrit accidentel en prod.

Utiliser de préférence un **projet Supabase de test**. Realtime doit être activé
sur les nouvelles tables (inclus dans la migration).

## Contexte (état actuel du code)

- App Vite + React + TS, double persistance `localStorage` / Supabase via
  `src/lib/persistence.ts`.
- Missions = tableau statique unique `STEPS` dans `src/data/steps.ts` (CM2
  fractions), habillé par univers/mode. Chargé depuis le TS, pas la base.
- Roster élève = `prenom` seul (`eleves_classe`, type `ClassStudent` dans
  `src/data/types.ts`).
- `sessions_enfant` = trace de jeu par enfant. Aucune session pilotée par le
  prof, aucune présence, aucun temps réel.
- Connexion élève avec code : choix du prénom dans le roster (match insensible à
  la casse), sans verrou ni unicité live (`loginEleve` dans `src/lib/session.tsx`).

## Modèle de données (migration `supabase/migrations/20260918_sessions_classe_live.sql`)

- `eleves_classe` : ajouter `nom text`. Nouvel index unique
  `(class_id, lower(trim(prenom)), lower(trim(nom)))`.
- `classe_sessions` (session live éphémère) : `id`, `class_id`→classes, `code`
  unique (régénéré à chaque lancement), `statut` (`ouverte`/`fermee`), activité en
  cours (`niveau`, `matiere`, `mission_id`, `univers`, `mode`), `created_at`,
  `closed_at`. Index unique partiel : une seule session `ouverte` par classe.
- `session_participants` (présence + verrou de nom + reconnexion) : `id`,
  `session_id`→classe_sessions, `eleve_id`→eleves_classe, `prenom`, `nom`,
  `device_id`, `statut` (`connecte`/`deconnecte`), `joined_at`, `last_seen_at`.
  **Unique `(session_id, eleve_id)`** = un nom choisi une seule fois par session.
- `sessions_enfant` : ajouter `class_id`, `classe_session_id`, `eleve_id`,
  `mission_id` (pour filtrer les stats et détecter les missions faites).
- RLS : politiques cohérentes avec l'existant (prof propriétaire via
  `classes.teacher_id = auth.uid()` pour écrire/exclure ; lecture publique de la
  session ouverte par code ; insert/update participant ouvert côté élève). MVP
  permissif, à resserrer noté en commentaire.
- Mettre à jour `scripts/run-supabase-migrations.mjs` pour inclure
  `20260917_eleves_classe.sql` (actuellement absent) et la nouvelle migration.

## Sémantique verrou / reconnexion / exclusion

- Rejoindre : l'élève saisit le **code de session** + choisit son nom → insert
  participant. Nom libre → verrouillé à ce `device_id`. Même `device_id` →
  **reconnexion** (réactive la ligne). Autre appareil sur le même nom → refus
  « Ce nom est déjà pris dans la session ».
- Déconnexion (fermeture onglet / perte réseau) : `statut='deconnecte'`, nom
  conservé, reconnexion possible depuis le même appareil.
- Exclusion par le prof : suppression de la ligne participant → **le nom redevient
  disponible** ; l'appareil exclu est notifié en temps réel et renvoyé vers un
  écran « déconnecté par le professeur ».

## Registre de missions (TS + suivi base)

- Nouveau `src/data/missions.ts` :
  `MissionDef { id, grade, subject, title, blurb, steps, available }` +
  `MISSIONS[]`, `findMission(id)`, `listMissions(grade, subject)`. La séquence
  actuelle devient `cm2-maths-fractions-01` (steps = `STEPS`).
- Refactor : `MissionScreen` et le moteur chargent les steps depuis la mission
  choisie au lieu d'importer `STEPS` en dur.
- « Déjà faite » : `listClassMissionsDone(classId)` = `mission_id` distincts de
  `sessions_enfant` terminées pour la classe ; badge dans le sélecteur d'activité
  du prof.

## Couche persistance & temps réel

- Nouvelles méthodes dans `src/lib/persistence.ts` (+ miroir local mono-appareil) :
  `openClassSession`, `closeClassSession`, `getActiveClassSession`,
  `findActiveSessionByCode`, `setSessionActivity`, `joinSession` (gère
  verrou/reconnexion), `heartbeat`/`leaveSession`, `listParticipants`,
  `kickParticipant`, `listClassMissionsDone`, `listSessionsByClass(classId, filtres)`.
- Helpers Realtime (nouveau `src/lib/realtime.ts`) : abonnements
  `postgres_changes` sur `session_participants` et `classe_sessions`. Actifs
  uniquement si `backend === 'supabase'`.

## Contexte de session & verrouillage navigation

- `src/lib/session.tsx` : état de session live (session active, participant
  courant, activité en cours, `lockedSession`). Reconnexion auto au démarrage si
  l'appareil a un participant actif. Fonctions élève (`joinClassSession`,
  `leaveClassSession`) et prof (`launchClassSession`, `endClassSession`,
  `setClassActivity`, `kick`).
- `src/components/Shell.tsx` : masquer retour/accueil et bloquer la navigation
  quand `lockedSession` est vrai (élève cantonné à salle d'attente ↔ mission
  active).

## Écrans

- Nouveau `src/screens/SessionControlScreen.tsx` (prof, route
  `/espace-professeur/session`) : bouton « Lancer une nouvelle session » (nouveau
  code, ferme l'ancienne), affichage du code à partager, liste **live** des élèves
  connectés (nom prénom + statut) avec bouton « Déconnecter », sélecteur
  d'activité (niveau, matière, mission avec badge « déjà faite »), « Terminer la
  session ».
- Nouveau `src/screens/StudentWaitingScreen.tsx` (élève) : salle d'attente
  verrouillée ; quand le prof lance une activité → poussée automatique vers la
  mission ; retour en salle d'attente en fin de mission (plusieurs exercices
  possibles) ; écran « exclu » si kické.
- Maj `EleveLoginScreen` : saisir le code de session, choisir son nom (liste
  « Prénom Nom »), gérer refus « nom déjà pris » et reconnexion.
- Maj `TeacherSpaceScreen` : roster **nom + prénom** (CRUD), accès à la page de
  pilotage, et **filtres de stats** (par élève, par session, par plage de dates)
  au-dessus des onglets Activité/Séances.
- Maj `App.tsx` : nouvelles routes ; redirections pour le mode verrouillé.
- Maj `src/data/types.ts` : `ClassStudent.nom`, `ClasseSession`,
  `SessionParticipant`, `MissionDef`, filtres de stats ; `studentStats.ts` :
  agrégation par `eleve_id` + application des filtres.

## Dégradation localStorage

Fonctions live (verrou inter-appareils, présence, kick) sans effet réel en
mono-navigateur : l'UI de pilotage affiche un bandeau « nécessite Supabase » et se
limite au strict possible. Gating sur `backend`.

## Tests (après ajout des secrets)

- Appliquer les migrations sur le projet de test.
- Deux contextes navigateur (deux « appareils ») via computer use : le prof lance
  une session → code ; l'élève A rejoint et verrouille « Martin » → l'élève B ne
  peut plus prendre « Martin » ; A ferme l'onglet et se reconnecte (même appareil)
  → reprend sa place ; le prof voit la présence live et exclut B → le nom se
  libère ; le prof lance une activité → A est poussé dans la mission, navigation
  verrouillée ; fin de mission → retour salle d'attente ; nouvelle session →
  nouveau code. Vérifier la détection « déjà faite » et les filtres de stats
  (élève/session/date).
- Vérifier lint + build, puis dégradation propre en mode localStorage.
- Artefacts : vidéo du parcours prof + élève à deux appareils.

## Todos

1. Migration `20260918_sessions_classe_live.sql` + maj `run-supabase-migrations.mjs`.
2. Étendre `src/data/types.ts`.
3. Créer `src/data/missions.ts` + refactor `MissionScreen`/moteur.
4. Méthodes session/présence/mission dans `persistence.ts` + `realtime.ts`.
5. Étendre `session.tsx` (état live, verrou navigation, reconnexion).
6. Créer `SessionControlScreen` + branchement depuis `TeacherSpaceScreen`.
7. Créer `StudentWaitingScreen` + verrou navigation (Shell) + écran exclu.
8. Roster nom+prénom (`TeacherSpaceScreen`, `EleveLoginScreen`).
9. Filtres de stats (`TeacherSpaceScreen` + `studentStats.ts`).
10. Migrations + tests à deux appareils + lint/build + dégradation localStorage + vidéo.
