# Tone Glyph Studio Phases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the private/offline Tone Glyph Studio layer: personal meaning encoding, animated particles, changeable scenes, sound glyph settings, breath rituals, symbolic context, custom primitive glyph building, and schema-5 persistence.

**Architecture:** Keep Tone Glyph as a static webapp. Add first-class state objects for `meaning`, `journal`, `scene`, `particles`, `sound`, `breathPattern`, and `customGlyph`; serialize them through `createRecipeSnapshot()` and restore through `applyRecipe()`. Use the existing drawer, renderer, and export paths rather than introducing a backend or a new route.

**Tech Stack:** Static HTML/CSS/JavaScript, Three.js renderer with canvas fallback, localStorage recipes, Playwright browser regressions.

---

### Task 1: Studio Regression

**Files:**
- Create: `/tmp/toneglyph-studio-phases-check.mjs`

- [x] **Step 1: Write the failing test**

The regression opens `/toneglyph`, verifies meaning tags, emotion sliders, journal, scenes, particles, sound settings, custom builder controls, persistence, mobile sizing, and nonblank WebGL.

- [x] **Step 2: Run test to verify it fails**

Run: `node /tmp/toneglyph-studio-phases-check.mjs`

Expected: FAIL with `missing meaning tag controls`.

### Task 2: Data Model And Controls

**Files:**
- Modify: `toneglyph/index.html`
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [x] **Step 1: Add option catalogs and state**

Add catalogs for meaning tags, emotions, scenes, particle modes, sound presets, breath patterns, reflection prompts, symbolic context items, and custom primitive types. Extend `state` with:

```js
meaning: { tags: [], emotions: { peace: 5, joy: 5, courage: 5, grief: 3, anxiety: 2 } },
journal: "",
scene: { preset: "void", intensity: 5, motion: 3, grain: 3 },
particles: { motion: "drift", density: 5, speed: 4, trails: 2 },
sound: { preset: "tone", frequency: toneProfiles[0].freq, volume: 5, uploadedName: "", recordedName: "" },
breathPattern: "free",
reflectionIndex: 0,
customGlyph: { symmetry: "free", mirror: "none", layers: [] }
```

- [x] **Step 2: Add drawer controls**

Add DOM controls for:
- Ritual: meaning tags, emotion sliders, journal, reflection prompt, breath pattern.
- Matter: background scene preset/intensity/motion/grain and particle motion/density/speed/trails.
- Tone: sound preset/frequency/volume, play sound, upload sound, record controls.
- Form: custom family/primitive builder, custom symmetry/mirror, layer count, clear custom glyph.
- Form/context: symbolic context panel.

- [x] **Step 3: Bind controls**

Add refs, listeners, and UI sync. Update `document.body.dataset.scene` when scene changes. Rebuild glyph on custom primitive changes.

### Task 3: Persistence

**Files:**
- Modify: `toneglyph/app.js`

- [x] **Step 1: Bump recipe snapshot**

Set `schemaVersion: 5` and serialize the new fields through `createRecipeSnapshot()`.

- [x] **Step 2: Restore schema 5 safely**

Update `legacyRecipeFromRecord()` and `applyRecipe()` with defaults, clamping, and bounded arrays. Keep existing localStorage key.

- [x] **Step 3: Save-chip display**

Let saved chips display intention first, then the first meaning tag, then seed label.

### Task 4: Custom Glyph Geometry

**Files:**
- Modify: `toneglyph/app.js`

- [x] **Step 1: Add Custom family**

Add a `custom` glyph family with one `personal-glyph` seed.

- [x] **Step 2: Add primitive geometry**

Implement `createCustomGlyphGeometry(recipeState)` for circles, lines, triangles, spirals, and curves. Apply mirror and radial repeat settings. Fall back to a simple center circle when no custom layers exist.

- [x] **Step 3: Wire model selection**

Make `buildGlyphModel()` return custom geometry when family is `custom`.

### Task 5: Living Scene Rendering

**Files:**
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [x] **Step 1: Scene CSS**

Add scene-specific body/app-shell CSS variables for void, aurora, crop-field, starfield, temple-smoke, paper-ink, water-veil, dawn, obsidian, and transparent.

- [x] **Step 2: Three.js particles**

Update particle animation modes: still, drift, orbit, breath, spark, comet, tone-sync, node-magnet. Respect density, speed, trails, reduced motion, and layer visibility.

- [x] **Step 3: Export parity**

Update `drawGlyph2D()` so background scenes and particle settings affect exported card/wallpaper/square images.

### Task 6: Sound Glyphs And Breath

**Files:**
- Modify: `toneglyph/app.js`

- [x] **Step 1: Sound presets**

Add sound preset frequency behavior for current tone, Solfeggio-style 396/432/528/639/741/852, and custom frequency.

- [x] **Step 2: Play/upload/record hooks**

Implement play sound using the existing oscillator. Add upload session playback and a guarded MediaRecorder flow when available.

- [x] **Step 3: Breath patterns**

Add breath pattern labels and use the chosen pattern for user-facing ritual context and renderer breath rate.

### Task 7: Verification And Shipping

**Files:**
- Modify: `toneglyph/index.html`

- [x] **Step 1: Cache bump**

Bump `app.js` and `styles.css` query strings.

- [x] **Step 2: Run checks**

Run:

```bash
node --check toneglyph/app.js
git diff --check
node /tmp/toneglyph-studio-phases-check.mjs
node /tmp/toneglyph-crop-glyphs-check.mjs
node /tmp/toneglyph-rendered-qa.mjs
node /tmp/toneglyph-mobile-space-check.mjs
```

- [x] **Step 3: Browser sanity**

Open the local route in the in-app browser and verify Crop plus Studio controls are visible without horizontal overflow.

- [x] **Step 4: Commit and push**

Commit message: `feat: add Tone Glyph studio encoding controls`

- [x] **Step 5: Live verification**

Verify the live HTML cache key and run `/tmp/toneglyph-studio-phases-check.mjs` against `https://coherence-nikolai.app/toneglyph/`.

---

**Scope Notes**

Public community/gallery is intentionally not included in this static-webapp phase. This pass provides private saved glyphs, recipe export, shareable card export, and the data model needed for future backend-backed community features.
