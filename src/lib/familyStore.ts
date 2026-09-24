import type {
  Abonnement,
  AbonnementSource,
  AbonnementStatus,
  AbonnementSubjectType,
  ChildSession,
  EleveFoyer,
  Foyer,
  GradeLevel,
  SubjectSlug,
  UniverseSlug,
  PlayMode,
} from "../data/types";
import { generateClassCode } from "./classCode";
import { hashChildPin } from "./childPin";
import { newId } from "./localKeys";
import { getSupabase } from "./supabase";
import { mergeRole, normalizeRoles } from "./adultRoles";

const LOCAL_FOYERS_KEY = "happy-learn-foyers";
const LOCAL_ELEVES_FOYER_KEY = "happy-learn-eleves-foyer";
const LOCAL_ABONNEMENTS_KEY = "happy-learn-abonnements";
const LOCAL_PIN_HASH_KEY = "happy-learn-eleves-foyer-pins";

/** Comptes « Essayer en local » : ids non-UUID, forcer le stockage navigateur. */
function isLocalSubjectId(id: string): boolean {
  return id.startsWith("local-") || id.startsWith("local-parent-");
}

function useLocalStore(subjectId?: string | null): boolean {
  if (!getSupabase()) return true;
  if (subjectId && isLocalSubjectId(subjectId)) return true;
  if (subjectId && localFoyerById(subjectId)) return true;
  return false;
}

function localFoyerById(foyerId: string): Foyer | undefined {
  return readJson<Foyer[]>(LOCAL_FOYERS_KEY, []).find((f) => f.id === foyerId);
}

function localFoyerByCode(code: string): Foyer | undefined {
  return readJson<Foyer[]>(LOCAL_FOYERS_KEY, []).find((f) => f.code === code.trim().toUpperCase());
}

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "") as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function mapAbonnement(row: Record<string, unknown>): Abonnement {
  return {
    id: String(row.id),
    subjectType: row.subject_type as AbonnementSubjectType,
    subjectId: String(row.subject_id),
    plan: "premium",
    status: (row.status as AbonnementStatus) ?? "active",
    source: (row.source as AbonnementSource) ?? "local",
    stripeCustomerId: (row.stripe_customer_id as string) ?? null,
    stripeSubscriptionId: (row.stripe_subscription_id as string) ?? null,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
    grantedBy: (row.granted_by as string) ?? null,
    grantedNote: (row.granted_note as string) ?? null,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
    updatedAt: (row.updated_at as string) ?? new Date().toISOString(),
  };
}

