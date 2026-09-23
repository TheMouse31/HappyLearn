/**
 * Regenerate Happy Learn documentation PDFs + offline HTML.
 *
 * Usage: node scripts/generate-docs-pdf.mjs
 * Requires: playwright (+ chromium), python3 + Pillow for compact JPEG embeds.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const ASSETS = path.join(DOCS, "pdf-assets");

const JOBS = [
  {
    source: "HappyLearn-Documentation.html",
    pdf: "HappyLearn-Documentation.pdf",
    aliases: ["HappyLearn_Documentation_Complete.pdf"],
    offline: "HappyLearn_Documentation_offline.html",
  },
  {
    source: "HappyLearn-Guide-Utilisateur.html",
    pdf: "HappyLearn_Guide_Utilisateur.pdf",
    aliases: ["Guide_Utilisateur_HappyLearn.pdf"],
    offline: "HappyLearn_Guide_Utilisateur_offline.html",
  },
  {
    source: "HappyLearn-Themes-Par-Classe-Matiere.html",
    pdf: "HappyLearn_Themes_Par_Classe_Matiere.pdf",
    aliases: ["Themes_Programme_Par_Classe_Matiere.pdf"],
    offline: null,
  },
];

function toJpegDataUri(absPath) {
  const py = `
from PIL import Image
import base64, io, sys
im = Image.open(sys.argv[1]).convert("RGB")
max_w = 1100
if im.width > max_w:
    ratio = max_w / im.width
    im = im.resize((max_w, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
buf = io.BytesIO()
im.save(buf, format="JPEG", quality=65, optimize=True)
print(base64.b64encode(buf.getvalue()).decode("ascii"))
`;
  const r = spawnSync("python3", ["-c", py, absPath], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (r.status !== 0) {
    console.warn("jpeg convert failed for", absPath, r.stderr);
    const buf = fs.readFileSync(absPath);
    const ext = path.extname(absPath).toLowerCase();
    const mime = ext === ".png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  }
  return `data:image/jpeg;base64,${r.stdout.trim()}`;
}

function embedOffline(html) {
  return html.replace(/src="pdf-assets\/([^"]+)"/g, (_m, file) => {
    const abs = path.join(ASSETS, file);
    if (!fs.existsSync(abs)) {
      console.warn("missing asset", file);
      return _m;
    }
    return `src="${toJpegDataUri(abs)}"`;
  });
}

async function printPdf(browser, htmlPath, pdfPath) {
  const page = await browser.newPage();
  const url = pathToFileURL(htmlPath).href;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await page.close();
  const kb = Math.round(fs.statSync(pdfPath).size / 1024);
  console.log(`PDF ${path.basename(pdfPath)} (${kb} KB)`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const job of JOBS) {
    const htmlPath = path.join(DOCS, job.source);
    const pdfPath = path.join(DOCS, job.pdf);
    if (!fs.existsSync(htmlPath)) throw new Error(`missing ${job.source}`);

    // Build compact offline HTML (JPEG embeds) first, then print PDF from it
    // so Chromium embeds small images rather than full PNGs.
    let printSource = htmlPath;
    if (job.offline) {
      const raw = fs.readFileSync(htmlPath, "utf8");
      const offline = embedOffline(raw);
      const offlinePath = path.join(DOCS, job.offline);
      fs.writeFileSync(offlinePath, offline);
      const kb = Math.round(Buffer.byteLength(offline) / 1024);
      console.log(`offline → ${job.offline} (${kb} KB)`);
      printSource = offlinePath;
    }

    await printPdf(browser, printSource, pdfPath);
    for (const alias of job.aliases) {
      fs.copyFileSync(pdfPath, path.join(DOCS, alias));
      console.log(`  alias → ${alias}`);
    }
  }
  await browser.close();
  console.log("ALL DOCS REGENERATED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
