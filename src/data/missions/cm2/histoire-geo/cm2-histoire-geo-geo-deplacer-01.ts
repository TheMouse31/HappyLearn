import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-histoire-geo-geo-deplacer-01";

/** CM2 / histoire-geo — Géographie — Se déplacer. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "histoire-geo",
  title: "Se déplacer en mission",
  blurb: "Une mission CM2 : Géographie — Se déplacer.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Géographie — Se déplacer",
        statement: "Dans cette mission de CM2, tu vas travailler : Géographie — Se déplacer. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Géographie — Se déplacer.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Géographie — Se déplacer.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Géographie — Se déplacer.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Géographie — Se déplacer.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Notion",
      progress: 1,
      expected: "transport",
      distractors: ["conjugaison", "fraction"],
      copy: allUniverses({
        title: "Se déplacer",
        statement: "Pour aller d’une ville à une autre, on utilise un…",
        hint: "transport.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Échelle",
      progress: 2,
      expected: "carte",
      distractors: ["poème", "équation"],
      copy: {
        football: {
          title: "Repérer",
          statement: "Pour se repérer dans l’espace, on lit une…",
          hint: "carte.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Repérer",
          statement: "Pour se repérer dans l’espace, on lit une…",
          hint: "carte.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Repérer",
          statement: "Pour se repérer dans l’espace, on lit une…",
          hint: "carte.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Repérer",
          statement: "Pour se repérer dans l’espace, on lit une…",
          hint: "carte.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Internet",
      progress: 3,
      expected: "communiquer",
      distractors: ["cuisiner", "dormir"],
      copy: allUniverses({
        title: "Réseaux",
        statement: "Internet sert surtout à…",
        hint: "communiquer.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Ville",
      progress: 4,
      expected: "habiter",
      distractors: ["multiplier", "chanter"],
      copy: {
        football: {
          title: "Logement",
          statement: "Trouver un logement, c’est une question d’…",
          hint: "habiter.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Logement",
          statement: "Trouver un logement, c’est une question d’…",
          hint: "habiter.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Logement",
          statement: "Trouver un logement, c’est une question d’…",
          hint: "habiter.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Logement",
          statement: "Trouver un logement, c’est une question d’…",
          hint: "habiter.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Mobilité",
      progress: 5,
      expected: "train",
      distractors: ["nuage", "verbe"],
      copy: allUniverses({
        title: "Moyen",
        statement: "Un moyen de transport collectif ferré ?",
        hint: "train.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Environnement",
      progress: 6,
      expected: "recyclage",
      distractors: ["addition", "imparfait"],
      copy: {
        football: {
          title: "Mieux habiter",
          statement: "Réduire les déchets passe par le…",
          hint: "recyclage.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Mieux habiter",
          statement: "Réduire les déchets passe par le…",
          hint: "recyclage.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Mieux habiter",
          statement: "Réduire les déchets passe par le…",
          hint: "recyclage.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Mieux habiter",
          statement: "Réduire les déchets passe par le…",
          hint: "recyclage.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "plan",
      distractors: ["conjugaison", "fraction"],
      copy: {
        football: {
          title: "Lire un plan",
          statement: "Pour se déplacer en ville, on peut lire un…",
          hint: "plan.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Lire un plan",
          statement: "Pour se déplacer en ville, on peut lire un…",
          hint: "plan.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Lire un plan",
          statement: "Pour se déplacer en ville, on peut lire un…",
          hint: "plan.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Lire un plan",
          statement: "Pour se déplacer en ville, on peut lire un…",
          hint: "plan.",
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
        title: "Je progresse sur : Géographie — Se déplacer",
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
        statement: "Tu as travaillé « Géographie — Se déplacer » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
