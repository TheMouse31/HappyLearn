import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorsMenu } from "./ColorsMenu";
import { ListenButton } from "./ListenButton";
import { SkinToggle } from "./SkinToggle";
import { useSession } from "../lib/session";
import { useSkin } from "../lib/useSkin";

type Props = {
  children: ReactNode;
  /** Edge-to-edge hero pages (NewFront home). */
  fullBleed?: boolean;
};

export function PublicLayout({ children, fullBleed = false }: Props) {
  const navigate = useNavigate();
  const skin = useSkin();
  const { role } = useSession();
  const continueTo =
    role === "eleve" ? "/accueil" : role === "enseignant" ? "/espace-professeur" : null;
  const bleed = fullBleed && skin === "newfront";

  return (
    <div className={`app-shell public-shell${bleed ? " is-bleed" : ""}`}>
      <header className="topbar public-topbar">
        <Link to="/" className="brand brand-link" aria-label="Happy Learn — accueil">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span className="brand-word">Happy Learn</span>
        </Link>
        <nav className="public-nav" aria-label="Navigation principale">
          <a className="nav-text-link" href="#comment-ca-marche">
            Comment ça marche
          </a>
          <SkinToggle />
          <ColorsMenu />
          <ListenButton />
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
      <div className={`window public-window${bleed ? " is-bleed" : ""}`}>{children}</div>
    </div>
  );
}
