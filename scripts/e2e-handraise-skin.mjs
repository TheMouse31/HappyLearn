/**
 * Smoke: NewFront only (plus de bascule Classic).
 * Run: node scripts/e2e-handraise-skin.mjs
 */
import { chromium } from "playwright";
import fs from "fs";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.addInitScript(() => {
    // Ancienne préférence Classic — doit être ignorée / effacée.
    localStorage.setItem("happy-learn-skin", "classic");
  });
  await page.goto(BASE + "/");
  await page.waitForFunction(
    () => !document.body?.innerText?.includes("Préparation de Happy Learn"),
    { timeout: 60000 },
  );
  await page.waitForTimeout(500);

  const skin = await page.evaluate(() => document.documentElement.getAttribute("data-skin"));
  const stored = await page.evaluate(() => localStorage.getItem("happy-learn-skin"));
  const toggleVisible = await page.getByRole("button", { name: /NewFront|Classic|interface/i }).count();
  const body = await page.locator("body").innerText();

  const logs = [
    `data-skin: ${skin}`,
    `localStorage skin: ${stored}`,
    `toggle buttons: ${toggleVisible}`,
    `has Se connecter: ${/Se connecter/i.test(body)}`,
    `has Classic label: ${/Classic/i.test(body)}`,
  ];
  fs.writeFileSync(`${OUT}/newfront-only-smoke.log`, logs.join("\n") + "\n");
  await page.screenshot({ path: `${OUT}/newfront-only-home.png`, fullPage: true });
  console.log(logs.join("\n"));

  if (skin !== "newfront") throw new Error(`Expected newfront, got ${skin}`);
  if (stored !== null) throw new Error(`Expected skin key cleared, got ${stored}`);
  if (toggleVisible > 0) throw new Error("Skin toggle still visible");
  if (/Classic/i.test(body) && /NewFront/i.test(body)) {
    throw new Error("Classic/NewFront labels still present");
  }

  console.log("OK newfront only");
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
