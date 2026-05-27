import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Archive,
  Check,
  Clipboard,
  Download,
  FileJson,
  Map,
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
  ScriptCard,
  Shell,
  SignalPill
} from "./components/design";
import { generatePatternMap } from "./engine/patternMap";
import {
  detectReentryState,
  generateReentryActions,
  generateSmartReentryList
} from "./engine/reentryEngine";
import {
  generateExitResponsiblyScript,
  increaseSupportLevel
} from "./engine/rescueEngine";
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
  createByokRescueAdapter
} from "./llm/rescueAdapter";
import {
  blockLabels,
  exitStatusLabels,
  missingItemLabels,
  reentryStateLabels,
  rescueModeLabels,
  statusLabels,
  supportLabels,
  taskTypeLabels,
  type ExitResponsibilityStatus,
  type MissingItemType,
  type PatternActionSuggestion,
  type ReentryActionType,
  type RescueMode,
  type RescuePacket,
  type SprintOutcome,
  type Status
} from "./types";

type Screen = "home" | "packet" | "sprint" | "reentry" | "patterns" | "settings";

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

const navButtonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition";

const starterPrompts = [
  "I need to start my assignment and I don't know where to start.",
  "I need to reply to this email but I feel ashamed it is late.",
  "I have too many things and I am frozen.",
  "I need to clean but the room feels too big.",
  "I am bored and I keep scrolling."
];

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
    deepRescuePacket,
    updateExternalLlmConsent,
    exportLocalData,
    importLocalData
  } = useScaffoldData();
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedPacketId, setSelectedPacketId] = useState<string | null>(null);
  const [stuckText, setStuckText] = useState("");
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

  useEffect(() => {
    if (selectedPacketId && !selectedPacket) {
      setSelectedPacketId(null);
      setScreen("home");
    }
  }, [selectedPacket, selectedPacketId]);

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
    <div className="paper-field min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
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

          <nav className="flex flex-wrap gap-2" aria-label="Primary">
            <NavButton
              active={screen === "home" || screen === "packet" || screen === "sprint"}
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
              icon={<Map className="h-4 w-4" aria-hidden="true" />}
              label="Pattern Map"
              onClick={() => setScreen("patterns")}
            />
            <NavButton
              active={screen === "settings"}
              icon={<Settings className="h-4 w-4" aria-hidden="true" />}
              label="Settings"
              onClick={() => setScreen("settings")}
            />
          </nav>
        </div>
      </header>

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
          stuckText={stuckText}
          isListening={isListening}
          starterMessage={patternStarterMessage}
          onTextChange={(value) => {
            setStuckText(value);
            if (patternStarterMessage) setPatternStarterMessage(null);
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
          onDeepRescue={(packetId) =>
            deepRescuePacket(packetId, createByokRescueAdapter(byokSettings))
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

      {screen === "settings" && (
        <SettingsScreen
          meta={meta}
          byokSettings={byokSettings}
          onExport={exportLocalData}
          onImport={importLocalData}
          onSetExternalLlmConsent={updateExternalLlmConsent}
          onSaveByokSettings={handleSaveByokSettings}
          onClearByokSettings={handleClearByokSettings}
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
          : "border border-line/80 bg-surface/90 text-ink hover:border-moss"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function HomeScreen({
  activeCount,
  packets,
  stuckText,
  isListening,
  starterMessage,
  onTextChange,
  onCreatePacket,
  onListen,
  onOpenPacket
}: {
  activeCount: number;
  packets: RescuePacket[];
  stuckText: string;
  isListening: boolean;
  starterMessage: string | null;
  onTextChange: (value: string) => void;
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

  return (
    <main>
      <Shell className="pb-3">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Panel className="relative overflow-hidden p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  No explanation needed.
                </p>
                <h1 className="safe-text mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                  What is worth rescuing?
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
                  Drop the messy version. Scaffold turns it into one next physical
                  action, a short rescue plan, and a repair option only when repair
                  is actually relevant.
                </p>
              </div>
              <SignalPill value="Local-first" tone="moss" />
            </div>

            <div className="mt-7 rounded-lg border border-line/80 bg-paper/70 p-3 sm:p-4">
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
                className="console-textarea mt-3 min-h-44 w-full resize-y rounded-lg border border-line bg-surface p-4 text-lg leading-8 text-ink placeholder:text-muted/70"
                placeholder="I need to reply to this email but I feel ashamed it is late."
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onTextChange(prompt)}
                  className="rounded-full border border-line/80 bg-paper/80 px-3 py-2 text-left text-xs font-semibold text-muted transition hover:border-moss hover:text-ink"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                className="inline-flex min-h-14 items-center gap-2 rounded-lg border border-line bg-surface px-5 text-base font-semibold text-ink transition hover:border-moss disabled:cursor-not-allowed disabled:text-muted"
              >
                <Mic className="h-5 w-5" aria-hidden="true" />
                {isListening ? "Listening" : "Speak"}
              </button>
            </div>
          </Panel>

          <Panel tone="ink" className="p-5 sm:p-6">
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
        </div>
      </Shell>

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

function PacketDetail({
  packet,
  meta,
  byokSettings,
  onBack,
  onStartSprint,
  onUpdatePacket,
  onChangeStatus,
  onIncreaseSupport,
  onDeepRescue,
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
  onDeepRescue: (packetId: string) => Promise<{ packet: RescuePacket } | null>;
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
  const [deepRescueMessage, setDeepRescueMessage] = useState<string | null>(null);
  const [deepRescueError, setDeepRescueError] = useState<string | null>(null);
  const [isDeepRescuing, setIsDeepRescuing] = useState(false);

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
    setDeepRescueMessage(null);
    setDeepRescueError(null);
  }, [packet.id]);

  const moreSupportAvailable =
    increaseSupportLevel(packet.supportLevel) !== packet.supportLevel;
  const confidencePercent = Math.round(packet.blockConfidence * 100);
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
      const result = await onDeepRescue(packet.id);
      if (result) {
        setDeepRescueMessage("Deep Rescue updated this packet. Local rescue remains available.");
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

  return (
    <Shell className="max-w-6xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface/90 px-4 text-sm font-semibold text-ink shadow-sm transition hover:border-moss"
      >
        Back to packets
      </button>

      <RescueBrief
        eyebrow="Next physical action"
        title={packet.firstPhysicalAction}
        body={
          <>
            <span className="font-semibold text-ink">{packet.title}</span>
            <span className="block">{packet.originalText}</span>
          </>
        }
        action={
          <PrimaryAction onClick={onStartSprint} className="min-h-12">
            <Play className="h-5 w-5" aria-hidden="true" />
            Start rescue sprint
          </PrimaryAction>
        }
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
              <SignalPill label="Support" value={supportLabels[packet.supportLevel]} />
              <SignalPill label="Status" value={statusLabels[packet.status]} tone="clay" />
            </div>
          </Panel>

          <Panel tone="paper">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-moss">
                  Deep Rescue
                </p>
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
            {deepRescueError && (
              <p className="mt-3 rounded-lg border border-clay/30 bg-clay/10 p-3 text-sm font-semibold text-clay">
                {deepRescueError}
              </p>
            )}
          </Panel>

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

          <section className="grid gap-4 md:grid-cols-2">
            <ScriptCard
              title="Repair option"
              actions={
                canPersonalize ? (
                  <button
                    type="button"
                    onClick={() => setShowPersonalizer((current) => !current)}
                    className="min-h-10 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink transition hover:border-moss"
                  >
                    Personalize script
                  </button>
                ) : undefined
              }
            >
              <p>{personalizedRepairScript}</p>
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
            </ScriptCard>
            <ModePanel mode={packet.rescueMode} />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <Panel tone="paper" className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-ink">Unblock</h2>
              <p className="mt-2 text-sm leading-6 text-muted">What is missing?</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {missingItemOrder.map((missingItem) => (
                  <button
                    key={missingItem}
                    type="button"
                    onClick={() => void chooseMissingItem(missingItem)}
                    className={`min-h-10 rounded-lg border px-3 text-sm font-semibold ${
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
            </Panel>

            <Panel tone="paper" className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-ink">Exit responsibly</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Renegotiate, defer, delegate, or abandon clearly.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {exitStatusOrder.map((exitStatus) => (
                  <button
                    key={exitStatus}
                    type="button"
                    onClick={() => void chooseExitStatus(exitStatus)}
                    className={`min-h-10 rounded-lg border px-3 text-left text-sm font-semibold ${
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
            </Panel>
          </section>

          <Panel tone="paper">
            <label className="text-sm font-semibold text-ink" htmlFor="packet-notes">
              Notes
            </label>
            <textarea
              id="packet-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => void onUpdatePacket(packet.id, { notes })}
              className="mt-2 min-h-28 w-full resize-y rounded-lg border border-line bg-surface p-3 text-base leading-7 text-ink"
              placeholder="What moved? What is missing?"
            />
          </Panel>
        </div>

        <aside className="space-y-4">
          <Panel>
            <h2 className="text-lg font-semibold text-ink">Signal</h2>
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
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold text-ink">Packet controls</h2>
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
          </Panel>
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

function ModePanel({ mode }: { mode: RescueMode }) {
  const content: Record<RescueMode, string> = {
    start_tiny: "Find the 30-second to 2-minute version. Stop before the task expands.",
    make_it_ugly: "Use rough bullets, placeholders, and bad draft energy. Polish is not the entry fee.",
    repair: "Send the brief accountable version. No extra confession. No disappearing.",
    body_double: "Keep the timer visible. Let the panel stay with you while you do the first move.",
    unblock:
      "Name the missing piece: information, materials, decision, energy, courage, time, or permission.",
    exit_responsibly:
      "Renegotiate, defer, delegate, or abandon clearly. Name who needs to know and what you can offer."
  };

  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <h2 className="text-lg font-semibold text-ink">{rescueModeLabels[mode]}</h2>
      <p className="safe-text mt-3 leading-7 text-muted">{content[mode]}</p>
    </div>
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
        title="No explanation needed. Let's rescue what matters."
        body="No explanation needed. Choose what is still possible."
      />

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-ink">Most worth rescuing</h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-3">
          {reentryList.length > 0 ? (
            reentryList.map((packet) => {
              const reentryState = detectReentryState(packet);
              const actions = generateReentryActions(packet, packets);

              return (
                <article key={packet.id} className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <SignalPill
                      value={reentryStateLabels[reentryState]}
                      tone="moss"
                    />
                    <SignalPill
                      value={`${packet.reentryHistory.length} re-entry action${
                        packet.reentryHistory.length === 1 ? "" : "s"
                      }`}
                    />
                  </div>
                  <PacketCard packet={packet} onOpen={onOpenPacket} />
                  <div className="grid gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.actionType}
                        type="button"
                        onClick={() =>
                          void onReentryAction(packet, action.actionType)
                        }
                        className="rounded-lg border border-line bg-surface/90 p-3 text-left transition hover:border-moss hover:shadow-sm"
                      >
                        <span className="block font-semibold text-ink">
                          {action.label}
                        </span>
                        <span className="safe-text mt-1 block text-sm leading-6 text-muted">
                          {action.body}
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })
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
  packetCount: number;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [draftByokSettings, setDraftByokSettings] =
    useState<ByokSettings>(byokSettings);

  useEffect(() => {
    setDraftByokSettings(byokSettings);
  }, [byokSettings]);

  const byokSummary = summarizeByokSettings(byokSettings);

  async function handleExport() {
    const payload = await onExport();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `scaffold-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Export created.");
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;

    const confirmed = window.confirm(
      "Import will replace the current local Scaffold data in this browser. Continue?"
    );
    if (!confirmed) return;

    try {
      const text = await file.text();
      await onImport(JSON.parse(text));
      setMessage("Import complete.");
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
        title="Local data"
        body="Stored in this browser using IndexedDB. No cloud account is required."
      />

      <Panel className="mt-6">
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
              onChange={(event) => void handleImport(event.target.files?.[0])}
            />
          </label>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-paper/80 p-4">
          <div className="flex items-center gap-3">
            <FileJson className="h-5 w-5 text-moss" aria-hidden="true" />
            <p className="font-semibold text-ink">{packetCount} local packets</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Scaffold does not diagnose, treat, or make clinical claims.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-line bg-paper/80 p-4">
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
