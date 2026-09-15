import type { Step, UniverseCopy, UniverseSlug } from "./types";

function all(copy: UniverseCopy): Record<UniverseSlug, UniverseCopy> {
  return {
    football: copy,
    rugby: copy,
    equitation: copy,
    espace: copy,
  };
}

export const STEPS: Step[] = [
  {
    id: "T00",
    kind: "tutorial",
    kicker: "Tutoriel",
    progress: 0,
    expected: "3/4",
    copy: all({
      title: "Écrire une fraction",
      statement:
        "Quand ta réponse est une fraction, écris d’abord le nombre du haut, puis le nombre du bas. Recopie la fraction trois quarts pour continuer.",
      note: "La barre entre les deux nombres est comme au tableau.",
      hint: "Le nombre du haut est 3. Le nombre du bas est 4.",
      caption: "On écrit une fraction comme à l’école.",
    }),
  },
  {
    id: "N01",
    kind: "continue",
    kicker: "Mise en action",
    progress: 0,
    copy: {
      football: {
        title: "Tu entres en jeu",
        statement:
          "Tu entres au milieu de terrain pour les Bleus. Il reste quinze minutes, le score est de 1 partout. Ton équipe compte sur toi.",
        caption: "Tu prends ta place au milieu du terrain.",
      },
      rugby: {
        title: "Tu entres en jeu",
        statement:
          "Tu rejoins tes partenaires pour les Bleus. Il reste dix minutes, le score est de 12 partout. Une dernière phase peut tout changer.",
        caption: "Tu prends ta place derrière tes partenaires.",
      },
      equitation: {
        title: "Le chemin du retour",
        statement:
          "Tu termines une randonnée avec ton cheval. Il est temps de revenir à l’écurie, ensemble et en confiance.",
        caption: "L’écurie apparaît au bout du sentier.",
      },
      espace: {
        title: "Le retour vers la station",
        statement:
          "Tu reviens d’une mission d’observation. Le module est intact, mais sa trajectoire a changé. Il faut rejoindre la station.",
        caption: "La station apparaît au loin.",
      },
    },
  },
  {
    id: "N02",
    kind: "continue",
    kicker: "Objectif",
    progress: 0,
    copy: {
      football: {
        title: "Lis le jeu",
        statement:
          "Observe les espaces, réussis tes passes et trouve le déplacement qui surprendra la défense. Chaque décision fera avancer l’action.",
        caption: "Les trois zones du terrain s’allument : gauche, axe, droite.",
      },
      rugby: {
        title: "Observe la défense",
        statement:
          "Regarde où il y a de l’espace. Tes calculs t’aideront à choisir le bon couloir pour avancer.",
        caption: "Les couloirs gauche, axe et large deviennent visibles.",
      },
      equitation: {
        title: "Choisis le chemin de l’écurie",
        statement:
          "Plusieurs sentiers permettent de rentrer. Certains passages sont stables. D’autres demandent de ralentir.",
        caption: "Les principaux sentiers s’activent.",
      },
      espace: {
        title: "Rétablis la trajectoire",
        statement:
          "Analyse les signaux, corrige la trajectoire et prépare l’arrimage avant que la station ne passe derrière la Terre.",
        caption: "Aucun chronomètre : chaque décision fait progresser le module.",
      },
    },
  },
  {
    id: "M01",
    kind: "fraction-choice",
    kicker: "Étape 1 sur 6 · Reconnaître une moitié",
    progress: 1,
    expected: "6/12",
    distractors: ["4/12", "8/12"],
    copy: {
      football: {
        title: "Observe les déplacements",
        statement:
          "Tu observes 12 déplacements. La moitié ont eu lieu dans la zone où tu te trouves. Quelle fraction représente cette moitié ?",
        note: "Tu peux dessiner deux groupes égaux dans ton cahier.",
        hint: "Une moitié partage les 12 déplacements en deux groupes égaux.",
        caption: "Six déplacements dans ta zone.",
      },
      rugby: {
        title: "Observe les déplacements",
        statement:
          "Tu observes 12 déplacements. La moitié se font dans ton couloir. Quelle fraction représente cette moitié ?",
        hint: "Une moitié partage les 12 déplacements en deux groupes égaux.",
        caption: "Six déplacements dans ton couloir.",
      },
      equitation: {
        title: "Repère le chemin stable",
        statement:
          "Tu observes 12 passages. La moitié offrent un sol stable. Quelle fraction représente ces passages ?",
        hint: "Une moitié partage les 12 passages en deux groupes égaux.",
        caption: "Six passages forment une trajectoire continue.",
      },
      espace: {
        title: "Analyse les signaux",
        statement:
          "Tu observes 12 signaux de navigation. La moitié indiquent une trajectoire stable. Quelle fraction représente ces signaux ?",
        hint: "Une moitié partage les 12 signaux en deux groupes égaux.",
        caption: "Six signaux stables se colorent.",
      },
    },
  },
  {
    id: "M01B",
    kind: "simplify",
    kicker: "Étape 1 sur 6 · Fraction plus simple",
    progress: 1,
    expected: "1/2",
    distractors: ["2/3", "3/4"],
    copy: {
      football: {
        title: "Trouve une fraction plus simple",
        statement:
          "Tu as repéré 6 déplacements parmi les 12. À quelle fraction plus simple cela correspond-il ?",
        hint: "Cherche une fraction plus simple qui correspond à une moitié.",
        caption: "Les deux groupes sont égaux : une moitié.",
      },
      rugby: {
        title: "Trouve une fraction plus simple",
        statement:
          "Tu as repéré 6 déplacements parmi les 12. À quelle fraction plus simple cela correspond-il ?",
        hint: "Cherche une fraction plus simple qui correspond à une moitié.",
        caption: "Les deux groupes sont égaux : une moitié.",
      },
      equitation: {
        title: "Trouve une fraction plus simple",
        statement:
          "Tu as repéré 6 passages stables parmi les 12. À quelle fraction plus simple cela correspond-il ?",
        hint: "Cherche une fraction plus simple qui correspond à une moitié.",
        caption: "Le chemin retenu s’éclaire.",
      },
      espace: {
        title: "Trouve une fraction plus simple",
        statement:
          "Tu as repéré 6 signaux stables parmi les 12. À quelle fraction plus simple cela correspond-il ?",
        hint: "Cherche une fraction plus simple qui correspond à une moitié.",
        caption: "La trajectoire principale devient plus lisible.",
      },
    },
  },
  {
    id: "N03",
    kind: "continue",
    kicker: "Transition",
    progress: 1,
    copy: {
      football: {
        title: "Le pressing se resserre",
        statement:
          "Les adversaires se rapprochent. Tu dois trouver les bonnes passes pour sortir sans te précipiter.",
        caption: "Le jeu va se jouer dans un espace plus petit.",
      },
      rugby: {
        title: "La défense accélère",
        statement:
          "Le rideau défensif se referme. Il faut jouer vite, mais avec des choix justes.",
        caption: "Le prochain calcul ouvre un espace.",
      },
      equitation: {
        title: "Entre dans le sous-bois",
        statement:
          "Le chemin devient plus étroit. Tu dois savoir où ralentir pour garder ton cheval attentif.",
        caption: "Le cheval entre dans la zone boisée.",
      },
      espace: {
        title: "Prépare la correction",
        statement:
          "Le module se trouve encore légèrement trop bas. Tu dois répartir les prochaines impulsions des moteurs.",
        caption: "La correction sera douce et progressive.",
      },
    },
  },
  {
    id: "M02",
    kind: "number",
    kicker: "Étape 2 sur 6 · Une part d’une quantité",
    progress: 2,
    expected: "5",
    distractors: ["4", "15"],
    copy: {
      football: {
        title: "Sors du pressing",
        statement:
          "Tu observes 20 possibilités de passes. Un quart d’entre elles permettent de sortir du pressing. Combien de possibilités cela représente-t-il ?",
        hint: "Partage les 20 possibilités en 4 parts et trouve la valeur d’une part.",
        caption: "Cinq possibilités ouvrent une trajectoire.",
      },
      rugby: {
        title: "Joue rapidement",
        statement:
          "Tu observes 20 possibilités de passes. Un quart d’entre elles permettent de jouer dans des espaces libres. Combien de possibilités cela représente-t-il ?",
        hint: "Partage les 20 possibilités en 4 parts et trouve la valeur d’une part.",
        caption: "Cinq possibilités dans des espaces libres.",
      },
      equitation: {
        title: "Choisis les passages au pas",
        statement:
          "Le sous-bois comporte 20 portions. Un quart doit être parcouru au pas. Combien de portions doivent être parcourues au pas ?",
        hint: "Partage les 20 portions en 4 parts et trouve la valeur d’une part.",
        caption: "Cinq zones étroites au pas.",
      },
      espace: {
        title: "Corrige l’altitude",
        statement:
          "Le module dispose de 20 impulsions. Un quart doit servir à corriger son altitude. Combien cela représente-t-il ?",
        hint: "Partage les 20 impulsions en 4 parts et trouve la valeur d’une part.",
        caption: "Cinq impulsions font remonter le module.",
      },
    },
  },
  {
    id: "M03",
    kind: "number",
    kicker: "Étape 3 sur 6 · Plusieurs parts",
    progress: 3,
    expected: "15",
    distractors: ["5", "18"],
    copy: {
      football: {
        title: "Stabilise le jeu",
        statement:
          "Sur les 20 possibilités, les trois quarts restent propres malgré le pressing. Combien de possibilités restent propres ?",
        hint: "Tu as déjà la valeur d’une part. Prends maintenant trois parts.",
        caption: "Quinze possibilités gardent le ballon dans l’équipe.",
      },
      rugby: {
        title: "Garde le rythme",
        statement:
          "Sur les 20 possibilités, les trois quarts permettent de conserver le ballon. Combien cela représente-t-il ?",
        hint: "Tu as déjà la valeur d’une part. Prends maintenant trois parts.",
        caption: "Quinze possibilités conservent le ballon.",
      },
      equitation: {
        title: "Garde une allure régulière",
        statement:
          "Sur les 20 portions du sous-bois, les trois quarts permettent de conserver une allure régulière. Sur combien de portions pourras-tu la garder ?",
        hint: "Tu as déjà la valeur d’une part. Prends maintenant trois parts.",
        caption: "Quinze portions forment une ligne rythmée.",
      },
      espace: {
        title: "Stabilise la propulsion",
        statement:
          "Sur les 20 impulsions envoyées, les trois quarts ont atteint la puissance demandée. Combien étaient correctement réglées ?",
        hint: "Tu as déjà la valeur d’une part. Prends maintenant trois parts.",
        caption: "Quinze impulsions stabilisent le module.",
      },
    },
  },
  {
    id: "M04",
    kind: "number",
    kicker: "Étape 4 sur 6 · Autre dénominateur",
    progress: 4,
    expected: "12",
    distractors: ["6", "16"],
    copy: {
      football: {
        title: "Lis les appels",
        statement:
          "Tes partenaires ont fait 18 appels. Les deux tiers sont bien placés pour une passe. Combien d’appels sont bien placés ?",
        hint: "Partage les 18 appels en 3 parts et prends 2 parts.",
        caption: "Douze appels bien placés.",
      },
      rugby: {
        title: "Lis les relais",
        statement:
          "Tes partenaires ont proposé 18 relais. Les deux tiers sont dans le bon tempo. Combien de relais peux-tu utiliser ?",
        hint: "Partage les 18 relais en 3 parts et prends 2 parts.",
        caption: "Douze relais dans le bon tempo.",
      },
      equitation: {
        title: "Traverser la zone encombrée",
        statement:
          "Le sentier traverse une zone encombrée longue de 18 mètres. Les deux tiers du chemin sont dégagés. Sur combien de mètres peux-tu avancer sans ralentir ?",
        hint: "Partage les 18 mètres en 3 parts et prends 2 parts.",
        caption: "Douze mètres de chemin dégagé.",
      },
      espace: {
        title: "Reçois les bons signaux",
        statement:
          "La station a envoyé 18 signaux. Les deux tiers ont été reçus correctement. Combien de signaux as-tu reçus ?",
        hint: "Partage les 18 signaux en 3 parts et prends 2 parts.",
        caption: "Douze signaux relient le module à la station.",
      },
    },
  },
  {
    id: "M05A",
    kind: "number",
    kicker: "Étape 5 sur 6 · Problème en deux étapes",
    progress: 5,
    expected: "18",
    distractors: ["6", "21"],
    twoStep: 1,
    copy: {
      football: {
        title: "Crée le danger — étape 1",
        statement:
          "Ton équipe a tenté 24 passes. Les trois quarts ont été réussies. Combien de passes ont trouvé un partenaire ?",
        note: "Garde le résultat : tu en auras besoin juste après.",
        hint: "Trouve la valeur d’un quart de 24, puis prends trois parts.",
        caption: "Dix-huit passes réussies sont conservées.",
      },
      rugby: {
        title: "Franchis la ligne — étape 1",
        statement:
          "Ton équipe a tenté 24 passes. Les trois quarts ont été réussies. Combien ont trouvé un partenaire ?",
        note: "Garde le résultat : tu en auras besoin juste après.",
        hint: "Trouve la valeur d’un quart de 24, puis prends trois parts.",
        caption: "Dix-huit passes réussies sont conservées.",
      },
      equitation: {
        title: "Prépare le saut — étape 1",
        statement:
          "Tu disposes d’une zone de 24 mètres pour préparer ton cheval. Les trois quarts sont dégagés. Quelle distance peux-tu utiliser ?",
        note: "Garde le résultat : tu en auras besoin à l’étape suivante.",
        hint: "Trouve la valeur d’un quart de 24, puis prends trois parts.",
        caption: "Dix-huit mètres dégagés se colorent.",
      },
      espace: {
        title: "Prépare l’approche — étape 1",
        statement:
          "Tu disposes de 24 commandes. Tu peux en utiliser les trois quarts, validées par la station. Combien de commandes peux-tu utiliser ?",
        note: "Garde le résultat : tu en auras besoin à l’étape suivante.",
        hint: "Trouve la valeur d’un quart de 24, puis prends trois parts.",
        caption: "Dix-huit commandes validées.",
      },
    },
  },
  {
    id: "M05B",
    kind: "number",
    kicker: "Étape 5 sur 6 · Problème en deux étapes",
    progress: 5,
    expected: "6",
    distractors: ["3", "8"],
    twoStep: 2,
    copy: {
      football: {
        title: "Crée le danger — étape 2",
        statement:
          "Parmi les 18 passes réussies, un tiers ont été vraiment dangereuses. Combien de passes ont créé le danger ?",
        hint: "Partage les 18 passes réussies en 3 parts et trouve la valeur d’une part.",
        caption: "Six passes dangereuses vers la surface.",
      },
      rugby: {
        title: "Franchis la ligne — étape 2",
        statement:
          "Parmi les 18 passes réussies, un tiers ont permis de franchir la ligne d’avantage. Combien de passes ont fait avancer l’équipe ?",
        hint: "Partage les 18 passes réussies en 3 parts et trouve la valeur d’une part.",
        caption: "Six franchissements.",
      },
      equitation: {
        title: "Prépare le saut — étape 2",
        statement:
          "Parmi les 18 mètres dégagés, un tiers te permet d’installer une allure régulière avant le saut. Sur quelle distance dois-tu garder cette allure ?",
        hint: "Partage les 18 mètres dégagés en 3 parts et trouve la valeur d’une part.",
        caption: "Six mètres juste avant l’arbre tombé.",
      },
      espace: {
        title: "Prépare l’approche — étape 2",
        statement:
          "Parmi les 18 commandes validées, un tiers aligne directement le module avec le sas. Combien de commandes alignent le module ?",
        hint: "Partage les 18 commandes validées en 3 parts et trouve la valeur d’une part.",
        caption: "Six repères rapprochent le module du sas.",
      },
    },
  },
  {
    id: "M06",
    kind: "number",
    kicker: "Étape 6 sur 6 · Complément à un tout",
    progress: 6,
    expected: "5",
    distractors: ["15", "25"],
    copy: {
      football: {
        title: "Choisis la dernière attaque",
        statement:
          "Sur 30 attaques préparées, la moitié passent par la droite et un tiers passent par la gauche. Toutes les autres passent dans l’axe. Combien d’attaques restent dans l’axe ?",
        note: "Calcule la moitié de 30, puis le tiers de 30. Retire ces deux résultats au total.",
        hint: "Calcule séparément la moitié de 30 et le tiers de 30, puis cherche ce qu’il manque.",
        caption: "Les attaques de l’axe restent à trouver par le calcul.",
      },
      rugby: {
        title: "Choisis la dernière intention",
        statement:
          "Sur 30 attaques possibles, la moitié partent au large à droite et un tiers au large à gauche. Toutes les autres sont des départs au ras. Combien de départs au ras restent possibles ?",
        note: "Calcule la moitié de 30, puis le tiers de 30. Retire ces deux résultats au total.",
        hint: "Calcule séparément la moitié de 30 et le tiers de 30, puis cherche ce qu’il manque.",
        caption: "Les départs au ras restent à trouver par le calcul.",
      },
      equitation: {
        title: "Trouve les repères du saut",
        statement:
          "La trajectoire comporte 30 repères. La moitié sert à redresser ton cheval, un tiers à stabiliser son allure, le reste déclenche le saut. Combien de repères permettent de déclencher le saut ?",
        hint: "Calcule séparément la moitié de 30 et le tiers de 30, puis cherche ce qu’il manque.",
        caption: "Les derniers repères déclenchent le saut.",
      },
      espace: {
        title: "Configure l’arrimage",
        statement:
          "La procédure comporte 30 repères. La moitié règle la vitesse, un tiers stabilise le module et le reste déclenche l’arrimage. Combien de repères déclenchent l’arrimage ?",
        hint: "Calcule séparément la moitié de 30 et le tiers de 30, puis cherche ce qu’il manque.",
        caption: "Les derniers repères lancent l’arrimage.",
      },
    },
  },
  {
    id: "D01",
    kind: "direction",
    kicker: "Décision finale",
    progress: 6,
    expected: "axe",
    distractors: ["gauche", "droite"],
    copy: {
      football: {
        title: "Joue la passe décisive",
        statement: "Où diriges-tu la dernière passe pour surprendre la défense ?",
        hint: "L’espace le plus dangereux est droit devant toi.",
        caption: "La passe dans l’axe ouvre le but.",
      },
      rugby: {
        title: "Joue au ras",
        statement: "Où diriges-tu la dernière passe pour franchir ?",
        hint: "Le plus petit intervalle, droit devant, est le bon.",
        caption: "Le jeu dans l’axe libère l’essai.",
      },
      equitation: {
        title: "Choisis ton passage",
        statement:
          "Ton cheval est droit et son allure est régulière. Où diriges-tu ton regard pour garder la meilleure trajectoire ?",
        hint: "Regarde loin, droit devant toi.",
        caption: "Le regard dans l’axe libère le franchissement.",
      },
      espace: {
        title: "Choisis l’axe final",
        statement:
          "Le module est stable devant la station. Où diriges-tu sa trajectoire pour rejoindre le sas ?",
        hint: "Le sas de la station est devant toi.",
        caption: "Le module s’aligne avec le sas.",
      },
    },
  },
  {
    id: "N04",
    kind: "continue",
    kicker: "Mission réussie",
    progress: 6,
    copy: {
      football: {
        title: "But ! Victoire !",
        statement: "La passe trouve son destinataire. Le ballon rentre. Les Bleus l’emportent 2 à 1.",
        caption: "Félicitations : tu as fait basculer le match.",
      },
      rugby: {
        title: "Essai ! Victoire !",
        statement: "Le dernier mouvement franchit la ligne. Les Bleus l’emportent 17 à 12.",
        caption: "Félicitations : tu as fait basculer le match.",
      },
      equitation: {
        title: "Retour à l’écurie",
        statement:
          "Tu regardes loin devant toi. Ton cheval franchit calmement l’arbre tombé. Vous rentrez ensemble, en confiance.",
        caption: "Franchissement réussi, retour au pas jusqu’à l’écurie.",
      },
      espace: {
        title: "Arrimage réussi",
        statement:
          "Tu maintiens le module dans l’axe. Les attaches se verrouillent. La liaison avec la station est sécurisée.",
        caption: "Le module est amarré. Mission réussie.",
      },
    },
  },
  {
    id: "L01",
    kind: "method",
    kicker: "Ce que tu as appris",
    progress: 6,
    copy: all({
      title: "Je sais calculer une fraction d’un nombre",
      statement: "La stratégie utilisée fonctionne à chaque fois.",
      note: "1. Je partage par le nombre du bas. 2. Je prends le nombre de parts indiqué en haut. Exemple : 3/4 de 24 → 24 ÷ 4 = 6, puis 6 × 3 = 18.",
      caption: "Tu pourras réutiliser cette méthode dans une autre mission.",
    }),
  },
  {
    id: "B01",
    kind: "bilan",
    kicker: "Bilan sans note",
    progress: 6,
    copy: {
      football: {
        title: "Ton bilan",
        statement:
          "Tu sais calculer une fraction d’une quantité et utiliser un résultat dans un problème en deux étapes.",
        note: "Qu’as-tu préféré dans cette mission ?",
        caption: "Les réussites sont valorisées sans classement.",
      },
      rugby: {
        title: "Ton bilan",
        statement:
          "Tu sais calculer une fraction d’une quantité et utiliser un résultat dans un problème en deux étapes.",
        note: "Qu’as-tu préféré dans cette mission ?",
        caption: "Les réussites sont valorisées sans classement.",
      },
      equitation: {
        title: "Ton bilan",
        statement:
          "Tu sais calculer une fraction d’une quantité et utiliser un résultat dans un problème en deux étapes.",
        note: "Qu’as-tu préféré dans cette mission ?",
        caption: "Les réussites sont valorisées sans classement.",
      },
      espace: {
        title: "Ton bilan",
        statement:
          "Tu sais calculer une fraction d’une quantité et utiliser un résultat dans un problème en deux étapes.",
        note: "Qu’as-tu préféré dans cette mission ?",
        caption: "Les réussites sont valorisées sans classement.",
      },
    },
  },
  {
    id: "Z01",
    kind: "teaser",
    kicker: "Prochaine mission",
    progress: 6,
    copy: {
      football: {
        title: "Un nouveau défi t’attend",
        statement:
          "Au prochain match, tu découvriras un nouveau poste et une défense qui change de formation pendant l’action.",
        caption: "Un point d’interrogation apparaît sur le terrain.",
      },
      rugby: {
        title: "Un nouveau défi t’attend",
        statement:
          "La prochaine rencontre demandera de lire une défense qui avance et recule en même temps.",
        caption: "Un nouveau schéma apparaît au loin.",
      },
      equitation: {
        title: "Un nouveau défi t’attend",
        statement:
          "Un nouveau chemin te conduira jusqu’à une rivière. Il faudra choisir où traverser et adapter l’allure.",
        caption: "Une rivière apparaît au loin, sans compte à rebours.",
      },
      espace: {
        title: "Un signal mystérieux",
        statement:
          "Les capteurs détectent un signal très faible au-delà de l’orbite terrestre. Une prochaine mission permettra peut-être d’en découvrir la provenance.",
        caption: "Un point lumineux inconnu apparaît au-delà de la station.",
      },
    },
  },
];

export const BILAN_CHOICES: Record<UniverseSlug, { value: string; label: string }[]> = {
  football: [
    { value: "pressing", label: "Sortir du pressing" },
    { value: "passes", label: "Réussir les passes" },
    { value: "but", label: "Marquer le but" },
  ],
  rugby: [
    { value: "espace", label: "Trouver l’espace" },
    { value: "passes", label: "Réussir les passes" },
    { value: "essai", label: "Marquer l’essai" },
  ],
  equitation: [
    { value: "sentier", label: "Choisir le sentier" },
    { value: "allure", label: "Garder l’allure" },
    { value: "saut", label: "Réussir le saut" },
  ],
  espace: [
    { value: "signaux", label: "Analyser les signaux" },
    { value: "trajectoire", label: "Corriger la trajectoire" },
    { value: "arrimage", label: "Réussir l’arrimage" },
  ],
};

export const DIRECTION_LABELS: Record<string, string> = {
  gauche: "À gauche",
  axe: "Dans l’axe",
  droite: "À droite",
};
