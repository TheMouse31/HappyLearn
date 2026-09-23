import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm1-maths-fractions-01";

/** CM1 / maths — Fractions (dénominateur ≤20 opérateur unitaire). Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm1",
  subject: "maths",
  title: "Fractions (dénominateur ≤20 opérateur unitair…",
  blurb: "Une mission CM1 : Fractions (dénominateur ≤20 opérateur unitaire).",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Fractions (dénominateur ≤20 opérateur unitaire)",
        statement: "Dans cette mission de CM1, tu vas travailler : Fractions (dénominateur ≤20 opérateur unitaire). Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Fractions (dénominateur ≤20 opérateur unitaire).",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Fractions (dénominateur ≤20 opérateur unitaire).",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Fractions (dénominateur ≤20 opérateur unitaire).",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Fractions (dénominateur ≤20 opérateur unitaire).",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 1 sur 6 · Reconnaître 1/2",
      progress: 1,
      expected: "1/2",
      distractors: ["1/3", "2/3"],
      copy: allUniverses({
        title: "Une moitié",
        statement: "Parmi 8 jetons, la moitié est prise. Quelle fraction ?",
        hint: "Moitié = 1/2.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Opérateur unitaire",
      progress: 2,
      expected: "3",
      distractors: ["4", "6"],
      copy: {
        football: {
          title: "1/4 de 12",
          statement: "Calcule 1/4 de 12.",
          hint: "12 ÷ 4 = 3.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "1/4 de 12",
          statement: "Calcule 1/4 de 12.",
          hint: "12 ÷ 4 = 3.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "1/4 de 12",
          statement: "Calcule 1/4 de 12.",
          hint: "12 ÷ 4 = 3.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "1/4 de 12",
          statement: "Calcule 1/4 de 12.",
          hint: "12 ÷ 4 = 3.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · 1/5 de 20",
      progress: 3,
      expected: "4",
      distractors: ["5", "10"],
      copy: allUniverses({
        title: "Un cinquième",
        statement: "Calcule 1/5 de 20.",
        hint: "20 ÷ 5 = 4.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Comparer",
      progress: 4,
      expected: "2/5",
      distractors: ["1/5", "1/10"],
      copy: {
        football: {
          title: "La plus grande",
          statement: "Parmi 1/5, 2/5 et 1/10, laquelle est la plus grande ?",
          hint: "Même famille : compare les numérateurs, ou compare à 1/2.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "La plus grande",
          statement: "Parmi 1/5, 2/5 et 1/10, laquelle est la plus grande ?",
          hint: "Même famille : compare les numérateurs, ou compare à 1/2.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "La plus grande",
          statement: "Parmi 1/5, 2/5 et 1/10, laquelle est la plus grande ?",
          hint: "Même famille : compare les numérateurs, ou compare à 1/2.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "La plus grande",
          statement: "Parmi 1/5, 2/5 et 1/10, laquelle est la plus grande ?",
          hint: "Même famille : compare les numérateurs, ou compare à 1/2.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 5 sur 6 · Égalité",
      progress: 5,
      expected: "2/4",
      distractors: ["1/4", "3/4"],
      copy: allUniverses({
        title: "Même quantité",
        statement: "Quelle fraction égale 1/2 ?",
        hint: "2/4 = 1/2.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Opérateur",
      progress: 6,
      expected: "6",
      distractors: ["3", "9"],
      copy: {
        football: {
          title: "1/3 de 18",
          statement: "Calcule 1/3 de 18.",
          hint: "18 ÷ 3 = 6.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "1/3 de 18",
          statement: "Calcule 1/3 de 18.",
          hint: "18 ÷ 3 = 6.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "1/3 de 18",
          statement: "Calcule 1/3 de 18.",
          hint: "18 ÷ 3 = 6.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "1/3 de 18",
          statement: "Calcule 1/3 de 18.",
          hint: "18 ÷ 3 = 6.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "5",
      distractors: ["4", "10"],
      copy: {
        football: {
          title: "1/4 de 20",
          statement: "Calcule 1/4 de 20.",
          hint: "20 ÷ 4 = 5.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "1/4 de 20",
          statement: "Calcule 1/4 de 20.",
          hint: "20 ÷ 4 = 5.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "1/4 de 20",
          statement: "Calcule 1/4 de 20.",
          hint: "20 ÷ 4 = 5.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "1/4 de 20",
          statement: "Calcule 1/4 de 20.",
          hint: "20 ÷ 4 = 5.",
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
        title: "Je progresse sur : Fractions (dénominateur ≤20 opérateur unitaire)",
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
        statement: "Tu as travaillé « Fractions (dénominateur ≤20 opérateur unitaire) » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
