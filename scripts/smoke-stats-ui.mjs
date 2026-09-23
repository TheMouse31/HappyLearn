/**
 * Smoke UI: résumé + détail élève avec signal QCM / indices.
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const creds = JSON.parse(fs.readFileSync("/tmp/hl-test-teacher.json", "utf8"));
const demo = JSON.parse(fs.readFileSync("/tmp/hl-stats-demo.json", "utf8"));
const OUT = "/opt/cursor/artifacts";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
  page.on("pageerror", (err) => console.error("PAGEERROR", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("CONSOLE", msg.text());
  });

  await page.goto(`${BASE}/connexion/enseignant`, { waitUntil: "networkidle" });
  await page.locator('input[type="email"]').first().fill(creds.email);
  const password = page.locator('input[type="password"]').first();
  if (await password.count()) await password.fill(creds.password);
  await page.getByRole("button", { name: /connexion|se connecter|entrer/i }).first().click();
  await page.waitForURL(/espace-professeur|espace-admin/, { timeout: 20000 });
  await page.goto(`${BASE}/espace-professeur`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  // Fermer modal classes si ouvert
  const backdrop = page.locator(".suivi-modal-backdrop");
  if (await backdrop.count()) {
    const close = page.locator(".suivi-modal-close");
    if (await close.count()) await close.click();
    else await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // Masquer préparation pour voir le résumé
  const hidePrep = page.getByRole("button", { name: /masquer la préparation/i });
  if (await hidePrep.count()) await hidePrep.click();

  // Attendre que les stats se chargent (indices / qcm non « — » uniquement)
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      return text.includes("Indices ouverts") && text.includes("QCM toutes options");
    },
    { timeout: 15000 },
  );

  // Debug: dump summary values
  const summaryText = await page.locator(".suivi-summary").innerText().catch(() => "no-summary");
  console.log("SUMMARY\n", summaryText);

  await page.locator(".suivi-summary").scrollIntoViewIfNeeded().catch(() => null);
  await page.screenshot({ path: `${OUT}/stats-suivi-summary.png` });

  // Onglet Élèves déjà sélectionné souvent
  const elevesTab = page.locator('button[role="tab"]').filter({ hasText: /Élèves/i }).first();
  if (await elevesTab.count()) {
    await elevesTab.click({ force: true }).catch(() => null);
  }
  await page.waitForTimeout(800);

  const lea = page.locator("button.suivi-eleve-row").filter({ hasText: /Léa/i }).first();
  if (await lea.count()) {
    await lea.click({ force: true });
    await page.waitForTimeout(1200);
  }

  await page.screenshot({ path: `${OUT}/stats-eleve-detail-qcm.png`, fullPage: true });

  const text = await page.locator("body").innerText();
  for (const label of ["Indices ouverts", "QCM toutes options"]) {
    if (!text.includes(label)) {
      console.error("MISSING", label);
      process.exit(1);
    }
  }

  const hasSignal =
    text.includes("signal à vérifier") ||
    text.includes("toutes les propositions") ||
    /\bQCM\b/.test(text);
  console.log("hasSignal", hasSignal);
  console.log("OK smoke-stats-ui", demo.classCode);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
