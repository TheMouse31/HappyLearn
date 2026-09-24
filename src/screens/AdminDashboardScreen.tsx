import { Navigate } from "react-router-dom";
import { BookOpen, CreditCard, Image, LayoutDashboard, Shield, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub admin — chaque tuile ouvre une page dédiée. */
export function AdminDashboardScreen() {
  const { role, teacher } = useSession();
  if (role !== "admin") {
    return <Navigate to="/connexion/enseignant" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/enseignant" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Tableau de bord" homeTo="/espace-admin" backTo="/">
      <div className="dedicated-page hub-page">
        <HubTiles
          title="Administration"
          lead="Choisis un outil pour continuer."
          tiles={[
            {
              to: "/espace-admin/panel?tab=overview",
              label: "Vue d’ensemble",
              description: "Stats et activité plateforme",
              icon: LayoutDashboard,
            },
            {
              to: "/espace-admin/missions",
              label: "Studio missions",
              description: "Créer et éditer les missions",
              icon: BookOpen,
            },
            {
              to: "/espace-admin/panel?tab=illustrations",
              label: "Illustrations",
              description: "Bibliothèque visuelle Néo",
              icon: Image,
            },
            {
              to: "/espace-admin/panel?tab=admins",
              label: "Comptes admin",
              description: "Gérer les administrateurs",
              icon: Shield,
            },
            {
              to: "/espace-admin/panel?tab=abonnements",
              label: "Grants Premium",
              description: "Accorder un abonnement",
              icon: CreditCard,
            },
            {
              to: "/espace-professeur/classe",
              label: "Espace enseignant",
              description: "Suivi de classe",
              icon: Users,
            },
          ]}
        />
      </div>
    </Shell>
  );
}
