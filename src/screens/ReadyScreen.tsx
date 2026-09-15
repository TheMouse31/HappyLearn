import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { UNIVERSES } from "../data/universes";
import { isCoursePlayable } from "../data/catalog";
import { useSession } from "../lib/session";

export function ReadyScreen() {
  const navigate = useNavigate();
  const { prenom, universe, mode, startMission, grade, subject } = useSession();
  if (!prenom) return <Navigate to="/" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (!universe) return <Navigate to="/univers" replace />;
  if (!mode) return <Navigate to="/materiel" replace />;
  const def = UNIVERSES[universe];

  return (
    <Shell stepLabel="A05 · Confirmation">
      <div className="split">
        <aside className="mascot-stage">
          <Neo pose="universe" universe={universe} />
        </aside>
        <main>
          <span className="kicker">Tout est prêt</span>
          <h1>Ta mission est prête, {prenom} !</h1>
          <p className="lead" data-listen>{def.instruction}</p>
          <div className="summary">
            <div><span>Univers</span><strong>{def.label}</strong></div>
            <div><span>Mode</span><strong>{mode === "qcm" ? "Sans cahier · QCM" : "Avec cahier"}</strong></div>
          </div>
          <div className="actions">
            <Button onClick={() => navigate("/materiel")}>Modifier</Button>
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
