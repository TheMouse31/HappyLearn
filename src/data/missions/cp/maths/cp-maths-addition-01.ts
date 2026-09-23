import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cp-maths-addition-01";

/** CP / maths — Addition et premiers problèmes. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cp",
  subject: "maths",
  title: "Addition et premiers problèmes en mission",
  blurb: "Une mission CP : Addition et premiers problèmes.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Addition et premiers problèmes",
        statement: "Dans cette mission de CP, tu vas travailler : Addition et premiers problèmes. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Addition et premiers problèmes.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Addition et premiers problèmes.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Addition et premiers problèmes.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Addition et premiers problèmes.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Addition",
      progress: 1,
      expected: "8",
      distractors: ["7", "9"],
      copy: allUniverses({
        title: "5 + 3",
        statement: "Calcule 5 + 3.",
        hint: "5 + 3 = 8.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Addition",
      progress: 2,
      expected: "12",
      distractors: ["11", "13"],
      copy: {
        football: {
          title: "7 + 5",
          statement: "Calcule 7 + 5.",
          hint: "7 + 5 = 12.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "7 + 5",
          statement: "Calcule 7 + 5.",
          hint: "7 + 5 = 12.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "7 + 5",
          statement: "Calcule 7 + 5.",
          hint: "7 + 5 = 12.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "7 + 5",
          statement: "Calcule 7 + 5.",
          hint: "7 + 5 = 12.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Problème",
      progress: 3,
      expected: "9",
      distractors: ["8", "10"],
      copy: allUniverses({
        title: "Billes",
        statement: "Tu as 4 billes, tu en gagnes 5. Combien en as-tu ?",
        hint: "4 + 5 = 9.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Complément",
      progress: 4,
      expected: "4",
      distractors: ["5", "3"],
      copy: {
        football: {
          title: "Vers 10",
          statement: "6 + ? = 10. Écris le complément.",
          hint: "4.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Vers 10",
          statement: "6 + ? = 10. Écris le complément.",
          hint: "4.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Vers 10",
          statement: "6 + ? = 10. Écris le complément.",
          hint: "4.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Vers 10",
          statement: "6 + ? = 10. Écris le complément.",
          hint: "4.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Double",
      progress: 5,
      expected: "14",
      distractors: ["12", "16"],
      copy: allUniverses({
        title: "Double de 7",
        statement: "Quel est le double de 7 ?",
        hint: "14.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Suite",
      progress: 6,
      expected: "15",
      distractors: ["14", "16"],
      copy: {
        football: {
          title: "10 + 5",
          statement: "Calcule 10 + 5.",
          hint: "15.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "10 + 5",
          statement: "Calcule 10 + 5.",
          hint: "15.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "10 + 5",
          statement: "Calcule 10 + 5.",
          hint: "15.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "10 + 5",
          statement: "Calcule 10 + 5.",
          hint: "15.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "11",
      distractors: ["10", "12"],
      copy: {
        football: {
          title: "6 + 5",
          statement: "Calcule 6 + 5.",
          hint: "11.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "6 + 5",
          statement: "Calcule 6 + 5.",
          hint: "11.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "6 + 5",
          statement: "Calcule 6 + 5.",
          hint: "11.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "6 + 5",
          statement: "Calcule 6 + 5.",
          hint: "11.",
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
        title: "Je progresse sur : Addition et premiers problèmes",
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
        statement: "Tu as travaillé « Addition et premiers problèmes » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
