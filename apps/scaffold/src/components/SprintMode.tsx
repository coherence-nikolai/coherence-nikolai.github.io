import { useEffect, useMemo, useState } from "react";
import {
  CirclePause,
  CirclePlay,
  Flag,
  RotateCcw,
  ShieldCheck
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import { Panel, PrimaryAction, SignalPill } from "./design";
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

export function SprintMode({
  packet,
  onRecordOutcome,
  onBack,
  onStuckAgain
}: SprintModeProps) {
  const [state, setState] = useState<SprintState>("idle");
  const [remaining, setRemaining] = useState(sprintSeconds);
  const [notes, setNotes] = useState("");
  const elapsedMinutes = useMemo(
    () => Math.max(1, Math.ceil((sprintSeconds - remaining) / 60)),
    [remaining]
  );

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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface/90 px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss"
      >
        Back to packet
      </button>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Panel className="p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase text-moss">
                Rescue sprint
              </p>
              <h1 className="safe-text mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {packet.title}
              </h1>
            </div>
            <SignalPill value="Body double active" tone="moss" />
          </div>

          <div className="mt-7 rounded-lg border border-moss/25 bg-moss/10 p-5">
            <p className="text-xs font-semibold uppercase text-mossDark">
              First physical action
            </p>
            <p className="safe-text mt-2 text-2xl font-semibold leading-9 text-ink">
              {packet.firstPhysicalAction}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-paper/80 p-4">
            <p className="text-sm font-semibold text-muted">
              Minimum viable progress
            </p>
            <p className="safe-text mt-2 text-lg leading-7 text-ink">
              {packet.minimumViableProgress}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {state === "idle" && (
              <PrimaryAction onClick={() => setState("running")}>
                <CirclePlay className="h-5 w-5" aria-hidden="true" />
                Start 10 minutes
              </PrimaryAction>
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
              <PrimaryAction onClick={() => setState("running")}>
                <CirclePlay className="h-5 w-5" aria-hidden="true" />
                Resume
              </PrimaryAction>
            )}
            <button
              type="button"
              onClick={() => void complete("done_enough")}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink transition hover:border-moss"
            >
              <Flag className="h-5 w-5 text-moss" aria-hidden="true" />
              Done enough
            </button>
            <button
              type="button"
              onClick={() => {
                setState("completed");
                onStuckAgain();
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink transition hover:border-moss"
            >
              <RotateCcw className="h-5 w-5 text-moss" aria-hidden="true" />
              Stuck again
            </button>
          </div>

          {(state === "completed" || remaining === 0) && (
            <div className="mt-8 border-t border-line pt-6">
              <h2 className="text-xl font-semibold text-ink">What happened?</h2>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-3 min-h-24 w-full resize-y rounded-lg border border-line bg-paper p-3 text-base text-ink"
                placeholder="Optional note"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OutcomeButton label="I started" onClick={() => void complete("started")} />
                <OutcomeButton
                  label="I made tiny progress"
                  onClick={() => void complete("tiny_progress")}
                />
                <OutcomeButton
                  label="I got blocked"
                  onClick={() => void complete("blocked")}
                />
                <OutcomeButton
                  label="I need repair"
                  onClick={() => void complete("repair")}
                />
                <OutcomeButton
                  label="I need to stop responsibly"
                  onClick={() => void complete("stop_responsibly")}
                />
              </div>
            </div>
          )}
        </Panel>

        <Panel tone="ink" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-paper/70">Still here</p>
              <p className="mt-1 text-lg font-semibold text-paper">
                I am here with you.
              </p>
            </div>
            <BrandMark className="h-11 w-11 text-ink" title="Scaffold sprint" />
          </div>
          <div className="mt-8 flex aspect-square items-center justify-center rounded-full border border-white/20 bg-white/10 text-6xl font-semibold text-paper shadow-inner">
            {formatTime(remaining)}
          </div>
          <p className="mt-6 text-base leading-7 text-paper/80">
            Choose one next action. Keep it physical. Done enough counts.
          </p>
          <button
            type="button"
            onClick={() => {
              setRemaining(sprintSeconds);
              setState("idle");
            }}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-4 font-semibold text-white transition hover:border-white/45"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            Reset timer
          </button>
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-white/10 p-3 text-sm leading-6 text-paper/80">
            <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-amberSoft" aria-hidden="true" />
            <span>No explanation needed if you drift. Re-entry is part of the tool.</span>
          </div>
        </Panel>
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
