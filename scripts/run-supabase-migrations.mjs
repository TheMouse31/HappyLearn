import fs from "fs";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = "caoxbewivbsoysxfhblg";
const files = [
  "supabase/migrations/20260915_init.sql",
  "supabase/migrations/20260915_classes_enseignants.sql",
  "supabase/migrations/20260915_happy_learn_course.sql",
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
    console.error("FAIL", label, res.status, text);
    throw new Error(label);
  }
  console.log("OK", label);
}

if (!token) {
  console.error("Missing SUPABASE_ACCESS_TOKEN");
  process.exit(1);
}

for (const file of files) {
  await run(fs.readFileSync(file, "utf8"), file);
}

const verifySql = [
  "select tablename from pg_tables where schemaname = 'public' order by 1",
  "select count(*)::int as univers from univers",
  "select count(*)::int as etapes from etapes",
  "select column_name from information_schema.columns where table_name = 'sessions_enfant' and column_name in ('code_classe','niveau','matiere') order by 1",
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
