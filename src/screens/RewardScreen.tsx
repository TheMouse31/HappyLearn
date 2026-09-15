import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Reward } from "../components/Reward";
import { Shell } from "../components/Shell";
import { UNIVERSES } from "../data/universes";
import { useSession } from "../lib/session";

export function RewardScreen() {
  const navigate = useNavigate();
  const { prenom, universe, collection, rewardPending, resetToHome, pickAnotherUniverse } =
    useSession();
  if (!prenom) return <Navigate to="/" replace />;
  if (!universe || !rewardPending) return <Navigate to="/accueil" replace />;
  const def = UNIVERSES[universe];

  return (
    <Shell stepLabel="A06 · Mission accomplie">
      <div className="split">
        <aside className="mascot-stage">
          <Neo pose="a06" universe={universe} />
        </aside>
        <main className="reward-hero">
          <div className="reward-badge" aria-hidden="true">
            {def.icon}
          </div>
          <h1>Mission accomplie, {prenom} !</h1>
          <p className="lead" data-listen>
            Tu obtiens {def.reward}.
          </p>
          <p>Tu as utilisé les fractions et résolu plusieurs problèmes.</p>
          <p>
            <strong>Ta collection de missions · {collection.length} sur 4</strong>
          </p>
          <Reward earned={collection} highlight={universe} />
          <div className="actions">
            <Button
              onClick={() => {
                resetToHome();
                navigate("/accueil");
              }}
            >
              Revenir à l’accueil
            </Button>
            <Button
              onClick={() => {
                pickAnotherUniverse();
                navigate("/univers");
              }}
            >
              Essayer un autre univers
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                resetToHome();
                navigate("/accueil");
              }}
            >
              Terminer
            </Button>
          </div>
        </main>
      </div>
    </Shell>
  );
}
