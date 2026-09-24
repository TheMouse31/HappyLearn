import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { OAuthButtons } from "../components/OAuthButtons";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";
import { supabaseConfigured } from "../lib/supabase";
import { isAdminEmail } from "../lib/admins";

type TeacherMode = "connexion" | "inscription";

export function TeacherLoginScreen() {
  const navigate = useNavigate();
  const { role, loginTeacherPassword, loginTeacherMagic, loginTeacherLocal, loginTeacherGoogle } =
    useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("connexion");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const hasServer = supabaseConfigured();

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "admin") navigate("/espace-admin", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, navigate]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "admin") return <Navigate to="/espace-admin" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <Shell variant="auth" brand="Happy Learn" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">L’espace enseignant sert à préparer ta classe et suivre les missions.</p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace enseignant</span>
          <h1>Connexion</h1>
          <p className="lead" data-listen>
            Crée des classes, ajoute tes élèves, partage un code, et suis leurs missions sans note ni classement.
          </p>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              setInfo("");
              if (!hasServer) {
                void loginTeacherLocal(email).then((message) => {
                  setBusy(false);
                  if (message) setError(message);
                  else navigate(isAdminEmail(email) ? "/espace-admin" : "/espace-professeur");
                });
                return;
              }
              void loginTeacherPassword(email, password, teacherMode).then((message) => {
                setBusy(false);
                if (message) setError(message);
                else navigate(isAdminEmail(email) ? "/espace-admin" : "/espace-professeur");
              });
            }}
          >
            {hasServer ? (
              <div className="role-tabs" role="tablist" aria-label="Type de compte enseignant">
                <button
                  type="button"
                  role="tab"
                  aria-selected={teacherMode === "connexion"}
                  className={teacherMode === "connexion" ? "is-selected" : ""}
                  onClick={() => setTeacherMode("connexion")}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={teacherMode === "inscription"}
                  className={teacherMode === "inscription" ? "is-selected" : ""}
                  onClick={() => setTeacherMode("inscription")}
                >
                  Créer un compte
                </button>
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                placeholder="prenom.nom@ecole.fr"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {hasServer ? (
              <div className="field">
                <label htmlFor="password">Mot de passe</label>
                <input
                  id="password"
                  type="password"
                  autoComplete={teacherMode === "inscription" ? "new-password" : "current-password"}
                  value={password}
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            ) : (
              <p className="field-help">
                Mode local : pas de serveur pour le moment. L’espace enseignant reste sur cet appareil, sans mot de
                passe. Brancher Supabase active le compte e-mail réel.
              </p>
            )}
            <p className="error" aria-live="polite">
              {error}
            </p>
            <p className="feedback info" aria-live="polite">
              {info}
            </p>
            <div className="actions">
              <Button variant="primary" type="submit" disabled={busy}>
                {hasServer
                  ? teacherMode === "inscription"
                    ? "Créer le compte"
                    : "Se connecter"
                  : "Ouvrir l’espace enseignant"}
              </Button>
              {hasServer ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    setError("");
                    setInfo("");
                    void loginTeacherMagic(email).then((message) => {
                      setBusy(false);
                      if (message === "sent") {
                        setInfo("Un lien de connexion a été envoyé. Ouvre-le sur cet appareil.");
                      } else if (message) setError(message);
                    });
                  }}
                >
                  Recevoir un lien magique
                </Button>
              ) : null}
              {hasServer ? (
                <OAuthButtons
                  busy={busy}
                  onGoogle={() => {
                    setBusy(true);
                    setError("");
                    void loginTeacherGoogle().then((message) => {
                      setBusy(false);
                      if (message) setError(message);
                    });
                  }}
                />
              ) : null}
              {hasServer ? (
                <Button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setBusy(true);
                    setError("");
                    setInfo("");
                    void loginTeacherLocal(email).then((message) => {
                      setBusy(false);
                      if (message) setError(message);
                      else navigate("/espace-professeur");
                    });
                  }}
                >
                  Essayer en local (cet appareil)
                </Button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </Shell>
  );
}
