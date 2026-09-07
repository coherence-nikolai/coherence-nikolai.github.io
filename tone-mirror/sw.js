const CACHE_NAME = "tone-mirror-v3";
const ownMatch=request=>caches.open(CACHE_NAME).then(cache=>cache.match(request));
const APP_SHELL = [
  "/tone-mirror/",
  "/tone-mirror/manifest.webmanifest",
  "/tone-mirror/icon.svg",
  "/tone-mirror/assets/index-26CQZSCk.js",
  "/tone-mirror/assets/index-C-B26Crp.css",
  "/assets/tool-context.css?v=20260907-r1",
  "/assets/tool-context.js?v=20260907-r1"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('tone-mirror-') && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const shared=APP_SHELL.includes(url.pathname+url.search);
  if (url.origin !== self.location.origin || (!url.pathname.startsWith("/tone-mirror/")&&!shared)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => ownMatch(request).then((cached) => cached ?? ownMatch("/tone-mirror/")))
    );
    return;
  }

  event.respondWith(
    ownMatch(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => Response.error());
    })
  );
});
