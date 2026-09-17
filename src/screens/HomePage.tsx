import { Link, useNavigate } from "react-router-dom";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";

export function HomePage() {
  const navigate = useNavigate();
  const { role } = useSession();
  const continueTo =
    role === "eleve" ? "/accueil" : role === "enseignant" ? "/espace-professeur" : null;

  return (
    <PublicLayout>
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
              <Link className="text-link" to="/connexion">
                Changer de compte
              </Link>
            </div>
          ) : (
            <div className="role-card-grid" role="group" aria-label="Qui es-tu ?">
              <Link className="role-card" to="/connexion/eleve">
                <span className="role-card-label">Je suis un élève</span>
                <span className="role-card-hint">Prénom · école ou maison · pas d’e-mail</span>
              </Link>
              <Link className="role-card role-card-teacher" to="/connexion/enseignant">
                <span className="role-card-label">Je suis professeur</span>
                <span className="role-card-hint">E-mail · classes · suivi des élèves</span>
              </Link>
            </div>
          )}
          <p className="home-note">
            Premier parcours disponible aujourd’hui : mathématiques CM2. D’autres matières arrivent.
          </p>
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
            <span>Élève avec un prénom, ou professeur avec un e-mail.</span>
          </li>
          <li>
            <strong>Pars en mission avec Néo</strong>
            <span>Univers, indices et progression à ton rythme.</span>
          </li>
          <li>
            <strong>Le prof suit la classe</strong>
            <span>Code classe, séances et réussites — sans classement.</span>
          </li>
        </ol>
      </section>
    </PublicLayout>
  );
}
