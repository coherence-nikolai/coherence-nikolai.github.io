# Tone Glyph Living Ritual Instrument Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Tone Glyph into the Tone-family living ritual instrument: a quiet living 3D object with Tune, Shape, Seal, and Save actions, richer family aesthetics, sealed glyph signatures, and artifact exports.

**Architecture:** Keep the current static `toneglyph/` route and existing Three.js/Canvas renderer, but introduce a clearer UI action model inside the current files. The first build avoids a broad file split so the live route stays stable, then creates smaller state/helper surfaces inside `app.js` to make future extraction safe.

**Tech Stack:** Static HTML/CSS/JavaScript, Three.js from CDN, Canvas 2D fallback, localStorage recipes, GitHub Pages.

---

## Source Map

Current files:

- `toneglyph/index.html`: route markup, topbar, canvas stage, mode rail, current control dock, panels, and script/style includes.
- `toneglyph/styles.css`: all Tone Glyph layout, responsive behavior, button styles, panel visibility, and visual theme.
- `toneglyph/app.js`: catalogs, state, DOM refs, control binding, glyph recipes, renderer classes, export drawing, and localStorage saves.
- `docs/superpowers/specs/2026-06-09-tone-glyph-living-ritual-instrument-design.md`: approved design spec.

New committed files:

- No production files beyond the three existing Tone Glyph route files.
- No test harness files are committed in this plan. Temporary verification scripts are created under `/tmp` during execution.

## Task 1: Primary Action Rail And Drawer State

**Files:**
- Modify: `toneglyph/index.html`
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [ ] **Step 1: Write the failing browser check**

Create `/tmp/toneglyph-action-rail-check.mjs`:

```js
import { chromium } from "/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8801/toneglyph/", { waitUntil: "domcontentloaded" });

const buttons = await page.locator("[data-action-button]").evaluateAll((nodes) => nodes.map((node) => node.textContent.trim()));
if (buttons.join("|") !== "Tune|Shape|Seal|Save") {
  throw new Error(`Expected action rail buttons, received: ${buttons.join("|")}`);
}

const initial = await page.evaluate(() => ({
  action: document.body.dataset.action,
  drawerHidden: document.querySelector("#control-drawer").hidden,
  visiblePanels: Array.from(document.querySelectorAll(".control-dock > .panel"))
    .filter((node) => getComputedStyle(node).display !== "none" && node.getBoundingClientRect().height > 0)
    .map((node) => node.className)
}));

if (initial.action !== "none" || initial.drawerHidden !== true || initial.visiblePanels.length !== 0) {
  throw new Error(`Expected quiet first screen, received: ${JSON.stringify(initial)}`);
}

await page.click('[data-action-button="tune"]');
const tune = await page.evaluate(() => ({
  action: document.body.dataset.action,
  tab: document.body.dataset.controlTab,
  title: document.querySelector("#drawer-title").textContent.trim(),
  visiblePanels: Array.from(document.querySelectorAll(".control-dock > .panel"))
    .filter((node) => getComputedStyle(node).display !== "none" && node.getBoundingClientRect().height > 0)
    .map((node) => node.className)
}));

if (tune.action !== "tune" || tune.tab !== "tone" || tune.title !== "Tune") {
  throw new Error(`Tune action did not open Tone drawer: ${JSON.stringify(tune)}`);
}

await page.click('[data-action-button="save"]');
const save = await page.evaluate(() => ({
  action: document.body.dataset.action,
  tab: document.body.dataset.controlTab,
  title: document.querySelector("#drawer-title").textContent.trim(),
  visiblePanels: Array.from(document.querySelectorAll(".control-dock > .panel"))
    .filter((node) => getComputedStyle(node).display !== "none" && node.getBoundingClientRect().height > 0)
    .map((node) => node.className)
}));

if (save.action !== "save" || save.tab !== "save" || !save.visiblePanels.some((name) => name.includes("export-panel"))) {
  throw new Error(`Save action did not open export drawer: ${JSON.stringify(save)}`);
}

await browser.close();
```

- [ ] **Step 2: Start local server and verify the check fails**

Run:

```bash
python3 -m http.server 8801 --bind 127.0.0.1
```

In another command, run:

```bash
node /tmp/toneglyph-action-rail-check.mjs
```

Expected: FAIL because `[data-action-button]` and `#control-drawer` do not exist yet.

- [ ] **Step 3: Update the body dataset and add the action rail**

In `toneglyph/index.html`, change the body tag:

```html
<body data-mode="ritual" data-view="living" data-control-tab="form" data-action="none">
```

After the `mode-rail` closing tag, add:

