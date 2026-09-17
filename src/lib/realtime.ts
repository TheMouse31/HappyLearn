import { getSupabase } from "./supabase";

export type RealtimeHandler = () => void;

type ChannelLike = {
  unsubscribe: () => void;
};

function canUseRealtime(): boolean {
  return getSupabase() !== null;
}

/** Abonnement postgres_changes — actif uniquement avec Supabase. */
export function subscribeSessionParticipants(
  sessionId: string,
  onChange: RealtimeHandler,
): () => void {
  const client = getSupabase();
  if (!client || !sessionId) return () => undefined;

  const channel = client
    .channel(`session-participants-${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "session_participants",
        filter: `session_id=eq.${sessionId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel as ChannelLike as never);
  };
}

export function subscribeClasseSession(
  sessionId: string,
  onChange: RealtimeHandler,
): () => void {
  const client = getSupabase();
  if (!client || !sessionId) return () => undefined;

  const channel = client
    .channel(`classe-session-${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "classe_sessions",
        filter: `id=eq.${sessionId}`,
      },
      () => onChange(),
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel as ChannelLike as never);
  };
}

export { canUseRealtime };
