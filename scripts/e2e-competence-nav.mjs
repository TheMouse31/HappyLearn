/**
 * Smoke: connexion hub + nav compétence (fractions vs calcul mental).
 * Usage: node scripts/e2e-competence-nav.mjs
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const BASE = process.env.HL_BASE_URL || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });

async function ready(page) {
  await page.waitForFunction(
    () => !document.body?.innerText?.includes("Préparation de Happy Learn"),
    { timeout: 60000 },
  );
}

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("SHOT", file);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const log = [];

  try {
    await page.goto(BASE + "/");
    await ready(page);
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await ready(page);

    await shot(page, "nav-01-home-cta.png");
    const home = await page.locator("body").innerText();
    log.push("home has Se connecter: " + /Se connecter/i.test(home));
    log.push("home has no role grid: " + !/Je suis un élève/i.test(home));

    await page.goto(BASE + "/connexion");
    await ready(page);
    await page.waitForTimeout(400);
    await shot(page, "nav-02-connexion-hub.png");
    const hub = await page.locator("body").innerText();
    log.push("hub Qui es-tu: " + /Qui es-tu/i.test(hub));
    log.push("hub no Retour à l’accueil: " + !/Retour à l’accueil/i.test(hub));

    await page.getByRole("link", { name: /^Élève/i }).click();
    await ready(page);
    await page.waitForTimeout(300);
    await shot(page, "nav-03-eleve-login.png");
    // libre sans code
    const prenom = page.locator("#prenom");
    if (await prenom.count()) {
      await prenom.fill("Léo");
      await page.getByRole("button", { name: /^Entrer$/i }).click();
      await page.waitForTimeout(800);
    }

    await page.goto(BASE + "/classe");
    await ready(page);
    await page.getByRole("button", { name: /CM2/i }).click();
    await page.getByRole("button", { name: /Mathématiques/i }).click();
    await page.getByRole("button", { name: /^Continuer$/i }).click();
    await page.waitForTimeout(800);
    await shot(page, "nav-04-competence.png");
    const comp = await page.locator("body").innerText();
    log.push("competence screen: " + /Quelle compétence/i.test(comp));
    log.push("has Fractions: " + /Fractions/i.test(comp));
    log.push("has Calcul mental: " + /Calcul mental/i.test(comp));
    log.push("no Accueil button: " + !/\nAccueil\n|⌂ Accueil/.test(comp));

    await page.getByRole("option", { name: /Fractions/i }).click();
    await page.waitForTimeout(700);
    await shot(page, "nav-05-missions-fractions.png");
    const frac = await page.locator("body").innerText();
    log.push("fractions football: " + /Football|terrain/i.test(frac));
    log.push("fractions rugby: " + /Rugby|mêlée/i.test(frac));
    log.push("fractions equitation: " + /Équitation|écurie/i.test(frac));
    log.push("fractions no espace offer: " + !/Commandes orbitales|Insigne orbital/i.test(frac));

    await page.getByRole("button", { name: /Autre compétence/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole("option", { name: /Calcul mental/i }).click();
    await page.waitForTimeout(700);
    await shot(page, "nav-06-missions-calcul.png");
    const calc = await page.locator("body").innerText();
    log.push("calcul football: " + /Football|Stats flash/i.test(calc));
    log.push("calcul espace: " + /Espace|orbital/i.test(calc));
    log.push("calcul no rugby: " + !/Rugby|mêlée/i.test(calc));

    // pick fractions mission then mode
    await page.getByRole("button", { name: /Autre compétence/i }).click();
    await page.waitForTimeout(400);
    await page.getByRole("option", { name: /Fractions/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole("option", { name: /terrain|Football/i }).first().click();
    await page.waitForTimeout(600);
    await shot(page, "nav-07-mode.png");
    await page.getByRole("button", { name: /Sans cahier|QCM/i }).click();
    await page.getByRole("button", { name: /^Continuer$/i }).click();
    await page.waitForTimeout(600);
    await shot(page, "nav-08-ready.png");

    fs.writeFileSync(path.join(OUT, "nav-competence-e2e-log.txt"), log.join("\n") + "\n");
    console.log(log.join("\n"));
    const fails = log.filter((l) => l.endsWith(": false"));
    if (fails.length) {
      console.error("FAILED", fails);
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
