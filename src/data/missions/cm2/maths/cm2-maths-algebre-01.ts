import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-algebre-01";

/** CM2 / maths — Initiation pensée algébrique. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Initiation pensée algébrique en mission",
  blurb: "Une mission CM2 : Initiation pensée algébrique.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Initiation pensée algébrique",
        statement: "Dans cette mission de CM2, tu vas travailler : Initiation pensée algébrique. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Initiation pensée algébrique.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Initiation pensée algébrique.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Initiation pensée algébrique.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Initiation pensée algébrique.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Suite",
      progress: 1,
      expected: "14",
      distractors: ["12", "16"],
      copy: allUniverses({
        title: "Suite +3",
        statement: "Suite : 5, 8, 11, … Quel suivant ?",
        hint: "14.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Suite",
      progress: 2,
      expected: "32",
      distractors: ["30", "34"],
      copy: {
        football: {
          title: "Suite ×2",
          statement: "Suite : 4, 8, 16, … Quel suivant ?",
          hint: "32.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Suite ×2",
          statement: "Suite : 4, 8, 16, … Quel suivant ?",
          hint: "32.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Suite ×2",
          statement: "Suite : 4, 8, 16, … Quel suivant ?",
          hint: "32.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Suite ×2",
          statement: "Suite : 4, 8, 16, … Quel suivant ?",
          hint: "32.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Symbole",
      progress: 3,
      expected: "=",
      distractors: ["+", "×"],
      copy: allUniverses({
        title: "Égalité",
        statement: "Quel symbole pour « est égal à » ?",
        hint: "=",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Égalité",
      progress: 4,
      expected: "9",
      distractors: ["8", "10"],
      copy: {
        football: {
          title: "Trouer",
          statement: "4 + ? = 13. Quel nombre ?",
          hint: "9.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Trouer",
          statement: "4 + ? = 13. Quel nombre ?",
          hint: "9.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Trouer",
          statement: "4 + ? = 13. Quel nombre ?",
          hint: "9.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Trouer",
          statement: "4 + ? = 13. Quel nombre ?",
          hint: "9.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Programme",
      progress: 5,
      expected: "20",
      distractors: ["18", "22"],
      copy: allUniverses({
        title: "×2 puis +4",
        statement: "On part de 8 : ×2 puis +4. Résultat ?",
        hint: "8×2+4=20.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Programme",
      progress: 6,
      expected: "15",
      distractors: ["12", "18"],
      copy: {
        football: {
          title: "+5 puis ×1",
          statement: "On part de 10 : +5. Résultat ?",
          hint: "15.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "+5 puis ×1",
          statement: "On part de 10 : +5. Résultat ?",
          hint: "15.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "+5 puis ×1",
          statement: "On part de 10 : +5. Résultat ?",
          hint: "15.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "+5 puis ×1",
          statement: "On part de 10 : +5. Résultat ?",
          hint: "15.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "21",
      distractors: ["18", "24"],
      copy: {
        football: {
          title: "Suite +4",
          statement: "Suite : 9, 13, 17, … Quel suivant ?",
          hint: "21.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Suite +4",
          statement: "Suite : 9, 13, 17, … Quel suivant ?",
          hint: "21.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Suite +4",
          statement: "Suite : 9, 13, 17, … Quel suivant ?",
          hint: "21.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Suite +4",
          statement: "Suite : 9, 13, 17, … Quel suivant ?",
          hint: "21.",
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
        title: "Je progresse sur : Initiation pensée algébrique",
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
        statement: "Tu as travaillé « Initiation pensée algébrique » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
