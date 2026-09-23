import { Link, useNavigate } from "react-router-dom";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";
import { useSkin } from "../lib/useSkin";

function ClassicHomeBody() {
  const navigate = useNavigate();
  const { role, premiumActive, logout } = useSession();
  const continueTo =
    role === "eleve"
      ? "/accueil"
      : role === "parent"
        ? premiumActive
          ? "/espace-parent"
          : "/abonnement"
        : role === "enseignant"
          ? premiumActive
            ? "/espace-professeur"
            : "/abonnement"
          : role === "admin"
            ? "/espace-admin"
            : null;

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-brand">Happy Learn</p>
          <h1>Les apprentissages du primaire, racontés comme une mission</h1>
          <p className="lead" data-listen>
            Du CP au CM2, toutes les matières. Les élèves progressent avec Néo dans une aventure. Les professeurs suivent
            la classe, sans note ni classement.
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
            <div className="role-card-grid" role="group" aria-label="Qui es-tu ?">
              <Link className="role-card" to="/connexion/eleve">
                <span className="role-card-label">Je suis un élève</span>
                <span className="role-card-hint">Prénom · école ou maison · pas d’e-mail</span>
              </Link>
              <Link className="role-card" to="/connexion/parent">
                <span className="role-card-label">Je suis parent</span>
                <span className="role-card-hint">Foyer · enfants · abonnement</span>
              </Link>
              <Link className="role-card role-card-teacher" to="/connexion/enseignant">
                <span className="role-card-label">Je suis professeur</span>
                <span className="role-card-hint">E-mail · classes · suivi des élèves</span>
              </Link>
            </div>
          )}
        </div>
        <aside className="mascot-stage home-mascot">
          <p className="bubble">Prêt pour une mission ? Choisis qui tu es pour commencer.</p>
          <Neo pose="guide" />
        </aside>
      </section>

      <section className="home-how" id="comment-ca-marche">
        <h2>Comment ça marche</h2>
        <ol className="how-steps">
          <li>
            <strong>Choisis qui tu es</strong>
            <span>Élève, parent à la maison, ou professeur à l’école.</span>
          </li>
          <li>
            <strong>Pars en mission avec Néo</strong>
            <span>Univers, indices et progression à ton rythme.</span>
          </li>
          <li>
            <strong>Le prof ou le parent suit</strong>
            <span>Sessions live, foyer maison et réussites — sans classement.</span>
          </li>
        </ol>
      </section>
    </>
  );
}

function NewFrontHomeBody() {
  const navigate = useNavigate();
  const { role, premiumActive, logout } = useSession();
  const continueTo =
    role === "eleve"
      ? "/accueil"
      : role === "parent"
        ? premiumActive
          ? "/espace-parent"
          : "/abonnement"
        : role === "enseignant"
          ? premiumActive
            ? "/espace-professeur"
            : "/abonnement"
          : role === "admin"
            ? "/espace-admin"
            : null;

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
            <div className="hl-hero-cta" role="group" aria-label="Qui es-tu ?">
              <Link className="primary hl-cta" to="/connexion/eleve">
                Je suis élève
              </Link>
              <Link className="ghost-btn hl-cta-secondary" to="/connexion/parent">
                Je suis parent
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
        <div className="hl-how-head">
          <p className="hl-section-kicker">Simple comme 1, 2, 3</p>
          <h2>Comment ça marche</h2>
        </div>
        <ol className="hl-how-steps">
          <li>
            <span className="hl-how-num" aria-hidden="true">
              1
            </span>
            <strong>Choisis ton rôle</strong>
            <span>Élève, parent à la maison, ou professeur à l’école.</span>
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
            <strong>Suivi famille ou classe</strong>
            <span>Session live, foyer maison et programme — sans classement.</span>
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
