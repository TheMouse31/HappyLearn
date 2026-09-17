import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import type { ClassStudent } from "../data/types";
import { isValidClassCode, normalizeClassCode } from "../lib/classCode";
import { useSession } from "../lib/session";

export function EleveLoginScreen() {
  const navigate = useNavigate();
  const { role, loginEleve, listStudentsByClassCode } = useSession();
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [roster, setRoster] = useState<ClassStudent[] | null>(null);
  const [rosterError, setRosterError] = useState("");
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const hasCode = code.trim().length > 0;
  const codeLooksValid = isValidClassCode(code);

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, navigate]);

  useEffect(() => {
    if (!hasCode) {
      setRoster(null);
      setRosterError("");
      setLoadingRoster(false);
      return;
    }
    if (!codeLooksValid) {
      setRoster(null);
      setRosterError("");
      return;
    }

    let cancelled = false;
    setLoadingRoster(true);
    setRosterError("");
    const timer = window.setTimeout(() => {
      void listStudentsByClassCode(code).then((students) => {
        if (cancelled) return;
        setLoadingRoster(false);
        setRoster(students);
        setPrenom("");
        if (students.length === 0) {
          setRosterError(
            "Aucun prénom dans cette classe pour l’instant. Demande à ton professeur d’ajouter la liste, ou laisse le code vide pour jouer seul.",
          );
        }
      });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, hasCode, codeLooksValid, listStudentsByClassCode]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Élève" homeTo="/" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {hasCode
              ? "Entre le code de ta classe, puis choisis ton prénom dans la liste."
              : "Sans code, écris ton prénom et on part en mission !"}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace élève</span>
          <h1>Bienvenue</h1>
          <p className="lead" data-listen>
            Pas besoin d’e-mail. À l’école, utilise le code de ton professeur. Seul à la maison, laisse le code vide.
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
              <label htmlFor="code-classe">Code classe (facultatif)</label>
              <input
                id="code-classe"
                maxLength={8}
                autoCapitalize="characters"
                autoComplete="off"
                value={code}
                placeholder="Exemple : BLEU4K"
                onChange={(event) => {
                  setCode(normalizeClassCode(event.target.value));
                  setError("");
                }}
              />
              <p className="field-help">
                Avec un code, tu choisis ton prénom dans la liste. Sans code, tu peux écrire ton prénom toi-même.
              </p>
            </div>

            {!hasCode ? (
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
            ) : null}

            {hasCode && codeLooksValid ? (
              <div className="field">
                <span className="field-label" id="roster-label">
                  Ton prénom dans la classe
                </span>
                {loadingRoster ? <p className="field-help">Chargement de la liste…</p> : null}
                {!loadingRoster && roster && roster.length > 0 ? (
                  <div className="roster-pick" role="listbox" aria-labelledby="roster-label">
                    {roster.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        role="option"
                        aria-selected={prenom === student.prenom}
                        className={`choice ${prenom === student.prenom ? "is-selected" : ""}`}
                        onClick={() => {
                          setPrenom(student.prenom);
                          setError("");
                        }}
                      >
                        <span>{student.prenom}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
              </div>
            ) : null}

            {hasCode && !codeLooksValid ? (
              <p className="field-help">Le code a 4 à 8 lettres ou chiffres, sans espace.</p>
            ) : null}

            <p className="error" aria-live="polite">
              {error}
            </p>
            <div className="actions">
              <Button
                variant="primary"
                type="submit"
                disabled={
                  busy ||
                  (hasCode && (!codeLooksValid || loadingRoster || !prenom || (roster?.length ?? 0) === 0))
                }
              >
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
