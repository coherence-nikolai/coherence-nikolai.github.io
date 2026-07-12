import { categories, entries } from "./atlas.js";

const state = {
  mode: "lens",
  selectedCategory: "all",
  libraryQuery: "",
  selectedLensEntryId: "",
  detailEntryId: "",
  detailSurface: ""
};

const entryIndex = new Map(entries.map((entry) => [entry.id, entry]));
const notesStorageKey = "toneHiddenWorldNotes.v1";

const stopWords = new Set([
  "the", "and", "for", "with", "that", "this", "they", "them", "their", "you", "your", "one", "are", "but",
  "not", "does", "do", "did", "doing", "has", "have", "had", "was", "were", "been", "being", "from", "into",
  "about", "after", "before", "again", "just", "very", "really", "keeps", "keep", "someone", "on", "off", "to",
  "of", "in", "at", "as", "by", "my", "our", "we", "us"
]);

const aliasMap = new Map([
  ["text", ["message", "reply", "digital"]],
  ["texts", ["message", "reply", "digital"]],
  ["texting", ["message", "reply", "digital"]],
  ["ghost", ["silent", "message", "avoid"]],
  ["ghosted", ["silent", "message", "avoid"]],
  ["ghosting", ["silent", "message", "avoid"]],
  ["read", ["seen", "unread", "message"]],
  ["left", ["unread", "message", "seen"]],
  ["ignored", ["silent", "avoid", "message"]],
  ["ignores", ["silent", "avoid", "message"]],
  ["ignore", ["silent", "avoid", "message"]],
  ["shutdown", ["quiet", "withdraw", "silent"]],
  ["shuts", ["quiet", "withdraw", "silent"]],
  ["shut", ["quiet", "withdraw", "silent"]],
  ["boundaries", ["boundary", "no", "choice"]],
  ["limits", ["boundary", "choice", "respect"]],
  ["boss", ["manager", "work", "authority"]],
  ["manager", ["work", "authority"]],
  ["coworker", ["work", "teammate"]],
  ["colleague", ["work", "teammate"]],
  ["rude", ["sharp", "abrupt", "tone"]],
  ["mean", ["sharp", "tone", "conflict"]],
  ["angry", ["conflict", "loud", "safety"]],
  ["yells", ["loud", "unheard", "conflict"]],
  ["yelling", ["loud", "unheard", "conflict"]],
  ["money", ["cost", "bill", "price", "class"]],
  ["cash", ["money", "cost", "bill"]],
  ["expensive", ["money", "cost", "price"]],
  ["doctor", ["medical", "body", "appointment"]],
  ["hospital", ["medical", "body", "waiting"]],
  ["noise", ["busy", "sensory", "body"]],
  ["overstimulated", ["busy", "noise", "sensory"]],
  ["home", ["house", "privacy", "threshold"]],
  ["aging", ["age", "older", "future"]],
  ["old", ["aging", "age", "older"]],
  ["online", ["digital", "message", "seen"]],
  ["social", ["digital", "online", "visibility"]],
  ["stranger", ["public", "brief", "unknown"]],
  ["late", ["delay", "deadline", "time"]],
  ["apology", ["repair", "sorry", "trust"]],
  ["sorry", ["apology", "repair", "trust"]]
]);

const phraseAliases = [
  { phrase: "left on read", terms: ["seen", "unread", "message"] },
  { phrase: "text back", terms: ["message", "reply", "unread"] },
  { phrase: "does not reply", terms: ["message", "silent", "reply"] },
  { phrase: "no response", terms: ["silent", "message", "reply"] },
  { phrase: "shuts down", terms: ["quiet", "withdraw", "family"] },
  { phrase: "shared costs", terms: ["money", "bill", "fairness"] },
  { phrase: "small talk", terms: ["neighbor", "strangers", "privacy"] },
  { phrase: "public transport", terms: ["train", "seat", "stranger"] }
];

const unsafeTokens = new Set([
  "abuse", "abused", "abusive", "assault", "violence", "violent", "hit", "hits", "hitting", "harm",
  "unsafe", "danger", "dangerous", "threat", "threaten", "threatened", "coercion", "coerce", "stalking",
  "stalk", "suicide", "selfharm", "self-harm", "weapon", "emergency", "doctor", "hospital", "medical",
  "pain", "illness", "symptom", "symptoms", "health"
]);

