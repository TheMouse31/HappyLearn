/**
 * E2E: hand raise in live session (teacher + student).
 * Requires /tmp/hl-test-teacher.json and running Vite.
 * Run: node scripts/e2e-handraise-live.mjs
 */
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });
const creds = JSON.parse(fs.readFileSync("/tmp/hl-test-teacher.json", "utf8"));
const classInfo = JSON.parse(fs.readFileSync("/tmp/hl-handraise-class.json", "utf8"));
const url = process.env.VITE_HL_SUPABASE_URL;
const anon = process.env.VITE_HL_SUPABASE_ANON_KEY;

async function prepareSession() {
  const sb = createClient(url, anon);
  await sb.auth.signInWithPassword(creds);
  await sb
    .from("classe_sessions")
    .update({ statut: "fermee", closed_at: new Date().toISOString() })
    .eq("class_id", classInfo.id)
    .eq("statut", "ouverte");
  const code = "HR" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const { data: session, error } = await sb
    .from("classe_sessions")
    .insert({ class_id: classInfo.id, code, statut: "ouverte" })
    .select("*")
    .single();
  if (error) throw error;
  return { code: session.code, sessionId: session.id, sb };
}

async function main() {
  const { code, sessionId, sb } = await prepareSession();
  console.log("session", code, sessionId);

  const browser = await chromium.launch({ headless: true });
  const teacherCtx = await browser.newContext();
  const studentCtx = await browser.newContext();
  const tPage = await teacherCtx.newPage();
  const sPage = await studentCtx.newPage();

  // Clear skin so we can also assert default separately; keep newfront for UI
  await tPage.addInitScript(() => localStorage.setItem("happy-learn-skin", "newfront"));
  await sPage.addInitScript(() => {
    localStorage.setItem("happy-learn-skin", "newfront");
    localStorage.setItem("mission-maths-device", "student-device-handraise");
  });

  // Teacher login
  await tPage.goto(`${BASE}/connexion/enseignant`);
  await tPage.locator('input[type="email"]').fill(creds.email);
  await tPage.locator('input[type="password"]').fill(creds.password);
  await tPage.getByRole("button", { name: /connexion|se connecter|entrer/i }).first().click();
  await tPage.waitForURL(/espace-professeur/, { timeout: 20000 });
  await tPage.goto(`${BASE}/espace-professeur/session`);
  await tPage.waitForTimeout(2000);
  // Ensure our session code is visible (refresh if needed)
  for (let i = 0; i < 5; i++) {
    const text = await tPage.locator("body").innerText();
    if (text.includes(code)) break;
    await tPage.reload();
    await tPage.waitForTimeout(1200);
  }
  await tPage.screenshot({ path: `${OUT}/handraise-teacher-roster.png` });

  // Student join
  await sPage.goto(`${BASE}/connexion/eleve`);
  await sPage.getByLabel(/code/i).fill(code);
  await sPage.waitForTimeout(800);
  // Select student name
  const option = sPage.getByRole("option", { name: /Léa/i }).or(sPage.locator("text=Léa Martin")).first();
  // Try select element
  const select = sPage.locator("select").first();
  if (await select.count()) {
    await select.selectOption({ label: /Léa/i }).catch(async () => {
      const opts = await select.locator("option").allTextContents();
      console.log("options", opts);
      const match = opts.find((o) => /Léa/i.test(o));
      if (match) await select.selectOption({ label: match });
    });
  } else {
    await sPage.getByText(/Léa/i).first().click();
  }
  await sPage.getByRole("button", { name: /^entrer$/i }).click();
  await sPage.waitForURL(/salle-attente|attente/i, { timeout: 15000 }).catch(() => null);
  await sPage.waitForTimeout(1500);
  await sPage.screenshot({ path: `${OUT}/handraise-student-waiting.png` });

  const raiseBtn = sPage.getByRole("button", { name: /lever la main/i });
  await raiseBtn.waitFor({ timeout: 10000 });
  await raiseBtn.click();
  await sPage.waitForTimeout(1500);
  await sPage.screenshot({ path: `${OUT}/handraise-student-raised.png` });
  const lowered = sPage.getByRole("button", { name: /baisser la main/i });
  if (!(await lowered.count())) throw new Error("Student button did not switch to Baisser la main");

  // Teacher should see Main levée (realtime or poll)
  let seen = false;
  for (let i = 0; i < 15; i++) {
    const text = await tPage.locator("body").innerText();
    if (/Main levée/i.test(text)) {
      seen = true;
      break;
    }
    await tPage.waitForTimeout(1000);
  }
  await tPage.screenshot({ path: `${OUT}/handraise-teacher-sees-hand.png` });
  if (!seen) throw new Error("Teacher did not see Main levée badge");

  // Teacher dismiss
  await tPage.getByRole("button", { name: /^Vu$/i }).click();
  await tPage.waitForTimeout(1500);
  await tPage.screenshot({ path: `${OUT}/handraise-teacher-cleared.png` });

  // Student should see Lever again
  let studentCleared = false;
  for (let i = 0; i < 10; i++) {
    if (await sPage.getByRole("button", { name: /lever la main/i }).count()) {
      studentCleared = true;
      break;
    }
    await sPage.waitForTimeout(800);
  }
  await sPage.screenshot({ path: `${OUT}/handraise-student-cleared.png` });
  if (!studentCleared) throw new Error("Student hand was not cleared after teacher Vu");

  // Cleanup
  await sb.from("classe_sessions").update({ statut: "fermee", closed_at: new Date().toISOString() }).eq("id", sessionId);

  await browser.close();
  console.log("OK hand raise live e2e");
  fs.writeFileSync(
    `${OUT}/handraise-live-e2e.log`,
    `session=${code}\nteacher saw hand=true\ncleared=true\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
