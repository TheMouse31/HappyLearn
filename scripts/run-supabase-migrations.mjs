import fs from "fs";

function readEnv(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function projectRefFromUrl(url) {
  try {
    const host = new URL(url).hostname;
    const ref = host.split(".")[0] ?? "";
    return /^[a-z0-9]{15,}$/i.test(ref) ? ref : "";
  } catch {
    return "";
  }
}

const token = readEnv("HL_SUPABASE_ACCESS_TOKEN") || readEnv("SUPABASE_ACCESS_TOKEN");
const supabaseUrl = readEnv("VITE_HL_SUPABASE_URL") || readEnv("VITE_SUPABASE_URL");
const ref = projectRefFromUrl(supabaseUrl);

const files = [
  "supabase/migrations/20260915_init.sql",
  "supabase/migrations/20260915_classes_enseignants.sql",
  "supabase/migrations/20260915_happy_learn_course.sql",
  "supabase/migrations/20260917_eleves_classe.sql",
  "supabase/migrations/20260918_sessions_classe_live.sql",
  "supabase/migrations/20260920_missions_catalog.sql",
  "supabase/seed.sql",
];

async function run(sql, label) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    // Idempotent re-runs: policies/tables may already exist on the target project.
    if (/already exists/i.test(text)) {
      console.log("SKIP (already exists)", label);
      return;
    }
    console.error("FAIL", label, res.status, text);
    throw new Error(label);
  }
  console.log("OK", label);
}

if (!token) {
  console.error("Missing HL_SUPABASE_ACCESS_TOKEN (or SUPABASE_ACCESS_TOKEN)");
  process.exit(1);
}

if (!ref) {
  console.error(
    "Missing or invalid VITE_HL_SUPABASE_URL (or VITE_SUPABASE_URL) — cannot derive project ref",
  );
  process.exit(1);
}

console.log("Target project ref:", ref);

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error("Missing file", file);
    process.exit(1);
  }
  await run(fs.readFileSync(file, "utf8"), file);
}

const verifySql = [
  "select tablename from pg_tables where schemaname = 'public' order by 1",
  "select column_name from information_schema.columns where table_name = 'eleves_classe' and column_name in ('prenom','nom') order by 1",
  "select column_name from information_schema.columns where table_name = 'classe_sessions' order by 1",
  "select column_name from information_schema.columns where table_name = 'session_participants' order by 1",
  "select column_name from information_schema.columns where table_name = 'sessions_enfant' and column_name in ('class_id','classe_session_id','eleve_id','mission_id') order by 1",
  "select column_name from information_schema.columns where table_name = 'missions' order by 1",
].join(";\n");

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: verifySql }),
});
console.log("VERIFY", await res.text());