const defaultSuggestions = [
  "left on read",
  "sharp tone",
  "shared costs",
  "avoids conflict",
  "medical spaces",
  "never invites me over",
  "public mask",
  "quiet neighbor"
];

const els = {
  modeButtons: document.querySelectorAll("[data-mode]"),
  views: document.querySelectorAll("[data-view]"),
  surfaceInput: document.querySelector("#surface-input"),
  revealButton: document.querySelector("#reveal-worlds"),
  resultCount: document.querySelector("#result-count"),
  worldResults: document.querySelector("#world-results"),
  exampleButtons: document.querySelectorAll("[data-example]"),
  dailyCard: document.querySelector("#daily-card"),
  dailyLibrary: document.querySelector("#daily-library"),
  dailyLens: document.querySelector("#daily-lens"),
  dailyAtlas: document.querySelector("#daily-atlas"),
  librarySearch: document.querySelector("#library-search"),
  searchSuggestions: document.querySelector("#search-suggestions"),
  categoryList: document.querySelector("#category-list"),
  librarySummary: document.querySelector("#library-summary"),
  libraryCount: document.querySelector("#library-count"),
  entryList: document.querySelector("#entry-list"),
  notesSummary: document.querySelector("#notes-summary"),
  notesCount: document.querySelector("#notes-count"),
  notesList: document.querySelector("#notes-list"),
  exportNotes: document.querySelector("#export-notes"),
  clearNotes: document.querySelector("#clear-notes"),
  entryDetail: document.querySelector("#entry-detail"),
  entryDetailContent: document.querySelector("#entry-detail-content")
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function baseTokens(text) {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function tokens(text) {
  return baseTokens(text).flatMap((token) => tokenVariants(token));
}

function tokenVariants(token, includeAliases = true) {
  const variants = new Set([token]);

  if (token.endsWith("ies") && token.length > 4) variants.add(`${token.slice(0, -3)}y`);
  else if (token.endsWith("es") && token.length > 4) variants.add(token.slice(0, -2));
  else if (token.endsWith("s") && token.length > 3) variants.add(token.slice(0, -1));
  if (token.endsWith("ed") && token.length > 4) variants.add(token.slice(0, -1));
  if (token.endsWith("ing") && token.length > 5) variants.add(token.slice(0, -3));

  if (includeAliases) {
    (aliasMap.get(token) || []).forEach((alias) => variants.add(alias));
  }
  return [...variants];
}

function queryTerms(query) {
  const normalized = normalize(query);
  const terms = new Set(tokens(query));

  phraseAliases.forEach((alias) => {
    if (normalized.includes(alias.phrase)) {
      alias.terms.forEach((term) => terms.add(term));
    }
  });

  return [...terms];
}

function categoryDisplayName(entry) {
  return categories.find((category) => category.id === entry.category)?.name || entry.categoryName;
}

function uniqueList(values = []) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()).filter(Boolean))];
}

function entryDomains(entry) {
  if (entry.domains?.length) return entry.domains;
  return uniqueList([
    entry.category,
    categoryDisplayName(entry).toLowerCase(),
    ...entry.tags.filter((tag) => tag.length > 3).slice(0, 2)
  ]).slice(0, 4);
}

function entryLenses(entry) {
  if (entry.lenses?.length) return entry.lenses;
  return uniqueList([
    ...entry.needs,
    categoryDisplayName(entry).toLowerCase()
  ]).slice(0, 4);
}

function entryAliases(entry) {
  if (entry.searchAliases?.length) return entry.searchAliases;
  return uniqueList([
    entry.title.replace(/^The\s+/i, "").toLowerCase(),
    ...entry.tags,
    ...entry.needs
  ]).slice(0, 7);
}

function entryAlternateWorlds(entry) {
  if (entry.alternateWorlds?.length) return entry.alternateWorlds;
  const [firstNeed = "safety", secondNeed = "dignity"] = entry.needs;
  return [
    `One possibility: ${firstNeed} may matter here in a way that is not visible from the surface.`,
    `Another possibility: ${secondNeed} may be part of the context, while impact and boundaries still matter.`,
    "The moment may also be ordinary, mistaken, or unrelated to you."
  ];
}

function entryBoundary(entry) {
  return entry.boundaryReminder || "This is one possible world, not the explanation. Understanding behavior does not excuse harm, remove boundaries, or replace direct communication.";
}

