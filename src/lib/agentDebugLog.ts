/** Temporary debug ingest for live-session launch investigation. Do not ship. */

type AgentDebugPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp?: number;
  runId?: string;
};

export function agentDebugLog(payload: AgentDebugPayload): void {
  const body = JSON.stringify({
    ...payload,
    timestamp: payload.timestamp ?? Date.now(),
  });
  try {
    void fetch("/__agent_debug_log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
