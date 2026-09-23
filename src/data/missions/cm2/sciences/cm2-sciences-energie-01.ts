import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-sciences-energie-01";

/** CM2 / sciences — Sciences — Énergie / objets techniques. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "sciences",
  title: "Énergie / objets techniques en mission",
  blurb: "Une mission CM2 : Sciences — Énergie / objets techniques.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Sciences — Énergie / objets techniques",
        statement: "Dans cette mission de CM2, tu vas travailler : Sciences — Énergie / objets techniques. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Sciences — Énergie / objets techniques.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Sciences — Énergie / objets techniques.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Sciences — Énergie / objets techniques.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Sciences — Énergie / objets techniques.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Énergie",
      progress: 1,
      expected: "électricité",
      distractors: ["silence", "ombre"],
      copy: allUniverses({
        title: "Appareil",
        statement: "Beaucoup d’appareils fonctionnent grâce à l’…",
        hint: "électricité.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Objet",
      progress: 2,
      expected: "outil",
      distractors: ["poème", "fraction"],
      copy: {
        football: {
          title: "Technique",
          statement: "Un marteau est un…",
          hint: "outil.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Technique",
          statement: "Un marteau est un…",
          hint: "outil.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Technique",
          statement: "Un marteau est un…",
          hint: "outil.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Technique",
          statement: "Un marteau est un…",
          hint: "outil.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Sécurité",
      progress: 3,
      expected: "prudence",
      distractors: ["vitesse maximale", "hasard"],
      copy: allUniverses({
        title: "Usage",
        statement: "Avec un objet technique, on agit avec…",
        hint: "prudence.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Source",
      progress: 4,
      expected: "soleil",
      distractors: ["cahier", "verbe"],
      copy: {
        football: {
          title: "Énergie",
          statement: "Une source d’énergie naturelle ?",
          hint: "soleil.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Énergie",
          statement: "Une source d’énergie naturelle ?",
          hint: "soleil.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Énergie",
          statement: "Une source d’énergie naturelle ?",
          hint: "soleil.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Énergie",
          statement: "Une source d’énergie naturelle ?",
          hint: "soleil.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Circuit",
      progress: 5,
      expected: "fermé",
      distractors: ["ouvert seulement", "invisible"],
      copy: allUniverses({
        title: "Lampe",
        statement: "Pour qu’une lampe s’allume, le circuit doit être…",
        hint: "fermé.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Matériau",
      progress: 6,
      expected: "métal",
      distractors: ["nuage", "son"],
      copy: {
        football: {
          title: "Conducteur",
          statement: "Un bon conducteur électrique courant ?",
          hint: "métal.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Conducteur",
          statement: "Un bon conducteur électrique courant ?",
          hint: "métal.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Conducteur",
          statement: "Un bon conducteur électrique courant ?",
          hint: "métal.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Conducteur",
          statement: "Un bon conducteur électrique courant ?",
          hint: "métal.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "économiser",
      distractors: ["gaspiller", "ignorer"],
      copy: {
        football: {
          title: "Geste",
          statement: "Face à l’énergie, un bon geste est d’…",
          hint: "économiser.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Geste",
          statement: "Face à l’énergie, un bon geste est d’…",
          hint: "économiser.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Geste",
          statement: "Face à l’énergie, un bon geste est d’…",
          hint: "économiser.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Geste",
          statement: "Face à l’énergie, un bon geste est d’…",
          hint: "économiser.",
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
        title: "Je progresse sur : Sciences — Énergie / objets techniques",
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
        statement: "Tu as travaillé « Sciences — Énergie / objets techniques » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
