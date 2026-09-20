import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce2-maths-entiers-01";

/** CE2 / maths — Nombres entiers jusqu'à 10 000. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce2",
  subject: "maths",
  title: "Nombres entiers jusqu'à 10 000 en mission",
  blurb: "Une mission CE2 : Nombres entiers jusqu'à 10 000.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Nombres entiers jusqu'à 10 000",
        statement: "Dans cette mission de CE2, tu vas travailler : Nombres entiers jusqu'à 10 000. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Nombres entiers jusqu'à 10 000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Nombres entiers jusqu'à 10 000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Nombres entiers jusqu'à 10 000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Nombres entiers jusqu'à 10 000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Lire",
      progress: 1,
      expected: "4500",
      distractors: ["4050", "5400"],
      copy: allUniverses({
        title: "Quatre mille cinq cents",
        statement: "4 milliers et 5 centaines = ?",
        hint: "4500.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Comparer",
      progress: 2,
      expected: "7800",
      distractors: ["7080", "8700"],
      copy: {
        football: {
          title: "Le plus grand parmi…",
          statement: "Parmi 7080, 7800, 8700, lequel vaut sept mille huit cents ?",
          hint: "7800.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Le plus grand parmi…",
          statement: "Parmi 7080, 7800, 8700, lequel vaut sept mille huit cents ?",
          hint: "7800.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Le plus grand parmi…",
          statement: "Parmi 7080, 7800, 8700, lequel vaut sept mille huit cents ?",
          hint: "7800.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Le plus grand parmi…",
          statement: "Parmi 7080, 7800, 8700, lequel vaut sept mille huit cents ?",
          hint: "7800.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Décomposer",
      progress: 3,
      expected: "3",
      distractors: ["2", "4"],
      copy: allUniverses({
        title: "Milliers",
        statement: "Dans 3652, chiffre des milliers ?",
        hint: "3.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Suite",
      progress: 4,
      expected: "10000",
      distractors: ["9999", "10001"],
      copy: {
        football: {
          title: "Dix mille",
          statement: "Après 9999 ?",
          hint: "10000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Dix mille",
          statement: "Après 9999 ?",
          hint: "10000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Dix mille",
          statement: "Après 9999 ?",
          hint: "10000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Dix mille",
          statement: "Après 9999 ?",
          hint: "10000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Encadrer",
      progress: 5,
      expected: "entre 3000 et 4000",
      distractors: ["entre 2000 et 3000", "entre 4000 et 5000"],
      copy: allUniverses({
        title: "Encadre 3520",
        statement: "Entre quels milliers ?",
        hint: "3520 est entre 3000 et 4000.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Écrire",
      progress: 6,
      expected: "6060",
      distractors: ["6006", "6600"],
      copy: {
        football: {
          title: "6 milliers 6 dizaines",
          statement: "Quel nombre ?",
          hint: "6060.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "6 milliers 6 dizaines",
          statement: "Quel nombre ?",
          hint: "6060.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "6 milliers 6 dizaines",
          statement: "Quel nombre ?",
          hint: "6060.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "6 milliers 6 dizaines",
          statement: "Quel nombre ?",
          hint: "6060.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "9999",
      distractors: ["9099", "9909"],
      copy: {
        football: {
          title: "Plus grand ≤ 10000",
          statement: "Plus grand nombre à 4 chiffres ?",
          hint: "9999.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Plus grand ≤ 10000",
          statement: "Plus grand nombre à 4 chiffres ?",
          hint: "9999.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Plus grand ≤ 10000",
          statement: "Plus grand nombre à 4 chiffres ?",
          hint: "9999.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Plus grand ≤ 10000",
          statement: "Plus grand nombre à 4 chiffres ?",
          hint: "9999.",
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
        title: "Je progresse sur : Nombres entiers jusqu'à 10 000",
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
        statement: "Tu as travaillé « Nombres entiers jusqu'à 10 000 » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
