const CACHE = "tone-sovereign-v24";
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
  "./breath-instrument.html",
  "./manifest.webmanifest",
  "./sword-mark.png",
  "./tone-sovereign-logo.png",
  "./assets/sound/ts_first_light_arrival_full.wav",
  "./assets/sound/ts_first_light_living_ambience.wav",
  ...["en", "es"].flatMap(language => [...VOICE_CUES, ...GUIDED_SIT_VOICE_CUES].map(cue => `./assets/voice/${language}/${cue}.mp3`))
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
      .catch(() => caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      }))
  );
});
