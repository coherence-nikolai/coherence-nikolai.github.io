import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const sw = readFileSync(new URL("../sw.js", import.meta.url), "utf8");

const requiredPairs = [
  ["Too much", "Demasiado"],
  ["Too activated", "Demasiada activación"],
  ["Too far away", "Demasiado lejos"],
  ["Hear this invitation", "Escuchar esta invitación"],
  ["Reset saved practice data?", "¿Borrar los datos guardados de práctica?"],
  ["Nothing resumed by itself.", "Nada se reanudó por sí solo."],
  ["Use this tone", "Usar este tono"],
  ["More doors", "Más puertas"],
  ["Finish here without saving", "Terminar aquí sin guardar"]
];

for (const pair of requiredPairs) {
  for (const fragment of pair) assert.ok(app.includes(fragment), `Missing bilingual roadmap fragment: ${fragment}`);
}

assert.match(app, /entryDelay:\s*2\.60/);
assert.ok(app.indexOf('<section class="door-stack"') < app.indexOf('<button class="orientation-invitation spectrum-row"'), "Primary doors must precede orientation");
assert.ok(!app.includes("window.confirm"), "Reset must not rely on a generic browser confirmation");
const reset = app.slice(app.indexOf('async function eraseData()'), app.indexOf('function readAbout()'));
assert.ok(reset.includes('if (!(await saveCategories('), 'Reset must wait for the validated atomic storage transaction');
assert.ok(reset.indexOf('return;') < reset.indexOf('state.traces = []'), 'A failed reset must return before clearing in-memory material');
assert.ok(!reset.includes('removeItem('), 'Reset must not bypass recoverable transaction handling');
assert.match(app, /data-practice-guidance="quiet"/);
assert.match(app, /data-breath-duration="\$\{seconds\}"/);
assert.match(app, /crossFocuses\.slice\(0, 6\)/);
assert.match(app, /embodyStage === "remembered"/);
assert.match(app, /function focusCurrentView\(\)/);
assert.match(app, /state\.practice\.interrupted = true/);
assert.match(css, /\.ceremony\.is-playing\.entry-ready \.landing-actions/);
assert.match(css, /\.practice-duration/);
assert.match(css, /\.reset-confirmation/);
assert.match(sw, /const CACHE = "tone-sovereign-v36"/);

const forbiddenAutomaticCalls = [
  /render\(\);\s*playCapacityStageVoice\(/,
  /render\(\);\s*playEngineStageVoice\(/,
  /stage = "close";\s*sound\.playVoice\("ts_cross_return_v1"/,
  /embodyStage = "after";\s*render\(\);\s*sound\.playVoice/
];
for (const pattern of forbiddenAutomaticCalls) assert.ok(!pattern.test(app), `Automatic narration remains: ${pattern}`);

console.log("Governed web roadmap checks passed.");
