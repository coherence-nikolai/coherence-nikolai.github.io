const CACHE = "tone-sovereign-v36";
const COMIC_CACHE = "tone-sovereign-comics-v2";
const MEDIA_CACHE = "tone-sovereign-media-v1";
// v1 is also used by a sibling app. Only retire editions positively identified here.
const RETIRED_APP_CACHES = ["tone-sovereign-v32", "tone-sovereign-v33", "tone-sovereign-v34", "tone-sovereign-v35"];
const THE_LOCK_EDITION = "ink-v4";
const VOICE_CUES = [
  "ts_about_introduction_v1",
  "ts_attunement_capacity_v1",
  "ts_attunement_context_v1",
  "ts_attunement_meeting_v1",
  "ts_attunement_next_step_v1",
  "ts_attunement_pull_v1",
  "ts_cross_return_v1",
  "ts_discern_added_v1",
  "ts_discern_direct_v1",
  "ts_discern_honest_v1",
  "ts_embody_enter_v1",
  "ts_embody_silence_v1",
  "ts_first_light_tagline_v1",
  "ts_integrate_carry_v1",
  "ts_integrate_include_v1",
  "ts_integrate_decentre_v1",
  "ts_notice_close_v1",
  "ts_notice_contact_v1",
  "ts_notice_open_v1",
  "ts_notice_sight_v1",
  "ts_notice_sound_v1",
  "ts_notice_thought_v1",
  "ts_reclaim_centre_remains_v1",
  "ts_reciprocal_action_v1",
  "ts_reciprocal_contribution_v1",
  "ts_reciprocal_desire_v1",
  "ts_reciprocal_include_fear_v1",
  "ts_reciprocal_nourishment_v1",
  "ts_stabilise_exhale_v1",
  "ts_stabilise_inhale_again_v1",
  "ts_stabilise_inhale_v1",
  "ts_stabilise_long_exhale_v1",
  "ts_stabilise_natural_breath_v1",
  "ts_stabilise_optional_hold_v1",
  "ts_stabilise_return_attention_v1"
];
const GUIDED_SIT_VOICE_CUES = [
  "breath_at_the_threshold",
  "simple_noting",
  "the_living_body",
  "open_field",
  "golden_age_goodwill",
  "sound_and_silence",
  "holding_opposites",
  "sovereign_rest"
].flatMap(practice => Array.from(
  { length: 10 },
  (_, index) => `ts_sit_${practice}_${String(index + 1).padStart(2, "0")}_v1`
).concat(`ts_sit_${practice}_intro_v1`));
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./catalog.js",
  "./guided-sits.json",
  "./app.js",
  "./offline-downloads.js",
  "./offline-packs.json",
  "./narrative-ui.js",
  "./narrative-metadata.js",
  "./tone-state.mjs",
  "./comic-editions.json",
  "./comic-catalogue.mjs",
  "./integrate-practice.mjs",
  "./breath-instrument.html",
  "./manifest.webmanifest",
  "./manifest-es.webmanifest",
  "./sword-mark.png",
  "./tone-sovereign-logo.png",
  `./assets/comics/en/specials/the-lock/transcript.json?edition=${THE_LOCK_EDITION}`,
  `./assets/comics/es/specials/the-lock/transcript.json?edition=${THE_LOCK_EDITION}`,
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(keys.filter(key => RETIRED_APP_CACHES.includes(key)).map(key => caches.delete(key)))),
      // Replace only the old LOCK edition; keep other downloaded comics available offline.
      caches.open(COMIC_CACHE).then(cache => cache.keys().then(requests => Promise.all(requests.filter(request => {
        const url = new URL(request.url);
        return url.origin === self.location.origin
          && url.pathname.includes("/assets/comics/")
          && url.pathname.includes("/specials/the-lock/")
          && url.searchParams.get("edition") !== THE_LOCK_EDITION;
      }).map(request => cache.delete(request)))))
    ])
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && /\/assets\/(voice|sound)\//.test(url.pathname)) {
    event.respondWith(caches.open(MEDIA_CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok) { try { await cache.put(event.request, response.clone()); } catch {} }
      return response;
    }));
    return;
  }
  if (url.origin === self.location.origin && (url.pathname.includes("/assets/comics/") || url.pathname.startsWith("/tone_comics/assets/"))) {
    event.respondWith(
      caches.open(COMIC_CACHE).then(cache => cache.match(event.request).then(cached => cached || caches.match(event.request).then(coreCached => coreCached || fetch(event.request).then(async response => {
          if (response.ok) {
            // Keep this event alive until storage finishes; quota errors must not hide an online page.
            try { await cache.put(event.request, response.clone()); } catch {}
          }
          return response;
        }))))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(async response => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          try { await (await caches.open(CACHE)).put(event.request, copy); } catch {}
        }
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      }))
  );
});
