import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Choice } from "../components/Choice";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { isCoursePlayable } from "../data/catalog";
import { useSession } from "../lib/session";

export function MaterialScreen() {
  const navigate = useNavigate();
  const { prenom, universe, mode, setMode, grade, subject } = useSession();
  const [error, setError] = useState("");
  if (!prenom) return <Navigate to="/" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (!universe) return <Navigate to="/univers" replace />;

  return (
    <Shell stepLabel="A04 · Matériel">
      <div className="split">
        <aside className="mascot-stage">
          <p className="bubble">Tu peux réussir ta mission dans les deux modes. Choisis celui qui te convient aujourd’hui !</p>
          <Neo pose="universe" universe={universe} />
        </aside>
        <main>
          <span className="kicker">Préparation de la mission</span>
          <h1>As-tu ton cahier et de quoi écrire ?</h1>
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
              <span className="icon-badge" aria-hidden="true">📓</span>
              <span>
                <strong>Oui, j’ai mon cahier</strong>
                <small>Je pourrai poser mes calculs et construire ma stratégie.</small>
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
              <span className="icon-badge" aria-hidden="true">☝️</span>
              <span>
                <strong>Non, je ne l’ai pas</strong>
                <small>Je répondrai grâce à des propositions sous forme de QCM.</small>
              </span>
            </Choice>
          </div>
          <p className="error" aria-live="polite">{error}</p>
          <div className="actions">
            <Button onClick={() => navigate("/univers")}>Retour</Button>
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
              Préparer ma mission
            </Button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
