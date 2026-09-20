import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-donnees-01";

/** CM2 / maths — Organisation des données et probabilités. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Organisation des données et probabilités…",
  blurb: "Une mission CM2 : Organisation des données et probabilités.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Organisation des données et probabilités",
        statement: "Dans cette mission de CM2, tu vas travailler : Organisation des données et probabilités. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
        hint: "Prends ton temps : il n’y a ni note ni classement.",
        caption: "La mission peut commencer.",
      }),
    },
    {
      kind: "continue",
      kicker: "Mise en action",
      progress: 0,
      copy: {
        football: {
          title: "Tu entres en jeu",
          statement: "Les Bleus comptent sur toi. Chaque bonne réponse fait avancer l’action sur le terrain.",
          caption: "Tu prends ta place au milieu du terrain.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement: "Tes partenaires comptent sur toi. Chaque bonne réponse ouvre un couloir.",
          caption: "Tu prends ta place derrière tes partenaires.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement: "Tu rentres vers l’écurie avec ton cheval. Chaque étape éclaire le sentier.",
          caption: "L’écurie apparaît au bout du sentier.",
        },
        espace: {
          title: "Le retour vers la station",
          statement: "Le module doit rejoindre la station. Chaque réponse corrige la trajectoire.",
          caption: "La station apparaît au loin.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Lis le jeu",
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Organisation des données et probabilités.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Organisation des données et probabilités.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Organisation des données et probabilités.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Organisation des données et probabilités.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Lecture",
      progress: 1,
      expected: "12",
      distractors: ["10", "14"],
      copy: allUniverses({
        title: "Diagramme",
        statement: "Un diagramme montre 12 votes pour A. Combien ?",
        hint: "12.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Plus fréquent",
      progress: 2,
      expected: "football",
      distractors: ["rugby", "espace"],
      copy: {
        football: {
          title: "Mode",
          statement: "Si football a le plus de voix, quel sport est le plus fréquent ?",
          hint: "football.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Mode",
          statement: "Si football a le plus de voix, quel sport est le plus fréquent ?",
          hint: "football.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Mode",
          statement: "Si football a le plus de voix, quel sport est le plus fréquent ?",
          hint: "football.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Mode",
          statement: "Si football a le plus de voix, quel sport est le plus fréquent ?",
          hint: "football.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Probabilité",
      progress: 3,
      expected: "1 chance sur 2",
      distractors: ["1 chance sur 3", "2 chances sur 2"],
      copy: allUniverses({
        title: "Pièce",
        statement: "Pile ou face : quelle chance d’avoir pile ?",
        hint: "1 chance sur 2.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Total",
      progress: 4,
      expected: "30",
      distractors: ["25", "35"],
      copy: {
        football: {
          title: "Somme",
          statement: "10 + 8 + 12 observations. Total ?",
          hint: "30.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Somme",
          statement: "10 + 8 + 12 observations. Total ?",
          hint: "30.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Somme",
          statement: "10 + 8 + 12 observations. Total ?",
          hint: "30.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Somme",
          statement: "10 + 8 + 12 observations. Total ?",
          hint: "30.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Tableau",
      progress: 5,
      expected: "ligne",
      distractors: ["cercle", "angle"],
      copy: allUniverses({
        title: "Lire un tableau",
        statement: "Dans un tableau à double entrée, on lit une…",
        hint: "ligne.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Hasard",
      progress: 6,
      expected: "plus probable",
      distractors: ["impossible", "certain"],
      copy: {
        football: {
          title: "Vocabulaire",
          statement: "Si un événement a beaucoup de chances : il est…",
          hint: "plus probable.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Vocabulaire",
          statement: "Si un événement a beaucoup de chances : il est…",
          hint: "plus probable.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Vocabulaire",
          statement: "Si un événement a beaucoup de chances : il est…",
          hint: "plus probable.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Vocabulaire",
          statement: "Si un événement a beaucoup de chances : il est…",
          hint: "plus probable.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "7",
      distractors: ["5", "9"],
      copy: {
        football: {
          title: "Écart",
          statement: "15 oui et 8 non. Combien de oui de plus ?",
          hint: "7.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Écart",
          statement: "15 oui et 8 non. Combien de oui de plus ?",
          hint: "7.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Écart",
          statement: "15 oui et 8 non. Combien de oui de plus ?",
          hint: "7.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Écart",
          statement: "15 oui et 8 non. Combien de oui de plus ?",
          hint: "7.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "But ! Victoire !",
          statement: "Tes choix ont fait basculer le match. Les Bleus l’emportent.",
          caption: "Félicitations : tu as fait basculer le match.",
        },
        rugby: {
          title: "Essai ! Victoire !",
          statement: "Tes calculs ont ouvert l’intervalle. Essai transformé.",
          caption: "Félicitations : tu as fait basculer le match.",
        },
        equitation: {
          title: "Retour à l’écurie",
          statement: "Tu as lu chaque borne. Vous rentrez ensemble, en confiance.",
          caption: "Franchissement réussi, retour au pas jusqu’à l’écurie.",
        },
        espace: {
          title: "Arrimage réussi",
          statement: "La trajectoire est calée. Les attaches se verrouillent.",
          caption: "Le module est amarré. Mission réussie.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je progresse sur : Organisation des données et probabilités",
        statement: "Tu as entraîné la notion pas à pas, avec des exemples et des décisions.",
        note: "Relis les indices des étapes difficiles : ce sont de vraies méthodes à réutiliser.",
        caption: "Tu pourras réutiliser cette méthode dans une autre mission.",
      }),
    },
    {
      kind: "bilan",
      kicker: "Bilan sans note",
      progress: 6,
      copy: allUniverses({
        title: "Ton bilan",
        statement: "Tu as travaillé « Organisation des données et probabilités » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
        note: "Qu’as-tu préféré dans cette mission ?",
        caption: "Les réussites sont valorisées sans classement.",
      }),
    },
    {
      kind: "teaser",
      kicker: "Prochaine mission",
      progress: 6,
      copy: {
        football: {
          title: "Un nouveau défi t’attend",
          statement: "Au prochain match, un nouveau défi pédagogique t’attend.",
          caption: "Un point d’interrogation apparaît sur le terrain.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement: "La prochaine rencontre apportera un nouveau défi.",
          caption: "Un nouveau schéma apparaît au loin.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement: "Un nouveau chemin te conduira vers un autre défi.",
          caption: "Une rivière apparaît au loin.",
        },
        espace: {
          title: "Un nouveau défi t’attend",
          statement: "Un signal mystérieux annonce une prochaine mission.",
          caption: "Un point lumineux inconnu apparaît au-delà de la station.",
        },
      },
    },
  ],
});
