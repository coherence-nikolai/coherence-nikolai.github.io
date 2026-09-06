/** Dependency-free proposal. No DOM, network, automatic persistence or logging. */
export const STORAGE = Object.freeze({
  preferences: "tone-sovereign.preferences.v1",
  traces: "tone-sovereign.traces.v1",
  carriedAct: "tone-sovereign.carried-act.v1",
  ruleOfLife: "tone-sovereign.rule-of-life.v1",
  engineDrafts: "tone-sovereign.practice-engine-drafts.v1",
  missions: "tone-sovereign.missions.v1",
  crossMarks: "tone-sovereign.cross-marks.v1",
  lastHeldTone: "tone-sovereign.last-held-tone.v1"
});
export const JOURNAL_KEY = "tone-sovereign.pending-transaction.v1";
export const BACKUP_VERSION = 4;
export const CATEGORIES = Object.freeze(Object.keys(STORAGE));
export const DEFAULT_EXPORT_CATEGORIES = Object.freeze(CATEGORIES.filter(key => key !== "engineDrafts"));
const APP = "Tone Sovereign";
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const clone = value => JSON.parse(JSON.stringify(value));
const failure = (code, extra = {}) => ({ ok: false, error: { code, ...extra } });
const defaults = () => ({ preferences: {}, traces: [], carriedAct: null,
  ruleOfLife: { principleIDs: [], commitmentIDs: [] }, engineDrafts: {},
  missions: [], crossMarks: [], lastHeldTone: null });

export class StateValidationError extends Error {
  constructor(code, location = "") {
    super(code); this.name = "StateValidationError"; this.code = code; this.location = location;
  }
}
function requireValue(condition, location, code = "invalid-schema") {
  if (!condition) throw new StateValidationError(code, location);
}
function object(value, location) {
  requireValue(value !== null && typeof value === "object" && !Array.isArray(value), location);
  const prototype = Object.getPrototypeOf(value);
  requireValue(prototype === Object.prototype || prototype === null, location);
}
function string(value, location, { nonempty = false } = {}) {
  requireValue(typeof value === "string" && (!nonempty || value.length > 0), location);
}
function integer(value, location) { requireValue(Number.isSafeInteger(value) && value >= 0, location); }
function date(value, location) {
  string(value, location);
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  requireValue(Boolean(match), location);
  const [year, month, day, hour, minute, second, offsetHour, offsetMinute] = match.slice(1).map(part => part === undefined ? 0 : Number(part));
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLength = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  requireValue(month >= 1 && month <= 12 && day >= 1 && day <= monthLength && hour <= 23 && minute <= 59 && second <= 59 && offsetHour <= 23 && offsetMinute <= 59 && Number.isFinite(Date.parse(value)), location);
}
function optional(record, key, check, location) {
  if (own(record, key)) check(record[key], `${location}.${key}`);
}
function stringArray(value, location) {
  requireValue(Array.isArray(value), location);
  value.forEach((entry, index) => string(entry, `${location}[${index}]`));
}
// Reject unsafe/non-JSON values; retain harmless extension fields rather than dropping them.
function safeJSON(value, location = "$", depth = 0, budget = { nodes: 0 }) {
  requireValue(depth <= 30 && ++budget.nodes <= 200000, location, "data-too-complex");
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "string") {
    requireValue(value.length <= 1000000, location, "field-too-large"); return;
  }
  if (typeof value === "number") { requireValue(Number.isFinite(value), location); return; }
  requireValue(typeof value === "object", location);
  if (!Array.isArray(value)) object(value, location);
  else requireValue(Object.keys(value).length === value.length && Array.from({ length: value.length }, (_, index) => own(value, index)).every(Boolean), location);
  for (const key of Object.keys(value)) {
    requireValue(!["__proto__", "prototype", "constructor"].includes(key), location, "unsafe-key");
    safeJSON(value[key], `${location}.${key}`, depth + 1, budget);
  }
}

