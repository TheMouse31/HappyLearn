import { Navigate } from "react-router-dom";
import { CreditCard, Play, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub enseignant — tuiles vers pages dédiées (disposition RetroVault). */
export function TeacherDashboardScreen() {
  const { role, teacher } = useSession();
  if (role !== "enseignant" && role !== "admin") {
    return <Navigate to="/connexion/enseignant" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/enseignant" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Espace enseignant" homeTo="/espace-professeur" backTo="/">
      <HubTiles
        title="Tableau de bord"
        lead="Accède rapidement à ta classe, aux sessions live et à l’abonnement."
        tiles={[
          {
            to: "/espace-professeur/classe",
            label: "Ma classe",
            description: "Suivi, programme et élèves",
            icon: Users,
          },
          {
            to: "/espace-professeur/session",
            label: "Session live",
            description: "Piloter une séance en classe",
            icon: Play,
          },
          {
            to: "/abonnement",
            label: "Abonnement",
            description: "Offre Premium Happy Learn",
            icon: CreditCard,
          },
        ]}
      />
    </Shell>
  );
}
