/**
 * Capture fresh documentation screenshots for admin studio / rich text.
 * Usage: node scripts/capture-docs-screenshots.mjs
 * Requires: app on http://127.0.0.1:5173 and playwright.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs", "pdf-assets");
const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const creds = JSON.parse(fs.readFileSync("/tmp/hl-admin.json", "utf8"));

fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name, fullPage = false) {
  const dest = path.join(OUT, name);
  await page.screenshot({ path: dest, fullPage, type: "png" });
  console.log("wrote", name);
}

async function loginAdmin(page) {
  // Ensure this account is treated as admin (seed + allowlist) and seed a sample illustration.
  await page.addInitScript((email) => {
    const key = "happy-learn-admin-emails";
    const seed = ["test@test.fr", String(email).toLowerCase()];
    try {
      const raw = localStorage.getItem(key);
      const extra = raw ? JSON.parse(raw) : [];
      const merged = [...new Set([...seed, ...(Array.isArray(extra) ? extra : [])])];
      localStorage.setItem(key, JSON.stringify(merged));
    } catch {
      localStorage.setItem(key, JSON.stringify(seed));
    }

    const illustKey = "happy-learn-custom-illustrations";
    const sample = {
      id: "doc-partage-pizza",
      label: "Partage de pizza",
      blurb: "Illustration de démo pour la doc",
      imageUrl:
        "data:image/svg+xml," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="#0f8f78"/><circle cx="320" cy="200" r="120" fill="#ffdc50"/><path d="M320 80 L440 280 L200 280 Z" fill="#c45c12"/></svg>',
        ),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem(illustKey) || "[]");
      if (!Array.isArray(existing) || !existing.some((item) => item && item.id === sample.id)) {
        localStorage.setItem(illustKey, JSON.stringify([sample, ...(Array.isArray(existing) ? existing : [])]));
      }
    } catch {
      localStorage.setItem(illustKey, JSON.stringify([sample]));
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
  await page.waitForTimeout(1500);
  // Wait for at least one numeric platform stat if possible
  await page.waitForFunction(() => {
    const cards = [...document.querySelectorAll(".admin-stat, .stat-card, .platform-stat, strong")];
    return cards.some((el) => /\d/.test(el.textContent || ""));
  }, { timeout: 8000 }).catch(() => null);
  await shot(page, "23_admin_overview.png");

  await page.goto(`${BASE}/espace-admin?tab=missions`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot(page, "24_admin_missions_tab.png");

  await page.goto(`${BASE}/espace-admin?tab=illustrations`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await shot(page, "25_admin_illustrations.png");

  // Open create panel if button exists
  const createBtn = page.getByRole("button", { name: /créer|nouvelle illustration|ajouter/i });
  if (await createBtn.count()) {
    await createBtn.first().click();
    await page.waitForTimeout(400);
    await shot(page, "26_admin_illustration_create.png");
  }

  await page.goto(`${BASE}/espace-admin/missions`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await shot(page, "13_createur_missions.png");
  await shot(page, "16_catalogue_missions.png");

  // New mission studio
  await page.goto(`${BASE}/espace-admin/missions?new=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await shot(page, "14_editeur_mission.png");
  await shot(page, "15_editeur_detail.png");

  // Focus consigne / rich text if present
  const prompt = page.locator(".mission-studio-prompt, [contenteditable='true'], .rich-text-editor").first();
  if (await prompt.count()) {
    await prompt.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300);
    await shot(page, "27_studio_richtext.png");
  }

  // Toggle preview if available
  const previewToggle = page.getByRole("button", { name: /aperçu|preview/i });
  if (await previewToggle.count()) {
    await previewToggle.first().click();
    await page.waitForTimeout(400);
    await shot(page, "28_studio_with_preview.png");
  }

  // Illustration picker in step
  const illustTab = page.getByRole("button", { name: /illustration|scène|visuel/i });
  if (await illustTab.count()) {
    await illustTab.first().click();
    await page.waitForTimeout(500);
    await shot(page, "29_studio_scene_picker.png");
  }

  await browser.close();
  console.log("done →", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
