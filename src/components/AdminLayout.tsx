import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  Image,
  LayoutDashboard,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Shell } from "./Shell";
import { useSession } from "../lib/session";

export type AdminSectionId = "overview" | "missions" | "illustrations" | "admins" | "grants";

type AdminNavItem = {
  id: AdminSectionId;
  to: string;
  label: string;
  stepLabel: string;
  icon: LucideIcon;
  end?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    id: "overview",
    to: "/espace-admin",
    label: "Vue d’ensemble",
    stepLabel: "Vue d’ensemble",
    icon: LayoutDashboard,
    end: true,
  },
  {
    id: "missions",
    to: "/espace-admin/missions",
    label: "Missions",
    stepLabel: "Missions",
    icon: BookOpen,
  },
  {
    id: "illustrations",
    to: "/espace-admin/illustrations",
    label: "Illustrations",
    stepLabel: "Illustrations",
    icon: Image,
  },
  {
    id: "admins",
    to: "/espace-admin/admins",
    label: "Comptes admin",
    stepLabel: "Comptes admin",
    icon: Shield,
  },
  {
    id: "grants",
    to: "/espace-admin/grants",
    label: "Grants Premium",
    stepLabel: "Grants Premium",
    icon: CreditCard,
  },
];

export function adminSectionFromPath(pathname: string): AdminNavItem {
  if (pathname.startsWith("/espace-admin/missions")) {
    return ADMIN_NAV.find((item) => item.id === "missions")!;
  }
  if (pathname.startsWith("/espace-admin/illustrations")) {
    return ADMIN_NAV.find((item) => item.id === "illustrations")!;
  }
  if (pathname.startsWith("/espace-admin/admins")) {
    return ADMIN_NAV.find((item) => item.id === "admins")!;
  }
  if (pathname.startsWith("/espace-admin/grants")) {
    return ADMIN_NAV.find((item) => item.id === "grants")!;
  }
  return ADMIN_NAV.find((item) => item.id === "overview")!;
}

/** Shell + sidebar persistante — contenu via Outlet (sans bandeau page). */
export function AdminLayout() {
  const { role, teacher } = useSession();
  const { pathname } = useLocation();
  const section = adminSectionFromPath(pathname);

  if (role !== "admin" || !teacher?.isAdmin) {
    return <Navigate to="/connexion/enseignant" replace />;
  }

  return (
    <Shell brand="Happy Learn" stepLabel={section.stepLabel} homeTo="/espace-admin">
      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Navigation administration">
          <nav className="admin-sidebar-nav">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-sidebar-link${isActive ? " is-active" : ""}`
                  }
                >
                  <Icon size={18} strokeWidth={2.25} aria-hidden />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          <div className="admin-sidebar-footer">
            <NavLink to="/espace-professeur/classe" className="admin-sidebar-link is-muted">
              <GraduationCap size={18} strokeWidth={2.25} aria-hidden />
              <span>Espace enseignant</span>
            </NavLink>
            <p className="admin-sidebar-email" title={teacher.email}>
              {teacher.email}
            </p>
          </div>
        </aside>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </Shell>
  );
}
