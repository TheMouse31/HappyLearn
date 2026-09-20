import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-decimaux-01";

/**
 * CM2 maths — Nombres décimaux jusqu’aux millièmes.
 * Trame standard Happy Learn (Phase A).
 * Les réponses décimales utilisent le kind `choice` (virgule FR) pour rester
 * robustes face à la normalisation cahier (virgule → slash).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Décimaux en mission",
  blurb: "Lire, écrire et comparer des nombres décimaux jusqu’aux millièmes.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "La virgule décimale",
        statement:
          "Un nombre décimal sépare les unités entières et les parts plus petites : dixièmes, centièmes, millièmes. Exemple : 3,25 = 3 + 2 dixièmes + 5 centièmes.",
        note: "Dans cette mission, tu choisiras souvent la bonne écriture parmi des propositions.",
        caption: "La virgule sépare entiers et parties décimales.",
      }),
    },
    {
      kind: "continue",
      kicker: "Mise en action",
      progress: 0,
      copy: {
        football: {
          title: "Tu entres en jeu",
          statement:
            "Les capteurs du stade affichent des distances avec une virgule. Tu dois les lire sans te tromper de rang.",
          caption: "Des nombres à virgule s’affichent sur le tableau.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "Le schéma de jeu indique des distances décimales. Chaque chiffre après la virgule compte.",
          caption: "Des nombres à virgule s’affichent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Les bornes du sentier indiquent des kilomètres décimaux. Tu dois lire chaque rang.",
          caption: "Des nombres à virgule apparaissent sur les bornes.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "La console affiche des distances décimales. Un chiffre mal lu décale la trajectoire.",
          caption: "Des nombres à virgule s’affichent.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Maîtrise la virgule",
          statement:
            "Relie fractions décimales et écriture à virgule, compare les nombres et repère dixièmes, centièmes, millièmes.",
          caption: "Les rangs décimaux s’allument.",
        },
        rugby: {
          title: "Maîtrise la virgule",
          statement:
            "Relie fractions décimales et écriture à virgule, puis compare pour choisir le bon couloir.",
          caption: "Les rangs décimaux s’allument.",
        },
        equitation: {
          title: "Maîtrise la virgule",
          statement:
            "Relie fractions décimales et écriture à virgule pour choisir la bonne allure entre les bornes.",
          caption: "Les rangs décimaux s’allument.",
        },
        espace: {
          title: "Maîtrise la virgule",
          statement:
            "Relie fractions décimales et écriture à virgule pour caler la trajectoire au millième près.",
          caption: "Les rangs décimaux s’allument.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Fraction → décimal",
      progress: 1,
      expected: "0,3",
      distractors: ["0,03", "3,0"],
      copy: allUniverses({
        title: "Trois dixièmes",
        statement: "Quelle écriture à virgule correspond à la fraction 3/10 ?",
        hint: "3 dixièmes s’écrivent 0,3 : le 3 est juste après la virgule.",
        caption: "3/10 = 0,3.",
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
          statement:
            "Une course mesure 25/100 de terrain. Quelle écriture décimale choisir ?",
          hint: "25 centièmes = 0,25. Le 2 est aux dixièmes, le 5 aux centièmes.",
          caption: "25/100 = 0,25.",
        },
        rugby: {
          title: "Vingt-cinq centièmes",
          statement:
            "Une avancée mesure 25/100 de couloir. Quelle écriture décimale ?",
          hint: "25/100 = 0,25.",
          caption: "25/100 = 0,25.",
        },
        equitation: {
          title: "Vingt-cinq centièmes",
          statement:
            "Un tronçon mesure 25/100 du parcours. Quelle écriture décimale ?",
          hint: "25/100 = 0,25.",
          caption: "25/100 = 0,25.",
        },
        espace: {
          title: "Vingt-cinq centièmes",
          statement:
            "Un segment mesure 25/100 d’unité. Quelle écriture décimale ?",
          hint: "25/100 = 0,25.",
          caption: "25/100 = 0,25.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Millièmes",
      progress: 3,
      expected: "0,007",
      distractors: ["0,07", "0,7"],
      copy: allUniverses({
        title: "Sept millièmes",
        statement: "Quelle écriture à virgule correspond à 7/1000 ?",
        hint: "Le 7 doit être au rang des millièmes : trois chiffres après la virgule → 0,007.",
        caption: "7/1000 = 0,007.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Lire un rang",
      progress: 4,
      expected: "6",
      distractors: ["4", "5"],
      copy: allUniverses({
        title: "Chiffre des centièmes",
        statement: "Dans le nombre 4,568, quel chiffre est au rang des centièmes ?",
        hint: "Après la virgule : 5 = dixièmes, 6 = centièmes, 8 = millièmes.",
        caption: "Le 6 est aux centièmes.",
        note: "Dixièmes → 1er chiffre ; centièmes → 2e ; millièmes → 3e.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Comparer",
      progress: 5,
      expected: "0,8",
      distractors: ["0,08", "0,008"],
      copy: allUniverses({
        title: "Le plus grand",
        statement: "Parmi 0,08 ; 0,8 et 0,008, quel nombre est le plus grand ?",
        hint: "Aligne les rangs : 0,800 ; 0,080 ; 0,008. Compare chiffre par chiffre après la virgule.",
        caption: "0,8 est le plus grand.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Ordre croissant",
      progress: 6,
      expected: "0,09 < 0,9 < 1,09",
      distractors: ["0,9 < 0,09 < 1,09", "1,09 < 0,9 < 0,09"],
      copy: {
        football: {
          title: "Range les distances",
          statement: "Range ces distances dans l’ordre croissant : 0,9 ; 1,09 ; 0,09.",
          hint: "0,09 est le plus petit, puis 0,9, puis 1,09 (plus grand que 1).",
          caption: "0,09 < 0,9 < 1,09.",
        },
        rugby: {
          title: "Range les distances",
          statement: "Range dans l’ordre croissant : 0,9 ; 1,09 ; 0,09.",
          hint: "Commence par le plus petit : 0,09.",
          caption: "0,09 < 0,9 < 1,09.",
        },
        equitation: {
          title: "Range les distances",
          statement: "Range dans l’ordre croissant : 0,9 ; 1,09 ; 0,09.",
          hint: "0,09 < 0,9 < 1,09.",
          caption: "0,09 < 0,9 < 1,09.",
        },
        espace: {
          title: "Range les distances",
          statement: "Range dans l’ordre croissant : 0,9 ; 1,09 ; 0,09.",
          hint: "0,09 < 0,9 < 1,09.",
          caption: "0,09 < 0,9 < 1,09.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "2,35",
      distractors: ["2,035", "2,53"],
      copy: {
        football: {
          title: "Lecture finale",
          statement:
            "Le coach annonce « 2 unités, 3 dixièmes et 5 centièmes ». Quelle écriture décimale choisis-tu ?",
          hint: "2 + 0,3 + 0,05 = 2,35.",
          caption: "Tu valides 2,35.",
        },
        rugby: {
          title: "Lecture finale",
          statement:
            "Le schéma indique 2 unités, 3 dixièmes et 5 centièmes. Quelle écriture ?",
          hint: "2,35.",
          caption: "Tu valides 2,35.",
        },
        equitation: {
          title: "Lecture finale",
          statement:
            "La borne indique 2 unités, 3 dixièmes et 5 centièmes. Quelle écriture ?",
          hint: "2,35.",
          caption: "Tu valides 2,35.",
        },
        espace: {
          title: "Lecture finale",
          statement:
            "La console indique 2 unités, 3 dixièmes et 5 centièmes. Quelle écriture ?",
          hint: "2,35.",
          caption: "Tu valides 2,35.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Mesures lues !",
          statement:
            "Tu as lu chaque rang décimal sans erreur. L’équipe se place au centimètre près.",
          caption: "La virgule n’a plus de secret.",
        },
        rugby: {
          title: "Mesures lues !",
          statement:
            "Tes lectures décimales ont calé le bon couloir. La phase peut partir.",
          caption: "La virgule n’a plus de secret.",
        },
        equitation: {
          title: "Mesures lues !",
          statement:
            "Les bornes décimales sont comprises. Le cheval avance juste.",
          caption: "La virgule n’a plus de secret.",
        },
        espace: {
          title: "Mesures lues !",
          statement:
            "La trajectoire est calée au millième. L’approche finale est stable.",
          caption: "La virgule n’a plus de secret.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais lire et comparer des décimaux",
        statement: "Chaque chiffre après la virgule a un rang précis.",
        note: "1. Dixièmes, centièmes, millièmes (dans cet ordre). 2. 3/10 = 0,3 ; 25/100 = 0,25 ; 7/1000 = 0,007. 3. Pour comparer : aligner les rangs puis comparer chiffre à chiffre.",
        caption: "Tu pourras réutiliser cette méthode dans une autre mission.",
      }),
    },
    {
      kind: "bilan",
      kicker: "Bilan sans note",
      progress: 6,
      copy: allUniverses({
        title: "Ton bilan",
        statement:
          "Tu sais relier une fraction décimale à une écriture à virgule, lire les rangs et comparer des nombres décimaux jusqu’aux millièmes.",
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
          statement:
            "Au prochain match, tu manipuleras de très grands nombres entiers pour lire les statistiques du stade.",
          caption: "De grands nombres apparaissent au tableau.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine rencontre demandera de lire et d’écrire de très grands nombres entiers.",
          caption: "De grands nombres apparaissent au schéma.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain parcours, les distances s’écriront avec de très grands nombres entiers.",
          caption: "De grands nombres apparaissent sur une borne.",
        },
        espace: {
          title: "Signal grands nombres",
          statement:
            "La console bascule vers de très grands nombres entiers pour la prochaine mission.",
          caption: "De grands nombres clignotent.",
        },
      },
    },
  ],
});
