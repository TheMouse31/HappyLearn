import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce1-maths-operations-01";

/** CE1 / maths — Soustraction et sens des opérations. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce1",
  subject: "maths",
  title: "Soustraction et sens des opérations en mission",
  blurb: "Une mission CE1 : Soustraction et sens des opérations.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Soustraction et sens des opérations",
        statement: "Dans cette mission de CE1, tu vas travailler : Soustraction et sens des opérations. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Soustraction et sens des opérations.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Soustraction et sens des opérations.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Soustraction et sens des opérations.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Soustraction et sens des opérations.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Soustraction",
      progress: 1,
      expected: "9",
      distractors: ["8", "10"],
      copy: allUniverses({
        title: "15 − 6",
        statement: "Calcule 15 − 6.",
        hint: "15 − 6 = 9.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Sens",
      progress: 2,
      expected: "12",
      distractors: ["14", "10"],
      copy: {
        football: {
          title: "Reste",
          statement: "Tu as 20, tu donnes 8. Combien reste-t-il ?",
          hint: "20 − 8 = 12.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Reste",
          statement: "Tu as 20, tu donnes 8. Combien reste-t-il ?",
          hint: "20 − 8 = 12.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Reste",
          statement: "Tu as 20, tu donnes 8. Combien reste-t-il ?",
          hint: "20 − 8 = 12.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Reste",
          statement: "Tu as 20, tu donnes 8. Combien reste-t-il ?",
          hint: "20 − 8 = 12.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Addition",
      progress: 3,
      expected: "47",
      distractors: ["37", "57"],
      copy: allUniverses({
        title: "23 + 24",
        statement: "Calcule 23 + 24.",
        hint: "47.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Opération",
      progress: 4,
      expected: "soustraction",
      distractors: ["addition", "multiplication"],
      copy: {
        football: {
          title: "Quelle opération ?",
          statement: "On cherche ce qui reste. Quelle opération ?",
          hint: "soustraction.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Quelle opération ?",
          statement: "On cherche ce qui reste. Quelle opération ?",
          hint: "soustraction.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Quelle opération ?",
          statement: "On cherche ce qui reste. Quelle opération ?",
          hint: "soustraction.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Quelle opération ?",
          statement: "On cherche ce qui reste. Quelle opération ?",
          hint: "soustraction.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Complément",
      progress: 5,
      expected: "35",
      distractors: ["25", "45"],
      copy: allUniverses({
        title: "Vers 100",
        statement: "65 + ? = 100. Écris le complément.",
        hint: "35.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Différence",
      progress: 6,
      expected: "18",
      distractors: ["16", "20"],
      copy: {
        football: {
          title: "50 − 32",
          statement: "Calcule 50 − 32.",
          hint: "18.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "50 − 32",
          statement: "Calcule 50 − 32.",
          hint: "18.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "50 − 32",
          statement: "Calcule 50 − 32.",
          hint: "18.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "50 − 32",
          statement: "Calcule 50 − 32.",
          hint: "18.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "27",
      distractors: ["25", "29"],
      copy: {
        football: {
          title: "40 − 13",
          statement: "Calcule 40 − 13.",
          hint: "27.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "40 − 13",
          statement: "Calcule 40 − 13.",
          hint: "27.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "40 − 13",
          statement: "Calcule 40 − 13.",
          hint: "27.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "40 − 13",
          statement: "Calcule 40 − 13.",
          hint: "27.",
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
        title: "Je progresse sur : Soustraction et sens des opérations",
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
        statement: "Tu as travaillé « Soustraction et sens des opérations » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
