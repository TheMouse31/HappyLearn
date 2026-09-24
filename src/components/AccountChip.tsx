import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Home, LogOut, Shield, type LucideIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useSession } from "../lib/session";
import type { AdultRole } from "../lib/adultRoles";
import { normalizeRoles } from "../lib/adultRoles";

function roleSwitchIcon(target: AdultRole): LucideIcon {
  if (target === "parent") return Home;
  if (target === "enseignant") return GraduationCap;
  return Shield;
}

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

function roleShort(role: AdultRole): string {
  if (role === "parent") return "Parent";
  if (role === "enseignant") return "Prof";
  return "Admin";
}

/**
 * Identité compte dans le bandeau (avatar + nom + bascule de rôle).
 * Pastille abo à part (SubscriptionStatusBadge), disposition RetroVault.
 */
export function AccountChip({ compact = false }: Props) {
  const navigate = useNavigate();
  const { role, teacher, prenom, displayName, premiumActive, switchAdultRole, logout } = useSession();

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
  const roles = normalizeRoles(teacher?.roles, role);
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

  const otherRoles = roles.filter((r) => r !== role);
  // Toujours proposer l’autre portail adulte (même e-mail) même s’il n’est pas encore dans roles.
  const switchTargets: AdultRole[] =
    otherRoles.length > 0
      ? otherRoles
      : role === "parent"
        ? (["enseignant"] as AdultRole[])
        : role === "enseignant"
          ? (["parent"] as AdultRole[])
          : (["enseignant", "parent"] as AdultRole[]);

  return (
    <div className={`account-cluster${premiumActive ? " is-premium" : " is-free"}`}>
      <Link
        to={spaceTo}
        className="account-avatar-btn"
        title={email || shortName}
        aria-label={`Espace ${roleShort(role)}`}
      >
        <span className="account-chip-avatar" aria-hidden="true">
          {initialsFrom(shortName)}
        </span>
      </Link>
      <div className="account-meta">
        <Link to={spaceTo} className="account-chip-name" title={email || shortName}>
          {shortName}
        </Link>
        <StatusBadge tone="role">{roleShort(role)}</StatusBadge>
      </div>
      {switchTargets.length > 0 ? (
        <div className="account-role-switch" role="group" aria-label="Changer d’espace">
          {switchTargets.map((target) => {
            const Icon = roleSwitchIcon(target);
            return (
              <button
                key={target}
                type="button"
                className="nav-icon-btn nav-icon-square"
                title={`Passer en espace ${roleShort(target)}`}
                aria-label={`Passer en espace ${roleShort(target)}`}
                onClick={() => {
                  void switchAdultRole(target).then((err) => {
                    if (err) return;
                    if (target === "parent") navigate("/espace-parent");
                    else if (target === "admin") navigate("/espace-admin");
                    else navigate("/espace-professeur");
                  });
                }}
              >
                <Icon size={15} strokeWidth={2.25} aria-hidden />
              </button>
            );
          })}
        </div>
      ) : null}
      <button
        type="button"
        className="nav-icon-btn nav-icon-square"
        aria-label="Se déconnecter"
        title="Se déconnecter"
        onClick={() => {
          void logout().then(() => navigate("/"));
        }}
      >
        <LogOut size={16} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
