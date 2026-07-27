import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolRoot = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(toolRoot, "..");
const workspaceRoot = resolve(toolRoot, "../../..");
const toneRoot = process.argv[2] ? resolve(process.argv[2]) : join(workspaceRoot, "ToneApp");
const domainRoot = join(toneRoot, "Domain/GoldenAge");
const localizationRoot = join(toneRoot, "Localization");
const temporaryRoot = mkdtempSync(join(tmpdir(), "tone-sovereign-catalog-"));
const executable = join(temporaryRoot, "export-catalog");

const swiftSources = readdirSync(domainRoot)
  .filter(name => name.endsWith(".swift"))
  .map(name => join(domainRoot, name));

execFileSync("swiftc", [...swiftSources, join(toolRoot, "export_catalog.swift"), "-o", executable], {
  env: {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: join(temporaryRoot, "clang-cache"),
    SWIFT_MODULE_CACHE_PATH: join(temporaryRoot, "swift-cache")
  },
  stdio: "inherit"
});

const english = JSON.parse(execFileSync(executable, { encoding: "utf8" }));
const translations = {};
const stringsCatalog = JSON.parse(readFileSync(join(localizationRoot, "Localizable.xcstrings"), "utf8"));

for (const [source, entry] of Object.entries(stringsCatalog.strings || {})) {
  const unit = entry.localizations?.es?.stringUnit;
  if (unit?.state === "translated" && unit.value) translations[source] = unit.value;
}

const spanishSourceRoot = join(localizationRoot, "SpanishSource");
for (const name of readdirSync(spanishSourceRoot).filter(value => value.endsWith(".json"))) {
  const source = JSON.parse(readFileSync(join(spanishSourceRoot, name), "utf8"));
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") translations[key] = value;
  }
}

function translate(value) {
  if (typeof value === "string") return translations[value] || value;
  if (Array.isArray(value)) return value.map(translate);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, translate(item)]));
  }
  return value;
}

const spanish = translate(english);
const expected = { fields: 7, laws: 21, principles: 32, practiceEngines: 12, libraryEntries: 69, sovereignActs: 210 };
for (const [key, count] of Object.entries(expected)) {
  if (english[key]?.length !== count) throw new Error(`Expected ${count} ${key}; found ${english[key]?.length ?? 0}.`);
}

const output = `// Generated from the current ToneApp Golden Age catalogs and Spanish localization sources.\nwindow.TONE_SOVEREIGN_CATALOGS=${JSON.stringify({ en: english, es: spanish })};\n`;
writeFileSync(join(webRoot, "catalog.js"), output);
console.log(`Wrote ${join(webRoot, "catalog.js")} (${Buffer.byteLength(output)} bytes).`);
