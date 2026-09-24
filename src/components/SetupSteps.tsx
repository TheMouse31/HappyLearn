import { useLocation } from "react-router-dom";

/** Indicateur de progression (non cliquable) — parcours compétence. */
const STEPS = [
  { path: "/classe", label: "Classe" },
  { path: "/competence", label: "Compétence" },
  { path: "/missions", label: "Mission" },
  { path: "/materiel", label: "Mode" },
  { path: "/pret", label: "Prêt" },
] as const;

export function SetupSteps() {
  const { pathname } = useLocation();
  const currentIndex = STEPS.findIndex((step) => step.path === pathname);
  if (currentIndex < 0) return null;

  return (
    <nav className="setup-steps setup-steps-indicator" aria-label="Étapes de préparation">
      <ol>
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          return (
            <li key={step.path} className={current ? "is-current" : done ? "is-done" : ""}>
              <span aria-current={current ? "step" : undefined}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
