import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { UNIVERSES } from "../data/universes";
import { isCoursePlayable } from "../data/catalog";
import { findCompetence, findMissionOffer, hasCompetenceNav } from "../data/competenceNav";
import { useSession } from "../lib/session";

export function ReadyScreen() {
  const navigate = useNavigate();
  const { prenom, universe, mode, startMission, grade, subject, competenceId, missionId } =
    useSession();
  const competenceFlow = hasCompetenceNav(grade, subject);
  const competence = findCompetence(competenceId);
  const offer = findMissionOffer(competenceId, missionId, universe);

  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (competenceFlow) {
    if (!competenceId) return <Navigate to="/competence" replace />;
    if (!missionId || !universe) return <Navigate to="/missions" replace />;
  } else if (!universe) {
    return <Navigate to="/univers" replace />;
  }
  if (!mode) return <Navigate to="/materiel" replace />;
  const def = UNIVERSES[universe!];

  return (
    <Shell
      variant="eleve"
      backTo="/materiel"
      showSetupSteps={competenceFlow}
      stepLabel={competenceFlow ? undefined : "Prêt"}
    >
      <div className="split">
        <aside className="mascot-stage">
          <Neo pose="universe" universe={universe!} />
        </aside>
        <main>
          <span className="kicker">Tout est prêt</span>
          <h1>Ta mission est prête, {prenom} !</h1>
          <p className="lead" data-listen>
            {def.instruction}
          </p>
          <div className="summary">
            {competence ? (
              <div>
                <span>Compétence</span>
                <strong>{competence.label}</strong>
              </div>
            ) : null}
            <div>
              <span>Mission</span>
              <strong>{offer?.title ?? def.label}</strong>
            </div>
            <div>
              <span>Univers</span>
              <strong>{def.label}</strong>
            </div>
            <div>
              <span>Mode</span>
              <strong>{mode === "qcm" ? "Sans cahier · QCM" : "Avec cahier"}</strong>
            </div>
          </div>
          <div className="actions">
            <Button
              variant="primary"
              onClick={() => {
                void startMission().then(() => navigate("/mission"));
              }}
            >
              {def.cta}
            </Button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
