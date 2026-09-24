import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Home, School } from "lucide-react";
import { Button } from "../components/Button";
import { Neo, type NeoPose } from "../components/Neo";
import { Shell } from "../components/Shell";
import type { ClassStudent, EleveFoyer } from "../data/types";
import { formatStudentName } from "../data/types";
import { isValidClassCode, normalizeClassCode } from "../lib/classCode";
import { listElevesByFoyerCode } from "../lib/familyStore";
import { useSession } from "../lib/session";

type Step =
  | "lieu"
  | "ecole-choix"
  | "code-session"
  | "roster"
  | "prenom-libre"
  | "code-foyer"
  | "pick-kid"
  | "pin"
  | "success";

type NeoPoseName = NeoPose;

function bubbleFor(step: Step): string {
  if (step === "lieu") return "Es-tu à l’école ou à la maison ?";
  if (step === "ecole-choix") return "Tu as un code de classe ?";
  if (step === "code-session") return "Entre le code que ton prof a écrit au tableau.";
  if (step === "roster") return "C’est toi ! Choisis ton prénom.";
  if (step === "prenom-libre") return "Dis-moi ton prénom, on part jouer.";
  if (step === "code-foyer") return "Entre le code foyer de ta famille.";
  if (step === "pick-kid") return "Qui es-tu dans la famille ?";
  if (step === "pin") return "Ton code secret à 4 chiffres.";
  return "Bravo ! On y va.";
}

