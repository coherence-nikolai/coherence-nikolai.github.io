const CACHE_NAME = "catastic-v6";
const ownMatch=request=>caches.open(CACHE_NAME).then(cache=>cache.match(request));
const SCOPE = self.registration.scope;
const CORE_ASSETS = [SCOPE, `${SCOPE}index.html`, `${SCOPE}manifest.webmanifest`, `${SCOPE}catastic-icon.svg`, '/catastic/assets/index-CLYIcHqx.js', '/catastic/assets/index-DjQk9Ktd.css', '/assets/tool-context.css?v=20260907-r2', '/assets/tool-context.js?v=20260907-r2'];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter(key=>key.startsWith('catastic-')&&key!==CACHE_NAME).map(key=>caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||(!url.pathname.startsWith('/catastic/')&&!CORE_ASSETS.includes(url.pathname+url.search)))return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(SCOPE, copy));
          }
          return response;
        })
        .catch(async () => (await ownMatch(SCOPE)) || ownMatch(`${SCOPE}index.html`))
    );
    return;
  }

  event.respondWith(
    ownMatch(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() => Response.error())
      );
    })
  );
});
