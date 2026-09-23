import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-proportionnalite-01";

/** CM2 / maths — Proportionnalité (linéarité sans produit en croix). Phase A standard. */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Proportionnalité (linéarité sans produit en c…",
  blurb: "Une mission CM2 : Proportionnalité (linéarité sans produit en croix).",
  available: false,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Bienvenue : Proportionnalité (linéarité sans produit en croix)",
        statement: "Dans cette mission de CM2, tu vas travailler : Proportionnalité (linéarité sans produit en croix). Lis bien chaque consigne, utilise l’indice si besoin, puis valide.",
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
          statement: "Observe, calcule et décide. Chaque étape te rapproche du but. Objectif : Proportionnalité (linéarité sans produit en croix).",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Observe la défense",
          statement: "Lis les espaces, calcule, puis avance au bon moment. Objectif : Proportionnalité (linéarité sans produit en croix).",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Choisis le chemin",
          statement: "Observe les bornes, calcule, et garde une allure sûre. Objectif : Proportionnalité (linéarité sans produit en croix).",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Rétablis la trajectoire",
          statement: "Analyse les signaux, calcule, et prépare l’arrimage. Objectif : Proportionnalité (linéarité sans produit en croix).",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Reconnaître",
      progress: 1,
      expected: "oui",
      distractors: ["non", "parfois"],
      copy: allUniverses({
        title: "Proportionnel ?",
        statement: "2 → 10 et 4 → 20 : proportionnel ?",
        hint: "Oui, coefficient 5.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Unité",
      progress: 2,
      expected: "5",
      distractors: ["2", "10"],
      copy: {
        football: {
          title: "Prix unitaire",
          statement: "2 articles coûtent 10 €. Prix d’1 article ?",
          hint: "5.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Prix unitaire",
          statement: "2 articles coûtent 10 €. Prix d’1 article ?",
          hint: "5.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Prix unitaire",
          statement: "2 articles coûtent 10 €. Prix d’1 article ?",
          hint: "5.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Prix unitaire",
          statement: "2 articles coûtent 10 €. Prix d’1 article ?",
          hint: "5.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Calculer",
      progress: 3,
      expected: "35",
      distractors: ["30", "40"],
      copy: allUniverses({
        title: "7 articles",
        statement: "1 article = 5 €. Prix de 7 ?",
        hint: "35.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Quantité",
      progress: 4,
      expected: "8",
      distractors: ["6", "10"],
      copy: {
        football: {
          title: "Combien ?",
          statement: "1 = 4 €, total 32 €. Combien d’articles ?",
          hint: "8.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Combien ?",
          statement: "1 = 4 €, total 32 €. Combien d’articles ?",
          hint: "8.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Combien ?",
          statement: "1 = 4 €, total 32 €. Combien d’articles ?",
          hint: "8.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Combien ?",
          statement: "1 = 4 €, total 32 €. Combien d’articles ?",
          hint: "8.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Contre-exemple",
      progress: 5,
      expected: "non",
      distractors: ["oui", "parfois"],
      copy: allUniverses({
        title: "Forfait",
        statement: "1→10, 2→18, 3→24 : proportionnel ?",
        hint: "Non, le prix unitaire change.",
        caption: "Tu valides ta réponse.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Tableau",
      progress: 6,
      expected: "24",
      distractors: ["20", "28"],
      copy: {
        football: {
          title: "Coefficient 4",
          statement: "6 × 4 = ?",
          hint: "24.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Coefficient 4",
          statement: "6 × 4 = ?",
          hint: "24.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Coefficient 4",
          statement: "6 × 4 = ?",
          hint: "24.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Coefficient 4",
          statement: "6 × 4 = ?",
          hint: "24.",
          caption: "Chaque décision fait progresser le module.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "60",
      distractors: ["50", "70"],
      copy: {
        football: {
          title: "Finale",
          statement: "3 coûtent 18 €. Prix de 10 ?",
          hint: "1=6, 10×6=60.",
          caption: "Les zones du terrain s’allument.",
        },
        rugby: {
          title: "Finale",
          statement: "3 coûtent 18 €. Prix de 10 ?",
          hint: "1=6, 10×6=60.",
          caption: "Les couloirs gauche, axe et large deviennent visibles.",
        },
        equitation: {
          title: "Finale",
          statement: "3 coûtent 18 €. Prix de 10 ?",
          hint: "1=6, 10×6=60.",
          caption: "Les principaux sentiers s’activent.",
        },
        espace: {
          title: "Finale",
          statement: "3 coûtent 18 €. Prix de 10 ?",
          hint: "1=6, 10×6=60.",
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
        title: "Je progresse sur : Proportionnalité (linéarité sans produit en croix)",
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
        statement: "Tu as travaillé « Proportionnalité (linéarité sans produit en croix) » sans note ni classement. Qu’as-tu réussi aujourd’hui ?",
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
