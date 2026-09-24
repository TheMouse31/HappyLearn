import { Navigate } from "react-router-dom";
import { CreditCard, Home, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub parent — chaque tuile ouvre une page dédiée. */
export function ParentDashboardScreen() {
  const { role, teacher, switchAdultRole } = useSession();
  if (role !== "parent") {
    return <Navigate to="/connexion/parent" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/parent" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Tableau de bord" homeTo="/espace-parent" backTo="/">
      <div className="dedicated-page hub-page">
        <HubTiles
          title="Espace parent"
          lead="Choisis une section pour continuer."
          tiles={[
            {
              to: "/espace-parent/foyer",
              label: "Mon foyer",
              description: "Enfants, code foyer et séances",
              icon: Home,
            },
            {
              to: "/abonnement",
              label: "Abonnement",
              description: "Payer ou gérer Premium famille",
              icon: CreditCard,
            },
            {
              to: "/espace-professeur",
              label: "Espace enseignant",
              description: "Même e-mail — classes et sessions",
              icon: Users,
              onNavigate: async () => {
                await switchAdultRole("enseignant");
              },
            },
          ]}
        />
      </div>
    </Shell>
  );
}