```html
<nav id="action-rail" class="action-rail" aria-label="Tone Glyph actions">
  <button class="action-button" type="button" data-action-button="tune" aria-expanded="false">Tune</button>
  <button class="action-button" type="button" data-action-button="shape" aria-expanded="false">Shape</button>
  <button class="action-button primary-action-button" type="button" data-action-button="seal" aria-expanded="false">Seal</button>
  <button class="action-button" type="button" data-action-button="save" aria-expanded="false">Save</button>
</nav>
<p id="stage-hint" class="stage-hint">Drag to turn. Hold to listen. Seal when it feels right.</p>
```

- [ ] **Step 4: Convert the control dock into a drawer**

In `toneglyph/index.html`, change:

```html
<section class="control-dock" aria-label="Tone Glyph creator controls">
```

to:

```html
<section id="control-drawer" class="control-dock" aria-label="Tone Glyph creator controls" hidden>
  <div class="drawer-head">
    <div>
      <p class="drawer-kicker">Tone Glyph</p>
      <h2 id="drawer-title">Tune</h2>
    </div>
    <button id="drawer-close-button" class="drawer-close" type="button" aria-label="Close controls">Close</button>
  </div>
```

Keep the existing `<div id="control-tabs" class="control-tabs" ...>` immediately after the new drawer head. Ensure the existing final `</section>` still closes the drawer.

- [ ] **Step 5: Extend app state and action catalogs**

In `toneglyph/app.js`, after `controlTabCopy`, add:

```js
  const actionCopy = {
    none: { label: "Tone Glyph", tab: "form" },
    tune: { label: "Tune", tab: "tone" },
    shape: { label: "Shape", tab: "form" },
    seal: { label: "Seal", tab: "ritual" },
    save: { label: "Save", tab: "save" }
  };

  const tabToAction = {
    form: "shape",
    matter: "tune",
    tone: "tune",
    motion: "shape",
    ritual: "seal",
    layers: "shape",
    save: "save"
  };
```

Add `save: "Save"` to `controlTabCopy`.

Add to `state`:

```js
    activeAction: "none",
```

- [ ] **Step 6: Bind action rail refs and events**

In `bindRefs()`, add:

```js
    refs.actionButtons = Array.from(document.querySelectorAll("[data-action-button]"));
    refs.controlDrawer = document.getElementById("control-drawer");
    refs.drawerTitle = document.getElementById("drawer-title");
    refs.drawerClose = document.getElementById("drawer-close-button");
    refs.stageHint = document.getElementById("stage-hint");
```

In `bindControls()`, add after mode button binding:

```js
    refs.actionButtons.forEach((button) => {
      button.addEventListener("click", () => setActiveAction(button.dataset.actionButton));
    });
    refs.drawerClose.addEventListener("click", () => setActiveAction("none"));
```

- [ ] **Step 7: Implement action state helpers**

Add below `setMode(mode)`:

```js
  function setActiveAction(action) {
    if (!actionCopy[action]) return;
    state.activeAction = action;
    document.body.dataset.action = action;
    if (action !== "none") {
      state.controlTab = actionCopy[action].tab;
      document.body.dataset.controlTab = state.controlTab;
    }
    updateUI();
    if (action !== "none") showToast(actionCopy[action].label);
  }
```

Update `setControlTab(tab)` to:

```js
  function setControlTab(tab) {
    if (!controlTabCopy[tab]) return;
    state.controlTab = tab;
    state.activeAction = tabToAction[tab] || state.activeAction || "shape";
    document.body.dataset.controlTab = tab;
    document.body.dataset.action = state.activeAction;
    updateUI();
    showToast(controlTabCopy[tab] + " controls");
  }
```

- [ ] **Step 8: Update UI state for rail, drawer, and title**

In `updateUI()`, after control tab updates, add:

```js
    refs.actionButtons.forEach((button) => {
      const isActive = button.dataset.actionButton === state.activeAction;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
    const drawerOpen = state.activeAction !== "none";
    refs.controlDrawer.hidden = !drawerOpen;
    refs.drawerTitle.textContent = drawerOpen ? actionCopy[state.activeAction].label : "Tone Glyph";
```

- [ ] **Step 9: Add save drawer visibility rule**

In `toneglyph/styles.css`, add `body[data-control-tab="save"] .export-panel` to the existing visible panel selector:

```css
body[data-control-tab="save"] .export-panel {
  display: block;
}
```

Place it with the selector group around the current `body[data-control-tab="layers"] .export-panel` rule.

- [ ] **Step 10: Run syntax and action rail check**

Run:

```bash
node --check toneglyph/app.js
node /tmp/toneglyph-action-rail-check.mjs
git diff --check
```

Expected: all commands pass.

- [ ] **Step 11: Commit Task 1**

```bash
git add toneglyph/index.html toneglyph/app.js toneglyph/styles.css
git commit -m "feat: add Tone Glyph ritual action rail"
```

