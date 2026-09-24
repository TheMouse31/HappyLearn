import { Link, useNavigate } from "react-router-dom";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";

function continuePath(role: string | null, premiumActive: boolean): string | null {
  if (role === "eleve") return "/accueil";
  if (role === "parent") return premiumActive ? "/espace-parent" : "/abonnement";
  if (role === "enseignant") return premiumActive ? "/espace-professeur" : "/abonnement";
  if (role === "admin") return "/espace-admin";
  return null;
}

function HomeBody() {
  const navigate = useNavigate();
  const { role, premiumActive, logout } = useSession();
  const continueTo = continuePath(role, premiumActive);

  return (
    <div className="hl-home">
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
            <div className="hl-hero-cta">
              <Link className="primary hl-cta" to="/connexion">
                Se connecter
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
        <div className="hl-how-head">
          <p className="hl-section-kicker">Simple comme 1, 2, 3</p>
          <h2>Comment ça marche</h2>
        </div>
        <ol className="hl-how-steps">
          <li>
            <span className="hl-how-num" aria-hidden="true">
              1
            </span>
            <strong>Connecte-toi</strong>
            <span>Élève, parent ou professeur.</span>
          </li>
          <li>
            <span className="hl-how-num" aria-hidden="true">
              2
            </span>
            <strong>Choisis une compétence</strong>
            <span>Puis une mission pertinente — Néo t’accompagne.</span>
          </li>
          <li>
            <span className="hl-how-num" aria-hidden="true">
              3
            </span>
            <strong>Progresse</strong>
            <span>Sans note ni classement.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}

export function HomePage() {
  return (
    <PublicLayout fullBleed>
      <HomeBody />
    </PublicLayout>
  );
}
