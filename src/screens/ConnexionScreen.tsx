import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PublicLayout } from "../components/PublicLayout";
import { useSession } from "../lib/session";

export function ConnexionScreen() {
  const navigate = useNavigate();
  const { role } = useSession();

  useEffect(() => {
    if (role === "eleve") navigate("/accueil", { replace: true });
    if (role === "enseignant") navigate("/espace-professeur", { replace: true });
  }, [role, navigate]);

  if (role === "eleve") return <Navigate to="/accueil" replace />;
  if (role === "enseignant") return <Navigate to="/espace-professeur" replace />;

  return (
    <PublicLayout>
      <section className="login-page">
        <span className="kicker">Connexion</span>
        <h1>Qui es-tu ?</h1>
        <p className="lead" data-listen>
          Les élèves n’utilisent pas d’e-mail. Les professeurs et les parents se connectent avec un e-mail.
        </p>
        <div className="role-card-grid" role="group" aria-label="Qui es-tu ?">
          <Link className="role-card" to="/connexion/eleve">
            <span className="role-card-label">Je suis un élève</span>
            <span className="role-card-hint">École ou à la maison · prénom, pas d’e-mail</span>
          </Link>
          <Link className="role-card role-card-teacher" to="/connexion/enseignant">
            <span className="role-card-label">Je suis professeur ou parent</span>
            <span className="role-card-hint">E-mail, mot de passe ou lien magique</span>
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
