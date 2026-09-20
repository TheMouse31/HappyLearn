import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm1-histoire-geo-histoire-revolution-01";

/** CM1 / histoire-geo — Histoire — Révolution et Empire. Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm1",
  subject: "histoire-geo",
  title: "Révolution et Empire en mission",
  blurb: "Une mission CM1 : Histoire — Révolution et Empire.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Histoire — Révolution et Empire",
        statement: "Dans cette mission de CM1, tu vas travailler : Histoire — Révolution et Empire. Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Histoire — Révolution et Empire.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Histoire — Révolution et Empire.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Histoire — Révolution et Empire.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Histoire — Révolution et Empire.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Repère",
      progress: 1,
      expected: "République",
      distractors: ["Empire romain", "Préhistoire"],
      copy: allUniverses({
        title: "Régime",
        statement: "La France est aujourd’hui une…",
        hint: "République.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Siècle",
      progress: 2,
      expected: "XIXe",
      distractors: ["Ve", "XXVe"],
      copy: {
        football: {
          title: "Industrie",
          statement: "L’âge industriel se développe surtout au…",
          hint: "XIXe.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Industrie",
          statement: "L’âge industriel se développe surtout au…",
          hint: "XIXe.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Industrie",
          statement: "L’âge industriel se développe surtout au…",
          hint: "XIXe.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Industrie",
          statement: "L’âge industriel se développe surtout au…",
          hint: "XIXe.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Conflit",
      progress: 3,
      expected: "guerre mondiale",
      distractors: ["match de foot", "dictée"],
      copy: allUniverses({
        title: "1914-1918",
        statement: "1914-1918 désigne une…",
        hint: "guerre mondiale.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · UE",
      progress: 4,
      expected: "Union européenne",
      distractors: ["Ligue des champions", "Académie"],
      copy: {
        football: {
          title: "Europe",
          statement: "La construction européenne mène à l’…",
          hint: "Union européenne.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Europe",
          statement: "La construction européenne mène à l’…",
          hint: "Union européenne.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Europe",
          statement: "La construction européenne mène à l’…",
          hint: "Union européenne.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Europe",
          statement: "La construction européenne mène à l’…",
          hint: "Union européenne.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Roi",
      progress: 5,
      expected: "monarchie",
      distractors: ["république", "dictée"],
      copy: allUniverses({
        title: "Temps des rois",
        statement: "Avant la Révolution, la France est surtout une…",
        hint: "monarchie.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Révolution",
      progress: 6,
      expected: "1789",
      distractors: ["1914", "1492"],
      copy: {
        football: {
          title: "Date clé",
          statement: "La Révolution française commence en…",
          hint: "1789.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Date clé",
          statement: "La Révolution française commence en…",
          hint: "1789.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Date clé",
          statement: "La Révolution française commence en…",
          hint: "1789.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Date clé",
          statement: "La Révolution française commence en…",
          hint: "1789.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "citoyen",
      distractors: ["spectateur seulement", "robot"],
      copy: {
        football: {
          title: "République",
          statement: "Dans une République, on est…",
          hint: "citoyen.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "République",
          statement: "Dans une République, on est…",
          hint: "citoyen.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "République",
          statement: "Dans une République, on est…",
          hint: "citoyen.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "République",
          statement: "Dans une République, on est…",
          hint: "citoyen.",
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
        title: "Je progresse sur : Histoire — Révolution et Empire",
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
        statement: "Tu as travaillé « Histoire — Révolution et Empire » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
