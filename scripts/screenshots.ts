import { chromium } from "@playwright/test";

const BASE = "http://localhost:5173";
const OUT = "public/images/screenshots";

const pages = [
  { route: "/",                  file: "homepage.png",     label: "Homepage Hero" },
  { route: "/sign-interpreter",  file: "sign-language.png", label: "Sign Language Interpreter" },
  { route: "/captioner",         file: "captioner.png",    label: "Live Captioner" },
  { route: "/derma-scan",        file: "derma-scan.png",   label: "Derma-Scan" },
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const p of pages) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    console.log(`→ Loading ${p.label}...`);
    await page.goto(`${BASE}${p.route}`, { waitUntil: "load", timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${OUT}/${p.file}`, fullPage: false, timeout: 15000 });
    console.log(`✓ ${p.label} saved`);
    await ctx.close();
  }

  await browser.close();
  console.log("Done — all screenshots captured.");
})();
