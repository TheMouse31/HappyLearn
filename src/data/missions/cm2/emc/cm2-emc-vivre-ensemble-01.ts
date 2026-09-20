import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-emc-vivre-ensemble-01";

/** CM2 / emc — EMC — Règle droit jugement engagement. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "emc",
  title: "Règle droit jugement engagement en mission",
  blurb: "Une mission CM2 : EMC — Règle droit jugement engagement.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : EMC — Règle droit jugement engagement",
        statement: "Dans cette mission de CM2, tu vas travailler : EMC — Règle droit jugement engagement. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : EMC — Règle droit jugement engagement.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : EMC — Règle droit jugement engagement.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : EMC — Règle droit jugement engagement.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : EMC — Règle droit jugement engagement.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Règle",
      progress: 1,
      expected: "respecter les autres",
      distractors: ["insulter", "bousculer"],
      copy: allUniverses({
        title: "Classe",
        statement: "Une règle importante en classe ?",
        hint: "respecter les autres.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Droit",
      progress: 2,
      expected: "s’exprimer",
      distractors: ["nuire", "voler"],
      copy: {
        football: {
          title: "Liberté",
          statement: "Un droit de l’élève est de…",
          hint: "s’exprimer.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Liberté",
          statement: "Un droit de l’élève est de…",
          hint: "s’exprimer.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Liberté",
          statement: "Un droit de l’élève est de…",
          hint: "s’exprimer.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Liberté",
          statement: "Un droit de l’élève est de…",
          hint: "s’exprimer.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Jugement",
      progress: 3,
      expected: "écouter",
      distractors: ["interrompre", "se moquer"],
      copy: allUniverses({
        title: "Débat",
        statement: "Dans un débat, on doit…",
        hint: "écouter.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Engagement",
      progress: 4,
      expected: "aider",
      distractors: ["ignorer", "exclure"],
      copy: {
        football: {
          title: "Solidarité",
          statement: "Un geste d’engagement ?",
          hint: "aider.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Solidarité",
          statement: "Un geste d’engagement ?",
          hint: "aider.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Solidarité",
          statement: "Un geste d’engagement ?",
          hint: "aider.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Solidarité",
          statement: "Un geste d’engagement ?",
          hint: "aider.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Émotion",
      progress: 5,
      expected: "nommer son émotion",
      distractors: ["cacher toujours", "crier"],
      copy: allUniverses({
        title: "Sensibilité",
        statement: "Face à une émotion, on peut…",
        hint: "nommer son émotion.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Coopération",
      progress: 6,
      expected: "ensemble",
      distractors: ["tout seul contre les autres", "sans écouter"],
      copy: {
        football: {
          title: "Projet",
          statement: "Coopérer, c’est travailler…",
          hint: "ensemble.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Projet",
          statement: "Coopérer, c’est travailler…",
          hint: "ensemble.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Projet",
          statement: "Coopérer, c’est travailler…",
          hint: "ensemble.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Projet",
          statement: "Coopérer, c’est travailler…",
          hint: "ensemble.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "politesse",
      distractors: ["moquerie", "exclusion"],
      copy: {
        football: {
          title: "Vivre ensemble",
          statement: "Dire bonjour est un geste de…",
          hint: "politesse.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Vivre ensemble",
          statement: "Dire bonjour est un geste de…",
          hint: "politesse.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Vivre ensemble",
          statement: "Dire bonjour est un geste de…",
          hint: "politesse.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Vivre ensemble",
          statement: "Dire bonjour est un geste de…",
          hint: "politesse.",
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
        title: "Je progresse sur : EMC — Règle droit jugement engagement",
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
        statement: "Tu as travaillé « EMC — Règle droit jugement engagement » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
