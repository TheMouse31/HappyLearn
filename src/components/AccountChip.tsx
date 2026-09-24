import { Link, useNavigate } from "react-router-dom";
import { abonnementLabel } from "../lib/subscription";
import { useSession } from "../lib/session";

type Props = {
  /** Mode compact (parcours élève). */
  compact?: boolean;
};

/**
 * Pastille compte dans le bandeau : identité + statut d’abonnement.
 */
export function AccountChip({ compact = false }: Props) {
  const navigate = useNavigate();
  const { role, teacher, prenom, displayName, abonnement, premiumActive, logout } = useSession();
  if (!role || role === "eleve") {
    if (role === "eleve" && prenom) {
      return (
        <div className="account-chip account-chip-eleve" title={displayName}>
          <span className="account-chip-name">{displayName}</span>
        </div>
      );
    }
    return null;
  }

  const email = teacher?.email ?? "";
  const shortName = email ? email.split("@")[0] : role;
  const roleLabel =
    role === "parent" ? "Parent" : role === "enseignant" ? "Prof" : role === "admin" ? "Admin" : "";
  const subLabel = premiumActive ? abonnementLabel(abonnement) : "Sans abonnement";
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
      <Link to={spaceTo} className="account-chip-main" title={email || roleLabel}>
        <span className="account-chip-name">{shortName}</span>
        {!compact ? <span className="account-chip-role">{roleLabel}</span> : null}
        <span className={`account-chip-sub${premiumActive ? " is-on" : ""}`}>{subLabel}</span>
      </Link>
      <button
        type="button"
        className="account-chip-logout"
        aria-label="Se déconnecter"
        onClick={() => {
          void logout().then(() => navigate("/"));
        }}
      >
        Quitter
      </button>
    </div>
  );
}
