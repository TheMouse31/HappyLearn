import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorsMenu } from "./ColorsMenu";
import { ListenButton } from "./ListenButton";
import { SetupSteps } from "./SetupSteps";
import { SkinToggle } from "./SkinToggle";
import { agentDebugLog } from "../lib/agentDebugLog";
import { useSession } from "../lib/session";

type Props = {
  stepLabel?: string;
  children: ReactNode;
  extra?: ReactNode;
  brand?: string;
  /** Cible de navigation pour ← Retour (ignoré si `onBack` est fourni). */
  backTo?: string;
  /** Handler prioritaire pour ← Retour (ex. bascule mode local sans changer d’URL). */
  onBack?: () => void;
  homeTo?: string;
  showSetupSteps?: boolean;
  confirmLeaveMission?: boolean;
};

function defaultHomeTo(role: string | null | undefined, lockedSession: boolean): string {
  if (lockedSession) return "/salle-attente";
  if (role === "eleve") return "/accueil";
  if (role === "admin") return "/espace-admin";
  if (role === "enseignant") return "/espace-professeur";
  return "/";
}

export function Shell({
  stepLabel,
  children,
  extra,
  brand = "Happy Learn",
  backTo,
  onBack,
  homeTo,
  showSetupSteps = false,
  confirmLeaveMission = false,
}: Props) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { role, lockedSession } = useSession();
  const resolvedHome = homeTo ?? defaultHomeTo(role, lockedSession);
  const brandTo = lockedSession ? "/salle-attente" : role === "enseignant" ? "/" : resolvedHome;
  const hideNav = lockedSession && (pathname === "/salle-attente" || pathname === "/mission");

  const showBack = Boolean(!hideNav && (onBack || backTo));

  function goBack() {
    if (onBack) {
      // #region agent log
      agentDebugLog({
        hypothesisId: "E",
        location: "Shell.tsx:goBack",
        message: "Back via onBack handler",
        data: { pathname, role },
      });
      // #endregion
      onBack();
      return;
    }
    if (!backTo) return;
    const current = `${pathname}${search}`;
    // Même URL → pas de remount : tenter l’historique, sinon rester (évite un no-op silencieux).
    if (current === backTo || pathname === backTo) {
      // #region agent log
      agentDebugLog({
        hypothesisId: "E",
        location: "Shell.tsx:goBack",
        message: "Back same-URL → history(-1)",
        data: { pathname, backTo, role, historyLength: window.history.length },
      });
      // #endregion
      if (window.history.length > 1) navigate(-1);
      return;
    }
    // #region agent log
    agentDebugLog({
      hypothesisId: "E",
      location: "Shell.tsx:goBack",
      message: "Back navigate to backTo",
      data: { pathname, backTo, role },
    });
    // #endregion
    navigate(backTo);
  }

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
      <header className="topbar">
        <div className="topbar-start">
          {showBack ? (
            <button type="button" className="nav-icon-btn nav-back-btn" onClick={goBack} aria-label="Retour">
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
          <SkinToggle />
          <ColorsMenu />
          <ListenButton />
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
