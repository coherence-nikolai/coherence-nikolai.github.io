import { categories, entries } from "./atlas.js";

const state = {
  mode: "lens",
  selectedCategory: "all",
  libraryQuery: "",
  selectedSwap: "missed-message"
};

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
  "stalk", "suicide", "selfharm", "self-harm", "weapon", "emergency"
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

const swapMoments = [
  {
    id: "missed-message",
    title: "The missed message",
    surface: "Someone does not reply.",
    query: "message silent overwhelmed friend attention",
    ids: ["overwhelmed-responder", "notification-avoider", "low-bandwidth-friend"]
  },
  {
    id: "late-again",
    title: "Late again",
    surface: "Someone arrives after everyone waited.",
    query: "late deadline delay shame pressure",
    ids: ["delayed-work", "deadline-defender", "commitment-hesitation"]
  },
  {
    id: "sharp-reply",
    title: "A sharp reply",
    surface: "Their tone suddenly closes.",
    query: "guarded sharp tone criticism safety",
    ids: ["guarded-reply", "threat-reader", "shame-spiral"]
  },
  {
    id: "quiet-room",
    title: "The quiet room",
    surface: "Someone says little in a group.",
    query: "quiet group meeting accent belonging",
    ids: ["newcomer", "meeting-silencer", "accent-guard"]
  }
];

