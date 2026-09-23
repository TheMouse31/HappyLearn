/**
 * Smoke UI: parent premium + foyer PIN + Animer au tableau (local mode).
 * Usage: node scripts/e2e-parents-premium.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("SHOT", file);
  return file;
}

async function waitAppReady(page) {
  await page.waitForFunction(
    () => !document.body?.innerText?.includes("Préparation de Happy Learn"),
    { timeout: 60000 },
  );
}

async function clearStorage(page) {
  await page.goto(BASE + "/");
  await waitAppReady(page);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await waitAppReady(page);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log("BROWSER", msg.text());
  });
  const log = [];

  try {
    await clearStorage(page);
    await page.goto(BASE + "/connexion");
    await waitAppReady(page);
    await shot(page, "parents-01-home-roles.png");
    const homeText = await page.locator("body").innerText();
    log.push("home has parent: " + /parent/i.test(homeText));
    log.push("home has eleve: " + /élève|eleve/i.test(homeText));
    log.push("home has prof: " + /professeur/i.test(homeText));

    await page.goto(BASE + "/connexion/parent");
    await waitAppReady(page);
    await page.locator("#parent-email").fill("parent.demo@example.com");
    await page.getByRole("button", { name: /Essayer en local/i }).click();
    await page.waitForTimeout(1500);
    console.log("after local login url", page.url());
    await shot(page, "parents-02-after-parent-login.png");

    // Activate local premium via evaluate to avoid click hangs on navigation.
    await page.evaluate(async () => {
      const btn = [...document.querySelectorAll("button")].find((b) =>
        /Activer Premium/i.test(b.textContent || ""),
      );
      btn?.click();
    });
    await page.waitForTimeout(2000);
    console.log("after premium click url", page.url());
    await shot(page, "parents-02b-after-premium.png");

    if (page.url().includes("/connexion")) {
      log.push("local login stayed on connexion — seed local teacher");
      await page.evaluate(() => {
        localStorage.setItem(
          "mission-maths-teacher",
          JSON.stringify({
            id: "local-parent-parent.demo@example.com",
            email: "parent.demo@example.com",
            accountRole: "parent",
          }),
        );
      });
      await page.goto(BASE + "/");
      await waitAppReady(page);
      await page.goto(BASE + "/abonnement");
      await waitAppReady(page);
      if (await page.getByRole("button", { name: /Activer Premium/i }).count()) {
        await page.getByRole("button", { name: /Activer Premium/i }).click();
        await page.waitForTimeout(1000);
      }
    }

    await page.goto(BASE + "/espace-parent");
    await waitAppReady(page);
    await page.waitForTimeout(800);
    await shot(page, "parents-03-espace-parent.png");
    console.log("espace-parent url", page.url());

    await page.evaluate(() => {
      const prenom = document.querySelector("#child-prenom");
      const pin = document.querySelector("#child-pin");
      if (prenom instanceof HTMLInputElement) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setter?.call(prenom, "Lina");
        prenom.dispatchEvent(new Event("input", { bubbles: true }));
        prenom.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (pin instanceof HTMLInputElement) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setter?.call(pin, "1234");
        pin.dispatchEvent(new Event("input", { bubbles: true }));
        pin.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const add = [...document.querySelectorAll("button")].find((b) => /^Ajouter$/i.test(b.textContent || ""));
      add?.click();
    });
    await page.waitForTimeout(1000);

    const body = await page.locator("body").innerText();
    const codeMatch = body.match(/Code foyer\s*:\s*([A-Z0-9]+)/i);
    const foyerCode = codeMatch?.[1] ?? null;
    log.push("foyerCode: " + foyerCode);
    log.push("child listed: " + /Lina/.test(body));
    await shot(page, "parents-04-child-added.png");

    if (await page.getByRole("button", { name: /déconnecter/i }).count()) {
      await page.getByRole("button", { name: /déconnecter/i }).click();
      await page.waitForTimeout(800);
    } else {
      await clearStorage(page);
    }

    await page.goto(BASE + "/connexion/eleve");
    await waitAppReady(page);
    await page.getByRole("tab", { name: /maison/i }).click();
    await page.locator("#code-classe").fill(foyerCode || "XXXXXX");
    await page.waitForTimeout(800);
    if (await page.getByRole("option", { name: /Lina/i }).count()) {
      await page.getByRole("option", { name: /Lina/i }).click();
    } else if (await page.getByRole("button", { name: /Lina/i }).count()) {
      await page.getByRole("button", { name: /Lina/i }).click();
    }
    await page.locator("#pin").fill("1234");
    await page.getByRole("button", { name: /^Entrer$/i }).click();
    await page.waitForTimeout(1200);
    await shot(page, "parents-05-child-login.png");
    log.push("child url: " + page.url());
    log.push("child reached accueil: " + page.url().includes("/accueil"));

    await clearStorage(page);
    await page.goto(BASE + "/connexion/enseignant");
    await waitAppReady(page);
    await page.locator("#email").fill("proj.demo@example.com");
    await page.getByRole("button", { name: /Essayer en local/i }).click();
    await page.waitForTimeout(1500);
    console.log("teacher after local url", page.url());
    if (page.url().includes("abonnement") || (await page.locator("body").innerText()).includes("Activer Premium")) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) =>
          /Activer Premium/i.test(b.textContent || ""),
        );
        btn?.click();
      });
      await page.waitForTimeout(2000);
    }
    console.log("teacher after premium url", page.url());
    await page.goto(BASE + "/espace-professeur/session");
    await waitAppReady(page);
    await page.waitForTimeout(1200);
    console.log("session url", page.url());
    await shot(page, "parents-07-animer-tableau.png");
    const sessText = await page.locator("body").innerText();
    log.push("has Animer au tableau: " + /Animer au tableau/i.test(sessText));
    log.push("session page text sample: " + sessText.slice(0, 200).replace(/\s+/g, " "));

    fs.writeFileSync(path.join(OUT, "parents-e2e-log.txt"), log.join("\n") + "\n");
    console.log(log.join("\n"));
    const fails = log.filter((l) => l.endsWith(": false"));
    if (fails.length) {
      console.error("FAILED checks:", fails);
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
