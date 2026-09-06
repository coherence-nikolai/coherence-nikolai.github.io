import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { STORAGE, JOURNAL_KEY, CATEGORIES, StateValidationError, validateCategory,
  parseBackup, createBackup, planRestore, readPersistentState, recoverTransaction,
  transact, withStorageLock, weeklyPrompt } from '../tone-state.mjs';

const stamp = '2026-09-06T05:00:00.000Z';
const sample = () => ({
  preferences: { lang: 'es', sound: false, voice: true, reduceMotion: true, quietWords: false,
    illustrationsEnabled: false, guidedSitDuration: 300, guidedSitGuidance: 'light',
    guidedSitBackgroundTone: false, guidedSitIntroduction: true, futureSetting: 'preserve' },
  traces: [{ id: 'trace-1', title: 'Una decisión, no un diagnóstico', detail: 'áéíóú — ✨',
    createdAt: stamp, type: 'practice', sourceID: 'stable-legacy-id' }],
  carriedAct: 209,
  ruleOfLife: { principleIDs: ['p1'], commitmentIDs: ['c2'], futureField: 'preserve' },
  engineDrafts: { discern: { evidence: 'Lo que ocurrió', unknown: '' } },
  missions: [{ id: 'm1', title: 'Mi rumbo', direction: 'Con calma', nextVisibleStep: 'Una llamada',
    sustainabilityNote: '', principleID: 'p1', updatedAt: stamp, extension: { keep: true } }],
  crossMarks: [{ id: 'cross-1', question: '¿Qué queda abierto?', focus: 'relation',
    questionKey: 'q1', questionIndex: 1, savedAt: stamp, returnCount: 2,
    lastReturn: stamp, lastCrossing: null }],
  lastHeldTone: 'future-tone-not-in-this-catalogue'
});
function memory(initial = {}) {
  const map = new Map(Object.entries(initial));
  const operations = [];
  return {
    map, operations, fail: null,
    getItem(key) { operations.push(['get', key]); this.fail?.('get', key); return map.get(key) ?? null; },
    setItem(key, value) { operations.push(['set', key, String(value)]); this.fail?.('set', key, String(value)); map.set(key, String(value)); },
    removeItem(key) { operations.push(['remove', key]); this.fail?.('remove', key); map.delete(key); }
  };
}
function rawState(state = sample()) {
  return Object.fromEntries(CATEGORIES.flatMap(category => {
    const value = state[category];
    if (value === null && ['carriedAct', 'lastHeldTone'].includes(category)) return [];
    return [[STORAGE[category], ['carriedAct', 'lastHeldTone'].includes(category) ? String(value) : JSON.stringify(value)]];
  }));
}
function failOnce(storage, predicate) {
  let fired = false;
  storage.fail = (...args) => { if (!fired && predicate(...args)) { fired = true; throw new Error('simulated storage failure'); } };
}
function expectCode(work, code) {
  assert.throws(work, error => error instanceof StateValidationError && error.code === code);
}
function journal(phase = 'prepared', before = { [STORAGE.lastHeldTone]: 'old', [STORAGE.carriedAct]: '4' }, after = { [STORAGE.lastHeldTone]: 'new', [STORAGE.carriedAct]: '5' }) {
  return { app: 'Tone Sovereign', version: 1, id: 'test-transaction', phase, before, after };
}
const restore = (parsed, current, options = {}) => planRestore(parsed, current, { mode: 'replace-selected', ...options });

