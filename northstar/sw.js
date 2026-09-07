const CACHE_NAME = "northstar-shell-v57";
const ownMatch=request=>caches.open(CACHE_NAME).then(cache=>cache.match(request));
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "/assets/tool-context.css?v=20260907-r1",
  "/assets/tool-context.js?v=20260907-r1",
  "./styles.css?v=20260602a",
  "./manifest.webmanifest?v=20260602a",
  "./icon.svg?v=20260602a",
  "./brand-mark.svg?v=20260602a",
  "./brand-mark-light.svg?v=20260602a",
  "./js/app.js?v=20260602a",
  "./js/state.js?v=20260602a",
  "./js/data/content.js?v=20260602a"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("northstar-shell-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => ownMatch("./index.html").then((cached) => cached || ownMatch("./")))
    );
    return;
  }

  event.respondWith(
    ownMatch(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});
