/** Offres d’abonnement — calquées sur les modèles courants des plateformes d’apprentissage
 * (Découverte / Famille / Classe / Établissement). Prix indicatifs, Stripe unique pour l’instant. */

export type SubscriptionPlanId = "decouverte" | "famille" | "classe" | "etablissement";

export type PlanFeature = {
  label: string;
  /** true = inclus, false = non, string = nuance affichée */
  values: Record<SubscriptionPlanId, boolean | string>;
};

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  blurb: string;
  priceMonthly: string;
  priceYearly: string;
  cta: string;
  /** Checkout Stripe (hors établissement / gratuit). */
  checkout: boolean;
  audience: "all" | "parent" | "enseignant" | "etablissement";
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "decouverte",
    name: "Découverte",
    blurb: "Essayer Happy Learn sans engagement.",
    priceMonthly: "Gratuit",
    priceYearly: "—",
    cta: "Continuer gratuitement",
    checkout: false,
    audience: "all",
  },
  {
    id: "famille",
    name: "Famille",
    blurb: "Missions à la maison, suivi et codes enfants.",
    priceMonthly: "9,90 €",
    priceYearly: "79 € / an",
    cta: "Choisir Famille",
    checkout: true,
    audience: "parent",
  },
  {
    id: "classe",
    name: "Classe",
    blurb: "Session live, roster et suivi de classe.",
    priceMonthly: "14,90 €",
    priceYearly: "119 € / an",
    cta: "Choisir Classe",
    checkout: true,
    audience: "enseignant",
  },
  {
    id: "etablissement",
    name: "Établissement",
    blurb: "Licence école, multi-classes et admin.",
    priceMonthly: "Sur devis",
    priceYearly: "Sur devis",
    cta: "Nous contacter",
    checkout: false,
    audience: "etablissement",
  },
];

export const SUBSCRIPTION_FEATURES: PlanFeature[] = [
  {
    label: "Missions pédagogiques",
    values: {
      decouverte: "Catalogue limité",
      famille: true,
      classe: true,
      etablissement: true,
    },
  },
  {
    label: "Espace foyer / enfants",
    values: {
      decouverte: false,
      famille: true,
      classe: false,
      etablissement: true,
    },
  },
  {
    label: "Session live en classe",
    values: {
      decouverte: false,
      famille: false,
      classe: true,
      etablissement: true,
    },
  },
  {
    label: "Suivi des progrès",
    values: {
      decouverte: "Basique",
      famille: true,
      classe: true,
      etablissement: true,
    },
  },
  {
    label: "Illustrations & parcours Néo",
    values: {
      decouverte: "Partiel",
      famille: true,
      classe: true,
      etablissement: true,
    },
  },
  {
    label: "Multi-classes / multi-enseignants",
    values: {
      decouverte: false,
      famille: false,
      classe: "1 classe",
      etablissement: true,
    },
  },
  {
    label: "Support prioritaire",
    values: {
      decouverte: false,
      famille: false,
      classe: true,
      etablissement: true,
    },
  },
];

/** Plan mis en avant selon le rôle connecté. */
export function recommendedPlanForRole(
  role: string | null,
): SubscriptionPlanId {
  if (role === "parent") return "famille";
  if (role === "enseignant" || role === "admin") return "classe";
  return "famille";
}