## Task 2: Tone Family Aesthetic Pass

**Files:**
- Modify: `toneglyph/styles.css`
- Modify: `toneglyph/index.html`

- [ ] **Step 1: Write the visual style check**

Create `/tmp/toneglyph-family-style-check.mjs`:

```js
import { chromium } from "/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8801/toneglyph/", { waitUntil: "domcontentloaded" });

const style = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  const action = getComputedStyle(document.querySelector("[data-action-button='seal']"));
  return {
    ink: root.getPropertyValue("--ink").trim(),
    gold: root.getPropertyValue("--gold").trim(),
    teal: root.getPropertyValue("--teal").trim(),
    bodyBg: body.backgroundImage,
    sealBg: action.backgroundImage,
    brandFont: getComputedStyle(document.querySelector(".brand strong")).fontFamily
  };
});

if (style.ink !== "#0b0707" || style.gold !== "#e8d7b2" || style.teal !== "#86bdb4") {
  throw new Error(`Tone family variables missing: ${JSON.stringify(style)}`);
}

if (!style.bodyBg.includes("18, 9, 8") || !style.sealBg.includes("linear-gradient")) {
  throw new Error(`Tone family background or primary action gradient missing: ${JSON.stringify(style)}`);
}

await browser.close();
```

- [ ] **Step 2: Run style check and verify it fails before CSS changes**

Run:

```bash
node /tmp/toneglyph-family-style-check.mjs
```

Expected: FAIL because `--ink`, `--gold`, and `--teal` are not defined in Tone Glyph CSS.

- [ ] **Step 3: Replace Tone Glyph root variables with Tone family variables**

At the top of `toneglyph/styles.css`, replace the current `:root` color block with:

```css
:root {
  color-scheme: dark;
  --ink: #0b0707;
  --ink-2: #130d0c;
  --ink-3: #211715;
  --parchment: #f2eadf;
  --bone: var(--parchment);
  --muted: rgba(242, 234, 223, 0.64);
  --faint: rgba(242, 234, 223, 0.36);
  --hairline: rgba(242, 234, 223, 0.13);
  --gold: #e8d7b2;
  --amber: #bd8d64;
  --rose: #b98574;
  --teal: #86bdb4;
  --bg: #050303;
  --bg-soft: var(--ink-2);
  --text: var(--bone);
  --line: var(--hairline);
  --glass: rgba(11, 7, 7, 0.68);
  --glass-strong: rgba(19, 13, 12, 0.88);
  --tone-a: var(--gold);
  --tone-b: var(--teal);
  --tone-c: var(--rose);
  --tone-d: #6f5f50;
  --danger: #c98578;
  --shadow: rgba(0, 0, 0, 0.46);
  --display: "Iowan Old Style", "IowanOldStyle-Roman", "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --body: Avenir, "Avenir Next", "Gill Sans", "Trebuchet MS", sans-serif;
  --mono: "SFMono-Regular", "Menlo", "Consolas", monospace;
  font-family: var(--body);
}
```

- [ ] **Step 4: Update the app shell background**

Replace `.app-shell` background with:

```css
.app-shell {
  position: relative;
  width: 100vw;
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 8%, rgba(134, 189, 180, 0.10), transparent 23rem),
    radial-gradient(circle at 52% 18%, rgba(189, 141, 100, 0.20), transparent 31rem),
    radial-gradient(circle at 50% 52%, rgba(232, 215, 178, 0.10), transparent 34rem),
    linear-gradient(180deg, #120908 0%, var(--ink) 58%, #050303 100%);
}
```

- [ ] **Step 5: Style brand and action rail with Tone family language**

Add or update these CSS blocks:

```css
.brand strong {
  font-family: var(--display);
  color: #f0ddc7;
  font-size: 1.08rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 0 18px rgba(232, 215, 178, 0.22);
}

.brand-mark {
  border-color: rgba(232, 215, 178, 0.42);
  color: var(--gold);
  background: radial-gradient(circle, rgba(232, 215, 178, 0.16), rgba(11, 7, 7, 0.44));
  box-shadow: 0 0 34px rgba(232, 215, 178, 0.18);
}

.action-rail {
  position: absolute;
  z-index: 5;
  left: 50%;
  bottom: calc(78px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: min(520px, calc(100vw - 28px));
  padding: 7px;
  border: 1px solid rgba(242, 234, 223, 0.12);
  border-radius: 999px;
  background: rgba(11, 7, 7, 0.62);
  box-shadow: 0 18px 56px var(--shadow);
  backdrop-filter: blur(18px);
}

.action-button {
  min-height: 42px;
  border: 1px solid rgba(242, 234, 223, 0.10);
  border-radius: 999px;
  color: rgba(242, 234, 223, 0.78);
  background: rgba(242, 234, 223, 0.055);
  cursor: pointer;
  font-weight: 760;
}

.action-button.active,
.primary-action-button {
  color: #120908;
  border-color: rgba(232, 215, 178, 0.36);
  background: linear-gradient(135deg, rgba(232, 215, 178, 0.95), rgba(134, 189, 180, 0.78));
  box-shadow: 0 0 32px rgba(232, 215, 178, 0.18);
}
```