function entrySearchFields(entry) {
  return [
    { label: "title", value: entry.title, weight: 10 },
    { label: "visible behavior", value: entry.visibleBehavior, weight: 9 },
    { label: "plain-language alias", value: entryAliases(entry).join(" "), weight: 9 },
    { label: "tag", value: entry.tags.join(" "), weight: 7 },
    { label: "life room", value: `${categoryDisplayName(entry)} ${entryDomains(entry).join(" ")}`, weight: 6 },
    { label: "need", value: entry.needs.join(" "), weight: 5 },
    { label: "lens", value: entryLenses(entry).join(" "), weight: 4 },
    { label: "possible world", value: entry.worldHypothesis, weight: 3 },
    { label: "protective pattern", value: entry.protectiveMove, weight: 2 },
    { label: "wise question", value: entry.wiseQuestion, weight: 2 },
    { label: "alternate door", value: entryAlternateWorlds(entry).join(" "), weight: 2 }
  ];
}

function matchField(value, terms) {
  const fieldTokens = new Set(baseTokens(value).flatMap((token) => tokenVariants(token, false)));
  return terms.filter((term) => fieldTokens.has(term));
}

function scoreEntry(entry, query) {
  const terms = queryTerms(query);
  if (!terms.length) return { score: 0, reasons: [], matches: [] };

  const reasons = [];
  const matches = new Set();
  const score = entrySearchFields(entry).reduce((total, field) => {
    const fieldMatches = matchField(field.value || "", terms);
    if (!fieldMatches.length) return total;
    fieldMatches.forEach((match) => matches.add(match));
    reasons.push({ label: field.label, terms: [...new Set(fieldMatches)].slice(0, 3) });
    return total + fieldMatches.length * field.weight;
  }, 0);

  return {
    score,
    reasons: reasons.slice(0, 3),
    matches: [...matches].slice(0, 6)
  };
}

