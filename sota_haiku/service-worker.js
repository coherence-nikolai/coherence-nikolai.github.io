const CACHE_NAME = "sota-haiku-v25-website-context";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=23-about-lines",
  "./app.js?v=23-about-lines",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./shared/brush-lines-only.png?v=23-about-lines",
  "./shared/haiku-gates.json",
  "./audio/Ambience/temple-gong.wav",
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
      Promise.all(keys.filter((key) => key.startsWith('sota-haiku-') && key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  const navigation=event.request.mode==='navigate';
  const networkFirst=navigation||url.pathname.endsWith('/app.js')||url.pathname.endsWith('/styles.css')||url.pathname.endsWith('/haiku-gates.json');
  const network=async()=>{
    const response=await fetch(event.request);
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{}));}
    return response;
  };
  const cached=async()=>{
    const cache=await caches.open(CACHE_NAME);
    return (await cache.match(event.request))||(navigation?await cache.match('./index.html'):undefined);
  };
  if(networkFirst){
    event.respondWith(network().catch(async()=>await cached()||Response.error()));
    return;
  }
  event.respondWith(cached().then(response=>response||network()));
});
