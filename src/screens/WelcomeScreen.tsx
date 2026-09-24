import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { ColorsMenu } from "../components/ColorsMenu";
import { ListenButton } from "../components/ListenButton";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { SkinToggle } from "../components/SkinToggle";
import { gradeLabel, isCoursePlayable, subjectLabel } from "../data/catalog";
import { hasCompetenceNav } from "../data/competenceNav";
import { useSession } from "../lib/session";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { prenom, displayName, role, classCode, grade, subject, competenceId, logout } = useSession();
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;

  const playable = isCoursePlayable(grade, subject);
  const courseLabel =
    grade && subject ? `${gradeLabel(grade)} · ${subjectLabel(subject)}` : null;
  const competenceFlow = hasCompetenceNav(grade, subject);
  const nextTo = !playable
    ? "/classe"
    : competenceFlow
      ? competenceId
        ? "/missions"
        : "/competence"
      : "/seance";
  const nextLabel = playable ? "Continuer" : "Choisir ma classe";

  return (
    <Shell
      variant="eleve"
      brand="Happy Learn"
      homeTo="/accueil"
      extra={
        <div className="topbar-tools-menu" role="group" aria-label="Options">
          <SkinToggle />
          <ColorsMenu />
          <ListenButton />
          <Button
            type="button"
            onClick={() => {
              void logout().then(() => navigate("/connexion"));
            }}
          >
            Changer d’élève
          </Button>
        </div>
      }
    >
      <section className="intro student-home">
        <span className="kicker">À toi de jouer</span>
        <h1>Salut {displayName} !</h1>
        <p className="lead" data-listen>
          {playable
            ? competenceFlow
              ? `Parcours ${courseLabel} : choisis une compétence, puis une mission.`
              : `Ta mission ${courseLabel} t’attend.`
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
            <Button onClick={() => navigate("/classe")}>
              {courseLabel ? "Changer de classe / matière" : "Choisir classe et matière"}
            </Button>
          </div>
        </div>
      </section>
    </Shell>
  );
}
