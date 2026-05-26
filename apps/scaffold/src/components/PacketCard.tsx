import { ArrowRight, Clock3 } from "lucide-react";
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
      className="group w-full rounded-lg border border-line bg-surface p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-moss hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="safe-text text-base font-semibold text-ink">{packet.title}</p>
          <p className="safe-text mt-2 text-sm leading-6 text-muted">
            {packet.firstPhysicalAction}
          </p>
        </div>
        <ArrowRight
          className="mt-1 h-5 w-5 flex-none text-moss transition group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-ink">
          {taskTypeLabels[packet.taskType]}
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-ink">
          {blockLabels[packet.blockType]}
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-ink">
          {rescueModeLabels[packet.rescueMode]}
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-ink">
          {supportLabels[packet.supportLevel]}
        </span>
        <span className="rounded-full border border-line bg-paper px-3 py-1 text-ink">
          U{packet.urgency} / C{packet.consequence}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-muted">
        <span>{statusLabels[packet.status]}</span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          {formatDate(packet.lastTouchedAt)}
        </span>
      </div>
    </button>
  );
}
