/**
 * Smoke test for colorblind mode toggle + persistence.
 * Run: node scripts/e2e-colorblind.mjs
 * Requires: HL_BASE_URL (default http://127.0.0.1:5173) and playwright.
 */
import { chromium } from "playwright";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });

  const toggle = page.getByRole("button", { name: /mode daltonien/i });
  await toggle.waitFor({ timeout: 15000 });

  const before = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-colorblind"),
    stored: localStorage.getItem("happy-learn-colorblind"),
    pressed: document.querySelector(".colorblind-toggle")?.getAttribute("aria-pressed"),
  }));
  if (before.attr || before.stored === "1" || before.pressed === "true") {
    throw new Error(`expected off by default, got ${JSON.stringify(before)}`);
  }

  await toggle.click();
  await page.waitForFunction(() => document.documentElement.getAttribute("data-colorblind") === "1");

  const on = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-colorblind"),
    stored: localStorage.getItem("happy-learn-colorblind"),
    pressed: document.querySelector(".colorblind-toggle")?.getAttribute("aria-pressed"),
    action: getComputedStyle(document.documentElement).getPropertyValue("--action").trim(),
  }));
  if (on.attr !== "1" || on.stored !== "1" || on.pressed !== "true") {
    throw new Error(`expected on after click, got ${JSON.stringify(on)}`);
  }
  if (!/^#2563eb$/i.test(on.action)) {
    throw new Error(`expected --action #2563eb in colorblind mode, got ${on.action}`);
  }
  console.log("PASS: toggle on + CSS vars");

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.getAttribute("data-colorblind") === "1");
  const persisted = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-colorblind"),
    stored: localStorage.getItem("happy-learn-colorblind"),
  }));
  if (persisted.attr !== "1" || persisted.stored !== "1") {
    throw new Error(`expected persistence after reload, got ${JSON.stringify(persisted)}`);
  }
  console.log("PASS: persistence across reload");

  const toggleOff = page.getByRole("button", { name: /désactiver le mode daltonien/i });
  await toggleOff.click();
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-colorblind"));
  const off = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-colorblind"),
    stored: localStorage.getItem("happy-learn-colorblind"),
  }));
  if (off.attr || off.stored === "1") {
    throw new Error(`expected off after second click, got ${JSON.stringify(off)}`);
  }
  console.log("PASS: toggle off");

  await browser.close();
  console.log("ALL PASS colorblind e2e");
}

main().catch((err) => {
  console.error("FAIL", err);
  process.exit(1);
});
