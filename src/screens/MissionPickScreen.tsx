import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Neo } from "../components/Neo";
import { Shell } from "../components/Shell";
import { isCoursePlayable } from "../data/catalog";
import { findCompetence } from "../data/competenceNav";
import { UNIVERSES } from "../data/universes";
import { useSession } from "../lib/session";

export function MissionPickScreen() {
  const navigate = useNavigate();
  const { prenom, role, grade, subject, competenceId, missionId, universe, pickMissionOffer } =
    useSession();
  const competence = findCompetence(competenceId);

  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;
  if (!prenom) return <Navigate to="/connexion/eleve" replace />;
  if (!isCoursePlayable(grade, subject)) return <Navigate to="/classe" replace />;
  if (!competence) return <Navigate to="/competence" replace />;

  return (
    <Shell variant="eleve" brand="Happy Learn" backTo="/competence" showSetupSteps>
      <div className="split mission-pick-layout">
        <aside className="mascot-stage">
          <p className="bubble">
            Voici {competence.offers.length} missions pour « {competence.label} ». Choisis ton aventure.
          </p>
          <Neo pose="guide" />
        </aside>
        <section>
          <span className="kicker">{competence.label}</span>
          <h1>Quelle mission ?</h1>
          <p className="lead" data-listen>
            Chaque mission a son univers. Seulement ceux qui aident vraiment à comprendre.
          </p>
          <div className="mission-offer-grid" role="listbox" aria-label="Missions proposées">
            {competence.offers.map((offer) => {
              const uni = UNIVERSES[offer.universe];
              const selected = missionId === offer.missionId && universe === offer.universe;
              return (
                <button
                  key={`${offer.missionId}-${offer.universe}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={!offer.available}
                  className={`mission-offer-card ${selected ? "is-selected" : ""} ${
                    !offer.available ? "is-soon" : ""
                  }`}
                  onClick={() => {
                    if (!offer.available) return;
                    pickMissionOffer(offer.missionId, offer.universe);
                    navigate("/materiel");
                  }}
                >
                  <span className="mission-offer-icon" aria-hidden="true">
                    {uni.icon}
                  </span>
                  <span className="mission-offer-body">
                    <strong>{offer.title}</strong>
                    <small>
                      {uni.label}
                      {!offer.available ? " · bientôt" : ""}
                    </small>
                    <span className="mission-offer-blurb">{offer.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="actions">
            <Button type="button" onClick={() => navigate("/competence")}>
              Autre compétence
            </Button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
