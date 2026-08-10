const tabsEl = document.getElementById("collection-tabs");
const gridEl = document.getElementById("comic-grid");
const statsEl = document.getElementById("comic-stats");
const readerEl = document.getElementById("reader");
const readerBackEl = document.getElementById("reader-back");
const readerSeriesEl = document.getElementById("reader-series");
const readerTitleEl = document.getElementById("reader-title");
const readerCountEl = document.getElementById("reader-count");
const readerPagesEl = document.getElementById("reader-pages");

const state = {
  manifest: null,
  collectionId: null,
};

function clear(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function findComic(comicId) {
  for (const collection of state.manifest.collections) {
    const comic = collection.comics.find((item) => item.id === comicId);
    if (comic) {
      return { collection, comic };
    }
  }
  return null;
}

function renderStats() {
  const totalComics = state.manifest.collections.reduce((sum, collection) => sum + collection.comics.length, 0);
  statsEl.textContent = `${totalComics} comics. ${state.manifest.totalPages} pages.`;
}

function renderTabs() {
  clear(tabsEl);

  state.manifest.collections.forEach((collection) => {
    const button = makeElement("button", "collection-tab", collection.label);
    button.type = "button";
    button.id = `tab-${collection.id}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(collection.id === state.collectionId));
    button.addEventListener("click", () => {
      state.collectionId = collection.id;
      readerEl.hidden = true;
      if (window.location.hash !== `#${collection.id}`) {
        history.replaceState(null, "", `#${collection.id}`);
      }
      renderTabs();
      renderGrid();
    });
    tabsEl.appendChild(button);
  });

  const activeTab = tabsEl.querySelector('[aria-selected="true"]');
  if (activeTab) {
    requestAnimationFrame(() => {
      activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }
}

function renderGrid() {
  clear(gridEl);
  const collection = state.manifest.collections.find((item) => item.id === state.collectionId);
  if (!collection) {
    gridEl.appendChild(makeElement("p", "empty-note", "No comics found."));
    return;
  }

  let currentGroup = "";

  collection.comics.forEach((comic) => {
    if (comic.group && comic.group !== currentGroup) {
      currentGroup = comic.group;
      const heading = makeElement("h3", "comic-group-heading", currentGroup);
      gridEl.appendChild(heading);
    }

    const card = makeElement("article", "comic-card");
    const action = document.createElement(comic.type === "pdf" ? "a" : "button");
    if (comic.type === "pdf") {
      action.href = comic.href;
      action.target = "_blank";
      action.rel = "noopener";
    } else {
      action.type = "button";
      action.addEventListener("click", () => openComic(comic.id));
    }

    const cover = makeElement("span", "cover-frame");
    if (comic.cover) {
      const image = document.createElement("img");
      image.src = comic.cover;
      image.alt = `${comic.title} cover`;
      image.loading = "lazy";
      image.decoding = "async";
      cover.appendChild(image);
    } else {
      cover.appendChild(makeElement("span", "pdf-cover", "PDF"));
    }

    const title = makeElement("span", "comic-card-title");
    title.appendChild(makeElement("strong", "", comic.title));
    title.appendChild(makeElement("span", "", comic.type === "pdf" ? "Open PDF" : `${comic.pageCount} pages`));
    if (comic.subtitle) {
      title.appendChild(makeElement("span", "", comic.subtitle));
    }

    action.appendChild(cover);
    action.appendChild(title);
    card.appendChild(action);
    gridEl.appendChild(card);
  });
}

function openComic(comicId) {
  const match = findComic(comicId);
  if (!match || match.comic.type !== "image-set") {
    return;
  }

  const { collection, comic } = match;
  state.collectionId = collection.id;
  renderTabs();
  renderGrid();

  readerSeriesEl.textContent = collection.label;
  readerTitleEl.textContent = comic.title;
  readerCountEl.textContent = `${comic.pageCount} pages`;
  clear(readerPagesEl);

  comic.pages.forEach((page, index) => {
    const figure = makeElement("figure", "reader-page");
    const image = document.createElement("img");
    image.src = page.src;
    image.alt = page.alt;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";

    const caption = makeElement("figcaption", "", `Page ${index + 1}`);
    figure.appendChild(image);
    figure.appendChild(caption);
    readerPagesEl.appendChild(figure);
  });

  readerEl.hidden = false;
  if (window.location.hash !== `#${comic.id}`) {
    history.replaceState(null, "", `#${comic.id}`);
  }
  readerEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeReader() {
  readerEl.hidden = true;
  history.replaceState(null, "", `#${state.collectionId}`);
  document.getElementById("library").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openFromHash() {
  const comicId = window.location.hash.replace("#", "");
  if (!comicId) {
    return;
  }
  const collection = state.manifest.collections.find((item) => item.id === comicId);
  if (collection) {
    state.collectionId = collection.id;
    readerEl.hidden = true;
    renderTabs();
    renderGrid();
    document.getElementById("library").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const match = findComic(comicId);
  if (match && match.comic.type === "image-set") {
    openComic(comicId);
  }
}

async function init() {
  try {
    const response = await fetch(`/tone_comics/manifest.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Manifest failed to load");
    }
    state.manifest = await response.json();
    state.collectionId = state.manifest.collections[0]?.id;
    renderStats();
    renderTabs();
    renderGrid();
    openFromHash();
  } catch (error) {
    statsEl.textContent = "The comics could not load.";
    gridEl.appendChild(makeElement("p", "empty-note", "Please try again in a moment."));
    console.error(error);
  }
}

readerBackEl.addEventListener("click", closeReader);
window.addEventListener("hashchange", openFromHash);
init();
