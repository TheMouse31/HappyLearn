import type { Abonnement, AbonnementStatus } from "../data/types";

const ACTIVE: AbonnementStatus[] = ["active", "trialing"];

export function isAbonnementActive(sub: Abonnement | null | undefined): boolean {
  if (!sub) return false;
  if (!ACTIVE.includes(sub.status)) return false;
  if (sub.currentPeriodEnd) {
    const end = new Date(sub.currentPeriodEnd).getTime();
    if (!Number.isNaN(end) && end < Date.now()) return false;
  }
  return true;
}

export function abonnementLabel(sub: Abonnement | null | undefined): string {
  if (!sub) return "Aucun abonnement";
  if (isAbonnementActive(sub)) {
    if (sub.source === "admin_grant") return "Premium (offert)";
    if (sub.source === "local") return "Premium (local)";
    return "Premium actif";
  }
  if (sub.status === "past_due") return "Paiement en retard";
  if (sub.status === "canceled") return "Résilié";
  return "Expiré";
}
