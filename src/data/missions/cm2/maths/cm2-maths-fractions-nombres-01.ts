import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-fractions-nombres-01";

/**
 * CM2 maths — Fractions comme nombres (> 1, droite graduée, encadrement).
 * Trame standard Happy Learn (Phase A).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Fractions sur la droite",
  blurb: "Placer, encadrer et comparer des fractions, y compris plus grandes que 1.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "tutorial",
      kicker: "Tutoriel",
      progress: 0,
      expected: "5/4",
      copy: allUniverses({
        title: "Écrire une fraction plus grande que 1",
        statement:
          "Quand le nombre du haut est plus grand que celui du bas, la fraction est plus grande que 1. Recopie la fraction cinq quarts pour continuer.",
        note: "5/4 se lit « cinq quarts » : c’est un peu plus que 1.",
        hint: "Le nombre du haut est 5. Le nombre du bas est 4.",
        caption: "On écrit 5/4 comme au tableau.",
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
            "Les Bleus préparent une action décisive. Sur le tableau tactique, les distances sont marquées en fractions de terrain.",
          caption: "Le tableau tactique s’allume.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "Une dernière phase s’organise. Les couloirs du terrain sont repérés en fractions de longueur.",
          caption: "Les couloirs apparaissent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Le sentier vers l’écurie est jalonné. Chaque borne indique une fraction du parcours total.",
          caption: "Les bornes du sentier s’éclairent.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "Le module suit une trajectoire graduée. Les balises indiquent des fractions de la distance restante.",
          caption: "La trajectoire graduée apparaît.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Lis les distances",
          statement:
            "Pour bien placer tes coéquipiers, tu dois lire les fractions sur la droite du terrain et savoir où elles se situent.",
          caption: "Une droite graduée traverse le terrain.",
        },
        rugby: {
          title: "Lis les marques",
          statement:
            "Pour choisir le bon couloir, tu dois placer les fractions sur la droite et les encadrer entre deux entiers.",
          caption: "Une droite graduée traverse les couloirs.",
        },
        equitation: {
          title: "Lis les bornes",
          statement:
            "Pour garder le bon rythme, tu places chaque fraction sur la droite du parcours et tu l’encadres.",
          caption: "Une droite graduée suit le sentier.",
        },
        espace: {
          title: "Lis les balises",
          statement:
            "Pour corriger la trajectoire, tu places les fractions sur la droite et tu les encadres entre deux entiers.",
          caption: "Une droite graduée suit le module.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 1 sur 6 · Fraction > 1",
      progress: 1,
      expected: "7/4",
      distractors: ["3/4", "4/7"],
      copy: {
        football: {
          title: "Plus qu’un terrain",
          statement:
            "Tu as parcouru 7 quarts de la longueur d’un terrain. Quelle fraction représente cette distance ?",
          hint: "Le haut (7) est plus grand que le bas (4) : c’est plus que 1 terrain.",
          caption: "Sept quarts s’affichent sur le tableau.",
        },
        rugby: {
          title: "Plus qu’un couloir",
          statement:
            "Tu as avancé de 7 quarts de la longueur d’un couloir. Quelle fraction représente cette distance ?",
          hint: "7 est plus grand que 4 : la fraction est plus grande que 1.",
          caption: "Sept quarts marquent le couloir.",
        },
        equitation: {
          title: "Au-delà d’une borne",
          statement:
            "Tu as parcouru 7 quarts de la distance entre deux bornes. Quelle fraction représente ce trajet ?",
          hint: "7 > 4 : tu as dépassé une unité complète.",
          caption: "Sept quarts apparaissent sur le sentier.",
        },
        espace: {
          title: "Au-delà d’une unité",
          statement:
            "Le module a parcouru 7 quarts d’une unité de navigation. Quelle fraction représente cette distance ?",
          hint: "7 est plus grand que 4 : la fraction dépasse 1.",
          caption: "Sept quarts s’affichent sur la console.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · Combien d’entiers ?",
      progress: 2,
      expected: "1",
      distractors: ["0", "2"],
      copy: allUniverses({
        title: "Entiers contenus dans 7/4",
        statement:
          "Dans la fraction 7/4, combien d’entiers complets peux-tu former ? (On cherche le quotient entier de 7 ÷ 4.)",
        hint: "4 quarts font 1 entier. Avec 7 quarts, tu peux former un entier, et il reste des quarts.",
        caption: "Un entier se détache de la fraction.",
        note: "7 ÷ 4 = 1, reste 3. Donc 7/4 = 1 + 3/4.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 3 sur 6 · Encadrement",
      progress: 3,
      expected: "entre 1 et 2",
      distractors: ["entre 0 et 1", "entre 2 et 3"],
      copy: allUniverses({
        title: "Où placer 7/4 ?",
        statement:
          "Sur une droite graduée, entre quels entiers se trouve la fraction 7/4 ?",
        hint: "7/4 = 1 + 3/4, donc un peu plus que 1, mais moins que 2.",
        caption: "La flèche se place entre 1 et 2.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 4 sur 6 · Encadrer 11/5",
      progress: 4,
      expected: "entre 2 et 3",
      distractors: ["entre 1 et 2", "entre 3 et 4"],
      copy: {
        football: {
          title: "Nouvelle distance",
          statement:
            "Une course mesure 11/5 de terrain. Entre quels entiers la place-t-on sur la droite ?",
          hint: "11 ÷ 5 = 2, reste 1. Donc 11/5 = 2 + 1/5.",
          caption: "La marque s’arrête entre 2 et 3.",
        },
        rugby: {
          title: "Nouvelle marque",
          statement:
            "Une avancée mesure 11/5 de couloir. Entre quels entiers la place-t-on ?",
          hint: "11 ÷ 5 = 2 reste 1 : un peu plus que 2.",
          caption: "La marque s’arrête entre 2 et 3.",
        },
        equitation: {
          title: "Nouvelle borne",
          statement:
            "Un tronçon mesure 11/5 du parcours. Entre quels entiers le place-t-on ?",
          hint: "11 ÷ 5 = 2 reste 1 : un peu plus que 2.",
          caption: "La borne s’arrête entre 2 et 3.",
        },
        espace: {
          title: "Nouvelle balise",
          statement:
            "Une distance mesure 11/5 d’unité. Entre quels entiers la place-t-on ?",
          hint: "11 ÷ 5 = 2 reste 1 : un peu plus que 2.",
          caption: "La balise s’arrête entre 2 et 3.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 5 sur 6 · Fraction égale à un entier",
      progress: 5,
      expected: "8/4",
      distractors: ["7/4", "9/4"],
      copy: allUniverses({
        title: "Pile sur un entier",
        statement:
          "Parmi ces fractions, laquelle est exactement égale à 2 ?",
        hint: "2 entiers = 2 × 4 quarts = 8 quarts.",
        caption: "8/4 s’aligne pile sur le 2.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 6 sur 6 · Comparer sur la droite",
      progress: 6,
      expected: "5/3",
      distractors: ["4/3", "2/3"],
      copy: allUniverses({
        title: "La plus éloignée de 0",
        statement:
          "Sur la droite graduée, laquelle de ces fractions est la plus grande ?",
        hint: "Compare-les à 1 : 2/3 < 1, tandis que 4/3 et 5/3 sont plus grands que 1. Entre 4/3 et 5/3, le plus grand numérateur gagne.",
        caption: "5/3 est la plus à droite.",
      }),
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "entre 3 et 4",
      distractors: ["entre 2 et 3", "entre 4 et 5"],
      copy: {
        football: {
          title: "Dernière lecture",
          statement:
            "Le coach indique 17/5 de terrain. Entre quels entiers places-tu cette distance ?",
          hint: "17 ÷ 5 = 3 reste 2. Donc un peu plus que 3.",
          caption: "Tu pointes entre 3 et 4.",
        },
        rugby: {
          title: "Dernière lecture",
          statement:
            "Le schéma indique 17/5 de couloir. Entre quels entiers places-tu cette distance ?",
          hint: "17 ÷ 5 = 3 reste 2.",
          caption: "Tu pointes entre 3 et 4.",
        },
        equitation: {
          title: "Dernière lecture",
          statement:
            "La carte indique 17/5 du parcours. Entre quels entiers places-tu cette distance ?",
          hint: "17 ÷ 5 = 3 reste 2.",
          caption: "Tu pointes entre 3 et 4.",
        },
        espace: {
          title: "Dernière lecture",
          statement:
            "La console indique 17/5 d’unité. Entre quels entiers places-tu cette distance ?",
          hint: "17 ÷ 5 = 3 reste 2.",
          caption: "Tu pointes entre 3 et 4.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Positions trouvées !",
          statement:
            "Grâce à tes lectures sur la droite, l’équipe se place parfaitement. L’action démarre au bon endroit.",
          caption: "Le terrain est lu, la passe part.",
        },
        rugby: {
          title: "Couloirs maîtrisés !",
          statement:
            "Tes encadrements ont ouvert le bon couloir. La phase avance au bon endroit.",
          caption: "Le schéma est clair, l’avancée part.",
        },
        equitation: {
          title: "Sentier maîtrisé !",
          statement:
            "Tu as placé chaque borne sur la droite. Le cheval avance au bon rythme jusqu’à l’écurie.",
          caption: "Le parcours est lu, le retour continue.",
        },
        espace: {
          title: "Trajectoire calée !",
          statement:
            "Les balises sont correctement placées. Le module s’aligne pour l’approche finale.",
          caption: "La droite est lue, l’approche commence.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais placer une fraction sur la droite",
        statement: "Une fraction est aussi un nombre : on peut la placer et l’encadrer.",
        note: "1. Je divise le haut par le bas (quotient entier). 2. Le reste donne la partie fractionnaire. 3. J’encadre entre deux entiers consécutifs. Exemple : 11/5 → 2 reste 1 → entre 2 et 3.",
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
          "Tu sais reconnaître une fraction plus grande que 1, l’écrire, et l’encadrer entre deux entiers sur une droite graduée.",
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
            "Au prochain match, tu compareras des fractions et tu apprendras à les additionner pour combiner les courses.",
          caption: "Des fractions à additionner apparaissent sur le tableau.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine phase demandera de comparer et d’additionner des fractions de terrain.",
          caption: "Des fractions à combiner apparaissent au sol.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain sentier, tu compareras des tronçons et tu additionneras des fractions de parcours.",
          caption: "Des bornes à combiner apparaissent au loin.",
        },
        espace: {
          title: "Un signal de calcul",
          statement:
            "La prochaine mission demandera de comparer et d’additionner des fractions de trajectoire.",
          caption: "Des opérations sur fractions s’affichent.",
        },
      },
    },
  ],
});
