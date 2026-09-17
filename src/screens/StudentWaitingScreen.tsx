import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { findMission } from "../data/missions";
import { gradeLabel, subjectLabel } from "../data/catalog";
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
  } = useSession();

  useEffect(() => {
    if (!lockedSession || !liveSession?.missionId || !liveSession.univers || !liveSession.mode) {
      return;
    }
    if (sessionId) {
      navigate("/mission", { replace: true });
      return;
    }
    let cancelled = false;
    void startMission().then(() => {
      if (!cancelled) navigate("/mission", { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [
    lockedSession,
    liveSession?.missionId,
    liveSession?.univers,
    liveSession?.mode,
    sessionId,
    startMission,
    navigate,
  ]);

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

  return (
    <Shell brand="Happy Learn" stepLabel="Salle d’attente" homeTo="/salle-attente">
      <div className="split login-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            {mission
              ? "Mission en préparation… On y va tout de suite !"
              : "Patiente ici. Ton professeur va bientôt lancer une mission."}
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">Session · {liveSession.code}</span>
          <h1>Salut {displayName} !</h1>
          <p className="lead" data-listen>
            Tu es connecté·e. Pendant la session, tu restes ici ou dans la mission — pas de navigation libre.
          </p>
          {mission && liveSession.niveau && liveSession.matiere ? (
            <p>
              Prochaine mission : <strong>{mission.title}</strong> ({gradeLabel(liveSession.niveau)} ·{" "}
              {subjectLabel(liveSession.matiere)})
            </p>
          ) : (
            <p className="field-help">En attente du lancement d’une activité…</p>
          )}
          <div className="actions">
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
