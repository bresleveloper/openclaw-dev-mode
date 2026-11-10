import "./types-D7I_F5Ux.js";
import { Ew as RealtimeVoiceProviderPlugin, Gw as RealtimeVoiceAudioClearReason, Jw as RealtimeVoiceBridgeCallbacks, Kw as RealtimeVoiceBargeInOptions, Xw as RealtimeVoiceBridgeEvent, Yw as RealtimeVoiceBridgeCreateRequest, eT as RealtimeVoiceProviderCapabilities, iT as RealtimeVoiceToolCallEvent, nT as RealtimeVoiceRole, qw as RealtimeVoiceBridge, tT as RealtimeVoiceResponseOutcome } from "./config-contracts-CY87ANNp.js";
import { C as TalkEvent, T as TalkEventInput, w as TalkEventContext } from "./diagnostic-events-CMrJXSRl.js";
//#region src/talk/provider-internal.d.ts
type InternalRealtimeVoiceProviderCapabilities = RealtimeVoiceProviderCapabilities & {
  /** Dynamic voice choices for the effective route without exposing its model identifier. */
  voices?: readonly string[];
  /** Treat absent configured voices as unsupported and fall back to the provider default. */
  voiceSelectionPolicy?: "allowlist-default";
  /** Model-specific voice choices; the provider's voices remain the default catalog. */
  voicesByModel?: Record<string, readonly string[]>;
  /** The provider owns agent delegation instead of exposing client-side function tools. */
  handlesAgentConsult?: boolean;
  /** The provider can keep browser media direct while exposing its control wire to Gateway. */
  supportsGatewayControl?: boolean;
};
//#endregion
//#region src/talk/talk-session-controller.d.ts
type TalkTurnFailureReason = "no_active_turn" | "stale_turn";
type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};
type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};
type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;
type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};
type TalkSessionController = {
  readonly activeTurnId: string | undefined;
  readonly context: TalkEventContext;
  readonly outputAudioActive: boolean;
  readonly recentEvents: readonly TalkEvent[];
  clearActiveTurn(): void;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  startTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  endTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  cancelTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  finishOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEvent | undefined;
  startOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
};
//#endregion
//#region src/talk/forced-consult-coordinator.d.ts
/** Timer abstraction used so tests can inject deterministic fake timers. */
type RealtimeVoiceForcedConsultTimer = {
  clear(): void;
};
/** Coordinator tuning and injectable clock/timer/matcher hooks. */
type RealtimeVoiceForcedConsultCoordinatorOptions = {
  limit?: number;
  /** Window for matching late native consults to forced consult handles. */
  nativeDedupeMs?: number;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => RealtimeVoiceForcedConsultTimer;
  questionsMatch?: (left: string | undefined, right: string | undefined) => boolean;
};
/** Stable handle for one forced consult lifecycle. */
type RealtimeVoiceForcedConsultHandle<TContext = unknown> = {
  id: string;
  question: string;
  context?: TContext;
};
/** Classification of a native provider consult relative to forced consult state. */
type RealtimeVoiceForcedConsultNativeMatch<TContext = unknown> = {
  kind: "none";
  question?: string;
} | {
  kind: "pending";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "in_flight";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "already_delivered";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
};
type RealtimeVoiceForcedConsultNativeRecentOptions = {
  /** Treat native calls without readable questions as recent generic consults. */
  allowUnknownQuestion?: boolean;
};
/** Public state machine for forced/native consult dedupe in a voice session. */
type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = ReturnType<typeof createRealtimeVoiceForcedConsultCoordinator<TContext>>;
/** Create an in-memory forced-consult coordinator for one realtime session. */
declare function createRealtimeVoiceForcedConsultCoordinator<TContext = unknown>(options?: RealtimeVoiceForcedConsultCoordinatorOptions): {
  prepare(question: string, prepareOptions?: {
    context?: TContext;
    id?: string;
  }): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  schedule(handle: RealtimeVoiceForcedConsultHandle<TContext>, delayMs: number, run: (handle: RealtimeVoiceForcedConsultHandle<TContext>) => void): void;
  clearPending(): void;
  consumePending(question?: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  cancelPending(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  recordNativeConsult(args: unknown, nativeCallId?: string): RealtimeVoiceForcedConsultNativeMatch<TContext>;
  markStarted(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markDelivered(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  isCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): boolean;
  nativeCallIds(handle: RealtimeVoiceForcedConsultHandle<TContext>): readonly string[];
  handles(): readonly RealtimeVoiceForcedConsultHandle<TContext>[];
  rememberQuestion(handle: RealtimeVoiceForcedConsultHandle<TContext>, question: string): void;
  findRecent(question: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  hasRecent(question: string): boolean;
  hasRecentNativeConsult(question: string, recentOptions?: RealtimeVoiceForcedConsultNativeRecentOptions): boolean;
  remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  clear(): void;
};
//#endregion
//#region src/talk/output-activity-tracker.d.ts
/**
 * Realtime voice output activity counters and playback-state tracking.
 *
 * Providers use this to decide whether assistant output is active,
 * interruptible, or overdue relative to the audio duration already emitted.
 */
type RealtimeVoiceOutputActivityTrackerOptions = {
  /** Injectable clock for deterministic tests and playback watchdog math. */
  now?: () => number;
};
/** One output activity increment from source audio and/or sink audio. */
type RealtimeVoiceOutputActivityDelta = {
  audioMs?: number;
  sourceAudioBytes?: number;
  sinkAudioBytes?: number;
};
/** Mutable tracker for one realtime voice output stream. */
type RealtimeVoiceOutputActivityTracker = ReturnType<typeof createRealtimeVoiceOutputActivityTracker>;
/** Create a fresh output activity tracker for a realtime voice session. */
declare function createRealtimeVoiceOutputActivityTracker(options?: RealtimeVoiceOutputActivityTrackerOptions): {
  markStreamOpened(): void;
  markStreamEnding(): void;
  markPlaybackStarted(): void;
  markAudio(delta: RealtimeVoiceOutputActivityDelta): void;
  reset(): void;
  /** Whether output exists or the downstream sink reports active playback. */
  isActive(sinkActive?: boolean): boolean;
  /** Whether caller speech should be treated as interrupting current output. */
  isInterruptible(sinkActive?: boolean): boolean;
  elapsedPlaybackMs(): number;
  /** Delay before watchdog should assume playback exceeded the expected audio duration. */
  playbackWatchdogDelayMs({ marginMs, minMs }: {
    marginMs: number;
    minMs?: number;
  }): number | undefined;
  /** Current output counters and playback timestamps. */
  snapshot(): Required<RealtimeVoiceOutputActivityDelta> & {
    chunks: number;
    playbackStarted: boolean;
    streamEnding: boolean;
    lastAudioAt?: number;
    playbackStartedAt?: number;
  };
};
//#endregion
//#region src/talk/agent-consult-tool.d.ts
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
//#endregion
//#region src/talk/agent-talkback-runtime.d.ts
type RealtimeVoiceAgentTalkbackQueue = {
  close(): void;
  enqueue(question: string, metadata?: unknown): void;
  isIdle(): boolean;
};
//#endregion
//#region src/talk/session-runtime.d.ts
type RealtimeVoiceAudioSink = {
  isOpen?: () => boolean;
  sendAudio: RealtimeVoiceBridgeCallbacks["onAudio"];
  getPlaybackState?: RealtimeVoiceBridgeCallbacks["getPlaybackState"];
  clearAudio?: (reason?: RealtimeVoiceAudioClearReason) => void;
  sendMark?: RealtimeVoiceBridgeCallbacks["onMark"];
};
/**
 * Controls how provider playback marks are bridged to transports that may or may not ack marks.
 */
type RealtimeVoiceMarkStrategy = "transport" | "ack-immediately" | "ignore";
/**
 * Stable session facade handed to gateway code and provider tool callbacks.
 */
type RealtimeVoiceBridgeSession = Pick<RealtimeVoiceBridge, "acknowledgeMark" | "close" | "connect" | "sendAudio" | "setMediaTimestamp" | "submitToolResult"> & {
  bridge: RealtimeVoiceBridge;
  readonly capabilities?: InternalRealtimeVoiceProviderCapabilities;
  sendUserMessage(text: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  triggerGreeting(instructions?: string): void;
};
type RealtimeVoiceBridgeSessionParams = Omit<RealtimeVoiceBridgeCreateRequest, "onAudio" | "onClearAudio" | "onMark" | "getPlaybackState" | "onToolCall" | "onReady"> & {
  provider: RealtimeVoiceProviderPlugin;
  capabilities?: InternalRealtimeVoiceProviderCapabilities;
  audioSink: RealtimeVoiceAudioSink;
  initialGreetingInstructions?: string;
  markStrategy?: RealtimeVoiceMarkStrategy;
  triggerGreetingOnReady?: boolean;
  /** Admit a host-requested response before the provider can complete it synchronously. */
  onResponseRequest?: () => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent, session: RealtimeVoiceBridgeSession) => void | Promise<void>;
  onReady?: (session: RealtimeVoiceBridgeSession) => void;
};
//#endregion
//#region src/talk/session-log-runtime.d.ts
/** Ring-buffer entry for transcript text used by Talk health and echo suppression. */
type RealtimeVoiceTranscriptEntry = {
  at: string;
  role: RealtimeVoiceRole;
  text: string;
};
/** Compact health snapshot exposed to diagnostics without dumping full transcript history. */
type RealtimeVoiceTranscriptHealth = {
  realtimeTranscriptLines: number;
  lastRealtimeTranscriptAt?: string;
  lastRealtimeTranscriptRole?: RealtimeVoiceRole;
  lastRealtimeTranscriptText?: string;
  recentRealtimeTranscript: RealtimeVoiceTranscriptEntry[];
};
/** Bridge event plus capture time, kept separate from provider event payload shape. */
type RealtimeVoiceBridgeEventLogEntry = RealtimeVoiceBridgeEvent & {
  at: string;
};
/** Compact health snapshot of recent realtime bridge events. */
type RealtimeVoiceBridgeEventHealth = {
  lastRealtimeEventAt?: string;
  lastRealtimeEventType?: string;
  lastRealtimeEventDetail?: string;
  recentRealtimeEvents: RealtimeVoiceBridgeEventLogEntry[];
};
/** Summarizes transcript history for health endpoints and UI diagnostics. */
declare function getRealtimeVoiceTranscriptHealth(transcript: RealtimeVoiceTranscriptEntry[]): RealtimeVoiceTranscriptHealth;
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
declare function getRealtimeVoiceBridgeEventHealth(events: RealtimeVoiceBridgeEventLogEntry[]): RealtimeVoiceBridgeEventHealth;
//#endregion
//#region src/talk/realtime-session-harness.d.ts
type RealtimeVoiceSessionHarnessHealth = ReturnType<typeof getRealtimeVoiceTranscriptHealth> & Partial<ReturnType<typeof getRealtimeVoiceBridgeEventHealth>> & {
  providerConnected: boolean;
  realtimeReady: boolean;
  audioInputActive: boolean;
  audioOutputActive: boolean;
  lastInputAt?: string;
  lastOutputAt?: string;
  lastSuppressedInputAt?: string;
  lastInputBytes: number;
  lastOutputBytes: number;
  suppressedInputBytes: number;
  recentTalkEvents: Array<Pick<TalkEvent, "id" | "type" | "sessionId" | "turnId" | "seq" | "timestamp" | "final">>;
};
type RealtimeVoiceSessionHarness<TForcedConsultContext = unknown> = {
  readonly forcedConsults: RealtimeVoiceForcedConsultCoordinator<TForcedConsultContext>;
  readonly outputActivity: RealtimeVoiceOutputActivityTracker;
  readonly talk: TalkSessionController;
  readonly talkback: RealtimeVoiceAgentTalkbackQueue | undefined;
  readonly transcript: RealtimeVoiceTranscriptEntry[];
  close(): void;
  createBridge(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(): string;
  endTurn(reason?: string): void;
  finishResponse(outcome: RealtimeVoiceResponseOutcome): TalkTurnResult;
  finishOutputAudio(reason: string): void;
  flushOutput(flush: () => void): void;
  getHealth(params: {
    providerConnected: boolean;
    realtimeReady: boolean;
  }): RealtimeVoiceSessionHarnessHealth;
  handleBargeIn(options: RealtimeVoiceBargeInOptions, flushOutput: () => void): void;
  isLikelyAssistantEchoTranscript(text: string): boolean;
  isOutputPlaybackWindowActive(): boolean;
  recordInputAudio(audio: Buffer): boolean;
  recordOutputAudio(audio: Buffer, activity?: RealtimeVoiceOutputActivityDelta): void;
  recordTranscript(role: RealtimeVoiceRole, text: string): RealtimeVoiceTranscriptEntry;
};
//#endregion
export { RealtimeVoiceAgentConsultTranscriptEntry as i, RealtimeVoiceBridgeSession as n, RealtimeVoiceAgentConsultToolPolicy as r, RealtimeVoiceSessionHarness as t };