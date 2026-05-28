import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CirclePause,
  CirclePlay,
  Flag,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { SignalPill } from "./design";
import type { RescuePacket, SprintOutcome } from "../types";

type SprintState = "idle" | "running" | "paused" | "completed";

interface SprintModeProps {
  packet: RescuePacket;
  onRecordOutcome: (
    outcome: SprintOutcome,
    durationMinutes: number,
    notes?: string
  ) => Promise<void>;
  onBack: () => void;
  onStuckAgain: () => void;
}

const sprintSeconds = 10 * 60;

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function bodyDoubleCopy(state: SprintState, remaining: number) {
  const elapsed = sprintSeconds - remaining;

  if (state === "idle") {
    return {
      title: "Ready the environment.",
      body: "One surface. One tab. One next physical action."
    };
  }

  if (state === "paused") {
    return {
      title: "Still here.",
      body: "Pause is allowed. Restart with the same first move."
    };
  }

  if (state === "completed" || remaining === 0) {
    return {
      title: "Done enough counts.",
      body: "Name what happened. Then rescue, repair, or stop cleanly."
    };
  }

  if (elapsed < 120) {
    return {
      title: "Start tiny.",
      body: "Touch the task before judging it. The first move is enough."
    };
  }

  if (elapsed < 420) {
    return {
      title: "Stay with the visible piece.",
      body: "No expanding scope. Keep your hands on this one action."
    };
  }

  return {
    title: "Close the loop.",
    body: "Mark what changed. Done enough is a responsible outcome."
  };
}

function stateLabel(state: SprintState): string {
  const labels: Record<SprintState, string> = {
    idle: "Ready",
    running: "Running",
    paused: "Paused",
    completed: "Re-entry"
  };

  return labels[state];
}

