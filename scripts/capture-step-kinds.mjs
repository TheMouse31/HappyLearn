/**
 * Capture studio step-kind groups + blanks/audio player smoke.
 * Usage: node scripts/capture-step-kinds.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
const creds = JSON.parse(fs.readFileSync("/tmp/hl-admin.json", "utf8"));
fs.mkdirSync(OUT, { recursive: true });

async function loginAdmin(page) {
  await page.addInitScript((email) => {
    const key = "happy-learn-admin-emails";
    const seed = ["test@test.fr", String(email).toLowerCase()];
    try {
      const raw = localStorage.getItem(key);
      const extra = raw ? JSON.parse(raw) : [];
      localStorage.setItem(key, JSON.stringify([...new Set([...seed, ...(Array.isArray(extra) ? extra : [])])]));
    } catch {
      localStorage.setItem(key, JSON.stringify(seed));
    }
  }, creds.email);
  await page.goto(`${BASE}/connexion/enseignant`, { waitUntil: "networkidle" });
  await page.fill("#email", creds.email);
  await page.fill("#password", creds.password);
  await page.getByRole("button", { name: /se connecter/i }).click();
  await page.waitForURL(/espace-admin/, { timeout: 20000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await loginAdmin(page);

  await page.goto(`${BASE}/espace-admin/missions?new=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const kindSelect = page.locator(".mission-studio-panel select, .mission-studio-field-row select").first();
  await kindSelect.waitFor({ timeout: 10000 });
  // Ensure blanks option exists
  const hasBlanks = await page.locator('option[value="blanks"]').count();
  if (!hasBlanks) throw new Error("blanks option missing");

  const labels = await kindSelect.evaluate((el) =>
    [...el.querySelectorAll("optgroup")].map((g) => ({
      label: g.label,
      items: [...g.querySelectorAll("option")].map((o) => o.textContent?.trim()),
    })),
  );
  fs.writeFileSync(path.join(OUT, "step-kinds-groups.json"), JSON.stringify(labels, null, 2));

  await kindSelect.selectOption("blanks");
  await page.waitForTimeout(400);
  const editable = page.locator("[contenteditable='true']").first();
  if (await editable.count()) {
    await editable.click();
    await page.keyboard.type("Le ___ court dans le jardin.");
  }
  const answerTab = page.getByRole("button", { name: /^Réponse$/i });
  if (await answerTab.count()) await answerTab.click();
  await page.waitForTimeout(300);
  const answerInput = page.locator(".mission-studio-panel input").first();
  if (await answerInput.count()) await answerInput.fill("chat");
  await page.screenshot({ path: path.join(OUT, "step-kinds-blanks-editor.png"), type: "png" });

  await page.getByRole("button", { name: /^Contenu$/i }).click().catch(() => null);
  await page.waitForTimeout(200);
  await kindSelect.selectOption("audio");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, "step-kinds-audio-editor.png"), type: "png" });

  await kindSelect.selectOption("choice");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(OUT, "step-kinds-qcm-editor.png"), type: "png" });

  await kindSelect.evaluate((el) => {
    el.size = Math.min(el.options.length, 16);
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT, "step-kinds-palette.png"), type: "png" });

  console.log("groups", labels);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
