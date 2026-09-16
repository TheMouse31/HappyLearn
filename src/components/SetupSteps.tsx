import { Link, useLocation } from "react-router-dom";

const STEPS = [
  { path: "/classe", label: "Classe" },
  { path: "/seance", label: "Présentation" },
  { path: "/univers", label: "Univers" },
  { path: "/materiel", label: "Matériel" },
  { path: "/pret", label: "Prêt" },
] as const;

export function SetupSteps() {
  const { pathname } = useLocation();
  const currentIndex = STEPS.findIndex((step) => step.path === pathname);
  if (currentIndex < 0) return null;

  return (
    <nav className="setup-steps" aria-label="Étapes de préparation">
      <ol>
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          const clickable = done;
          return (
            <li key={step.path} className={current ? "is-current" : done ? "is-done" : ""}>
              {clickable ? (
                <Link to={step.path}>{step.label}</Link>
              ) : (
                <span aria-current={current ? "step" : undefined}>{step.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
