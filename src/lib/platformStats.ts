import { getSupabase } from "./supabase";

export type PlatformStats = {
  teachers: number;
  classes: number;
  students: number;
  childSessions: number;
  missionsCompleted: number;
  liveSessionsOpen: number;
  catalogMissions: number;
  backend: "local" | "supabase";
};

function countLocal(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export async function loadPlatformStats(catalogMissionCount: number): Promise<PlatformStats> {
  const client = getSupabase();
  if (!client) {
    const sessions = (() => {
      try {
        const raw = localStorage.getItem("mission-maths-sessions");
        const parsed = raw ? (JSON.parse(raw) as { rewardEarned?: boolean }[]) : [];
        if (!Array.isArray(parsed)) return { total: 0, done: 0 };
        return {
          total: parsed.length,
          done: parsed.filter((item) => item.rewardEarned).length,
        };
      } catch {
        return { total: 0, done: 0 };
      }
    })();
    return {
      teachers: countLocal("mission-maths-classes") > 0 ? 1 : 0,
      classes: countLocal("mission-maths-classes"),
      students: countLocal("mission-maths-class-students"),
      childSessions: sessions.total,
      missionsCompleted: sessions.done,
      liveSessionsOpen: countLocal("happy-learn-classe-sessions"),
      catalogMissions: catalogMissionCount,
      backend: "local",
    };
  }

  const { data: rpcData, error: rpcError } = await client.rpc("platform_usage_stats");
  if (!rpcError && rpcData && typeof rpcData === "object") {
    const row = rpcData as Record<string, number>;
    return {
      teachers: Number(row.teachers) || 0,
      classes: Number(row.classes) || 0,
      students: Number(row.students) || 0,
      childSessions: Number(row.childSessions) || 0,
      missionsCompleted: Number(row.missionsCompleted) || 0,
      liveSessionsOpen: Number(row.liveSessionsOpen) || 0,
      catalogMissions: catalogMissionCount,
      backend: "supabase",
    };
  }

  const [teachers, classes, students, sessions, live] = await Promise.all([
    client.from("profils_enseignants").select("user_id", { count: "exact", head: true }),
    client.from("classes").select("id", { count: "exact", head: true }),
    client.from("eleves_classe").select("id", { count: "exact", head: true }),
    client.from("sessions_enfant").select("id, recompense_obtenue"),
    client.from("classe_sessions").select("id", { count: "exact", head: true }).eq("statut", "ouverte"),
  ]);

  const sessionRows = sessions.data ?? [];
  return {
    teachers: teachers.count ?? 0,
    classes: classes.count ?? 0,
    students: students.count ?? 0,
    childSessions: sessionRows.length,
    missionsCompleted: sessionRows.filter((row) => row.recompense_obtenue).length,
    liveSessionsOpen: live.count ?? 0,
    catalogMissions: catalogMissionCount,
    backend: "supabase",
  };
}
