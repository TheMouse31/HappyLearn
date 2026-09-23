import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
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
    <PublicLayout>
      <section className="login-page">
        <span className="kicker">Connexion</span>
        <h1>Qui es-tu ?</h1>
        <p className="lead" data-listen>
          Deux modes : à l’école avec ton professeur, ou à la maison avec ta famille.
        </p>
        <div className="role-card-grid" role="group" aria-label="Qui es-tu ?">
          <Link className="role-card" to="/connexion/eleve">
            <span className="role-card-label">Je suis un élève</span>
            <span className="role-card-hint">École (code session) ou maison (code foyer + PIN)</span>
          </Link>
          <Link className="role-card" to="/connexion/parent">
            <span className="role-card-label">Je suis parent</span>
            <span className="role-card-hint">Foyer, enfants, abonnement, stats</span>
          </Link>
          <Link className="role-card role-card-teacher" to="/connexion/enseignant">
            <span className="role-card-label">Je suis professeur</span>
            <span className="role-card-hint">E-mail, Google, ou lien magique</span>
          </Link>
        </div>
        <p className="actions">
          <Link className="text-link" to="/">
            ← Retour à l’accueil
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
