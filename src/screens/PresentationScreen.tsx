import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { gradeLabel, isCoursePlayable, subjectLabel } from "../data/catalog";
import { useSession } from "../lib/session";

export function PresentationScreen() {
  const navigate = useNavigate();
  const { prenom, grade, subject } = useSession();
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Présentation" backTo="/classe" showSetupSteps>
      <section className="intro">
        <span className="kicker">
          {gradeLabel(grade)} · {subjectLabel(subject)}
        </span>
        <h1>Une mission dans un univers que tu aimes</h1>
        <p className="lead" data-listen>
          Pour {gradeLabel(grade)} en {subjectLabel(subject)}, tu vas progresser à ton rythme, {prenom}. Pas besoin
          d’aller vite pour gagner tes étoiles.
        </p>
        <div className="mascot-stage">
          <p className="bubble">Je serai là si tu as besoin d’un indice.</p>
          <Neo pose="guide" className="neo-small" />
        </div>
        <div className="actions">
          <Button variant="primary" onClick={() => navigate("/univers")}>
            Choisir mon univers
          </Button>
        </div>
      </section>
    </Shell>
  );
}
