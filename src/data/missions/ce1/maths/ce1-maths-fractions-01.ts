import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce1-maths-fractions-01";

/** CE1 / maths — Fractions partie d'un tout. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce1",
  subject: "maths",
  title: "Fractions partie d'un tout en mission",
  blurb: "Une mission CE1 : Fractions partie d'un tout.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Fractions partie d'un tout",
        statement: "Dans cette mission de CE1, tu vas travailler : Fractions partie d'un tout. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Fractions partie d'un tout.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Fractions partie d'un tout.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Fractions partie d'un tout.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Fractions partie d'un tout.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 1 sur 6 · Moitié",
      progress: 1,
      expected: "1/2",
      distractors: ["1/3", "1/4"],
      copy: allUniverses({
        title: "Une moitié",
        statement: "Tu partages un gâteau en 2 parts égales et tu en prends 1. Quelle fraction ?",
        hint: "1 part sur 2 → 1/2.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 2 sur 6 · Tiers",
      progress: 2,
      expected: "1/3",
      distractors: ["1/2", "1/4"],
      copy: {
        football: {
          title: "Un tiers",
          statement: "Tu partages en 3 parts égales et tu en prends 1. Quelle fraction ?",
          hint: "1/3.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Un tiers",
          statement: "Tu partages en 3 parts égales et tu en prends 1. Quelle fraction ?",
          hint: "1/3.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Un tiers",
          statement: "Tu partages en 3 parts égales et tu en prends 1. Quelle fraction ?",
          hint: "1/3.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Un tiers",
          statement: "Tu partages en 3 parts égales et tu en prends 1. Quelle fraction ?",
          hint: "1/3.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 3 sur 6 · Quart",
      progress: 3,
      expected: "1/4",
      distractors: ["1/2", "1/3"],
      copy: allUniverses({
        title: "Un quart",
        statement: "Tu partages en 4 parts égales et tu en prends 1. Quelle fraction ?",
        hint: "1/4.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Comparer",
      progress: 4,
      expected: "1/2",
      distractors: ["1/3", "1/4"],
      copy: {
        football: {
          title: "La plus grande part",
          statement: "Quelle part est la plus grande : 1/2, 1/3 ou 1/4 ?",
          hint: "Plus le dénominateur est petit (parts égales d’un même tout), plus la part unitaire est grande.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "La plus grande part",
          statement: "Quelle part est la plus grande : 1/2, 1/3 ou 1/4 ?",
          hint: "Plus le dénominateur est petit (parts égales d’un même tout), plus la part unitaire est grande.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "La plus grande part",
          statement: "Quelle part est la plus grande : 1/2, 1/3 ou 1/4 ?",
          hint: "Plus le dénominateur est petit (parts égales d’un même tout), plus la part unitaire est grande.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "La plus grande part",
          statement: "Quelle part est la plus grande : 1/2, 1/3 ou 1/4 ?",
          hint: "Plus le dénominateur est petit (parts égales d’un même tout), plus la part unitaire est grande.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 5 sur 6 · Coloriage",
      progress: 5,
      expected: "2/4",
      distractors: ["1/4", "3/4"],
      copy: allUniverses({
        title: "Deux quarts",
        statement: "Tu colories 2 cases sur 4. Quelle fraction ?",
        hint: "2/4.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Moitié d’un tout",
      progress: 6,
      expected: "1/2",
      distractors: ["2/2", "0/2"],
      copy: {
        football: {
          title: "Repère la moitié",
          statement: "Quelle fraction représente une moitié ?",
          hint: "1/2.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Repère la moitié",
          statement: "Quelle fraction représente une moitié ?",
          hint: "1/2.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Repère la moitié",
          statement: "Quelle fraction représente une moitié ?",
          hint: "1/2.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Repère la moitié",
          statement: "Quelle fraction représente une moitié ?",
          hint: "1/2.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Application",
      progress: 6,
      expected: "1/4",
      distractors: ["1/2", "3/4"],
      copy: {
        football: {
          title: "Un quart du parcours",
          statement: "Tu as fait un quart du chemin. Quelle fraction ?",
          hint: "1/4.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Un quart du parcours",
          statement: "Tu as fait un quart du chemin. Quelle fraction ?",
          hint: "1/4.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Un quart du parcours",
          statement: "Tu as fait un quart du chemin. Quelle fraction ?",
          hint: "1/4.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Un quart du parcours",
          statement: "Tu as fait un quart du chemin. Quelle fraction ?",
          hint: "1/4.",
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
        title: "Je progresse sur : Fractions partie d'un tout",
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
        statement: "Tu as travaillé « Fractions partie d'un tout » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
