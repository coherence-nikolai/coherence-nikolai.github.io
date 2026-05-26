import { ArrowRight } from "lucide-react";
import { SignalPill } from "./design";
import {
  blockLabels,
  rescueModeLabels,
  statusLabels,
  supportLabels,
  taskTypeLabels,
  type RescuePacket
} from "../types";

interface PacketCardProps {
  packet: RescuePacket;
  onOpen: (packet: RescuePacket) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function PacketCard({ packet, onOpen }: PacketCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(packet)}
      className="group relative w-full overflow-hidden rounded-lg border border-line/80 bg-surface/90 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-moss hover:shadow-premium"
    >
      <span className="absolute inset-y-3 left-0 w-1 rounded-r bg-moss/80" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 pl-2">
          <p className="safe-text text-sm font-semibold uppercase text-moss">
            {statusLabels[packet.status]}
          </p>
          <p className="safe-text mt-1 text-lg font-semibold text-ink">
            {packet.title}
          </p>
          <p className="safe-text mt-2 text-sm leading-6 text-muted">
            {packet.firstPhysicalAction}
          </p>
        </div>
        <ArrowRight
          className="mt-1 h-5 w-5 flex-none text-moss transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 pl-2">
        <SignalPill value={taskTypeLabels[packet.taskType]} />
        <SignalPill value={blockLabels[packet.blockType]} tone="moss" />
        <SignalPill value={rescueModeLabels[packet.rescueMode]} />
        <SignalPill value={supportLabels[packet.supportLevel]} />
        <SignalPill value={`U${packet.urgency} / C${packet.consequence}`} tone="clay" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pl-2 text-xs font-medium text-muted">
        <span>Last touched {formatDate(packet.lastTouchedAt)}</span>
        <span>Choose one next action</span>
      </div>
    </button>
  );
}
