import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  Check,
  Clipboard,
  Download,
  FileJson,
  FlaskConical,
  Map as MapIcon,
  Mic,
  Play,
  Plus,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload
} from "lucide-react";
import { BrandMark } from "./components/BrandMark";
import { PacketCard } from "./components/PacketCard";
import { SprintMode } from "./components/SprintMode";
import {
  EmptyState,
  Panel,
  PrimaryAction,
  RescueBrief,
  Shell,
  SignalPill
} from "./components/design";
import { parseImportPayload, type ScaffoldExport } from "./data/db";
import { generatePatternMap } from "./engine/patternMap";
import {
  detectReentryState,
  generateReentryActions,
  generateSmartReentryList
} from "./engine/reentryEngine";
import {
  classifyBlockWithConfidence,
  classifyTaskType,
  decomposeTask,
  generateFirstPhysicalAction,
  generateExitResponsiblyScript,
  generateRescuePacket,
  increaseSupportLevel,
  scoreRepairRelevance
} from "./engine/rescueEngine";
import {
  buildQualityExport,
  buildQualityRegressionWatch,
  comparePacketQuality,
  generateRewriteSuggestions,
  makeDefaultQualityFixtures,
  makeQualityBaselines,
  scorePacketQuality,
  summarizeDeepRescueEval,
  summarizeQualitySignals,
  type DeepRescueEvalSummary,
  type GoldenRescueFixture,
  type PacketQualityComparison,
  type PacketQualityScore
} from "./engine/qualityLab";
import { useScaffoldData } from "./hooks/useScaffoldData";
import {
  clearByokSettings,
  defaultEndpointForProvider,
  defaultModelForProvider,
  labelForProvider,
  loadByokSettings,
  providerLabelFromSettings,
  saveByokSettings,
  summarizeByokSettings,
  type ByokProvider,
  type ByokSettings
} from "./llm/byokSettings";
import {
  ByokConfigurationError,
  ExternalLlmConsentRequiredError,
  ExternalLlmRequestError,
  createByokRescueAdapter,
  generateRescuePacketWithAdapter
} from "./llm/rescueAdapter";
import {
  blockLabels,
  exitStatusLabels,
  missingItemLabels,
  qualitySignalChoiceLabels,
  qualitySignalDimensionLabels,
  qualityRepairExpectationLabels,
  reentryStateLabels,
  rescueModeLabels,
  statusLabels,
  supportLabels,
  taskTypeLabels,
  type ExitResponsibilityStatus,
  type MissingItemType,
  type PatternActionSuggestion,
  type QualityBaseline,
  type QualityFixture,
  type QualitySignal,
  type QualitySignalChoice,
  type QualitySignalDimension,
  type QualityThresholds,
  type ReentryActionType,
  type RescueMode,
  type RescuePacket,
  type SprintOutcome,
  type Status
} from "./types";

type Screen =
  | "home"
  | "packet"
  | "sprint"
  | "reentry"
  | "patterns"
  | "quality"
  | "settings";

const statusOrder: Status[] = [
  "rescue_now",
  "in_progress",
  "waiting",
  "repaired",
  "done_enough",
  "exited_responsibly",
  "archived"
];

const rescueModeOrder: RescueMode[] = [
  "start_tiny",
  "make_it_ugly",
  "repair",
  "body_double",
  "unblock",
  "exit_responsibly"
];

const missingItemOrder: MissingItemType[] = [
  "information",
  "material",
  "decision",
  "energy",
  "courage",
  "time",
  "permission"
];

const exitStatusOrder: Exclude<ExitResponsibilityStatus, "not_chosen">[] = [
  "renegotiate",
  "defer",
  "delegate",
  "abandon"
];

const qualityChoiceOrder: QualitySignalChoice[] = [
  "local_better",
  "deep_better",
  "both_useful",
  "neither_clear"
];

const qualityDimensionOrder: QualitySignalDimension[] = [
  "next_action",
  "block",
  "plan",
  "repair",
  "overall"
];

const navButtonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition";

const stuckDraftStorageKey = "scaffold.stuckDraft.v1";

function loadSavedStuckDraft(): string {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(stuckDraftStorageKey) ?? "";
  } catch {
    return "";
  }
}

function saveStuckDraft(value: string) {
  if (typeof window === "undefined") return;

  try {
    if (value.trim()) {
      window.localStorage.setItem(stuckDraftStorageKey, value);
    } else {
      window.localStorage.removeItem(stuckDraftStorageKey);
    }
  } catch {
    // Local draft autosave is a convenience only; packet storage remains IndexedDB.
  }
}

function downloadJsonPayload(payload: unknown, filenamePrefix: string) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const starterPrompts = [
  "I need to start my assignment and I don't know where to start.",
  "I need to reply to this email but I feel ashamed it is late.",
  "I have too many things and I am frozen.",
  "I need to clean but the room feels too big.",
  "I am bored and I keep scrolling."
];

interface ComposerPreview {
  taskTypeLabel: string;
  blockLabel: string;
  blockConfidence: number;
  firstPhysicalAction: string;
  repairNeeded: boolean;
  repairLabel: string;
}

function buildComposerPreview(input: string): ComposerPreview | null {
  const trimmed = input.trim();
  if (trimmed.length < 6) return null;

  const taskType = classifyTaskType(trimmed);
  const block = classifyBlockWithConfidence(trimmed);
  const repair = scoreRepairRelevance(trimmed, block.blockType, taskType);

  return {
    taskTypeLabel: taskTypeLabels[taskType],
    blockLabel: blockLabels[block.blockType],
    blockConfidence: Math.round(block.confidence * 100),
    firstPhysicalAction: generateFirstPhysicalAction(
      trimmed,
      block.blockType,
      taskType
    ),
    repairNeeded: repair.score >= 45,
    repairLabel: repair.score >= 45 ? "Repair needed" : "No repair needed"
  };
}

export default function App() {
  const {
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
    previewDeepRescuePacket,
    updateExternalLlmConsent,
    recordQualitySignal,
    saveQualityFixtures,
    saveQualityThresholds,
    saveQualityBaselines,
    exportLocalData,
    importLocalData
  } = useScaffoldData();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedPacketId, setSelectedPacketId] = useState<string | null>(null);
  const [stuckText, setStuckText] = useState(loadSavedStuckDraft);
  const [isListening, setIsListening] = useState(false);
  const [byokSettings, setByokSettings] = useState<ByokSettings>(() =>
    loadByokSettings()
  );
  const [patternStarterMessage, setPatternStarterMessage] = useState<string | null>(
    null
  );
  const selectedPacket = packets.find((packet) => packet.id === selectedPacketId) ?? null;
  const activeCount =
    packetCountByStatus.rescue_now +
    packetCountByStatus.in_progress +
    packetCountByStatus.waiting;
  const isSprintScreen = screen === "sprint";

  useEffect(() => {
    if (selectedPacketId && !selectedPacket) {
      setSelectedPacketId(null);
      setScreen("home");
    }
  }, [selectedPacket, selectedPacketId]);

  useEffect(() => {
    saveStuckDraft(stuckText);
  }, [stuckText]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [screen, selectedPacketId]);

  async function handleCreatePacket() {
    const trimmed = stuckText.trim();
    if (!trimmed) return;

    const packet = await createPacket(trimmed);
    setSelectedPacketId(packet.id);
    setStuckText("");
    setPatternStarterMessage(null);
    setScreen("packet");
  }

  function usePatternSuggestion(suggestion: PatternActionSuggestion) {
    setStuckText(suggestion.draftText);
    setPatternStarterMessage(suggestion.title);
    setScreen("home");
  }

  function openPacket(packet: RescuePacket) {
    setSelectedPacketId(packet.id);
    setScreen("packet");
  }

  function startSpeechInput() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result?.[0]?.transcript ?? "";
      setStuckText((current) => `${current} ${transcript}`.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  }

  async function openReentry() {
    await incrementReentries();
    setScreen("reentry");
  }

  async function handleReentryAction(
    packet: RescuePacket,
    actionType: ReentryActionType
  ) {
    const nextPacket = await recordReentryAction(packet.id, actionType);
    if (nextPacket) {
      setSelectedPacketId(nextPacket.id);
      setScreen("packet");
    }
  }

  async function handleSprintOutcome(
    outcome: SprintOutcome,
    durationMinutes: number,
    notes?: string
  ) {
    if (!selectedPacket) return;

    const nextPacket = await recordSprint(
      selectedPacket.id,
      outcome,
      durationMinutes,
      notes
    );
    if (nextPacket) setSelectedPacketId(nextPacket.id);
    setScreen("packet");
  }

  function handleSaveByokSettings(settings: ByokSettings) {
    const saved = saveByokSettings(settings);
    setByokSettings(saved);
    return saved;
  }

  function handleClearByokSettings() {
    const cleared = clearByokSettings();
    setByokSettings(cleared);
    return cleared;
  }

  if (!isReady) {
    return (
      <main className="paper-field flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
        <div className="flex items-center gap-3 rounded-lg border border-line bg-surface p-6 shadow-premium">
          <BrandMark className="h-10 w-10 text-ink" />
          Loading Scaffold
        </div>
      </main>
    );
  }

  return (
    <div
      className={`min-h-screen text-ink ${
        isSprintScreen ? "bg-ink" : "paper-field bg-paper pb-28 md:pb-0"
      }`}
    >
      {!isSprintScreen && (
        <header className="app-header sticky top-0 z-20 border-b border-line/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <button
              type="button"
              onClick={() => setScreen("home")}
              className="flex min-h-11 items-center gap-3 text-left"
            >
              <BrandMark className="h-12 w-12 text-ink shadow-sm" />
              <span>
                <span className="block text-xl font-semibold leading-6">Scaffold</span>
                <span className="block text-sm text-muted">
                  Not reminders. Rescue.
                </span>
              </span>
            </button>

            <nav className="hidden flex-wrap gap-2 md:flex" aria-label="Primary">
              <NavButton
                active={screen === "home" || screen === "packet"}
                icon={<Plus className="h-4 w-4" aria-hidden="true" />}
                label="Rescue"
                onClick={() => setScreen("home")}
              />
              <NavButton
                active={screen === "reentry"}
                icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
                label="Re-entry"
                onClick={() => void openReentry()}
              />
              <NavButton
                active={screen === "patterns"}
                icon={<MapIcon className="h-4 w-4" aria-hidden="true" />}
                label="Map"
                onClick={() => setScreen("patterns")}
              />
              <NavButton
                active={screen === "settings" || screen === "quality"}
                icon={<Settings className="h-4 w-4" aria-hidden="true" />}
                label="Settings"
                onClick={() => setScreen("settings")}
              />
            </nav>
          </div>
        </header>
      )}

      {!isSprintScreen && (
        <MobileCommandRail
          screen={screen}
          onRescue={() => setScreen("home")}
          onReentry={() => void openReentry()}
          onMap={() => setScreen("patterns")}
          onSettings={() => setScreen("settings")}
        />
      )}

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-clay/40 bg-surface p-4 text-sm font-semibold text-clay shadow-sm">
            {error}
          </div>
        </div>
      )}

      {screen === "home" && (
        <HomeScreen
          activeCount={activeCount}
          packets={packets}
          meta={meta}
          byokSettings={byokSettings}
          stuckText={stuckText}
          isListening={isListening}
          starterMessage={patternStarterMessage}
          onExport={exportLocalData}
          onOpenSettings={() => setScreen("settings")}
          onTextChange={(value) => {
            setStuckText(value);
            if (patternStarterMessage) setPatternStarterMessage(null);
          }}
          onClearDraft={() => {
            setStuckText("");
            setPatternStarterMessage(null);
          }}
          onCreatePacket={() => void handleCreatePacket()}
          onListen={startSpeechInput}
          onOpenPacket={openPacket}
        />
      )}

      {screen === "packet" && selectedPacket && (
        <PacketDetail
          packet={selectedPacket}
          meta={meta}
          byokSettings={byokSettings}
          onBack={() => setScreen("home")}
          onStartSprint={() => setScreen("sprint")}
          onUpdatePacket={updatePacket}
          onChangeStatus={changeStatus}
          onIncreaseSupport={increaseSupport}
          onPreviewDeepRescue={(packetId) =>
            previewDeepRescuePacket(packetId, createByokRescueAdapter(byokSettings))
          }
          onOpenSettings={() => setScreen("settings")}
        />
      )}

      {screen === "sprint" && selectedPacket && (
        <SprintMode
          packet={selectedPacket}
          onBack={() => setScreen("packet")}
          onRecordOutcome={handleSprintOutcome}
          onStuckAgain={() => undefined}
        />
      )}

      {screen === "reentry" && (
        <ReentryScreen
          packets={packets}
          onOpenPacket={openPacket}
          onReentryAction={handleReentryAction}
        />
      )}

      {screen === "patterns" && (
        <PatternScreen
          packets={packets}
          meta={meta}
          onUseSuggestion={usePatternSuggestion}
        />
      )}

      {screen === "quality" && (
        <QualityLabScreen
          meta={meta}
          byokSettings={byokSettings}
          onRecordQualitySignal={recordQualitySignal}
          onSaveQualityFixtures={saveQualityFixtures}
          onSaveQualityThresholds={saveQualityThresholds}
          onSaveQualityBaselines={saveQualityBaselines}
          onOpenSettings={() => setScreen("settings")}
        />
      )}

      {screen === "settings" && (
        <SettingsScreen
          meta={meta}
          byokSettings={byokSettings}
          onExport={exportLocalData}
          onImport={importLocalData}
          onSetExternalLlmConsent={updateExternalLlmConsent}
          onSaveByokSettings={handleSaveByokSettings}
          onClearByokSettings={handleClearByokSettings}
          onOpenQualityLab={() => setScreen("quality")}
          packetCount={packets.length}
        />
      )}
    </div>
  );
}

