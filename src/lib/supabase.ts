import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

function readEnv(name: string): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Préfère les secrets isolés Happy Learn, repli sur les noms standards. */
export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = readEnv("VITE_HL_SUPABASE_URL") ?? readEnv("VITE_SUPABASE_URL");
  const anonKey = readEnv("VITE_HL_SUPABASE_ANON_KEY") ?? readEnv("VITE_SUPABASE_ANON_KEY");
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const env = getSupabaseEnv();
  if (!env) {
    cached = null;
    return cached;
  }
  cached = createClient(env.url, env.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}

export function supabaseConfigured(): boolean {
  return getSupabase() !== null;
}
