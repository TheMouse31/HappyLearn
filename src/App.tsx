import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { hasCompetenceNav } from "./data/competenceNav";
import { useSession } from "./lib/session";
import { HomePage } from "./screens/HomePage";
import { ConnexionScreen } from "./screens/ConnexionScreen";
import { EleveLoginScreen } from "./screens/EleveLoginScreen";
import { TeacherLoginScreen } from "./screens/TeacherLoginScreen";
import { ParentLoginScreen } from "./screens/ParentLoginScreen";
import { ParentSpaceScreen } from "./screens/ParentSpaceScreen";
import { ParentDashboardScreen } from "./screens/ParentDashboardScreen";
import { PaywallScreen } from "./screens/PaywallScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { NicknameScreen } from "./screens/NicknameScreen";
import { CourseScreen } from "./screens/CourseScreen";
import { CompetenceScreen } from "./screens/CompetenceScreen";
import { MissionPickScreen } from "./screens/MissionPickScreen";
import { PresentationScreen } from "./screens/PresentationScreen";
import { UniverseScreen } from "./screens/UniverseScreen";
import { MaterialScreen } from "./screens/MaterialScreen";
import { ReadyScreen } from "./screens/ReadyScreen";
import { MissionScreen } from "./screens/MissionScreen";
import { RewardScreen } from "./screens/RewardScreen";
import { TeacherSpaceScreen } from "./screens/TeacherSpaceScreen";
import { TeacherDashboardScreen } from "./screens/TeacherDashboardScreen";
import { SessionControlScreen } from "./screens/SessionControlScreen";
import { MissionEditorScreen } from "./screens/MissionEditorScreen";
import { AdminSpaceScreen } from "./screens/AdminSpaceScreen";
import { AdminPanelRedirect } from "./screens/AdminPanelRedirect";
import { AdminLayout } from "./components/AdminLayout";
import { StudentWaitingScreen } from "./screens/StudentWaitingScreen";

const LOCKED_ALLOWED = new Set(["/salle-attente", "/mission"]);

function LockedGate({ children }: { children: ReactNode }) {
  const { lockedSession, kickedFromSession } = useSession();
  const { pathname } = useLocation();
  if (kickedFromSession && pathname !== "/salle-attente") {
    return <Navigate to="/salle-attente" replace />;
  }
  if (lockedSession && !LOCKED_ALLOWED.has(pathname)) {
    return <Navigate to="/salle-attente" replace />;
  }
  return children;
}

function PremiumGate({ children }: { children: ReactNode }) {
  const { role, premiumActive } = useSession();
  if ((role === "enseignant" || role === "parent") && !premiumActive) {
    return <Navigate to="/abonnement" replace />;
  }
  return children;
}

function SeanceRedirect() {
  const { grade, subject } = useSession();
  if (hasCompetenceNav(grade, subject)) return <Navigate to="/competence" replace />;
  return <PresentationScreen />;
}

function UniversRedirect() {
  const { grade, subject, competenceId } = useSession();
  if (hasCompetenceNav(grade, subject)) {
    return <Navigate to={competenceId ? "/missions" : "/competence"} replace />;
  }
  return <UniverseScreen />;
}

export default function App() {
  const { ready } = useSession();
  if (!ready) {
    return (
      <div className="app-shell">
        <p>Préparation de Happy Learn…</p>
      </div>
    );
  }

  return (
    <LockedGate>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<ConnexionScreen />} />
        <Route path="/connexion/eleve" element={<EleveLoginScreen />} />
        <Route path="/connexion/enseignant" element={<TeacherLoginScreen />} />
        <Route path="/connexion/parent" element={<ParentLoginScreen />} />
        <Route path="/abonnement" element={<PaywallScreen />} />
        <Route
          path="/espace-parent"
          element={
            <PremiumGate>
              <ParentDashboardScreen />
            </PremiumGate>
          }
        />
        <Route
          path="/espace-parent/foyer"
          element={
            <PremiumGate>
              <ParentSpaceScreen />
            </PremiumGate>
          }
        />
        <Route path="/accueil" element={<WelcomeScreen />} />
        <Route path="/prenom" element={<NicknameScreen />} />
        <Route path="/classe" element={<CourseScreen />} />
        <Route path="/competence" element={<CompetenceScreen />} />
        <Route path="/missions" element={<MissionPickScreen />} />
        <Route path="/seance" element={<SeanceRedirect />} />
        <Route path="/univers" element={<UniversRedirect />} />
        <Route path="/materiel" element={<MaterialScreen />} />
        <Route path="/pret" element={<ReadyScreen />} />
        <Route path="/mission" element={<MissionScreen />} />
        <Route path="/recompense" element={<RewardScreen />} />
        <Route
          path="/espace-professeur"
          element={
            <PremiumGate>
              <TeacherDashboardScreen />
            </PremiumGate>
          }
        />
        <Route
          path="/espace-professeur/classe"
          element={
            <PremiumGate>
              <TeacherSpaceScreen />
            </PremiumGate>
          }
        />
        <Route
          path="/espace-professeur/session"
          element={
            <PremiumGate>
              <SessionControlScreen />
            </PremiumGate>
          }
        />
        <Route path="/espace-professeur/missions" element={<Navigate to="/espace-admin/missions" replace />} />
        <Route path="/espace-admin" element={<AdminLayout />}>
          <Route index element={<AdminSpaceScreen />} />
          <Route path="missions" element={<MissionEditorScreen />} />
          <Route path="illustrations" element={<AdminSpaceScreen />} />
          <Route path="admins" element={<AdminSpaceScreen />} />
          <Route path="grants" element={<AdminSpaceScreen />} />
        </Route>
        <Route path="/espace-admin/panel" element={<AdminPanelRedirect />} />
        <Route path="/salle-attente" element={<StudentWaitingScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LockedGate>
  );
}
