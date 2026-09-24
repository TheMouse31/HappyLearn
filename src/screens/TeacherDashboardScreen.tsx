import { Navigate } from "react-router-dom";
import { CreditCard, Home, Play, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub enseignant — chaque tuile ouvre une page dédiée. */
export function TeacherDashboardScreen() {
  const { role, teacher, switchAdultRole } = useSession();
  if (role !== "enseignant" && role !== "admin") {
    return <Navigate to="/connexion/enseignant" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/enseignant" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Tableau de bord" homeTo="/espace-professeur" backTo="/">
      <div className="dedicated-page hub-page">
        <HubTiles
          title="Espace enseignant"
          lead="Choisis une section pour continuer."
          tiles={[
            {
              to: "/espace-professeur/classe",
              label: "Ma classe",
              description: "Élèves, programme et suivi",
              icon: Users,
            },
            {
              to: "/espace-professeur/session",
              label: "Session live",
              description: "Lancer et piloter une séance",
              icon: Play,
            },
            {
              to: "/abonnement",
              label: "Abonnement",
              description: "Voir ou gérer Premium",
              icon: CreditCard,
            },
            {
              to: "/espace-parent",
              label: "Mon foyer",
              description: "Espace parent — même e-mail",
              icon: Home,
              onNavigate: async () => {
                await switchAdultRole("parent");
              },
            },
          ]}
        />
      </div>
    </Shell>
  );
}
