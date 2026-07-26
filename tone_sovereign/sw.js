const CACHE = "tone-sovereign-v13";
const VOICE_CUES = [
  "ts_about_introduction_v1",
  "ts_cross_open_question_v1",
  "ts_discern_direct_v1",
  "ts_embody_enter_v1",
  "ts_first_light_tagline_v1",
  "ts_integrate_carry_v1",
  "ts_notice_contact_v1",
  "ts_notice_open_v1",
  "ts_notice_sight_v1",
  "ts_notice_sound_v1",
  "ts_notice_thought_v1",
  "ts_reclaim_centre_remains_v1",
  "ts_stabilise_inhale_v1"
];
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./sword-mark.png",
  "./tone-sovereign-logo.png",
  "./assets/sound/ts_first_light_arrival_full.wav",
  "./assets/sound/ts_first_light_living_ambience.wav",
  ...["en", "es"].flatMap(language => VOICE_CUES.map(cue => `./assets/voice/${language}/${cue}.mp3`))
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match("./index.html")))
  );
});
