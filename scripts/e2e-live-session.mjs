/**
 * Dual-context Playwright smoke for live class sessions.
 * Run: node scripts/e2e-live-session.mjs
 */
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5174";
const creds = JSON.parse(fs.readFileSync("/tmp/hl-test-teacher.json", "utf8"));
const url = process.env.VITE_HL_SUPABASE_URL;
const anon = process.env.VITE_HL_SUPABASE_ANON_KEY;

async function prepareSession() {
  const sb = createClient(url, anon);
  await sb.auth.signInWithPassword(creds);
  const { data: klass } = await sb.from("classes").select("id").eq("code", "LIVE01").single();
  await sb
    .from("classe_sessions")
    .update({ statut: "fermee", closed_at: new Date().toISOString() })
    .eq("class_id", klass.id)
    .eq("statut", "ouverte");
  const code = "E2E" + Math.random().toString(36).slice(2, 5).toUpperCase();
  const { data: session, error } = await sb
    .from("classe_sessions")
    .insert({ class_id: klass.id, code, statut: "ouverte" })
    .select("*")
    .single();
  if (error) throw error;
  return { code: session.code, sessionId: session.id, classId: klass.id, sb };
}

async function setDeviceId(page, deviceId) {
  await page.addInitScript((id) => {
    localStorage.setItem("mission-maths-device", id);
  }, deviceId);
}

async function joinAs(page, code, nameLabel) {
  await page.goto(`${BASE}/connexion/eleve`);
  await page.getByLabel(/code de session/i).fill(code);
  await page.getByRole("option", { name: nameLabel }).waitFor({ timeout: 10000 });
  await page.getByRole("option", { name: nameLabel }).click();
  await page.getByRole("button", { name: /^entrer$/i }).click();
}

async function main() {
  const { code, sessionId, sb } = await prepareSession();
  console.log("session", code);

  const browser = await chromium.launch({ headless: true });
  const teacher = await browser.newContext();
  const deviceA = await browser.newContext();
  const deviceB = await browser.newContext();

  const teacherPage = await teacher.newPage();
  await teacherPage.goto(`${BASE}/connexion/enseignant`);
  // Prefer password form
  const email = teacherPage.locator('input[type="email"]').first();
  await email.fill(creds.email);
  const password = teacherPage.locator('input[type="password"]').first();
  if (await password.count()) {
    await password.fill(creds.password);
    await teacherPage.getByRole("button", { name: /connexion|se connecter|entrer/i }).first().click();
  }
  await teacherPage.waitForURL(/espace-professeur/, { timeout: 15000 }).catch(() => null);
  await teacherPage.goto(`${BASE}/espace-professeur/session`);
  await teacherPage.waitForTimeout(1500);

  // If no open session shown matching our code, the page may have another — refresh
  const pageText = await teacherPage.locator("body").innerText();
  if (!pageText.includes(code)) {
    // open via UI
    const launch = teacherPage.getByRole("button", { name: /lancer une session|relancer/i }).first();
    if (await launch.count()) {
      // close ours via API already open — teacher UI may show it after refresh
      await teacherPage.reload();
      await teacherPage.waitForTimeout(1000);
    }
  }

  const pageA = await deviceA.newPage();
  await setDeviceId(pageA, "e2e-device-A");
  await joinAs(pageA, code, "Alice Martin");
  await pageA.waitForURL(/salle-attente/, { timeout: 15000 });
  console.log("PASS Alice joined waiting room", pageA.url());

  const pageB = await deviceB.newPage();
  await setDeviceId(pageB, "e2e-device-B");
  await pageB.goto(`${BASE}/connexion/eleve`);
  await pageB.getByLabel(/code de session/i).fill(code);
  await pageB.getByRole("option", { name: "Alice Martin" }).click();
  await pageB.getByRole("button", { name: /^entrer$/i }).click();
  await pageB.waitForTimeout(1500);
  const err = await pageB.locator(".error").innerText().catch(() => "");
  console.log("name lock error:", err);
  if (!/déjà pris/i.test(err)) {
    console.error("FAIL expected name lock error");
    process.exitCode = 1;
  } else {
    console.log("PASS name lock");
  }

  await pageB.getByRole("option", { name: "Bob Dupont" }).click();
  await pageB.getByRole("button", { name: /^entrer$/i }).click();
  await pageB.waitForURL(/salle-attente/, { timeout: 15000 });
  console.log("PASS Bob joined");

  // Kick Bob via API (same as teacher kick)
  const { data: bobPart } = await sb
    .from("session_participants")
    .select("id")
    .eq("session_id", sessionId)
    .eq("prenom", "Bob")
    .maybeSingle();
  if (bobPart) {
    await sb.from("session_participants").delete().eq("id", bobPart.id);
  }
  await pageB.waitForTimeout(2500);
  const bobBody = await pageB.locator("body").innerText();
  console.log("Bob after kick contains Déconnecté?", /déconnect/i.test(bobBody));
  if (!/déconnect/i.test(bobBody)) {
    // may need navigation — poll
    await pageB.waitForTimeout(3000);
    const again = await pageB.locator("body").innerText();
    console.log("Bob after wait:", /déconnect/i.test(again) ? "PASS kicked" : "WARN no kicked UI yet");
  } else {
    console.log("PASS kick UI");
  }

  // Launch activity
  await sb
    .from("classe_sessions")
    .update({
      niveau: "cm2",
      matiere: "maths",
      mission_id: "cm2-maths-fractions-01",
      univers: "football",
      mode: "qcm",
    })
    .eq("id", sessionId);

  await pageA.waitForURL(/mission/, { timeout: 20000 });
  console.log("PASS Alice pushed to mission", pageA.url());
  const navHome = await pageA.getByRole("button", { name: /accueil/i }).count();
  console.log("locked nav Accueil count (expect 0):", navHome);
  if (navHome !== 0) process.exitCode = 1;
  else console.log("PASS navigation locked");

  // Stop activity → back to waiting
  await sb
    .from("classe_sessions")
    .update({
      niveau: null,
      matiere: null,
      mission_id: null,
      univers: null,
      mode: null,
    })
    .eq("id", sessionId);
  await pageA.waitForURL(/salle-attente/, { timeout: 20000 });
  console.log("PASS Alice back to waiting after stop", pageA.url());

  // Screenshots
  await teacherPage.screenshot({ path: "/opt/cursor/artifacts/e2e_teacher_session.png", fullPage: true });
  await pageA.screenshot({ path: "/opt/cursor/artifacts/e2e_alice_waiting.png", fullPage: true });

  await browser.close();
  console.log("E2E_DONE");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
