import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-problemes-01";

/**
 * CM2 maths — Résolution de problèmes (1–2 étapes).
 * Structures variées, nombres raisonnables pour le CM2.
 * Trame standard Happy Learn (Phase A).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Problèmes en mission",
  blurb: "Résoudre des problèmes en une ou deux étapes avec des nombres de CM2.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "tutorial",
      kicker: "Tutoriel",
      progress: 0,
      expected: "chercher",
      copy: allUniverses({
        title: "Lire avant de calculer",
        statement:
          "Pour résoudre un problème, on lit la question, on repère les données utiles, puis on choisit l’opération. Recopie le mot « chercher » pour continuer.",
        note: "Données → question → opération(s) → réponse avec unité quand c’est utile.",
        hint: "Le mot à recopier est : chercher.",
        caption: "La méthode de résolution s’affiche.",
      }),
    },
    {
      kind: "continue",
      kicker: "Mise en action",
      progress: 0,
      copy: {
        football: {
          title: "Tu entres en jeu",
          statement:
            "Le coach pose des situations concrètes : points, distances, effectifs. Tu dois choisir la bonne opération, parfois en deux temps.",
          caption: "Des situations-problèmes s’affichent au tableau.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "Le schéma pose des situations de terrain. Tu relies données et question, parfois en deux étapes.",
          caption: "Des situations-problèmes s’affichent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Les bornes racontent des situations du parcours. Tu cherches la réponse en une ou deux opérations.",
          caption: "Des situations-problèmes apparaissent sur les bornes.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "La console propose des situations de navigation. Tu enchaînes une ou deux opérations pour répondre.",
          caption: "Des situations-problèmes s’affichent.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Résous juste",
          statement:
            "Identifie la question, sélectionne les données, calcule en une ou deux étapes, puis vérifie que la réponse a du sens.",
          caption: "La méthode de résolution s’allume.",
        },
        rugby: {
          title: "Résous juste",
          statement:
            "Lis la question, choisis les opérations utiles, calcule en une ou deux étapes.",
          caption: "La méthode de résolution s’allume.",
        },
        equitation: {
          title: "Résous juste",
          statement:
            "Relie données et question, puis calcule en une ou deux étapes pour avancer.",
          caption: "La méthode de résolution s’allume.",
        },
        espace: {
          title: "Résous juste",
          statement:
            "Repère la question et les données, puis calcule en une ou deux étapes.",
          caption: "La méthode de résolution s’allume.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · Addition",
      progress: 1,
      expected: "48",
      distractors: ["38", "58"],
      copy: allUniverses({
        title: "Total de points",
        statement:
          "Une équipe marque 27 points puis 21 points. Combien de points a-t-elle marqués en tout ?",
        hint: "Tu additionnes : 27 + 21 = 48.",
        caption: "Le total est 48 points.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Soustraction",
      progress: 2,
      expected: "35",
      distractors: ["45", "25"],
      copy: {
        football: {
          title: "Ce qu’il reste",
          statement:
            "Un parcours mesure 80 m. L’équipe en a déjà parcouru 45 m. Combien de mètres restent-ils ?",
          hint: "80 − 45 = 35.",
          caption: "Il reste 35 m.",
        },
        rugby: {
          title: "Ce qu’il reste",
          statement:
            "Un couloir mesure 80 m. L’équipe en a déjà gagné 45 m. Combien de mètres restent-ils ?",
          hint: "80 − 45 = 35.",
          caption: "Il reste 35 m.",
        },
        equitation: {
          title: "Ce qu’il reste",
          statement:
            "Un tronçon mesure 80 m. Le cheval en a déjà parcouru 45 m. Combien de mètres restent-ils ?",
          hint: "80 − 45 = 35.",
          caption: "Il reste 35 m.",
        },
        espace: {
          title: "Ce qu’il reste",
          statement:
            "Un segment mesure 80 unités. Le module en a déjà parcouru 45. Combien restent-ils ?",
          hint: "80 − 45 = 35.",
          caption: "Il reste 35.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Multiplication",
      progress: 3,
      expected: "96",
      distractors: ["86", "106"],
      copy: allUniverses({
        title: "Plusieurs groupes",
        statement:
          "Il y a 8 équipes de 12 élèves. Combien d’élèves y a-t-il en tout ?",
        hint: "8 × 12 : 8 × 10 = 80 et 8 × 2 = 16 → 96.",
        caption: "Il y a 96 élèves.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Division",
      progress: 4,
      expected: "15",
      distractors: ["14", "16"],
      copy: allUniverses({
        title: "Partage équitable",
        statement:
          "On partage 90 ballons en 6 lots égaux. Combien de ballons y a-t-il dans chaque lot ?",
        hint: "90 ÷ 6 = 15.",
        caption: "Chaque lot a 15 ballons.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Deux étapes",
      progress: 5,
      expected: "70",
      distractors: ["60", "80"],
      copy: allUniverses({
        title: "Achat puis reste",
        statement:
          "Léa a 100 €. Elle achète 2 articles à 15 € chacun. Combien lui reste-t-il ?",
        hint: "D’abord 2 × 15 = 30, puis 100 − 30 = 70.",
        caption: "Il lui reste 70 €.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Deux étapes",
      progress: 6,
      expected: "240",
      distractors: ["180", "300"],
      copy: {
        football: {
          title: "Courses cumulées",
          statement:
            "Trois joueurs parcourent chacun 50 m, puis l’équipe ajoute encore 90 m. Quelle distance totale a été parcourue ?",
          hint: "3 × 50 = 150, puis 150 + 90 = 240.",
          caption: "La distance totale est 240 m.",
        },
        rugby: {
          title: "Avancées cumulées",
          statement:
            "Trois joueurs avancent chacun de 50 m, puis l’équipe ajoute encore 90 m. Quelle distance totale ?",
          hint: "3 × 50 = 150, puis 150 + 90 = 240.",
          caption: "La distance totale est 240 m.",
        },
        equitation: {
          title: "Distances cumulées",
          statement:
            "Trois tronçons de 50 m, puis un tronçon de 90 m. Quelle distance totale ?",
          hint: "3 × 50 = 150, puis 150 + 90 = 240.",
          caption: "La distance totale est 240 m.",
        },
        espace: {
          title: "Segments cumulés",
          statement:
            "Trois segments de 50 unités, puis un segment de 90. Quelle distance totale ?",
          hint: "3 × 50 = 150, puis 150 + 90 = 240.",
          caption: "La distance totale est 240.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "125",
      distractors: ["100", "175"],
      copy: {
        football: {
          title: "Problème final",
          statement:
            "Un club a 200 maillots. Il en donne 3 lots de 25. Combien de maillots reste-t-il ?",
          hint: "3 × 25 = 75, puis 200 − 75 = 125.",
          caption: "Tu valides 125.",
        },
        rugby: {
          title: "Problème final",
          statement:
            "Un club a 200 maillots. Il en donne 3 lots de 25. Combien reste-t-il ?",
          hint: "3 × 25 = 75 ; 200 − 75 = 125.",
          caption: "Tu valides 125.",
        },
        equitation: {
          title: "Problème final",
          statement:
            "Un club a 200 maillots. Il en donne 3 lots de 25. Combien reste-t-il ?",
          hint: "3 × 25 = 75 ; 200 − 75 = 125.",
          caption: "Tu valides 125.",
        },
        espace: {
          title: "Problème final",
          statement:
            "Un stock de 200 modules envoie 3 lots de 25. Combien reste-t-il ?",
          hint: "3 × 25 = 75 ; 200 − 75 = 125.",
          caption: "Tu valides 125.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Problèmes résolus !",
          statement:
            "Tu as choisi les bonnes opérations, parfois en deux temps. L’équipe peut décider sereinement.",
          caption: "La méthode de résolution est solide.",
        },
        rugby: {
          title: "Problèmes résolus !",
          statement:
            "Tes lectures et calculs ont calé chaque situation. La phase reste claire.",
          caption: "La méthode de résolution est solide.",
        },
        equitation: {
          title: "Problèmes résolus !",
          statement:
            "Les situations du parcours sont comprises. Tu avances avec méthode.",
          caption: "La méthode de résolution est solide.",
        },
        espace: {
          title: "Problèmes résolus !",
          statement:
            "Les situations de navigation sont traitées. La trajectoire reste fiable.",
          caption: "La méthode de résolution est solide.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais résoudre un problème",
        statement: "On lit la question avant de calculer.",
        note: "1. Lire la question et souligner les données utiles. 2. Choisir l’opération (ou les deux étapes). 3. Calculer, puis vérifier que la réponse répond bien à la question.",
        caption: "Tu pourras réutiliser cette méthode dans une autre mission.",
      }),
    },
    {
      kind: "bilan",
      kicker: "Bilan sans note",
      progress: 6,
      copy: allUniverses({
        title: "Ton bilan",
        statement:
          "Tu sais résoudre des problèmes en une ou deux étapes : addition, soustraction, multiplication, division et enchaînements simples.",
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
          statement:
            "Au prochain match, tu approfondiras d’autres notions de maths pour enrichir ton jeu.",
          caption: "Une nouvelle mission se prépare.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine rencontre ouvrira une autre piste de maths pour progresser.",
          caption: "Une nouvelle mission se prépare.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain parcours, une autre notion de maths t’attend.",
          caption: "Une nouvelle mission se prépare.",
        },
        espace: {
          title: "Signal suite",
          statement:
            "La console annonce une prochaine mission de maths pour continuer l’aventure.",
          caption: "Une nouvelle mission clignote.",
        },
      },
    },
  ],
});