- [ ] **Step 6: Style drawer head and close button**

Add:

```css
.drawer-head {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(242, 234, 223, 0.10);
  border-radius: 18px;
  background: rgba(11, 7, 7, 0.48);
}

.drawer-kicker {
  margin: 0 0 3px;
  color: rgba(232, 215, 178, 0.70);
  font-family: var(--mono);
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.drawer-head h2 {
  margin: 0;
  color: var(--bone);
  font-family: var(--display);
  font-size: 1.55rem;
  font-weight: 400;
  letter-spacing: -0.02em;
}

.drawer-close {
  min-height: 36px;
  border: 1px solid rgba(242, 234, 223, 0.12);
  border-radius: 999px;
  color: rgba(242, 234, 223, 0.72);
  background: rgba(242, 234, 223, 0.05);
  padding: 0 12px;
}
```

- [ ] **Step 7: Add the first-entry stage hint**

Add:

```css
.stage-hint {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: calc(22px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  width: min(420px, calc(100vw - 32px));
  margin: 0;
  color: rgba(242, 234, 223, 0.62);
  font-size: 0.78rem;
  text-align: center;
  pointer-events: none;
}
```

When the drawer is open, hide the hint:

```css
body:not([data-action="none"]) .stage-hint {
  display: none;
}
```

- [ ] **Step 8: Update mobile positioning**

Inside `@media (max-width: 780px)`, add:

```css
  .action-rail {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    width: 100%;
    margin: 0 0 8px;
  }

  .stage-hint {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    width: 100%;
    margin: -2px 0 10px;
  }
```

- [ ] **Step 9: Run checks**

Run:

```bash
node /tmp/toneglyph-family-style-check.mjs
node /tmp/toneglyph-action-rail-check.mjs
git diff --check
```

Expected: all commands pass.

- [ ] **Step 10: Commit Task 2**

```bash
git add toneglyph/index.html toneglyph/styles.css
git commit -m "style: align Tone Glyph with Tone family"
```

## Task 3: Renderer Material Hierarchy And Depth

**Files:**
- Modify: `toneglyph/app.js`

- [ ] **Step 1: Write the renderer marker check**

Create `/tmp/toneglyph-renderer-depth-check.mjs`:

```js
import { chromium } from "/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8801/toneglyph/", { waitUntil: "domcontentloaded" });

const source = await page.evaluate(async () => {
  const response = await fetch("./app.js?v=20260610-living-ritual", { cache: "no-store" });
  return response.text();
});

for (const marker of ["toneFamilyPalette", "glyphLineStyle", "glyphNodeStyle", "averageLineDepth"]) {
  if (!source.includes(marker)) throw new Error(`Missing renderer marker ${marker}`);
}

await browser.close();
```

- [ ] **Step 2: Version the app asset during this renderer pass**

In `toneglyph/index.html`, change the script include to:

```html
<script src="./app.js?v=20260610-living-ritual" defer></script>
```

- [ ] **Step 3: Add Tone family palette constants**

In `toneglyph/app.js`, after `palettes`, add:

```js
  const toneFamilyPalette = {
    ink: "#0b0707",
    inkSoft: "#130d0c",
    parchment: "#f2eadf",
    gold: "#e8d7b2",
    amber: "#bd8d64",
    rose: "#b98574",
    teal: "#86bdb4",
    shadow: "#050303"
  };
```

- [ ] **Step 4: Add renderer style helpers**

Add below `renderSettings()`:

```js
  function averageLineDepth(model, line) {
    const from = model.nodes[line.from] || { z: 0 };
    const to = model.nodes[line.to] || { z: 0 };
    return ((from.z || 0) + (to.z || 0)) / 2;
  }

  function glyphLineStyle(model, line, index, settings) {
    const depth = averageLineDepth(model, line);
    const isPrimary = line.weight >= 0.58 || line.role === "edge";
    const isBack = depth < -0.12;
    const color = isPrimary ? toneFamilyPalette.gold : isBack ? toneFamilyPalette.teal : toneFamilyPalette.parchment;
    const opacityBase = isBack ? 0.08 : isPrimary ? 0.22 : 0.14;
    return {
      color,
      emissive: isPrimary ? toneFamilyPalette.gold : toneFamilyPalette.teal,
      opacity: (opacityBase + line.weight * 0.18) * settings.lineOpacity,
      radius: (0.004 + line.weight * (isPrimary ? 0.006 : 0.004)) * settings.thickness,
      travelPhase: index * 0.33 + Math.abs(depth) * 1.7
    };
  }

  function glyphNodeStyle(node, index) {
    const isCenter = index === 0 || node.ring === "center";
    return {
      color: isCenter ? toneFamilyPalette.gold : index % 3 === 0 ? toneFamilyPalette.rose : toneFamilyPalette.teal,
      scale: isCenter ? 1.22 : Math.max(0.7, Math.min(1.55, node.radius || 1))
    };
  }
```

