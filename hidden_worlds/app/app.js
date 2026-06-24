import { categories, entries } from "./atlas.js";

const state = {
  mode: "lens",
  selectedCategory: "all",
  libraryQuery: "",
  selectedSwap: "missed-message"
};

const stopWords = new Set(["the", "and", "for", "with", "that", "this", "they", "them", "their", "you", "your", "one", "are", "but", "not"]);

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
    ids: ["late-assignment", "deadline-defender", "commitment-hesitation"]
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

function tokens(text) {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function scoreEntry(entry, query) {
  const queryTokens = tokens(query);
  if (!queryTokens.length) return 0;

  const fields = [
    [entry.title, 9],
    [entry.visibleBehavior, 8],
    [entry.tags.join(" "), 7],
    [entry.categoryName, 5],
    [entry.needs.join(" "), 4],
    [entry.worldHypothesis, 3],
    [entry.protectiveMove, 2],
    [entry.wiseQuestion, 2]
  ];

  return fields.reduce((total, [value, weight]) => {
    const haystack = normalize(value);
    const matches = queryTokens.filter((token) => haystack.includes(token)).length;
    return total + matches * weight;
  }, 0);
}

function searchEntries(query, category = "all") {
  const scoped = category === "all" ? entries : entries.filter((entry) => entry.category === category);
  const queryTokens = tokens(query);

  if (!queryTokens.length) {
    return [...scoped].sort((a, b) => a.title.localeCompare(b.title));
  }

  return scoped
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map((result) => result.entry);
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

  return `
    <article class="world-card">
      <button type="button" data-library-entry="${escapeHtml(entry.id)}" aria-label="Open ${escapeHtml(entry.title)} in library">
        <p class="meta-line">${escapeHtml(entry.categoryName)}</p>
        <h3>${escapeHtml(entry.title)}</h3>
        <p><strong>Visible:</strong> ${escapeHtml(surface)}</p>
        <p><strong>Possible world:</strong> ${escapeHtml(entry.worldHypothesis)}</p>
        <p><strong>Protective move:</strong> ${escapeHtml(entry.protectiveMove)}</p>
        <p class="question">${escapeHtml(entry.wiseQuestion)}</p>
        <div class="tag-row">${needs}</div>
      </button>
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
  const results = searchEntries(query).slice(0, 3);
  els.resultCount.textContent = String(results.length);
  els.worldResults.innerHTML = results.length
    ? results.map((entry) => renderWorldCard(entry, { surface: query })).join("")
    : `<div class="empty-state">No close match yet. Try a simpler surface word like silence, boundary, work, family, grief, culture, or control.</div>`;
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
    <p class="question">${escapeHtml(entry.wiseQuestion)}</p>
  `;
}

function renderCategories() {
  const allCount = entries.length;
  const buttons = [{ id: "all", name: "All", count: allCount }, ...categories];
  els.categoryList.innerHTML = buttons.map((category) => `
    <button type="button" data-category="${escapeHtml(category.id)}" class="${category.id === state.selectedCategory ? "is-active" : ""}">
      ${escapeHtml(category.name)} <span>${category.count}</span>
    </button>
  `).join("");
}

function renderLibrary() {
  const results = searchEntries(state.libraryQuery, state.selectedCategory);
  const categoryName = state.selectedCategory === "all"
    ? "World Atlas"
    : categories.find((category) => category.id === state.selectedCategory)?.name || "World Atlas";

  els.librarySummary.textContent = state.libraryQuery ? "Search Results" : categoryName;
  els.libraryCount.textContent = String(results.length);
  els.entryList.innerHTML = results.length
    ? results.map((entry) => renderWorldCard(entry)).join("")
    : `<div class="empty-state">No world found. Try a visible behavior, a need, or a simpler word.</div>`;
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
