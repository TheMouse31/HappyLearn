import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
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

function defaultHomeTo(role: string | null | undefined): string {
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
  const { role } = useSession();
  const resolvedHome = homeTo ?? defaultHomeTo(role);
  const brandTo = role === "enseignant" ? "/" : resolvedHome;

  function goHome() {
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
          {backTo ? (
            <button type="button" className="nav-icon-btn" onClick={() => navigate(backTo)} aria-label="Retour">
              ← Retour
            </button>
          ) : null}
          <Link to={brandTo} className="brand brand-link" aria-label={`${brand} — accueil`}>
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            {brand}
          </Link>
        </div>
        <div className="topbar-end">
          {stepLabel ? <div className="step-pill">{stepLabel}</div> : null}
          <button type="button" className="nav-icon-btn home-btn" onClick={goHome} aria-label="Accueil">
            <span aria-hidden="true">⌂</span>
            <span>Accueil</span>
          </button>
          {extra}
        </div>
      </header>
      {showSetupSteps ? <SetupSteps /> : null}
      <div className="window">{children}</div>
    </div>
  );
}