- [ ] **Step 5: Use line style helper in Three line meshes**

In `ThreeGlyphRenderer.buildObjects()`, replace the current line material block with:

```js
        const style = glyphLineStyle(this.model, line, index, settings);
        const material = new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.emissive,
          emissiveIntensity: 0.42,
          transparent: true,
          opacity: style.opacity,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness
        });
        const mesh = makeCylinderBetween(THREE, point(from), point(to), style.radius, material);
        mesh.userData = { line, index, baseOpacity: material.opacity, travelPhase: style.travelPhase };
```

- [ ] **Step 6: Use node style helper in Three node meshes**

In `ThreeGlyphRenderer.buildObjects()`, replace the node material color choices with:

```js
        const style = glyphNodeStyle(node, index);
        const material = new THREE.MeshStandardMaterial({
          color: style.color,
          emissive: style.color,
          emissiveIntensity: (isCenter ? 1.3 : 0.9) * materialProfile.glow,
          roughness: materialProfile.roughness,
          metalness: materialProfile.metalness
        });
        const mesh = new THREE.Mesh(isCenter ? centerGeometry : nodeGeometry, material);
        mesh.position.copy(point(node));
        mesh.scale.setScalar(style.scale);
```

- [ ] **Step 7: Update Three `updateTheme()` to use helpers**

Replace line and node color updates with:

```js
      const settings = renderSettings();
      this.nodeMeshes.forEach((mesh, index) => {
        const style = glyphNodeStyle(mesh.userData.node, index);
        mesh.material.color.set(style.color);
        mesh.material.emissive.set(style.color);
      });
      this.lineMeshes.forEach((mesh, index) => {
        const style = glyphLineStyle(this.model, mesh.userData.line, index, settings);
        mesh.material.color.set(style.color);
        mesh.material.emissive.set(style.emissive);
      });
```

Keep the existing face, particle, and ring loops after these replacements.

- [ ] **Step 8: Add travelling edge-light timing**

In `ThreeGlyphRenderer.animate()`, update the line mesh loop to use `travelPhase`:

```js
      this.lineMeshes.forEach((mesh, index) => {
        const phase = mesh.userData.travelPhase || index * 0.33;
        const wave = reduced ? 0.25 : (Math.sin(seconds * (2.2 + motion.spiral * 0.35) + phase) + 1) / 2;
        mesh.material.opacity = mesh.userData.baseOpacity + wave * 0.11 * settings.lineOpacity + tapPulse * 0.16;
        mesh.material.emissiveIntensity = (0.32 + wave * 0.54 + tapPulse * 0.7 + sealPulse * 0.48) * settings.glow;
      });
```

- [ ] **Step 9: Update Canvas line drawing to use the same hierarchy**

In `drawGlyph2D()`, inside `options.model.lines.forEach`, add:

```js
      const style = glyphLineStyle(options.model, line, index, {
        lineOpacity: material.line,
        thickness: material.thickness
      });
```

Then replace stroke values with:

```js
      ctx.lineWidth = Math.max(0.8, scale * style.radius * 1.12);
      ctx.strokeStyle = alpha(style.color, style.opacity + linePulse * 0.08 + timePulse * 0.12);
      ctx.shadowColor = style.emissive;
      ctx.shadowBlur = (12 + timePulse * 18) * material.glow;
```

- [ ] **Step 10: Run renderer checks**

Run:

```bash
node --check toneglyph/app.js
node /tmp/toneglyph-renderer-depth-check.mjs
node /tmp/toneglyph-action-rail-check.mjs
git diff --check
```

Expected: all commands pass.

- [ ] **Step 11: Commit Task 3**

```bash
git add toneglyph/index.html toneglyph/app.js
git commit -m "style: deepen Tone Glyph renderer materials"
```

## Task 4: Sealed Glyph Signature

**Files:**
- Modify: `toneglyph/app.js`

- [ ] **Step 1: Write sealed signature check**

Create `/tmp/toneglyph-seal-signature-check.mjs`:

