import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { HomePage } from "./screens/HomePage";
import { ConnexionScreen } from "./screens/ConnexionScreen";
import { EleveLoginScreen } from "./screens/EleveLoginScreen";
import { TeacherLoginScreen } from "./screens/TeacherLoginScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { NicknameScreen } from "./screens/NicknameScreen";
import { CourseScreen } from "./screens/CourseScreen";
import { PresentationScreen } from "./screens/PresentationScreen";
import { UniverseScreen } from "./screens/UniverseScreen";
import { MaterialScreen } from "./screens/MaterialScreen";
import { ReadyScreen } from "./screens/ReadyScreen";
import { MissionScreen } from "./screens/MissionScreen";
import { RewardScreen } from "./screens/RewardScreen";
import { TeacherSpaceScreen } from "./screens/TeacherSpaceScreen";
import { SessionControlScreen } from "./screens/SessionControlScreen";
import { StudentWaitingScreen } from "./screens/StudentWaitingScreen";
import { useSession } from "./lib/session";

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
        <Route path="/accueil" element={<WelcomeScreen />} />
        <Route path="/prenom" element={<NicknameScreen />} />
        <Route path="/classe" element={<CourseScreen />} />
        <Route path="/seance" element={<PresentationScreen />} />
        <Route path="/univers" element={<UniverseScreen />} />
        <Route path="/materiel" element={<MaterialScreen />} />
        <Route path="/pret" element={<ReadyScreen />} />
        <Route path="/mission" element={<MissionScreen />} />
        <Route path="/recompense" element={<RewardScreen />} />
        <Route path="/espace-professeur" element={<TeacherSpaceScreen />} />
        <Route path="/espace-professeur/session" element={<SessionControlScreen />} />
        <Route path="/salle-attente" element={<StudentWaitingScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LockedGate>
  );
}
