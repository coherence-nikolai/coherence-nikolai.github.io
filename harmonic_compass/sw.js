const CACHE_NAME = "harmonic-compass-v25";
const ownMatch=request=>caches.open(CACHE_NAME).then(cache=>cache.match(request));
const APP_SHELL = [
  "/harmonic_compass/",
  "/harmonic_compass/index.html",
  "/harmonic_compass/styles.css?v=23",
  "/harmonic_compass/app.js?v=23",
  "/harmonic_compass/manifest.webmanifest",
  "/assets/favicon.svg",
  "/assets/tool-context.css?v=20260907-r2",
  "/assets/tool-context.js?v=20260907-r2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith('harmonic-compass-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if(event.request.method !== 'GET')return;
  const url = new URL(event.request.url);
  const shared=APP_SHELL.includes(url.pathname+url.search);
  if (url.origin !== self.location.origin || (!url.pathname.startsWith("/harmonic_compass/")&&!shared)) {
    return;
  }

  if (event.request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => ownMatch(event.request).then((cached) => cached || ownMatch("/harmonic_compass/index.html")))
    );
    return;
  }

  event.respondWith(
    ownMatch(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
