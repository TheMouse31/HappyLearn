import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { Shield, Users } from "lucide-react";
import { AccountChip } from "./AccountChip";
import { ColorsMenu } from "./ColorsMenu";
import { ListenButton } from "./ListenButton";
import { SubscriptionStatusBadge } from "./StatusBadge";
import { useSession } from "../lib/session";

type Props = {
  children: ReactNode;
  fullBleed?: boolean;
};

export function PublicLayout({ children, fullBleed = true }: Props) {
  const navigate = useNavigate();
  const { role, premiumActive, teacher, displayName, abonnement } = useSession();
  const { pathname } = useLocation();
  const continueTo =
    role === "eleve"
      ? "/accueil"
      : role === "parent"
        ? premiumActive
          ? "/espace-parent"
          : "/abonnement"
        : role === "enseignant"
          ? premiumActive
            ? "/espace-professeur"
            : "/abonnement"
          : role === "admin"
            ? "/espace-admin"
            : null;
  const isConnexion = pathname.startsWith("/connexion");
  const isHome = pathname === "/";
  const loggedIn = Boolean(role);
  const showSubBadge = loggedIn && (role === "parent" || role === "enseignant" || role === "admin");

  return (
    <div
      className={`app-shell public-shell${fullBleed ? " is-bleed" : ""}${
        isHome ? " is-home" : ""
      }${isConnexion ? " is-connexion" : ""}`}
    >
      <header className="topbar public-topbar topbar-pro">
        <Link to="/" className="brand brand-link" aria-label="Happy Learn — accueil">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span className="brand-word">Happy Learn</span>
        </Link>
        <nav className="public-nav" aria-label="Navigation principale">
          {!isConnexion ? (
            <a className="nav-text-link" href="#comment-ca-marche">
              Comment ça marche
            </a>
          ) : null}

          {showSubBadge ? (
            <SubscriptionStatusBadge abonnement={abonnement} premiumActive={premiumActive} />
          ) : null}

          <div className="topbar-toolbar" role="toolbar" aria-label="Raccourcis">
            <ColorsMenu />
            <ListenButton />
            {role === "enseignant" || role === "admin" ? (
              <Link
                to="/espace-professeur"
                className="nav-icon-btn nav-icon-square"
                title="Espace enseignant"
                aria-label="Espace enseignant"
              >
                <Users size={17} strokeWidth={2.25} aria-hidden />
              </Link>
            ) : null}
            {role === "admin" ? (
              <Link
                to="/espace-admin"
                className="nav-icon-btn nav-icon-square"
                title="Administration"
                aria-label="Administration"
              >
                <Shield size={17} strokeWidth={2.25} aria-hidden />
              </Link>
            ) : null}
            {role === "parent" ? (
              <Link
                to="/espace-parent"
                className="nav-icon-btn nav-icon-square"
                title="Espace parent"
                aria-label="Espace parent"
              >
                <Users size={17} strokeWidth={2.25} aria-hidden />
              </Link>
            ) : null}
          </div>

          {loggedIn ? <AccountChip /> : null}
          {continueTo ? (
            <button type="button" className="primary nav-cta" onClick={() => navigate(continueTo)}>
              {teacher?.email || displayName ? "Mon espace" : "Continuer"}
            </button>
          ) : isConnexion ? (
            <span className="nav-cta-link is-current" aria-current="page">
              Connexion
            </span>
          ) : (
            <Link className="nav-cta-link" to="/connexion">
              Connexion
            </Link>
          )}
        </nav>
      </header>
      <div className={`window public-window${fullBleed ? " is-bleed" : ""}`}>{children}</div>
    </div>
  );
}