function mapFoyer(row: Record<string, unknown>): Foyer {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    nom: String(row.nom ?? "Ma famille"),
    code: String(row.code),
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

function mapEleve(row: Record<string, unknown>): EleveFoyer {
  return {
    id: String(row.id),
    foyerId: String(row.foyer_id),
    prenom: String(row.prenom),
    nom: String(row.nom ?? ""),
    niveau: (row.niveau as GradeLevel) ?? null,
    createdAt: (row.created_at as string) ?? new Date().toISOString(),
  };
}

export async function ensureUserProfile(
  userId: string,
  role: "parent" | "enseignant" | "admin",
  displayName: string,
  email?: string,
): Promise<{ active: "parent" | "enseignant" | "admin"; roles: Array<"parent" | "enseignant" | "admin"> }> {
  const client = getSupabase();
  if (!client) return { active: role, roles: [role] };

  const existing = await getUserProfile(userId);
  let roles = normalizeRoles(existing?.roles, existing?.role ?? null);
  roles = mergeRole(roles, role);
  if (role === "admin" || existing?.role === "admin") {
    roles = mergeRole(roles, "admin");
  }
  // Le rôle demandé devient le rôle actif (portail courant).
  const active = role;

  const payload: Record<string, unknown> = {
    user_id: userId,
    role: active,
    display_name: displayName,
    email: email?.trim().toLowerCase() || null,
    roles,
  };

  const { error } = await client.from("profils_utilisateurs").upsert(payload);
  if (error && /roles/i.test(error.message)) {
    // Migration multi-rôles pas encore appliquée : conserver le rôle demandé.
    await client.from("profils_utilisateurs").upsert({
      user_id: userId,
      role: active,
      display_name: displayName,
      email: email?.trim().toLowerCase() || null,
    });
  }

  if (active === "enseignant" || active === "admin" || roles.includes("enseignant") || roles.includes("admin")) {
    await client.from("profils_enseignants").upsert({
      user_id: userId,
      display_name: displayName,
      ...(roles.includes("admin") || active === "admin" ? { is_admin: true } : {}),
    });
  }
  return { active, roles };
}

export async function getUserProfile(
  userId: string,
): Promise<{ role: "parent" | "enseignant" | "admin"; roles: Array<"parent" | "enseignant" | "admin"> } | null> {
  const client = getSupabase();
  if (!client) return null;
  const { data } = await client
    .from("profils_utilisateurs")
    .select("role, roles")
    .eq("user_id", userId)
    .maybeSingle();
  if (data?.role === "parent" || data?.role === "enseignant" || data?.role === "admin") {
    const roles = normalizeRoles(
      Array.isArray(data.roles) ? (data.roles as string[]) : null,
      data.role,
    );
    return { role: data.role, roles };
  }
  const { data: pe } = await client
    .from("profils_enseignants")
    .select("is_admin")
    .eq("user_id", userId)
    .maybeSingle();
  if (pe) {
    const role = pe.is_admin ? "admin" : "enseignant";
    return { role, roles: [role] };
  }
  return null;
}

export async function getUserProfileRole(
  userId: string,
): Promise<"parent" | "enseignant" | "admin" | null> {
  const profile = await getUserProfile(userId);
  return profile?.role ?? null;
}

export async function getUserProfileRoles(
  userId: string,
): Promise<Array<"parent" | "enseignant" | "admin">> {
  const profile = await getUserProfile(userId);
  return profile?.roles ?? [];
}

/** Migre un ancien foyer local-parent-* vers l’id unifié local-{email}. */
export function migrateLocalParentFoyer(email: string, unifiedId: string): void {
  const legacyId = `local-parent-${email.trim().toLowerCase()}`;
  if (legacyId === unifiedId) return;
  const foyers = readJson<Foyer[]>(LOCAL_FOYERS_KEY, []);
  let changed = false;
  for (const f of foyers) {
    if (f.ownerId === legacyId) {
      f.ownerId = unifiedId;
      changed = true;
    }
  }
  if (changed) writeJson(LOCAL_FOYERS_KEY, foyers);
}

export async function ensureFoyer(ownerId: string, nom = "Ma famille"): Promise<Foyer> {
  if (useLocalStore(ownerId)) {
    const foyers = readJson<Foyer[]>(LOCAL_FOYERS_KEY, []);
    const existing = foyers.find((f) => f.ownerId === ownerId);
    if (existing) return existing;
    const created: Foyer = {
      id: newId(),
      ownerId,
      nom,
      code: generateClassCode(),
      createdAt: new Date().toISOString(),
    };
    foyers.push(created);
    writeJson(LOCAL_FOYERS_KEY, foyers);
    return created;
  }

  const client = getSupabase()!;
  const { data: existing } = await client
    .from("foyers")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (existing) return mapFoyer(existing as Record<string, unknown>);

  for (let i = 0; i < 8; i += 1) {
    const code = generateClassCode();
    const { data, error } = await client
      .from("foyers")
      .insert({ owner_id: ownerId, nom, code })
      .select("*")
      .single();
    if (!error && data) return mapFoyer(data as Record<string, unknown>);
  }
  throw new Error("Impossible de créer le foyer.");
}

export async function getFoyerForOwner(ownerId: string): Promise<Foyer | null> {
  if (useLocalStore(ownerId)) {
    return readJson<Foyer[]>(LOCAL_FOYERS_KEY, []).find((f) => f.ownerId === ownerId) ?? null;
  }
  const client = getSupabase()!;
  const { data } = await client.from("foyers").select("*").eq("owner_id", ownerId).maybeSingle();
  return data ? mapFoyer(data as Record<string, unknown>) : null;
}

export async function regenerateFoyerCode(foyerId: string, ownerId: string): Promise<Foyer | null> {
  if (useLocalStore(ownerId) || localFoyerById(foyerId)) {
    const foyers = readJson<Foyer[]>(LOCAL_FOYERS_KEY, []);
    const next = foyers.map((f) =>
      f.id === foyerId && f.ownerId === ownerId ? { ...f, code: generateClassCode() } : f,
    );
    writeJson(LOCAL_FOYERS_KEY, next);
    return next.find((f) => f.id === foyerId) ?? null;
  }
  const client = getSupabase()!;
  for (let i = 0; i < 8; i += 1) {
    const code = generateClassCode();
    const { data, error } = await client
      .from("foyers")
      .update({ code })
      .eq("id", foyerId)
      .eq("owner_id", ownerId)
      .select("*")
      .single();
    if (!error && data) return mapFoyer(data as Record<string, unknown>);
  }
  return null;
}

export async function listElevesFoyer(foyerId: string): Promise<EleveFoyer[]> {
  if (localFoyerById(foyerId) || !getSupabase()) {
    return readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []).filter((e) => e.foyerId === foyerId);
  }
  const client = getSupabase()!;
  const { data, error } = await client
    .from("eleves_foyer")
    .select("id, foyer_id, prenom, nom, niveau, created_at")
    .eq("foyer_id", foyerId)
    .order("prenom");
  if (error || !data) return [];
  return data.map((row) => mapEleve(row as Record<string, unknown>));
}

