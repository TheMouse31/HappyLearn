import { Navigate } from "react-router-dom";
import { CreditCard, Image, Shield, Sparkles, Users } from "lucide-react";
import { HubTiles } from "../components/HubTiles";
import { Shell } from "../components/Shell";
import { useSession } from "../lib/session";

/** Hub admin — tuiles vers pages dédiées (disposition RetroVault). */
export function AdminDashboardScreen() {
  const { role, teacher } = useSession();
  if (role !== "admin") {
    return <Navigate to="/connexion/enseignant" replace />;
  }
  if (!teacher) return <Navigate to="/connexion/enseignant" replace />;

  return (
    <Shell brand="Happy Learn" stepLabel="Administration" homeTo="/espace-admin" backTo="/">
      <HubTiles
        title="Tableau de bord"
        lead="Raccourcis vers les outils d’administration Happy Learn."
        tiles={[
          {
            to: "/espace-admin/panel?tab=overview",
            label: "Vue d’ensemble",
            description: "Stats et activité",
            icon: Sparkles,
          },
          {
            to: "/espace-admin/panel?tab=missions",
            label: "Missions",
            description: "Studio pédagogique",
            icon: Shield,
          },
          {
            to: "/espace-admin/panel?tab=illustrations",
            label: "Illustrations",
            description: "Bibliothèque visuelle",
            icon: Image,
          },
          {
            to: "/espace-admin/panel?tab=admins",
            label: "Admins",
            description: "Comptes administrateurs",
            icon: Users,
          },
          {
            to: "/espace-admin/panel?tab=abonnements",
            label: "Abonnements",
            description: "Grants Premium",
            icon: CreditCard,
          },
          {
            to: "/espace-professeur",
            label: "Espace enseignant",
            description: "Suivi de classe",
            icon: Users,
          },
        ]}
      />
    </Shell>
  );
}
