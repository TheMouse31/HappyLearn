import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { normalizeClassCode } from "../lib/classCode";
import { useSession } from "../lib/session";

export function EleveLoginScreen() {
  const navigate = useNavigate();
  const { role, loginEleve } = useSession();
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, navigate]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Élève" homeTo="/" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">Dis-moi ton prénom et on part en mission !</p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace élève</span>
          <h1>Bienvenue</h1>
          <p className="lead" data-listen>
            Pas besoin d’e-mail. Écris ton prénom ou un surnom pour commencer.
          </p>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              void loginEleve(prenom, code).then((message) => {
                setBusy(false);
                if (message) setError(message);
                else navigate("/accueil");
              });
            }}
          >
            <div className="field">
              <label htmlFor="prenom">Prénom ou surnom</label>
              <input
                id="prenom"
                maxLength={20}
                autoComplete="nickname"
                value={prenom}
                placeholder="Exemple : Sam"
                onChange={(event) => setPrenom(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="code-classe">Code classe (facultatif)</label>
              <input
                id="code-classe"
                maxLength={8}
                autoCapitalize="characters"
                autoComplete="off"
                value={code}
                placeholder="Exemple : BLEU4K"
                onChange={(event) => setCode(normalizeClassCode(event.target.value))}
              />
              <p className="field-help">
                Le code, c’est celui de ton professeur. À la maison, tu peux laisser vide.
              </p>
            </div>
            <p className="error" aria-live="polite">
              {error}
            </p>
            <div className="actions">
              <Button variant="primary" type="submit" disabled={busy}>
                Entrer dans les missions
              </Button>
              <Link className="text-link" to="/">
                Accueil du site
              </Link>
            </div>
          </form>
        </section>
      </div>
    </Shell>
  );
}
