import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import type { ClassStudent, EleveFoyer } from "../data/types";
import { formatStudentName } from "../data/types";
import { isValidClassCode, normalizeClassCode } from "../lib/classCode";
import { listElevesByFoyerCode } from "../lib/familyStore";
import { useSession } from "../lib/session";

type EntryMode = "ecole" | "maison";

export function EleveLoginScreen() {
  const navigate = useNavigate();
  const {
    role,
    loginEleve,
    loginEleveFoyer,
    listStudentsForSessionCode,
    lockedSession,
    kickedFromSession,
    clearKicked,
  } = useSession();
  const [entryMode, setEntryMode] = useState<EntryMode>("ecole");
  const [selectedId, setSelectedId] = useState("");
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [roster, setRoster] = useState<ClassStudent[] | null>(null);
  const [foyerKids, setFoyerKids] = useState<EleveFoyer[] | null>(null);
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
    if (role === "parent") navigate("/espace-parent", { replace: true });
  }, [role, lockedSession, navigate]);

  useEffect(() => {
    if (entryMode !== "ecole") return;
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
  }, [code, hasCode, codeLooksValid, listStudentsForSessionCode, entryMode]);

  useEffect(() => {
    if (entryMode !== "maison") return;
    if (!codeLooksValid) {
      setFoyerKids(null);
      return;
    }
    let cancelled = false;
    setLoadingRoster(true);
    const timer = window.setTimeout(() => {
      void listElevesByFoyerCode(code).then((result) => {
        if (cancelled) return;
        setLoadingRoster(false);
        if (!result) {
          setFoyerKids([]);
          setRosterError("Aucun foyer avec ce code.");
          return;
        }
        setFoyerKids(result.eleves);
        setRosterError(result.eleves.length === 0 ? "Aucun enfant dans ce foyer." : "");
        setSelectedId("");
      });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code, codeLooksValid, entryMode]);

  if (lockedSession) return <Navigate to="/salle-attente" replace />;
  if (role === "eleve") return <Navigate to="/accueil" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Élève" homeTo="/" backTo="/connexion">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {entryMode === "maison"
              ? "Code foyer + ton nom + ton PIN secret."
              : hasCode
                ? "Entre le code de session, puis choisis ton nom."
                : "Sans code, écris ton prénom et on part !"}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Espace élève</span>
          <h1>Bienvenue</h1>
          <div className="role-tabs" role="tablist" aria-label="Mode">
            <button
              type="button"
              role="tab"
              className={entryMode === "ecole" ? "is-selected" : ""}
              aria-selected={entryMode === "ecole"}
              onClick={() => {
                setEntryMode("ecole");
                setError("");
                setSelectedId("");
              }}
            >
              À l’école
            </button>
            <button
              type="button"
              role="tab"
              className={entryMode === "maison" ? "is-selected" : ""}
              aria-selected={entryMode === "maison"}
              onClick={() => {
                setEntryMode("maison");
                setError("");
                setSelectedId("");
                setPin("");
              }}
            >
              À la maison
            </button>
          </div>
          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              setError("");
              if (entryMode === "maison") {
                void loginEleveFoyer(selectedId, pin).then((result) => {
                  setBusy(false);
                  if (!result.ok) setError(result.error);
                  else navigate("/accueil");
                });
                return;
              }
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
              <label htmlFor="code-classe">
                {entryMode === "maison" ? "Code foyer" : "Code de session (facultatif)"}
              </label>
              <input
                id="code-classe"
                maxLength={8}
                autoCapitalize="characters"
                autoComplete="off"
                value={code}
                placeholder={entryMode === "maison" ? "Exemple : FAM4K2" : "Exemple : BLEU4K"}
                onChange={(event) => {
                  setCode(normalizeClassCode(event.target.value));
                  setError("");
                }}
              />
            </div>

            {entryMode === "ecole" && !hasCode ? (
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

            {entryMode === "ecole" && hasCode && codeLooksValid ? (
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

            {entryMode === "maison" && codeLooksValid ? (
              <>
                <div className="field">
                  <span className="field-label">Ton prénom</span>
                  {loadingRoster ? <p className="field-help">Chargement…</p> : null}
                  {foyerKids && foyerKids.length > 0 ? (
                    <div className="roster-pick" role="listbox">
                      {foyerKids.map((child) => (
                        <button
                          key={child.id}
                          type="button"
                          role="option"
                          aria-selected={selectedId === child.id}
                          className={`choice ${selectedId === child.id ? "is-selected" : ""}`}
                          onClick={() => setSelectedId(child.id)}
                        >
                          {formatStudentName(child.prenom, child.nom)}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {rosterError ? <p className="field-help">{rosterError}</p> : null}
                </div>
                <div className="field">
                  <label htmlFor="pin">PIN (4 chiffres)</label>
                  <input
                    id="pin"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </div>
              </>
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
                  (entryMode === "maison" &&
                    (!codeLooksValid || !selectedId || pin.length !== 4 || loadingRoster)) ||
                  (entryMode === "ecole" &&
                    hasCode &&
                    (!codeLooksValid || loadingRoster || !selectedId || (roster?.length ?? 0) === 0)) ||
                  (entryMode === "ecole" && !hasCode && !prenom.trim())
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