```js
import { chromium } from "/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:8801/toneglyph/", { waitUntil: "domcontentloaded" });

await page.click('[data-action-button="seal"]');
await page.fill("#intention-input", "Hold the gold thread");
await page.click("#seal-button");

const stored = await page.evaluate(() => {
  const raw = localStorage.getItem("toneGlyph.savedRecipes.v2");
  return { bodyAction: document.body.dataset.action, raw };
});

if (stored.bodyAction !== "seal") {
  throw new Error(`Seal action should remain active: ${JSON.stringify(stored)}`);
}

await page.click('[data-action-button="save"]');
await page.click("#save-button");

const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("toneGlyph.savedRecipes.v2"))[0]);

if (!saved.recipe.sealSignature || saved.recipe.schemaVersion !== 4) {
  throw new Error(`Saved recipe missing v4 seal signature: ${JSON.stringify(saved.recipe)}`);
}

for (const key of ["ringCount", "notchCount", "seed", "sealedLabel"]) {
  if (!(key in saved.recipe.sealSignature)) throw new Error(`Missing seal signature key ${key}`);
}

await browser.close();
```

- [ ] **Step 2: Run check and verify it fails**

Run:

```bash
node /tmp/toneglyph-seal-signature-check.mjs
```

Expected: FAIL because recipes are still schema version 3 and have no `sealSignature`.

- [ ] **Step 3: Add seal signature state**

In `state`, add:

```js
    sealSignature: null,
```

- [ ] **Step 4: Add seal signature helper**

Below `applyActionDefaults()`, add:

```js
  function createSealSignature() {
    const text = (state.intention || currentAction().label || "Tone Glyph").trim();
    const charTotal = text.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
    const ringCount = 1 + (charTotal % 3);
    const notchCount = 6 + (charTotal % 7);
    return {
      ringCount,
      notchCount,
      seed: charTotal % 360,
      sealedLabel: currentAction().label,
      createdAt: new Date().toISOString()
    };
  }
```

- [ ] **Step 5: Set signature when sealing**

Update `sealRitual()`:

```js
    state.sealSignature = createSealSignature();
```

Place it immediately after `state.sealedAt = Date.now();`.

- [ ] **Step 6: Save and restore schema version 4**

In `createRecipeSnapshot()`, change `schemaVersion: 3` to `schemaVersion: 4` and add:

```js
      sealSignature: state.sealSignature ? { ...state.sealSignature } : null,
```

In `saveGlyph()`, change `schemaVersion: 3` to `schemaVersion: 4`.

In `applyRecipe(recipe)`, after setting `state.sealedAt`, add:

```js
    state.sealSignature = safe.sealSignature && typeof safe.sealSignature === "object" ? { ...safe.sealSignature } : null;
```

In `clearRitual()`, add:

```js
    state.sealSignature = null;
```

- [ ] **Step 7: Draw seal signature in Canvas exports and fallback**

In `drawGlyph2D()`, after node drawing and before `ctx.restore()`, add:

```js
    if (options.sealSignature || state.sealSignature) {
      const signature = options.sealSignature || state.sealSignature;
      const ringCount = Math.max(1, signature.ringCount || 1);
      const notchCount = Math.max(3, signature.notchCount || 6);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
        ctx.beginPath();
        ctx.arc(cx + pan.x * scale, cy + pan.y * scale, scale * (1.14 + ringIndex * 0.1), 0, Math.PI * 2);
        ctx.strokeStyle = alpha(toneFamilyPalette.gold, 0.12 + ringIndex * 0.035 + timePulse * 0.08);
        ctx.lineWidth = Math.max(1, scale * 0.004);
        ctx.shadowColor = toneFamilyPalette.gold;
        ctx.shadowBlur = 18 * material.glow;
        ctx.stroke();
      }
      for (let notchIndex = 0; notchIndex < notchCount; notchIndex += 1) {
        const angle = ((notchIndex / notchCount) * Math.PI * 2) + (signature.seed || 0) * Math.PI / 180;
        const inner = scale * 1.18;
        const outer = scale * 1.27;
        const x1 = cx + pan.x * scale + Math.cos(angle) * inner;
        const y1 = cy + pan.y * scale + Math.sin(angle) * inner;
        const x2 = cx + pan.x * scale + Math.cos(angle) * outer;
        const y2 = cy + pan.y * scale + Math.sin(angle) * outer;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = alpha(toneFamilyPalette.parchment, 0.34);
        ctx.lineWidth = Math.max(1, scale * 0.006);
        ctx.stroke();
      }
      ctx.restore();
    }
```

- [ ] **Step 8: Pass signature into live fallback and exports**

In `CanvasGlyphRenderer.animate()`, add to `drawGlyph2D` options:

```js
        sealSignature: this.state.sealSignature,
```

In `createGlyphBlob(format)`, add:

