import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Choice } from "../components/Choice";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { UNIVERSES, UNIVERSE_ORDER } from "../data/universes";
import { isCoursePlayable } from "../data/catalog";
import { useSession } from "../lib/session";

export function UniverseScreen() {
  const navigate = useNavigate();
  const { prenom, universe, setUniverse, grade, subject } = useSession();
  const [error, setError] = useState("");
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;

  return (
    <Shell stepLabel="Univers" backTo="/seance" showSetupSteps>
      <div className="split">
        <aside className="mascot-stage">
          <Neo pose={universe ? "universe" : "guide"} universe={universe} />
          <span className="kicker">Néo, ton guide</span>
        </aside>
        <main>
          <span className="kicker">Choix de la mission</span>
          <h1>Choisis ton univers</h1>
          <p data-listen>Tes réponses feront avancer l’aventure.</p>
          <div className="choice-grid" role="group" aria-label="Univers disponibles">
            {UNIVERSE_ORDER.map((slug) => {
              const def = UNIVERSES[slug];
              return (
                <Choice
                  key={slug}
                  selected={universe === slug}
                  onClick={() => {
                    setUniverse(slug);
                    setError("");
                    window.setTimeout(() => navigate("/materiel"), 450);
                  }}
                >
                  <span className="icon-badge" aria-hidden="true">{def.icon}</span>
                  <span>
                    <strong>{def.label}</strong>
                    <small>{def.blurb}</small>
                  </span>
                </Choice>
              );
            })}
          </div>
          <p className="error" aria-live="polite">{error}</p>
          <div className="actions">
            <Button
              variant="primary"
              onClick={() => {
                if (!universe) {
                  setError("Choisis un univers pour continuer.");
                  return;
                }
                navigate("/materiel");
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
