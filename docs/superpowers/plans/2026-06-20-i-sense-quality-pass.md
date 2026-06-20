# I-Sense Quality Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push I-Sense Observatory from a premium landing concept into a richer direct-observation instrument.

**Architecture:** Keep the static app shape. Expand `lens-model.mjs` as the source of truth for inquiry questions, lens metadata, note facets, pattern summaries, and safety copy. Keep `app.js` as the renderer/state coordinator and `styles.css` as the design system/motion authority.

**Tech Stack:** Static HTML, JavaScript modules, CSS, localStorage, Node test runner.

---

### Task 1: Expand The Inquiry Model

**Files:**
- Modify: `i-sense_observatory/lens-model.mjs`
- Modify: `i-sense_observatory/lens-model.test.mjs`

- [ ] Add first-read dimensions for boundary, ownership, and narrative/self-image.
- [ ] Add lens metadata for display badges, practice stance, direct action, and reflection prompt.
- [ ] Add neutral note-facet option groups for components, change, remains, and integration.
- [ ] Expand `summarizePatterns()` with observer, agency, tone, boundary, ownership, integration, and neutral insight lines.
- [ ] Add tests proving the new fields exist, suggestions remain non-primary, and summaries include the new pattern data.

### Task 2: Upgrade The App Flow

**Files:**
- Modify: `i-sense_observatory/app.js`
- Modify: `i-sense_observatory/index.html`

- [ ] Import new model exports and bump cache keys.
- [ ] Store new first-read fields and result facets in local session records.
- [ ] Render first-read summaries dynamically from `firstReadQuestions`.
- [ ] Upgrade route/lens/result/note screens with richer instrument sections.
- [ ] Upgrade Notes and Patterns views to show structured observation data.
- [ ] Replace About wall-text with compact premium sections: stance, lenses, safety, privacy, and result neutrality.

### Task 3: Premium Visual + Motion Pass

**Files:**
- Modify: `i-sense_observatory/styles.css`

- [ ] Add actual stage fade/slide transitions through `.is-transitioning` and `.is-entering`.
- [ ] Create non-landing chamber styles that match the landing aesthetic: thin amber/ivory lines, black field, instrument readouts, glass only where useful.
- [ ] Polish lens cards, pattern panels, notes, safety callouts, and result facets.
- [ ] Maintain responsive slot safety across phone, tablet, and wide desktop.
- [ ] Respect `prefers-reduced-motion`.

### Task 4: Verification + Release

**Files:**
- Modify as needed after QA only.

- [ ] Run `node --test i-sense_observatory/lens-model.test.mjs`.
- [ ] Run `node --check i-sense_observatory/app.js`.
- [ ] Run `git diff --check`.
- [ ] Browser-test the landing, Begin experiment, first-read choices, lens route, observe, result, note save, Notes, Patterns, and About.
- [ ] Verify phone, iPad portrait, iPad landscape, desktop, and wide desktop screenshots for no overlap or broken safe-area spacing.
- [ ] Commit, push, and verify the live route serves the new cache-busted files.
