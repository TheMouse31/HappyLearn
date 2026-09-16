import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

export function NicknameScreen() {
  const navigate = useNavigate();
  const { prenom, role, setPrenom } = useSession();
  const [value, setValue] = useState(prenom);
  const [error, setError] = useState("");
  if (role !== "eleve") return <Navigate to="/connexion" replace />;

  return (
    <Shell stepLabel="Prénom" backTo="/accueil">
      <section className="intro">
        <span className="kicker">Faisons connaissance</span>
        <h1>Comment veux-tu qu’on t’appelle ?</h1>
        <p data-listen>Ton prénom ou ton surnom sera utilisé uniquement pendant cette séance.</p>
        <div className="field" style={{ width: "min(440px, 100%)", textAlign: "left" }}>
          <label htmlFor="prenom">Prénom ou surnom</label>
          <input
            id="prenom"
            maxLength={20}
            autoComplete="off"
            value={value}
            placeholder="Exemple : Sam"
            onChange={(event) => {
              setValue(event.target.value);
              setError("");
            }}
          />
          <p className="error" aria-live="polite">{error}</p>
        </div>
        <div className="mascot-stage">
          <p className="bubble">Comment veux-tu que je t’appelle ?</p>
          <Neo pose="guide" className="neo-small" />
        </div>
        <div className="actions">
          <Button
            variant="primary"
            onClick={() => {
              const next = value.trim();
              if (!next) {
                setError("Écris d’abord ton prénom ou un surnom.");
                return;
              }
              setPrenom(next);
              navigate("/accueil");
            }}
          >
            Continuer
          </Button>
        </div>
      </section>
    </Shell>
  );
}
