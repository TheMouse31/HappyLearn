import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "ce2-maths-geometrie-01";

/** CE2 / maths — Géométrie (losange symétrie patron). Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "ce2",
  subject: "maths",
  title: "Géométrie (losange symétrie patron) en mission",
  blurb: "Une mission CE2 : Géométrie (losange symétrie patron).",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Géométrie (losange symétrie patron)",
        statement: "Dans cette mission de CE2, tu vas travailler : Géométrie (losange symétrie patron). Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Géométrie (losange symétrie patron).",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Géométrie (losange symétrie patron).",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Géométrie (losange symétrie patron).",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Géométrie (losange symétrie patron).",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Figure",
      progress: 1,
      expected: "carré",
      distractors: ["rectangle", "triangle"],
      copy: allUniverses({
        title: "4 côtés égaux + 4 angles droits",
        statement: "Quelle figure ?",
        hint: "carré.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Symétrie",
      progress: 2,
      expected: "oui",
      distractors: ["non", "parfois"],
      copy: {
        football: {
          title: "Axe",
          statement: "Un carré a-t-il un axe de symétrie ?",
          hint: "Oui.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Axe",
          statement: "Un carré a-t-il un axe de symétrie ?",
          hint: "Oui.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Axe",
          statement: "Un carré a-t-il un axe de symétrie ?",
          hint: "Oui.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Axe",
          statement: "Un carré a-t-il un axe de symétrie ?",
          hint: "Oui.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Côtés",
      progress: 3,
      expected: "6",
      distractors: ["5", "8"],
      copy: allUniverses({
        title: "Hexagone",
        statement: "Combien de côtés a un hexagone ?",
        hint: "6.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Angle",
      progress: 4,
      expected: "angle droit",
      distractors: ["angle aigu", "angle obtus"],
      copy: {
        football: {
          title: "90°",
          statement: "Comment appelle-t-on un angle de 90° ?",
          hint: "angle droit.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "90°",
          statement: "Comment appelle-t-on un angle de 90° ?",
          hint: "angle droit.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "90°",
          statement: "Comment appelle-t-on un angle de 90° ?",
          hint: "angle droit.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "90°",
          statement: "Comment appelle-t-on un angle de 90° ?",
          hint: "angle droit.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Losange",
      progress: 5,
      expected: "4 côtés égaux",
      distractors: ["4 angles droits", "3 côtés"],
      copy: allUniverses({
        title: "Losange",
        statement: "Un losange a…",
        hint: "4 côtés égaux.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Patron",
      progress: 6,
      expected: "patron",
      distractors: ["perspective", "droite"],
      copy: {
        football: {
          title: "Solide déplié",
          statement: "Le dessin déplié d’un solide s’appelle…",
          hint: "patron.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Solide déplié",
          statement: "Le dessin déplié d’un solide s’appelle…",
          hint: "patron.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Solide déplié",
          statement: "Le dessin déplié d’un solide s’appelle…",
          hint: "patron.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Solide déplié",
          statement: "Le dessin déplié d’un solide s’appelle…",
          hint: "patron.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "symétrie",
      distractors: ["translation", "rotation"],
      copy: {
        football: {
          title: "Miroir",
          statement: "Reporter une figure comme dans un miroir : quelle transformation ?",
          hint: "symétrie.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Miroir",
          statement: "Reporter une figure comme dans un miroir : quelle transformation ?",
          hint: "symétrie.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Miroir",
          statement: "Reporter une figure comme dans un miroir : quelle transformation ?",
          hint: "symétrie.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Miroir",
          statement: "Reporter une figure comme dans un miroir : quelle transformation ?",
          hint: "symétrie.",
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
        title: "Je progresse sur : Géométrie (losange symétrie patron)",
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
        statement: "Tu as travaillé « Géométrie (losange symétrie patron) » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
