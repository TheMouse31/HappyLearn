import { Link, useNavigate } from "react-router-dom";
import { useSession } from "../lib/session";

type Props = {
  /** Mode compact (parcours élève). */
  compact?: boolean;
};

function initialsFrom(name: string): string {
  const parts = name.trim().split(/[\s.@_-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

/**
 * Identité compte dans le bandeau (avatar + nom).
 * Le statut d’abonnement vit à part (SubscriptionStatusBadge), comme RetroVault.
 */
export function AccountChip({ compact = false }: Props) {
  const navigate = useNavigate();
  const { role, teacher, prenom, displayName, premiumActive, logout } = useSession();

  if (!role || role === "eleve") {
    if (role === "eleve" && prenom) {
      return (
        <div className="account-chip account-chip-eleve" title={displayName}>
          <span className="account-chip-avatar" aria-hidden="true">
            {initialsFrom(displayName || prenom)}
          </span>
          {!compact ? <span className="account-chip-name">{displayName}</span> : null}
        </div>
      );
    }
    return null;
  }

  const email = teacher?.email ?? "";
  const shortName = email ? email.split("@")[0] : role;
  const spaceTo =
    role === "parent"
      ? premiumActive
        ? "/espace-parent"
        : "/abonnement"
      : role === "enseignant"
        ? premiumActive
          ? "/espace-professeur"
          : "/abonnement"
        : "/espace-admin";

  return (
    <div className={`account-chip${premiumActive ? " is-premium" : " is-free"}`}>
      <Link to={spaceTo} className="account-chip-main" title={email || shortName}>
        <span className="account-chip-avatar" aria-hidden="true">
          {initialsFrom(shortName)}
        </span>
        <span className="account-chip-name">{shortName}</span>
      </Link>
      <button
        type="button"
        className="account-chip-logout nav-icon-square"
        aria-label="Se déconnecter"
        title="Se déconnecter"
        onClick={() => {
          void logout().then(() => navigate("/"));
        }}
      >
        <span aria-hidden="true">⎋</span>
      </button>
    </div>
  );
}
