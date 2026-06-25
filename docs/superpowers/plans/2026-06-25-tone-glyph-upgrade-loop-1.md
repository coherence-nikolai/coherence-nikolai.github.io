# Tone Glyph Upgrade Loop 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Tone Glyph feel more like a usable symbolic instrument by surfacing Shape, Audio, World, Motion, Ritual, and Save as clear primary actions, and by making symbol context choices visibly affect the glyph.

**Architecture:** Preserve the static webapp and current renderer architecture. Make small, reversible changes to `toneglyph/index.html`, `toneglyph/app.js`, and `toneglyph/styles.css` rather than restructuring the monolithic renderer in this loop.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, canvas fallback, optional Three.js renderer loaded from CDN.

---

### Task 1: Primary Action Rail

**Files:**
- Modify: `toneglyph/index.html`
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [x] Replace the four action buttons with six clear actions: Shape, Audio, World, Motion, Ritual, Save.
- [x] Map each action to the correct existing control tab: Shape -> form, Audio -> tone, World -> matter, Motion -> motion, Ritual -> ritual, Save -> save.
- [x] Rename the visible Matter tab to World, because it already contains scene/background/orbs.
- [x] Update stage hint copy so the user knows the bottom rail is the main path.
- [x] Adjust CSS grid columns and mobile spacing so six buttons fit without hiding the glyph.

### Task 2: Symbol Context As Visible Glyph Layer

**Files:**
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [x] Add symbol context layer metadata to the glyph model without changing existing seed generation.
- [x] Render the selected symbol context as an additional visual overlay in both Three.js and canvas paths where practical.
- [x] Add user-facing copy on context cards that communicates the context applies shape, motion, scene, breath, and tags.
- [x] Keep context selection compatible with existing recipe save/restore.

### Task 3: Ritual/Journal Save Metadata

**Files:**
- Modify: `toneglyph/app.js`

- [x] Include context label, journal preview, audio frequency, scene, and particle motion in saved chip titles or accessible labels.
- [x] Keep localStorage schema backward compatible.
- [x] Do not store uploaded/recorded audio blobs in recipes.

### Task 4: Verification

**Files:**
- No committed test artifacts.

- [x] Run `node --check toneglyph/app.js`.
- [x] Run `git diff --check -- toneglyph/index.html toneglyph/app.js toneglyph/styles.css`.
- [x] Run a local server and verify mobile viewport `390x844`:
  - page loads
  - action rail has Shape, Audio, World, Motion, Ritual, Save
  - Audio opens Audio controls and Play Audio shows a toast
  - World opens scene/background/orb controls
  - Motion opens motion controls
  - Ritual opens intention/journal controls
  - Symbol Context click visibly changes the active context state and app status
  - no console errors
- [ ] Push to `main` and verify the live app serves the new cache key.
