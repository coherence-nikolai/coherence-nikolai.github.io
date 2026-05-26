# Scaffold Agent Instructions

This project is a local-first ADHD executive-function scaffold. It is a rescue engine, not a normal to-do app.

## Product Rules

- Never add shame, streak, guilt, laziness, or productivity-score mechanics.
- Preserve user agency. Assistance comes second, and automation requires consent.
- Use "re-entry" instead of "failure".
- Every packet must identify a next physical action.
- Support the action, not avoidance.
- Repair is progress. Help users repair missed obligations instead of hiding them.
- Repair must be contextual. Do not generate an email-style repair script unless the task involves another person, lateness, appointment, clarification, help, scope, apology, or extension. If no repair is needed yet, say so and return the user to the first physical action.
- Do not make clinical claims or imply the app diagnoses or treats ADHD.
- Keep privacy local-first. Do not introduce cloud storage, sync, analytics, calendar access, email access, or passive signals without explicit user consent.

## Engineering Rules

- Keep core logic in tested pure functions under `src/engine/`.
- Keep deterministic rules modular so an LLM classifier can replace them later.
- Put any future LLM integration behind `src/llm/rescueAdapter.ts`.
- Never send task text to an external LLM without explicit consent recorded in local metadata.
- Future external LLM support should be BYOK unless the user explicitly changes strategy: user supplies their own key, keys stay local, and exports never include keys.
- Keep persistence behind `src/data/` and app state operations behind hooks.
- Prefer accessible, low-cognitive-load UI.
- Avoid dense dashboards and excessive notifications.
- Use plain English.
- Preserve keyboard access and mobile responsiveness.
- Preserve the Rescue Frame identity: a minimal scaffold/S mark made from support beams with one moss first-step block.
- Avoid brain, checkmark, clock, bell, lightning, lifebuoy, medical, construction helmet, streak, or gamified brand imagery.
- Keep the visual language warm paper, deep ink, muted moss/teal, restrained accents, 8px radius or less, and calm premium surfaces.

## Wording To Use

- "No explanation needed."
- "What is worth rescuing?"
- "Choose one next action."
- "Done enough counts."
- "Repair is progress."
- "Start tiny."
- "Make it ugly."
- "Exit responsibly."

## Wording To Avoid

- "You failed."
- "You broke your streak."
- "You are behind."
- "Try harder."
- "Just focus."
- "Be disciplined."
- "You should have."
