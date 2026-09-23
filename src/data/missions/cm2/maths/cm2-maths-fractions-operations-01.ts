import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-fractions-operations-01";

/**
 * CM2 maths — Comparer, additionner et soustraire des fractions.
 * Trame standard Happy Learn (Phase A).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Fractions en opérations",
  blurb: "Comparer, additionner et soustraire des fractions pour combiner des distances.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "tutorial",
      kicker: "Tutoriel",
      progress: 0,
      expected: "2/5",
      copy: allUniverses({
        title: "Écrire le résultat d’une opération",
        statement:
          "Quand tu additionnes ou soustrais des fractions de même dénominateur, le résultat s’écrit aussi en fraction. Recopie deux cinquièmes pour continuer.",
        note: "Même dénominateur : on additionne (ou soustrait) seulement les numérateurs.",
        hint: "Le nombre du haut est 2. Le nombre du bas est 5.",
        caption: "On écrit 2/5 comme au tableau.",
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
            "Deux coéquipiers ont couru des fractions de terrain. Tu dois combiner ou comparer leurs courses pour décider de la passe.",
          caption: "Deux courses s’affichent sur le tableau.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "Deux partenaires ont gagné des fractions de terrain. Tu compares et combines ces avancées.",
          caption: "Deux avancées s’affichent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Deux tronçons du sentier sont mesurés en fractions. Tu les compares, puis tu les combines.",
          caption: "Deux tronçons s’éclairent.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "Deux segments de trajectoire sont donnés en fractions. Tu les compares et tu les combines.",
          caption: "Deux segments s’affichent.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Combine les courses",
          statement:
            "Compare les fractions, puis additionne ou soustrais pour savoir combien de terrain a été couvert au total ou en différence.",
          caption: "Les opérations sur fractions s’activent.",
        },
        rugby: {
          title: "Combine les avancées",
          statement:
            "Compare, additionne et soustrais les fractions pour lire le gain net de terrain.",
          caption: "Les opérations sur fractions s’activent.",
        },
        equitation: {
          title: "Combine les tronçons",
          statement:
            "Compare et calcule avec les fractions pour connaître la longueur totale ou ce qu’il reste.",
          caption: "Les opérations sur fractions s’activent.",
        },
        espace: {
          title: "Combine les segments",
          statement:
            "Compare et calcule avec les fractions pour ajuster la trajectoire totale.",
          caption: "Les opérations sur fractions s’activent.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Étape 1 sur 6 · Comparer même dénominateur",
      progress: 1,
      expected: "5/8",
      distractors: ["3/8", "2/8"],
      copy: allUniverses({
        title: "La plus grande part",
        statement:
          "Parmi 3/8, 5/8 et 2/8, quelle fraction est la plus grande ?",
        hint: "Même dénominateur : on compare uniquement les numérateurs.",
        caption: "5/8 l’emporte.",
      }),
    },
    {
      kind: "choice",
      kicker: "Étape 2 sur 6 · Comparer à 1/2",
      progress: 2,
      expected: "5/8",
      distractors: ["3/8", "4/8"],
      copy: {
        football: {
          title: "Plus ou moins qu’une moitié ?",
          statement:
            "Quelle fraction est strictement plus grande qu’une moitié de terrain ?",
          hint: "Une moitié = 4/8. Cherche un numérateur plus grand que 4.",
          caption: "5/8 dépasse la moitié.",
        },
        rugby: {
          title: "Plus ou moins qu’une moitié ?",
          statement:
            "Quelle fraction est strictement plus grande qu’une moitié de couloir ?",
          hint: "Une moitié = 4/8.",
          caption: "5/8 dépasse la moitié.",
        },
        equitation: {
          title: "Plus ou moins qu’une moitié ?",
          statement:
            "Quelle fraction est strictement plus grande qu’une moitié de parcours ?",
          hint: "Une moitié = 4/8.",
          caption: "5/8 dépasse la moitié.",
        },
        espace: {
          title: "Plus ou moins qu’une moitié ?",
          statement:
            "Quelle fraction est strictement plus grande qu’une moitié d’unité ?",
          hint: "Une moitié = 4/8.",
          caption: "5/8 dépasse la moitié.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 3 sur 6 · Additionner",
      progress: 3,
      expected: "7/10",
      distractors: ["3/10", "7/20"],
      copy: {
        football: {
          title: "Additionne les courses",
          statement:
            "Un coéquipier court 3/10 de terrain, un autre 4/10. Quelle fraction ont-ils parcourue ensemble ?",
          hint: "Même dénominateur : 3 + 4 = 7, on garde 10.",
          caption: "7/10 de terrain au total.",
        },
        rugby: {
          title: "Additionne les avancées",
          statement:
            "Une avancée de 3/10 puis une autre de 4/10. Quelle fraction au total ?",
          hint: "3 + 4 = 7, dénominateur 10.",
          caption: "7/10 au total.",
        },
        equitation: {
          title: "Additionne les tronçons",
          statement:
            "Tu parcours 3/10 puis 4/10 du sentier. Quelle fraction au total ?",
          hint: "3 + 4 = 7, dénominateur 10.",
          caption: "7/10 au total.",
        },
        espace: {
          title: "Additionne les segments",
          statement:
            "Le module avance de 3/10 puis de 4/10. Quelle fraction au total ?",
          hint: "3 + 4 = 7, dénominateur 10.",
          caption: "7/10 au total.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 4 sur 6 · Soustraire",
      progress: 4,
      expected: "2/7",
      distractors: ["5/7", "3/7"],
      copy: {
        football: {
          title: "Calcule l’écart",
          statement:
            "Tu visais 5/7 de terrain, tu en as couru 3/7. Quelle fraction reste à parcourir ?",
          hint: "Même dénominateur : 5 − 3 = 2, on garde 7.",
          caption: "Il reste 2/7.",
        },
        rugby: {
          title: "Calcule l’écart",
          statement:
            "L’objectif était 5/7 de couloir, tu en as gagné 3/7. Quelle fraction reste ?",
          hint: "5 − 3 = 2, dénominateur 7.",
          caption: "Il reste 2/7.",
        },
        equitation: {
          title: "Calcule l’écart",
          statement:
            "Le tronçon fait 5/7, tu en as déjà fait 3/7. Quelle fraction reste ?",
          hint: "5 − 3 = 2, dénominateur 7.",
          caption: "Il reste 2/7.",
        },
        espace: {
          title: "Calcule l’écart",
          statement:
            "La cible était 5/7, le module a fait 3/7. Quelle fraction reste ?",
          hint: "5 − 3 = 2, dénominateur 7.",
          caption: "Il reste 2/7.",
        },
      },
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 5 sur 6 · Même dénominateur",
      progress: 5,
      expected: "3/4",
      distractors: ["2/4", "5/8"],
      copy: allUniverses({
        title: "Addition simple",
        statement: "Calcule 1/4 + 2/4.",
        hint: "1 + 2 = 3, on garde 4.",
        caption: "1/4 + 2/4 = 3/4.",
        note: "Quand les dénominateurs sont égaux, on n’additionne que les numérateurs.",
      }),
    },
    {
      kind: "fraction-choice",
      kicker: "Étape 6 sur 6 · Chaîne courte",
      progress: 6,
      expected: "5/6",
      distractors: ["1/6", "7/6"],
      copy: {
        football: {
          title: "Course puis écart",
          statement:
            "Tu gagnes 4/6 de terrain, puis encore 2/6, puis tu recules de 1/6. Quelle fraction as-tu gagnée au total ?",
          hint: "4 + 2 − 1 = 5 sixièmes.",
          caption: "Gain net : 5/6.",
          note: "4/6 + 2/6 − 1/6 = 5/6.",
        },
        rugby: {
          title: "Avancée puis écart",
          statement:
            "Tu gagnes 4/6, puis 2/6, puis tu perds 1/6. Quelle fraction au total ?",
          hint: "4 + 2 − 1 = 5, dénominateur 6.",
          caption: "Gain net : 5/6.",
        },
        equitation: {
          title: "Tronçons puis écart",
          statement:
            "Tu avances de 4/6, puis 2/6, puis tu reviens de 1/6. Quelle fraction au total ?",
          hint: "4 + 2 − 1 = 5, dénominateur 6.",
          caption: "Gain net : 5/6.",
        },
        espace: {
          title: "Segments puis écart",
          statement:
            "Le module avance de 4/6, puis 2/6, puis recule de 1/6. Quelle fraction au total ?",
          hint: "4 + 2 − 1 = 5, dénominateur 6.",
          caption: "Gain net : 5/6.",
        },
      },
    },
    {
      kind: "choice",
      kicker: "Application",
      progress: 6,
      expected: "3/5",
      distractors: ["1/5", "4/5"],
      copy: {
        football: {
          title: "Décision finale",
          statement: "Quel est le résultat de 2/5 + 1/5 ?",
          hint: "2 + 1 = 3, dénominateur 5.",
          caption: "Tu choisis 3/5.",
        },
        rugby: {
          title: "Décision finale",
          statement: "Quel est le résultat de 2/5 + 1/5 ?",
          hint: "2 + 1 = 3, dénominateur 5.",
          caption: "Tu choisis 3/5.",
        },
        equitation: {
          title: "Décision finale",
          statement: "Quel est le résultat de 2/5 + 1/5 ?",
          hint: "2 + 1 = 3, dénominateur 5.",
          caption: "Tu choisis 3/5.",
        },
        espace: {
          title: "Décision finale",
          statement: "Quel est le résultat de 2/5 + 1/5 ?",
          hint: "2 + 1 = 3, dénominateur 5.",
          caption: "Tu choisis 3/5.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Combinaison réussie !",
          statement:
            "Tes comparaisons et tes calculs ont ouvert l’espace. La passe décisive part au bon moment.",
          caption: "Les fractions combinées font basculer le jeu.",
        },
        rugby: {
          title: "Combinaison réussie !",
          statement:
            "Les avancées additionnées ont créé l’intervalle. L’essai devient possible.",
          caption: "Les fractions combinées ouvrent le jeu.",
        },
        equitation: {
          title: "Parcours combiné !",
          statement:
            "Tu as mesuré et combiné les tronçons. Le cheval retrouve une allure sûre.",
          caption: "Les fractions combinées guident le retour.",
        },
        espace: {
          title: "Trajectoire combinée !",
          statement:
            "Les segments additionnés calent la trajectoire. L’approche est stable.",
          caption: "Les fractions combinées sécurisent l’arrimage.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais comparer et calculer avec des fractions",
        statement: "Même dénominateur : on compare ou on calcule les numérateurs.",
        note: "Comparer : plus grand numérateur → plus grande fraction. Additionner : a/b + c/b = (a+c)/b. Soustraire : a/b − c/b = (a−c)/b. Exemple : 3/10 + 4/10 = 7/10.",
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
          "Tu sais comparer des fractions de même dénominateur, les additionner et les soustraire.",
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
            "Au prochain match, les distances s’écriront avec une virgule : place aux nombres décimaux.",
          caption: "Une virgule apparaît sur le tableau tactique.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine phase utilisera des nombres décimaux pour mesurer le terrain.",
          caption: "Une virgule apparaît sur le schéma.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain sentier, les bornes indiqueront des nombres décimaux.",
          caption: "Une virgule apparaît sur une borne.",
        },
        espace: {
          title: "Signal décimal",
          statement:
            "La console bascule en écriture décimale pour la prochaine mission.",
          caption: "Une virgule clignote sur l’écran.",
        },
      },
    },
  ],
});
