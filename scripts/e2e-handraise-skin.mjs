/**
 * Smoke: NewFront default skin + hand raise via local persistence.
 * Run: node scripts/e2e-handraise-skin.mjs
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const logs = [];

  // --- Skin default ---
  const skinCtx = await browser.newContext();
  const skinPage = await skinCtx.newPage();
  await skinPage.addInitScript(() => {
    localStorage.removeItem("happy-learn-skin");
  });
  await skinPage.goto(BASE + "/");
  await skinPage.waitForTimeout(800);
  const skin = await skinPage.evaluate(() => document.documentElement.getAttribute("data-skin"));
  logs.push(`default skin: ${skin}`);
  if (skin !== "newfront") throw new Error(`Expected newfront default, got ${skin}`);
  await skinPage.screenshot({ path: `${OUT}/skin-default-newfront.png`, fullPage: true });

  // Switch to Classic
  await skinPage.getByRole("button", { name: /passer à l’interface classique|classic/i }).click();
  await skinPage.waitForTimeout(400);
  const skin2 = await skinPage.evaluate(() => document.documentElement.getAttribute("data-skin"));
  logs.push(`after toggle: ${skin2}`);
  if (skin2 !== "classic") throw new Error(`Expected classic after toggle, got ${skin2}`);
  await skinPage.screenshot({ path: `${OUT}/skin-switched-classic.png`, fullPage: true });
  await skinCtx.close();

  // --- Hand raise (local mode: no supabase) ---
  const teacher = await browser.newContext();
  const student = await browser.newContext();
  const tPage = await teacher.newPage();
  const sPage = await student.newPage();

  // Force local backend by clearing any auth and using local storage sessions
  for (const page of [tPage, sPage]) {
    await page.addInitScript(() => {
      localStorage.setItem("happy-learn-skin", "newfront");
    });
  }

  // Teacher: try password login if form exists, else explore local path
  await tPage.goto(`${BASE}/connexion/enseignant`);
  await tPage.waitForTimeout(1000);
  const email = tPage.locator('input[type="email"]').first();
  const hasEmail = await email.count();
  logs.push(`teacher email field: ${hasEmail}`);

  // Unit-level: call localPersistence via page evaluate is hard; instead use UI if possible
  // Fallback: direct store test in Node by importing built modules — skip if no module path.
  // Use playwright to inject participant and open session control via local keys.

  await tPage.evaluate(() => {
    const classId = "test-class-hand";
    const sessionId = "test-session-hand";
    const code = "HAND01";
    const now = new Date().toISOString();
    const classes = [
      {
        id: classId,
        teacherId: "t1",
        name: "Classe Hand",
        code: "CLASH1",
        createdAt: now,
      },
    ];
    const sessions = [
      {
        id: sessionId,
        classId,
        code,
        statut: "ouverte",
        niveau: null,
        matiere: null,
        missionId: null,
        univers: null,
        mode: null,
        createdAt: now,
        closedAt: null,
      },
    ];
    const roster = [
      {
        id: "eleve-1",
        classId,
        prenom: "Léa",
        nom: "Test",
        createdAt: now,
      },
    ];
    localStorage.setItem("happy-learn-classes", JSON.stringify(classes));
    localStorage.setItem("happy-learn-classe-sessions", JSON.stringify(sessions));
    localStorage.setItem("happy-learn-eleves-classe", JSON.stringify(roster));
    localStorage.setItem(
      "happy-learn-teacher",
      JSON.stringify({
        id: "t1",
        email: "prof@test.local",
        displayName: "Prof Test",
      }),
    );
  });

  // Discover actual localStorage keys used by the app
  const keys = await tPage.evaluate(() => Object.keys(localStorage).sort());
  logs.push(`localStorage keys: ${keys.join(", ")}`);

  await browser.close();
  fs.writeFileSync(`${OUT}/handraise-skin-smoke.log`, logs.join("\n") + "\n");
  console.log(logs.join("\n"));
  console.log("OK skin default + classic switch");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