export async function listElevesByFoyerCode(code: string): Promise<{ foyer: Foyer; eleves: EleveFoyer[] } | null> {
  const normalized = code.trim().toUpperCase();
  const local = localFoyerByCode(normalized);
  if (local) {
    const eleves = await listElevesFoyer(local.id);
    return { foyer: local, eleves };
  }
  const client = getSupabase();
  if (!client) return null;
  const { data: foyerRow } = await client
    .from("foyers")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();
  if (!foyerRow) return null;
  const foyer = mapFoyer(foyerRow as Record<string, unknown>);
  const { data: eleves } = await client.rpc("list_eleves_by_foyer_code", { p_code: normalized });
  return {
    foyer,
    eleves: (eleves ?? []).map((row: Record<string, unknown>) => mapEleve(row)),
  };
}

export async function addEleveFoyer(
  foyerId: string,
  prenom: string,
  nom: string,
  pin: string,
  niveau: GradeLevel | null = null,
): Promise<EleveFoyer | string> {
  const cleanPrenom = prenom.trim().slice(0, 40);
  const cleanNom = nom.trim().slice(0, 40);
  if (!cleanPrenom) return "Indique un prénom.";
  if (!/^\d{4}$/.test(pin.trim())) return "Le code PIN doit contenir 4 chiffres.";

  if (localFoyerById(foyerId) || !getSupabase()) {
    const id = newId();
    const pinHash = await hashChildPin(pin, id);
    const created: EleveFoyer = {
      id,
      foyerId,
      prenom: cleanPrenom,
      nom: cleanNom,
      niveau,
      createdAt: new Date().toISOString(),
    };
    const eleves = readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []);
    eleves.push(created);
    writeJson(LOCAL_ELEVES_FOYER_KEY, eleves);
    const pins = readJson<Record<string, string>>(LOCAL_PIN_HASH_KEY, {});
    pins[id] = pinHash;
    writeJson(LOCAL_PIN_HASH_KEY, pins);
    return created;
  }

  const client = getSupabase()!;
  const { data, error } = await client
    .from("eleves_foyer")
    .insert({
      foyer_id: foyerId,
      prenom: cleanPrenom,
      nom: cleanNom,
      pin_hash: "pending",
      niveau,
    })
    .select("id, foyer_id, prenom, nom, niveau, created_at")
    .single();
  if (error || !data) return error?.message || "Impossible d’ajouter l’enfant.";
  const eleve = mapEleve(data as Record<string, unknown>);
  const pinHash = await hashChildPin(pin, eleve.id);
  await client.from("eleves_foyer").update({ pin_hash: pinHash }).eq("id", eleve.id);
  return eleve;
}

export async function updateEleveFoyerPin(eleveId: string, pin: string): Promise<string | null> {
  if (!/^\d{4}$/.test(pin.trim())) return "Le code PIN doit contenir 4 chiffres.";
  const pinHash = await hashChildPin(pin, eleveId);
  const localEleve = readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []).find((e) => e.id === eleveId);
  if (localEleve || !getSupabase()) {
    const pins = readJson<Record<string, string>>(LOCAL_PIN_HASH_KEY, {});
    pins[eleveId] = pinHash;
    writeJson(LOCAL_PIN_HASH_KEY, pins);
    return null;
  }
  const { error } = await getSupabase()!.from("eleves_foyer").update({ pin_hash: pinHash }).eq("id", eleveId);
  return error?.message ?? null;
}