```js
      sealSignature: state.sealSignature,
```

- [ ] **Step 9: Run checks**

Run:

```bash
node --check toneglyph/app.js
node /tmp/toneglyph-seal-signature-check.mjs
git diff --check
```

Expected: all commands pass.

- [ ] **Step 10: Commit Task 4**

```bash
git add toneglyph/app.js
git commit -m "feat: add sealed glyph signatures"
```

## Task 5: Artifact Export Formats

**Files:**
- Modify: `toneglyph/index.html`
- Modify: `toneglyph/app.js`
- Modify: `toneglyph/styles.css`

- [ ] **Step 1: Write export format check**

Create `/tmp/toneglyph-export-formats-check.mjs`:

```js
import { chromium } from "/Users/liaaguilar/Documents/Codex/2026-04-22-you-are-my-senior-full-stack/node_modules/playwright/index.mjs";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
await page.goto("http://127.0.0.1:8801/toneglyph/", { waitUntil: "domcontentloaded" });

await page.click('[data-action-button="save"]');
const formats = await page.locator("[data-export-format]").evaluateAll((nodes) => nodes.map((node) => node.textContent.trim()));
if (formats.join("|") !== "Ritual Card|Wallpaper|Square|Transparent|Recipe") {
  throw new Error(`Expected export format buttons, received ${formats.join("|")}`);
}

const source = await page.evaluate(async () => {
  const response = await fetch("./app.js?v=20260610-living-ritual", { cache: "no-store" });
  return response.text();
});

for (const marker of ["createGlyphBlob(\"card\")", "tone-glyph-transparent.png", "downloadRecipe"]) {
  if (!source.includes(marker)) throw new Error(`Missing export marker ${marker}`);
}

await browser.close();
```

- [ ] **Step 2: Run check and verify it fails**

Run:

```bash
node /tmp/toneglyph-export-formats-check.mjs
```

Expected: FAIL because export format buttons do not exist.

- [ ] **Step 3: Update export panel markup**

In `toneglyph/index.html`, replace the export panel action row with:

```html
<div class="export-grid" aria-label="Export formats">
  <button class="primary-action" type="button" data-export-format="card">Ritual Card</button>
  <button class="quiet-action" type="button" data-export-format="wallpaper">Wallpaper</button>
  <button class="quiet-action" type="button" data-export-format="square">Square</button>
  <button class="quiet-action" type="button" data-export-format="transparent">Transparent</button>
  <button id="export-recipe-button" class="quiet-action" type="button" data-export-format="recipe">Recipe</button>
</div>
<div class="action-row">
  <button id="save-button" class="primary-action" type="button">Save Glyph</button>
  <button id="share-button" class="quiet-action" type="button">Share Card</button>
</div>
```

Remove the old `download-button` button. Keep `#saved-glyphs`.

- [ ] **Step 4: Bind export buttons**

In `bindRefs()`, remove `refs.download = document.getElementById("download-button");` and add:

```js
    refs.exportButtons = Array.from(document.querySelectorAll("[data-export-format]"));
```

In `bindControls()`, remove `refs.download.addEventListener("click", downloadGlyph);` and add:

```js
    refs.exportButtons.forEach((button) => {
      button.addEventListener("click", () => exportGlyph(button.dataset.exportFormat));
    });
```

Keep the existing `refs.recipe.addEventListener("click", downloadRecipe);` listener for the Builder panel `Recipe` button. The export panel recipe button uses `id="export-recipe-button"` and is handled only by the `[data-export-format]` listener.

- [ ] **Step 5: Replace `downloadGlyph()` with `exportGlyph(format)`**

Replace `downloadGlyph()` with:

```js
  async function exportGlyph(format) {
    if (format === "recipe") {
      downloadRecipe();
      return;
    }
    const blob = await createGlyphBlob(format);
    const filenames = {
      card: "tone-glyph-ritual-card.png",
      wallpaper: "tone-glyph-wallpaper.png",
      square: "tone-glyph-square.png",
      transparent: "tone-glyph-transparent.png"
    };
    downloadBlob(blob, filenames[format] || "tone-glyph.png");
    showToast((format === "card" ? "Ritual card" : format.charAt(0).toUpperCase() + format.slice(1)) + " downloaded");
  }
```

- [ ] **Step 6: Update share to use ritual card**

In `shareGlyph()`, change:

```js
const blob = await createGlyphBlob("square");
```

to:

```js
const blob = await createGlyphBlob("card");
```

Change fallback filename to:

```js
downloadBlob(blob, "tone-glyph-ritual-card.png");
```

- [ ] **Step 7: Expand `createGlyphBlob(format)`**

Replace the dimension setup with:

