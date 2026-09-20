import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-entiers-01";

/**
 * CM2 maths — Grands nombres jusqu’à 999 999 999.
 * Lire, écrire, comparer, décomposer (unités / milliers / millions).
 * Trame standard Happy Learn (Phase A).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Grands nombres en mission",
  blurb: "Lire, écrire, comparer et décomposer les nombres jusqu’à 999 999 999.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Les classes de nombres",
        statement:
          "Un grand nombre se lit par classes de trois chiffres : unités, milliers, millions. Exemple : 12 345 678 = 12 millions + 345 milliers + 678.",
        note: "Les espaces séparent les classes pour lire plus facilement.",
        caption: "Unités, milliers, millions s’alignent.",
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
            "Le tableau du stade affiche des statistiques énormes : spectateurs, distances, points cumulés. Tu dois lire chaque classe sans te tromper.",
          caption: "De grands nombres s’affichent au tableau.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "Le schéma de jeu indique des totaux impressionnants. Chaque classe de trois chiffres compte pour choisir le bon couloir.",
          caption: "De grands nombres s’affichent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Les bornes du sentier indiquent des distances et des totaux en très grands nombres. Tu lis classe par classe.",
          caption: "De grands nombres apparaissent sur les bornes.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "La console affiche des distances et des comptes en très grands nombres. Une classe mal lue décale la trajectoire.",
          caption: "De grands nombres s’affichent.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Maîtrise les grands nombres",
          statement:
            "Lis, écris, compare et décompose les nombres jusqu’aux millions pour valider les stats du match.",
          caption: "Les classes de nombres s’allument.",
        },
        rugby: {
          title: "Maîtrise les grands nombres",
          statement:
            "Lis, écris, compare et décompose pour choisir le bon couloir parmi les totaux affichés.",
          caption: "Les classes de nombres s’allument.",
        },
        equitation: {
          title: "Maîtrise les grands nombres",
          statement:
            "Lis, écris, compare et décompose pour choisir la bonne allure entre les bornes.",
          caption: "Les classes de nombres s’allument.",
        },
        espace: {
          title: "Maîtrise les grands nombres",
          statement:
            "Lis, écris, compare et décompose pour caler la trajectoire sur les bons totaux.",
          caption: "Les classes de nombres s’allument.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Lire",
      progress: 1,
      expected: "trois millions deux cent quarante-cinq mille",
      distractors: [
        "trois cent deux mille quarante-cinq",
        "trois millions deux cent quarante-cinq",
      ],
      copy: allUniverses({
        title: "Lire 3 245 000",
        statement: "Quelle lecture correspond au nombre 3 245 000 ?",
        hint: "3 millions, puis 245 milliers, puis 0 unité → « trois millions deux cent quarante-cinq mille ».",
        caption: "3 245 000 se lit clairement.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Écrire",
      progress: 2,
      expected: "1 250 000",
      distractors: ["125 000", "12 500 000"],
      copy: {
        football: {
          title: "Écrire un total",
          statement:
            "Le coach annonce « un million deux cent cinquante mille ». Quelle écriture choisis-tu ?",
          hint: "1 million + 250 milliers = 1 250 000.",
          caption: "1 250 000 s’inscrit au tableau.",
        },
        rugby: {
          title: "Écrire un total",
          statement:
            "Le schéma indique « un million deux cent cinquante mille ». Quelle écriture ?",
          hint: "1 million + 250 milliers = 1 250 000.",
          caption: "1 250 000 s’inscrit au sol.",
        },
        equitation: {
          title: "Écrire un total",
          statement:
            "La borne indique « un million deux cent cinquante mille ». Quelle écriture ?",
          hint: "1 million + 250 milliers = 1 250 000.",
          caption: "1 250 000 apparaît sur la borne.",
        },
        espace: {
          title: "Écrire un total",
          statement:
            "La console indique « un million deux cent cinquante mille ». Quelle écriture ?",
          hint: "1 million + 250 milliers = 1 250 000.",
          caption: "1 250 000 s’affiche.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Comparer",
      progress: 3,
      expected: "8 450 000",
      distractors: ["8 045 000", "845 000"],
      copy: allUniverses({
        title: "Le plus grand",
        statement: "Parmi 845 000 ; 8 045 000 et 8 450 000, quel nombre est le plus grand ?",
        hint: "Compare d’abord les millions : 8 millions battent 845 milliers. Puis compare 8 450 000 et 8 045 000.",
        caption: "8 450 000 est le plus grand.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Chiffre des millions",
      progress: 4,
      expected: "5",
      distractors: ["7", "2"],
      copy: allUniverses({
        title: "Rang des millions",
        statement:
          "Dans le nombre 725 438 619, quel chiffre est au rang des unités de million ?",
        hint: "Classes : 725 | 438 | 619. Dans 725 millions : 7 = centaines, 2 = dizaines, 5 = unités de million.",
        caption: "Le 5 est aux unités de million.",
        note: "Millions = classe de gauche : centaines, dizaines, unités de million.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 5 sur 6 · Décomposer",
      progress: 5,
      expected: "4 millions + 320 milliers + 15",
      distractors: ["4 millions + 32 milliers + 15", "432 millions + 15"],
      copy: allUniverses({
        title: "Décomposition",
        statement: "Quelle décomposition correspond à 4 320 015 ?",
        hint: "4 | 320 | 015 → 4 millions + 320 milliers + 15.",
        caption: "4 320 015 est décomposé.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Ordre croissant",
      progress: 6,
      expected: "98 000 < 908 000 < 980 000",
      distractors: ["908 000 < 98 000 < 980 000", "980 000 < 908 000 < 98 000"],
      copy: {
        football: {
          title: "Range les totaux",
          statement: "Range dans l’ordre croissant : 908 000 ; 98 000 ; 980 000.",
          hint: "98 000 est le plus petit (pas de centaine de mille), puis 908 000, puis 980 000.",
          caption: "98 000 < 908 000 < 980 000.",
        },
        rugby: {
          title: "Range les totaux",
          statement: "Range dans l’ordre croissant : 908 000 ; 98 000 ; 980 000.",
          hint: "Commence par le plus petit : 98 000.",
          caption: "98 000 < 908 000 < 980 000.",
        },
        equitation: {
          title: "Range les totaux",
          statement: "Range dans l’ordre croissant : 908 000 ; 98 000 ; 980 000.",
          hint: "98 000 < 908 000 < 980 000.",
          caption: "98 000 < 908 000 < 980 000.",
        },
        espace: {
          title: "Range les totaux",
          statement: "Range dans l’ordre croissant : 908 000 ; 98 000 ; 980 000.",
          hint: "98 000 < 908 000 < 980 000.",
          caption: "98 000 < 908 000 < 980 000.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "56 078 000",
      distractors: ["56 780 000", "5 607 800"],
      copy: {
        football: {
          title: "Composition finale",
          statement:
            "Le coach annonce « 56 millions + 78 milliers ». Quelle écriture choisis-tu ?",
          hint: "56 millions + 78 milliers = 56 078 000.",
          caption: "Tu valides 56 078 000.",
        },
        rugby: {
          title: "Composition finale",
          statement: "Le schéma indique 56 millions + 78 milliers. Quelle écriture ?",
          hint: "56 078 000.",
          caption: "Tu valides 56 078 000.",
        },
        equitation: {
          title: "Composition finale",
          statement: "La borne indique 56 millions + 78 milliers. Quelle écriture ?",
          hint: "56 078 000.",
          caption: "Tu valides 56 078 000.",
        },
        espace: {
          title: "Composition finale",
          statement: "La console indique 56 millions + 78 milliers. Quelle écriture ?",
          hint: "56 078 000.",
          caption: "Tu valides 56 078 000.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Totaux lus !",
          statement:
            "Tu as lu chaque classe sans erreur. L’équipe s’appuie sur des stats claires.",
          caption: "Les grands nombres n’ont plus de secret.",
        },
        rugby: {
          title: "Totaux lus !",
          statement:
            "Tes lectures ont calé le bon couloir. La phase peut partir.",
          caption: "Les grands nombres n’ont plus de secret.",
        },
        equitation: {
          title: "Totaux lus !",
          statement:
            "Les bornes sont comprises. Le cheval avance juste.",
          caption: "Les grands nombres n’ont plus de secret.",
        },
        espace: {
          title: "Totaux lus !",
          statement:
            "La trajectoire est calée sur les bons totaux. L’approche finale est stable.",
          caption: "Les grands nombres n’ont plus de secret.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais lire et décomposer les grands nombres",
        statement: "On lit et on décompose un grand nombre classe par classe.",
        note: "1. Classes de trois chiffres : millions | milliers | unités. 2. Pour comparer : même nombre de chiffres, puis chiffre à chiffre depuis la gauche. 3. Pour décomposer : séparer chaque classe (ex. 4 320 015 = 4 millions + 320 milliers + 15).",
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
          "Tu sais lire, écrire, comparer et décomposer des nombres jusqu’à 999 999 999 en utilisant les classes (unités, milliers, millions).",
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
            "Au prochain match, tu enchaîneras des automatismes de calcul mental pour gagner du temps sur le terrain.",
          caption: "Des calculs rapides s’allument au tableau.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine rencontre demandera des automatismes de calcul mental pour réagir vite.",
          caption: "Des calculs rapides apparaissent au schéma.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain parcours, tu accéléreras avec des automatismes de calcul mental.",
          caption: "Des calculs rapides apparaissent sur une borne.",
        },
        espace: {
          title: "Signal calcul mental",
          statement:
            "La console bascule vers des automatismes de calcul mental pour la prochaine mission.",
          caption: "Des calculs rapides clignotent.",
        },
      },
    },
  ],
});