export function SprintMode({
  packet,
  onRecordOutcome,
  onBack,
  onStuckAgain
}: SprintModeProps) {
  const [state, setState] = useState<SprintState>("idle");
  const [remaining, setRemaining] = useState(sprintSeconds);
  const [notes, setNotes] = useState("");
  const [suggestedOutcome, setSuggestedOutcome] = useState<SprintOutcome | null>(
    null
  );
  const elapsedMinutes = useMemo(
    () => Math.max(1, Math.ceil((sprintSeconds - remaining) / 60)),
    [remaining]
  );
  const message = bodyDoubleCopy(state, remaining);

  useEffect(() => {
    if (state !== "running") return undefined;

    const id = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          setState("completed");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [state]);

  async function complete(outcome: SprintOutcome) {
    await onRecordOutcome(outcome, elapsedMinutes, notes);
  }

  function openCompletion(outcome: SprintOutcome | null = null) {
    setSuggestedOutcome(outcome);
    setState("completed");
  }

  return (
    <section className="rescue-session min-h-screen bg-ink text-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-semibold text-paper transition hover:border-white/35"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to packet
          </button>

          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10 text-ink" title="Scaffold sprint" />
            <div>
              <p className="text-sm font-semibold text-paper">Scaffold sprint</p>
              <p className="text-xs text-paper/60">Not reminders. Rescue.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <SignalPill value="Body double active" tone="moss" />
            <SignalPill value={stateLabel(state)} />
          </div>
        </header>

        <main className="grid flex-1 gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-stretch">
          <div className="session-pane flex flex-col rounded-lg border border-white/10 bg-paper p-5 text-ink shadow-premium sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Rescue sprint
                </p>
                <h1 className="safe-text mt-2 text-3xl font-semibold leading-tight sm:text-5xl">
                  {packet.title}
                </h1>
              </div>
              <SignalPill value="10 minutes" tone="ink" />
            </div>

            <div className="mt-6 rounded-lg border border-ink bg-ink p-5 text-paper">
              <p className="text-xs font-semibold uppercase text-moss">
                First physical action
              </p>
              <p className="safe-text mt-2 text-2xl font-semibold leading-9 sm:text-3xl">
                {packet.firstPhysicalAction}
              </p>
            </div>

            {state === "idle" && (
              <div className="mt-4 rounded-lg border border-line bg-surface p-4">
                <p className="text-sm font-semibold text-ink">
                  Ready the environment
                </p>
                <ol className="mt-3 grid gap-2 text-sm leading-6 text-muted sm:grid-cols-3">
                  <li className="rounded-lg border border-line bg-paper p-3">
                    Put the task surface in front of you.
                  </li>
                  <li className="rounded-lg border border-line bg-paper p-3">
                    Open only the thing named above.
                  </li>
                  <li className="rounded-lg border border-line bg-paper p-3">
                    Stop after one visible change.
                  </li>
                </ol>
              </div>
            )}

            <div className="mt-4 rounded-lg border border-line bg-paper/80 p-4">
              <p className="text-sm font-semibold text-muted">
                Minimum viable progress
              </p>
              <p className="safe-text mt-2 text-lg leading-7 text-ink">
                {packet.minimumViableProgress}
              </p>
            </div>

            {state !== "completed" && (
              <div className="mt-6 flex flex-wrap gap-3">
                {state === "idle" && (
                  <button
                    type="button"
                    onClick={() => setState("running")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-moss px-5 font-semibold text-white shadow-action transition hover:bg-mossDark"
                  >
                    <CirclePlay className="h-5 w-5" aria-hidden="true" />
                    Start 10 minutes
                  </button>
                )}
                {state === "running" && (
                  <button
                    type="button"
                    onClick={() => setState("paused")}
                    className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-ink px-5 font-semibold text-white transition hover:bg-ink/90"
                  >
                    <CirclePause className="h-5 w-5" aria-hidden="true" />
                    Pause
                  </button>
                )}
                {state === "paused" && (
                  <button
                    type="button"
                    onClick={() => setState("running")}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-moss px-5 font-semibold text-white shadow-action transition hover:bg-mossDark"
                  >
                    <CirclePlay className="h-5 w-5" aria-hidden="true" />
                    Resume
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCompletion("done_enough")}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink transition hover:border-moss"
                >
                  <Flag className="h-5 w-5 text-moss" aria-hidden="true" />
                  Done enough
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openCompletion("blocked");
                    onStuckAgain();
                  }}
                  className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink transition hover:border-moss"
                >
                  <RotateCcw className="h-5 w-5 text-moss" aria-hidden="true" />
                  Stuck again
                </button>
              </div>
            )}

            {(state === "completed" || remaining === 0) && (
              <div className="reentry-card mt-8 rounded-lg border border-line bg-paper p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-moss">
                      Re-entry
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink">
                      What changed?
                    </h2>
                  </div>
                  {suggestedOutcome === "done_enough" && (
                    <SignalPill value="Done enough is available" tone="moss" />
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  No explanation needed. Name what moved, then choose what is still
                  possible.
                </p>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="mt-3 min-h-24 w-full resize-y rounded-lg border border-line bg-paper p-3 text-base text-ink"
                  placeholder="Optional note: what moved, what blocked, or what changed."
                />
                <div className="mt-4 rounded-lg border border-line bg-surface p-4">
                  <h3 className="text-lg font-semibold text-ink">
                    What is still possible?
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Repair, continue, or done enough. Choose the smallest honest
                    next move.
                  </p>
                  <div className="mt-3 grid gap-2 text-sm leading-6 text-muted sm:grid-cols-3">
                    <p className="rounded-lg border border-line bg-paper p-3">
                      Continue this first move.
                    </p>
                    <p className="rounded-lg border border-line bg-paper p-3">
                      Repair if another person is affected.
                    </p>
                    <p className="rounded-lg border border-line bg-paper p-3">
                      Close as done enough if there is a visible change.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <OutcomeButton
                    label="Continue: I started"
                    onClick={() => void complete("started")}
                  />
                  <OutcomeButton
                    label="Tiny progress"
                    onClick={() => void complete("tiny_progress")}
                  />
                  <OutcomeButton
                    label="Still blocked"
                    onClick={() => void complete("blocked")}
                  />
                  <OutcomeButton
                    label="Repair this"
                    onClick={() => void complete("repair")}
                  />
                  <OutcomeButton
                    label="Stop responsibly"
                    onClick={() => void complete("stop_responsibly")}
                  />
                  <OutcomeButton
                    label="Done enough counts"
                    onClick={() => void complete("done_enough")}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="session-timer-panel flex flex-col rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-premium sm:p-7">
            <div>
              <p className="text-sm font-semibold text-paper/60">Still here</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-paper">
                {message.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-paper/70">
                {message.body}
              </p>
            </div>

            <div
              className={`my-8 flex aspect-square items-center justify-center rounded-full border border-white/20 bg-white/10 text-6xl font-semibold text-paper shadow-inner sm:text-7xl ${
                state === "running" ? "breathe-timer" : ""
              }`}
            >
              {formatTime(remaining)}
            </div>

            <div className="mt-auto space-y-4">
              <button
                type="button"
                onClick={() => {
                  setRemaining(sprintSeconds);
                  setState("idle");
                  setSuggestedOutcome(null);
                }}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-4 font-semibold text-white transition hover:border-white/45"
              >
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                Reset timer
              </button>
              <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/10 p-3 text-sm leading-6 text-paper/80">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 flex-none text-amberSoft"
                  aria-hidden="true"
                />
                <span>
                  No explanation needed if you drift. Re-entry is part of the tool.
                </span>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </section>
  );
}

function OutcomeButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-12 rounded-lg border border-line bg-paper px-4 text-left font-semibold text-ink transition hover:border-moss hover:bg-surface"
    >
      {label}
    </button>
  );
}
