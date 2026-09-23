import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";
import { supabaseConfigured } from "../lib/supabase";

type ParentMode = "connexion" | "inscription";

export function ParentLoginScreen() {
  const navigate = useNavigate();
  const { role, loginParentPassword, loginParentGoogle, loginParentLocal, premiumActive } =
    useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentMode, setParentMode] = useState<ParentMode>("connexion");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const hasServer = supabaseConfigured();

  useEffect(() => {
    if (role === "parent") {
      navigate(premiumActive ? "/espace-parent" : "/abonnement", { replace: true });
    }
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
    if (role === "admin") navigate("/espace-admin", { replace: true });
    if (role === "eleve") navigate("/accueil", { replace: true });
  }, [role, premiumActive, navigate]);

  if (role === "parent") {
    return <Navigate to={premiumActive ? "/espace-parent" : "/abonnement"} replace />;
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Parent" homeTo="/" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">À la maison : tu pilotes le foyer, les enfants jouent avec un code PIN.</p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace parent</span>
          <h1>Connexion</h1>
          <p className="lead" data-listen>
            Crée un compte familial, ajoute tes enfants, suis leurs progrès et gère l’abonnement.
          </p>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              if (!hasServer) {
                void loginParentLocal(email).then((message) => {
                  setBusy(false);
                  if (message) setError(message);
                  else navigate("/espace-parent");
                });
                return;
              }
              void loginParentPassword(email, password, parentMode).then((message) => {
                setBusy(false);
                if (message) setError(message);
                else navigate("/espace-parent");
              });
            }}
          >
            {hasServer ? (
              <div className="role-tabs" role="tablist" aria-label="Type de compte parent">
                <button
                  type="button"
                  role="tab"
                  aria-selected={parentMode === "connexion"}
                  className={parentMode === "connexion" ? "is-selected" : ""}
                  onClick={() => setParentMode("connexion")}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={parentMode === "inscription"}
                  className={parentMode === "inscription" ? "is-selected" : ""}
                  onClick={() => setParentMode("inscription")}
                >
                  Créer un compte
                </button>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="parent-email">E-mail</label>
              <input
                id="parent-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {hasServer ? (
              <div className="field">
                <label htmlFor="parent-password">Mot de passe</label>
                <input
                  id="parent-password"
                  type="password"
                  autoComplete={parentMode === "inscription" ? "new-password" : "current-password"}
                  value={password}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            ) : (
              <p className="field-help">Mode local : compte foyer sur cet appareil uniquement.</p>
            )}
            <p className="error" aria-live="polite">
              {error}
            </p>
            <div className="actions">
              <Button variant="primary" type="submit" disabled={busy}>
                {hasServer
                  ? parentMode === "inscription"
                    ? "Créer le compte"
                    : "Se connecter"
                  : "Ouvrir l’espace parent"}
              </Button>
              {hasServer ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    setError("");
                    void loginParentGoogle().then((message) => {
                      setBusy(false);
                      if (message) setError(message);
                    });
                  }}
                >
                  Continuer avec Google
                </Button>
              ) : null}
              {hasServer ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    setError("");
                    void loginParentLocal(email).then((message) => {
                      setBusy(false);
                      if (message) setError(message);
                      else navigate("/espace-parent");
                    });
                  }}
                >
                  Essayer en local (cet appareil)
                </Button>
              ) : null}
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