export function validateCategory(category, value) {
  requireValue(own(STORAGE, category), category, "unknown-category");
  safeJSON(value, category);
  if (category === "preferences") {
    object(value, category);
    optional(value, "lang", (v, p) => requireValue(["en", "es"].includes(v), p), category);
    for (const key of ["sound", "voice", "reduceMotion", "quietWords", "illustrationsEnabled", "guidedSitBackgroundTone", "guidedSitIntroduction"])
      optional(value, key, (v, p) => requireValue(typeof v === "boolean", p), category);
    optional(value, "guidedSitDuration", (v, p) => requireValue(Number.isSafeInteger(v) && v > 0 && v <= 86400, p), category);
    optional(value, "guidedSitGuidance", (v, p) => requireValue(["regular", "light", "off"].includes(v), p), category);
  } else if (category === "lastHeldTone") {
    requireValue(value === null || typeof value === "string", category);
  } else if (category === "carriedAct") {
    if (value !== null) integer(value, category);
  } else if (category === "ruleOfLife") {
    object(value, category); stringArray(value.principleIDs, `${category}.principleIDs`);
    stringArray(value.commitmentIDs, `${category}.commitmentIDs`);
  } else if (category === "engineDrafts") {
    object(value, category);
    for (const [engine, responses] of Object.entries(value)) {
      object(responses, `${category}.${engine}`);
      for (const [step, response] of Object.entries(responses)) string(response, `${category}.${engine}.${step}`);
    }
  } else {
    requireValue(Array.isArray(value), category);
    requireValue(value.length <= 10000, category, "too-many-records");
    value.forEach((record, index) => {
      const at = `${category}[${index}]`; object(record, at);
      if (category === "traces") {
        string(record.id, `${at}.id`, { nonempty: true });
        string(record.title, `${at}.title`); date(record.createdAt, `${at}.createdAt`);
        optional(record, "detail", string, at); optional(record, "type", string, at);
      } else if (category === "missions") {
        string(record.id, `${at}.id`, { nonempty: true });
        string(record.title, `${at}.title`); string(record.direction, `${at}.direction`);
        for (const key of ["nextVisibleStep", "sustainabilityNote", "principleID"]) optional(record, key, string, at);
        optional(record, "updatedAt", date, at);
      } else {
        // Old Cross marks may lack an id; question text is their existing identity fallback.
        string(record.question, `${at}.question`);
        for (const key of ["id", "focus", "questionKey"]) optional(record, key, string, at);
        for (const key of ["questionIndex", "returnCount"]) optional(record, key, integer, at);
        optional(record, "savedAt", date, at);
        for (const key of ["lastReturn", "lastCrossing"]) optional(record, key, (v, p) => { if (v !== null) date(v, p); }, at);
      }
    });
  }
  return value;
}

function categoriesFrom(document) { return CATEGORIES.filter(key => own(document, key)); }
function categorySelection(categories, available = CATEGORIES) {
  requireValue(Array.isArray(categories) && new Set(categories).size === categories.length, "categories");
  for (const key of categories) requireValue(available.includes(key), "categories", "unknown-category");
  return categories;
}

/** Parses only. Does not restore, truncate, repair, infer IDs, or change user text. */
export function parseBackup(input, { maxBytes = 20 * 1024 * 1024 } = {}) {
  let document;
  if (typeof input === "string") {
    requireValue(new TextEncoder().encode(input).byteLength <= maxBytes, "$", "backup-too-large");
    try { document = JSON.parse(input); } catch { throw new StateValidationError("invalid-json"); }
  } else {
    safeJSON(input);
    requireValue(new TextEncoder().encode(JSON.stringify(input)).byteLength <= maxBytes, "$", "backup-too-large");
    document = clone(input);
  }
  safeJSON(document); object(document, "$");
  requireValue(document.app === APP, "app", "wrong-app");
  const version = own(document, "version") ? document.version : 1;
  requireValue(Number.isSafeInteger(version) && version >= 1, "version");
  requireValue(version <= BACKUP_VERSION, "version", "unsupported-version");
  optional(document, "exportedAt", date, "$");
  const categories = categoriesFrom(document);
  if (version < 4) requireValue(Array.isArray(document.traces), "traces");
  else {
    categorySelection(document.includedCategories);
    requireValue(categories.length === document.includedCategories.length && categories.every(key => document.includedCategories.includes(key)), "includedCategories", "category-mismatch");
  }
  requireValue(categories.length > 0, "$", "empty-backup");
  const data = {};
  for (const category of categories) data[category] = clone(validateCategory(category, document[category]));
  return { version, data, categories, document };
}

/** Saved drafts require an explicit checkbox; ephemeral current practice is never included. */
export function createBackup(snapshot, { categories = DEFAULT_EXPORT_CATEGORIES, exportedAt = new Date().toISOString() } = {}) {
  object(snapshot, "snapshot"); categorySelection(categories); date(exportedAt, "exportedAt");
  const backup = { app: APP, version: BACKUP_VERSION, exportedAt, includedCategories: [...categories] };
  for (const category of categories) {
    requireValue(own(snapshot, category), category, "missing-category");
    backup[category] = clone(validateCategory(category, snapshot[category]));
  }
  return backup;
}

