import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce2-francais-lecture-01";

/** CE2 / francais — Lecture fluide et compréhension. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce2",
  subject: "francais",
  title: "Lecture fluide et compréhension en mission",
  blurb: "Une mission CE2 : Lecture fluide et compréhension.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Lecture fluide et compréhension",
        statement: "Dans cette mission de CE2, tu vas travailler : Lecture fluide et compréhension. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Lecture fluide et compréhension.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Lecture fluide et compréhension.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Lecture fluide et compréhension.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Lecture fluide et compréhension.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Personnage",
      progress: 1,
      expected: "Léo",
      distractors: ["Mia", "Tom"],
      copy: allUniverses({
        title: "Qui ?",
        statement: "Dans le texte, le héros s’appelle Léo. Qui est le héros ?",
        hint: "Léo.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Lieu",
      progress: 2,
      expected: "forêt",
      distractors: ["ville", "plage"],
      copy: {
        football: {
          title: "Où ?",
          statement: "L’histoire se passe dans une forêt. Où ?",
          hint: "forêt.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Où ?",
          statement: "L’histoire se passe dans une forêt. Où ?",
          hint: "forêt.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Où ?",
          statement: "L’histoire se passe dans une forêt. Où ?",
          hint: "forêt.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Où ?",
          statement: "L’histoire se passe dans une forêt. Où ?",
          hint: "forêt.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Inférence",
      progress: 3,
      expected: "il est content",
      distractors: ["il est triste", "il dort"],
      copy: allUniverses({
        title: "Comprendre",
        statement: "Léo sourit et saute : que peut-on dire ?",
        hint: "il est content.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Pronom",
      progress: 4,
      expected: "Léo",
      distractors: ["la forêt", "le ballon"],
      copy: {
        football: {
          title: "Remplace",
          statement: "« Il court » : « Il » désigne…",
          hint: "Léo.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Remplace",
          statement: "« Il court » : « Il » désigne…",
          hint: "Léo.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Remplace",
          statement: "« Il court » : « Il » désigne…",
          hint: "Léo.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Remplace",
          statement: "« Il court » : « Il » désigne…",
          hint: "Léo.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Ordre",
      progress: 5,
      expected: "1 puis 2 puis 3",
      distractors: ["3 puis 1 puis 2", "2 puis 3 puis 1"],
      copy: allUniverses({
        title: "Chronologie",
        statement: "Ordre : 1 départ, 2 obstacle, 3 arrivée.",
        hint: "1 puis 2 puis 3.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Idée principale",
      progress: 6,
      expected: "réussir ensemble",
      distractors: ["manger", "dormir"],
      copy: {
        football: {
          title: "Thème",
          statement: "Le texte parle d’une équipe qui réussit ensemble. Idée principale ?",
          hint: "réussir ensemble.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Thème",
          statement: "Le texte parle d’une équipe qui réussit ensemble. Idée principale ?",
          hint: "réussir ensemble.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Thème",
          statement: "Le texte parle d’une équipe qui réussit ensemble. Idée principale ?",
          hint: "réussir ensemble.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Thème",
          statement: "Le texte parle d’une équipe qui réussit ensemble. Idée principale ?",
          hint: "réussir ensemble.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "parce qu’il s’entraîne",
      distractors: ["par hasard", "sans raison"],
      copy: {
        football: {
          title: "Pourquoi ?",
          statement: "Le héros progresse parce qu’il s’entraîne. Pourquoi progresse-t-il ?",
          hint: "parce qu’il s’entraîne.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Pourquoi ?",
          statement: "Le héros progresse parce qu’il s’entraîne. Pourquoi progresse-t-il ?",
          hint: "parce qu’il s’entraîne.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Pourquoi ?",
          statement: "Le héros progresse parce qu’il s’entraîne. Pourquoi progresse-t-il ?",
          hint: "parce qu’il s’entraîne.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Pourquoi ?",
          statement: "Le héros progresse parce qu’il s’entraîne. Pourquoi progresse-t-il ?",
          hint: "parce qu’il s’entraîne.",
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
        title: "Je progresse sur : Lecture fluide et compréhension",
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
        statement: "Tu as travaillé « Lecture fluide et compréhension » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
