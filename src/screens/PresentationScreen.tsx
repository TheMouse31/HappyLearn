import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { gradeLabel, isCoursePlayable, subjectLabel } from "../data/catalog";
import { useSession } from "../lib/session";

export function PresentationScreen() {
  const navigate = useNavigate();
  const { prenom, grade, subject } = useSession();
  if (!prenom) return <Navigate to="/" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="A02 · Présentation">
      <section className="intro">
        <span className="kicker">
          {gradeLabel(grade)} · {subjectLabel(subject)}
        </span>
        <h1>Fractions et problèmes dans un univers que tu aimes</h1>
        <p className="lead" data-listen>
          Prends le temps de réfléchir, {prenom}. Tu n’as pas besoin d’aller vite pour obtenir tes étoiles.
        </p>
        <div className="mascot-stage">
          <p className="bubble">Je serai là si tu as besoin d’un indice.</p>
          <Neo pose="guide" className="neo-small" />
        </div>
        <div className="actions">
          <Button onClick={() => navigate("/classe")}>Changer de parcours</Button>
          <Button variant="primary" onClick={() => navigate("/univers")}>
            Choisir mon univers
          </Button>
        </div>
      </section>
    </Shell>
  );
}
