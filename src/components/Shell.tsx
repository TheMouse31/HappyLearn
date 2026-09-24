import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { ColorsMenu } from "./ColorsMenu";
import { ListenButton } from "./ListenButton";
import { SetupSteps } from "./SetupSteps";
import { SkinToggle } from "./SkinToggle";
import { useSession } from "../lib/session";

export type ShellVariant = "default" | "eleve" | "eleve-mission" | "auth";

type Props = {
  stepLabel?: string;
  children: ReactNode;
  extra?: ReactNode;
  brand?: string;
  backTo?: string;
  onBack?: () => void;
  homeTo?: string;
  showSetupSteps?: boolean;
  confirmLeaveMission?: boolean;
  /** Chrome adapté : eleve = barre fluide, auth = connexion, default = adulte. */
  variant?: ShellVariant;
};

function defaultHomeTo(role: string | null | undefined, lockedSession: boolean): string {
  if (lockedSession) return "/salle-attente";
  if (role === "eleve") return "/accueil";
  if (role === "parent") return "/espace-parent";
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
  variant = "default",
}: Props) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { role, lockedSession } = useSession();
  const resolvedHome = homeTo ?? defaultHomeTo(role, lockedSession);
  const isEleveChrome = variant === "eleve" || variant === "eleve-mission";
  const isAuth = variant === "auth";
  const hideUtilities = isEleveChrome || isAuth;
  const hideHomeButton = isEleveChrome || isAuth || (lockedSession && pathname === "/mission");
  const hideStepPill = Boolean(showSetupSteps) || variant === "eleve-mission";
  const brandTo = lockedSession
    ? "/salle-attente"
    : isAuth
      ? "/"
      : role === "enseignant" || role === "admin"
        ? "/"
        : resolvedHome;
  const hideNav = lockedSession && (pathname === "/salle-attente" || pathname === "/mission");
  const brandClickable = !(hideNav || variant === "eleve-mission");

  const showBack = Boolean(!hideNav && variant !== "eleve-mission" && (onBack || backTo));

  function goBack() {
    if (onBack) {
      onBack();
      return;
    }
    if (!backTo) return;
    const current = `${pathname}${search}`;
    if (current === backTo || pathname === backTo) {
      if (window.history.length > 1) navigate(-1);
      return;
    }
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
    <div className={`app-shell shell-${variant}`}>
      <header className="topbar">
        <div className="topbar-start">
          {showBack ? (
            <button type="button" className="nav-icon-btn nav-back-btn" onClick={goBack} aria-label="Retour">
              ←
            </button>
          ) : null}
          {brandClickable ? (
            <Link
              to={brandTo}
              className="brand brand-link"
              aria-label={`${brand} — accueil`}
              onClick={(event) => {
                if (confirmLeaveMission || pathname === "/mission") {
                  event.preventDefault();
                  goHome();
                }
              }}
            >
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              <span className="brand-word">{brand}</span>
            </Link>
          ) : (
            <span className="brand">
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              <span className="brand-word">{brand}</span>
            </span>
          )}
        </div>
        <div className="topbar-end">
          {stepLabel && !hideStepPill ? <div className="step-pill">{stepLabel}</div> : null}
          {!hideUtilities ? (
            <>
              <SkinToggle />
              <ColorsMenu />
              <ListenButton />
            </>
          ) : null}
          {!hideHomeButton && !hideNav ? (
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
