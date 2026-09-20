import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cp-questionner-le-monde-qdm-vivant-matiere-01";

/** CP / questionner-le-monde — Questionner le monde — Vivant matière objets. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cp",
  subject: "questionner-le-monde",
  title: "Vivant matière objets en mission",
  blurb: "Une mission CP : Questionner le monde — Vivant matière objets.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Questionner le monde — Vivant matière objets",
        statement: "Dans cette mission de CP, tu vas travailler : Questionner le monde — Vivant matière objets. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Questionner le monde — Vivant matière objets.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Questionner le monde — Vivant matière objets.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Questionner le monde — Vivant matière objets.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Questionner le monde — Vivant matière objets.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Besoin",
      progress: 1,
      expected: "eau",
      distractors: ["plastique", "métal"],
      copy: allUniverses({
        title: "Plante",
        statement: "Une plante a besoin d’…",
        hint: "eau.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Classification",
      progress: 2,
      expected: "animal",
      distractors: ["rocher", "nuage"],
      copy: {
        football: {
          title: "Chien",
          statement: "Un chien est un…",
          hint: "animal.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Chien",
          statement: "Un chien est un…",
          hint: "animal.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Chien",
          statement: "Un chien est un…",
          hint: "animal.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Chien",
          statement: "Un chien est un…",
          hint: "animal.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Cycle",
      progress: 3,
      expected: "graine",
      distractors: ["pile", "vis"],
      copy: allUniverses({
        title: "Plante",
        statement: "Une plante peut naître d’une…",
        hint: "graine.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Chaîne",
      progress: 4,
      expected: "se nourrir",
      distractors: ["voler dans l’espace", "écrire"],
      copy: {
        football: {
          title: "Êtres vivants",
          statement: "Les êtres vivants doivent…",
          hint: "se nourrir.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Êtres vivants",
          statement: "Les êtres vivants doivent…",
          hint: "se nourrir.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Êtres vivants",
          statement: "Les êtres vivants doivent…",
          hint: "se nourrir.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Êtres vivants",
          statement: "Les êtres vivants doivent…",
          hint: "se nourrir.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Habitat",
      progress: 5,
      expected: "milieu",
      distractors: ["fraction", "verbe"],
      copy: allUniverses({
        title: "Vie",
        statement: "Le lieu où vit un animal est son…",
        hint: "milieu.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Santé",
      progress: 6,
      expected: "hygiène",
      distractors: ["hasard", "silence"],
      copy: {
        football: {
          title: "Corps",
          statement: "Pour rester en bonne santé, on respecte des règles d’…",
          hint: "hygiène.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Corps",
          statement: "Pour rester en bonne santé, on respecte des règles d’…",
          hint: "hygiène.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Corps",
          statement: "Pour rester en bonne santé, on respecte des règles d’…",
          hint: "hygiène.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Corps",
          statement: "Pour rester en bonne santé, on respecte des règles d’…",
          hint: "hygiène.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "oxygène",
      distractors: ["plastique", "bruit"],
      copy: {
        football: {
          title: "Respiration",
          statement: "Les êtres humains respirent de l’…",
          hint: "oxygène.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Respiration",
          statement: "Les êtres humains respirent de l’…",
          hint: "oxygène.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Respiration",
          statement: "Les êtres humains respirent de l’…",
          hint: "oxygène.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Respiration",
          statement: "Les êtres humains respirent de l’…",
          hint: "oxygène.",
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
        title: "Je progresse sur : Questionner le monde — Vivant matière objets",
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
        statement: "Tu as travaillé « Questionner le monde — Vivant matière objets » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