function NavButton({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${navButtonBase} ${
        active
                ? "bg-ink text-white shadow-sm"
                : "secondary-action border border-line/80 bg-surface/88 text-ink hover:border-moss hover:bg-surface"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileCommandRail({
  screen,
  onRescue,
  onReentry,
  onMap,
  onSettings
}: {
  screen: Screen;
  onRescue: () => void;
  onReentry: () => void;
  onMap: () => void;
  onSettings: () => void;
}) {
  const items = [
    {
      label: "Rescue",
      icon: <Plus className="h-5 w-5" aria-hidden="true" />,
      active: screen === "home" || screen === "packet" || screen === "sprint",
      onClick: onRescue
    },
    {
      label: "Re-entry",
      icon: <RotateCcw className="h-5 w-5" aria-hidden="true" />,
      active: screen === "reentry",
      onClick: onReentry
    },
    {
      label: "Map",
      icon: <MapIcon className="h-5 w-5" aria-hidden="true" />,
      active: screen === "patterns",
      onClick: onMap
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" aria-hidden="true" />,
      active: screen === "settings" || screen === "quality",
      onClick: onSettings
    }
  ];

  return (
    <nav
      aria-label="Mobile command rail"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-surface/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-premium backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            aria-current={item.active ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-semibold transition ${
              item.active
                ? "bg-ink text-paper shadow-sm"
                : "text-muted hover:bg-paper/85 hover:text-ink"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function HomeScreen({
  activeCount,
  packets,
  meta,
  byokSettings,
  stuckText,
  isListening,
  starterMessage,
  onExport,
  onOpenSettings,
  onTextChange,
  onClearDraft,
  onCreatePacket,
  onListen,
  onOpenPacket
}: {
  activeCount: number;
  packets: RescuePacket[];
  meta: Parameters<typeof generatePatternMap>[1];
  byokSettings: ByokSettings;
  stuckText: string;
  isListening: boolean;
  starterMessage: string | null;
  onExport: () => Promise<unknown>;
  onOpenSettings: () => void;
  onTextChange: (value: string) => void;
  onClearDraft: () => void;
  onCreatePacket: () => void;
  onListen: () => void;
  onOpenPacket: (packet: RescuePacket) => void;
}) {
  const groupedPackets = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        packets: packets.filter((packet) => packet.status === status)
      })),
    [packets]
  );
  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition);
  const composerPreview = useMemo(
    () => buildComposerPreview(stuckText),
    [stuckText]
  );

  return (
    <main>
      <Shell className="pb-3">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel className="rescue-console relative overflow-hidden p-4 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  No explanation needed.
                </p>
                <h1 className="safe-text mt-3 text-3xl font-semibold leading-tight text-ink sm:text-5xl">
                  What is worth rescuing?
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:mt-4 sm:text-lg sm:leading-8">
                  Drop the messy version. Scaffold turns it into one next physical
                  action, a short rescue plan, and a repair option only when repair
                  is actually relevant.
                </p>
              </div>
              <SignalPill value="Local-first" tone="moss" />
            </div>

            <div className="mt-5 rounded-lg border border-line/75 bg-paper/58 p-3 shadow-inner-soft sm:mt-7 sm:p-4">
              <label
                className="block text-sm font-semibold text-ink"
                htmlFor="stuck"
              >
                Messy task
              </label>
              {starterMessage && (
                <p className="mt-3 rounded-lg border border-line bg-surface p-3 text-sm font-semibold leading-6 text-ink">
                  Starter loaded: {starterMessage}
                </p>
              )}
              <textarea
                id="stuck"
                value={stuckText}
                onChange={(event) => onTextChange(event.target.value)}
                className="console-textarea mt-3 min-h-28 w-full resize-y rounded-lg border border-line bg-surface p-4 text-lg leading-8 text-ink placeholder:text-muted/70 sm:min-h-44"
                placeholder="I need to reply to this email but I feel ashamed it is late."
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm leading-6 text-muted">
                  Draft autosaves locally in this browser.
                </p>
                {stuckText.trim() && (
                  <button
                    type="button"
                    onClick={onClearDraft}
                  className="secondary-action min-h-10 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-clay"
                  >
                    Clear draft
                  </button>
                )}
              </div>
            </div>

            <LiveComposerPreview preview={composerPreview} hasInput={Boolean(stuckText.trim())} />

            <div className="mt-5 flex flex-wrap gap-3">
              <PrimaryAction
                onClick={onCreatePacket}
                disabled={!stuckText.trim()}
                className="text-lg"
              >
                <BrandMark className="h-7 w-7 text-ink" decorative />
                I'm stuck
              </PrimaryAction>
              <button
                type="button"
                onClick={onListen}
                disabled={!speechSupported || isListening}
                className="secondary-action inline-flex min-h-14 items-center gap-2 rounded-lg border border-line bg-surface px-5 text-base font-semibold text-ink transition hover:border-moss disabled:cursor-not-allowed disabled:text-muted"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
                {isListening ? "Listening" : "Speak"}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onTextChange(prompt)}
                  className="secondary-action rounded-full border border-line/75 bg-paper/72 px-3 py-2 text-left text-xs font-semibold text-muted transition hover:border-moss hover:bg-surface hover:text-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel tone="ink" className="overflow-hidden p-5 sm:p-6">
              <p className="text-sm font-semibold text-paper/70">Rescue engine</p>
              <p className="mt-4 text-5xl font-semibold text-paper">{activeCount}</p>
              <p className="mt-3 text-lg leading-7 text-paper/80">
                Choose one next action. Done enough counts.
              </p>
              <div className="mt-7 space-y-3 text-sm font-medium text-paper/75">
                <p>Start tiny.</p>
                <p>Make it ugly.</p>
                <p>Repair is progress.</p>
                <p>Exit responsibly.</p>
              </div>
            </Panel>

            <LocalVaultStatus
              meta={meta}
              byokSettings={byokSettings}
              onExport={onExport}
              onOpenSettings={onOpenSettings}
            />
          </div>
        </div>
      </Shell>

      {packets.length === 0 && (
        <Shell className="pt-2 pb-3">
          <FirstRunPanel
            onLoadDemo={() =>
              onTextChange(
                "I need to reply to this email but I feel ashamed it is late."
              )
            }
          />
        </Shell>
      )}

      <Shell className="pt-3 pb-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-moss">Task packets</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Choose one next action.
            </h2>
          </div>
          <SignalPill value={`${packets.length} local packets`} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {groupedPackets.map(({ status, packets: group }) => (
            <Panel key={status} tone="paper" className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold text-ink">{statusLabels[status]}</h3>
                <SignalPill value={group.length} />
              </div>
              <div className="space-y-3">
                {group.length > 0 ? (
                  group.map((packet) => (
                    <PacketCard
                      key={packet.id}
                      packet={packet}
                      onOpen={onOpenPacket}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="Nothing here right now."
                    body="No score. No streak. Just the next rescue."
                  />
                )}
              </div>
            </Panel>
          ))}
        </div>
      </Shell>
    </main>
  );
}

function LocalVaultStatus({
  meta,
  byokSettings,
  onExport,
  onOpenSettings
}: {
  meta: Parameters<typeof generatePatternMap>[1];
  byokSettings: ByokSettings;
  onExport: () => Promise<unknown>;
  onOpenSettings: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const byokSummary = summarizeByokSettings(byokSettings);
  const deepRescueOn =
    meta.llmConsent.externalLlmEnabled && byokSummary.hasApiKey;

  async function handleExport() {
    const payload = await onExport();
    downloadJsonPayload(payload, "scaffold-export");
    setMessage("Export created.");
  }

  return (
    <Panel tone="paper" className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">Local vault</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Last saved</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            {formatShortDate(meta.updatedAt)}
          </p>
        </div>
        <ShieldCheck className="h-6 w-6 flex-none text-moss" aria-hidden="true" />
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2">
          <span className="font-semibold text-muted">Deep Rescue</span>
          <span className="font-semibold text-ink">
            {deepRescueOn ? "On" : "Off"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2">
          <span className="font-semibold text-muted">API keys</span>
          <span className="font-semibold text-ink">Not exported</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleExport()}
          className="secondary-action inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm font-semibold text-ink transition hover:border-moss"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="secondary-action inline-flex min-h-10 items-center rounded-lg border border-line bg-paper px-3 text-sm font-semibold text-ink transition hover:border-moss"
        >
          Vault settings
        </button>
        {message && (
          <span className="inline-flex min-h-10 items-center text-sm font-semibold text-mossDark">
            {message}
          </span>
        )}
      </div>
    </Panel>
  );
}

function LiveComposerPreview({
  preview,
  hasInput
}: {
  preview: ComposerPreview | null;
  hasInput: boolean;
}) {
  if (!hasInput) {
    return (
      <div className="mt-4 rounded-lg border border-line/70 bg-paper/55 p-4 text-sm leading-6 text-muted">
        Local preview appears as you type.
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="mt-4 rounded-lg border border-line/70 bg-paper/55 p-4 text-sm leading-6 text-muted">
        Keep going. The first move will sharpen.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-line/70 bg-surface/82 p-4 shadow-inner-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">
            Local rescue preview
          </p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Next physical action forming.
          </p>
        </div>
        <SignalPill
          value={preview.repairLabel}
          tone={preview.repairNeeded ? "clay" : "moss"}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <SignalPill label="Likely task" value={preview.taskTypeLabel} />
        <SignalPill label="Likely block" value={preview.blockLabel} tone="moss" />
        <SignalPill label="Confidence" value={`${preview.blockConfidence}%`} />
      </div>

      <div className="mt-4 rounded-lg border border-line bg-paper/80 p-3">
        <p className="text-xs font-semibold uppercase text-muted">
          First move
        </p>
        <p className="safe-text mt-1 text-base font-semibold leading-7 text-ink">
          {preview.firstPhysicalAction}
        </p>
      </div>
    </div>
  );
}

function FirstRunPanel({ onLoadDemo }: { onLoadDemo: () => void }) {
  const steps = [
    {
      title: "Pick a stuck moment",
      body: "Use the messy words you already have."
    },
    {
      title: "See the next physical action",
      body: "Scaffold finds the first thing your hands can do."
    },
    {
      title: "Start a 10-minute sprint",
      body: "Stay with the visible piece."
    },
    {
      title: "Done enough counts",
      body: "Repair, continue, or stop cleanly."
    }
  ];

  return (
    <Panel className="rescue-enter overflow-hidden p-0">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase text-moss">
            First rescue
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">
            One guided rescue. No onboarding sludge.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            Pick one stuck moment, get one physical next action, and decide what
            is still possible after the sprint.
          </p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-lg border border-line bg-paper/80 p-4"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-moss/10 text-sm font-semibold text-mossDark">
                  {index + 1}
                </span>
                <p className="mt-3 font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <PrimaryAction onClick={onLoadDemo} className="min-h-12">
              Try a guided rescue
            </PrimaryAction>
            <SignalPill value="Local rescue first" tone="moss" />
          </div>
        </div>
        <div className="border-t border-line bg-paper/80 p-5 lg:border-l lg:border-t-0">
          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">Local rescue</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Stays in this browser. Deep Rescue stays off unless you explicitly
              choose it and provide your own key.
            </p>
            <p className="mt-4 text-sm font-semibold text-mossDark">
              Choose one next action.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function canPersonalizeRepairScript(script: string): boolean {
  return /\[(Name|specific thing|time\/date|date\/time)\]/.test(script);
}

function personalizeRepairScript(
  script: string,
  details: {
    recipientName: string;
    specificThing: string;
    timeDate: string;
  }
): string {
  return script
    .split("[Name]")
    .join(details.recipientName.trim() || "[Name]")
    .split("[specific thing]")
    .join(details.specificThing.trim() || "[specific thing]")
    .split("[time/date]")
    .join(details.timeDate.trim() || "[time/date]")
    .split("[date/time]")
    .join(details.timeDate.trim() || "[date/time]");
}

type ActiveRescueTool = "repair" | "unblock" | "exit";

function initialRescueTool(packet: RescuePacket): ActiveRescueTool {
  if (
    packet.rescueMode === "exit_responsibly" ||
    packet.exitStatus !== "not_chosen" ||
    packet.status === "exited_responsibly"
  ) {
    return "exit";
  }

  if (packet.rescueMode === "repair") {
    return "repair";
  }

  if (packet.rescueMode === "unblock" || packet.status === "waiting") {
    return "unblock";
  }

  return "repair";
}

function ActionDisplay({
  packet,
  onStartSprint
}: {
  packet: RescuePacket;
  onStartSprint: () => void;
}) {
  return (
    <section className="instrument-display rescue-enter relative overflow-hidden rounded-lg border border-ink bg-ink p-5 text-paper shadow-premium sm:p-7">
      <div className="absolute right-5 top-5 hidden opacity-[0.16] sm:block" aria-hidden="true">
        <BrandMark className="h-16 w-16 text-paper" decorative />
      </div>
      <div className="absolute inset-x-5 top-0 h-px bg-white/15" aria-hidden="true" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">
            Next physical action
          </p>
          <h1 className="safe-text mt-3 max-w-4xl text-3xl font-semibold leading-tight text-paper sm:text-5xl">
            {packet.firstPhysicalAction}
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            <SignalPill value={taskTypeLabels[packet.taskType]} />
            <SignalPill value={blockLabels[packet.blockType]} tone="moss" />
            <SignalPill value={rescueModeLabels[packet.rescueMode]} />
          </div>
          <p className="safe-text mt-5 max-w-3xl text-sm leading-6 text-paper/70">
            <span className="font-semibold text-paper">{packet.title}</span>
            <span className="block">{packet.originalText}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onStartSprint}
          className="secondary-action inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-paper px-5 font-semibold text-ink shadow-action transition hover:bg-white"
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          Start rescue sprint
        </button>
      </div>
    </section>
  );
}

function PacketActionStrip({
  activeTool,
  onStartSprint,
  onDoneEnough,
  onStuckAgain,
  onSelectTool
}: {
  activeTool: ActiveRescueTool;
  onStartSprint: () => void;
  onDoneEnough: () => void;
  onStuckAgain: () => void;
  onSelectTool: (tool: ActiveRescueTool) => void;
}) {
  const toolItems: Array<{ id: ActiveRescueTool; label: string }> = [
    { id: "repair", label: "Repair" },
    { id: "unblock", label: "Unblock" },
    { id: "exit", label: "Exit" }
  ];

  return (
    <div className="sticky top-[5.25rem] z-10 mt-3 rounded-lg border border-line/75 bg-surface/90 p-2 shadow-premium backdrop-blur-xl">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onStartSprint}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-paper transition hover:bg-mossDark"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Start sprint
          </button>
          <button
            type="button"
            onClick={onDoneEnough}
            className="secondary-action inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-moss"
          >
            <Check className="h-4 w-4 text-moss" aria-hidden="true" />
            Done enough
          </button>
          <button
            type="button"
            onClick={onStuckAgain}
            className="secondary-action inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-moss"
          >
            <RotateCcw className="h-4 w-4 text-moss" aria-hidden="true" />
            Stuck again
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-paper/80 p-1">
          {toolItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTool(item.id)}
              className={`min-h-10 rounded-md px-3 text-sm font-semibold transition ${
                activeTool === item.id
                  ? "bg-moss text-white"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DisclosurePanel({
  title,
  eyebrow,
  summary,
  children,
  defaultOpen = false
}: {
  title: string;
  eyebrow?: string;
  summary?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="disclosure-surface group rounded-lg border border-line/75 bg-surface/82"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-left [&::-webkit-details-marker]:hidden sm:px-5">
        <span>
          {eyebrow && (
            <span className="block text-xs font-semibold uppercase text-moss">
              {eyebrow}
            </span>
          )}
          <span className="block text-lg font-semibold text-ink">{title}</span>
          {summary && (
            <span className="safe-text mt-1 block text-sm leading-6 text-muted">
              {summary}
            </span>
          )}
        </span>
        <span
          className="secondary-action flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line bg-paper text-lg font-semibold text-muted transition group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="border-t border-line/80 p-4 sm:p-5">{children}</div>
    </details>
  );
}

function PacketDetail({
  packet,
  meta,
  byokSettings,
  onBack,
  onStartSprint,
  onUpdatePacket,
  onChangeStatus,
  onIncreaseSupport,
  onPreviewDeepRescue,
  onOpenSettings
}: {
  packet: RescuePacket;
  meta: Parameters<typeof generatePatternMap>[1];
  byokSettings: ByokSettings;
  onBack: () => void;
  onStartSprint: () => void;
  onUpdatePacket: (
    packetId: string,
    updater: Partial<RescuePacket> | ((packet: RescuePacket) => RescuePacket)
  ) => Promise<RescuePacket | null>;
  onChangeStatus: (packetId: string, status: Status) => Promise<RescuePacket | null>;
  onIncreaseSupport: (packetId: string) => Promise<RescuePacket | null>;
  onPreviewDeepRescue: (packetId: string) => Promise<{ packet: RescuePacket } | null>;
  onOpenSettings: () => void;
}) {
  const [notes, setNotes] = useState(packet.notes);
  const [showPersonalizer, setShowPersonalizer] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [specificThing, setSpecificThing] = useState("");
  const [timeDate, setTimeDate] = useState("");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [showDeepConsent, setShowDeepConsent] = useState(false);
  const [deepConsentChecked, setDeepConsentChecked] = useState(false);
  const [deepPreviewPacket, setDeepPreviewPacket] = useState<RescuePacket | null>(null);
  const [deepRescueMessage, setDeepRescueMessage] = useState<string | null>(null);
  const [deepRescueError, setDeepRescueError] = useState<string | null>(null);
  const [isDeepRescuing, setIsDeepRescuing] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveRescueTool>(() =>
    initialRescueTool(packet)
  );

  useEffect(() => {
    setNotes(packet.notes);
  }, [packet.id, packet.notes]);

  useEffect(() => {
    setShowPersonalizer(false);
    setRecipientName("");
    setSpecificThing("");
    setTimeDate("");
    setCopyMessage(null);
    setShowDeepConsent(false);
    setDeepConsentChecked(false);
    setDeepPreviewPacket(null);
    setDeepRescueMessage(null);
    setDeepRescueError(null);
    setActiveTool(initialRescueTool(packet));
  }, [packet.id]);

  const moreSupportAvailable =
    increaseSupportLevel(packet.supportLevel) !== packet.supportLevel;
  const confidencePercent = Math.round(packet.blockConfidence * 100);
  const decomposition = decomposeTask(
    packet.originalText,
    packet.blockType,
    packet.taskType
  );
  const repairRelevance = scoreRepairRelevance(
    packet.originalText,
    packet.blockType,
    packet.taskType
  );
  const canPersonalize = canPersonalizeRepairScript(packet.repairScript);
  const personalizedRepairScript = personalizeRepairScript(packet.repairScript, {
    recipientName,
    specificThing,
    timeDate
  });
  const byokSummary = summarizeByokSettings(byokSettings);
  const deepRescueConfigured =
    byokSummary.hasApiKey &&
    Boolean(byokSettings.model.trim()) &&
    Boolean(byokSettings.endpoint.trim());
  const deepRescueAllowed =
    meta.llmConsent.externalLlmEnabled && Boolean(meta.llmConsent.consentedAt);
  const rescueToolTabs: Array<{
    id: ActiveRescueTool;
    label: string;
    body: string;
  }> = [
    {
      id: "repair",
      label: "Repair",
      body:
        repairRelevance.score >= 45
          ? "Copy or personalize a clean script."
          : "Check whether repair is needed."
    },
    {
      id: "unblock",
      label: "Unblock",
      body: "Name the missing piece."
    },
    {
      id: "exit",
      label: "Exit responsibly",
      body: "Renegotiate, defer, delegate, or abandon clearly."
    }
  ];

  async function chooseMissingItem(missingItem: MissingItemType) {
    await onUpdatePacket(packet.id, {
      missingItem,
      rescueMode: "unblock",
      status: "waiting"
    });
  }

  async function chooseExitStatus(exitStatus: ExitResponsibilityStatus) {
    await onUpdatePacket(packet.id, {
      exitStatus,
      exitScript: generateExitResponsiblyScript(
        packet.originalText,
        packet.taskType,
        exitStatus
      ),
      rescueMode: "exit_responsibly",
      status: "exited_responsibly"
    });
  }

  async function copyRepairScript() {
    try {
      await navigator.clipboard.writeText(personalizedRepairScript);
      setCopyMessage("Copied.");
    } catch {
      setCopyMessage("Copy unavailable in this browser.");
    }
  }

  async function runDeepRescue() {
    setDeepRescueMessage(null);
    setDeepRescueError(null);
    setIsDeepRescuing(true);

    try {
      const result = await onPreviewDeepRescue(packet.id);
      if (result) {
        setDeepPreviewPacket(result.packet);
        setDeepRescueMessage("Deep Rescue preview ready. Review changes before applying.");
        setShowDeepConsent(false);
        setDeepConsentChecked(false);
      }
    } catch (caught) {
      if (caught instanceof ExternalLlmConsentRequiredError) {
        setDeepRescueError("Turn on external LLM consent in Settings first.");
      } else if (caught instanceof ByokConfigurationError) {
        setDeepRescueError(caught.message);
      } else if (caught instanceof ExternalLlmRequestError) {
        setDeepRescueError(caught.message);
      } else {
        setDeepRescueError("Deep Rescue could not complete. The local packet is unchanged.");
      }
    } finally {
      setIsDeepRescuing(false);
    }
  }

  async function applyDeepRescuePreview() {
    if (!deepPreviewPacket) return;

    const applied = await onUpdatePacket(packet.id, (current) => ({
      ...deepPreviewPacket,
      id: current.id,
      originalText: current.originalText,
      createdAt: current.createdAt,
      supportLevel: current.supportLevel,
      status: current.status,
      sprintHistory: current.sprintHistory,
      reentryHistory: current.reentryHistory,
      notes: current.notes
    }));

    if (applied) {
      setDeepPreviewPacket(null);
      setDeepRescueMessage("Deep Rescue applied. Local packet history stayed intact.");
    }
  }

  function selectRescueTool(tool: ActiveRescueTool) {
    setActiveTool(tool);
    window.setTimeout(() => {
      document
        .getElementById("rescue-tools")
        ?.scrollIntoView({ block: "start", behavior: "smooth" });
    }, 0);
  }

  async function markStuckAgain() {
    selectRescueTool("unblock");
    await onChangeStatus(packet.id, "rescue_now");
  }

  return (
    <Shell className="max-w-6xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface/90 px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss"
      >
        Back to packets
      </button>

      <ActionDisplay packet={packet} onStartSprint={onStartSprint} />

      <PacketActionStrip
        activeTool={activeTool}
        onStartSprint={onStartSprint}
        onDoneEnough={() => void onChangeStatus(packet.id, "done_enough")}
        onStuckAgain={() => void markStuckAgain()}
        onSelectTool={selectRescueTool}
      />

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Panel>
            <p className="text-xs font-semibold uppercase text-moss">Rescue packet</p>
            <h1 className="safe-text mt-3 text-3xl font-semibold text-ink sm:text-4xl">
              {packet.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              <SignalPill label="Task" value={taskTypeLabels[packet.taskType]} />
              <SignalPill
                label="Likely block"
                value={blockLabels[packet.blockType]}
                tone="moss"
              />
              <SignalPill label="Confidence" value={`${confidencePercent}%`} />
              <SignalPill
                label="Repair fit"
                value={`${repairRelevance.label} ${repairRelevance.score}%`}
                tone={repairRelevance.score >= 45 ? "moss" : "quiet"}
              />
              <SignalPill label="Support" value={supportLabels[packet.supportLevel]} />
              <SignalPill label="Status" value={statusLabels[packet.status]} tone="clay" />
            </div>
          </Panel>

          <DisclosurePanel
            title="Task decomposition"
            eyebrow="Rescue boundary"
            summary="Surface, touch, visible change, and stop rule."
          >
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <InfoPanel title="Surface" body={decomposition.taskSurface} />
              <InfoPanel title="Touch" body={decomposition.objectToTouch} />
              <InfoPanel title="Visible change" body={decomposition.visibleChange} />
              <InfoPanel title="Stop rule" body={decomposition.stopRule} />
            </div>
          </DisclosurePanel>

          <DisclosurePanel
            title="Deep Rescue adapter"
            eyebrow="Optional BYOK"
            summary="Local rules stay default. Send text out only when you explicitly choose Deep Rescue."
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="mt-2 text-xl font-semibold text-ink">
                  Optional BYOK refinement
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Local rules are the default. Deep Rescue can send this packet text
                  to your selected provider only after you confirm the exact text below.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SignalPill value={byokSummary.providerLabel} tone="moss" />
                <SignalPill
                  value={deepRescueAllowed ? "Consent on" : "Consent off"}
                  tone={deepRescueAllowed ? "moss" : "clay"}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeepConsent((current) => !current);
                  setDeepRescueError(null);
                  setDeepRescueMessage(null);
                }}
                disabled={!deepRescueConfigured || !deepRescueAllowed}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-muted"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                Deep Rescue
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 font-semibold text-ink transition hover:border-moss"
              >
                BYOK settings
              </button>
            </div>

            {!deepRescueConfigured && (
              <p className="mt-3 text-sm leading-6 text-muted">
                Add a provider, model, endpoint, and API key in Settings. The key
                stays in this browser and is never included in JSON export.
              </p>
            )}
            {!deepRescueAllowed && (
              <p className="mt-3 text-sm leading-6 text-muted">
                External processing consent is off. No task text can leave this browser.
              </p>
            )}

            {showDeepConsent && (
              <div className="mt-4 rounded-lg border border-line bg-surface p-4">
                <p className="text-sm font-semibold text-ink">
                  Text that will leave this browser
                </p>
                <textarea
                  readOnly
                  value={packet.originalText}
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-line bg-paper p-3 text-sm leading-6 text-ink"
                />
                <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted">
                  <input
                    type="checkbox"
                    checked={deepConsentChecked}
                    onChange={(event) =>
                      setDeepConsentChecked(event.currentTarget.checked)
                    }
                    className="mt-1 h-5 w-5 accent-moss"
                  />
                  <span>
                    I understand this sends the text above to my selected provider
                    using my own API key.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => void runDeepRescue()}
                  disabled={!deepConsentChecked || isDeepRescuing}
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-moss px-4 font-semibold text-white transition hover:bg-mossDark disabled:cursor-not-allowed disabled:bg-muted"
                >
                  {isDeepRescuing ? "Running Deep Rescue" : "Run Deep Rescue"}
                </button>
              </div>
            )}

            {deepRescueMessage && (
              <p className="mt-3 rounded-lg border border-moss/25 bg-moss/10 p-3 text-sm font-semibold text-mossDark">
                {deepRescueMessage}
              </p>
            )}
            {deepPreviewPacket && (
              <DeepRescueComparison
                currentPacket={packet}
                previewPacket={deepPreviewPacket}
                onApply={() => void applyDeepRescuePreview()}
                onDismiss={() => {
                  setDeepPreviewPacket(null);
                  setDeepRescueMessage("Kept the local rules packet.");
                }}
              />
            )}
            {deepRescueError && (
              <p className="mt-3 rounded-lg border border-clay/30 bg-clay/10 p-3 text-sm font-semibold text-clay">
                {deepRescueError}
              </p>
            )}
          </DisclosurePanel>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoPanel title="Real task" body={packet.realTask} />
            <InfoPanel
              title="Minimum viable progress"
              body={packet.minimumViableProgress}
            />
          </div>

          <Panel tone="paper">
            <h2 className="text-xl font-semibold text-ink">10-minute rescue plan</h2>
            <ol className="mt-3 space-y-3">
              {packet.tenMinutePlan.map((step) => (
                <li
                  key={step}
                  className="safe-text rounded-lg border border-line bg-surface p-4 leading-7 text-ink"
                >
                  {step}
                </li>
              ))}
            </ol>
          </Panel>

          <div id="rescue-tools" className="scroll-mt-32">
          <Panel tone="paper" className="rescue-enter p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Rescue tools
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Repair, unblock, or exit cleanly.
                </h2>
              </div>
              <SignalPill value={rescueModeLabels[packet.rescueMode]} tone="moss" />
            </div>

            <div
              className="mt-4 grid gap-2 sm:grid-cols-3"
              role="tablist"
              aria-label="Rescue tools"
            >
              {rescueToolTabs.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-label={tool.label}
                  aria-selected={activeTool === tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`min-h-20 rounded-lg border p-3 text-left transition ${
                    activeTool === tool.id
                      ? "border-moss bg-moss/10 text-ink shadow-sm"
                      : "border-line bg-surface text-muted hover:border-moss hover:text-ink"
                  }`}
                >
                  <span className="block font-semibold">{tool.label}</span>
                  <span className="mt-1 block text-xs leading-5">{tool.body}</span>
                </button>
              ))}
            </div>

            <div className="tool-surface mt-4">
              {activeTool === "repair" && (
                <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-ink">Repair check</h3>
                  <SignalPill
                    value={`${repairRelevance.score}% fit`}
                    tone={repairRelevance.score >= 45 ? "moss" : "quiet"}
                  />
                  {canPersonalize && (
                    <button
                      type="button"
                      onClick={() => setShowPersonalizer((current) => !current)}
                      className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-moss"
                    >
                      Personalize script
                    </button>
                  )}
                </div>
                <p className="safe-text mt-3 text-sm leading-6 text-muted">
                  {personalizedRepairScript}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {repairRelevance.reasons.slice(0, 3).map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-muted"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
                {canPersonalize && showPersonalizer && (
                  <div className="mt-4 grid gap-3 rounded-lg border border-line bg-surface p-3">
                    <label className="text-sm font-semibold text-ink">
                      Recipient name
                      <input
                        value={recipientName}
                        onChange={(event) => setRecipientName(event.target.value)}
                        className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                        placeholder="[Name]"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      Specific thing
                      <input
                        value={specificThing}
                        onChange={(event) => setSpecificThing(event.target.value)}
                        className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                        placeholder="[specific thing]"
                      />
                    </label>
                    <label className="text-sm font-semibold text-ink">
                      Time/date
                      <input
                        value={timeDate}
                        onChange={(event) => setTimeDate(event.target.value)}
                        className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                        placeholder="[time/date]"
                      />
                    </label>
                  </div>
                )}
                {canPersonalize && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void copyRepairScript()}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-moss"
                    >
                      <Clipboard className="h-4 w-4" aria-hidden="true" />
                      Copy script
                    </button>
                    {copyMessage && (
                      <span className="text-sm font-semibold text-mossDark">
                        {copyMessage}
                      </span>
                    )}
                  </div>
                )}
                </div>
              )}

              {activeTool === "unblock" && (
                <div>
                <h3 className="text-lg font-semibold text-ink">Unblock</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  What is missing? Pick the smallest honest blocker.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {missingItemOrder.map((missingItem) => (
                    <button
                      key={missingItem}
                      type="button"
                      onClick={() => void chooseMissingItem(missingItem)}
                      className={`min-h-10 rounded-lg border px-3 text-sm font-semibold transition ${
                        packet.missingItem === missingItem
                          ? "border-moss bg-moss text-white"
                          : "border-line bg-surface text-ink hover:border-moss"
                      }`}
                    >
                      {missingItemLabels[missingItem]}
                    </button>
                  ))}
                </div>
                <p className="safe-text mt-4 text-sm leading-6 text-muted">
                  Current: {missingItemLabels[packet.missingItem]}
                </p>
                </div>
              )}

              {activeTool === "exit" && (
                <div>
                <h3 className="text-lg font-semibold text-ink">Exit responsibly</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Renegotiate, defer, delegate, or abandon clearly.
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {exitStatusOrder.map((exitStatus) => (
                    <button
                      key={exitStatus}
                      type="button"
                      onClick={() => void chooseExitStatus(exitStatus)}
                      className={`min-h-10 rounded-lg border px-3 text-left text-sm font-semibold transition ${
                        packet.exitStatus === exitStatus
                          ? "border-clay bg-clay text-white"
                          : "border-line bg-surface text-ink hover:border-clay"
                      }`}
                    >
                      {exitStatusLabels[exitStatus]}
                    </button>
                  ))}
                </div>
                <p className="safe-text mt-4 text-sm leading-6 text-muted">
                  {packet.exitScript}
                </p>
                </div>
              )}
            </div>
          </Panel>
          </div>

          <DisclosurePanel
            title="Notes"
            summary="Capture only what moved or what is missing."
          >
            <label className="text-sm font-semibold text-ink" htmlFor="packet-notes">
              Note
            </label>
            <textarea
              id="packet-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => void onUpdatePacket(packet.id, { notes })}
              className="mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-surface p-3 text-base leading-7 text-ink"
              placeholder="What moved? What is missing?"
            />
          </DisclosurePanel>
        </div>

        <aside className="space-y-4">
          <DisclosurePanel title="Signal" summary="Quiet context. No score.">
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <Estimate label="Urgency" value={packet.urgency} />
              <Estimate label="Consequence" value={packet.consequence} />
              <Estimate label="Emotion" value={packet.emotionalLoad} />
              <Estimate label="Effort" value={packet.effort} />
            </dl>
            <div className="mt-4 space-y-3 text-sm">
              <Badge label="Task type" value={taskTypeLabels[packet.taskType]} />
              <Badge label="Likely block" value={blockLabels[packet.blockType]} />
              <Badge label="Confidence" value={`${confidencePercent}%`} />
              <Badge label="Mode" value={rescueModeLabels[packet.rescueMode]} />
              <Badge label="Support" value={supportLabels[packet.supportLevel]} />
              <Badge label="Status" value={statusLabels[packet.status]} />
            </div>
          </DisclosurePanel>

          <DisclosurePanel
            title="Packet controls"
            summary="Change status, support, or rescue mode deliberately."
          >
            <div className="rounded-lg border border-line bg-paper p-3">
              <p className="text-sm font-semibold text-ink">Support dial</p>
              <div className="mt-3 grid gap-2">
                {(["full_scaffold", "guided_scaffold", "light_nudge", "self_led"] as const).map(
                  (level) => (
                    <div
                      key={level}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                        packet.supportLevel === level
                          ? "border-moss bg-moss/10 text-mossDark"
                          : "border-line bg-surface text-muted"
                      }`}
                    >
                      {supportLabels[level]}
                    </div>
                  )
                )}
              </div>
            </div>

            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={packet.status}
              onChange={(event) =>
                void onChangeStatus(packet.id, event.target.value as Status)
              }
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
            >
              {statusOrder.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="mode">
              Rescue mode
            </label>
            <select
              id="mode"
              value={packet.rescueMode}
              onChange={(event) =>
                void onUpdatePacket(packet.id, {
                  rescueMode: event.target.value as RescueMode
                })
              }
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
            >
              {rescueModeOrder.map((mode) => (
                <option key={mode} value={mode}>
                  {rescueModeLabels[mode]}
                </option>
              ))}
            </select>

            {packet.supportLevel !== "full_scaffold" && (
              <div className="mt-4 rounded-lg border border-line bg-paper p-3 text-sm leading-6 text-muted">
                You've started this kind of task before. Choose the full breakdown or
                just the first move.
              </div>
            )}

            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => void onIncreaseSupport(packet.id)}
                disabled={!moreSupportAvailable}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 font-semibold text-ink transition hover:border-moss disabled:cursor-not-allowed disabled:text-muted"
              >
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                More scaffold
              </button>
              <button
                type="button"
                onClick={() => void onChangeStatus(packet.id, "done_enough")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 font-semibold text-ink transition hover:border-moss"
              >
                <Check className="h-5 w-5" aria-hidden="true" />
                Done enough
              </button>
              <button
                type="button"
                onClick={() => void chooseExitStatus("renegotiate")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 font-semibold text-ink transition hover:border-clay"
              >
                <Archive className="h-5 w-5" aria-hidden="true" />
                Exit responsibly
              </button>
            </div>
          </DisclosurePanel>
        </aside>
      </div>
    </Shell>
  );
}

function InfoPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="text-sm font-semibold text-muted">{title}</p>
      <p className="safe-text mt-2 leading-7 text-ink">{body}</p>
    </div>
  );
}

function DeepRescueComparison({
  currentPacket,
  previewPacket,
  onApply,
  onDismiss
}: {
  currentPacket: RescuePacket;
  previewPacket: RescuePacket;
  onApply: () => void;
  onDismiss: () => void;
}) {
  const rows = [
    {
      label: "Next physical action",
      current: currentPacket.firstPhysicalAction,
      preview: previewPacket.firstPhysicalAction
    },
    {
      label: "Real task",
      current: currentPacket.realTask,
      preview: previewPacket.realTask
    },
    {
      label: "Minimum progress",
      current: currentPacket.minimumViableProgress,
      preview: previewPacket.minimumViableProgress
    },
    {
      label: "Repair",
      current: currentPacket.repairScript,
      preview: previewPacket.repairScript
    }
  ];

  return (
    <div className="mt-4 rounded-lg border border-moss/30 bg-moss/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-mossDark">
            Deep Rescue comparison
          </p>
          <h3 className="mt-1 text-xl font-semibold text-ink">
            Review before applying.
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Nothing changed yet. Apply only if the proposed packet gives a clearer
            first move.
          </p>
        </div>
        <SignalPill
          value={`${Math.round(previewPacket.blockConfidence * 100)}% confidence`}
          tone="moss"
        />
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 rounded-lg border border-line bg-surface p-3 lg:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <p className="text-xs font-semibold uppercase text-muted">{row.label}</p>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">Current</p>
              <p className="safe-text mt-1 text-sm leading-6 text-ink">{row.current}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-moss">Proposed</p>
              <p className="safe-text mt-1 text-sm font-semibold leading-6 text-ink">
                {row.preview}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex min-h-11 items-center rounded-lg bg-moss px-4 font-semibold text-white transition hover:bg-mossDark"
        >
          Apply Deep Rescue
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 font-semibold text-ink transition hover:border-moss"
        >
          Keep local packet
        </button>
      </div>
    </div>
  );
}

function Estimate({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <dt className="text-xs font-semibold uppercase text-muted">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="safe-text mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recently";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric"
  }).format(date);
}

function getReentryReasons(packet: RescuePacket): string[] {
  const reasons: string[] = [];

  if (packet.consequence >= 4) reasons.push("high consequence");
  if (packet.urgency >= 4) reasons.push("time-sensitive");
  if (packet.effort <= 2) reasons.push("low effort entry");
  if (packet.blockType === "shame_fear" || packet.rescueMode === "repair") {
    reasons.push("repair available");
  }
  if (packet.missingItem !== "unknown") {
    reasons.push(`${missingItemLabels[packet.missingItem].toLowerCase()} named`);
  }

  reasons.push(`touched ${formatShortDate(packet.lastTouchedAt)}`);
  return reasons.slice(0, 4);
}

function ReentryTriageCard({
  packet,
  packets,
  rank,
  onOpenPacket,
  onReentryAction
}: {
  packet: RescuePacket;
  packets: RescuePacket[];
  rank: number;
  onOpenPacket: (packet: RescuePacket) => void;
  onReentryAction: (
    packet: RescuePacket,
    actionType: ReentryActionType
  ) => Promise<void>;
}) {
  const reentryState = detectReentryState(packet);
  const actions = generateReentryActions(packet, packets);
  const actionByType = new Map(actions.map((action) => [action.actionType, action]));
  const primaryActions: ReentryActionType[] = [
    "resume_first_move",
    "repair_this",
    "exit_responsibly"
  ];
  const reasons = getReentryReasons(packet);

  return (
    <article className="reentry-card relative flex h-full flex-col overflow-hidden rounded-lg border border-line/80 bg-surface/95 p-4 shadow-premium">
      <span className="absolute inset-y-4 left-0 w-1 rounded-r bg-moss/80" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SignalPill value={`Rescue ${rank}`} tone="ink" />
        <SignalPill value={reentryStateLabels[reentryState]} tone="moss" />
        <SignalPill value={statusLabels[packet.status]} />
      </div>

      <button
        type="button"
        onClick={() => onOpenPacket(packet)}
        className="mt-4 text-left"
      >
        <h3 className="safe-text text-2xl font-semibold leading-tight text-ink">
          {packet.title}
        </h3>
        <p className="safe-text mt-3 text-sm font-semibold uppercase text-moss">
          Next action
        </p>
        <p className="safe-text mt-1 text-base leading-7 text-ink">
          {packet.firstPhysicalAction}
        </p>
      </button>

      <div className="mt-4">
        <p className="text-sm font-semibold text-muted">Worth rescuing because</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {reasons.map((reason) => (
            <span
              key={reason}
              className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-muted"
            >
              {reason}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto grid gap-2 pt-5">
        {primaryActions.map((actionType) => {
          const action = actionByType.get(actionType);
          if (!action) return null;

          return (
            <button
              key={actionType}
              type="button"
              onClick={() => void onReentryAction(packet, actionType)}
              className={`rounded-lg border p-3 text-left transition hover:shadow-sm ${
                actionType === "resume_first_move"
                  ? "border-moss bg-moss text-white shadow-action hover:bg-mossDark"
                  : "border-line bg-paper text-ink hover:border-moss"
              }`}
            >
              <span className="block font-semibold">{action.label}</span>
              <span
                className={`safe-text mt-1 block text-sm leading-6 ${
                  actionType === "resume_first_move" ? "text-white/80" : "text-muted"
                }`}
              >
                {action.body}
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

function ReentryScreen({
  packets,
  onOpenPacket,
  onReentryAction
}: {
  packets: RescuePacket[];
  onOpenPacket: (packet: RescuePacket) => void;
  onReentryAction: (
    packet: RescuePacket,
    actionType: ReentryActionType
  ) => Promise<void>;
}) {
  const reentryList = generateSmartReentryList(packets);

  return (
    <Shell className="max-w-6xl py-8">
      <RescueBrief
        eyebrow="Re-entry"
        title="No explanation needed. Choose what is still possible."
        body="Top three rescue candidates. Pick one first move, repair what needs repair, or exit responsibly."
      />

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-ink">Most worth rescuing</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          {reentryList.length > 0 ? (
            reentryList.map((packet, index) => (
              <ReentryTriageCard
                key={packet.id}
                packet={packet}
                packets={packets}
                rank={index + 1}
                onOpenPacket={onOpenPacket}
                onReentryAction={onReentryAction}
              />
            ))
          ) : (
            <EmptyState
              title="Nothing needs re-entry right now."
              body="Still possible is the only standard here."
            />
          )}
        </div>
      </section>
    </Shell>
  );
}

function QualityLabScreen({
  meta,
  byokSettings,
  onRecordQualitySignal,
  onSaveQualityFixtures,
  onSaveQualityThresholds,
  onSaveQualityBaselines,
  onOpenSettings
}: {
  meta: Parameters<typeof generatePatternMap>[1];
  byokSettings: ByokSettings;
  onRecordQualitySignal: (
    signal: Omit<QualitySignal, "id" | "createdAt">
  ) => Promise<QualitySignal>;
  onSaveQualityFixtures: (fixtures: QualityFixture[]) => Promise<unknown>;
  onSaveQualityThresholds: (thresholds: QualityThresholds) => Promise<unknown>;
  onSaveQualityBaselines: (baselines: QualityBaseline[]) => Promise<unknown>;
  onOpenSettings: () => void;
}) {
  const fixtures = useMemo(
    () =>
      meta.qualityFixtures.length > 0
        ? meta.qualityFixtures
        : makeDefaultQualityFixtures(),
    [meta.qualityFixtures]
  );
  const [selectedFixtureId, setSelectedFixtureId] = useState(
    fixtures[0]?.id ?? ""
  );
  const selectedFixture =
    fixtures.find((fixture) => fixture.id === selectedFixtureId) ??
    fixtures[0]!;
  const [labInput, setLabInput] = useState(selectedFixture.messyInput);
  const [draftFixture, setDraftFixture] =
    useState<QualityFixture>(selectedFixture);
  const [deepPacket, setDeepPacket] = useState<RescuePacket | null>(null);
  const [deepConsentChecked, setDeepConsentChecked] = useState(false);
  const [batchConsentChecked, setBatchConsentChecked] = useState(false);
  const [isRunningDeepRescue, setIsRunningDeepRescue] = useState(false);
  const [isRunningBatchEval, setIsRunningBatchEval] = useState(false);
  const [batchComparisons, setBatchComparisons] = useState<
    Array<{
      fixture: QualityFixture;
      comparison: PacketQualityComparison;
    }>
  >([]);
  const [batchSummary, setBatchSummary] = useState<DeepRescueEvalSummary | null>(
    null
  );
  const [labMessage, setLabMessage] = useState<string | null>(null);
  const [labError, setLabError] = useState<string | null>(null);
  const [fixtureMessage, setFixtureMessage] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [signalChoice, setSignalChoice] =
    useState<QualitySignalChoice>("local_better");
  const [signalDimension, setSignalDimension] =
    useState<QualitySignalDimension>("next_action");
  const [signalNote, setSignalNote] = useState("");
  const [signalMessage, setSignalMessage] = useState<string | null>(null);
  const byokSummary = summarizeByokSettings(byokSettings);
  const deepRescueConfigured =
    byokSummary.hasApiKey &&
    Boolean(byokSettings.model.trim()) &&
    Boolean(byokSettings.endpoint.trim());
  const deepRescueAllowed =
    meta.llmConsent.externalLlmEnabled && Boolean(meta.llmConsent.consentedAt);

  useEffect(() => {
    const nextFixture =
      fixtures.find((fixture) => fixture.id === selectedFixtureId) ?? fixtures[0];
    if (!nextFixture) return;
    setDraftFixture(nextFixture);
    setLabInput(nextFixture.messyInput);
  }, [selectedFixtureId, fixtures]);

  const localPacket = useMemo(
    () => generateRescuePacket(labInput.trim() || selectedFixture.messyInput),
    [labInput, selectedFixture.messyInput]
  );
  const localScore = useMemo(
    () => scorePacketQuality(localPacket, selectedFixture, meta.qualityThresholds),
    [localPacket, meta.qualityThresholds, selectedFixture]
  );
  const deepScore = useMemo(
    () =>
      deepPacket
        ? scorePacketQuality(deepPacket, selectedFixture, meta.qualityThresholds)
        : null,
    [deepPacket, meta.qualityThresholds, selectedFixture]
  );
  const comparison = useMemo<PacketQualityComparison | null>(
    () =>
      deepPacket
        ? comparePacketQuality(
            localPacket,
            deepPacket,
            selectedFixture,
            meta.qualityThresholds
          )
        : null,
    [deepPacket, localPacket, meta.qualityThresholds, selectedFixture]
  );
  const fixtureScores = useMemo(
    () =>
      fixtures.map((fixture) => {
        const packet = generateRescuePacket(fixture.messyInput);
        return {
          fixture,
          packet,
          score: scorePacketQuality(packet, fixture, meta.qualityThresholds)
        };
      }),
    [fixtures, meta.qualityThresholds]
  );
  const regressionWatch = buildQualityRegressionWatch(
    fixtures,
    fixtureScores.map((item) => ({
      fixtureId: item.fixture.id,
      score: item.score.score
    })),
    meta.qualityBaselines
  );
  const signalSummary = summarizeQualitySignals(meta.qualitySignals);
  const rewriteSuggestions = generateRewriteSuggestions(localScore);

  function chooseFixture(fixture: GoldenRescueFixture) {
    setSelectedFixtureId(fixture.id);
    setLabInput(fixture.messyInput);
    setDraftFixture(fixture);
    setDeepPacket(null);
    setDeepConsentChecked(false);
    setLabMessage(null);
    setLabError(null);
    setSignalMessage(null);
  }

  function updateDraftFixture(updater: (fixture: QualityFixture) => QualityFixture) {
    setDraftFixture((current) => updater(current));
    setFixtureMessage(null);
  }

  function makeBlankFixture(): QualityFixture {
    const now = new Date().toISOString();
    return {
      id: `fixture-${Date.now()}`,
      title: "New rescue fixture",
      messyInput: "I need to...",
      whyItMatters: "This protects packet quality for a real stuck moment.",
      expected: {
        taskType: "unknown",
        blockType: "unknown",
        rescueMode: "start_tiny",
        repair: "not_needed",
        firstActionIncludes: [],
        planIncludes: []
      },
      source: "custom",
      createdAt: now,
      updatedAt: now
    };
  }

  async function saveDraftFixture() {
    const now = new Date().toISOString();
    const trimmedFixture: QualityFixture = {
      ...draftFixture,
      title: draftFixture.title.trim() || "Untitled fixture",
      messyInput: draftFixture.messyInput.trim(),
      whyItMatters:
        draftFixture.whyItMatters.trim() ||
        "This protects packet quality for a real stuck moment.",
      expected: {
        ...draftFixture.expected,
        firstActionIncludes: draftFixture.expected.firstActionIncludes
          .map((item) => item.trim())
          .filter(Boolean),
        planIncludes: (draftFixture.expected.planIncludes ?? [])
          .map((item) => item.trim())
          .filter(Boolean)
      },
      source: "custom",
      updatedAt: now
    };

    if (!trimmedFixture.messyInput) {
      setFixtureMessage("Add messy input before saving this fixture.");
      return;
    }

    const nextFixtures = fixtures.some((fixture) => fixture.id === trimmedFixture.id)
      ? fixtures.map((fixture) =>
          fixture.id === trimmedFixture.id ? trimmedFixture : fixture
        )
      : [trimmedFixture, ...fixtures];

    await onSaveQualityFixtures(nextFixtures);
    setSelectedFixtureId(trimmedFixture.id);
    setFixtureMessage("Fixture saved locally.");
  }

  async function startNewFixture() {
    const nextFixture = makeBlankFixture();
    setDraftFixture(nextFixture);
    setFixtureMessage("Draft fixture ready. Save when it is useful.");
  }

  async function resetStarterFixtures() {
    const nextFixtures = makeDefaultQualityFixtures();
    await onSaveQualityFixtures(nextFixtures);
    setSelectedFixtureId(nextFixtures[0]?.id ?? "");
    setFixtureMessage("Starter fixtures restored locally.");
  }

  async function updateThreshold(
    key: keyof QualityThresholds,
    value: boolean
  ) {
    await onSaveQualityThresholds({
      ...meta.qualityThresholds,
      [key]: value
    });
  }

  async function captureRegressionBaseline() {
    const baselines = makeQualityBaselines(
      fixtureScores.map((item) => ({
        fixtureId: item.fixture.id,
        score: item.score.score
      }))
    );
    await onSaveQualityBaselines(baselines);
    setLabMessage("Quality baseline captured locally.");
  }

  async function runDeepRescueComparison() {
    setLabError(null);
    setLabMessage(null);

    if (!deepRescueConfigured) {
      setLabError("Add a local BYOK provider before running Deep Rescue in the Lab.");
      return;
    }

    if (!deepRescueAllowed) {
      setLabError("Turn on external LLM consent in Settings first.");
      return;
    }

    if (!deepConsentChecked) {
      setLabError("Confirm this specific Lab input can leave the browser first.");
      return;
    }

    setIsRunningDeepRescue(true);

    try {
      const result = await generateRescuePacketWithAdapter(
        labInput.trim() || selectedFixture.messyInput,
        meta.llmConsent,
        createByokRescueAdapter(byokSettings),
        localPacket
      );
      setDeepPacket(result.packet);
      setLabMessage("Deep Rescue comparison ready. Nothing was saved as a packet.");
      setDeepConsentChecked(false);
    } catch (caught) {
      if (caught instanceof ExternalLlmConsentRequiredError) {
        setLabError("External LLM consent is off. Turn it on in Settings to compare.");
      } else if (caught instanceof ByokConfigurationError) {
        setLabError(caught.message);
      } else if (caught instanceof ExternalLlmRequestError) {
        setLabError(caught.message);
      } else {
        setLabError("Deep Rescue comparison could not complete.");
      }
    } finally {
      setIsRunningDeepRescue(false);
    }
  }

  async function runBatchDeepRescueEval() {
    setLabError(null);
    setLabMessage(null);
    setBatchSummary(null);
    setBatchComparisons([]);

    if (!deepRescueConfigured) {
      setLabError("Add a local BYOK provider before running batch Deep Rescue eval.");
      return;
    }

    if (!deepRescueAllowed) {
      setLabError("Turn on external LLM consent in Settings first.");
      return;
    }

    if (!batchConsentChecked) {
      setLabError("Confirm all fixture inputs can leave the browser for this eval.");
      return;
    }

    setIsRunningBatchEval(true);

    try {
      const adapter = createByokRescueAdapter(byokSettings);
      const comparisons: Array<{
        fixture: QualityFixture;
        comparison: PacketQualityComparison;
      }> = [];

      for (const fixture of fixtures) {
        const local = generateRescuePacket(fixture.messyInput);
        const result = await generateRescuePacketWithAdapter(
          fixture.messyInput,
          meta.llmConsent,
          adapter,
          local
        );
        comparisons.push({
          fixture,
          comparison: comparePacketQuality(
            local,
            result.packet,
            fixture,
            meta.qualityThresholds
          )
        });
      }

      setBatchComparisons(comparisons);
      setBatchSummary(
        summarizeDeepRescueEval(comparisons.map((item) => item.comparison))
      );
      setBatchConsentChecked(false);
      setLabMessage("Deep Rescue batch eval complete. Nothing was saved as a packet.");
    } catch (caught) {
      if (caught instanceof ExternalLlmConsentRequiredError) {
        setLabError("External LLM consent is off. Turn it on in Settings to compare.");
      } else if (caught instanceof ByokConfigurationError) {
        setLabError(caught.message);
      } else if (caught instanceof ExternalLlmRequestError) {
        setLabError(caught.message);
      } else {
        setLabError("Deep Rescue batch eval could not complete.");
      }
    } finally {
      setIsRunningBatchEval(false);
    }
  }

  async function saveSignal() {
    await onRecordQualitySignal({
      fixtureId: selectedFixture.id,
      input: labInput.trim() || selectedFixture.messyInput,
      choice: signalChoice,
      dimension: signalDimension,
      localScore: localScore.score,
      deepScore: deepScore?.score,
      note: signalNote.trim() || undefined
    });
    setSignalMessage("Quality signal saved locally.");
    setSignalNote("");
  }

  function exportQualityJson() {
    const payload = buildQualityExport(
      fixtures,
      meta.qualityThresholds,
      meta.qualityBaselines,
      meta.qualitySignals,
      fixtureScores.map((item) => ({
        fixtureId: item.fixture.id,
        title: item.fixture.title,
        score: item.score
      }))
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `scaffold-quality-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage("Quality export created.");
  }

  return (
    <Shell className="max-w-7xl py-8">
      <RescueBrief
        eyebrow="Rescue Quality Lab"
        title="Make packets sharper without vague AI fluff."
        body="Golden messy inputs, scored packet anatomy, optional Deep Rescue comparison, and local feedback signals. No text leaves the browser unless you explicitly run Deep Rescue."
        action={<SignalPill value={`${signalSummary.total} local signals`} tone="moss" />}
      />

      <section className="mt-6 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <Panel tone="paper" className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-moss">
                Golden fixtures
              </p>
              <h2 className="mt-1 text-xl font-semibold text-ink">
                Messy inputs worth protecting.
              </h2>
            </div>
            <SignalPill value={`${fixtures.length} fixtures`} />
          </div>
          <div className="mt-4 space-y-2">
            {fixtureScores.map(({ fixture, score }) => (
              <button
                key={fixture.id}
                type="button"
                onClick={() => chooseFixture(fixture)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  fixture.id === selectedFixture.id
                    ? "border-moss bg-moss/10"
                    : "border-line bg-surface hover:border-moss"
                }`}
              >
                <span className="safe-text block font-semibold text-ink">
                  {fixture.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted">
                  Local rules score {score.score}/100
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-line pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Fixture editor
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">
                  Edit the eval corpus.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => void startNewFixture()}
                className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink hover:border-moss"
              >
                New fixture
              </button>
            </div>
            <QualityFixtureEditor
              fixture={draftFixture}
              onChange={updateDraftFixture}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveDraftFixture()}
                className="inline-flex min-h-10 items-center rounded-lg bg-moss px-3 text-sm font-semibold text-white hover:bg-mossDark"
              >
                Save fixture
              </button>
              <button
                type="button"
                onClick={() => void resetStarterFixtures()}
                className="inline-flex min-h-10 items-center rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink hover:border-clay"
              >
                Reset starters
              </button>
            </div>
            {fixtureMessage && (
              <p className="mt-3 rounded-lg border border-line bg-surface p-3 text-sm font-semibold text-muted">
                {fixtureMessage}
              </p>
            )}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Lab input
                </p>
                <h2 className="safe-text mt-1 text-2xl font-semibold text-ink">
                  {selectedFixture.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  {selectedFixture.whyItMatters}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SignalPill value={taskTypeLabels[selectedFixture.expected.taskType]} />
                <SignalPill
                  value={blockLabels[selectedFixture.expected.blockType]}
                  tone="moss"
                />
              </div>
            </div>

            <label className="mt-5 block text-sm font-semibold text-ink" htmlFor="lab-input">
              Messy input
            </label>
            <textarea
              id="lab-input"
              value={labInput}
              onChange={(event) => {
                setLabInput(event.target.value);
                setDeepPacket(null);
                setLabMessage(null);
                setLabError(null);
              }}
              className="console-textarea mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-paper p-4 text-base leading-7 text-ink"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <SignalPill
                label="Expected repair"
                value={
                  selectedFixture.expected.repair === "needed"
                    ? "contextual"
                    : "not needed"
                }
                tone={selectedFixture.expected.repair === "needed" ? "moss" : "quiet"}
              />
              {selectedFixture.expected.rescueMode && (
                <SignalPill
                  label="Expected mode"
                  value={rescueModeLabels[selectedFixture.expected.rescueMode]}
                />
              )}
            </div>
          </Panel>

          <section className="grid gap-5 xl:grid-cols-2">
            <QualityThresholdsPanel
              thresholds={meta.qualityThresholds}
              onChange={(key, value) => void updateThreshold(key, value)}
            />
            <RegressionWatchPanel
              items={regressionWatch}
              baselines={meta.qualityBaselines}
              onCaptureBaseline={() => void captureRegressionBaseline()}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-2">
            <QualityPacketPanel
              title="Local rules packet"
              packet={localPacket}
              score={localScore}
              tone="local"
            />
            <QualityPacketPanel
              title="Deep Rescue packet"
              packet={deepPacket}
              score={deepScore}
              tone="deep"
              empty={
                <div>
                  <p className="font-semibold text-ink">Optional comparison.</p>
                  <p className="mt-2 leading-6">
                    Local rules stay default. Use Deep Rescue only when you want to
                    compare your BYOK adapter against the golden input.
                  </p>
                </div>
              }
            />
          </section>

          <Panel tone="paper">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Packet rewrite suggestions
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Fix the packet, not the person.
                </h2>
              </div>
              <ScoreBadge score={localScore} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {rewriteSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="rounded-lg border border-line bg-surface p-3 text-sm font-semibold leading-6 text-ink"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </Panel>

          <Panel tone="paper">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Deep Rescue comparison
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Compare before trusting.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  This sends only the Lab input to your selected provider when you
                  press the button below.
                </p>
              </div>
              <SignalPill value={byokSummary.providerLabel} tone="moss" />
            </div>

            {!deepRescueConfigured && (
              <div className="mt-4 rounded-lg border border-line bg-surface p-4 text-sm leading-6 text-muted">
                Add a provider, endpoint, model, and API key in Settings before
                running this comparison.
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-line bg-paper px-3 font-semibold text-ink hover:border-moss"
                >
                  Open Settings
                </button>
              </div>
            )}

            <label className="mt-4 flex gap-3 rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
              <input
                type="checkbox"
                checked={deepConsentChecked}
                onChange={(event) => setDeepConsentChecked(event.target.checked)}
                className="mt-1 h-4 w-4 accent-moss"
              />
              <span>
                I understand this Lab input will be sent to my selected provider if I
                run Deep Rescue.
              </span>
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void runDeepRescueComparison()}
                disabled={isRunningDeepRescue}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 font-semibold text-paper transition hover:bg-mossDark disabled:cursor-not-allowed disabled:bg-muted"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {isRunningDeepRescue ? "Comparing" : "Run Deep Rescue comparison"}
              </button>
              {comparison && (
                <SignalPill
                  value={
                    comparison.recommendation === "candidate"
                      ? "Deep scored clearer"
                      : comparison.recommendation === "local"
                        ? "Local scored clearer"
                        : "Scores are close"
                  }
                  tone="moss"
                />
              )}
            </div>

            {labMessage && (
              <p className="mt-3 rounded-lg border border-moss/30 bg-moss/10 p-3 text-sm font-semibold text-mossDark">
                {labMessage}
              </p>
            )}
            {labError && (
              <p className="mt-3 rounded-lg border border-clay/30 bg-clay/10 p-3 text-sm font-semibold text-clay">
                {labError}
              </p>
            )}

            {comparison && <QualityComparisonTable comparison={comparison} />}

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-moss">
                    Deep Rescue eval mode
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">
                    Compare across all fixtures.
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    Runs your BYOK adapter once per fixture and keeps the results in
                    this Lab session only.
                  </p>
                </div>
                {batchSummary && (
                  <SignalPill
                    value={`Deep improved ${batchSummary.improved}, local won ${batchSummary.localWon}, tied ${batchSummary.tied}`}
                    tone="moss"
                  />
                )}
              </div>
              <label className="mt-4 flex gap-3 rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
                <input
                  type="checkbox"
                  checked={batchConsentChecked}
                  onChange={(event) => setBatchConsentChecked(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-moss"
                />
                <span>
                  I understand all fixture inputs will be sent to my selected
                  provider for this eval run.
                </span>
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void runBatchDeepRescueEval()}
                  disabled={isRunningBatchEval}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 font-semibold text-ink transition hover:border-moss disabled:cursor-not-allowed disabled:text-muted"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {isRunningBatchEval ? "Running eval" : "Run all fixtures"}
                </button>
              </div>
              {batchComparisons.length > 0 && (
                <div className="mt-4 grid gap-2">
                  {batchComparisons.map(({ fixture, comparison: item }) => (
                    <div
                      key={fixture.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3"
                    >
                      <span className="safe-text font-semibold text-ink">
                        {fixture.title}
                      </span>
                      <span className="flex flex-wrap gap-2">
                        <SignalPill value={`Local ${item.local.score}`} />
                        <SignalPill value={`Deep ${item.candidate.score}`} />
                        <SignalPill
                          value={
                            item.recommendation === "candidate"
                              ? "Deep improved"
                              : item.recommendation === "local"
                                ? "Local won"
                                : "Tied"
                          }
                          tone={
                            item.recommendation === "tie" ? "quiet" : "moss"
                          }
                        />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Local feedback signals
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">
                  Teach the Lab what “better” means.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  Signals stay local and export with Scaffold JSON. They are not a
                  productivity score.
                </p>
              </div>
              <SignalPill value={`${signalSummary.total} saved`} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                Which packet helped more?
                <select
                  value={signalChoice}
                  onChange={(event) =>
                    setSignalChoice(event.target.value as QualitySignalChoice)
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                >
                  {qualityChoiceOrder.map((choice) => (
                    <option key={choice} value={choice}>
                      {qualitySignalChoiceLabels[choice]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-ink">
                What changed the decision?
                <select
                  value={signalDimension}
                  onChange={(event) =>
                    setSignalDimension(event.target.value as QualitySignalDimension)
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                >
                  {qualityDimensionOrder.map((dimension) => (
                    <option key={dimension} value={dimension}>
                      {qualitySignalDimensionLabels[dimension]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-ink">
              Note
              <textarea
                value={signalNote}
                onChange={(event) => setSignalNote(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-line bg-paper p-3 text-sm leading-6 text-ink"
                placeholder="Example: local action was more physical; Deep plan had a better stop rule."
              />
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void saveSignal()}
                className="inline-flex min-h-11 items-center rounded-lg bg-moss px-4 font-semibold text-white transition hover:bg-mossDark"
              >
                Save local signal
              </button>
              {signalMessage && (
                <p className="text-sm font-semibold text-mossDark">{signalMessage}</p>
              )}
            </div>

            <QualitySignalSummaryPanel summary={signalSummary} />

            <div className="mt-6 border-t border-line pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-moss">
                    Quality export
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">
                    Export the eval corpus.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Includes fixtures, thresholds, baselines, local scores, and
                    feedback signals. API keys are never included.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportQualityJson}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 font-semibold text-ink hover:border-moss"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export quality JSON
                </button>
              </div>
              {exportMessage && (
                <p className="mt-3 text-sm font-semibold text-mossDark">
                  {exportMessage}
                </p>
              )}
            </div>
          </Panel>
        </div>
      </section>
    </Shell>
  );
}

function splitFixtureFragments(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinFixtureFragments(value: string[] | undefined): string {
  return (value ?? []).join(", ");
}

function QualityFixtureEditor({
  fixture,
  onChange
}: {
  fixture: QualityFixture;
  onChange: (updater: (fixture: QualityFixture) => QualityFixture) => void;
}) {
  return (
    <div className="mt-4 grid gap-3">
      <label className="text-sm font-semibold text-ink">
        Fixture title
        <input
          value={fixture.title}
          onChange={(event) =>
            onChange((current) => ({ ...current, title: event.target.value }))
          }
          className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
        />
      </label>
      <label className="text-sm font-semibold text-ink">
        Fixture messy input
        <textarea
          value={fixture.messyInput}
          onChange={(event) =>
            onChange((current) => ({ ...current, messyInput: event.target.value }))
          }
          className="mt-1 min-h-24 w-full resize-y rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-ink"
        />
      </label>
      <label className="text-sm font-semibold text-ink">
        Why this matters
        <textarea
          value={fixture.whyItMatters}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              whyItMatters: event.target.value
            }))
          }
          className="mt-1 min-h-20 w-full resize-y rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-ink"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-ink">
          Expected task type
          <select
            value={fixture.expected.taskType}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                expected: {
                  ...current.expected,
                  taskType: event.target.value as QualityFixture["expected"]["taskType"]
                }
              }))
            }
            className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
          >
            {Object.entries(taskTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink">
          Expected block
          <select
            value={fixture.expected.blockType}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                expected: {
                  ...current.expected,
                  blockType: event.target.value as QualityFixture["expected"]["blockType"]
                }
              }))
            }
            className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
          >
            {Object.entries(blockLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink">
          Repair expectation
          <select
            value={fixture.expected.repair}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                expected: {
                  ...current.expected,
                  repair: event.target.value as QualityFixture["expected"]["repair"]
                }
              }))
            }
            className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
          >
            {Object.entries(qualityRepairExpectationLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-ink">
          Expected mode
          <select
            value={fixture.expected.rescueMode ?? ""}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                expected: {
                  ...current.expected,
                  rescueMode:
                    event.target.value === ""
                      ? undefined
                      : (event.target.value as QualityFixture["expected"]["rescueMode"])
                }
              }))
            }
            className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
          >
            <option value="">No strict mode</option>
            {Object.entries(rescueModeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-sm font-semibold text-ink">
        Expected action fragments
        <input
          value={joinFixtureFragments(fixture.expected.firstActionIncludes)}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              expected: {
                ...current.expected,
                firstActionIncludes: splitFixtureFragments(event.target.value)
              }
            }))
          }
          placeholder="thread, reply"
          className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
        />
      </label>
      <label className="text-sm font-semibold text-ink">
        Expected plan fragments
        <input
          value={joinFixtureFragments(fixture.expected.planIncludes)}
          onChange={(event) =>
            onChange((current) => ({
              ...current,
              expected: {
                ...current.expected,
                planIncludes: splitFixtureFragments(event.target.value)
              }
            }))
          }
          placeholder="whole room, stop before polishing"
          className="mt-1 min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink"
        />
      </label>
    </div>
  );
}

function QualityThresholdsPanel({
  thresholds,
  onChange
}: {
  thresholds: QualityThresholds;
  onChange: (key: keyof QualityThresholds, value: boolean) => void;
}) {
  const items: Array<{
    key: keyof QualityThresholds;
    label: string;
    body: string;
  }> = [
    {
      key: "nextActionMustBePhysical",
      label: "Next action must be physical",
      body: "The packet names something the user can touch, open, type, move, or read."
    },
    {
      key: "repairMustBeRelevant",
      label: "No repair unless relevant",
      body: "Repair appears only for another person, lateness, help, clarification, scope, or apology."
    },
    {
      key: "planMustBeBounded",
      label: "Plan must be bounded",
      body: "The 10-minute plan keeps scope small and protects the stop rule."
    },
    {
      key: "minimumProgressMustBeVisible",
      label: "Minimum progress must be visible",
      body: "Done enough describes a visible change, not effort or mood."
    },
    {
      key: "forbidVagueVerbs",
      label: "No vague verbs",
      body: "Avoid focus, work on, get organized, make progress, and similar fog."
    }
  ];

  return (
    <Panel tone="paper">
      <p className="text-xs font-semibold uppercase text-moss">
        Quality thresholds
      </p>
      <h2 className="mt-1 text-xl font-semibold text-ink">
        Define what “good rescue” means.
      </h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex gap-3 rounded-lg border border-line bg-surface p-3"
          >
            <input
              type="checkbox"
              checked={thresholds[item.key]}
              onChange={(event) => onChange(item.key, event.target.checked)}
              className="mt-1 h-4 w-4 accent-moss"
            />
            <span>
              <span className="block font-semibold text-ink">{item.label}</span>
              <span className="safe-text mt-1 block text-sm leading-6 text-muted">
                {item.body}
              </span>
            </span>
          </label>
        ))}
      </div>
    </Panel>
  );
}

function RegressionWatchPanel({
  items,
  baselines,
  onCaptureBaseline
}: {
  items: ReturnType<typeof buildQualityRegressionWatch>;
  baselines: QualityBaseline[];
  onCaptureBaseline: () => void;
}) {
  return (
    <Panel tone="paper">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">
            Regression watch
          </p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            Product quality only.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            This watches packet quality across fixtures. It is not a user score.
          </p>
        </div>
        <button
          type="button"
          onClick={onCaptureBaseline}
          className="inline-flex min-h-10 items-center rounded-lg bg-ink px-3 text-sm font-semibold text-paper hover:bg-mossDark"
        >
          Capture baseline
        </button>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase text-muted">
        {baselines.length > 0 ? `${baselines.length} baselines saved` : "No baseline yet"}
      </p>
      <div className="mt-4 grid gap-2">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.fixtureId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3"
          >
            <span className="safe-text font-semibold text-ink">{item.title}</span>
            <span className="flex flex-wrap gap-2">
              <SignalPill value={`Now ${item.currentScore}`} />
              <SignalPill
                value={
                  item.delta === undefined
                    ? "New"
                    : `${item.delta >= 0 ? "+" : ""}${item.delta}`
                }
                tone={
                  item.state === "improved"
                    ? "moss"
                    : item.state === "regressed"
                      ? "clay"
                      : "quiet"
                }
              />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function QualityPacketPanel({
  title,
  packet,
  score,
  tone,
  empty
}: {
  title: string;
  packet: RescuePacket | null;
  score: PacketQualityScore | null;
  tone: "local" | "deep";
  empty?: ReactNode;
}) {
  if (!packet || !score) {
    return (
      <Panel tone="paper" className="min-h-[320px]">
        <p className="text-xs font-semibold uppercase text-moss">{title}</p>
        <div className="mt-4 rounded-lg border border-dashed border-line bg-surface p-4 text-sm text-muted">
          {empty ?? "No packet yet."}
        </div>
      </Panel>
    );
  }

  return (
    <Panel className={tone === "local" ? "border-ink/20" : "border-moss/30"}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">{title}</p>
          <h2 className="safe-text mt-1 text-xl font-semibold text-ink">
            {packet.title}
          </h2>
        </div>
        <ScoreBadge score={score} />
      </div>
      <div className="mt-4 rounded-lg border border-ink bg-ink p-4 text-paper">
        <p className="text-xs font-semibold uppercase text-moss">
          Next physical action
        </p>
        <p className="safe-text mt-2 text-lg font-semibold leading-7">
          {packet.firstPhysicalAction}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SignalPill value={taskTypeLabels[packet.taskType]} />
        <SignalPill value={blockLabels[packet.blockType]} tone="moss" />
        <SignalPill value={rescueModeLabels[packet.rescueMode]} />
      </div>
      <div className="mt-4 grid gap-3">
        <InfoPanel title="Minimum viable progress" body={packet.minimumViableProgress} />
        <InfoPanel title="Repair output" body={packet.repairScript} />
      </div>
      <div className="mt-4 grid gap-3">
        {score.criteria.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 rounded-lg border border-line bg-paper/70 p-3"
          >
            <div>
              <p className="font-semibold text-ink">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
            </div>
            <span
              className={`flex-none rounded-full px-2.5 py-1 text-xs font-semibold ${
                item.passed
                  ? "bg-moss/10 text-mossDark"
                  : "bg-clay/10 text-clay"
              }`}
            >
              {item.passed ? "met" : "check"}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ScoreBadge({ score }: { score: PacketQualityScore }) {
  return (
    <div className="rounded-lg border border-line bg-paper px-4 py-3 text-right">
      <p className="text-xs font-semibold uppercase text-muted">Score</p>
      <p className="mt-1 text-3xl font-semibold text-ink">{score.score}</p>
      <p className="text-xs font-semibold capitalize text-mossDark">
        {score.label.replace("_", " ")}
      </p>
    </div>
  );
}

function QualityComparisonTable({
  comparison
}: {
  comparison: PacketQualityComparison;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-line bg-surface">
      <div className="grid gap-0 border-b border-line bg-paper px-4 py-3 text-xs font-semibold uppercase text-muted md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)_96px]">
        <span>Dimension</span>
        <span>Local</span>
        <span>Deep Rescue</span>
        <span>Signal</span>
      </div>
      {comparison.rows.map((row) => (
        <div
          key={row.label}
          className="grid gap-3 border-b border-line px-4 py-3 last:border-b-0 md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)_96px]"
        >
          <p className="text-sm font-semibold text-ink">{row.label}</p>
          <p className="safe-text text-sm leading-6 text-muted">{row.local}</p>
          <p className="safe-text text-sm leading-6 text-ink">{row.candidate}</p>
          <SignalPill
            value={
              row.winner === "candidate"
                ? "Deep"
                : row.winner === "local"
                  ? "Local"
                  : "Close"
            }
            tone={row.winner === "tie" ? "quiet" : "moss"}
          />
        </div>
      ))}
    </div>
  );
}

function QualitySignalSummaryPanel({
  summary
}: {
  summary: ReturnType<typeof summarizeQualitySignals>;
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-line bg-paper p-4">
        <p className="text-sm font-semibold text-ink">Choices</p>
        <div className="mt-3 space-y-2">
          {summary.byChoice.length > 0 ? (
            summary.byChoice.map((item) => (
              <div
                key={item.choice}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-muted">{item.label}</span>
                <span className="font-semibold text-ink">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted">No signals yet.</p>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-paper p-4">
        <p className="text-sm font-semibold text-ink">Decision points</p>
        <div className="mt-3 space-y-2">
          {summary.byDimension.length > 0 ? (
            summary.byDimension.map((item) => (
              <div
                key={item.dimension}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-muted">{item.label}</span>
                <span className="font-semibold text-ink">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted">No decision pattern yet.</p>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-paper p-4">
        <p className="text-sm font-semibold text-ink">Recent signals</p>
        <div className="mt-3 space-y-3">
          {summary.recentSignals.length > 0 ? (
            summary.recentSignals.map((signal) => (
              <div key={signal.id} className="rounded-lg border border-line bg-surface p-3">
                <p className="text-sm font-semibold text-ink">
                  {qualitySignalChoiceLabels[signal.choice]} /{" "}
                  {qualitySignalDimensionLabels[signal.dimension]}
                </p>
                {signal.note && (
                  <p className="safe-text mt-1 text-xs leading-5 text-muted">
                    {signal.note}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-muted">
              Save a signal after comparing packets.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PatternScreen({
  packets,
  meta,
  onUseSuggestion
}: {
  packets: RescuePacket[];
  meta: Parameters<typeof generatePatternMap>[1];
  onUseSuggestion: (suggestion: PatternActionSuggestion) => void;
}) {
  const patternMap = generatePatternMap(packets, meta);

  return (
    <Shell className="max-w-6xl py-8">
      <RescueBrief
        eyebrow="Pattern map"
        title="What helps you restart?"
        body="Patterns only. No score. No streaks. Use what is useful and ignore the rest."
      />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="Successful starts" value={patternMap.successfulStarts} />
        <Metric label="Repairs" value={patternMap.repairs} />
        <Metric label="Re-entries" value={patternMap.reentries} />
        <Metric label="Responsible exits" value={patternMap.responsibleExits} />
        <Metric label="Support faded" value={patternMap.supportFadingEvents} />
      </section>

      <Panel className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-moss">
              Suggested next moves
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Use a pattern without handing over the wheel.
            </h2>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {patternMap.actionSuggestions.length > 0 ? (
            patternMap.actionSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onUseSuggestion(suggestion)}
                className="rounded-lg border border-line bg-paper p-4 text-left hover:border-moss"
              >
                <span className="safe-text block text-lg font-semibold text-ink">
                  {suggestion.title}
                </span>
                <span className="safe-text mt-2 block text-sm leading-6 text-muted">
                  {suggestion.body}
                </span>
                <span className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-moss px-4 text-sm font-semibold text-white">
                  {suggestion.ctaLabel}
                </span>
              </button>
            ))
          ) : (
            <EmptyState
              title="A few rescues will turn this into starter suggestions."
              body="Nothing here is a grade."
            />
          )}
        </div>
      </Panel>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <PatternList
          title="Task types"
          items={patternMap.commonTaskTypes.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
        <PatternList
          title="Common blocks"
          items={patternMap.commonBlocks.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
        <PatternList
          title="Best rescue modes"
          items={patternMap.commonRescueModes.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
        <PatternList
          title="Usually missing"
          items={patternMap.commonMissingItems.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
        <PatternList
          title="Exit choices"
          items={patternMap.exitChoices.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
        <PatternList
          title="Rescue patterns that started"
          items={patternMap.successfulRescuePatterns.map((item) => ({
            label: item.label,
            count: item.count,
            detail: `${item.count} of ${item.total} sprint${
              item.total === 1 ? "" : "s"
            } started`
          }))}
        />
        <PatternList
          title="Tasks often avoided"
          items={patternMap.tasksMostOftenAvoided.map((item) => ({
            label: item.task,
            count: item.count
          }))}
        />
        <PatternList
          title="Start times"
          items={patternMap.timesOfDayStarts.map((item) => ({
            label: item.label,
            count: item.count
          }))}
        />
      </section>
    </Shell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line/80 bg-surface/90 p-4 shadow-sm">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}

function PatternList({
  title,
  items
}: {
  title: string;
  items: Array<{ label: string; count: number; detail?: string }>;
}) {
  return (
    <Panel className="p-5">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={`${item.label}-${item.count}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-line bg-paper/80 p-3"
            >
              <span className="safe-text font-medium text-ink">{item.label}</span>
              <span className="text-right">
                <span className="block rounded-full bg-surface px-3 py-1 text-sm font-semibold text-muted">
                  {item.count}
                </span>
                {item.detail && (
                  <span className="mt-1 block text-xs leading-5 text-muted">
                    {item.detail}
                  </span>
                )}
              </span>
            </div>
          ))
        ) : (
          <EmptyState title="More rescues will fill this in." />
        )}
      </div>
    </Panel>
  );
}

function SettingsScreen({
  meta,
  byokSettings,
  onExport,
  onImport,
  onSetExternalLlmConsent,
  onSaveByokSettings,
  onClearByokSettings,
  onOpenQualityLab,
  packetCount
}: {
  meta: Parameters<typeof generatePatternMap>[1];
  byokSettings: ByokSettings;
  onExport: () => Promise<unknown>;
  onImport: (raw: unknown) => Promise<unknown>;
  onSetExternalLlmConsent: (
    enabled: boolean,
    providerLabel?: string
  ) => Promise<unknown>;
  onSaveByokSettings: (settings: ByokSettings) => ByokSettings;
  onClearByokSettings: () => ByokSettings;
  onOpenQualityLab: () => void;
  packetCount: number;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [pendingImport, setPendingImport] = useState<{
    fileName: string;
    payload: ScaffoldExport;
  } | null>(null);
  const [draftByokSettings, setDraftByokSettings] =
    useState<ByokSettings>(byokSettings);

  useEffect(() => {
    setDraftByokSettings(byokSettings);
  }, [byokSettings]);

  const byokSummary = summarizeByokSettings(byokSettings);
  const healthItems = [
    {
      label: "Storage",
      value: "IndexedDB local",
      detail: "Packet history stays in this browser."
    },
    {
      label: "Packets",
      value: `${packetCount} local`,
      detail: packetCount === 0 ? "Nothing stored yet." : "Ready for export."
    },
    {
      label: "External text",
      value: meta.llmConsent.externalLlmEnabled ? "Consent on" : "Consent off",
      detail: meta.llmConsent.externalLlmEnabled
        ? "Deep Rescue still asks before sending packet text."
        : "No packet text can leave by default."
    },
    {
      label: "API keys",
      value: byokSummary.hasApiKey ? "Stored locally" : "None stored",
      detail: "JSON export never includes API keys."
    }
  ];

  async function handleExport() {
    const payload = await onExport();
    downloadJsonPayload(payload, "scaffold-export");
    setMessage("Export created.");
  }

  async function handleImportPreview(file: File | undefined) {
    if (!file) return;

    try {
      const text = await file.text();
      const payload = parseImportPayload(JSON.parse(text));
      setPendingImport({
        fileName: file.name,
        payload
      });
      setMessage("Import preview ready. Review before replacing local data.");
    } catch (caught) {
      setPendingImport(null);
      setMessage(caught instanceof Error ? caught.message : "Import preview failed.");
    }
  }

  async function confirmImport() {
    if (!pendingImport) return;

    try {
      await onImport(pendingImport.payload);
      setMessage(
        `Import complete. ${pendingImport.payload.packets.length} packet${
          pendingImport.payload.packets.length === 1 ? "" : "s"
        } restored locally.`
      );
      setPendingImport(null);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Import did not complete.");
    }
  }

  async function handleExternalLlmConsent(enabled: boolean) {
    setIsSavingConsent(true);
    try {
      await onSetExternalLlmConsent(
        enabled,
        providerLabelFromSettings(byokSettings)
      );
      setMessage(
        enabled
          ? "External LLM consent recorded locally. Deep Rescue still asks before sending packet text."
          : "External LLM consent revoked locally."
      );
    } finally {
      setIsSavingConsent(false);
    }
  }

  function updateDraftProvider(provider: ByokProvider) {
    setDraftByokSettings((current) => ({
      ...current,
      provider,
      model: defaultModelForProvider(provider),
      endpoint: defaultEndpointForProvider(provider)
    }));
  }

  function handleSaveByok() {
    const saved = onSaveByokSettings(draftByokSettings);
    setDraftByokSettings(saved);
    setMessage("BYOK settings saved locally. API keys are not included in export.");
  }

  function handleClearByok() {
    const cleared = onClearByokSettings();
    setDraftByokSettings(cleared);
    setMessage("BYOK settings cleared from this browser.");
  }

  return (
    <Shell className="max-w-4xl py-8">
      <RescueBrief
        eyebrow="Settings"
        title="Local rescue vault"
        body="Stored in this browser using IndexedDB. No cloud account is required, and external processing stays off unless you choose it."
      />

      <Panel tone="ink" className="mt-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-paper/65">Privacy posture</p>
            <h2 className="mt-2 text-3xl font-semibold text-paper">
              Local rescue first.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-paper/75">
              Scaffold keeps packet history, stuck drafts, and BYOK settings in
              this browser. Export is explicit. Import previews before overwrite.
            </p>
          </div>
          <SignalPill value="No account required" tone="moss" />
        </div>
      </Panel>

      <Panel className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-moss">
              Developer lab
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              Rescue Quality Lab
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Golden fixtures, local feedback, and regression checks. Hidden from
              the main rescue path.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenQualityLab}
            className="secondary-action inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 text-sm font-semibold text-ink transition hover:border-moss"
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Open Rescue Quality Lab
          </button>
        </div>
      </Panel>

      <Panel className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-moss">
              Local data health
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">
              What is stored here?
            </h2>
          </div>
          <SignalPill value={`Updated ${formatShortDate(meta.updatedAt)}`} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {healthItems.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-line bg-paper/80 p-4"
            >
              <p className="text-xs font-semibold uppercase text-muted">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-6">
        <div>
          <p className="text-xs font-semibold uppercase text-moss">
            Portability
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">
            Export or restore local rescue data.
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <PrimaryAction onClick={() => void handleExport()} className="text-lg">
            <Download className="h-5 w-5" aria-hidden="true" />
            Export JSON
          </PrimaryAction>

          <label className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-paper px-5 text-lg font-semibold text-ink">
            <Upload className="h-5 w-5" aria-hidden="true" />
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(event) => {
                const input = event.currentTarget;
                void handleImportPreview(input.files?.[0]).finally(() => {
                  input.value = "";
                });
              }}
            />
          </label>
        </div>

        {pendingImport && (
          <div className="mt-5 rounded-lg border border-clay/35 bg-clay/10 p-4">
            <div className="flex items-start gap-3">
              <FileJson className="mt-1 h-5 w-5 flex-none text-clay" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  Review import before overwrite
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {pendingImport.fileName} contains {pendingImport.payload.packets.length} packet
                  {pendingImport.payload.packets.length === 1 ? "" : "s"} exported{" "}
                  {formatShortDate(pendingImport.payload.exportedAt)}. Import will
                  replace the {packetCount} packet{packetCount === 1 ? "" : "s"} currently
                  stored in this browser.
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  API keys are not part of Scaffold JSON exports, so this will not
                  import or overwrite BYOK keys.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void confirmImport()}
                    className="inline-flex min-h-11 items-center rounded-lg bg-clay px-4 font-semibold text-white transition hover:bg-clay/90"
                  >
                    Replace local data
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingImport(null)}
                    className="inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 font-semibold text-ink transition hover:border-moss"
                  >
                    Cancel import
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-line bg-paper/80 p-4">
          <p className="mt-3 text-sm leading-6 text-muted">
            Scaffold does not diagnose, treat, or make clinical claims.
          </p>
        </div>
      </Panel>

      <Panel className="mt-6">
        <div className="rounded-lg border border-line bg-paper/80 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 flex-none text-moss" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-ink">LLM adapter</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Scaffold uses local rules by default. Deep Rescue is optional BYOK:
                you supply the key, it stays in this browser, and packet text leaves
                only when you explicitly run Deep Rescue.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 rounded-lg border border-line bg-surface p-3">
            <label className="text-sm font-semibold text-ink">
              Provider
              <select
                value={draftByokSettings.provider}
                onChange={(event) =>
                  updateDraftProvider(event.target.value as ByokProvider)
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
              >
                <option value="openai">{labelForProvider("openai")}</option>
                <option value="anthropic">{labelForProvider("anthropic")}</option>
                <option value="custom_openai">
                  {labelForProvider("custom_openai")}
                </option>
              </select>
            </label>

            <label className="text-sm font-semibold text-ink">
              API key
              <input
                type="password"
                value={draftByokSettings.apiKey}
                onChange={(event) =>
                  setDraftByokSettings((current) => ({
                    ...current,
                    apiKey: event.target.value
                  }))
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                placeholder="Stored locally only"
              />
            </label>

            <label className="text-sm font-semibold text-ink">
              Model
              <input
                value={draftByokSettings.model}
                onChange={(event) =>
                  setDraftByokSettings((current) => ({
                    ...current,
                    model: event.target.value
                  }))
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
              />
            </label>

            <label className="text-sm font-semibold text-ink">
              Endpoint
              <input
                value={draftByokSettings.endpoint}
                onChange={(event) =>
                  setDraftByokSettings((current) => ({
                    ...current,
                    endpoint: event.target.value
                  }))
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-ink"
                placeholder="Required for custom endpoints"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSaveByok}
                className="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 font-semibold text-white transition hover:bg-ink/90"
              >
                Save BYOK settings
              </button>
              <button
                type="button"
                onClick={handleClearByok}
                className="inline-flex min-h-11 items-center rounded-lg border border-line bg-paper px-4 font-semibold text-ink transition hover:border-clay"
              >
                Clear local key
              </button>
            </div>

            <p className="text-sm leading-6 text-muted">
              Stored provider: {byokSummary.providerLabel}. Key present:{" "}
              {byokSummary.hasApiKey ? "yes" : "no"}. JSON export never includes
              API keys. Some providers may block direct browser requests; a custom
              OpenAI-compatible local endpoint can be used later without changing
              packet storage.
            </p>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-surface p-3">
            <input
              type="checkbox"
              checked={meta.llmConsent.externalLlmEnabled}
              disabled={isSavingConsent}
              onChange={(event) =>
                void handleExternalLlmConsent(event.currentTarget.checked)
              }
              className="mt-1 h-5 w-5 accent-moss"
            />
            <span>
              <span className="block font-semibold text-ink">
                Allow task text to be sent to an external LLM adapter if one is connected.
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted">
                Current mode: {meta.llmConsent.providerLabel}
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted">
                Deep Rescue will still ask before sending packet text.
              </span>
            </span>
          </label>
        </div>

        {message && (
          <p className="mt-4 rounded-lg border border-line bg-paper p-3 text-sm font-semibold text-ink">
            {message}
          </p>
        )}
      </Panel>
    </Shell>
  );
}
