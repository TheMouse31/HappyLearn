import type { UniverseDef, UniverseSlug } from "./types";

export const UNIVERSES: Record<UniverseSlug, UniverseDef> = {
  football: {
    slug: "football",
    label: "Football",
    blurb: "Crée l’action décisive.",
    icon: "⚽",
    reward: "la Coupe du match",
    rewardShort: "Coupe du match",
    cta: "Entrer sur le terrain",
    instruction:
      "Enfile ton maillot, prends le temps de réfléchir. Tu pourras demander un indice si tu en as besoin.",
    mascot: "/neo/neo-football.webp",
    pouce: "/neo/neo-pouce-football.webp",
    body: "/neo/neo-a06-corps-football.webp",
    arm: "/neo/neo-a06-bras-football.webp",
  },
  rugby: {
    slug: "rugby",
    label: "Rugby",
    blurb: "Trouve l’espace dans la défense.",
    icon: "🏉",
    reward: "la Coupe de l’essai",
    rewardShort: "Coupe de l’essai",
    cta: "Commencer le match",
    instruction:
      "Enfile ton maillot, prends le temps de réfléchir. Tu pourras demander un indice si tu en as besoin.",
    mascot: "/neo/neo-rugby.webp",
    pouce: "/neo/neo-pouce-rugby.webp",
    body: "/neo/neo-a06-corps-rugby.webp",
    arm: "/neo/neo-a06-bras-rugby.webp",
  },
  equitation: {
    slug: "equitation",
    label: "Équitation",
    blurb: "Guide ton cheval vers l’écurie.",
    icon: "🐴",
    reward: "le Fer d’or",
    rewardShort: "Fer d’or",
    cta: "Partir sur le sentier",
    instruction:
      "Monte sur ton cheval et prends le temps de réfléchir. Tu pourras demander un indice si tu en as besoin.",
    mascot: "/neo/neo-equitation.webp",
    pouce: "/neo/neo-pouce-equitation.webp",
    body: "/neo/neo-a06-corps-equitation.webp",
    arm: "/neo/neo-a06-bras-equitation.webp",
  },
  espace: {
    slug: "espace",
    label: "Espace",
    blurb: "Rejoins la station en orbite.",
    icon: "🚀",
    reward: "l’Insigne orbital",
    rewardShort: "Insigne orbital",
    cta: "Rejoindre l’espace",
    instruction:
      "Enfile ta tenue de cosmonaute et prends le temps de réfléchir. Tu pourras demander un indice si tu en as besoin.",
    mascot: "/neo/neo-espace.webp",
    pouce: "/neo/neo-pouce-espace.webp",
    body: "/neo/neo-a06-corps-espace.webp",
    arm: "/neo/neo-a06-bras-espace.webp",
  },
};

export const UNIVERSE_ORDER: UniverseSlug[] = [
  "football",
  "rugby",
  "equitation",
  "espace",
];
