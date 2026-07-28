import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright");

const baseURL = process.env.TONE_SOVEREIGN_URL || "http://127.0.0.1:8792/tone_sovereign/";
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 }
];

const browser = await chromium.launch({ channel: "chrome" });
const report = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const failed = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => {
    if (response.status() >= 400) failed.push({ status: response.status(), url: response.url() });
  });
  await page.addInitScript(() => {
    localStorage.setItem("tone-sovereign.preferences.v1", JSON.stringify({
      lang: "en",
      sound: false,
      voice: false,
      reduceMotion: true,
      quietWords: true,
      guidedSitDuration: 900,
      guidedSitGuidance: "off"
    }));
  });
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.waitForTimeout(180);
  await page.getByRole("button", { name: /Enter/i }).click();
  await page.getByRole("button", { name: /Enter the Practice/i }).click();
  await page.getByRole("button", { name: /Guided Sits/i }).first().click();
  const practiceCount = await page.locator("[data-guided-practice]").count();
  await page.screenshot({ path: `/tmp/tone-sovereign-guided-${viewport.name}-catalog.png`, fullPage: true });
  await page.locator("[data-guided-practice]").first().click();
  await page.screenshot({ path: `/tmp/tone-sovereign-guided-${viewport.name}-setup.png`, fullPage: true });
  await page.getByRole("button", { name: /Begin this sit/i }).click();
  await page.waitForTimeout(1150);
  const timerBeforePause = await page.locator("[data-guided-timer]").textContent();
  await page.getByRole("button", { name: /Pause/i }).click();
  await page.waitForTimeout(1150);
  const timerAfterPause = await page.locator("[data-guided-timer]").textContent();
  await page.screenshot({ path: `/tmp/tone-sovereign-guided-${viewport.name}-session.png`, fullPage: true });
  await page.getByRole("button", { name: /End sit/i }).click();
  const completion = await page.getByText("The sit is complete.").isVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  report.push({ viewport: viewport.name, practiceCount, timerBeforePause, timerAfterPause, completion, overflow, errors, failed });
  await page.close();
}

const spanish = await browser.newPage({ viewport: { width: 390, height: 844 } });
await spanish.addInitScript(() => {
  localStorage.setItem("tone-sovereign.preferences.v1", JSON.stringify({
    lang: "es",
    sound: false,
    voice: false,
    reduceMotion: true,
    quietWords: true,
    guidedSitDuration: 1800,
    guidedSitGuidance: "light"
  }));
});
await spanish.goto(baseURL, { waitUntil: "networkidle" });
await spanish.waitForTimeout(180);
await spanish.getByRole("button", { name: /Entrar/i }).click();
await spanish.getByRole("button", { name: /Entrar en la práctica/i }).click();
await spanish.getByRole("button", { name: /Meditaciones guiadas/i }).first().click();
await spanish.locator("[data-guided-practice]").first().click();
report.push({
  viewport: "spanish-mobile",
  title: await spanish.getByText("Respirar en el umbral", { exact: true }).first().textContent(),
  durationSelected: await spanish.locator('[data-guided-duration="1800"]').getAttribute("aria-pressed"),
  guidanceSelected: await spanish.locator('[data-guided-mode="light"]').getAttribute("aria-pressed")
});
await spanish.screenshot({ path: "/tmp/tone-sovereign-guided-spanish-setup.png", fullPage: true });
await spanish.close();

await browser.close();

console.log(JSON.stringify(report, null, 2));
if (report.some(item => item.practiceCount !== undefined && (item.practiceCount !== 8 || !item.completion || item.overflow || item.errors.length || item.failed.length || item.timerBeforePause !== item.timerAfterPause))) {
  process.exitCode = 1;
}
