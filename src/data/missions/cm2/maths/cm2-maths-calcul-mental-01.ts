import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-calcul-mental-01";

/** CM2 / maths — Calcul mental et automatismes. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Calcul mental et automatismes en mission",
  blurb: "Une mission CM2 : Calcul mental et automatismes.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Calcul mental et automatismes",
        statement: "Dans cette mission de CM2, tu vas travailler : Calcul mental et automatismes. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Calcul mental et automatismes.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Calcul mental et automatismes.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Calcul mental et automatismes.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Calcul mental et automatismes.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · ×10",
      progress: 1,
      expected: "370",
      distractors: ["37", "3700"],
      copy: allUniverses({
        title: "37 × 10",
        statement: "Calcule 37 × 10.",
        hint: "370.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · ×100",
      progress: 2,
      expected: "4500",
      distractors: ["450", "45000"],
      copy: {
        football: {
          title: "45 × 100",
          statement: "Calcule 45 × 100.",
          hint: "4500.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "45 × 100",
          statement: "Calcule 45 × 100.",
          hint: "4500.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "45 × 100",
          statement: "Calcule 45 × 100.",
          hint: "4500.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "45 × 100",
          statement: "Calcule 45 × 100.",
          hint: "4500.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Double",
      progress: 3,
      expected: "86",
      distractors: ["76", "96"],
      copy: allUniverses({
        title: "Double de 43",
        statement: "Quel est le double de 43 ?",
        hint: "86.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Moitié",
      progress: 4,
      expected: "36",
      distractors: ["32", "40"],
      copy: {
        football: {
          title: "Moitié de 72",
          statement: "Quelle est la moitié de 72 ?",
          hint: "36.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Moitié de 72",
          statement: "Quelle est la moitié de 72 ?",
          hint: "36.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Moitié de 72",
          statement: "Quelle est la moitié de 72 ?",
          hint: "36.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Moitié de 72",
          statement: "Quelle est la moitié de 72 ?",
          hint: "36.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Complément",
      progress: 5,
      expected: "375",
      distractors: ["325", "425"],
      copy: allUniverses({
        title: "Vers 1000",
        statement: "625 + ? = 1000. Écris le complément.",
        hint: "375.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Réfléchi",
      progress: 6,
      expected: "150",
      distractors: ["140", "160"],
      copy: {
        football: {
          title: "3 × 50",
          statement: "Calcule 3 × 50.",
          hint: "150.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "3 × 50",
          statement: "Calcule 3 × 50.",
          hint: "150.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "3 × 50",
          statement: "Calcule 3 × 50.",
          hint: "150.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "3 × 50",
          statement: "Calcule 3 × 50.",
          hint: "150.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "240",
      distractors: ["200", "280"],
      copy: {
        football: {
          title: "8 × 30",
          statement: "Calcule 8 × 30.",
          hint: "240.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "8 × 30",
          statement: "Calcule 8 × 30.",
          hint: "240.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "8 × 30",
          statement: "Calcule 8 × 30.",
          hint: "240.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "8 × 30",
          statement: "Calcule 8 × 30.",
          hint: "240.",
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
        title: "Je progresse sur : Calcul mental et automatismes",
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
        statement: "Tu as travaillé « Calcul mental et automatismes » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
