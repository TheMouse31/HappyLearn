import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorsMenu } from "./ColorsMenu";
import { ListenButton } from "./ListenButton";
import { useSession } from "../lib/session";

type Props = {
  children: ReactNode;
  /** Edge-to-edge hero pages (accueil / connexion). */
  fullBleed?: boolean;
};

export function PublicLayout({ children, fullBleed = true }: Props) {
  const navigate = useNavigate();
  const { role, premiumActive } = useSession();
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

  return (
    <div
      className={`app-shell public-shell${fullBleed ? " is-bleed" : ""}${
        isHome ? " is-home" : ""
      }${isConnexion ? " is-connexion" : ""}`}
    >
      <header className="topbar public-topbar">
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
          <ColorsMenu />
          <ListenButton />
          {continueTo ? (
            <button type="button" className="primary nav-cta" onClick={() => navigate(continueTo)}>
              Continuer
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
