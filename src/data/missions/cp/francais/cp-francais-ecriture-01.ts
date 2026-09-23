import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cp-francais-ecriture-01";

/** CP / francais — Geste cursif copie premières phrases. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cp",
  subject: "francais",
  title: "Geste cursif copie premières phrases en mission",
  blurb: "Une mission CP : Geste cursif copie premières phrases.",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Geste cursif copie premières phrases",
        statement: "Dans cette mission de CP, tu vas travailler : Geste cursif copie premières phrases. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Geste cursif copie premières phrases.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Geste cursif copie premières phrases.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Geste cursif copie premières phrases.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Geste cursif copie premières phrases.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Phrase",
      progress: 1,
      expected: "sujet + verbe",
      distractors: ["verbe seul", "mot isolé"],
      copy: allUniverses({
        title: "Phrase minimale",
        statement: "Une phrase simple contient au moins…",
        hint: "sujet + verbe.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Ponctuation",
      progress: 2,
      expected: ".",
      distractors: ["?", "!"],
      copy: {
        football: {
          title: "Fin de phrase déclarative",
          statement: "Quelle ponctuation pour une phrase déclarative ?",
          hint: ".",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Fin de phrase déclarative",
          statement: "Quelle ponctuation pour une phrase déclarative ?",
          hint: ".",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Fin de phrase déclarative",
          statement: "Quelle ponctuation pour une phrase déclarative ?",
          hint: ".",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Fin de phrase déclarative",
          statement: "Quelle ponctuation pour une phrase déclarative ?",
          hint: ".",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "text",
      kicker: "Étape 3 sur 6 · Accord",
      progress: 3,
      expected: "les",
      distractors: ["le", "la"],
      copy: allUniverses({
        title: "Déterminant pluriel",
        statement: "Complète : ___ ballons. Écris « les ».",
        hint: "les.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Conjugaison",
      progress: 4,
      expected: "il court",
      distractors: ["il courir", "il couraitont"],
      copy: {
        football: {
          title: "Présent",
          statement: "Quelle forme est correcte au présent ?",
          hint: "il court.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Présent",
          statement: "Quelle forme est correcte au présent ?",
          hint: "il court.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Présent",
          statement: "Quelle forme est correcte au présent ?",
          hint: "il court.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Présent",
          statement: "Quelle forme est correcte au présent ?",
          hint: "il court.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Cohérence",
      progress: 5,
      expected: "puis",
      distractors: ["car", "mais"],
      copy: allUniverses({
        title: "Connecteur de suite",
        statement: "Pour enchaîner deux actions : …",
        hint: "puis.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Réécriture",
      progress: 6,
      expected: "plus clair",
      distractors: ["plus long seulement", "sans sens"],
      copy: {
        football: {
          title: "Améliorer",
          statement: "Réécrire un texte vise à le rendre…",
          hint: "plus clair.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Améliorer",
          statement: "Réécrire un texte vise à le rendre…",
          hint: "plus clair.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Améliorer",
          statement: "Réécrire un texte vise à le rendre…",
          hint: "plus clair.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Améliorer",
          statement: "Réécrire un texte vise à le rendre…",
          hint: "plus clair.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "majuscule",
      distractors: ["virgule seule", "rien"],
      copy: {
        football: {
          title: "Début de phrase",
          statement: "Une phrase commence par une…",
          hint: "majuscule.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Début de phrase",
          statement: "Une phrase commence par une…",
          hint: "majuscule.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Début de phrase",
          statement: "Une phrase commence par une…",
          hint: "majuscule.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Début de phrase",
          statement: "Une phrase commence par une…",
          hint: "majuscule.",
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
        title: "Je progresse sur : Geste cursif copie premières phrases",
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
        statement: "Tu as travaillé « Geste cursif copie premières phrases » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
