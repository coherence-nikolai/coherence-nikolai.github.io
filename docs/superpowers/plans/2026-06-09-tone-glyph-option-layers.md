# Tone Glyph Option Layers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Tone Glyph from a 3D-form demo into a broad glyph instrument with clear choices across shape type, material, geometry, gesture, tone, layers, motion, ritual output, and premium hints.

**Architecture:** Keep the current static app and logo intact. Add declarative option catalogs and compact controls, then route all rendering through existing model/state/renderer APIs. Avoid new dependencies; use Three.js already imported by the app.

**Tech Stack:** Static HTML/CSS/JS, Three.js dynamic import, localStorage recipes, browser/Playwright verification.

---

### Task 1: Add Creator Choice Catalogs And State

**Files:**
- Modify: `toneglyph/app.js`

- [ ] Add `shapeTypes`, `materialProfiles`, `motionPresets`, `layerOptions`, and `premiumPacks` catalogs near the existing tone/palette catalogs.
- [ ] Extend `state` with `shapeType`, `material`, `motionPreset`, `zoom`, and `layers`.
- [ ] Preserve existing saved recipes by using fallbacks in `applyRecipe`.

### Task 2: Add Compact Control Surfaces

**Files:**
- Modify: `toneglyph/index.html`
- Modify: `toneglyph/styles.css`
- Modify: `toneglyph/app.js`

- [ ] Add compact panels for Type/Material, Motion/Layers, and Premium hints without changing the logo.
- [ ] Bind select/toggle/range controls through existing `refs`, `bindControls`, and `updateUI` patterns.
- [ ] Keep mobile layout scrollable and avoid toolbar overlap.

### Task 3: Upgrade Renderer Materials, Layers, Motion, And Zoom

**Files:**
- Modify: `toneglyph/app.js`

- [ ] Apply material profiles to line, node, face, and ring materials.
- [ ] Make shape type change face/particle visibility and render emphasis.
- [ ] Add optional particle field objects for particle/living types.
- [ ] Add motion presets for still, breathe, orbit, pulse, unfold, spiral, and mirror.
- [ ] Add zoom to Three and canvas renderers.

### Task 4: Expand Shape Library And Recipe Output

**Files:**
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/index.html`

- [ ] Add Merkaba / star tetrahedron as a real 3D seed.
- [ ] Ensure recipe JSON includes the new option state.
- [ ] Ensure saved glyph chips and restore flow keep working.

### Task 5: Verify And Ship

**Files:**
- Test only, no app files expected.

- [ ] Run `node --check toneglyph/app.js`.
- [ ] Run `git diff --check`.
- [ ] Start local server and verify mobile 3D flow with browser automation.
- [ ] Verify live deployment after push.
