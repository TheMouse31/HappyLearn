import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorblindToggle } from "./ColorblindToggle";
import { ListenButton } from "./ListenButton";
import { SetupSteps } from "./SetupSteps";
import { useSession } from "../lib/session";

type Props = {
  stepLabel?: string;
  children: ReactNode;
  extra?: ReactNode;
  brand?: string;
  backTo?: string;
  homeTo?: string;
  showSetupSteps?: boolean;
  confirmLeaveMission?: boolean;
};

function defaultHomeTo(role: string | null | undefined, lockedSession: boolean): string {
  if (lockedSession) return "/salle-attente";
  if (role === "eleve") return "/accueil";
  if (role === "enseignant") return "/espace-professeur";
  return "/";
}

export function Shell({
  stepLabel,
  children,
  extra,
  brand = "Happy Learn",
  backTo,
  homeTo,
  showSetupSteps = false,
  confirmLeaveMission = false,
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role, lockedSession } = useSession();
  const resolvedHome = homeTo ?? defaultHomeTo(role, lockedSession);
  const brandTo = lockedSession ? "/salle-attente" : role === "enseignant" ? "/" : resolvedHome;
  const hideNav = lockedSession && (pathname === "/salle-attente" || pathname === "/mission");

  function goHome() {
    if (lockedSession) {
      navigate("/salle-attente");
      return;
    }
    if (confirmLeaveMission || pathname === "/mission") {
      const ok = window.confirm("Quitter la mission et revenir à l’accueil ?");
      if (!ok) return;
    }
    navigate(resolvedHome);
  }

  return (
    <div className="app-shell">
      <ListenButton />
      <header className="topbar">
        <div className="topbar-start">
          {backTo && !hideNav ? (
            <button type="button" className="nav-icon-btn" onClick={() => navigate(backTo)} aria-label="Retour">
              ← Retour
            </button>
          ) : null}
          {hideNav ? (
            <span className="brand">
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              <span className="brand-word">{brand}</span>
            </span>
          ) : (
            <Link to={brandTo} className="brand brand-link" aria-label={`${brand} — accueil`}>
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              <span className="brand-word">{brand}</span>
            </Link>
          )}
        </div>
        <div className="topbar-end">
          {stepLabel ? <div className="step-pill">{stepLabel}</div> : null}
          <ColorblindToggle />
          {!hideNav ? (
            <button type="button" className="nav-icon-btn home-btn" onClick={goHome} aria-label="Accueil">
              <span aria-hidden="true">⌂</span>
              <span>Accueil</span>
            </button>
          ) : null}
          {extra}
        </div>
      </header>
      {showSetupSteps && !lockedSession ? <SetupSteps /> : null}
      <div className="window">{children}</div>
    </div>
  );
}