function rankedEntries(query, category = "all") {
  const scoped = category === "all" ? entries : entries.filter((entry) => entry.category === category);
  const terms = queryTerms(query);

  if (!terms.length) {
    return [...scoped]
      .sort((a, b) => categoryDisplayName(a).localeCompare(categoryDisplayName(b)) || a.title.localeCompare(b.title))
      .map((entry) => ({ entry, score: 0, reasons: [], matches: [] }));
  }

  return scoped
    .map((entry) => ({ entry, ...scoreEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map((result) => ({
      ...result,
      reasons: result.reasons.length ? result.reasons : [{ label: "nearby world", terms: result.matches }]
    }));
}

function searchEntries(query, category = "all") {
  return rankedEntries(query, category).map((result) => result.entry);
}

function hasUnsafeTerms(query) {
  return queryTerms(query).some((term) => unsafeTokens.has(term));
}

function renderSafetyBlock(query, context = "Tone: Hidden Worlds") {
  return `
    <section class="safety-note hard-stop" aria-label="Safety boundary">
      <p class="eyebrow">Safety first</p>
      <h3>This is outside the reflection space.</h3>
      <p>
        ${escapeHtml(context)} will not interpret ${query ? `&quot;${escapeHtml(query)}&quot;` : "this moment"}.
        If there is immediate danger, abuse, self-harm, coercion, a medical issue, a legal issue, or a crisis,
        use local emergency services or qualified support now.
      </p>
      <p>Tone: Hidden Worlds is for curiosity and reflection only. It is not therapy, diagnosis, medical advice, legal advice, crisis support, or an emergency service.</p>
      <div class="safety-actions">
        <a href="/tone_hidden_worlds/boundaries/">Read boundaries</a>
        <a href="/tone_hidden_worlds/support/">Support notes</a>
      </div>
    </section>
  `;
}

function relatedEntries(entry, limit = 3) {
  const entrySignals = new Set([
    entry.category,
    ...entry.needs,
    ...entry.tags,
    ...entryDomains(entry),
    ...entryLenses(entry)
  ].map(normalize));

  return entries
    .filter((candidate) => candidate.id !== entry.id)
    .map((candidate) => {
      const candidateSignals = [
        candidate.category,
        ...candidate.needs,
        ...candidate.tags,
        ...entryDomains(candidate),
        ...entryLenses(candidate)
      ].map(normalize);
      const shared = candidateSignals.filter((signal) => entrySignals.has(signal));
      return { entry: candidate, score: shared.length, shared };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, limit);
}

function renderReasonPills(reasons = []) {
  if (!reasons.length) return "";
  const pills = reasons
    .flatMap((reason) => reason.terms)
    .filter((term, index, all) => all.indexOf(term) === index)
    .slice(0, 4)
    .map((reason) => `<span>${escapeHtml(reason)}</span>`)
    .join("");

  return `<div class="match-row" aria-label="Why this appeared"><strong>This prompt touches</strong>${pills}</div>`;
}

function renderRelatedDoors(entry) {
  const related = relatedEntries(entry);
  if (!related.length) return "";

  return `
    <div class="related-doors">
      <p>Adjacent prompts</p>
      <div>
        ${related.map((result) => `
          <button type="button" data-entry-detail="${escapeHtml(result.entry.id)}">
            ${escapeHtml(result.entry.title)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWorldCard(entry, options = {}) {
  const needs = entry.needs.slice(0, 3).map((need) => `<span>${escapeHtml(need)}</span>`).join("");
  const surface = options.surface || entry.visibleBehavior;
  const alternateWorlds = entryAlternateWorlds(entry).slice(0, 3);
  const boundaryReminder = entryBoundary(entry);

  return `
    <article class="world-card ${options.featured ? "featured-world" : ""}">
      ${renderReasonPills(options.reasons)}
      <p class="meta-line">${escapeHtml(categoryDisplayName(entry))}</p>
      <h3>${escapeHtml(entry.title)}</h3>
      ${options.featured ? `<p class="hold-lightly-card">Hold lightly. This is one doorway, not the answer.</p>` : ""}
      <p><strong>Surface:</strong> ${escapeHtml(surface)}</p>
      <p><strong>Possible world:</strong> ${escapeHtml(entry.worldHypothesis)}</p>
      <p><strong>Possible protection:</strong> ${escapeHtml(entry.protectiveMove)}</p>
      ${alternateWorlds.length ? `
        <div class="alternate-worlds">
          <p>Other possible worlds</p>
          <ul>
            ${alternateWorlds.map((world) => `<li>${escapeHtml(world)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      <p class="question">${escapeHtml(entry.wiseQuestion)}</p>
      <p class="boundary-reminder">${escapeHtml(boundaryReminder)}</p>
      <div class="tag-row">${needs}</div>
      <div class="card-actions">
        <button class="entry-open" type="button" data-entry-detail="${escapeHtml(entry.id)}" data-detail-surface="${escapeHtml(surface)}">
          Open reflection
        </button>
      </div>
      ${options.related === false ? "" : renderRelatedDoors(entry)}
    </article>
  `;
}

function renderAtlasDoor(result) {
  const entry = result.entry;
  const searchPills = result.matches?.length ? result.matches : [...entry.needs, ...entryDomains(entry)];
  const pills = uniqueList(searchPills).slice(0, 4).map((pill) => `<span>${escapeHtml(pill)}</span>`).join("");

  return `
    <article class="atlas-door">
      <div class="atlas-door-main">
        ${renderReasonPills(result.reasons)}
        <p class="meta-line">${escapeHtml(categoryDisplayName(entry))}</p>
        <h3>${escapeHtml(entry.title)}</h3>
        <p class="door-surface">${escapeHtml(entry.visibleBehavior)}</p>
        <p class="door-world">${escapeHtml(entry.worldHypothesis)}</p>
        <div class="tag-row">${pills}</div>
      </div>
      <button class="entry-open" type="button" data-entry-detail="${escapeHtml(entry.id)}" data-detail-surface="${escapeHtml(entry.visibleBehavior)}">
        Step in
      </button>
    </article>
  `;
}

function renderPillGroup(label, values) {
  const pills = uniqueList(values).slice(0, 5);
  if (!pills.length) return "";
  return `
    <div class="detail-pill-group">
      <p>${escapeHtml(label)}</p>
      <div>${pills.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>
    </div>
  `;
}

function renderEntryDetail(entry, surface = entry.visibleBehavior) {
  const alternateWorlds = entryAlternateWorlds(entry).slice(0, 3);
  const related = relatedEntries(entry, 4);
  return `
    <p class="eyebrow">Reflection Room</p>
    <h2 id="entry-detail-title" tabindex="-1">${escapeHtml(entry.title)}</h2>
    <p class="detail-principle">Every Person Lives in a World You Cannot See. Hold this as a possibility, not a verdict.</p>

    <div class="detail-map">
      <section>
        <span>Surface</span>
        <p>${escapeHtml(surface)}</p>
      </section>
      <section>
        <span>Possible world</span>
        <p>${escapeHtml(entry.worldHypothesis)}</p>
      </section>
      <section>
        <span>Possible protection</span>
        <p>${escapeHtml(entry.protectiveMove)}</p>
      </section>
      <section>
        <span>Better question</span>
        <p>${escapeHtml(entry.wiseQuestion)}</p>
      </section>
    </div>

    <section class="detail-boundary">
      <h3>What not to assume</h3>
      <p>${escapeHtml(entryBoundary(entry))}</p>
    </section>

    <section class="detail-alt-worlds">
      <h3>Other worlds this moment might hold</h3>
      <ul>${alternateWorlds.map((world) => `<li>${escapeHtml(world)}</li>`).join("")}</ul>
    </section>

    <div class="detail-meta">
      ${renderPillGroup("Life rooms", [categoryDisplayName(entry), ...entryDomains(entry)])}
      ${renderPillGroup("Lenses", entryLenses(entry))}
      ${renderPillGroup("Needs", entry.needs)}
    </div>

    <section class="detail-note">
      <h3>Private note</h3>
      <p>What changed in how you see this moment? Save the shift, not a judgment about the person.</p>
      <label class="visually-hidden" for="detail-note-input">Private note</label>
      <textarea id="detail-note-input" rows="4" placeholder="I can hold that this may be about protection, pressure, history, or a need I cannot see."></textarea>
      <div class="note-control-row">
        <button class="primary-action compact-action" type="button" data-save-note="${escapeHtml(entry.id)}">Save note</button>
        <span id="note-save-status" aria-live="polite"></span>
      </div>
    </section>

    ${related.length ? `
      <section class="detail-related">
        <h3>Adjacent prompts</h3>
        <div>
          ${related.map((result) => `
            <button type="button" data-entry-detail="${escapeHtml(result.entry.id)}">
              ${escapeHtml(result.entry.title)}
            </button>
          `).join("")}
        </div>
      </section>
    ` : ""}

    <div class="detail-actions">
      <button class="primary-action compact-action" type="button" data-lens-from-detail="${escapeHtml(entry.id)}">Try this in Lens</button>
      <button class="entry-open" type="button" data-find-in-atlas="${escapeHtml(entry.id)}">Find in Atlas</button>
      <button class="entry-open" type="button" data-copy-world-link="${escapeHtml(entry.id)}">Copy world link</button>
    </div>
  `;
}

function openEntryDetail(entryId, surface = "", options = {}) {
  const entry = entryIndex.get(entryId);
  if (!entry || !els.entryDetail || !els.entryDetailContent) return;
  state.detailEntryId = entryId;
  state.detailSurface = surface || entry.visibleBehavior;
  els.entryDetailContent.innerHTML = renderEntryDetail(entry, state.detailSurface);
  els.entryDetail.hidden = false;
  els.entryDetail.querySelector(".entry-detail-card")?.scrollTo({ top: 0 });
  document.body.classList.add("has-entry-detail");
  if (!options.preserveHash) history.replaceState(null, "", `#world=${encodeURIComponent(entryId)}`);
  els.entryDetail.querySelector("#entry-detail-title")?.focus({ preventScroll: true });
}

function closeEntryDetail() {
  if (!els.entryDetail) return;
  els.entryDetail.hidden = true;
  document.body.classList.remove("has-entry-detail");
  state.detailEntryId = "";
  state.detailSurface = "";
  history.replaceState(null, "", `#${state.mode}`);
}

function loadNotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(notesStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistNotes(notes) {
  try {
    localStorage.setItem(notesStorageKey, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

function formatNoteDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved note";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function noteId() {
  return `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function renderNotes() {
  if (!els.notesList || !els.notesCount || !els.notesSummary) return;
  const notes = loadNotes().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  els.notesCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  els.notesSummary.textContent = notes.length ? "Saved perspectives" : "Private notebook";

  if (!notes.length) {
    els.notesList.innerHTML = `
      <div class="empty-state">
        No saved notes yet. Open a Reflection Room and save only the perspective you want to remember.
      </div>
    `;
    return;
  }

  els.notesList.innerHTML = notes.map((note) => `
    <article class="note-card">
      <p class="meta-line">${escapeHtml(formatNoteDate(note.createdAt))}</p>
      <h3>${escapeHtml(note.title || "Hidden world")}</h3>
      <p><strong>Surface:</strong> ${escapeHtml(note.surface || "A moment you were considering")}</p>
      <p>${escapeHtml(note.note || "")}</p>
      <div class="card-actions">
        <button class="entry-open" type="button" data-entry-detail="${escapeHtml(note.entryId || "")}" data-detail-surface="${escapeHtml(note.surface || "")}">Open reflection</button>
        <button class="entry-open danger-action" type="button" data-delete-note="${escapeHtml(note.id)}">Delete</button>
      </div>
    </article>
  `).join("");
}

function saveCurrentNote(entryId) {
  const entry = entryIndex.get(entryId);
  const input = document.querySelector("#detail-note-input");
  const status = document.querySelector("#note-save-status");
  const note = input?.value.trim() || "";
  if (!entry || !input || !status) return;

  if (!note) {
    status.textContent = "Write a note first.";
    return;
  }

  const notes = loadNotes();
  notes.unshift({
    id: noteId(),
    entryId: entry.id,
    title: entry.title,
    surface: state.detailSurface || entry.visibleBehavior,
    note,
    createdAt: new Date().toISOString()
  });

  if (!persistNotes(notes)) {
    status.textContent = "Could not save in this browser.";
    return;
  }

  input.value = "";
  status.textContent = "Saved to Notes.";
  renderNotes();
}

function deleteNote(noteIdToDelete) {
  const notes = loadNotes().filter((note) => note.id !== noteIdToDelete);
  persistNotes(notes);
  renderNotes();
}

function exportNotes() {
  const notes = loadNotes();
  if (!notes.length) return;
  const body = [
    "Tone: Hidden Worlds notes",
    "Every Person Lives in a World You Cannot See.",
    "",
    ...notes.map((note) => [
      `# ${note.title || "Hidden world"}`,
      `Saved: ${formatNoteDate(note.createdAt)}`,
      `Surface: ${note.surface || ""}`,
      "",
      note.note || "",
      ""
    ].join("\n"))
  ].join("\n");
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tone-hidden-worlds-notes-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function clearNotes() {
  if (!loadNotes().length) return;
  if (!window.confirm("Clear all local Tone: Hidden Worlds notes? This cannot be undone.")) return;
  persistNotes([]);
  renderNotes();
}

function copyWorldLink(entryId) {
  const status = document.querySelector("#note-save-status");
  const url = `${location.origin}${location.pathname}#world=${encodeURIComponent(entryId)}`;
  if (!navigator.clipboard) {
    if (status) status.textContent = url;
    return;
  }
  navigator.clipboard.writeText(url)
    .then(() => {
      if (status) status.textContent = "World link copied.";
    })
    .catch(() => {
      if (status) status.textContent = url;
    });
}

function setMode(mode) {
  state.mode = mode;
  els.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  els.views.forEach((view) => view.classList.toggle("is-active", view.dataset.view === mode));
  history.replaceState(null, "", `#${mode}`);
}

function renderLensAlternates(results, selectedEntryId) {
  const alternates = results.filter((result) => result.entry.id !== selectedEntryId).slice(0, 2);
  if (!alternates.length) return "";

  return `
    <div class="alternate-stack">
      <p>Other possible worlds to hold lightly</p>
      ${alternates.map((result) => `
        <button type="button" data-lens-entry="${escapeHtml(result.entry.id)}">
          <span>${escapeHtml(result.entry.title)}</span>
          <small>${escapeHtml(result.entry.worldHypothesis)}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function renderLensResults(results, query) {
  if (!results.length) {
    return `<div class="empty-state">No close prompt yet. Try a simpler surface word like silence, boundary, work, family, grief, culture, or control.</div>`;
  }

  if (!results.some((result) => result.entry.id === state.selectedLensEntryId)) {
    state.selectedLensEntryId = results[0].entry.id;
  }

  const selected = results.find((result) => result.entry.id === state.selectedLensEntryId) || results[0];
  return `
    ${renderWorldCard(selected.entry, {
      surface: query,
      reasons: selected.reasons,
      featured: true,
      related: false
    })}
    ${renderLensAlternates(results, selected.entry.id)}
  `;
}

function revealWorlds(options = {}) {
  const query = els.surfaceInput.value.trim() || els.surfaceInput.placeholder;
  if (hasUnsafeTerms(query)) {
    state.selectedLensEntryId = "";
    els.resultCount.textContent = "Safety first";
    els.worldResults.innerHTML = renderSafetyBlock(query, "World Lens");
    return;
  }

  const ranked = rankedEntries(query);
  let results = ranked.slice(0, 3);
  if (options.keepSelection && state.selectedLensEntryId && !results.some((result) => result.entry.id === state.selectedLensEntryId)) {
    const selectedEntry = entryIndex.get(state.selectedLensEntryId);
    if (selectedEntry) {
      results = [
        { entry: selectedEntry, score: 0, reasons: [{ label: "selected world", terms: ["held lightly"] }], matches: ["held lightly"] },
        ...results.slice(0, 2)
      ];
    }
  }
  if (!options.keepSelection) state.selectedLensEntryId = results[0]?.entry.id || "";
  els.resultCount.textContent = results.length ? `${results.length} prompts` : "0 prompts";
  els.worldResults.innerHTML = renderLensResults(results, query);
}

function dailyEntry() {
  const day = Math.floor(Date.now() / 86400000);
  return entries[((day % entries.length) + entries.length) % entries.length];
}

function renderDaily() {
  const entry = dailyEntry();
  els.dailyCard.dataset.entryId = entry.id;
  els.dailyCard.innerHTML = `
    <p class="eyebrow">Daily Hidden World</p>
    <h3>${escapeHtml(entry.title)}</h3>
    <p><strong>Surface:</strong> ${escapeHtml(entry.visibleBehavior)}</p>
    <p><strong>Possible world:</strong> ${escapeHtml(entry.worldHypothesis)}</p>
    <p><strong>Life room:</strong> ${escapeHtml(categoryDisplayName(entry))}</p>
    <p class="question">Carry this question: ${escapeHtml(entry.wiseQuestion)}</p>
  `;
}

function renderCategories() {
  const allCount = entries.length;
  const buttons = [
    { id: "all", name: "All", count: allCount },
    ...categories.map((category) => ({
      ...category,
      count: entries.filter((entry) => entry.category === category.id).length
    }))
  ];
  els.categoryList.innerHTML = buttons.map((category) => `
    <button type="button" data-category="${escapeHtml(category.id)}" class="${category.id === state.selectedCategory ? "is-active" : ""}">
      ${escapeHtml(category.name)} <span>${category.count}</span>
    </button>
  `).join("");
}

function renderLibrary() {
  const results = rankedEntries(state.libraryQuery, state.selectedCategory);
  const categoryName = state.selectedCategory === "all"
    ? "World Atlas"
    : categories.find((category) => category.id === state.selectedCategory)?.name || "World Atlas";

  if (state.libraryQuery && hasUnsafeTerms(state.libraryQuery)) {
    els.librarySummary.textContent = "Safety first";
    els.libraryCount.textContent = "No interpretations";
    els.entryList.innerHTML = renderSafetyBlock(state.libraryQuery, "World Atlas");
    renderSearchSuggestions();
    return;
  }

  els.librarySummary.textContent = state.libraryQuery ? `Search: ${state.libraryQuery}` : categoryName;
  els.libraryCount.textContent = `${results.length} prompts`;
  els.entryList.innerHTML = (results.length
    ? results.map((result) => renderAtlasDoor(result)).join("")
    : `<div class="empty-state">No world found. Try a visible behavior, a need, or a simpler word.</div>`);
  renderSearchSuggestions();
}

function renderSearchSuggestions() {
  if (state.libraryQuery && hasUnsafeTerms(state.libraryQuery)) {
    els.searchSuggestions.innerHTML = defaultSuggestions.slice(0, 5).map((suggestion) => `
      <button type="button" data-suggestion="${escapeHtml(suggestion)}">
        ${escapeHtml(suggestion)}
      </button>
    `).join("");
    return;
  }

  const activeTerms = queryTerms(state.libraryQuery).slice(0, 5);
  const suggestions = activeTerms.length
    ? [...new Set([
      ...activeTerms,
      ...rankedEntries(state.libraryQuery).slice(0, 4).flatMap((result) => result.entry.needs.slice(0, 1))
    ])].slice(0, 8)
    : defaultSuggestions;

  els.searchSuggestions.innerHTML = suggestions.map((suggestion) => `
    <button type="button" data-suggestion="${escapeHtml(suggestion)}">
      ${escapeHtml(suggestion)}
    </button>
  `).join("");
}

function openEntryInLens(entryId) {
  const entry = entryIndex.get(entryId);
  if (!entry) return;
  els.surfaceInput.value = entry.visibleBehavior;
  state.selectedLensEntryId = entry.id;
  setMode("lens");
  revealWorlds({ keepSelection: true });
  document.querySelector("#lens")?.scrollIntoView({ block: "start" });
}

function openEntryInAtlas(entryId) {
  const entry = entries.find((item) => item.id === entryId);
  if (!entry) return;
  state.libraryQuery = entry.title;
  state.selectedCategory = "all";
  els.librarySearch.value = entry.title;
  renderCategories();
  renderLibrary();
  setMode("library");
}

els.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
    document.querySelector(`#${button.dataset.mode}`)?.scrollIntoView({ block: "start" });
  });
});

els.exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    els.surfaceInput.value = button.dataset.example;
    state.selectedLensEntryId = "";
    revealWorlds();
  });
});

els.revealButton.addEventListener("click", () => {
  state.selectedLensEntryId = "";
  revealWorlds();
});

els.surfaceInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    revealWorlds();
  }
});

