import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm1-francais-langue-01";

/** CM1 / francais — Étude de la langue. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm1",
  subject: "francais",
  title: "Étude de la langue en mission",
  blurb: "Une mission CM1 : Étude de la langue.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Étude de la langue",
        statement: "Dans cette mission de CM1, tu vas travailler : Étude de la langue. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Étude de la langue.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Étude de la langue.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Étude de la langue.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Étude de la langue.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Nature",
      progress: 1,
      expected: "verbe",
      distractors: ["nom", "adjectif"],
      copy: allUniverses({
        title: "Courir",
        statement: "Dans « Léo court », « court » est un…",
        hint: "verbe.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Classe",
      progress: 2,
      expected: "nom",
      distractors: ["verbe", "déterminant"],
      copy: {
        football: {
          title: "Ballon",
          statement: "« Ballon » est un…",
          hint: "nom.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Ballon",
          statement: "« Ballon » est un…",
          hint: "nom.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Ballon",
          statement: "« Ballon » est un…",
          hint: "nom.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Ballon",
          statement: "« Ballon » est un…",
          hint: "nom.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Accord",
      progress: 3,
      expected: "belles",
      distractors: ["beau", "bels"],
      copy: allUniverses({
        title: "Accord adjectif",
        statement: "Des ___ fleurs (beau).",
        hint: "belles.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Temps",
      progress: 4,
      expected: "imparfait",
      distractors: ["présent", "futur"],
      copy: {
        football: {
          title: "Il jouait",
          statement: "Quel temps ?",
          hint: "imparfait.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Il jouait",
          statement: "Quel temps ?",
          hint: "imparfait.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Il jouait",
          statement: "Quel temps ?",
          hint: "imparfait.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Il jouait",
          statement: "Quel temps ?",
          hint: "imparfait.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Homophone",
      progress: 5,
      expected: "a",
      distractors: ["à", "as"],
      copy: allUniverses({
        title: "Verbe avoir",
        statement: "Il ___ un ballon (avoir).",
        hint: "a.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Sujet",
      progress: 6,
      expected: "les joueurs",
      distractors: ["fort", "vite"],
      copy: {
        football: {
          title: "Qui fait l’action ?",
          statement: "Dans « Les joueurs courent », le sujet est…",
          hint: "les joueurs.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Qui fait l’action ?",
          statement: "Dans « Les joueurs courent », le sujet est…",
          hint: "les joueurs.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Qui fait l’action ?",
          statement: "Dans « Les joueurs courent », le sujet est…",
          hint: "les joueurs.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Qui fait l’action ?",
          statement: "Dans « Les joueurs courent », le sujet est…",
          hint: "les joueurs.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "ont",
      distractors: ["on", "onde"],
      copy: {
        football: {
          title: "Accord passé composé",
          statement: "Ils ___ gagné.",
          hint: "ont.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Accord passé composé",
          statement: "Ils ___ gagné.",
          hint: "ont.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Accord passé composé",
          statement: "Ils ___ gagné.",
          hint: "ont.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Accord passé composé",
          statement: "Ils ___ gagné.",
          hint: "ont.",
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
        title: "Je progresse sur : Étude de la langue",
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
        statement: "Tu as travaillé « Étude de la langue » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
