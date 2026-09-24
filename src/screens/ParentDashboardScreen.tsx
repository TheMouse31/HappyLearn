import { Navigate } from "react-router-dom";
import { CreditCard, Home, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub parent — tuiles vers pages dédiées (disposition RetroVault). */
export function ParentDashboardScreen() {
  const { role, teacher, switchAdultRole } = useSession();
  if (role !== "parent") {
    return <Navigate to="/connexion/parent" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/parent" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Espace parent" homeTo="/espace-parent">
      <HubTiles
        title="Tableau de bord"
        lead="Gère ton foyer, l’abonnement et le suivi des enfants."
        tiles={[
          {
            to: "/espace-parent/foyer",
            label: "Mon foyer",
            description: "Enfants, code et séances",
            icon: Home,
          },
          {
            to: "/abonnement",
            label: "Abonnement",
            description: "Premium famille",
            icon: CreditCard,
          },
          {
            to: "/espace-professeur",
            label: "Espace enseignant",
            description: "Même e-mail — bascule de rôle",
            icon: Users,
            onNavigate: () => void switchAdultRole("enseignant"),
          },
        ]}
      />
    </Shell>
  );
}
