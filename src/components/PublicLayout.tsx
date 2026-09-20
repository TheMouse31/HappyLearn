import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorblindToggle } from "./ColorblindToggle";
import { ListenButton } from "./ListenButton";
import { useSession } from "../lib/session";

type Props = {
  children: ReactNode;
};

export function PublicLayout({ children }: Props) {
  const navigate = useNavigate();
  const { role } = useSession();
  const continueTo =
    role === "eleve" ? "/accueil" : role === "enseignant" ? "/espace-professeur" : null;

  return (
    <div className="app-shell public-shell">
      <ListenButton />
      <header className="topbar public-topbar">
        <Link to="/" className="brand brand-link" aria-label="Happy Learn — accueil">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          Happy Learn
        </Link>
        <nav className="public-nav" aria-label="Navigation principale">
          <a className="nav-text-link" href="#comment-ca-marche">
            Comment ça marche
          </a>
          <ColorblindToggle />
          {continueTo ? (
            <button type="button" className="primary nav-cta" onClick={() => navigate(continueTo)}>
              Continuer
            </button>
          ) : (
            <Link className="nav-cta-link" to="/connexion">
              Connexion
            </Link>
          )}
        </nav>
      </header>
      <div className="window public-window">{children}</div>
    </div>
  );
}
