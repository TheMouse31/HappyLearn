import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce1-maths-entiers-01";

/** CE1 / maths — Nombres entiers jusqu'à 1 000. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce1",
  subject: "maths",
  title: "Nombres entiers jusqu'à 1 000 en mission",
  blurb: "Une mission CE1 : Nombres entiers jusqu'à 1 000.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Nombres entiers jusqu'à 1 000",
        statement: "Dans cette mission de CE1, tu vas travailler : Nombres entiers jusqu'à 1 000. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Nombres entiers jusqu'à 1 000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Nombres entiers jusqu'à 1 000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Nombres entiers jusqu'à 1 000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Nombres entiers jusqu'à 1 000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Lire",
      progress: 1,
      expected: "305",
      distractors: ["350", "35"],
      copy: allUniverses({
        title: "Trois cent cinq",
        statement: "Quel nombre : 3 centaines, 0 dizaine, 5 unités ?",
        hint: "305.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Comparer",
      progress: 2,
      expected: "890",
      distractors: ["809", "898"],
      copy: {
        football: {
          title: "Le plus grand",
          statement: "Parmi 809, 890, 898… lequel est 890 ? Attendu 890 vs distracteurs.",
          hint: "890 est entre 809 et 898.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Le plus grand",
          statement: "Parmi 809, 890, 898… lequel est 890 ? Attendu 890 vs distracteurs.",
          hint: "890 est entre 809 et 898.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Le plus grand",
          statement: "Parmi 809, 890, 898… lequel est 890 ? Attendu 890 vs distracteurs.",
          hint: "890 est entre 809 et 898.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Le plus grand",
          statement: "Parmi 809, 890, 898… lequel est 890 ? Attendu 890 vs distracteurs.",
          hint: "890 est entre 809 et 898.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Décomposer",
      progress: 3,
      expected: "7",
      distractors: ["6", "8"],
      copy: allUniverses({
        title: "Centaines",
        statement: "Dans 734, chiffre des centaines ?",
        hint: "7.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Suite",
      progress: 4,
      expected: "1000",
      distractors: ["999", "1001"],
      copy: {
        football: {
          title: "Mille",
          statement: "Quel nombre vient après 999 ?",
          hint: "1000.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Mille",
          statement: "Quel nombre vient après 999 ?",
          hint: "1000.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Mille",
          statement: "Quel nombre vient après 999 ?",
          hint: "1000.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Mille",
          statement: "Quel nombre vient après 999 ?",
          hint: "1000.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Comparer",
      progress: 5,
      expected: "650 > 560",
      distractors: ["560 > 650", "650 = 560"],
      copy: allUniverses({
        title: "Compare",
        statement: "Quelle comparaison est vraie ?",
        hint: "650 est plus grand.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Écrire",
      progress: 6,
      expected: "420",
      distractors: ["402", "240"],
      copy: {
        football: {
          title: "4 centaines 2 dizaines",
          statement: "Quel nombre ?",
          hint: "420.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "4 centaines 2 dizaines",
          statement: "Quel nombre ?",
          hint: "420.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "4 centaines 2 dizaines",
          statement: "Quel nombre ?",
          hint: "420.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "4 centaines 2 dizaines",
          statement: "Quel nombre ?",
          hint: "420.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "999",
      distractors: ["909", "990"],
      copy: {
        football: {
          title: "Le plus grand ≤ 1000",
          statement: "Quel est le plus grand nombre à 3 chiffres ?",
          hint: "999.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Le plus grand ≤ 1000",
          statement: "Quel est le plus grand nombre à 3 chiffres ?",
          hint: "999.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Le plus grand ≤ 1000",
          statement: "Quel est le plus grand nombre à 3 chiffres ?",
          hint: "999.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Le plus grand ≤ 1000",
          statement: "Quel est le plus grand nombre à 3 chiffres ?",
          hint: "999.",
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
        title: "Je progresse sur : Nombres entiers jusqu'à 1 000",
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
        statement: "Tu as travaillé « Nombres entiers jusqu'à 1 000 » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
