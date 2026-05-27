import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildExport,
  defaultMeta,
  ensureMeta,
  loadLocalData,
  replaceLocalData,
  saveMeta,
  savePacket,
  type ScaffoldExport
} from "../data/db";
import {
  generateExitResponsiblyScript,
  increaseSupportLevel,
  statusForOutcome,
  updateSupportLevel
} from "../engine/rescueEngine";
import {
  generateRescuePacketWithAdapter,
  type RescueGenerationAdapter
} from "../llm/rescueAdapter";
import type {
  AppMeta,
  QualitySignal,
  ReentryActionType,
  ReentryEvent,
  RescuePacket,
  Sprint,
  SprintOutcome,
  Status
} from "../types";

function sortPackets(packets: RescuePacket[]): RescuePacket[] {
  return [...packets].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function touch(packet: RescuePacket): RescuePacket {
  const now = new Date().toISOString();
  return {
    ...packet,
    updatedAt: now,
    lastTouchedAt: now
  };
}

function makeLocalId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useScaffoldData() {
  const [packets, setPackets] = useState<RescuePacket[]>([]);
  const [meta, setMeta] = useState<AppMeta>(defaultMeta());
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const local = await loadLocalData();
      setPackets(local.packets);
      setMeta(local.meta);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load local data.");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persistPacket = useCallback(async (nextPacket: RescuePacket) => {
    await savePacket(nextPacket);
    setPackets((current) =>
      sortPackets([
        nextPacket,
        ...current.filter((packet) => packet.id !== nextPacket.id)
      ])
    );
  }, []);

  const createPacket = useCallback(
    async (input: string) => {
      const result = await generateRescuePacketWithAdapter(
        input,
        meta.llmConsent
      );
      const packet = result.packet;
      await persistPacket(packet);
      return packet;
    },
    [meta.llmConsent, persistPacket]
  );

  const deepRescuePacket = useCallback(
    async (packetId: string, adapter: RescueGenerationAdapter) => {
      const current = packets.find((packet) => packet.id === packetId);
      if (!current) return null;

      const result = await generateRescuePacketWithAdapter(
        current.originalText,
        meta.llmConsent,
        adapter,
        current
      );
      await persistPacket(result.packet);
      return result;
    },
    [meta.llmConsent, packets, persistPacket]
  );

  const previewDeepRescuePacket = useCallback(
    async (packetId: string, adapter: RescueGenerationAdapter) => {
      const current = packets.find((packet) => packet.id === packetId);
      if (!current) return null;

      return generateRescuePacketWithAdapter(
        current.originalText,
        meta.llmConsent,
        adapter,
        current
      );
    },
    [meta.llmConsent, packets]
  );

  const updatePacket = useCallback(
    async (
      packetId: string,
      updater: Partial<RescuePacket> | ((packet: RescuePacket) => RescuePacket)
    ) => {
      const current = packets.find((packet) => packet.id === packetId);
      if (!current) return null;

      const nextPacket =
        typeof updater === "function"
          ? updater(current)
          : {
              ...current,
              ...updater
            };
      const touched = touch(nextPacket);
      await persistPacket(touched);
      return touched;
    },
    [packets, persistPacket]
  );

  const changeStatus = useCallback(
    async (packetId: string, status: Status) => {
      return updatePacket(packetId, { status });
    },
    [updatePacket]
  );

  const recordSprint = useCallback(
    async (
      packetId: string,
      outcome: SprintOutcome,
      durationMinutes: number,
      notes = ""
    ) => {
      const current = packets.find((packet) => packet.id === packetId);
      if (!current) return null;

      const now = new Date().toISOString();
      const sprint: Sprint = {
        id: `sprint-${crypto.randomUUID()}`,
        packetId,
        startedAt: new Date(Date.now() - durationMinutes * 60_000).toISOString(),
        endedAt: now,
        durationMinutes,
        outcome,
        notes
      };
      const nextSupportLevel = updateSupportLevel(current, outcome);
      const supportFaded = nextSupportLevel !== current.supportLevel;
      const nextPacket = touch({
        ...current,
        sprintHistory: [...current.sprintHistory, sprint],
        supportLevel: nextSupportLevel,
        status: statusForOutcome(outcome)
      });
      const nextMeta: AppMeta = {
        ...(await ensureMeta()),
        repairs:
          outcome === "repair" ? meta.repairs + 1 : meta.repairs,
        supportFadingEvents: supportFaded
          ? meta.supportFadingEvents + 1
          : meta.supportFadingEvents,
        updatedAt: now
      };

      await Promise.all([savePacket(nextPacket), saveMeta(nextMeta)]);
      setPackets((currentPackets) =>
        sortPackets([
          nextPacket,
          ...currentPackets.filter((packet) => packet.id !== packetId)
        ])
      );
      setMeta(nextMeta);
      return nextPacket;
    },
    [meta.repairs, meta.supportFadingEvents, packets]
  );

  const increaseSupport = useCallback(
    async (packetId: string) => {
      return updatePacket(packetId, (packet) => ({
        ...packet,
        supportLevel: increaseSupportLevel(packet.supportLevel)
      }));
    },
    [updatePacket]
  );

  const recordReentryAction = useCallback(
    async (packetId: string, actionType: ReentryActionType) => {
      const current = packets.find((packet) => packet.id === packetId);
      if (!current) return null;

      const now = new Date().toISOString();
      const reentryEvent: ReentryEvent = {
        id: makeLocalId("reentry"),
        packetId,
        actionType,
        createdAt: now
      };
      let nextPacket: RescuePacket = {
        ...current,
        reentryHistory: [...current.reentryHistory, reentryEvent]
      };

      if (actionType === "resume_first_move") {
        nextPacket = {
          ...nextPacket,
          status: "in_progress"
        };
      }

      if (actionType === "repair_this") {
        nextPacket = {
          ...nextPacket,
          rescueMode: "repair",
          status: "rescue_now"
        };
      }

      if (actionType === "unblock_missing_piece") {
        nextPacket = {
          ...nextPacket,
          rescueMode: "unblock",
          status: "waiting"
        };
      }

      if (actionType === "exit_responsibly") {
        const exitStatus =
          nextPacket.exitStatus === "not_chosen"
            ? "renegotiate"
            : nextPacket.exitStatus;
        nextPacket = {
          ...nextPacket,
          exitStatus,
          exitScript: generateExitResponsiblyScript(
            nextPacket.originalText,
            nextPacket.taskType,
            exitStatus
          ),
          rescueMode: "exit_responsibly",
          status: "exited_responsibly"
        };
      }

      const touched = {
        ...nextPacket,
        updatedAt: now,
        lastTouchedAt: now
      };
      await persistPacket(touched);
      return touched;
    },
    [packets, persistPacket]
  );

  const incrementReentries = useCallback(async () => {
    const current = await ensureMeta();
    const nextMeta = {
      ...current,
      reentries: current.reentries + 1,
      updatedAt: new Date().toISOString()
    };
    await saveMeta(nextMeta);
    setMeta(nextMeta);
  }, []);

  const updateExternalLlmConsent = useCallback(async (
    enabled: boolean,
    providerLabel?: string
  ) => {
    const current = await ensureMeta();
    const now = new Date().toISOString();
    const nextMeta: AppMeta = {
      ...current,
      llmConsent: {
        externalLlmEnabled: enabled,
        providerLabel: enabled
          ? providerLabel ?? "External LLM adapter"
          : "No external LLM adapter connected",
        consentedAt: enabled ? now : current.llmConsent.consentedAt,
        revokedAt: enabled ? undefined : now
      },
      updatedAt: now
    };

    await saveMeta(nextMeta);
    setMeta(nextMeta);
    return nextMeta;
  }, []);

  const recordQualitySignal = useCallback(
    async (signal: Omit<QualitySignal, "id" | "createdAt">) => {
      const current = await ensureMeta();
      const now = new Date().toISOString();
      const nextSignal: QualitySignal = {
        ...signal,
        id: makeLocalId("quality"),
        createdAt: now
      };
      const nextMeta: AppMeta = {
        ...current,
        qualitySignals: [...current.qualitySignals, nextSignal].slice(-200),
        updatedAt: now
      };

      await saveMeta(nextMeta);
      setMeta(nextMeta);
      return nextSignal;
    },
    []
  );

  const exportLocalData = useCallback(async (): Promise<ScaffoldExport> => {
    return buildExport();
  }, []);

  const importLocalData = useCallback(
    async (raw: unknown) => {
      const payload = await replaceLocalData(raw);
      await refresh();
      return payload;
    },
    [refresh]
  );

  const packetCountByStatus = useMemo(() => {
    return packets.reduce<Record<Status, number>>(
      (counts, packet) => {
        counts[packet.status] += 1;
        return counts;
      },
      {
        rescue_now: 0,
        in_progress: 0,
        waiting: 0,
        repaired: 0,
        done_enough: 0,
        exited_responsibly: 0,
        archived: 0
      }
    );
  }, [packets]);

  return {
    packets,
    meta,
    isReady,
    error,
    packetCountByStatus,
    createPacket,
    updatePacket,
    changeStatus,
    recordSprint,
    increaseSupport,
    recordReentryAction,
    incrementReentries,
    deepRescuePacket,
    previewDeepRescuePacket,
    updateExternalLlmConsent,
    recordQualitySignal,
    exportLocalData,
    importLocalData,
    refresh
  };
}
