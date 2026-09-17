import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Choice } from "../components/Choice";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { findMission } from "../data/missions";
import { gradeLabel, subjectLabel } from "../data/catalog";
import { UNIVERSES, UNIVERSE_ORDER } from "../data/universes";
import type { UniverseSlug } from "../data/types";
import { useSession } from "../lib/session";

export function StudentWaitingScreen() {
  const navigate = useNavigate();
  const {
    role,
    displayName,
    liveSession,
    liveParticipant,
    lockedSession,
    kickedFromSession,
    clearKicked,
    leaveClassSession,
    startMission,
    sessionId,
    universe,
    setUniverse,
    mode,
  } = useSession();
  const [busy, setBusy] = useState(false);
  const [pickError, setPickError] = useState("");

  const activityReady = Boolean(liveSession?.missionId && liveSession.mode);
  const canStart = activityReady && Boolean(universe && mode);

  // Si la mission est déjà démarrée (reconnexion / retour), aller sur /mission.
  useEffect(() => {
    if (!lockedSession || !canStart || !sessionId) return;
    navigate("/mission", { replace: true });
  }, [lockedSession, canStart, sessionId, navigate]);

  if (kickedFromSession) {
    return (
      <Shell brand="Happy Learn" stepLabel="Session" homeTo="/connexion/eleve">
        <div className="split login-layout">
          <aside className="mascot-stage">
            <p className="bubble">Le professeur t’a déconnecté de la session.</p>
            <Neo pose="guide" />
          </aside>
          <section>
            <span className="kicker">Session terminée pour toi</span>
            <h1>Déconnecté</h1>
            <p className="lead" data-listen>
              Ton nom est à nouveau libre. Demande un nouveau code ou reconnecte-toi si le professeur te le demande.
            </p>
            <div className="actions">
              <Button
                variant="primary"
                onClick={() => {
                  clearKicked();
                  navigate("/connexion/eleve");
                }}
              >
                Retour à la connexion
              </Button>
            </div>
          </section>
        </div>
      </Shell>
    );
  }

  if (role !== "eleve") return <Navigate to="/connexion/eleve" replace />;
  if (!lockedSession || !liveSession || !liveParticipant) {
    return <Navigate to="/accueil" replace />;
  }

  const mission = findMission(liveSession.missionId);

  async function startChosenUniverse(slug: UniverseSlug) {
    setPickError("");
    setBusy(true);
    try {
      setUniverse(slug);
      await startMission({ universe: slug });
      navigate("/mission", { replace: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell brand="Happy Learn" stepLabel="Salle d’attente" homeTo="/salle-attente">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {!activityReady
              ? "Patiente ici. Ton professeur va bientôt lancer une mission."
              : "Choisis ton univers pour commencer !"}
          </p>
          <Neo pose={universe ? "universe" : "guide"} universe={universe} />
        </aside>
        <section>
          <span className="kicker">Session · {liveSession.code}</span>
          <h1>Salut {displayName} !</h1>
          <p className="lead" data-listen>
            Tu es connecté·e. Pendant la session, tu restes ici ou dans la mission — pas de navigation libre.
          </p>

          {!activityReady ? (
            <p className="field-help">En attente du lancement d’une activité…</p>
          ) : (
            <>
              {mission && liveSession.niveau && liveSession.matiere ? (
                <p>
                  Mission : <strong>{mission.title}</strong> ({gradeLabel(liveSession.niveau)} ·{" "}
                  {subjectLabel(liveSession.matiere)}
                  {liveSession.mode ? ` · ${liveSession.mode === "cahier" ? "cahier" : "QCM"}` : ""})
                </p>
              ) : null}
              <h2 style={{ fontSize: "1.2rem", marginTop: "1rem" }}>Choisis ton univers</h2>
              <div className="choice-grid" role="group" aria-label="Univers disponibles">
                {UNIVERSE_ORDER.map((slug) => {
                  const def = UNIVERSES[slug];
                  return (
                    <Choice
                      key={slug}
                      selected={universe === slug}
                      onClick={() => {
                        if (busy) return;
                        void startChosenUniverse(slug);
                      }}
                    >
                      <span className="icon-badge" aria-hidden="true">
                        {def.icon}
                      </span>
                      <span>
                        <strong>{def.label}</strong>
                        <small>{def.blurb}</small>
                      </span>
                    </Choice>
                  );
                })}
              </div>
              <p className="error" aria-live="polite">
                {pickError}
              </p>
              <div className="actions">
                <Button
                  variant="primary"
                  disabled={busy || !universe}
                  onClick={() => {
                    if (!universe) {
                      setPickError("Choisis un univers pour continuer.");
                      return;
                    }
                    void startChosenUniverse(universe);
                  }}
                >
                  {busy ? "Démarrage…" : "Commencer la mission"}
                </Button>
              </div>
            </>
          )}

          <div className="actions" style={{ marginTop: "1rem" }}>
            <Button
              type="button"
              onClick={() => {
                const ok = window.confirm("Quitter la session ? Tu pourras te reconnecter avec le même appareil.");
                if (!ok) return;
                void leaveClassSession().then(() => navigate("/connexion/eleve"));
              }}
            >
              Quitter la session
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
