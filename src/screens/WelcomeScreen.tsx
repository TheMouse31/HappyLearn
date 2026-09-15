import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { gradeLabel, isCoursePlayable, subjectLabel } from "../data/catalog";
import { useSession } from "../lib/session";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { prenom, role, classCode, grade, subject, logout } = useSession();
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/" replace />;

  const playable = isCoursePlayable(grade, subject);
  const courseLabel =
    grade && subject ? `${gradeLabel(grade)} · ${subjectLabel(subject)}` : null;

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="A00 · Accueil"
      extra={
        <Button
          onClick={() => {
            void logout().then(() => navigate("/"));
          }}
        >
          Changer d’élève
        </Button>
      }
    >
      <section className="intro">
        <span className="kicker">Happy Learn</span>
        <h1>Prêt pour une nouvelle mission, {prenom} ?</h1>
        <p className="lead" data-listen>
          Choisis ta classe et ta matière, puis une aventure pour faire progresser tes apprentissages.
        </p>
        {classCode ? <p>Tu es dans la classe {classCode}.</p> : <p>Tu joues à la maison, sans code classe.</p>}
        {courseLabel ? (
          <p>
            Parcours actuel : <strong>{courseLabel}</strong>
            {playable ? "" : " (pas encore disponible)"}
          </p>
        ) : (
          <p>Indique ensuite ton niveau (CP à CM2) et ta matière du primaire.</p>
        )}
        <div className="mascot-stage">
          <p className="bubble">Bonjour {prenom} ! Je serai ton guide pendant tes missions.</p>
          <Neo pose="guide" />
        </div>
        <div className="actions">
          <Button onClick={() => navigate("/prenom")}>Changer de prénom</Button>
          <Button onClick={() => navigate("/classe")}>
            {courseLabel ? "Changer de classe / matière" : "Choisir classe et matière"}
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(playable ? "/seance" : "/classe")}
          >
            Commencer
          </Button>
        </div>
      </section>
    </Shell>
  );
}
