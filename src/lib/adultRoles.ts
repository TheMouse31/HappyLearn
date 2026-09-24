export type AdultRole = "parent" | "enseignant" | "admin";

export function normalizeRoles(
  roles: readonly string[] | null | undefined,
  fallback?: AdultRole | null,
): AdultRole[] {
  const out: AdultRole[] = [];
  for (const r of roles ?? []) {
    if ((r === "parent" || r === "enseignant" || r === "admin") && !out.includes(r)) {
      out.push(r);
    }
  }
  if (out.length === 0 && fallback) out.push(fallback);
  return out;
}

export function mergeRole(roles: AdultRole[], next: AdultRole): AdultRole[] {
  if (roles.includes(next)) return roles;
  return [...roles, next];
}

export function pickActiveRole(
  roles: AdultRole[],
  preferred: AdultRole | null | undefined,
  adminPreferred = false,
): AdultRole {
  if (adminPreferred && roles.includes("admin")) return "admin";
  if (preferred && roles.includes(preferred)) return preferred;
  if (roles.includes("admin")) return "admin";
  if (roles.includes("enseignant")) return "enseignant";
  if (roles.includes("parent")) return "parent";
  return preferred ?? "enseignant";
}
