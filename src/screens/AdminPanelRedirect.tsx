import { Navigate, useSearchParams } from "react-router-dom";

/** Anciennes URLs `/espace-admin/panel?tab=` → chemins canoniques. */
export function AdminPanelRedirect() {
  const [params] = useSearchParams();
  const tab = params.get("tab");
  if (tab === "missions") return <Navigate to="/espace-admin/missions" replace />;
  if (tab === "illustrations") return <Navigate to="/espace-admin/illustrations" replace />;
  if (tab === "admins") return <Navigate to="/espace-admin/admins" replace />;
  if (tab === "abonnements") return <Navigate to="/espace-admin/grants" replace />;
  return <Navigate to="/espace-admin" replace />;
}
