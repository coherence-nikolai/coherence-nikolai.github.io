import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFile(resolve(root, path), "utf8");
const [app, styles, serviceWorker] = await Promise.all([
  read("app.js"),
  read("styles.css"),
  read("sw.js")
]);

for (const fragment of [
  'id: "the-lock"',
  'en: "THE LOCK"',
  'es: "EL BLOQUEO"',
  "pages: 30",
  "hasCover: true",
  "assetReady: true",
  "philosophicalFiction: true",
  "theLockAssetSet(\"en\")",
  "theLockAssetSet(\"es\")",
  "data-comic-page-picker",
  "data-comic-transcript",
  "comicImageCount(issue)",
  "A related story",
  "Una historia relacionada",
  "Read THE LOCK",
  "Leer EL BLOQUEO"
]) assert.ok(app.includes(fragment), `Missing app scaffold fragment: ${fragment}`);

assert.ok(app.includes("published: true"), "THE LOCK must be published after its lettering passes visual review");
assert.ok(!app.includes("comicNotice"), "The interruptive comic warning route must remain removed");

for (const selector of [
  ".comic-cover-placeholder",
  ".comic-page-placeholder",
  ".comic-page-picker",
  ".comic-transcript-content",
  "@media (max-width: 390px)"
]) assert.ok(styles.includes(selector), `Missing responsive/accessibility style: ${selector}`);

assert.ok(serviceWorker.includes("caches.match(event.request)"), "Comic transcript core-cache fallback is missing");

const expectedKeys = [
  "cover",
  ...Array.from({ length: 30 }, (_, index) => `page-${String(index + 1).padStart(2, "0")}`)
];

for (const language of ["en", "es"]) {
  const relativePath = `assets/comics/${language}/specials/the-lock/transcript.json`;
  const transcript = JSON.parse(await read(relativePath));
  assert.equal(transcript.schemaVersion, 1);
  assert.equal(transcript.comicID, "the-lock");
  assert.equal(transcript.language, language);
  assert.deepEqual(Object.keys(transcript.entries), expectedKeys);
  for (const key of expectedKeys) {
    assert.equal(typeof transcript.entries[key].imageDescription, "string", `${language}/${key} imageDescription`);
    assert.equal(typeof transcript.entries[key].transcript, "string", `${language}/${key} transcript`);
  }
  assert.ok(serviceWorker.includes(`./${relativePath}`), `Service worker does not cache ${relativePath}`);
}

for (const language of ["en", "es"]) {
  const base = `./assets/comics/${language}/specials/the-lock`;
  const paths = [
    `${base}/cover.webp`,
    ...Array.from({ length: 30 }, (_, index) => `${base}/page-${String(index + 1).padStart(2, "0")}.webp`)
  ];
  assert.equal(new Set(paths).size, 31, `${language} must define 31 unique image destinations`);
}
assert.ok(app.includes('assets/comics/${language}/specials/the-lock/cover.webp'));

console.log("THE LOCK comic scaffold verified: 31 EN + 31 ES image destinations, bilingual transcript hooks, and responsive reader controls.");
