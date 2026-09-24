import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Choice } from "../components/Choice";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { isCoursePlayable } from "../data/catalog";
import { findCompetence, hasCompetenceNav } from "../data/competenceNav";
import { useSession } from "../lib/session";

export function MaterialScreen() {
  const navigate = useNavigate();
  const { prenom, universe, mode, setMode, grade, subject, competenceId, missionId } = useSession();
  const [error, setError] = useState("");
  const competenceFlow = hasCompetenceNav(grade, subject);
  const competence = findCompetence(competenceId);

  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (competenceFlow) {
    if (!competenceId) return <Navigate to="/competence" replace />;
    if (!missionId || !universe) return <Navigate to="/missions" replace />;
  } else if (!universe) {
    return <Navigate to="/univers" replace />;
  }

  return (
    <Shell
      variant="eleve"
      backTo={competenceFlow ? "/missions" : "/univers"}
      showSetupSteps={competenceFlow}
      stepLabel={competenceFlow ? undefined : "Matériel"}
    >
      <div className="split">
        <aside className="mascot-stage">
          <p className="bubble">Tu peux réussir ta mission dans les deux modes. Choisis celui qui te convient aujourd’hui !</p>
          <Neo pose="universe" universe={universe!} />
        </aside>
        <main>
          <span className="kicker">{competence ? competence.label : "Préparation"}</span>
          <h1>Avec ou sans cahier ?</h1>
          <p data-listen>Les exercices s’adaptent à ton choix.</p>
          <div className="choice-grid" role="group" aria-label="Choix du mode de séance">
            <Choice
              className="mode"
              selected={mode === "cahier"}
              onClick={() => {
                setMode("cahier");
                setError("");
              }}
            >
              <span className="icon-badge" aria-hidden="true">
                📓
              </span>
              <span>
                <strong>Avec mon cahier</strong>
                <small>Je pose mes calculs et construis ma stratégie.</small>
              </span>
            </Choice>
            <Choice
              className="mode"
              selected={mode === "qcm"}
              onClick={() => {
                setMode("qcm");
                setError("");
              }}
            >
              <span className="icon-badge" aria-hidden="true">
                ☝️
              </span>
              <span>
                <strong>Sans cahier · QCM</strong>
                <small>Je réponds avec des propositions.</small>
              </span>
            </Choice>
          </div>
          <p className="error" aria-live="polite">
            {error}
          </p>
          <div className="actions">
            <Button
              variant="primary"
              onClick={() => {
                if (!mode) {
                  setError("Choisis comment tu vas faire la mission.");
                  return;
                }
                navigate("/pret");
              }}
            >
              Continuer
            </Button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
