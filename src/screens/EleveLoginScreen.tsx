import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import type { ClassStudent } from "../data/types";
import { formatStudentName } from "../data/types";
import { isValidClassCode, normalizeClassCode } from "../lib/classCode";
import { useSession } from "../lib/session";

export function EleveLoginScreen() {
  const navigate = useNavigate();
  const { role, loginEleve, listStudentsForSessionCode, lockedSession, kickedFromSession, clearKicked } =
    useSession();
  const [selectedId, setSelectedId] = useState("");
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [roster, setRoster] = useState<ClassStudent[] | null>(null);
  const [rosterError, setRosterError] = useState("");
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const hasCode = code.trim().length > 0;
  const codeLooksValid = isValidClassCode(code);

  useEffect(() => {
    if (kickedFromSession) clearKicked();
  }, [kickedFromSession, clearKicked]);

  useEffect(() => {
    if (lockedSession) navigate("/salle-attente", { replace: true });
    else if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, lockedSession, navigate]);

  useEffect(() => {
    if (!hasCode) {
      setRoster(null);
      setRosterError("");
      setLoadingRoster(false);
      setIsLiveSession(false);
      return;
    }
    if (!codeLooksValid) {
      setRoster(null);
      setRosterError("");
      setIsLiveSession(false);
      return;
    }

    let cancelled = false;
    setLoadingRoster(true);
    setRosterError("");
    const timer = window.setTimeout(() => {
      void listStudentsForSessionCode(code).then((students) => {
        if (cancelled) return;
        setLoadingRoster(false);
        setRoster(students);
        setSelectedId("");
        setPrenom("");
        // Heuristic: if code matches an open live session, joinClassSession path is used via loginEleve
        setIsLiveSession(true);
        if (students.length === 0) {
          setRosterError(
            "Aucun élève dans cette classe pour l’instant. Demande à ton professeur d’ajouter la liste, ou laisse le code vide pour jouer seul.",
          );
          setIsLiveSession(false);
        }
      });
    }, 280);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, hasCode, codeLooksValid, listStudentsForSessionCode]);

  if (lockedSession) return <Navigate to="/salle-attente" replace />;
  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Élève" homeTo="/" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {hasCode
              ? "Entre le code de session, puis choisis ton nom dans la liste."
              : "Sans code, écris ton prénom et on part en mission !"}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace élève</span>
          <h1>Bienvenue</h1>
          <p className="lead" data-listen>
            Pas besoin d’e-mail. À l’école, utilise le code de session de ton professeur. Seul à la maison, laisse le
            code vide.
          </p>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              const chosen = roster?.find((item) => item.id === selectedId);
              void loginEleve(chosen?.prenom ?? prenom, code, selectedId || undefined).then((result) => {
                setBusy(false);
                if (!result.ok) {
                  setError(result.error);
                  return;
                }
                navigate(result.live ? "/salle-attente" : "/accueil");
              });
            }}
          >
            <div className="field">
              <label htmlFor="code-classe">Code de session (facultatif)</label>
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
                Avec un code de session, tu choisis ton nom dans la liste. Sans code, tu peux écrire ton prénom
                toi-même.
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
                  Ton nom dans la classe
                </span>
                {loadingRoster ? <p className="field-help">Chargement de la liste…</p> : null}
                {!loadingRoster && roster && roster.length > 0 ? (
                  <div className="roster-pick" role="listbox" aria-labelledby="roster-label">
                    {roster.map((student) => {
                      const label = formatStudentName(student.prenom, student.nom);
                      return (
                        <button
                          key={student.id}
                          type="button"
                          role="option"
                          aria-selected={selectedId === student.id}
                          className={`choice ${selectedId === student.id ? "is-selected" : ""}`}
                          onClick={() => {
                            setSelectedId(student.id);
                            setPrenom(student.prenom);
                            setError("");
                          }}
                        >
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
                {isLiveSession && roster && roster.length > 0 ? (
                  <p className="field-help">Un nom ne peut être pris qu’une fois par session.</p>
                ) : null}
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
                  (hasCode &&
                    (!codeLooksValid || loadingRoster || !selectedId || (roster?.length ?? 0) === 0)) ||
                  (!hasCode && !prenom.trim())
                }
              >
                Entrer
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
