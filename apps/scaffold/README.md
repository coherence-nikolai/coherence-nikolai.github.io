# Scaffold

Scaffold is a local-first executive-function rescue app for stuck moments.

It is not a productivity app, habit tracker, streak machine, or clinical tool. The MVP is built around one loop: user feels stuck, opens Scaffold, describes the messy task, gets a Rescue Packet, starts a 10-minute rescue sprint, and can re-enter without shame later.

Core slogan: **Not reminders. Rescue.**

## What It Does

- Turns messy natural language into a structured Rescue Packet.
- Always produces a next physical action.
- Detects likely blocks with deterministic local rules.
- Offers rescue modes: Start Tiny, Make It Ugly, Repair, Body Double, Unblock, and Exit Responsibly.
- Runs a 10-minute rescue sprint with body-double-style support.
- Ranks unfinished packets for re-entry with "No explanation needed" language.
- Fades support after repeated successful starts while allowing the user to increase support again.
- Shows a local pattern map without shame, streaks, or productivity scores.
- Exports and imports all local data as JSON.
- Includes explicit-consent Deep Rescue with local BYOK settings.
- Uses a premium Rescue Frame visual system built around a minimalist scaffold/S mark.

## What It Is Not

- Not a diagnosis or treatment for ADHD.
- Not a replacement for care, coaching, therapy, or medical advice.
- Not a to-do app.
- Not a guilt dashboard.
- Not cloud-backed in this MVP.

## Run Locally

```bash
cd Scaffold
npm install
npm run dev
```

Vite will print the local URL, usually `http://127.0.0.1:5173`.

To test on another device on the same network:

```bash
cd Scaffold
npm run dev:lan
```

Open the printed network URL on the device.

## Test

```bash
cd Scaffold
npm test
npm run test:e2e
```

## Build

```bash
cd Scaffold
npm run build
```

## Architecture

```text
src/
  engine/
    rescueEngine.ts      Pure rescue rules, packet generation, priority, support fading
    patternMap.ts        Pure pattern summaries
    rescueEngine.test.ts Unit tests for core logic
  llm/
    byokSettings.ts      Local-only BYOK provider/key storage helpers
    rescueAdapter.ts     Consent-gated local, BYOK, and future LLM adapter boundary
  data/
    db.ts                Dexie IndexedDB persistence and JSON import/export
  hooks/
    useScaffoldData.ts   React data operations around local persistence
  components/
    BrandMark.tsx       Rescue Frame mark
    design.tsx          Shell, Panel, PrimaryAction, SignalPill, RescueBrief, ScriptCard
    PacketCard.tsx       Reusable task packet cards
    SprintMode.tsx       10-minute rescue sprint
  App.tsx                Screen orchestration and product UI
```

The rescue engine is intentionally pure and modular. `src/llm/rescueAdapter.ts` is the boundary for Deep Rescue and any future LLM task-decomposition backend. The local rules adapter remains the default, and the external LLM adapter refuses to run unless explicit local consent is present.

## Privacy Approach

Scaffold stores packets in the browser using IndexedDB via Dexie. The MVP has no backend, no required account, and no cloud dependency. Export/import is explicit JSON controlled by the user.

Do not introduce cloud storage, sync, calendar access, email access, analytics, or passive signals without explicit user consent.

External LLM processing is off by default. BYOK settings are stored separately in browser `localStorage`, not IndexedDB export data. Task text leaves the browser only after the user enables external processing and confirms the exact packet text during a Deep Rescue action. API keys are never included in JSON export.

## Future Roadmap

- Real LLM task decomposition.
- Calendar integration.
- Email integration.
- Browser extension.
- Optional body-doubling rooms.
- Native mobile app.
- Notification scheduling.
- Privacy-preserving passive signals.
- HealthKit / Health Connect integrations.
- Clinician or coach sharing by consent.
- End-to-end encrypted sync.
