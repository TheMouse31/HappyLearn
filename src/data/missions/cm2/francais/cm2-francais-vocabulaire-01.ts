import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-francais-vocabulaire-01";

/** CM2 / francais — Vocabulaire et oral. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "francais",
  title: "Vocabulaire et oral en mission",
  blurb: "Une mission CM2 : Vocabulaire et oral.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Vocabulaire et oral",
        statement: "Dans cette mission de CM2, tu vas travailler : Vocabulaire et oral. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Vocabulaire et oral.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Vocabulaire et oral.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Vocabulaire et oral.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Vocabulaire et oral.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Synonyme",
      progress: 1,
      expected: "content",
      distractors: ["triste", "fatigué"],
      copy: allUniverses({
        title: "Synonyme de joyeux",
        statement: "Un synonyme de « joyeux » ?",
        hint: "content.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Contraire",
      progress: 2,
      expected: "petit",
      distractors: ["grand", "énorme"],
      copy: {
        football: {
          title: "Contraire de grand",
          statement: "Le contraire de « grand » ?",
          hint: "petit.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Contraire de grand",
          statement: "Le contraire de « grand » ?",
          hint: "petit.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Contraire de grand",
          statement: "Le contraire de « grand » ?",
          hint: "petit.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Contraire de grand",
          statement: "Le contraire de « grand » ?",
          hint: "petit.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Sens",
      progress: 3,
      expected: "rapide",
      distractors: ["lent", "arrêté"],
      copy: allUniverses({
        title: "« Vite »",
        statement: "« Vite » signifie…",
        hint: "rapide.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Famille",
      progress: 4,
      expected: "joueur",
      distractors: ["jouerment", "jouure"],
      copy: {
        football: {
          title: "Famille de jouer",
          statement: "Quel mot de la famille de « jouer » ?",
          hint: "joueur.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Famille de jouer",
          statement: "Quel mot de la famille de « jouer » ?",
          hint: "joueur.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Famille de jouer",
          statement: "Quel mot de la famille de « jouer » ?",
          hint: "joueur.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Famille de jouer",
          statement: "Quel mot de la famille de « jouer » ?",
          hint: "joueur.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Préfixe",
      progress: 5,
      expected: "rejouer",
      distractors: ["dejouer", "surjouer"],
      copy: allUniverses({
        title: "Re-",
        statement: "« Jouer encore » avec le préfixe re- ?",
        hint: "rejouer.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Contexte",
      progress: 6,
      expected: "terrain",
      distractors: ["nuage", "assiette"],
      copy: {
        football: {
          title: "Stade",
          statement: "Dans un match, on joue sur un…",
          hint: "terrain.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Stade",
          statement: "Dans un match, on joue sur un…",
          hint: "terrain.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Stade",
          statement: "Dans un match, on joue sur un…",
          hint: "terrain.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Stade",
          statement: "Dans un match, on joue sur un…",
          hint: "terrain.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "courageux",
      distractors: ["peur", "timide"],
      copy: {
        football: {
          title: "Sens",
          statement: "Qui a du courage est…",
          hint: "courageux.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Sens",
          statement: "Qui a du courage est…",
          hint: "courageux.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Sens",
          statement: "Qui a du courage est…",
          hint: "courageux.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Sens",
          statement: "Qui a du courage est…",
          hint: "courageux.",
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
        title: "Je progresse sur : Vocabulaire et oral",
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
        statement: "Tu as travaillé « Vocabulaire et oral » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