/** Explicit replacement of selected categories only; absent legacy fields stay untouched. */
export function planRestore(parsed, current, { categories = parsed.categories, mode } = {}) {
  requireValue(mode === "replace-selected", "mode", "confirmation-required");
  categorySelection(categories, parsed.categories);
  const next = clone(current); const patch = {}; const summary = [];
  for (const category of categories) {
    validateCategory(category, current[category]);
    validateCategory(category, parsed.data[category]);
    // v1–v3 preferences omit guided-sit choices; preserve those omissions.
    const incoming = category === "preferences"
      ? { ...current.preferences, ...parsed.data.preferences } : parsed.data[category];
    next[category] = clone(incoming); patch[category] = clone(incoming);
    const count = value => Array.isArray(value) ? value.length : value === null ? 0 : typeof value === "object" ? Object.keys(value).length : 1;
    summary.push({ category, before: count(current[category]), after: count(incoming), action: category === "preferences" ? "restore-provided-settings" : "replace-selected-category" });
  }
  return { next, patch, summary, categories: [...categories] };
}

function decode(category, raw) {
  if (raw === null) return defaults()[category];
  if (category === "lastHeldTone") return raw;
  if (category === "carriedAct") {
    requireValue(/^\d+$/.test(raw), category); return Number(raw);
  }
  return JSON.parse(raw);
}
function encode(category, value) {
  if ((category === "lastHeldTone" || category === "carriedAct") && value === null) return null;
  return category === "lastHeldTone" || category === "carriedAct" ? String(value) : JSON.stringify(value);
}
function writeRaw(storage, key, raw) { if (raw === null) storage.removeItem(key); else storage.setItem(key, raw); }

/** Does not hide corrupt stored data behind defaults and then overwrite it. */
export function readPersistentState(storage) {
  const value = defaults(); const raw = {};
  for (const category of CATEGORIES) {
    let stored;
    try { stored = storage.getItem(STORAGE[category]); }
    catch { return failure("storage-read-failed", { category }); }
    raw[STORAGE[category]] = stored;
    try { value[category] = clone(validateCategory(category, decode(category, stored))); }
    catch { return failure("stored-data-invalid", { category }); }
  }
  return { ok: true, value, raw };
}

function validateJournal(journal) {
  object(journal, "journal");
  requireValue(Object.keys(journal).length === 6 && Object.keys(journal).every(key => ["app", "version", "id", "phase", "before", "after"].includes(key)), "journal");
  requireValue(journal.app === APP && journal.version === 1 && ["prepared", "committed"].includes(journal.phase), "journal");
  string(journal.id, "journal.id", { nonempty: true }); object(journal.before, "journal.before"); object(journal.after, "journal.after");
  const keys = Object.keys(journal.before);
  requireValue(keys.length > 0 && keys.length === Object.keys(journal.after).length, "journal.keys");
  for (const key of keys) {
    requireValue(Object.values(STORAGE).includes(key) && own(journal.after, key), "journal.keys");
    requireValue([journal.before[key], journal.after[key]].every(v => v === null || typeof v === "string"), "journal.values");
  }
}
function rollback(storage, journal) {
  const keys = Object.keys(journal.before);
  // Never overwrite an unexpected update from another tab/old app version.
  try {
    if (keys.some(key => ![journal.before[key], journal.after[key]].includes(storage.getItem(key)))) return failure("recovery-conflict");
  } catch { return failure("recovery-read-failed"); }
  const failedKeys = [];
  for (const key of keys.reverse()) {
    try {
      const current = storage.getItem(key);
      if (current === journal.before[key]) continue;
      if (current !== journal.after[key]) { failedKeys.push(key); continue; }
      writeRaw(storage, key, journal.before[key]);
      if (storage.getItem(key) !== journal.before[key]) failedKeys.push(key);
    } catch { failedKeys.push(key); }
  }
  return failedKeys.length ? failure("rollback-incomplete", { failedKeys }) : { ok: true };
}

/** Call under the same Web Lock at startup, before enabling any saving/reset/import. */
export function recoverTransaction(storage) {
  let raw;
  try { raw = storage.getItem(JOURNAL_KEY); } catch { return failure("storage-read-failed"); }
  if (raw === null) return { ok: true, recovered: "none" };
  let journal;
  try { journal = JSON.parse(raw); validateJournal(journal); } catch { return failure("invalid-recovery-journal"); }
  if (journal.phase === "prepared") {
    const result = rollback(storage, journal); if (!result.ok) return result;
  }
  try { storage.removeItem(JOURNAL_KEY); }
  catch { return failure("recovery-cleanup-failed", { dataRestored: journal.phase === "prepared", dataCommitted: journal.phase === "committed" }); }
  return { ok: true, recovered: journal.phase === "prepared" ? "rolled-back" : "committed" };
}

