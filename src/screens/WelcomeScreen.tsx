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
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;

  const playable = isCoursePlayable(grade, subject);
  const courseLabel =
    grade && subject ? `${gradeLabel(grade)} · ${subjectLabel(subject)}` : null;

  return (
    <Shell
      brand="Happy Learn"
      stepLabel="Accueil élève"
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
      <section className="intro">
        <span className="kicker">Happy Learn</span>
        <h1>Salut {prenom} !</h1>
        <p className="lead" data-listen>
          Ici tu prépares ta mission : classe, matière, univers. Néo t’accompagne à chaque étape.
        </p>
        {classCode ? <p>Tu es dans la classe {classCode}.</p> : <p>Tu joues à la maison, sans code classe.</p>}
        {courseLabel ? (
          <p>
            Parcours actuel : <strong>{courseLabel}</strong>
            {playable ? "" : " (bientôt disponible)"}
          </p>
        ) : (
          <p>Indique ensuite ton niveau (CP à CM2) et ta matière.</p>
        )}
        <div className="mascot-stage">
          <p className="bubble">Bonjour {prenom} ! Je serai ton guide pendant tes missions.</p>
          <Neo pose="guide" />
        </div>
        <div className="actions">
          <Button
            variant="primary"
            onClick={() => navigate(playable ? "/seance" : "/classe")}
          >
            Continuer la mission
          </Button>
          <Button onClick={() => navigate("/classe")}>
            {courseLabel ? "Changer de classe / matière" : "Choisir classe et matière"}
          </Button>
          {!classCode ? <Button onClick={() => navigate("/prenom")}>Changer de prénom</Button> : null}
        </div>
      </section>
    </Shell>
  );
}
