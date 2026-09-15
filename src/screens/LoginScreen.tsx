import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { normalizeClassCode } from "../lib/classCode";
import { useSession } from "../lib/session";
import { supabaseConfigured } from "../lib/supabase";

type Audience = "eleve" | "enseignant";
type TeacherMode = "connexion" | "inscription";

export function LoginScreen() {
  const navigate = useNavigate();
  const {
    role,
    loginEleve,
    loginTeacherPassword,
    loginTeacherMagic,
    loginTeacherLocal,
  } = useSession();
  const [audience, setAudience] = useState<Audience | null>(null);
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teacherMode, setTeacherMode] = useState<TeacherMode>("connexion");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const hasServer = supabaseConfigured();

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, navigate]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {audience === "enseignant"
              ? "L’espace enseignant sert à l’école comme à la maison."
              : "Bonjour ! Choisis qui tu es pour commencer."}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Happy Learn</span>
          <h1>Connexion à Happy Learn</h1>
          <p className="lead" data-listen>
            Les élèves n’utilisent pas d’e-mail. Les professeurs et les parents se connectent avec un e-mail.
          </p>

          <div className="portal-grid" role="group" aria-label="Qui es-tu ?">
            <button
              type="button"
              className={`choice ${audience === "eleve" ? "is-selected" : ""}`}
              aria-pressed={audience === "eleve"}
              onClick={() => {
                setAudience("eleve");
                setError("");
                setInfo("");
              }}
            >
              <span className="icon-badge" aria-hidden="true">🎒</span>
              <span>
                Je suis un élève
                <small>École ou à la maison · prénom, pas d’e-mail</small>
              </span>
            </button>
            <button
              type="button"
              className={`choice ${audience === "enseignant" ? "is-selected" : ""}`}
              aria-pressed={audience === "enseignant"}
              onClick={() => {
                setAudience("enseignant");
                setError("");
                setInfo("");
              }}
            >
              <span className="icon-badge" aria-hidden="true">📒</span>
              <span>
                Je suis professeur ou parent
                <small>E-mail, mot de passe ou lien magique</small>
              </span>
            </button>
          </div>

          {audience === "eleve" ? (
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
                  À l’école, écris le code donné par ton professeur. À la maison, tu peux laisser vide.
                </p>
              </div>
              <p className="error" aria-live="polite">
                {error}
              </p>
              <div className="actions">
                <Button variant="primary" type="submit" disabled={busy}>
                  Entrer dans les missions
                </Button>
              </div>
            </form>
          ) : null}

          {audience === "enseignant" ? (
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
                    else navigate("/espace-professeur");
                  });
                  return;
                }
                void loginTeacherPassword(email, password, teacherMode).then((message) => {
                  setBusy(false);
                  if (message) setError(message);
                  else navigate("/espace-professeur");
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
              </div>
            </form>
          ) : null}
        </section>
      </div>
    </Shell>
  );
}