/**
 * Synchronous transaction; call inside withStorageLock for cooperative cross-tab safety.
 * Never mutates application state. Only apply UI state after result.ok is true.
 * Multi-key localStorage is not natively atomic: prepared journal + rollback/recovery
 * make interrupted writes recoverable. Persistent denial can still require user recovery.
 */
export function transact(storage, patch, { expectedRaw, transactionID = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}` } = {}) {
  let entries;
  try {
    object(patch, "patch"); categorySelection(Object.keys(patch));
    entries = Object.entries(patch).map(([category, value]) => [STORAGE[category], encode(category, validateCategory(category, value))]);
  } catch (error) { return failure(error.code || "invalid-schema", { location: error.location }); }
  let before;
  try {
    if (storage.getItem(JOURNAL_KEY) !== null) return failure("recovery-required");
    if (expectedRaw && Object.entries(expectedRaw).some(([key, raw]) => !Object.values(STORAGE).includes(key) || storage.getItem(key) !== raw)) return failure("storage-conflict");
    before = Object.fromEntries(entries.map(([key]) => [key, storage.getItem(key)]));
  } catch { return failure("storage-read-failed"); }
  const changes = entries.filter(([key, raw]) => before[key] !== raw);
  if (!changes.length) return { ok: true, changed: false, cleanupPending: false };
  // A single localStorage set/remove is already atomic; avoid duplicate quota use.
  if (changes.length === 1) {
    try { writeRaw(storage, ...changes[0]); return { ok: true, changed: true, cleanupPending: false }; }
    catch { return failure("storage-write-failed", { rolledBack: true }); }
  }
  const journal = { app: APP, version: 1, id: transactionID, phase: "prepared",
    before: Object.fromEntries(changes.map(([key]) => [key, before[key]])), after: Object.fromEntries(changes) };
  try { storage.setItem(JOURNAL_KEY, JSON.stringify(journal)); }
  catch { return failure("journal-write-failed", { rolledBack: true }); }
  try {
    for (const [key, raw] of changes) writeRaw(storage, key, raw);
    storage.setItem(JOURNAL_KEY, JSON.stringify({ ...journal, phase: "committed" }));
  } catch {
    const restored = rollback(storage, journal);
    if (!restored.ok) return failure("recovery-required", { recoveryCode: restored.error.code, rolledBack: false });
    try { storage.removeItem(JOURNAL_KEY); }
    catch { return failure("recovery-required", { recoveryCode: "recovery-cleanup-failed", rolledBack: true }); }
    return failure("storage-write-failed", { rolledBack: true });
  }
  try { storage.removeItem(JOURNAL_KEY); return { ok: true, changed: true, cleanupPending: false }; }
  catch { return { ok: true, changed: true, cleanupPending: true }; }
}

/** Pass navigator.locks explicitly; no browser global/property is touched at import. */
export async function withStorageLock(work, lockManager) {
  if (lockManager?.request) return lockManager.request("tone-sovereign:persistent-state", { mode: "exclusive" }, () => work());
  return work(); // Documented best-effort fallback; not a cross-tab atomicity claim.
}

/** Local civil Monday; UTC arithmetic avoids daylight-saving 23/25-hour drift. */
export function weeklyPrompt(prompts, at = new Date(), { order } = {}) {
  requireValue(at instanceof Date && Number.isFinite(at.getTime()), "date", "invalid-date");
  requireValue(Array.isArray(prompts) && prompts.length > 0, "prompts");
  const byID = new Map();
  for (const prompt of prompts) {
    object(prompt, "prompt"); string(prompt.id, "prompt.id", { nonempty: true });
    requireValue(!byID.has(prompt.id), "prompt.id", "duplicate-id"); byID.set(prompt.id, prompt);
  }
  const ids = order ? [...order] : [...byID.keys()].sort();
  requireValue(ids.length === prompts.length && new Set(ids).size === ids.length && ids.every(id => byID.has(id)), "order");
  const civil = new Date(0); civil.setUTCFullYear(at.getFullYear(), at.getMonth(), at.getDate()); civil.setUTCHours(0, 0, 0, 0);
  const daysSinceMonday = (civil.getUTCDay() + 6) % 7;
  civil.setUTCDate(civil.getUTCDate() - daysSinceMonday);
  const week = Math.floor((civil.getTime() - Date.UTC(1970, 0, 5)) / 604800000);
  const index = ((week % ids.length) + ids.length) % ids.length;
  return { prompt: byID.get(ids[index]), index, weekKey: civil.toISOString().slice(0, 10) };
}