test('complete v4 roundtrip retains all preferences, tone, explicit drafts and extension fields', () => {
  const source = sample();
  const backup = createBackup(source, { categories: CATEGORIES, exportedAt: stamp });
  const parsed = parseBackup(JSON.stringify(backup));
  assert.equal(parsed.version, 4);
  assert.deepEqual(parsed.data, source);
  assert.equal(parsed.data.preferences.illustrationsEnabled, false);
  assert.deepEqual(restore(parsed, readPersistentState(memory()).value).next, source);
});
test('default backup includes remembered tone, carried act and all settings but not saved drafts', () => {
  const backup = createBackup(sample(), { exportedAt: stamp });
  assert.equal(backup.lastHeldTone, sample().lastHeldTone);
  assert.equal(backup.carriedAct, 209);
  assert.deepEqual(backup.preferences, sample().preferences);
  assert.equal(Object.hasOwn(backup, 'engineDrafts'), false);
  assert.equal(backup.includedCategories.includes('engineDrafts'), false);
});
test('legacy v1 (missing version), v2 and v3 accept original structure', () => {
  for (const version of [undefined, 2, 3]) {
    const backup = { app: 'Tone Sovereign', traces: sample().traces };
    if (version !== undefined) backup.version = version;
    assert.deepEqual(parseBackup(backup).data.traces, sample().traces);
  }
});
test('legacy partial settings restore and absent categories preserve all existing data', () => {
  const current = sample();
  const parsed = parseBackup({ app: 'Tone Sovereign', version: 3, traces: [], preferences: { lang: 'en', voice: false } });
  const plan = restore(parsed, current);
  assert.equal(plan.next.preferences.lang, 'en');
  assert.equal(plan.next.preferences.guidedSitGuidance, 'light');
  assert.equal(plan.next.preferences.illustrationsEnabled, false);
  for (const category of CATEGORIES.filter(key => !['traces', 'preferences'].includes(key))) assert.deepEqual(plan.next[category], current[category]);
  assert.deepEqual(Object.keys(plan.patch), ['preferences', 'traces']);
});
test('restore is explicit, category-selectable, pure and does not leak values into preview counts', () => {
  const current = sample(); const original = structuredClone(current);
  const parsed = parseBackup(createBackup(current, { categories: CATEGORIES, exportedAt: stamp }));
  expectCode(() => planRestore(parsed, current), 'confirmation-required');
  const plan = restore(parsed, current, { categories: ['traces'] });
  assert.deepEqual(Object.keys(plan.patch), ['traces']);
  assert.deepEqual(current, original);
  assert.deepEqual(plan.summary, [{ category: 'traces', before: 1, after: 1, action: 'replace-selected-category' }]);
});
test('explicit null remembered tone clears only the selected tone', () => {
  const parsed = parseBackup({ app: 'Tone Sovereign', version: 4, includedCategories: ['lastHeldTone'], lastHeldTone: null });
  const plan = restore(parsed, sample());
  assert.equal(plan.next.lastHeldTone, null);
  assert.deepEqual(plan.next.traces, sample().traces);
});
test('malformed, wrong-app, unsupported-future and blank backups fail before any restore', () => {
  for (const input of ['', ' ', '{broken']) expectCode(() => parseBackup(input), 'invalid-json');
  expectCode(() => parseBackup({ app: 'Other', traces: [] }), 'wrong-app');
  expectCode(() => parseBackup({ app: 'Tone Sovereign', version: 5, traces: [] }), 'unsupported-version');
  expectCode(() => parseBackup({ app: 'Tone Sovereign', version: 4, includedCategories: [] }), 'empty-backup');
});
test('v4 category manifest cannot omit or invent a category', () => {
  expectCode(() => parseBackup({ app: 'Tone Sovereign', version: 4, includedCategories: [], traces: [] }), 'category-mismatch');
  expectCode(() => parseBackup({ app: 'Tone Sovereign', version: 4, includedCategories: ['traces', 'traces'], traces: [] }), 'invalid-schema');
  expectCode(() => parseBackup({ app: 'Tone Sovereign', version: 4, includedCategories: ['cookies'], cookies: [] }), 'unknown-category');
});
test('backup size, unsafe keys and non-JSON input are rejected without exposing text', () => {
  expectCode(() => parseBackup(JSON.stringify(createBackup(sample())), { maxBytes: 10 }), 'backup-too-large');
  expectCode(() => parseBackup('{"app":"Tone Sovereign","traces":[],"__proto__":{"polluted":true}}'), 'unsafe-key');
  expectCode(() => parseBackup({ app: 'Tone Sovereign', traces: [], extra: undefined }), 'invalid-schema');
  expectCode(() => validateCategory('traces', new Array(1)), 'invalid-schema');
  assert.equal({}.polluted, undefined);
});
test('strict records reject invalid date, preference type and bad mission without dropping them', () => {
  for (const date of ['2026-02-30T01:00:00Z', '2026-13-01T00:00:00Z', 'not-a-date']) {
    const state = sample(); state.traces[0].createdAt = date;
    expectCode(() => createBackup(state), 'invalid-schema');
  }
  assert.equal(validateCategory('traces', [{ id: 'leap', title: '', createdAt: '2024-02-29T00:00:00Z' }]).length, 1);
  expectCode(() => validateCategory('preferences', { illustrationsEnabled: 'false' }), 'invalid-schema');
  expectCode(() => validateCategory('missions', [{ id: 'm', title: 'keep' }]), 'invalid-schema');
});
test('import does not truncate valid history at old UI limits of 100 traces or 30 questions', () => {
  const state = sample();
  state.traces = Array.from({ length: 130 }, (_, index) => ({ ...state.traces[0], id: `t${index}` }));
  state.crossMarks = Array.from({ length: 35 }, (_, index) => ({ question: `Question ${index}` }));
  const parsed = parseBackup(createBackup(state));
  assert.equal(parsed.data.traces.length, 130); assert.equal(parsed.data.crossMarks.length, 35);
});
test('existing raw storage format roundtrips without migrating its keys', () => {
  const store = memory(rawState()); const read = readPersistentState(store);
  assert.equal(read.ok, true); assert.deepEqual(read.value, sample());
  assert.equal(transact(store, read.value).changed, false);
  assert.equal(store.operations.some(([operation]) => operation !== 'get'), false);
});
test('blocked and malformed storage are reported and never silently overwritten', () => {
  const store = memory({ [STORAGE.traces]: '{broken' });
  const read = readPersistentState(store); assert.equal(read.error.code, 'stored-data-invalid');
  assert.equal(store.map.get(STORAGE.traces), '{broken');
  assert.equal(store.operations.some(([operation]) => operation !== 'get'), false);
  store.fail = () => { throw new Error('denied'); };
  assert.equal(readPersistentState(store).error.code, 'storage-read-failed');
});
test('single-key failure does not mutate persisted or application state', () => {
  const store = memory(rawState()); const ui = sample(); const old = structuredClone(ui);
  const candidate = [{ ...ui.traces[0], id: 'new' }, ...ui.traces];
  failOnce(store, (operation, key) => operation === 'set' && key === STORAGE.traces);
  const result = transact(store, { traces: candidate });
  if (result.ok) ui.traces = candidate;
  assert.equal(result.ok, false); assert.deepEqual(ui, old); assert.deepEqual(readPersistentState(store).value, old);
  assert.equal(store.map.has(JOURNAL_KEY), false);
});
test('multi-key transaction commits and removes its journal', () => {
  const store = memory(rawState());
  assert.equal(transact(store, { lastHeldTone: 'calm', carriedAct: 2 }).ok, true);
  assert.equal(store.map.get(STORAGE.lastHeldTone), 'calm'); assert.equal(store.map.get(STORAGE.carriedAct), '2');
  assert.equal(store.map.has(JOURNAL_KEY), false);
});
test('journal preparation failure leaves every user key unchanged', () => {
  const before = rawState(); const store = memory(before);
  failOnce(store, (operation, key) => operation === 'set' && key === JOURNAL_KEY);
  assert.equal(transact(store, { lastHeldTone: 'new', carriedAct: 2 }).error.code, 'journal-write-failed');
  assert.deepEqual(Object.fromEntries(store.map), before);
  assert.equal(store.operations.filter(([operation, key]) => operation === 'set' && key !== JOURNAL_KEY).length, 0);
});
test('middle write failure rolls back exact original bytes and originally absent keys', () => {
  const before = { [STORAGE.carriedAct]: '004' }; const store = memory(before);
  failOnce(store, (operation, key) => operation === 'set' && key === STORAGE.carriedAct);
  const result = transact(store, { lastHeldTone: 'new', carriedAct: 2 });
  assert.equal(result.error.rolledBack, true); assert.deepEqual(Object.fromEntries(store.map), before);
});
test('commit marker failure rolls back even after all user keys were written', () => {
  const before = rawState(); const store = memory(before);
  failOnce(store, (operation, key, value) => operation === 'set' && key === JOURNAL_KEY && JSON.parse(value).phase === 'committed');
  const result = transact(store, { lastHeldTone: 'new', carriedAct: 2 });
  assert.equal(result.ok, false); assert.equal(result.error.rolledBack, true);
  assert.deepEqual(Object.fromEntries(store.map), before);
});
test('persistent denial retains recovery journal; writes remain blocked until recovery', () => {
  const store = memory(rawState()); let denied = false;
  store.fail = (operation, key) => {
    if (operation === 'set' && key === STORAGE.carriedAct) denied = true;
    if (denied && operation !== 'get') throw new Error('persistent denial');
  };
  assert.equal(transact(store, { lastHeldTone: 'new', carriedAct: 2 }).error.code, 'recovery-required');
  assert.equal(store.map.has(JOURNAL_KEY), true);
  assert.equal(transact(store, { carriedAct: 4 }).error.code, 'recovery-required');
  store.fail = null;
  assert.equal(recoverTransaction(store).recovered, 'rolled-back');
  assert.deepEqual(readPersistentState(store).value, sample());
});
test('startup recovers a partial prepared transaction and removes journal', () => {
  const j = journal(); const store = memory({ ...j.before, [STORAGE.lastHeldTone]: 'new', [JOURNAL_KEY]: JSON.stringify(j) });
  assert.equal(recoverTransaction(store).recovered, 'rolled-back');
  assert.deepEqual(Object.fromEntries(store.map), j.before);
});
test('startup committed journal is cleanup only, never rollback', () => {
  const j = journal('committed'); const store = memory({ ...j.after, [JOURNAL_KEY]: JSON.stringify(j) });
  assert.equal(recoverTransaction(store).recovered, 'committed');
  assert.deepEqual(Object.fromEntries(store.map), j.after);
});
test('journal cleanup failure after commit reports success with pending cleanup', () => {
  const store = memory(rawState());
  failOnce(store, (operation, key) => operation === 'remove' && key === JOURNAL_KEY);
  const result = transact(store, { lastHeldTone: 'new', carriedAct: 2 });
  assert.deepEqual(result, { ok: true, changed: true, cleanupPending: true });
  assert.equal(JSON.parse(store.map.get(JOURNAL_KEY)).phase, 'committed');
  assert.equal(recoverTransaction(store).recovered, 'committed');
  assert.equal(store.map.get(STORAGE.lastHeldTone), 'new');
});
test('malformed journal is retained, not guessed or cleared', () => {
  const store = memory({ [JOURNAL_KEY]: '{broken' });
  assert.equal(recoverTransaction(store).error.code, 'invalid-recovery-journal');
  assert.equal(store.map.get(JOURNAL_KEY), '{broken');
});
test('recovery preserves unexpected values written by another tab', () => {
  const j = journal(); const store = memory({ ...j.after, [STORAGE.lastHeldTone]: 'external-choice', [JOURNAL_KEY]: JSON.stringify(j) });
  assert.equal(recoverTransaction(store).error.code, 'recovery-conflict');
  assert.equal(store.map.get(STORAGE.lastHeldTone), 'external-choice');
  assert.equal(store.map.has(JOURNAL_KEY), true);
});
test('stale preview snapshot rejects restore without writes', () => {
  const store = memory(rawState()); const read = readPersistentState(store);
  store.map.set(STORAGE.lastHeldTone, 'changed-in-other-tab'); store.operations.length = 0;
  assert.equal(transact(store, { traces: [] }, { expectedRaw: read.raw }).error.code, 'storage-conflict');
  assert.equal(store.operations.some(([operation]) => operation !== 'get'), false);
});
test('storage reads blocked during transaction report failure, not saved', () => {
  const store = memory(); store.fail = () => { throw new Error('denied'); };
  assert.equal(transact(store, { carriedAct: 1 }).error.code, 'storage-read-failed');
});
test('journal recovery supports legitimate raw collections larger than one megabyte', () => {
  const large = JSON.stringify(Array.from({ length: 3000 }, (_, index) => ({ id: String(index), text: 'x'.repeat(400) })));
  const j = journal('prepared', { [STORAGE.traces]: large, [STORAGE.carriedAct]: '4' }, { [STORAGE.traces]: '[]', [STORAGE.carriedAct]: '5' });
  const store = memory({ ...j.after, [JOURNAL_KEY]: JSON.stringify(j) });
  assert.equal(recoverTransaction(store).recovered, 'rolled-back'); assert.equal(store.map.get(STORAGE.traces), large);
});
test('cooperative Web Lock is explicit, exclusive and has a DOM-free fallback', async () => {
  const calls = [];
  const locks = { request: async (...args) => { calls.push(args.slice(0, 2)); return args[2](); } };
  assert.equal(await withStorageLock(() => 17, locks), 17);
  assert.deepEqual(calls, [['tone-sovereign:persistent-state', { mode: 'exclusive' }]]);
  assert.equal(await withStorageLock(() => 21), 21);
});

