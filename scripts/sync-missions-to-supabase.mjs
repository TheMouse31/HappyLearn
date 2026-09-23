import { createServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const url = process.env.VITE_HL_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_HL_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const admin = JSON.parse(fs.readFileSync("/tmp/hl-admin.json", "utf8"));

if (!url || !anon) {
  console.error("Missing env");
  process.exit(1);
}

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const mod = await server.ssrLoadModule("/src/data/missions/index.ts");
  const missions = mod.BUILTIN_MISSIONS;
  const client = createClient(url, anon);
  const { data: auth, error: authErr } = await client.auth.signInWithPassword({
    email: admin.email,
    password: admin.password,
  });
  if (authErr || !auth.session) {
    console.error("Auth fail", authErr?.message);
    process.exit(1);
  }
  console.log("Signed in as", admin.email);

  // Ensure is_admin on profile
  await client.from("profils_enseignants").upsert({
    user_id: auth.user.id,
    display_name: admin.email.split("@")[0],
    is_admin: true,
  });

  const payload = missions.map((mission) => ({
    id: mission.id,
    grade: mission.grade,
    subject: mission.subject,
    title: mission.title,
    blurb: mission.blurb,
    available: false,
    official: false,
    difficulty: mission.difficulty ?? null,
    theme_id: mission.themeId,
    steps: mission.steps,
    version: mission.version ?? 1,
    source: "builtin",
    teacher_id: null,
    updated_at: new Date().toISOString(),
  }));

  const chunkSize = 5;
  let upserted = 0;
  for (let i = 0; i < payload.length; i += chunkSize) {
    const chunk = payload.slice(i, i + chunkSize);
    const { error } = await client.from("missions").upsert(chunk, { onConflict: "id" });
    if (error) {
      console.error("FAIL", i, error.message);
      process.exitCode = 1;
      break;
    }
    upserted += chunk.length;
    console.log("OK", upserted, "/", payload.length);
  }
  if (!process.exitCode) {
    const { count } = await client.from("missions").select("id", { count: "exact", head: true });
    console.log("Synced", upserted, "missions; table count ≈", count);
  }
} finally {
  await server.close();
}
