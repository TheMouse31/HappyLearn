import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-sciences-matiere-01";

/** CM2 / sciences — Sciences — Matière. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "sciences",
  title: "Matière en mission",
  blurb: "Une mission CM2 : Sciences — Matière.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Sciences — Matière",
        statement: "Dans cette mission de CM2, tu vas travailler : Sciences — Matière. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Sciences — Matière.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Sciences — Matière.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Sciences — Matière.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Sciences — Matière.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · État",
      progress: 1,
      expected: "solide",
      distractors: ["verbe", "angle"],
      copy: allUniverses({
        title: "Glace",
        statement: "La glace est un état…",
        hint: "solide.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · État",
      progress: 2,
      expected: "liquide",
      distractors: ["solide", "gazeux"],
      copy: {
        football: {
          title: "Eau du robinet",
          statement: "L’eau du robinet est…",
          hint: "liquide.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Eau du robinet",
          statement: "L’eau du robinet est…",
          hint: "liquide.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Eau du robinet",
          statement: "L’eau du robinet est…",
          hint: "liquide.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Eau du robinet",
          statement: "L’eau du robinet est…",
          hint: "liquide.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Changement",
      progress: 3,
      expected: "fonte",
      distractors: ["multiplication", "dictée"],
      copy: allUniverses({
        title: "Glace → eau",
        statement: "Quand la glace devient eau : …",
        hint: "fonte.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Mélange",
      progress: 4,
      expected: "dissolution",
      distractors: ["conjugaison", "symétrie"],
      copy: {
        football: {
          title: "Sucre dans l’eau",
          statement: "Le sucre disparaît dans l’eau : …",
          hint: "dissolution.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Sucre dans l’eau",
          statement: "Le sucre disparaît dans l’eau : …",
          hint: "dissolution.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Sucre dans l’eau",
          statement: "Le sucre disparaît dans l’eau : …",
          hint: "dissolution.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Sucre dans l’eau",
          statement: "Le sucre disparaît dans l’eau : …",
          hint: "dissolution.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Propriété",
      progress: 5,
      expected: "flotte",
      distractors: ["conjugue", "décline"],
      copy: allUniverses({
        title: "Bouchon",
        statement: "Un bouchon sur l’eau…",
        hint: "flotte.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Air",
      progress: 6,
      expected: "gazeux",
      distractors: ["solide", "liquide"],
      copy: {
        football: {
          title: "État de l’air",
          statement: "L’air est…",
          hint: "gazeux.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "État de l’air",
          statement: "L’air est…",
          hint: "gazeux.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "État de l’air",
          statement: "L’air est…",
          hint: "gazeux.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "État de l’air",
          statement: "L’air est…",
          hint: "gazeux.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "vapeur",
      distractors: ["glace", "bois"],
      copy: {
        football: {
          title: "Eau chauffée fort",
          statement: "L’eau très chaude peut devenir de la…",
          hint: "vapeur.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Eau chauffée fort",
          statement: "L’eau très chaude peut devenir de la…",
          hint: "vapeur.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Eau chauffée fort",
          statement: "L’eau très chaude peut devenir de la…",
          hint: "vapeur.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Eau chauffée fort",
          statement: "L’eau très chaude peut devenir de la…",
          hint: "vapeur.",
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
        title: "Je progresse sur : Sciences — Matière",
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
        statement: "Tu as travaillé « Sciences — Matière » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
