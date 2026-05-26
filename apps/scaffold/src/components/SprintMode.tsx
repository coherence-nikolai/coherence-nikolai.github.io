import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CirclePause,
  CirclePlay,
  RotateCcw,
  ShieldCheck,
  TimerReset
} from "lucide-react";
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
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink"
      >
        Back to packet
      </button>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-line bg-surface p-5 shadow-sm sm:p-7">
          <p className="text-sm font-semibold uppercase text-moss">Rescue sprint</p>
          <h1 className="safe-text mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            {packet.title}
          </h1>

          <div className="mt-6 rounded-lg border border-line bg-paper p-4">
            <p className="text-sm font-semibold text-muted">First physical action</p>
            <p className="safe-text mt-2 text-xl font-semibold leading-8 text-ink">
              {packet.firstPhysicalAction}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-paper p-4">
            <p className="text-sm font-semibold text-muted">Minimum viable progress</p>
            <p className="safe-text mt-2 text-lg leading-7 text-ink">
              {packet.minimumViableProgress}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {state === "idle" && (
              <button
                type="button"
                onClick={() => setState("running")}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-moss px-5 font-semibold text-white shadow-sm hover:bg-mossDark"
              >
                <CirclePlay className="h-5 w-5" aria-hidden="true" />
                Start 10 minutes
              </button>
            )}
            {state === "running" && (
              <button
                type="button"
                onClick={() => setState("paused")}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-ink px-5 font-semibold text-white"
              >
                <CirclePause className="h-5 w-5" aria-hidden="true" />
                Pause
              </button>
            )}
            {state === "paused" && (
              <button
                type="button"
                onClick={() => setState("running")}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-moss px-5 font-semibold text-white hover:bg-mossDark"
              >
                <CirclePlay className="h-5 w-5" aria-hidden="true" />
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={() => void complete("done_enough")}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink"
            >
              <Check className="h-5 w-5" aria-hidden="true" />
              Done enough
            </button>
            <button
              type="button"
              onClick={() => {
                setState("completed");
                onStuckAgain();
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-semibold text-ink"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Stuck again
            </button>
          </div>

          {(state === "completed" || remaining === 0) && (
            <div className="mt-7 border-t border-line pt-6">
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
        </div>

        <aside className="rounded-lg border border-line bg-ink p-5 text-white shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/70">Still here</p>
              <p className="mt-1 text-lg font-semibold">I am here with you.</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-amberSoft" aria-hidden="true" />
          </div>
          <div className="mt-8 flex aspect-square items-center justify-center rounded-full border-8 border-white/20 text-6xl font-semibold">
            {formatTime(remaining)}
          </div>
          <p className="mt-6 text-base leading-7 text-white/80">
            Choose one next action. Keep the task small enough to stay physical.
            Repair is progress.
          </p>
          <button
            type="button"
            onClick={() => {
              setRemaining(sprintSeconds);
              setState("idle");
            }}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/25 px-4 font-semibold text-white"
          >
            <TimerReset className="h-5 w-5" aria-hidden="true" />
            Reset timer
          </button>
        </aside>
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
      className="min-h-12 rounded-lg border border-line bg-paper px-4 text-left font-semibold text-ink hover:border-moss"
    >
      {label}
    </button>
  );
}