const prompts = Array.from({ length: 10 }, (_, index) => ({ id: `review-${String(index + 1).padStart(2, '0')}`, prompt: `Prompt ${index}` }));
test('Monday through Sunday choose the same weekly prompt; next Monday advances', () => {
  const monday = weeklyPrompt(prompts, new Date(2026, 8, 7, 0, 1));
  for (let day = 7; day <= 13; day++) assert.deepEqual(weeklyPrompt(prompts, new Date(2026, 8, day, 23, 59)), monday);
  assert.equal(monday.weekKey, '2026-09-07');
  assert.equal(weeklyPrompt(prompts, new Date(2026, 8, 14)).index, (monday.index + 1) % 10);
});
test('all ten prompts are reached once in ten weeks and repeat without tracking', () => {
  const selected = Array.from({ length: 10 }, (_, week) => weeklyPrompt(prompts, new Date(2026, 8, 7 + week * 7)).prompt.id);
  assert.equal(new Set(selected).size, 10);
  assert.equal(weeklyPrompt(prompts, new Date(2026, 8, 7 + 70)).prompt.id, selected[0]);
});
test('English and Spanish arrays select the same ID even when reordered', () => {
  const spanish = prompts.map(prompt => ({ ...prompt, prompt: `ES ${prompt.id}` })).reverse();
  const when = new Date(2026, 8, 9);
  assert.equal(weeklyPrompt(prompts, when).prompt.id, weeklyPrompt(spanish, when).prompt.id);
});
test('year boundary belongs to the same local Monday; pre-epoch rotation stays valid', () => {
  assert.equal(weeklyPrompt(prompts, new Date(2027, 0, 1)).weekKey, '2026-12-28');
  assert.equal(weeklyPrompt(prompts, new Date(2026, 11, 31)).prompt.id, weeklyPrompt(prompts, new Date(2027, 0, 3)).prompt.id);
  assert.ok(weeklyPrompt(prompts, new Date(1960, 0, 1)).index >= 0);
});
test('invalid dates, duplicate IDs and invalid ordering fail rather than hide catalogue defects', () => {
  expectCode(() => weeklyPrompt(prompts, new Date(NaN)), 'invalid-date');
  expectCode(() => weeklyPrompt([]), 'invalid-schema');
  expectCode(() => weeklyPrompt([prompts[0], prompts[0]]), 'duplicate-id');
  expectCode(() => weeklyPrompt(prompts, new Date(), { order: ['missing'] }), 'invalid-schema');
});
test('weekly selection remains stable through northern and southern DST changes', () => {
  const moduleURL = new URL('../tone-state.mjs', import.meta.url).href;
  for (const [zone, month, day] of [['America/New_York', 2, 2], ['Australia/Melbourne', 8, 28]]) {
    const code = `import {weeklyPrompt} from ${JSON.stringify(moduleURL)}; const p=${JSON.stringify(prompts)}; const a=weeklyPrompt(p,new Date(2026,${month},${day},0,1)); const b=weeklyPrompt(p,new Date(2026,${month},${day}+6,23,59)); if(a.weekKey!==b.weekKey || a.prompt.id!==b.prompt.id) process.exit(1);`;
    execFileSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, TZ: zone }, stdio: 'pipe' });
  }
});
