# Tone Glyph Living Ritual Instrument Design

## Status

Approved direction for planning. Do not implement from this document directly; use it to write the next implementation plan.

## Product Spine

Tone Glyph should become the geometric member of the Tone family: a living 3D meditation instrument that can be sealed into a ritual glyph.

The Tone family landing page stays as the outer doorway. After the user enters Tone Glyph, the app should open directly into a quiet living object, not a product page, form, or settings console. The first impression should be presence: a breathing geometric object in a dark Tone-family field, with clear next-step actions available without taking over the screen.

The selected product direction is:

1. Living 3D Instrument leads.
2. Ritual Glyph Studio gives it meaning.
3. Advanced creation controls live behind simple action drawers.
4. Saved outputs should feel like artifacts, not screenshots.

## Tone Family Aesthetic System

Tone Glyph should inherit the visual language already established by Tone Recall, Tone Ritual, and Tone Steady:

- Warm darkness: ink, ember, brown-black, and soft field gradients instead of pure black or bright sci-fi backgrounds.
- Parchment and brushed-gold light: serif display type, soft glow, and ceremonial highlight colors.
- Oxidized teal and muted rose accents: used sparingly for aura, tone response, and secondary energy.
- One symbolic object at center: Recall has orb/wave, Ritual has orbital mark, Steady has compass orb. Tone Glyph should have geometric form as its central symbolic object.
- Quiet UI: translucent panels, hairline borders, soft shadows, and controls that feel like instruments rather than dashboards.
- Practice language: choose, tune, shape, hold, seal, save, return, field, tone, ritual.

Tone Glyph should not simply copy the orb/wave look. It should translate that family language into geometry: gold edge light, teal spectral aura, translucent faces, slow node lamps, and sealed geometry marks.

## Post-Landing Experience

The app screen should center the glyph and expose four clear primary actions:

- Tune: tone, colour, sound, breath, and mood.
- Shape: Metatron, cube, pyramid, merkaba, flower, custom forms, and shape grammar.
- Seal: intention, ritual action, moment of commitment, and sealed-glyph signature.
- Save: glyph card, wallpaper, recipe, share/export.

The glyph remains visible while these actions open drawers or bottom sheets. The user should not feel pushed into a full control console. The current Form/Matter/Tone/Motion/Ritual/Layers controls can be reorganized under this simpler action model.

Default state:

- Landing page links into Tone Glyph.
- Tone Glyph opens as a living object with minimal UI.
- The user can drag to turn, tap to wake nodes, and press Front to return the glyph to a direct face.
- A small instruction line appears briefly on first entry: "Drag to turn. Hold to listen. Seal when it feels right."

## Glyph Rendering Upgrade

The current glyph is a strong prototype, but it needs richer material and depth to match the Tone family level.

Rendering goals:

- True depth: geometry has thickness, parallax, dimmed rear edges, face translucency, and contact shadow.
- Hierarchical line quality:
  - primary geometry uses warm gold and slightly thicker edge light;
  - secondary geometry uses parchment and thinner lines;
  - rear or hidden geometry uses dim teal/ink;
  - active tone paths use brighter travelling glow.
- Material presence: gold, glass, crystal, ink, pearl, stone, and shadow should affect opacity, glow, roughness, line thickness, and face treatment in visibly different ways.
- Slow animation: breath, orbit dust, edge-light travel, node lamps, and sound-reactive pulse. Motion should feel meditative rather than busy.
- Ritual signature: sealed glyphs visibly change through intention ring, seal band, tone notches, center brightening, timestamp seed, and recipe geometry.

## Core Modules

### Stage

Owns the full-screen living glyph scene, renderer status, drag/turn/pan gestures, and first impression. It should preserve a calm first viewport and avoid dense card layouts.

### Action Rail

Replaces the feeling of many tabs with four obvious actions: Tune, Shape, Seal, Save. The rail can be bottom-aligned on phone and compact on wider layouts.

### Drawers

Each action opens a focused drawer:

- Tune drawer: tone profile, colour palette, breath rate, sound toggle, tone listening.
- Shape drawer: family, seed, 3D form, depth, density, symmetry, variant.
- Seal drawer: intention, ritual action, seal button, sealed-state copy.
- Save drawer: saved glyphs, ritual card export, wallpaper export, recipe export, share.

### Renderer

Owns model creation, geometry updates, material profiles, motion profiles, and export render state. It should expose a small control surface so UI code does not need to know renderer internals.

### Recipe Store

Preserves saved glyphs locally. Recipe schema should retain tone, colors, shape family, seed, builder values, material, motion, layers, intention, sealed timestamp, and export format.

## Data And State

The existing recipe model can evolve rather than reset:

- Keep backwards compatibility with existing saved recipes.
- Add sealed-signature fields only when a glyph is sealed.
- Store action rail state separately from render recipe state so UI layout changes do not corrupt saved glyphs.
- Exports should use recipe snapshots, not current mutable state, so saved artifacts remain reproducible.

## Export Design

Exports should become one of the premium-feeling layers of the app:

- Ritual card: dark Tone-family field, centered sealed glyph, intention text, tone/action metadata, date seed.
- Wallpaper: tall format with glyph high enough for lock screens, no dense text unless enabled.
- Square post: centered glyph, optional intention, strong margins.
- Transparent PNG: glyph only for design reuse.
- Recipe JSON: portable recipe with schema version.

The user should not be asked to understand file formats first. Save/export choices should feel like choosing an artifact.

## Accessibility And Responsiveness

- The app must remain phone-first.
- Controls must be reachable on small screens without covering the glyph permanently.
- Every toggle or button should expose active state through ARIA.
- Reduced-motion users should get a still but alive-looking field: glow and depth remain, continuous animation stops.
- The glyph should remain usable without sound.
- Text must avoid overlap with the glyph, controls, and safe-area insets.

## Performance

Tone Glyph is a WebGL-heavy surface. The design must preserve smooth interaction:

- Prefer a single Three.js scene with incremental material/model updates.
- Keep particle count responsive to device performance.
- Pause heavy animation when the tab is hidden.
- Keep Canvas fallback visually aligned enough that the app still feels like Tone Glyph when WebGL fails.
- Export rendering can be slower than live rendering, but should give feedback.

## Non-Goals For The Next Build

- No account system.
- No server persistence.
- No payment gate implementation.
- No AI-generated glyph meanings.
- No full landing-page redesign outside the Tone Glyph route unless separately requested.
- No replacement of the existing Tone family pages.

## Implementation Decisions

- Keep the current Form/Matter/Tone/Motion/Ritual/Layers controls as internal groupings during the first refactor, but expose Tune/Shape/Seal/Save as the primary user-facing model.
- Build the action rail and Tone-family aesthetic pass before deeper renderer work, so the app immediately feels more coherent even before every material upgrade is complete.
- Defer richer sound design until the visual/ritual loop is stronger. Keep existing tone pulse behavior working, but do not make audio the main scope of the next build.

## Recommended Build Order

1. Create the action rail and drawer structure while preserving current controls inside the new organization.
2. Apply the Tone family aesthetic system to Tone Glyph: palette, typography, field, panels, and button treatment.
3. Upgrade renderer materials and line hierarchy.
4. Add sealed-glyph visual signatures.
5. Upgrade exports into ritual card, wallpaper, square post, transparent PNG, and recipe.
6. Verify mobile, desktop, WebGL, Canvas fallback, saved recipes, and live route deployment.
