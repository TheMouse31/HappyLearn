import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm1-maths-entiers-01";

/** CM1 / maths — Nombres entiers jusqu'à 999 999. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm1",
  subject: "maths",
  title: "Nombres entiers jusqu'à 999 999 en mission",
  blurb: "Une mission CM1 : Nombres entiers jusqu'à 999 999.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Nombres entiers jusqu'à 999 999",
        statement: "Dans cette mission de CM1, tu vas travailler : Nombres entiers jusqu'à 999 999. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Nombres entiers jusqu'à 999 999.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Nombres entiers jusqu'à 999 999.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Nombres entiers jusqu'à 999 999.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Nombres entiers jusqu'à 999 999.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Lire",
      progress: 1,
      expected: "240000",
      distractors: ["204000", "420000"],
      copy: allUniverses({
        title: "Deux cent quarante mille",
        statement: "240 milliers = ?",
        hint: "240000.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Comparer",
      progress: 2,
      expected: "505000",
      distractors: ["500500", "550000"],
      copy: {
        football: {
          title: "Lequel ?",
          statement: "Parmi ces nombres, 505000 ?",
          hint: "505000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Lequel ?",
          statement: "Parmi ces nombres, 505000 ?",
          hint: "505000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Lequel ?",
          statement: "Parmi ces nombres, 505000 ?",
          hint: "505000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Lequel ?",
          statement: "Parmi ces nombres, 505000 ?",
          hint: "505000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Classe",
      progress: 3,
      expected: "7",
      distractors: ["5", "2"],
      copy: allUniverses({
        title: "Centaines de mille",
        statement: "Dans 752 314, chiffre des centaines de mille ?",
        hint: "7.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Encadrer",
      progress: 4,
      expected: "entre 100000 et 200000",
      distractors: ["entre 0 et 100000", "entre 200000 et 300000"],
      copy: {
        football: {
          title: "Encadre 156 000",
          statement: "Entre quels centaines de mille ?",
          hint: "entre 100000 et 200000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Encadre 156 000",
          statement: "Entre quels centaines de mille ?",
          hint: "entre 100000 et 200000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Encadre 156 000",
          statement: "Entre quels centaines de mille ?",
          hint: "entre 100000 et 200000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Encadre 156 000",
          statement: "Entre quels centaines de mille ?",
          hint: "entre 100000 et 200000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Écrire",
      progress: 5,
      expected: "80080",
      distractors: ["80800", "88000"],
      copy: allUniverses({
        title: "8 myriades…",
        statement: "80 080 : écris 80080.",
        hint: "80080.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Comparer",
      progress: 6,
      expected: "999999 > 100000",
      distractors: ["100000 > 999999", "égaux"],
      copy: {
        football: {
          title: "Compare",
          statement: "Quelle comparaison est vraie ?",
          hint: "999999 est plus grand.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Compare",
          statement: "Quelle comparaison est vraie ?",
          hint: "999999 est plus grand.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Compare",
          statement: "Quelle comparaison est vraie ?",
          hint: "999999 est plus grand.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Compare",
          statement: "Quelle comparaison est vraie ?",
          hint: "999999 est plus grand.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "999999",
      distractors: ["1000000", "99999"],
      copy: {
        football: {
          title: "Plus grand ≤ 999999",
          statement: "Plus grand nombre ≤ 999 999 ?",
          hint: "999999.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Plus grand ≤ 999999",
          statement: "Plus grand nombre ≤ 999 999 ?",
          hint: "999999.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Plus grand ≤ 999999",
          statement: "Plus grand nombre ≤ 999 999 ?",
          hint: "999999.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Plus grand ≤ 999999",
          statement: "Plus grand nombre ≤ 999 999 ?",
          hint: "999999.",
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
        title: "Je progresse sur : Nombres entiers jusqu'à 999 999",
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
        statement: "Tu as travaillé « Nombres entiers jusqu'à 999 999 » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
