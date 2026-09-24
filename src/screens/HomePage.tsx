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

/** Ancienne home (layout classique) — préférée à la home NewFront full-bleed. */
function ClassicHomeBody() {
  const navigate = useNavigate();
  const { role, premiumActive, logout } = useSession();
  const continueTo = continuePath(role, premiumActive);

  return (
    <div className="classic-home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-brand">Happy Learn</p>
          <h1>Les apprentissages du primaire, racontés comme une mission</h1>
          <p className="lead" data-listen>
            Du CP au CM2, toutes les matières. Les élèves progressent avec Néo. Les adultes suivent sans note ni
            classement.
          </p>
          {continueTo ? (
            <div className="actions home-actions">
              <button type="button" className="primary" onClick={() => navigate(continueTo)}>
                Continuer
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  void logout().then(() => navigate("/connexion"));
                }}
              >
                Changer de compte
              </button>
            </div>
          ) : (
            <div className="actions home-actions">
              <Link className="primary" to="/connexion">
                Se connecter
              </Link>
            </div>
          )}
        </div>
        <aside className="mascot-stage home-mascot">
          <p className="bubble">Prêt pour une mission ? Connecte-toi pour commencer.</p>
          <Neo pose="guide" />
        </aside>
      </section>

      <section className="home-how" id="comment-ca-marche">
        <h2>Comment ça marche</h2>
        <ol className="how-steps">
          <li>
            <strong>Connecte-toi</strong>
            <span>Élève, parent ou professeur — une seule porte d’entrée.</span>
          </li>
          <li>
            <strong>Choisis une compétence</strong>
            <span>Puis une mission dans un univers qui aide vraiment à comprendre.</span>
          </li>
          <li>
            <strong>Progresse avec Néo</strong>
            <span>Sans note ni classement — juste apprendre.</span>
          </li>
        </ol>
      </section>
    </div>
  );
}

export function HomePage() {
  return (
    <PublicLayout fullBleed>
      <ClassicHomeBody />
    </PublicLayout>
  );
}
