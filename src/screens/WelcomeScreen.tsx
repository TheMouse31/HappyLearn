import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { gradeLabel, isCoursePlayable, subjectLabel } from "../data/catalog";
import { useSession } from "../lib/session";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { prenom, displayName, role, classCode, grade, subject, logout } = useSession();
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;

  const playable = isCoursePlayable(grade, subject);
  const courseLabel =
    grade && subject ? `${gradeLabel(grade)} · ${subjectLabel(subject)}` : null;
  const nextLabel = playable ? "Continuer la mission" : "Choisir ma classe";
  const nextTo = playable ? "/seance" : "/classe";

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="À toi de jouer"
      homeTo="/accueil"
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
      <section className="intro student-home">
        <span className="kicker">Prochaine étape</span>
        <h1>Salut {displayName} !</h1>
        <p className="lead" data-listen>
          {playable
            ? `Ta mission ${courseLabel} t’attend. Choisis ton univers et c’est parti.`
            : "Indique ta classe et ta matière, puis pars en mission avec Néo."}
        </p>
        {classCode ? (
          <p className="student-home-meta">Classe {classCode}</p>
        ) : (
          <p className="student-home-meta">Mode maison — sans code classe</p>
        )}
        <div className="student-next">
          <div className="mascot-stage">
            <p className="bubble">
              {playable ? "On y va ?" : `Bonjour ${displayName} ! Je serai ton guide.`}
            </p>
            <Neo pose="guide" />
          </div>
          <div className="actions student-next-actions">
            <Button variant="primary" onClick={() => navigate(nextTo)}>
              {nextLabel}
            </Button>
            {courseLabel ? (
              <Button onClick={() => navigate("/classe")}>Changer de classe / matière</Button>
            ) : null}
          </div>
        </div>
      </section>
    </Shell>
  );
}
