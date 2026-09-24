import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { Abonnement } from "../data/types";
import { abonnementLabel, isAbonnementActive } from "../lib/subscription";

export type StatusBadgeTone =
  | "neutral"
  | "premium"
  | "free"
  | "warn"
  | "danger"
  | "info"
  | "success"
  | "role";

type Props = {
  children: ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
  title?: string;
  /** Petite icône décorative (ex. ✦ pour premium). */
  icon?: ReactNode;
};

/**
 * Pastille de statut (bandeau / dashboard) — hiérarchie type RetroVault,
 * identité Happy Learn (teal / amber / muted).
 */
export function StatusBadge({ children, tone = "neutral", className = "", title, icon }: Props) {
  return (
    <span className={`hl-badge hl-badge--${tone}${className ? ` ${className}` : ""}`} title={title}>
      {icon ? (
        <span className="hl-badge-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export function abonnementTone(sub: Abonnement | null | undefined): StatusBadgeTone {
  if (!sub) return "free";
  if (isAbonnementActive(sub)) return "premium";
  if (sub.status === "past_due") return "warn";
  if (sub.status === "canceled") return "danger";
  return "danger";
}

/** Libellé court pour pastille uppercase. */
export function abonnementBadgeText(sub: Abonnement | null | undefined, premiumActive: boolean): string {
  if (!premiumActive || !sub) return "Sans abo";
  if (isAbonnementActive(sub)) {
    if (sub.source === "admin_grant") return "Premium offert";
    if (sub.source === "local") return "Premium local";
    return "Premium";
  }
  return abonnementLabel(sub);
}

type SubBadgeProps = {
  abonnement: Abonnement | null | undefined;
  premiumActive: boolean;
  className?: string;
};

export function SubscriptionStatusBadge({ abonnement, premiumActive, className }: SubBadgeProps) {
  const tone = premiumActive ? abonnementTone(abonnement) : "free";
  const text = abonnementBadgeText(abonnement, premiumActive);
  return (
    <StatusBadge
      tone={tone}
      className={className}
      title={abonnementLabel(abonnement)}
      icon={tone === "premium" ? <Sparkles size={12} strokeWidth={2.25} /> : undefined}
    >
      {text}
    </StatusBadge>
  );
}
