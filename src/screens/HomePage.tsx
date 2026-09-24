import { Link, useNavigate } from "react-router-dom";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";
import { useSkin } from "../lib/useSkin";

function continuePath(
  role: string | null,
  premiumActive: boolean,
): string | null {
  if (role === "eleve") return "/accueil";
  if (role === "parent") return premiumActive ? "/espace-parent" : "/abonnement";
  if (role === "enseignant") return premiumActive ? "/espace-professeur" : "/abonnement";
  if (role === "admin") return "/espace-admin";
  return null;
}

function ClassicHomeBody() {
  const navigate = useNavigate();
  const { role, premiumActive, logout } = useSession();
  const continueTo = continuePath(role, premiumActive);

  return (
    <>
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
    </>
  );
}

function NewFrontHomeBody() {
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
  const skin = useSkin();
  return (
    <PublicLayout fullBleed={skin === "newfront"}>
      {skin === "newfront" ? <NewFrontHomeBody /> : <ClassicHomeBody />}
    </PublicLayout>
  );
}