export async function removeEleveFoyer(eleveId: string): Promise<void> {
  const localEleve = readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []).find((e) => e.id === eleveId);
  if (localEleve || !getSupabase()) {
    writeJson(
      LOCAL_ELEVES_FOYER_KEY,
      readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []).filter((e) => e.id !== eleveId),
    );
    const pins = readJson<Record<string, string>>(LOCAL_PIN_HASH_KEY, {});
    delete pins[eleveId];
    writeJson(LOCAL_PIN_HASH_KEY, pins);
    return;
  }
  await getSupabase()!.from("eleves_foyer").delete().eq("id", eleveId);
}

export async function verifyEleveFoyerPin(
  eleveId: string,
  pin: string,
): Promise<EleveFoyer | null> {
  const localEleve = readJson<EleveFoyer[]>(LOCAL_ELEVES_FOYER_KEY, []).find((e) => e.id === eleveId);
  if (localEleve || !getSupabase()) {
    const pins = readJson<Record<string, string>>(LOCAL_PIN_HASH_KEY, {});
    const expected = pins[eleveId];
    if (!expected) return null;
    const actual = await hashChildPin(pin, eleveId);
    if (actual !== expected) return null;
    return localEleve ?? null;
  }
  const { data, error } = await getSupabase()!.rpc("verify_eleve_foyer_pin", {
    p_eleve_id: eleveId,
    p_pin: pin.trim(),
  });
  if (error || !data?.length) return null;
  return mapEleve(data[0] as Record<string, unknown>);
}

export async function getAbonnement(
  subjectType: AbonnementSubjectType,
  subjectId: string,
): Promise<Abonnement | null> {
  if (useLocalStore(subjectId)) {
    return (
      readJson<Abonnement[]>(LOCAL_ABONNEMENTS_KEY, []).find(
        (a) => a.subjectType === subjectType && a.subjectId === subjectId,
      ) ?? null
    );
  }
  const client = getSupabase()!;
  const { data } = await client
    .from("abonnements")
    .select("*")
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId)
    .maybeSingle();
  return data ? mapAbonnement(data as Record<string, unknown>) : null;
}

export async function upsertAbonnement(input: {
  subjectType: AbonnementSubjectType;
  subjectId: string;
  status?: AbonnementStatus;
  source: AbonnementSource;
  currentPeriodEnd?: string | null;
  grantedBy?: string | null;
  grantedNote?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}): Promise<Abonnement> {
  const now = new Date().toISOString();
  if (useLocalStore(input.subjectId) || input.source === "local") {
    const list = readJson<Abonnement[]>(LOCAL_ABONNEMENTS_KEY, []);
    const idx = list.findIndex(
      (a) => a.subjectType === input.subjectType && a.subjectId === input.subjectId,
    );
    const base: Abonnement = {
      id: idx >= 0 ? list[idx].id : newId(),
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      plan: "premium",
      status: input.status ?? "active",
      source: input.source,
      stripeCustomerId: input.stripeCustomerId ?? null,
      stripeSubscriptionId: input.stripeSubscriptionId ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      grantedBy: input.grantedBy ?? null,
      grantedNote: input.grantedNote ?? null,
      createdAt: idx >= 0 ? list[idx].createdAt : now,
      updatedAt: now,
    };
    if (idx >= 0) list[idx] = base;
    else list.push(base);
    writeJson(LOCAL_ABONNEMENTS_KEY, list);
    return base;
  }

  const client = getSupabase()!;
  const { data, error } = await client
    .from("abonnements")
    .upsert(
      {
        subject_type: input.subjectType,
        subject_id: input.subjectId,
        plan: "premium",
        status: input.status ?? "active",
        source: input.source,
        current_period_end: input.currentPeriodEnd ?? null,
        granted_by: input.grantedBy ?? null,
        granted_note: input.grantedNote ?? null,
        stripe_customer_id: input.stripeCustomerId ?? null,
        stripe_subscription_id: input.stripeSubscriptionId ?? null,
        updated_at: now,
      },
      { onConflict: "subject_type,subject_id" },
    )
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Impossible d’enregistrer l’abonnement.");
  return mapAbonnement(data as Record<string, unknown>);
}

export async function listAbonnementsAdmin(): Promise<Abonnement[]> {
  const client = getSupabase();
  if (!client) return readJson<Abonnement[]>(LOCAL_ABONNEMENTS_KEY, []);
  const { data, error } = await client
    .from("abonnements")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data.map((row) => mapAbonnement(row as Record<string, unknown>));
}