els.dailyLibrary.addEventListener("click", () => {
  const entryId = els.dailyCard.dataset.entryId;
  openEntryDetail(entryId);
});

els.dailyLens.addEventListener("click", () => {
  const entryId = els.dailyCard.dataset.entryId;
  openEntryInLens(entryId);
});

els.dailyAtlas.addEventListener("click", () => {
  const entryId = els.dailyCard.dataset.entryId;
  openEntryInAtlas(entryId);
});

els.librarySearch.addEventListener("input", () => {
  state.libraryQuery = els.librarySearch.value;
  renderLibrary();
});

els.searchSuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("[data-suggestion]");
  if (!button) return;
  state.libraryQuery = button.dataset.suggestion;
  els.librarySearch.value = state.libraryQuery;
  renderLibrary();
});

els.categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.selectedCategory = button.dataset.category;
  renderCategories();
  renderLibrary();
});

els.exportNotes?.addEventListener("click", exportNotes);
els.clearNotes?.addEventListener("click", clearNotes);

document.addEventListener("click", (event) => {
  const closeButton = event.target.closest("[data-detail-close]");
  if (closeButton) {
    closeEntryDetail();
    return;
  }

  const detailButton = event.target.closest("[data-entry-detail]");
  if (detailButton) {
    openEntryDetail(detailButton.dataset.entryDetail, detailButton.dataset.detailSurface || "");
    return;
  }

  const lensFromDetail = event.target.closest("[data-lens-from-detail]");
  if (lensFromDetail) {
    closeEntryDetail();
    openEntryInLens(lensFromDetail.dataset.lensFromDetail);
    return;
  }

  const findInAtlas = event.target.closest("[data-find-in-atlas]");
  if (findInAtlas) {
    closeEntryDetail();
    openEntryInAtlas(findInAtlas.dataset.findInAtlas);
    return;
  }

  const saveNote = event.target.closest("[data-save-note]");
  if (saveNote) {
    saveCurrentNote(saveNote.dataset.saveNote);
    return;
  }

  const deleteNoteButton = event.target.closest("[data-delete-note]");
  if (deleteNoteButton) {
    deleteNote(deleteNoteButton.dataset.deleteNote);
    return;
  }

  const copyLink = event.target.closest("[data-copy-world-link]");
  if (copyLink) {
    copyWorldLink(copyLink.dataset.copyWorldLink);
    return;
  }

  const lensButton = event.target.closest("[data-lens-entry]");
  if (lensButton) {
    state.selectedLensEntryId = lensButton.dataset.lensEntry;
    revealWorlds({ keepSelection: true });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.entryDetail?.hidden) {
    closeEntryDetail();
  }
});

function routeFromHash() {
  const currentHash = location.hash.replace("#", "");
  if (["lens", "daily", "library", "notes"].includes(currentHash)) {
    setMode(currentHash);
    return;
  }
  if (currentHash.startsWith("world=")) {
    openEntryDetail(decodeURIComponent(currentHash.slice(6)), "", { preserveHash: true });
  }
}

window.addEventListener("hashchange", routeFromHash);

function init() {
  renderCategories();
  renderDaily();
  revealWorlds();
  renderLibrary();
  renderNotes();
  routeFromHash();

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("/tone_hidden_worlds/sw.js").catch(() => {});
  }
}

init();
