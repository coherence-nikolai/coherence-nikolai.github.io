const CACHE_NAME = "tone-hidden-worlds-20260712-brandmark";
const APP_SHELL = [
  "/tone_hidden_worlds/",
  "/tone_hidden_worlds/index.html",
  "/tone_hidden_worlds/styles.css?v=tone-hidden-worlds-20260712-brandmark",
  "/tone_hidden_worlds/app.js?v=tone-hidden-worlds-20260712-brandmark",
  "/tone_hidden_worlds/atlas.js",
  "/tone_hidden_worlds/icon.svg",
  "/tone_hidden_worlds/assets/app-icon.png",
  "/tone_hidden_worlds/privacy/",
  "/tone_hidden_worlds/boundaries/",
  "/tone_hidden_worlds/support/"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith("/tone_hidden_worlds/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }))
  );
});
