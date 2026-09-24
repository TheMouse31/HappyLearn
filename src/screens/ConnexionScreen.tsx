import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Neo } from "../components/Neo";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";

export function ConnexionScreen() {
  const navigate = useNavigate();
  const { role, premiumActive } = useSession();

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "parent") {
      navigate(premiumActive ? "/espace-parent" : "/abonnement", { replace: true });
    }
    if (role === "enseignant") {
      navigate(premiumActive ? "/espace-professeur" : "/abonnement", { replace: true });
    }
    if (role === "admin") navigate("/espace-admin", { replace: true });
  }, [role, premiumActive, navigate]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "parent") {
    return <Navigate to={premiumActive ? "/espace-parent" : "/abonnement"} replace />;
  }
  if (role === "enseignant") {
    return <Navigate to={premiumActive ? "/espace-professeur" : "/abonnement"} replace />;
  }
  if (role === "admin") return <Navigate to="/espace-admin" replace />;

  return (
    <PublicLayout fullBleed>
      <section className="connexion-hub" aria-labelledby="connexion-title">
        <div className="connexion-hub-glow" aria-hidden="true" />
        <div className="connexion-hub-copy">
          <p className="connexion-hub-brand">Happy Learn</p>
          <h1 id="connexion-title">Qui es-tu ?</h1>
          <p className="connexion-hub-lead" data-listen>
            École ou maison — un seul chemin pour commencer.
          </p>
          <div className="connexion-role-list" role="group" aria-label="Qui es-tu ?">
            <Link className="connexion-role" to="/connexion/eleve">
              <span className="connexion-role-label">Élève</span>
              <span className="connexion-role-hint">École ou maison</span>
            </Link>
            <Link className="connexion-role" to="/connexion/parent">
              <span className="connexion-role-label">Parent</span>
              <span className="connexion-role-hint">Même e-mail — tu peux aussi ouvrir l’espace prof</span>
            </Link>
            <Link className="connexion-role connexion-role-teacher" to="/connexion/enseignant">
              <span className="connexion-role-label">Professeur</span>
              <span className="connexion-role-hint">Même e-mail — tu peux aussi ouvrir le foyer</span>
            </Link>
          </div>
        </div>
        <aside className="connexion-hub-visual" aria-hidden="true">
          <div className="connexion-hub-neo">
            <p className="bubble">Dis-moi qui tu es, on démarre.</p>
            <Neo pose="guide" />
          </div>
        </aside>
      </section>
    </PublicLayout>
  );
}
