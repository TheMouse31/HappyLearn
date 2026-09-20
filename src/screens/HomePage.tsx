import { Link, useNavigate } from "react-router-dom";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";

export function HomePage() {
  const navigate = useNavigate();
  const { role, logout } = useSession();
  const continueTo =
    role === "eleve" ? "/accueil" : role === "enseignant" ? "/espace-professeur" : null;

  return (
    <PublicLayout fullBleed>
      <section className="hl-hero" aria-labelledby="hl-hero-title">
        <div className="hl-hero-glow" aria-hidden="true" />
        <div className="hl-hero-copy">
          <p className="hl-hero-brand">Happy Learn</p>
          <h1 id="hl-hero-title">Apprendre comme une mission</h1>
          <p className="hl-hero-lead" data-listen>
            Du CP au CM2, avec Néo. Sans note, sans classement — juste progresser.
          </p>
          {continueTo ? (
            <div className="hl-hero-cta">
              <button type="button" className="primary hl-cta" onClick={() => navigate(continueTo)}>
                Continuer ma session
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  void logout().then(() => navigate("/connexion"));
                }}
              >
                Changer de compte
              </button>
            </div>
          ) : (
            <div className="hl-hero-cta" role="group" aria-label="Qui es-tu ?">
              <Link className="primary hl-cta" to="/connexion/eleve">
                Je suis élève
              </Link>
              <Link className="ghost-btn hl-cta-secondary" to="/connexion/enseignant">
                Je suis professeur
              </Link>
            </div>
          )}
        </div>
        <aside className="hl-hero-visual" aria-hidden="true">
          <div className="hl-hero-neo">
            <Neo pose="guide" />
          </div>
        </aside>
      </section>

      <section className="hl-how" id="comment-ca-marche">
        <p className="hl-section-kicker">Simple comme 1, 2, 3</p>
        <h2>Comment ça marche</h2>
        <ol className="hl-how-steps">
          <li>
            <span className="hl-how-num" aria-hidden="true">
              1
            </span>
            <strong>Choisis ton rôle</strong>
            <span>Élève avec un prénom, ou professeur avec un e-mail.</span>
          </li>
          <li>
            <span className="hl-how-num" aria-hidden="true">
              2
            </span>
            <strong>Pars en mission</strong>
            <span>Univers, indices et étapes claires — Néo t’accompagne.</span>
          </li>
          <li>
            <span className="hl-how-num" aria-hidden="true">
              3
            </span>
            <strong>Le prof pilote</strong>
            <span>Session live, suivi et programme — sans classement.</span>
          </li>
        </ol>
      </section>
    </PublicLayout>
  );
}