function poseFor(step: Step): NeoPoseName {
  if (step === "success") return "applaudit";
  if (step === "pin" || step === "roster" || step === "pick-kid") return "pouce";
  return "guide";
}

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

  const [step, setStep] = useState<Step>("lieu");
  const [stepKey, setStepKey] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [prenom, setPrenom] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [roster, setRoster] = useState<ClassStudent[] | null>(null);
  const [foyerKids, setFoyerKids] = useState<EleveFoyer[] | null>(null);
  const [rosterError, setRosterError] = useState("");
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const codeLooksValid = isValidClassCode(code);

  function goStep(next: Step) {
    setError("");
    setStep(next);
    setStepKey((k) => k + 1);
  }

  useEffect(() => {
    if (kickedFromSession) clearKicked();
  }, [kickedFromSession, clearKicked]);

  useEffect(() => {
    if (lockedSession) navigate("/salle-attente", { replace: true });
    else if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
    if (role === "parent") navigate("/espace-parent", { replace: true });
  }, [role, lockedSession, navigate]);

  // Charger roster école quand on est sur l’étape code/roster
  useEffect(() => {
    if (step !== "code-session" && step !== "roster") return;
    if (!codeLooksValid) {
      setRoster(null);
      setRosterError("");
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
        if (students.length === 0) {
          setRosterError("Personne dans la liste. Demande à ton prof, ou reviens et joue sans code.");
        } else if (step === "code-session") {
          goStep("roster");
        }
      });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goStep intentional on valid code
  }, [code, codeLooksValid, step, listStudentsForSessionCode]);

  // Charger enfants foyer
  useEffect(() => {
    if (step !== "code-foyer" && step !== "pick-kid") return;
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
          setRosterError("Ce code foyer n’existe pas. Demande à un parent.");
          return;
        }
        setFoyerKids(result.eleves);
        setRosterError(result.eleves.length === 0 ? "Aucun enfant dans ce foyer." : "");
        if (result.eleves.length > 0 && step === "code-foyer") goStep("pick-kid");
      });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, codeLooksValid, step]);

  function goBack() {
    setError("");
    if (step === "ecole-choix" || step === "code-foyer") goStep("lieu");
    else if (step === "code-session" || step === "prenom-libre") goStep("ecole-choix");
    else if (step === "roster") {
      setSelectedId("");
      goStep("code-session");
    } else if (step === "pick-kid") {
      setSelectedId("");
      goStep("code-foyer");
    } else if (step === "pin") {
      setPin("");
      goStep("pick-kid");
    }
  }

  function finishSchoolFree() {
    setBusy(true);
    void loginEleve(prenom, "", undefined).then((result) => {
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      goStep("success");
      window.setTimeout(() => navigate(result.live ? "/salle-attente" : "/accueil"), 700);
    });
  }

  function finishSchoolRoster() {
    const chosen = roster?.find((item) => item.id === selectedId);
    if (!chosen) return;
    setBusy(true);
    void loginEleve(chosen.prenom, code, selectedId).then((result) => {
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      goStep("success");
      window.setTimeout(() => navigate(result.live ? "/salle-attente" : "/accueil"), 700);
    });
  }

  function finishMaison() {
    setBusy(true);
    void loginEleveFoyer(selectedId, pin).then((result) => {
      setBusy(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      goStep("success");
      window.setTimeout(() => navigate("/accueil"), 700);
    });
  }

  function appendPin(digit: string) {
    if (pin.length >= 4) return;
    const next = (pin + digit).slice(0, 4);
    setPin(next);
    setError("");
    if (next.length === 4) {
      // auto-submit after short beat
      window.setTimeout(() => {
        setBusy(true);
        void loginEleveFoyer(selectedId, next).then((result) => {
          setBusy(false);
          if (!result.ok) {
            setError(result.error);
            setPin("");
            return;
          }
          goStep("success");
          window.setTimeout(() => navigate("/accueil"), 700);
        });
      }, 180);
    }
  }

  if (lockedSession) return <Navigate to="/salle-attente" replace />;
  if (role === "eleve") return <Navigate to="/accueil" replace />;

  const showBack = step !== "lieu" && step !== "success";

  return (
    <Shell variant="auth" brand="Happy Learn" backTo="/connexion">
      <div className="split login-layout eleve-wizard">
        <aside className="mascot-stage">
          <p className="bubble" key={`bubble-${step}`}>
            {bubbleFor(step)}
          </p>
          <Neo pose={poseFor(step)} />
        </aside>
        <section>
          <span className="kicker">Espace élève</span>
          <div key={stepKey} className="eleve-step eleve-step-enter">
            {step === "lieu" ? (
              <>
                <h1>Es-tu à l’école ou à la maison ?</h1>
                <div className="eleve-choice-cards" role="group" aria-label="Lieu">
                  <button
                    type="button"
                    className="eleve-choice-card"
                    onClick={() => {
                      setCode("");
                      setPrenom("");
                      setSelectedId("");
                      goStep("ecole-choix");
                    }}
                  >
                    <School size={36} strokeWidth={2.25} aria-hidden />
                    <strong>À l’école</strong>
                    <span>Avec ma classe</span>
                  </button>
                  <button
                    type="button"
                    className="eleve-choice-card"
                    onClick={() => {
                      setCode("");
                      setSelectedId("");
                      setPin("");
                      goStep("code-foyer");
                    }}
                  >
                    <Home size={36} strokeWidth={2.25} aria-hidden />
                    <strong>À la maison</strong>
                    <span>Avec ma famille</span>
                  </button>
                </div>
              </>
            ) : null}

            {step === "ecole-choix" ? (
              <>
                <h1>Tu as un code de classe ?</h1>
                <div className="eleve-choice-cards" role="group">
                  <button
                    type="button"
                    className="eleve-choice-card"
                    onClick={() => {
                      setCode("");
                      setSelectedId("");
                      goStep("code-session");
                    }}
                  >
                    <strong>Oui</strong>
                    <span>Le prof a mis un code</span>
                  </button>
                  <button
                    type="button"
                    className="eleve-choice-card"
                    onClick={() => {
                      setCode("");
                      setPrenom("");
                      goStep("prenom-libre");
                    }}
                  >
                    <strong>Non</strong>
                    <span>Je joue avec mon prénom</span>
                  </button>
                </div>
              </>
            ) : null}

            {step === "code-session" ? (
              <>
                <h1>Le code de classe</h1>
                <div className="field eleve-big-field">
                  <label htmlFor="code-session">Code</label>
                  <input
                    id="code-session"
                    maxLength={8}
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoFocus
                    value={code}
                    placeholder="Ex. BLEU4K"
                    onChange={(event) => {
                      setCode(normalizeClassCode(event.target.value));
                      setError("");
                      setRosterError("");
                    }}
                  />
                </div>
                {loadingRoster ? <p className="field-help">Je cherche la classe…</p> : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
              </>
            ) : null}

            {step === "roster" ? (
              <>
                <h1>Qui es-tu ?</h1>
                {loadingRoster ? <p className="field-help">Chargement…</p> : null}
                {roster && roster.length > 0 ? (
                  <div className="eleve-name-grid" role="listbox" aria-label="Prénoms">
                    {roster.map((student) => {
                      const label = formatStudentName(student.prenom, student.nom);
                      return (
                        <button
                          key={student.id}
                          type="button"
                          role="option"
                          aria-selected={selectedId === student.id}
                          className={`eleve-name-chip${selectedId === student.id ? " is-selected" : ""}`}
                          onClick={() => {
                            setSelectedId(student.id);
                            setPrenom(student.prenom);
                            setError("");
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
                <div className="actions">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={busy || !selectedId}
                    onClick={finishSchoolRoster}
                  >
                    C’est moi !
                  </Button>
                </div>
              </>
            ) : null}

            {step === "prenom-libre" ? (
              <>
                <h1>Comment tu t’appelles ?</h1>
                <div className="field eleve-big-field">
                  <label htmlFor="prenom-libre">Prénom</label>
                  <input
                    id="prenom-libre"
                    maxLength={20}
                    autoComplete="nickname"
                    autoFocus
                    value={prenom}
                    placeholder="Ex. Sam"
                    onChange={(event) => setPrenom(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && prenom.trim()) finishSchoolFree();
                    }}
                  />
                </div>
                <div className="actions">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={busy || !prenom.trim()}
                    onClick={finishSchoolFree}
                  >
                    Entrer
                  </Button>
                </div>
              </>
            ) : null}

            {step === "code-foyer" ? (
              <>
                <h1>Le code foyer</h1>
                <div className="field eleve-big-field">
                  <label htmlFor="code-foyer">Code</label>
                  <input
                    id="code-foyer"
                    maxLength={8}
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoFocus
                    value={code}
                    placeholder="Ex. FAM4K2"
                    onChange={(event) => {
                      setCode(normalizeClassCode(event.target.value));
                      setError("");
                      setRosterError("");
                    }}
                  />
                </div>
                {loadingRoster ? <p className="field-help">Je cherche ta famille…</p> : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
              </>
            ) : null}

            {step === "pick-kid" ? (
              <>
                <h1>Qui es-tu ?</h1>
                {foyerKids && foyerKids.length > 0 ? (
                  <div className="eleve-name-grid" role="listbox">
                    {foyerKids.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        role="option"
                        aria-selected={selectedId === child.id}
                        className={`eleve-name-chip${selectedId === child.id ? " is-selected" : ""}`}
                        onClick={() => {
                          setSelectedId(child.id);
                          setPin("");
                          goStep("pin");
                        }}
                      >
                        {formatStudentName(child.prenom, child.nom)}
                      </button>
                    ))}
                  </div>
                ) : null}
                {rosterError ? <p className="field-help">{rosterError}</p> : null}
              </>
            ) : null}

            {step === "pin" ? (
              <>
                <h1>Ton code secret</h1>
                <div className="eleve-pin-dots" aria-live="polite" aria-label={`${pin.length} chiffres`}>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`eleve-pin-dot${pin.length > i ? " is-filled" : ""}`} />
                  ))}
                </div>
                <div className="eleve-pin-pad" role="group" aria-label="Pavé numérique">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key) => {
                    if (key === "") return <span key="spacer" className="eleve-pin-spacer" />;
                    if (key === "⌫") {
                      return (
                        <button
                          key="back"
                          type="button"
                          className="eleve-pin-key"
                          aria-label="Effacer"
                          disabled={busy}
                          onClick={() => setPin((p) => p.slice(0, -1))}
                        >
                          ⌫
                        </button>
                      );
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        className="eleve-pin-key"
                        disabled={busy || pin.length >= 4}
                        onClick={() => appendPin(key)}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
                <div className="actions">
                  <Button
                    variant="primary"
                    type="button"
                    disabled={busy || pin.length !== 4}
                    onClick={finishMaison}
                  >
                    Entrer
                  </Button>
                </div>
              </>
            ) : null}

            {step === "success" ? (
              <>
                <h1>C’est parti !</h1>
                <p className="lead">Neo t’attend…</p>
              </>
            ) : null}
          </div>

          <p className="error" aria-live="polite">
            {error}
          </p>
          {showBack ? (
            <button type="button" className="text-link eleve-back" onClick={goBack}>
              ← Retour
            </button>
          ) : null}
        </section>
      </div>
    </Shell>
  );
}
