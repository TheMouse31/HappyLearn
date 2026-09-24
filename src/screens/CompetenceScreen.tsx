import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { isCoursePlayable } from "../data/catalog";
import { listCompetencesForCourse } from "../data/competenceNav";
import { useSession } from "../lib/session";

export function CompetenceScreen() {
  const navigate = useNavigate();
  const { prenom, role, grade, subject, competenceId, setCompetence } = useSession();
  const competences = listCompetencesForCourse(grade, subject);

  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (competences.length === 0) return <Navigate to="/classe" replace />;

  return (
    <Shell variant="eleve" brand="Happy Learn" backTo="/classe" showSetupSteps>
      <div className="split competence-layout">
        <aside className="mascot-stage">
          <p className="bubble">Choisis ce que tu veux travailler. Ensuite je te propose des missions qui vont avec.</p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Étape 2</span>
          <h1>Quelle compétence ?</h1>
          <p className="lead" data-listen>
            Une notion à la fois. Les univers proposés changent selon ton choix.
          </p>
          <div className="competence-pick" role="listbox" aria-label="Compétences">
            {competences.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={competenceId === item.id}
                className={`competence-card ${competenceId === item.id ? "is-selected" : ""}`}
                onClick={() => {
                  setCompetence(item.id);
                  navigate("/missions");
                }}
              >
                <strong>{item.label}</strong>
                <span>{item.hint}</span>
              </button>
            ))}
          </div>
          <div className="actions">
            <Button type="button" onClick={() => navigate("/classe")}>
              Changer de classe
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
