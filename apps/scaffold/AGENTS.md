# Scaffold Agent Instructions

This project is a local-first ADHD executive-function scaffold. It is a rescue engine, not a normal to-do app.

## Product Rules

- Never add shame, streak, guilt, laziness, or productivity-score mechanics.
- Preserve user agency. Assistance comes second, and automation requires consent.
- Use "re-entry" instead of "failure".
- Every packet must identify a next physical action.
- Support the action, not avoidance.
- Repair is progress. Help users repair missed obligations instead of hiding them.
- Do not make clinical claims or imply the app diagnoses or treats ADHD.
- Keep privacy local-first. Do not introduce cloud storage, sync, analytics, calendar access, email access, or passive signals without explicit user consent.

## Engineering Rules

- Keep core logic in tested pure functions under `src/engine/`.
- Keep deterministic rules modular so an LLM classifier can replace them later.
- Put any future LLM integration behind `src/llm/rescueAdapter.ts`.
- Never send task text to an external LLM without explicit consent recorded in local metadata.
- Keep persistence behind `src/data/` and app state operations behind hooks.
- Prefer accessible, low-cognitive-load UI.
- Avoid dense dashboards and excessive notifications.
- Use plain English.
- Preserve keyboard access and mobile responsiveness.

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