export async function findUserIdByEmail(email: string): Promise<{ id: string; role: string } | null> {
  const cleaned = email.trim().toLowerCase();
  const client = getSupabase();
  if (!client) {
    const parentId = `local-parent-${cleaned}`;
    const teacherId = `local-${cleaned}`;
    const foyers = readJson<Foyer[]>(LOCAL_FOYERS_KEY, []);
    if (foyers.some((f) => f.ownerId === parentId)) {
      return { id: parentId, role: "parent" };
    }
    try {
      const raw = JSON.parse(localStorage.getItem("mission-maths-teacher") ?? "null") as {
        id?: string;
        email?: string;
        accountRole?: string;
      } | null;
      if (raw?.email?.toLowerCase() === cleaned && raw.id) {
        return {
          id: raw.id,
          role: raw.accountRole === "parent" ? "parent" : raw.accountRole === "admin" ? "admin" : "enseignant",
        };
      }
    } catch {
      /* ignore */
    }
    if (foyers.some((f) => f.ownerId === teacherId)) {
      return { id: teacherId, role: "enseignant" };
    }
    return { id: teacherId, role: "enseignant" };
  }
  const { data } = await client
    .from("profils_utilisateurs")
    .select("user_id, role")
    .eq("email", cleaned)
    .maybeSingle();
  if (data) return { id: data.user_id as string, role: data.role as string };
  return null;
}

/** Stripe Checkout URL (si Edge Function / env configurés). */
export async function createCheckoutSession(params: {
  subjectType: AbonnementSubjectType;
  subjectId: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string } | { error: string }> {
  const base = import.meta.env.VITE_HL_STRIPE_CHECKOUT_URL as string | undefined;
  if (!base) {
    return {
      error:
        "Paiement Stripe non configuré. Un admin Happy Learn peut t’offrir le premium, ou branche VITE_HL_STRIPE_CHECKOUT_URL.",
    };
  }
  try {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) return { error: json.error || "Échec Stripe Checkout." };
    return { url: json.url };
  } catch {
    return { error: "Impossible de joindre le service de paiement." };
  }
}

export async function createPortalSession(params: {
  subjectType: AbonnementSubjectType;
  subjectId: string;
  returnUrl: string;
}): Promise<{ url: string } | { error: string }> {
  const base = import.meta.env.VITE_HL_STRIPE_PORTAL_URL as string | undefined;
  if (!base) {
    return { error: "Portail Stripe non configuré (VITE_HL_STRIPE_PORTAL_URL)." };
  }
  try {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) return { error: json.error || "Échec portail Stripe." };
    return { url: json.url };
  } catch {
    return { error: "Impossible de joindre le portail de paiement." };
  }
}

export async function listSessionsByFoyerId(foyerId: string): Promise<ChildSession[]> {
  if (localFoyerById(foyerId) || !getSupabase()) {
    try {
      const sessions = JSON.parse(localStorage.getItem("mission-maths-sessions") ?? "[]") as ChildSession[];
      return sessions.filter((s) => s.foyerId === foyerId);
    } catch {
      return [];
    }
  }
  const client = getSupabase()!;
  const { data, error } = await client
    .from("sessions_enfant")
    .select(
      "id, device_id, prenom, univers, mode, started_at, finished_at, recompense_obtenue, code_classe, niveau, matiere, class_id, classe_session_id, eleve_id, mission_id, foyer_id, eleve_foyer_id",
    )
    .eq("foyer_id", foyerId)
    .order("started_at", { ascending: false });
  if (error || !data) return [];
  return data.flatMap((row) => {
    const univers = row.univers as UniverseSlug;
    const mode = row.mode as PlayMode;
    if (
      !["football", "rugby", "equitation", "espace"].includes(univers) ||
      (mode !== "cahier" && mode !== "qcm")
    ) {
      return [];
    }
    const session: ChildSession = {
      id: row.id as string,
      deviceId: row.device_id as string,
      prenom: row.prenom as string,
      universe: univers,
      mode,
      startedAt: row.started_at as string,
      finishedAt: (row.finished_at as string) ?? null,
      rewardEarned: Boolean(row.recompense_obtenue),
      classCode: (row.code_classe as string) ?? null,
      grade: (row.niveau as GradeLevel) ?? null,
      subject: (row.matiere as SubjectSlug) ?? null,
      classId: (row.class_id as string) ?? null,
      classeSessionId: (row.classe_session_id as string) ?? null,
      eleveId: (row.eleve_id as string) ?? null,
      missionId: (row.mission_id as string) ?? null,
      foyerId: (row.foyer_id as string) ?? null,
      eleveFoyerId: (row.eleve_foyer_id as string) ?? null,
    };
    return [session];
  });
}
