import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce1-anglais-oral-01";

/** CE1 / anglais — Anglais — Oral A1. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce1",
  subject: "anglais",
  title: "Oral A1 en mission",
  blurb: "Une mission CE1 : Anglais — Oral A1.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Anglais — Oral A1",
        statement: "Dans cette mission de CE1, tu vas travailler : Anglais — Oral A1. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Anglais — Oral A1.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Anglais — Oral A1.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Anglais — Oral A1.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Anglais — Oral A1.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Saluer",
      progress: 1,
      expected: "hello",
      distractors: ["goodbye only", "table"],
      copy: allUniverses({
        title: "Greeting",
        statement: "Pour dire bonjour en anglais ?",
        hint: "hello.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Couleur",
      progress: 2,
      expected: "blue",
      distractors: ["bleu", "bloo"],
      copy: {
        football: {
          title: "Colour",
          statement: "Quelle est la couleur « blue » ?",
          hint: "blue.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Colour",
          statement: "Quelle est la couleur « blue » ?",
          hint: "blue.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Colour",
          statement: "Quelle est la couleur « blue » ?",
          hint: "blue.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Colour",
          statement: "Quelle est la couleur « blue » ?",
          hint: "blue.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Nombre",
      progress: 3,
      expected: "three",
      distractors: ["tree", "free"],
      copy: allUniverses({
        title: "Number",
        statement: "Le nombre 3 en anglais ?",
        hint: "three.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Objet",
      progress: 4,
      expected: "book",
      distractors: ["livre", "buk"],
      copy: {
        football: {
          title: "Classroom",
          statement: "« Livre » en anglais ?",
          hint: "book.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Classroom",
          statement: "« Livre » en anglais ?",
          hint: "book.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Classroom",
          statement: "« Livre » en anglais ?",
          hint: "book.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Classroom",
          statement: "« Livre » en anglais ?",
          hint: "book.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Question",
      progress: 5,
      expected: "what",
      distractors: ["wat", "ouat"],
      copy: allUniverses({
        title: "Wh-",
        statement: "Pour demander « quoi » ?",
        hint: "what.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Politesse",
      progress: 6,
      expected: "please",
      distractors: ["plese", "place"],
      copy: {
        football: {
          title: "Polite",
          statement: "« S’il te plaît » ?",
          hint: "please.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Polite",
          statement: "« S’il te plaît » ?",
          hint: "please.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Polite",
          statement: "« S’il te plaît » ?",
          hint: "please.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Polite",
          statement: "« S’il te plaît » ?",
          hint: "please.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "thank you",
      distractors: ["tank you", "think you"],
      copy: {
        football: {
          title: "Thanks",
          statement: "Pour dire merci ?",
          hint: "thank you.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Thanks",
          statement: "Pour dire merci ?",
          hint: "thank you.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Thanks",
          statement: "Pour dire merci ?",
          hint: "thank you.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Thanks",
          statement: "Pour dire merci ?",
          hint: "thank you.",
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
        title: "Je progresse sur : Anglais — Oral A1",
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
        statement: "Tu as travaillé « Anglais — Oral A1 » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