```js
    const sizes = {
      card: { width: 1200, height: 1600, wallpaper: false, transparent: false },
      wallpaper: { width: 1080, height: 1920, wallpaper: true, transparent: false },
      square: { width: 1200, height: 1200, wallpaper: false, transparent: false },
      transparent: { width: 1200, height: 1200, wallpaper: false, transparent: true }
    };
    const size = sizes[format] || sizes.square;
    canvas.width = size.width;
    canvas.height = size.height;
```

Update `drawGlyph2D` options:

```js
      wallpaper: size.wallpaper,
      transparent: size.transparent,
      artifact: format
```

- [ ] **Step 8: Make `drawGlyph2D` support transparent artifacts**

At the background drawing block in `drawGlyph2D()`, wrap the fill:

```js
    if (!options.transparent) {
      const bg = ctx.createRadialGradient(cx, cy, scale * 0.2, cx, cy, Math.max(width, height) * 0.72);
      bg.addColorStop(0, mix(toneFamilyPalette.gold, toneFamilyPalette.ink, layers.toneField ? 0.78 : 0.9));
      bg.addColorStop(0.38, mix(toneFamilyPalette.teal, toneFamilyPalette.ink, layers.toneField ? 0.86 : 0.94));
      bg.addColorStop(1, toneFamilyPalette.shadow);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }
```

- [ ] **Step 9: Style export grid**

Add CSS:

```css
.export-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.export-grid .primary-action,
.export-grid .quiet-action {
  min-height: 42px;
  font-size: 0.78rem;
}
```

- [ ] **Step 10: Run export checks**

Run:

```bash
node --check toneglyph/app.js
node /tmp/toneglyph-export-formats-check.mjs
node /tmp/toneglyph-action-rail-check.mjs
git diff --check
```

Expected: all commands pass.

- [ ] **Step 11: Commit Task 5**

```bash
git add toneglyph/index.html toneglyph/app.js toneglyph/styles.css
git commit -m "feat: add Tone Glyph artifact exports"
```

## Task 6: Full Rendered QA And Deployment

**Files:**
- Modify only if a verification failure requires a fix.

- [ ] **Step 1: Run static syntax and diff checks**

Run:

```bash
node --check toneglyph/app.js
git diff --check
git status -sb
```

Expected: `node --check` and `git diff --check` pass.

- [ ] **Step 2: Run all temporary regression checks**

Run:

```bash
node /tmp/toneglyph-action-rail-check.mjs
node /tmp/toneglyph-family-style-check.mjs
node /tmp/toneglyph-renderer-depth-check.mjs
node /tmp/toneglyph-seal-signature-check.mjs
node /tmp/toneglyph-export-formats-check.mjs
```

Expected: all pass.

- [ ] **Step 3: Browser-check primary live interactions locally**

Use the Browser plugin or Playwright to verify:

- `http://127.0.0.1:8801/toneglyph/` loads with title `Tone Glyph - Living Glyph Creator`.
- Initial phone viewport `390x844`: `body[data-action="none"]`, drawer hidden, action rail visible, no horizontal overflow.
- Tune opens tone/color controls.
- Shape opens creator/builder controls.
- Seal opens intention controls and saving a sealed glyph creates `schemaVersion: 4`.
- Save opens export controls and saved glyph chips.
- 3D, Move, Front, True Glyph still respond.
- Drag rotates in normal mode and pans in Move mode.
- Console has no app errors.

- [ ] **Step 4: Browser-check visual breakpoints**

Verify these viewports:

- `390x844`
- `430x932`
- `768x1024`
- `1280x820`

Expected:

- action rail and drawer do not overlap the glyph in a way that blocks first use;
- text fits in action rail buttons;
- drawer can be closed;
- the glyph remains visible while drawers are open;
- no horizontal overflow.

- [ ] **Step 5: Verify live route after push**

Push:

```bash
git push
```

Poll live assets:

```bash
curl -sL --max-time 20 -o /tmp/toneglyph-live-index.html 'https://coherence-nikolai.app/toneglyph/?deploy=living-ritual'
rg -n 'app.js\\?v=20260610-living-ritual|styles.css' /tmp/toneglyph-live-index.html
```

Then run the same Browser checks against:

```text
https://coherence-nikolai.app/toneglyph/?deploy=living-ritual
```

- [ ] **Step 6: Stop local server**

If the local server is still running on port `8801`, stop only that process:

```bash
lsof -nP -iTCP:8801 -sTCP:LISTEN
kill <PID_FROM_LSOF>
```

Expected: `curl http://127.0.0.1:8801/toneglyph/` no longer connects after the server is stopped.

- [ ] **Step 7: Final status report**

Report:

- commits created;
- live URL;
- browser/viewports tested;
- any warnings or limitations;
- whether the Tone family landing page was left unchanged.
