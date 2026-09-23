import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce2-maths-fractions-01";

/** CE2 / maths — Fractions d'unité / égalités (dén. ≤12). Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce2",
  subject: "maths",
  title: "Fractions d'unité / égalités (dén. ≤12)…",
  blurb: "Une mission CE2 : Fractions d'unité / égalités (dén. ≤12).",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Fractions d'unité / égalités (dén. ≤12)",
        statement: "Dans cette mission de CE2, tu vas travailler : Fractions d'unité / égalités (dén. ≤12). Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Fractions d'unité / égalités (dén. ≤12).",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Fractions d'unité / égalités (dén. ≤12).",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Fractions d'unité / égalités (dén. ≤12).",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Fractions d'unité / égalités (dén. ≤12).",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 1 sur 6 · Partie d’unité",
      progress: 1,
      expected: "1/4",
      distractors: ["1/3", "1/2"],
      copy: allUniverses({
        title: "Un quart",
        statement: "Tu partages une bande en 4 parts égales et tu en prends 1. Quelle fraction ?",
        hint: "1 part sur 4 → 1/4.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 2 sur 6 · Égalité",
      progress: 2,
      expected: "2/4",
      distractors: ["1/4", "3/4"],
      copy: {
        football: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale une moitié ?",
          hint: "2/4 = 1/2.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale une moitié ?",
          hint: "2/4 = 1/2.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale une moitié ?",
          hint: "2/4 = 1/2.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale une moitié ?",
          hint: "2/4 = 1/2.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Comparer",
      progress: 3,
      expected: "3/4",
      distractors: ["1/4", "2/4"],
      copy: allUniverses({
        title: "La plus grande",
        statement: "Parmi 1/4, 2/4, 3/4, laquelle est la plus grande ?",
        hint: "Même dénominateur : plus grand numérateur.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 4 sur 6 · Addition",
      progress: 4,
      expected: "3/5",
      distractors: ["2/5", "1/5"],
      copy: {
        football: {
          title: "Additionner",
          statement: "Calcule 1/5 + 2/5.",
          hint: "1+2=3, dénominateur 5.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Additionner",
          statement: "Calcule 1/5 + 2/5.",
          hint: "1+2=3, dénominateur 5.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Additionner",
          statement: "Calcule 1/5 + 2/5.",
          hint: "1+2=3, dénominateur 5.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Additionner",
          statement: "Calcule 1/5 + 2/5.",
          hint: "1+2=3, dénominateur 5.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 5 sur 6 · Sur la bande",
      progress: 5,
      expected: "3/6",
      distractors: ["1/6", "5/6"],
      copy: allUniverses({
        title: "Trois sixièmes",
        statement: "Tu colories 3 parts sur 6. Quelle fraction ?",
        hint: "3/6.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Égalités",
      progress: 6,
      expected: "2/6",
      distractors: ["1/6", "4/6"],
      copy: {
        football: {
          title: "Égal à 1/3",
          statement: "Quelle fraction égale 1/3 ?",
          hint: "2/6 = 1/3.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Égal à 1/3",
          statement: "Quelle fraction égale 1/3 ?",
          hint: "2/6 = 1/3.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Égal à 1/3",
          statement: "Quelle fraction égale 1/3 ?",
          hint: "2/6 = 1/3.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Égal à 1/3",
          statement: "Quelle fraction égale 1/3 ?",
          hint: "2/6 = 1/3.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Application",
      progress: 6,
      expected: "4/8",
      distractors: ["3/8", "5/8"],
      copy: {
        football: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale 1/2 ?",
          hint: "4/8 = 1/2.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale 1/2 ?",
          hint: "4/8 = 1/2.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale 1/2 ?",
          hint: "4/8 = 1/2.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Égal à 1/2",
          statement: "Quelle fraction égale 1/2 ?",
          hint: "4/8 = 1/2.",
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
        title: "Je progresse sur : Fractions d'unité / égalités (dén. ≤12)",
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
        statement: "Tu as travaillé « Fractions d'unité / égalités (dén. ≤12) » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
