import { allUniverses, defineMission } from "../../define";

export const MISSION_ID = "cm2-maths-calcul-mental-01";

/**
 * CM2 maths — Automatismes de calcul mental.
 * ×10/100, doubles, demi, compléments à 100/1000, calcul réfléchi.
 * Trame standard Happy Learn (Phase A).
 */
export const mission = defineMission({
  id: MISSION_ID,
  grade: "cm2",
  subject: "maths",
  title: "Calcul mental en mission",
  blurb: "Automatismes : ×10/100, doubles, demi, compléments et calcul réfléchi.",
  available: true,
  version: 1,
  steps: [
    {
      kind: "continue",
      kicker: "Tutoriel",
      progress: 0,
      copy: allUniverses({
        title: "Des automatismes utiles",
        statement:
          "Le calcul mental s’appuie sur des gestes rapides : multiplier ou diviser par 10 et 100, doubler, prendre la moitié, trouver un complément à 100 ou 1000.",
        note: "Tu cherches d’abord un chemin simple avant de calculer « en force ».",
        caption: "Les automatismes s’activent.",
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
            "Pendant le match, les scores et distances changent vite. Tu dois calculer sans calculette pour rester dans le tempo.",
          caption: "Des calculs rapides s’affichent au tableau.",
        },
        rugby: {
          title: "Tu entres en jeu",
          statement:
            "La phase avance. Les totaux et écarts se calculent en quelques secondes pour choisir le couloir.",
          caption: "Des calculs rapides s’affichent au sol.",
        },
        equitation: {
          title: "Le chemin du retour",
          statement:
            "Entre deux bornes, tu ajustes distances et rythmes avec des calculs mentaux nets.",
          caption: "Des calculs rapides apparaissent sur les bornes.",
        },
        espace: {
          title: "Le retour vers la station",
          statement:
            "La console demande des corrections rapides. Un automatisme bien choisi garde la trajectoire.",
          caption: "Des calculs rapides s’affichent.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Objectif",
      progress: 0,
      copy: {
        football: {
          title: "Gagne en rapidité",
          statement:
            "Enchaîne ×10/100, doubles, demis et compléments pour répondre juste et vite.",
          caption: "Les automatismes s’allument.",
        },
        rugby: {
          title: "Gagne en rapidité",
          statement:
            "Utilise ×10/100, doubles, demis et compléments pour caler chaque décision.",
          caption: "Les automatismes s’allument.",
        },
        equitation: {
          title: "Gagne en rapidité",
          statement:
            "Appuie-toi sur ×10/100, doubles, demis et compléments pour garder le rythme.",
          caption: "Les automatismes s’allument.",
        },
        espace: {
          title: "Gagne en rapidité",
          statement:
            "Active ×10/100, doubles, demis et compléments pour corriger la trajectoire.",
          caption: "Les automatismes s’allument.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 1 sur 6 · ×10",
      progress: 1,
      expected: "370",
      distractors: ["37", "3700"],
      copy: allUniverses({
        title: "Multiplier par 10",
        statement: "Quel est le résultat de 37 × 10 ?",
        hint: "Multiplier par 10 ajoute un zéro à droite : 37 → 370.",
        caption: "37 × 10 = 370.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 2 sur 6 · ×100",
      progress: 2,
      expected: "4500",
      distractors: ["450", "45000"],
      copy: {
        football: {
          title: "Multiplier par 100",
          statement: "Quel est le résultat de 45 × 100 ?",
          hint: "Multiplier par 100 ajoute deux zéros : 45 → 4500.",
          caption: "45 × 100 = 4500.",
        },
        rugby: {
          title: "Multiplier par 100",
          statement: "Quel est le résultat de 45 × 100 ?",
          hint: "Deux zéros à droite : 4500.",
          caption: "45 × 100 = 4500.",
        },
        equitation: {
          title: "Multiplier par 100",
          statement: "Quel est le résultat de 45 × 100 ?",
          hint: "Deux zéros à droite : 4500.",
          caption: "45 × 100 = 4500.",
        },
        espace: {
          title: "Multiplier par 100",
          statement: "Quel est le résultat de 45 × 100 ?",
          hint: "Deux zéros à droite : 4500.",
          caption: "45 × 100 = 4500.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Étape 3 sur 6 · Double",
      progress: 3,
      expected: "168",
      distractors: ["158", "178"],
      copy: allUniverses({
        title: "Le double",
        statement: "Quel est le double de 84 ?",
        hint: "84 + 84 : 80 + 80 = 160 et 4 + 4 = 8 → 168.",
        caption: "Le double de 84 est 168.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 4 sur 6 · Demi",
      progress: 4,
      expected: "125",
      distractors: ["250", "115"],
      copy: allUniverses({
        title: "La moitié",
        statement: "Quelle est la moitié de 250 ?",
        hint: "La moitié, c’est diviser par 2 : 250 ÷ 2 = 125.",
        caption: "La moitié de 250 est 125.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 5 sur 6 · Complément à 100",
      progress: 5,
      expected: "37",
      distractors: ["27", "63"],
      copy: allUniverses({
        title: "Complément à 100",
        statement: "Quel nombre faut-il ajouter à 63 pour obtenir 100 ?",
        hint: "100 − 63 : de 63 à 70 il manque 7, puis 30 → 37.",
        caption: "63 + 37 = 100.",
      }),
    },
    {
      kind: "number",
      kicker: "Étape 6 sur 6 · Complément à 1000",
      progress: 6,
      expected: "245",
      distractors: ["255", "345"],
      copy: {
        football: {
          title: "Complément à 1000",
          statement: "Quel nombre faut-il ajouter à 755 pour obtenir 1000 ?",
          hint: "1000 − 755 : de 755 à 800 = 45, puis 200 → 245.",
          caption: "755 + 245 = 1000.",
        },
        rugby: {
          title: "Complément à 1000",
          statement: "Quel nombre faut-il ajouter à 755 pour obtenir 1000 ?",
          hint: "1000 − 755 = 245.",
          caption: "755 + 245 = 1000.",
        },
        equitation: {
          title: "Complément à 1000",
          statement: "Quel nombre faut-il ajouter à 755 pour obtenir 1000 ?",
          hint: "1000 − 755 = 245.",
          caption: "755 + 245 = 1000.",
        },
        espace: {
          title: "Complément à 1000",
          statement: "Quel nombre faut-il ajouter à 755 pour obtenir 1000 ?",
          hint: "1000 − 755 = 245.",
          caption: "755 + 245 = 1000.",
        },
      },
    },
    {
      kind: "number",
      kicker: "Application",
      progress: 6,
      expected: "360",
      distractors: ["350", "370"],
      copy: {
        football: {
          title: "Calcul réfléchi",
          statement:
            "Quel est le résultat de 4 × 90 ? (Tu peux passer par 4 × 100 − 4 × 10.)",
          hint: "4 × 100 = 400 et 4 × 10 = 40 → 400 − 40 = 360.",
          caption: "Tu valides 360.",
        },
        rugby: {
          title: "Calcul réfléchi",
          statement: "Quel est le résultat de 4 × 90 ?",
          hint: "4 × 100 − 4 × 10 = 400 − 40 = 360.",
          caption: "Tu valides 360.",
        },
        equitation: {
          title: "Calcul réfléchi",
          statement: "Quel est le résultat de 4 × 90 ?",
          hint: "4 × 100 − 4 × 10 = 360.",
          caption: "Tu valides 360.",
        },
        espace: {
          title: "Calcul réfléchi",
          statement: "Quel est le résultat de 4 × 90 ?",
          hint: "4 × 100 − 4 × 10 = 360.",
          caption: "Tu valides 360.",
        },
      },
    },
    {
      kind: "continue",
      kicker: "Mission réussie",
      progress: 6,
      copy: {
        football: {
          title: "Automatismes prêts !",
          statement:
            "Tu as enchaîné les calculs sans perdre le tempo. L’équipe avance plus vite.",
          caption: "Le calcul mental est fluide.",
        },
        rugby: {
          title: "Automatismes prêts !",
          statement:
            "Tes automatismes ont calé chaque décision. La phase reste nette.",
          caption: "Le calcul mental est fluide.",
        },
        equitation: {
          title: "Automatismes prêts !",
          statement:
            "Les calculs sont justes et rapides. Le rythme du parcours tient.",
          caption: "Le calcul mental est fluide.",
        },
        espace: {
          title: "Automatismes prêts !",
          statement:
            "Les corrections mentales ont stabilisé la trajectoire. Approche claire.",
          caption: "Le calcul mental est fluide.",
        },
      },
    },
    {
      kind: "method",
      kicker: "Ce que tu as appris",
      progress: 6,
      copy: allUniverses({
        title: "Je sais utiliser des automatismes",
        statement: "Un bon chemin de calcul évite les erreurs et gagne du temps.",
        note: "1. ×10 → un zéro ; ×100 → deux zéros. 2. Double = ×2 ; demi = ÷2. 3. Complément à 100 ou 1000 : chercher ce qui manque. 4. Calcul réfléchi : décomposer (ex. 4 × 90 = 4 × 100 − 4 × 10).",
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
          "Tu sais mobiliser ×10/100, doubles, demis, compléments à 100/1000 et un calcul réfléchi simple.",
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
            "Au prochain match, tu résoudras des problèmes en une ou deux étapes pour décider de la passe.",
          caption: "Des situations-problèmes s’affichent.",
        },
        rugby: {
          title: "Un nouveau défi t’attend",
          statement:
            "La prochaine rencontre demandera de résoudre des problèmes en une ou deux étapes.",
          caption: "Des situations-problèmes apparaissent.",
        },
        equitation: {
          title: "Un nouveau défi t’attend",
          statement:
            "Sur le prochain parcours, tu résoudras des problèmes en une ou deux étapes.",
          caption: "Des situations-problèmes apparaissent.",
        },
        espace: {
          title: "Signal problèmes",
          statement:
            "La console bascule vers des problèmes en une ou deux étapes pour la prochaine mission.",
          caption: "Des situations-problèmes clignotent.",
        },
      },
    },
  ],
});
