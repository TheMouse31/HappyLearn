import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm1-maths-decimaux-01";

/** CM1 / maths — Nombres décimaux (centièmes). Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm1",
  subject: "maths",
  title: "Nombres décimaux (centièmes) en mission",
  blurb: "Une mission CM1 : Nombres décimaux (centièmes).",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Nombres décimaux (centièmes)",
        statement: "Dans cette mission de CM1, tu vas travailler : Nombres décimaux (centièmes). Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Nombres décimaux (centièmes).",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Nombres décimaux (centièmes).",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Nombres décimaux (centièmes).",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Nombres décimaux (centièmes).",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Dixièmes",
      progress: 1,
      expected: "0,4",
      distractors: ["0,04", "4,0"],
      copy: allUniverses({
        title: "Quatre dixièmes",
        statement: "Quelle écriture pour 4/10 ?",
        hint: "4 dixièmes → 0,4.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Centièmes",
      progress: 2,
      expected: "0,25",
      distractors: ["0,025", "2,5"],
      copy: {
        football: {
          title: "Vingt-cinq centièmes",
          statement: "Quelle écriture pour 25/100 ?",
          hint: "0,25.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Vingt-cinq centièmes",
          statement: "Quelle écriture pour 25/100 ?",
          hint: "0,25.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Vingt-cinq centièmes",
          statement: "Quelle écriture pour 25/100 ?",
          hint: "0,25.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Vingt-cinq centièmes",
          statement: "Quelle écriture pour 25/100 ?",
          hint: "0,25.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Rang",
      progress: 3,
      expected: "7",
      distractors: ["3", "5"],
      copy: allUniverses({
        title: "Chiffre des dixièmes",
        statement: "Dans 3,75, quel chiffre est aux dixièmes ?",
        hint: "Juste après la virgule : 7.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Comparer",
      progress: 4,
      expected: "0,9",
      distractors: ["0,09", "0,009"],
      copy: {
        football: {
          title: "Le plus grand",
          statement: "Parmi 0,09 ; 0,9 ; 0,009, le plus grand ?",
          hint: "0,9.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Le plus grand",
          statement: "Parmi 0,09 ; 0,9 ; 0,009, le plus grand ?",
          hint: "0,9.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Le plus grand",
          statement: "Parmi 0,09 ; 0,9 ; 0,009, le plus grand ?",
          hint: "0,9.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Le plus grand",
          statement: "Parmi 0,09 ; 0,9 ; 0,009, le plus grand ?",
          hint: "0,9.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Écriture",
      progress: 5,
      expected: "1,5",
      distractors: ["1,05", "15"],
      copy: allUniverses({
        title: "Une unité et 5 dixièmes",
        statement: "Quelle écriture ?",
        hint: "1,5.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Ordre",
      progress: 6,
      expected: "0,2 < 0,5 < 1,2",
      distractors: ["0,5 < 0,2 < 1,2", "1,2 < 0,5 < 0,2"],
      copy: {
        football: {
          title: "Ordre croissant",
          statement: "Range 0,5 ; 1,2 ; 0,2.",
          hint: "0,2 < 0,5 < 1,2.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Ordre croissant",
          statement: "Range 0,5 ; 1,2 ; 0,2.",
          hint: "0,2 < 0,5 < 1,2.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Ordre croissant",
          statement: "Range 0,5 ; 1,2 ; 0,2.",
          hint: "0,2 < 0,5 < 1,2.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Ordre croissant",
          statement: "Range 0,5 ; 1,2 ; 0,2.",
          hint: "0,2 < 0,5 < 1,2.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "2,4",
      distractors: ["2,04", "24"],
      copy: {
        football: {
          title: "Lecture finale",
          statement: "2 unités et 4 dixièmes s’écrivent…",
          hint: "2,4.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Lecture finale",
          statement: "2 unités et 4 dixièmes s’écrivent…",
          hint: "2,4.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Lecture finale",
          statement: "2 unités et 4 dixièmes s’écrivent…",
          hint: "2,4.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Lecture finale",
          statement: "2 unités et 4 dixièmes s’écrivent…",
          hint: "2,4.",
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
        title: "Je progresse sur : Nombres décimaux (centièmes)",
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
        statement: "Tu as travaillé « Nombres décimaux (centièmes) » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