const els = {
  modeButtons: document.querySelectorAll("[data-mode]"),
  views: document.querySelectorAll("[data-view]"),
  surfaceInput: document.querySelector("#surface-input"),
  revealButton: document.querySelector("#reveal-worlds"),
  resultCount: document.querySelector("#result-count"),
  worldResults: document.querySelector("#world-results"),
  exampleButtons: document.querySelectorAll("[data-example]"),
  swapChooser: document.querySelector("#swap-chooser"),
  swapResults: document.querySelector("#swap-results"),
  dailyCard: document.querySelector("#daily-card"),
  dailyLibrary: document.querySelector("#daily-library"),
  librarySearch: document.querySelector("#library-search"),
  searchSuggestions: document.querySelector("#search-suggestions"),
  categoryList: document.querySelector("#category-list"),
  librarySummary: document.querySelector("#library-summary"),
  libraryCount: document.querySelector("#library-count"),
  entryList: document.querySelector("#entry-list")
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
  if (token.endsWith("es") && token.length > 4) variants.add(token.slice(0, -2));
  if (token.endsWith("s") && token.length > 3) variants.add(token.slice(0, -1));
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

function entrySearchFields(entry) {
  return [
    { label: "title", value: entry.title, weight: 10 },
    { label: "visible behavior", value: entry.visibleBehavior, weight: 9 },
    { label: "plain-language alias", value: (entry.searchAliases || []).join(" "), weight: 9 },
    { label: "tag", value: entry.tags.join(" "), weight: 7 },
    { label: "life room", value: `${categoryDisplayName(entry)} ${(entry.domains || []).join(" ")}`, weight: 6 },
    { label: "need", value: entry.needs.join(" "), weight: 5 },
    { label: "lens", value: (entry.lenses || []).join(" "), weight: 4 },
    { label: "possible world", value: entry.worldHypothesis, weight: 3 },
    { label: "protective pattern", value: entry.protectiveMove, weight: 2 },
    { label: "wise question", value: entry.wiseQuestion, weight: 2 },
    { label: "alternate door", value: (entry.alternateWorlds || []).join(" "), weight: 2 }
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

function safetyNotice(query) {
  if (!hasUnsafeTerms(query)) return "";
  return `
    <div class="safety-note">
      If someone may be unsafe, prioritize immediate safety and trusted support before interpretation.
      Hidden Worlds is not emergency, medical, legal, or therapy guidance.
    </div>
  `;
}

function relatedEntries(entry, limit = 3) {
  const entrySignals = new Set([
    entry.category,
    ...entry.needs,
    ...entry.tags,
    ...(entry.domains || []),
    ...(entry.lenses || [])
  ].map(normalize));

  return entries
    .filter((candidate) => candidate.id !== entry.id)
    .map((candidate) => {
      const candidateSignals = [
        candidate.category,
        ...candidate.needs,
        ...candidate.tags,
        ...(candidate.domains || []),
        ...(candidate.lenses || [])
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
    .flatMap((reason) => reason.terms.map((term) => `${reason.label}: ${term}`))
    .slice(0, 4)
    .map((reason) => `<span>${escapeHtml(reason)}</span>`)
    .join("");

  return `<div class="match-row" aria-label="Why this appeared"><strong>Matched because</strong>${pills}</div>`;
}

function renderRelatedDoors(entry) {
  const related = relatedEntries(entry);
  if (!related.length) return "";

  return `
    <div class="related-doors">
      <p>Nearby doors</p>
      <div>
        ${related.map((result) => `
          <button type="button" data-library-entry="${escapeHtml(result.entry.id)}">
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
  const alternateWorlds = (entry.alternateWorlds || []).slice(0, 3);
  const boundaryReminder = entry.boundaryReminder || "This is one possible world, not the explanation. Understanding behavior does not excuse harm, remove boundaries, or replace direct communication.";

  return `
    <article class="world-card">
      ${renderReasonPills(options.reasons)}
      <p class="meta-line">${escapeHtml(categoryDisplayName(entry))}</p>
      <h3>${escapeHtml(entry.title)}</h3>
      <p><strong>Visible:</strong> ${escapeHtml(surface)}</p>
      <p><strong>Possible world:</strong> ${escapeHtml(entry.worldHypothesis)}</p>
      <p><strong>What this may be protecting:</strong> ${escapeHtml(entry.protectiveMove)}</p>
      ${alternateWorlds.length ? `
        <div class="alternate-worlds">
          <p>Other possible doors</p>
          <ul>
            ${alternateWorlds.map((world) => `<li>${escapeHtml(world)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}
      <p class="question">${escapeHtml(entry.wiseQuestion)}</p>
      <p class="boundary-reminder">${escapeHtml(boundaryReminder)}</p>
      <div class="tag-row">${needs}</div>
      <div class="card-actions">
        <button class="entry-open" type="button" data-library-entry="${escapeHtml(entry.id)}">
          Open in atlas
        </button>
      </div>
      ${options.related === false ? "" : renderRelatedDoors(entry)}
    </article>
  `;
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

function revealWorlds() {
  const query = els.surfaceInput.value.trim() || els.surfaceInput.placeholder;
  const results = rankedEntries(query).slice(0, 3);
  els.resultCount.textContent = String(results.length);
  els.worldResults.innerHTML = safetyNotice(query) + (results.length
    ? results.map((result) => renderWorldCard(result.entry, { surface: query, reasons: result.reasons })).join("")
    : `<div class="empty-state">No close match yet. Try a simpler surface word like silence, boundary, work, family, grief, culture, or control.</div>`);
}

function renderSwapChooser() {
  els.swapChooser.innerHTML = swapMoments.map((moment) => `
    <button type="button" data-swap="${escapeHtml(moment.id)}" class="${moment.id === state.selectedSwap ? "is-active" : ""}">
      <strong>${escapeHtml(moment.title)}</strong>
      <span>${escapeHtml(moment.surface)}</span>
    </button>
  `).join("");
}

function renderSwap() {
  const moment = swapMoments.find((item) => item.id === state.selectedSwap) || swapMoments[0];
  const explicitEntries = moment.ids
    .map((id) => entries.find((entry) => entry.id === id))
    .filter(Boolean);
  const fallbackEntries = searchEntries(moment.query).filter((entry) => !moment.ids.includes(entry.id));
  const results = [...explicitEntries, ...fallbackEntries].slice(0, 3);
  els.swapResults.innerHTML = results.map((entry) => renderWorldCard(entry, { surface: moment.surface })).join("");
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
    <p><strong>Visible:</strong> ${escapeHtml(entry.visibleBehavior)}</p>
    <p><strong>Possible world:</strong> ${escapeHtml(entry.worldHypothesis)}</p>
    <p><strong>Life room:</strong> ${escapeHtml(categoryDisplayName(entry))}</p>
    <p class="question">${escapeHtml(entry.wiseQuestion)}</p>
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

  els.librarySummary.textContent = state.libraryQuery ? `Search: ${state.libraryQuery}` : categoryName;
  els.libraryCount.textContent = String(results.length);
  els.entryList.innerHTML = safetyNotice(state.libraryQuery) + (results.length
    ? results.map((result) => renderWorldCard(result.entry, { reasons: result.reasons })).join("")
    : `<div class="empty-state">No world found. Try a visible behavior, a need, or a simpler word.</div>`);
  renderSearchSuggestions();
}

function renderSearchSuggestions() {
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

function openEntryInLibrary(entryId) {
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
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

els.exampleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    els.surfaceInput.value = button.dataset.example;
    revealWorlds();
  });
});

els.revealButton.addEventListener("click", revealWorlds);

els.surfaceInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    revealWorlds();
  }
});

els.swapChooser.addEventListener("click", (event) => {
  const button = event.target.closest("[data-swap]");
  if (!button) return;
  state.selectedSwap = button.dataset.swap;
  renderSwapChooser();
  renderSwap();
});

els.dailyLibrary.addEventListener("click", () => {
  const entryId = els.dailyCard.dataset.entryId;
  const entry = entries.find((item) => item.id === entryId);
  if (!entry) return;
  state.libraryQuery = "";
  state.selectedCategory = entry.category;
  els.librarySearch.value = "";
  renderCategories();
  renderLibrary();
  setMode("library");
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

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-library-entry]");
  if (!button) return;
  openEntryInLibrary(button.dataset.libraryEntry);
});

function init() {
  renderCategories();
  renderSwapChooser();
  renderSwap();
  renderDaily();
  revealWorlds();
  renderLibrary();

  const initialMode = location.hash.replace("#", "");
  if (["lens", "swap", "daily", "library"].includes(initialMode)) {
    setMode(initialMode);
  }
}

init();
