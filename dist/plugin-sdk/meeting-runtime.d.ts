import { Am as TranscriptsStartResult, Bm as RealtimeVoiceCloseReason, Fm as RealtimeVoiceBargeInOptions, Gm as RealtimeVoiceTool, Hm as RealtimeVoiceProviderConfig, Im as RealtimeVoiceBridge, Km as RealtimeVoiceToolCallEvent, Lm as RealtimeVoiceBridgeCallbacks, Mm as RealtimeVoiceAgentConsultRunner, Nm as RealtimeVoiceAudioClearReason, Ns as OpenClawPluginApi, Om as TranscriptStartRequest, Pa as OpenClawPluginConfigSchema, Pm as RealtimeVoiceAudioFormat, Rm as RealtimeVoiceBridgeEvent, Um as RealtimeVoiceResponseOutcome, Vm as RealtimeVoiceProviderCapabilities, Wm as RealtimeVoiceRole, cc as OpenClawPluginNodeInvokePolicy, jm as TranscriptsStopResult, km as TranscriptStopRequest, mm as RealtimeVoiceProviderPlugin, oc as OpenClawPluginCliRootCommandDescriptor, pm as RealtimeTranscriptionProviderPlugin, qm as RealtimeVoiceToolResultOptions, ui as PluginRuntime, vo as RuntimeLogger, zm as RealtimeVoiceCloseOptions } from "../agent-harness-runtime-CWL0fcg5.js";
import { r as OpenClawConfig } from "../types.openclaw-LzSbb55e.js";
import "../config-CTir7RIz.js";
import { Qt as TalkEventInput, Xt as TalkEvent, Zt as TalkEventContext } from "../diagnostic-events-Bs1JVD6b.js";
import { n as callGatewayFromCli } from "../gateway-rpc-BAskVQCs.js";
import { TObject } from "typebox";
import { Writable } from "node:stream";
import { Command } from "commander";
//#region src/talk/agent-consult-tool.d.ts
/** Closed policy set controlling whether the consult tool is exposed. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
/** Tool exposure policy for the shared realtime voice consult tool. */
type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
//#endregion
//#region src/talk/agent-talkback-runtime.d.ts
/** Minimal queue API owned by a realtime voice session. */
type RealtimeVoiceAgentTalkbackQueue = {
  close(): void;
  enqueue(question: string, metadata?: unknown): void;
  isIdle(): boolean;
};
//#endregion
//#region src/talk/forced-consult-coordinator.d.ts
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
type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = {
  prepare(question: string, options?: {
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
  hasRecentNativeConsult(question: string, options?: RealtimeVoiceForcedConsultNativeRecentOptions): boolean;
  remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  clear(): void;
};
//#endregion
//#region src/talk/output-activity-tracker.d.ts
/** One output activity increment from source audio and/or sink audio. */
type RealtimeVoiceOutputActivityDelta = {
  audioMs?: number;
  sourceAudioBytes?: number;
  sinkAudioBytes?: number;
};
/** Current output counters and playback timestamps. */
type RealtimeVoiceOutputActivitySnapshot = {
  audioMs: number;
  chunks: number;
  sourceAudioBytes: number;
  sinkAudioBytes: number;
  playbackStarted: boolean;
  streamEnding: boolean;
  lastAudioAt?: number;
  playbackStartedAt?: number;
};
/** Mutable tracker for one realtime voice output stream. */
type RealtimeVoiceOutputActivityTracker = {
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
  /** Delay before watchdog should assume playback has exceeded expected audio duration. */
  playbackWatchdogDelayMs(options: {
    marginMs: number;
    minMs?: number;
  }): number | undefined;
  snapshot(): RealtimeVoiceOutputActivitySnapshot;
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
//#region src/talk/session-runtime.d.ts
/**
 * Transport-facing audio target used by realtime voice bridge sessions.
 */
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
type RealtimeVoiceBridgeSession = {
  bridge: RealtimeVoiceBridge;
  readonly capabilities?: InternalRealtimeVoiceProviderCapabilities;
  acknowledgeMark(markName?: string): void;
  close(options?: RealtimeVoiceCloseOptions): void | Promise<void>;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  sendUserMessage(text: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  setMediaTimestamp(ts: number): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void | Promise<void>;
  triggerGreeting(instructions?: string): void;
};
/**
 * Provider bridge inputs plus transport callbacks for one realtime voice session.
 */
type RealtimeVoiceBridgeSessionParams = {
  provider: RealtimeVoiceProviderPlugin;
  capabilities?: InternalRealtimeVoiceProviderCapabilities;
  cfg?: OpenClawConfig;
  /** Host-selected agent scope for provider auth and agent-owned bridge state. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  audioSink: RealtimeVoiceAudioSink;
  instructions?: string;
  language?: string;
  initialGreetingInstructions?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  markStrategy?: RealtimeVoiceMarkStrategy;
  triggerGreetingOnReady?: boolean;
  tools?: RealtimeVoiceTool[];
  runAgentConsult?: RealtimeVoiceAgentConsultRunner;
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  handleDelegationInput?: RealtimeVoiceBridgeCallbacks["handleDelegationInput"];
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onResponseDone?: (outcome: RealtimeVoiceResponseOutcome) => void;
  /** Admit a host-requested response before the provider can complete it synchronously. */
  onResponseRequest?: () => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent, session: RealtimeVoiceBridgeSession) => void | Promise<void>;
  onReady?: (session: RealtimeVoiceBridgeSession) => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
//#endregion
//#region src/talk/talk-session-controller.d.ts
/**
 * Why a turn-scoped Talk operation could not emit an event.
 */
type TalkTurnFailureReason = "no_active_turn" | "stale_turn";
/**
 * Successful turn operation with the emitted Talk event.
 */
type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};
/**
 * Failed turn operation when the requested turn does not match controller state.
 */
type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};
/**
 * Result for ending or cancelling an active Talk turn.
 */
type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;
/**
 * Result for operations that ensure a turn exists and may emit a start event.
 */
type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};
/**
 * Stateful Talk event controller for one session's turns, output audio, and recent event buffer.
 */
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
  recentTalkEvents: Array<{
    id: string;
    type: TalkEvent["type"];
    sessionId: string;
    turnId?: string;
    seq: number;
    timestamp: string;
    final?: boolean;
  }>;
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
//#region src/meeting-bot/realtime-audio-format.d.ts
type MeetingRealtimeAudioFormat = "pcm16-24khz" | "g711-ulaw-8khz";
export declare function convertMeetingTtsAudioForBridge(audio: Buffer, sampleRate: number, audioFormat: MeetingRealtimeAudioFormat, outputFormat?: string, platformName?: string): Buffer;
//#endregion
//#region src/meeting-bot/realtime-audio-transport.d.ts
type MeetingRealtimeAudioTransportHealth = {
  consecutiveInputErrors?: number;
  lastInputError?: string;
  lastOutputLoopbackAt?: string;
  lastOutputLoopbackCorrelation?: number;
  lastOutputLoopbackPeak?: number;
  lastOutputLoopbackRms?: number;
  outputLoopbackSignalBytes?: number;
  outputGeneration?: number;
  verifiedOutputGeneration?: number;
};
interface MeetingRealtimeAudioTransport {
  /** Input contains browser playback only, excluding native microphone injection. */
  inputAudioIsolated?: boolean;
  /** Delivers a prior failure immediately so provider setup cannot outrun transport teardown. */
  onFatal(handler: () => void): void;
  startInput(onAudio: (audio: Buffer) => void): void;
  /** Starts one assistant-output generation so loopback proof cannot reuse older audio. */
  beginOutput?(): void;
  stop(): Promise<void>;
  writeOutput(audio: Buffer): Promise<void>;
  clearOutput(): Promise<void>;
  dispose(): Promise<void>;
  getHealth?(): MeetingRealtimeAudioTransportHealth;
  startBargeInMonitor?(onBargeIn: (audio: Buffer) => boolean): void;
}
//#endregion
//#region src/meeting-bot/realtime-engine.d.ts
type MeetingRuntimePlatform = {
  /** Adapter-owned identity keeps platform names and log prefixes out of core. */
  displayName: string;
  logScope: string;
  sessionIdPrefix: string;
};
type MeetingRealtimeEngineConfig = {
  chrome: {
    audioFormat: MeetingRealtimeAudioFormat;
  };
  realtime: {
    strategy: string;
    agentId?: string;
    provider?: string;
    transcriptionProvider?: string;
    voiceProvider?: string;
    model?: string;
    instructions?: string;
    introMessage?: string;
    toolPolicy?: RealtimeVoiceAgentConsultToolPolicy;
    providers: Record<string, Record<string, unknown>>;
  };
};
type MeetingAgentConsultParams = {
  meetingSessionId: string;
  requesterSessionKey?: string;
  args: unknown;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
  /** Meeting-owned cancellation for the active consult. */
  abortSignal?: AbortSignal;
};
type MeetingRealtimeToolCallParams = {
  strategy: string;
  session: RealtimeVoiceBridgeSession;
  event: RealtimeVoiceToolCallEvent;
  meetingSessionId: string;
  requesterSessionKey?: string;
  transcript: Array<{
    role: "user" | "assistant";
    text: string;
  }>;
  onTalkEvent: (event: TalkEventInput) => void;
};
type MeetingRealtimeAudioEngineHealth = ReturnType<RealtimeVoiceSessionHarness["getHealth"]> & MeetingRealtimeAudioTransportHealth & {
  lastClearAt?: string;
  clearCount?: number;
  bridgeClosed: boolean;
};
type MeetingRealtimeAudioEngineHandle = {
  providerId: string;
  speak: (instructions?: string) => void;
  getHealth: () => MeetingRealtimeAudioEngineHealth;
  stop: () => Promise<void>;
};
export declare function startMeetingRealtimeEngine(params: {
  config: MeetingRealtimeEngineConfig;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  platform: MeetingRuntimePlatform;
  meetingSessionId: string;
  requesterSessionKey?: string;
  logPrefix?: "node";
  talkSessionId?: string;
  talkContext?: {
    nodeId: string;
    bridgeId: string;
  };
  transport: MeetingRealtimeAudioTransport;
  logger: RuntimeLogger;
  providers?: RealtimeVoiceProviderPlugin[];
  consultAgent: (params: MeetingAgentConsultParams) => Promise<{
    text: string;
  }>;
  tools: RealtimeVoiceTool[];
  handleToolCall: (params: MeetingRealtimeToolCallParams) => Promise<void>;
}): Promise<MeetingRealtimeAudioEngineHandle>;
//#endregion
//#region src/meeting-bot/realtime-agent-engine.d.ts
export declare function startMeetingAgentRealtimeEngine(params: {
  config: MeetingRealtimeEngineConfig;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  platform: MeetingRuntimePlatform;
  meetingSessionId: string;
  requesterSessionKey?: string;
  logPrefix?: "node";
  transport: MeetingRealtimeAudioTransport;
  logger: RuntimeLogger;
  providers?: RealtimeTranscriptionProviderPlugin[];
  consultAgent: (params: MeetingAgentConsultParams) => Promise<{
    text: string;
  }>;
}): Promise<MeetingRealtimeAudioEngineHandle>;
//#endregion
//#region src/meeting-bot/realtime-local-audio-transport.d.ts
type BridgeProcess = {
  pid?: number;
  killed?: boolean;
  exitCode: number | null;
  signalCode: NodeJS.Signals | null;
  stdin?: Writable | null;
  stdout?: {
    on(event: "data", listener: (chunk: Buffer | string) => void): unknown;
    on(event: "error", listener: (error: Error) => void): unknown;
  } | null;
  stderr?: {
    on(event: "data", listener: (chunk: Buffer | string) => void): unknown;
    on(event: "error", listener: (error: Error) => void): unknown;
  } | null;
  kill(signal?: NodeJS.Signals): boolean;
  on(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
  on(event: "error", listener: (error: Error) => void): unknown;
  once(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
  off(event: "exit", listener: (code: number | null, signal: NodeJS.Signals | null) => void): unknown;
};
type MeetingRealtimeAudioSpawn = (command: string, args: string[], options: {
  stdio: ["pipe" | "ignore", "pipe" | "ignore", "pipe" | "ignore"];
}) => BridgeProcess;
export declare function createLocalMeetingRealtimeAudioTransport(params: {
  inputCommand: string[];
  outputCommand: string[];
  bargeInInputCommand?: string[];
  bargeInRmsThreshold: number;
  bargeInPeakThreshold: number;
  bargeInCooldownMs: number;
  logger: RuntimeLogger;
  logScope: string;
  audioFormat?: MeetingRealtimeAudioFormat;
  spawn?: MeetingRealtimeAudioSpawn;
}): MeetingRealtimeAudioTransport;
//#endregion
//#region src/meeting-bot/realtime-node-audio-transport.d.ts
export declare function createNodeMeetingRealtimeAudioTransport(params: {
  runtime: PluginRuntime;
  nodeId: string;
  bridgeId: string;
  logger: RuntimeLogger;
  /** Platform registration owns this stable command name; paired nodes call it verbatim. */
  commandName: string;
  logScope: string;
  logPrefix: string;
  audioFormat?: MeetingRealtimeAudioFormat;
}): MeetingRealtimeAudioTransport;
//#endregion
//#region src/meeting-bot/audio-backend.d.ts
type MeetingAudioBackend = "blackhole-2ch" | "pipewire-pulse";
type MeetingAudioBackendSelection = "auto" | MeetingAudioBackend;
type MeetingAudioRuntime = {
  backend: MeetingAudioBackend;
  deviceLabel: string;
  inputCommand: string[];
  outputCommand: string[];
};
type MeetingAudioCommandResult = {
  code: number;
  stdout?: string;
  stderr?: string;
};
declare function resolveMeetingAudioRuntimeForFormat(params: {
  backend?: MeetingAudioBackendSelection;
  bufferBytes: number;
  format: MeetingRealtimeAudioFormat;
  inputCommand?: readonly string[];
  outputCommand?: readonly string[];
  platform?: NodeJS.Platform;
}): MeetingAudioRuntime;
declare function ensureMeetingAudioBackend(params: {
  backend: MeetingAudioBackend;
  run(argv: string[], timeoutMs: number): Promise<MeetingAudioCommandResult>;
  timeoutMs: number;
}): Promise<void>;
//#endregion
//#region src/meeting-bot/session-types.d.ts
/** Generic lifecycle state shared by browser and dial-in meeting sessions. */
type MeetingSessionState = "active" | "ended";
type MeetingResolvedJoin<TTransport extends string, TMode extends string> = {
  url: string;
  transport: TTransport;
  mode: TMode;
  agentId: string;
};
type MeetingTranscriptLine = {
  at?: string;
  speaker?: string;
  text: string;
};
type MeetingTranscriptSnapshot = {
  droppedLines: number;
  epoch?: string;
  lines: MeetingTranscriptLine[];
};
type MeetingBrowserTab = {
  targetId: string;
  openedByPlugin: boolean;
};
type MeetingBrowserCandidateTab = {
  targetId?: string;
  title?: string;
  url?: string;
};
type MeetingBrowserHealth<TManualReason extends string = string, TSpeechBlockedReason extends string = string> = {
  inCall?: boolean;
  micMuted?: boolean;
  manualAction?: {
    reason: TManualReason;
    message: string;
  };
  speechReady?: boolean;
  speechBlockedReason?: TSpeechBlockedReason;
  speechBlockedMessage?: string;
  /** Non-silent sink audio observed again on the meeting microphone capture path. */
  outputLoopbackSignalBytes?: number;
  lastOutputLoopbackAt?: string;
  lastOutputLoopbackCorrelation?: number;
  lastOutputLoopbackRms?: number;
  lastOutputLoopbackPeak?: number;
  outputGeneration?: number;
  verifiedOutputGeneration?: number;
};
type MeetingPluginProbeHealth = MeetingBrowserHealth & {
  audioOutputActive?: boolean;
  captioning?: boolean;
  captionsEnabledAttempted?: boolean;
  lastCaptionAt?: string;
  lastCaptionSpeaker?: string;
  lastCaptionText?: string;
  lastOutputBytes?: number;
  recentTranscript?: Array<{
    at?: string;
    speaker?: string;
    text: string;
  }>;
  transcriptLines?: number;
};
type MeetingRealtimeSessionBlock = {
  enabled: boolean;
  strategy?: string;
  provider?: string;
  model?: string;
  transcriptionProvider?: string;
  toolPolicy: string;
};
/**
 * Stable shared wire fields. Platform adapters add thin browser and dial-in blocks
 * under their existing public field names so migrations do not reshape JSON.
 */
type MeetingSessionRecord<TTransport extends string = string, TMode extends string = string, TRealtime extends MeetingRealtimeSessionBlock = MeetingRealtimeSessionBlock> = {
  id: string;
  url: string;
  transport: TTransport;
  mode: TMode;
  agentId: string;
  state: MeetingSessionState;
  transcriptEvicted?: boolean;
  browserLeft?: boolean;
  createdAt: string;
  updatedAt: string;
  participantIdentity: string;
  realtime: TRealtime;
  notes: string[];
};
type MeetingPluginJoinRequest<TTransport extends string, TMode extends string> = {
  url: string;
  transport?: TTransport;
  mode?: TMode;
  message?: string;
  requesterSessionKey?: string;
  agentId?: string;
  timeoutMs?: number;
};
type MeetingPluginChromeHealth<TManualReason extends string, TSpeechBlockedReason extends string> = MeetingBrowserHealth<TManualReason, TSpeechBlockedReason> & MeetingPluginProbeHealth & {
  cameraOff?: boolean;
  lobbyWaiting?: boolean;
  captionCaptureRequested?: boolean;
  audioInputRouted?: boolean;
  audioInputDeviceLabel?: string;
  audioInputRouteError?: string;
  audioOutputRouted?: boolean;
  audioOutputDeviceLabel?: string;
  audioOutputRouteError?: string;
  audioOutputRouteRetryable?: boolean;
  providerConnected?: boolean;
  realtimeReady?: boolean;
  audioInputActive?: boolean;
  lastInputAt?: string;
  lastOutputAt?: string;
  lastInputBytes?: number;
  bridgeClosed?: boolean;
  browserUrl?: string;
  browserTitle?: string;
  status?: string;
  notes?: string[];
};
type MeetingPluginSession<TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth> = MeetingSessionRecord<TTransport, TMode> & {
  chrome?: {
    audioBackend?: MeetingAudioBackend;
    launched: boolean;
    nodeId?: string;
    browserProfile?: string;
    browserTab?: MeetingBrowserTab;
    audioBridge?: {
      type: "command-pair" | "node-command-pair";
      provider?: string;
    };
    health?: THealth;
  };
};
type MeetingPluginJoinResult<TSession> = {
  session: TSession;
  spoken?: boolean;
};
//#endregion
//#region src/meeting-bot/session-runtime-types.d.ts
type MeetingSessionRuntimeHandles<THealth extends MeetingBrowserHealth> = {
  stop?: () => Promise<void>;
  speak?: (instructions?: string) => void;
  getHealth?: () => Partial<THealth>;
};
type MeetingBrowserSessionView<THealth extends MeetingBrowserHealth, TTab extends MeetingBrowserTab> = {
  launched: boolean;
  nodeId?: string;
  tab?: TTab;
  health?: THealth;
  hasAudioBridge: boolean;
};
type MeetingSessionRuntimeJoinContext<TSession extends MeetingSessionRecord<TTransport, TMode>, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth, TTab extends MeetingBrowserTab> = {
  attachRuntimeHandles(session: TSession, handles: MeetingSessionRuntimeHandles<THealth>): void;
  inheritedBrowserTab(params: {
    session: TSession;
    transport: TTransport;
    nodeId?: string;
    meetingUrl: string;
    tab?: TTab;
  }): TTab | undefined;
};
type MeetingSessionRuntimeMessages<TSpeechBlockedReason extends string> = {
  previousBrowserLeaveFailed: string;
  reassignedSessionNote: string;
  reusedSessionNote: string;
  replacementBrowserLeaveFailed: string;
  speechBlockedFallback: string;
  speech: {
    audioBridgeUnavailable: string;
    browserUnverified: string;
    microphoneMuted: string;
    microphoneMutedReason: TSpeechBlockedReason;
    notInCall: string;
    notInCallReason: TSpeechBlockedReason;
    browserUnverifiedReason: TSpeechBlockedReason;
    audioBridgeUnavailableReason: TSpeechBlockedReason;
  };
};
type MeetingSessionLeaveResult<TSession> = {
  found: boolean;
  session?: TSession;
  browserLeft?: boolean;
};
//#endregion
//#region src/meeting-bot/transcripts-bridge.d.ts
type MeetingDurableTranscriptsOptions = {
  config?: unknown;
  openclawConfig?: OpenClawConfig;
  providerId: string;
  providerName: string;
  stateDir?: string;
};
type MeetingTranscriptSourceRuntime = {
  startTranscriptSource(request: TranscriptStartRequest): Promise<TranscriptsStartResult>;
  stopTranscriptSource(request: TranscriptStopRequest): Promise<TranscriptsStopResult>;
};
//#endregion
//#region src/meeting-bot/session-runtime.d.ts
type MeetingSessionRuntimeOptions<TSession extends MeetingSessionRecord<TTransport, TMode>, TRequest, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth<TManualReason, TSpeechBlockedReason>, TTab extends MeetingBrowserTab, TManualReason extends string, TSpeechBlockedReason extends string> = {
  logger: RuntimeLogger;
  logScope: string;
  formatError(error: unknown): string;
  messages: MeetingSessionRuntimeMessages<TSpeechBlockedReason>;
  reuseExistingBrowserTab: boolean;
  waitForInCallMs: number;
  joinTimeoutMs: number;
  transientSpeechBlockedReasons: ReadonlySet<TSpeechBlockedReason>;
  resolveJoin(request: TRequest): MeetingResolvedJoin<TTransport, TMode>;
  createSession(params: {
    request: TRequest;
    resolved: MeetingResolvedJoin<TTransport, TMode>;
    createdAt: string;
  }): TSession;
  resolveSpeechInstructions(request: TRequest): string | undefined;
  isBrowserTransport(transport: TTransport): boolean;
  isTalkBackMode(mode: TMode): boolean;
  isTranscribeMode(mode: TMode): boolean;
  sameMeetingUrl(left: string | undefined, right: string | undefined): boolean;
  normalizeMeetingUrlForReuse(url: string): string | undefined;
  getBrowser(session: TSession): MeetingBrowserSessionView<THealth, TTab> | undefined;
  setBrowserTab(session: TSession, tab: TTab | undefined): void;
  setBrowserHealth(session: TSession, health: THealth | undefined): void;
  joinTransport(params: {
    request: TRequest;
    session: TSession;
    context: MeetingSessionRuntimeJoinContext<TSession, TTransport, TMode, THealth, TTab>;
  }): Promise<{
    delegatedSpoken?: boolean;
  }>;
  releaseBrowserTab(session: TSession): Promise<boolean | undefined>;
  refreshBrowserHealth(session: TSession, options?: {
    force?: boolean;
    readOnly?: boolean;
  }): Promise<void>;
  refreshStatus(session: TSession): Promise<void>;
  refreshReusableSession(session: TSession, request: TRequest, resolved: MeetingResolvedJoin<TTransport, TMode>): Promise<{
    keepBrowserTab: boolean;
  } | void>;
  ensureRealtimeBridge(session: TSession): Promise<MeetingSessionRuntimeHandles<THealth> | undefined>;
  captureTranscript(session: TSession, options?: {
    finalize?: boolean;
  }): Promise<MeetingTranscriptSnapshot | undefined>;
  speakViaTransport(session: TSession, instructions?: string): Promise<{
    handled: boolean;
    spoken: boolean;
  } | undefined>;
  defaultSpeechInstructions?: string;
  durableTranscripts?: MeetingDurableTranscriptsOptions;
};
/** Shared lifecycle owner; platform strategies perform transport-specific I/O only. */
export declare class MeetingSessionRuntime<TSession extends MeetingSessionRecord<TTransport, TMode>, TRequest, TTransport extends string, TMode extends string, THealth extends MeetingBrowserHealth<TManualReason, TSpeechBlockedReason>, TTab extends MeetingBrowserTab, TManualReason extends string, TSpeechBlockedReason extends string> {
  #private;
  private readonly options;
  constructor(options: MeetingSessionRuntimeOptions<TSession, TRequest, TTransport, TMode, THealth, TTab, TManualReason, TSpeechBlockedReason>);
  list(): TSession[];
  getSession(sessionId: string): TSession | undefined;
  status(sessionId?: string): Promise<{
    found: boolean;
    session?: TSession;
    sessions?: TSession[];
  }>;
  transcript(sessionId: string, options?: {
    sinceIndex?: number;
  }): Promise<{
    found: boolean;
    sessionId?: string;
    startIndex?: number;
    nextIndex?: number;
    droppedLines?: number;
    evicted?: boolean;
    lines?: MeetingTranscriptLine[];
  }>;
  startTranscriptSource(request: TranscriptStartRequest): Promise<TranscriptsStartResult>;
  reconcileTranscriptPolicy(enabled: boolean): Promise<void>;
  stopTranscriptSource(request: TranscriptStopRequest): Promise<TranscriptsStopResult>;
  isReusableSession(session: TSession, resolved: MeetingResolvedJoin<TTransport, TMode>): boolean;
  join(request: TRequest): Promise<{
    session: TSession;
    spoken?: boolean;
  }>;
  leave(sessionId: string, options?: {
    keepBrowserTab?: boolean;
  }): Promise<MeetingSessionLeaveResult<TSession>>;
  speak(sessionId: string, instructions?: string): Promise<{
    found: boolean;
    spoken: boolean;
    session?: TSession;
  }>;
  speakWhenReady(session: TSession, instructions: string): Promise<boolean>;
  hasHealthHandle(sessionId: string): boolean;
  refreshHealth(sessionId?: string): void;
  refreshBrowserHealth(session: TSession, options?: {
    force?: boolean;
    readOnly?: boolean;
  }): Promise<void>;
  refreshCaptionHealth(session: TSession): Promise<void>;
  refreshSpeechReadiness(session: TSession): {
    ready: boolean;
    reason?: TSpeechBlockedReason;
    message?: string;
  };
  markSessionEnded(session: TSession, reason: string): void;
}
//#endregion
//#region src/meeting-bot/browser-audio-capture-source.d.ts
type MeetingBrowserAudioCaptureRequest = {
  action: "start" | "pull" | "stop";
  captureId: string;
  meetingSessionId: string;
  meetingUrl: string;
};
//#endregion
//#region src/meeting-bot/platform-adapter-contract.d.ts
type MeetingManualActionCategory = "login-required" | "admission-required" | "permission-required" | "audio-choice-required" | "locale-required" | "session-conflict" | "browser-control-unavailable" | "custom";
type MeetingManualAction = {
  category: MeetingManualActionCategory;
  reason: string;
  message: string;
};
type MeetingBrowserRequestParams = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  body?: unknown;
  timeoutMs: number;
};
type MeetingBrowserRequestCaller = (params: MeetingBrowserRequestParams) => Promise<unknown>;
type MeetingBrowserJoinSession<Mode extends string> = {
  captureCaptions?: boolean;
  meetingSessionId: string;
  mode: Mode;
  url: string;
};
type MeetingBrowserStatusScriptParams<Mode extends string> = MeetingBrowserJoinSession<Mode> & {
  allowSessionAdoption: boolean;
  autoJoin: boolean;
  captureCaptions: boolean;
  guestName: string;
  readOnly?: boolean;
  waitForInCallMs: number;
};
type MeetingBrowserLeaveStep = {
  departed: boolean;
  leaveAction?: "leave" | "confirm";
  sessionConflict?: boolean;
  sessionMatched?: boolean;
  urlMatched?: boolean;
};
type MeetingBrowserPermissionPlan = {
  origin: string;
  permissions: string[];
  optionalPermissions?: string[];
};
type MeetingAgentConsultSurface = {
  id: string;
  provider: string;
  lane: string;
  surface: string;
  userLabel: string;
  assistantLabel: string;
  questionSourceLabel: string;
  workingResponseLabel: string;
  extraSystemPrompt: string;
};
type MeetingPlatformRuntimeMetadata = {
  id: string;
  displayName: string;
  logScope: string;
  agentConsult: Omit<MeetingAgentConsultSurface, "id" | "provider" | "lane">;
  session: {
    idPrefix: string;
    participantIdentity(transport: string): string;
  };
};
type MeetingBrowserAdapter<Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = {
  allowsMicrophone(mode: Mode): boolean;
  buildStatusJoinScript(params: MeetingBrowserStatusScriptParams<Mode>): string;
  buildAudioCaptureScript?(params: MeetingBrowserAudioCaptureRequest): string;
  parseStatus(result: unknown): Health | undefined;
  classifyManualAction(health: Health): MeetingManualAction | undefined;
  shouldRetryJoinStatus?(health: Health): boolean;
  browserControlUnavailable(error: unknown): MeetingManualAction;
  buildLeaveScript(meetingUrl: string): string;
  buildSessionLeaveScript?(params: {
    leaveInitiated: boolean;
    meetingSessionId: string;
    meetingUrl: string;
  }): string;
  parseLeaveResult(result: unknown): MeetingBrowserLeaveStep;
  captions: {
    enabled(mode: Mode): boolean;
    buildTranscriptScript(params: {
      finalize: boolean;
      meetingSessionId: string;
      meetingUrl: string;
    }): string;
    parseTranscript(result: unknown): Transcript & {
      sessionMatched?: boolean;
      urlMatched?: boolean;
    };
  };
  permissions(params: {
    allowMicrophone: boolean;
    meetingUrl: string;
  }): MeetingBrowserPermissionPlan | undefined;
  permissionNotes(params: {
    allowMicrophone: boolean;
    error?: unknown;
    result?: unknown;
  }): string[];
};
interface MeetingPlatformAdapter$1<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot, CreateParams = never, CreateResult = never, DialInParams = never, DialInPlan = never> {
  id: string;
  displayName: string;
  browserLabel: string;
  logScope: string;
  agentConsult?: MeetingPlatformRuntimeMetadata["agentConsult"];
  session?: MeetingPlatformRuntimeMetadata["session"];
  nodeCommandName: string;
  nodeConfigPath: string;
  urls: {
    validateAndNormalize(input: unknown): string;
    normalizeForReuse(url: string | undefined): string | undefined;
    isSameMeeting(a: string | undefined, b: string | undefined): boolean;
    buildJoinUrl(session: Session & {
      url: string;
    }): string;
    accountHint(url: string | undefined): string | undefined;
    isPreferredJoinUrl(url: string | undefined): boolean;
    isRecoverableTab(tab: MeetingBrowserCandidateTab, url?: string): boolean;
    localeAction(tab: MeetingBrowserCandidateTab): MeetingManualAction | undefined;
  };
  browser: MeetingBrowserAdapter<Mode, Health, Transcript>;
  create?: {
    browser(params: CreateParams): Promise<CreateResult>;
  };
  dialIn?: {
    buildPlan(params: DialInParams): DialInPlan;
  };
}
//#endregion
//#region src/meeting-bot/session-factory.d.ts
export declare function createMeetingSession<TTransport extends string, TMode extends string, TToolPolicy extends string>(params: {
  platform: MeetingPlatformRuntimeMetadata;
  config: {
    realtime: {
      provider?: string;
      voiceProvider?: string;
      transcriptionProvider?: string;
      model?: string;
      toolPolicy: TToolPolicy;
    };
  };
  resolved: MeetingResolvedJoin<TTransport, TMode>;
  createdAt: string;
}): MeetingSessionRecord<TTransport, TMode, {
  enabled: boolean;
  strategy: string;
  provider: string | undefined;
  model: string | undefined;
  transcriptionProvider: string | undefined;
  toolPolicy: TToolPolicy;
}>;
//#endregion
//#region src/meeting-bot/browser-controller.d.ts
type MeetingBrowserControllerConfig = {
  launch: boolean;
  reuseExistingTab: boolean;
  autoJoin: boolean;
  guestName: string;
  joinTimeoutMs: number;
  waitForInCallMs: number;
};
type BrowserAdapter$1<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = Pick<MeetingPlatformAdapter$1<Session, Mode, Health, Transcript>, "browser" | "browserLabel" | "urls">;
export declare function openMeetingWithBrowser<Session extends MeetingBrowserJoinSession<Mode>, Mode extends string, Health extends MeetingBrowserHealth & {
  browserTitle?: string;
  browserUrl?: string;
  notes?: string[];
}, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter$1<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  config: MeetingBrowserControllerConfig;
  session: Session;
}): Promise<{
  launched: boolean;
  browser?: Health;
  tab?: MeetingBrowserTab;
}>;
export declare function recoverMeetingBrowserTab<Session, Mode extends string, Health extends MeetingBrowserHealth & {
  browserTitle?: string;
  browserUrl?: string;
  notes?: string[];
}, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter$1<Session, Mode, Health, Transcript>;
  allowSessionAdoption?: boolean;
  autoJoin?: boolean;
  callBrowser: MeetingBrowserRequestCaller;
  captureCaptions?: boolean;
  config: MeetingBrowserControllerConfig;
  locationLabel: string;
  meetingSessionId?: string;
  mode: Mode;
  requestedMeetingUrl: string | undefined;
  readOnly?: boolean;
  timeoutMs?: number;
  trackedMeetingUrl: string | undefined;
  trackedTargetId: string | undefined;
}): Promise<{
  found: boolean;
  targetId?: string;
  tab?: MeetingBrowserCandidateTab;
  browser?: Health;
  message: string;
}>;
//#endregion
//#region src/meeting-bot/browser-session-control.d.ts
type BrowserAdapter<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = Pick<MeetingPlatformAdapter$1<Session, Mode, Health, Transcript>, "browser" | "browserLabel">;
export declare function leaveMeetingWithBrowser<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  launch: boolean;
  meetingSessionId?: string;
  meetingUrl: string;
  tab: MeetingBrowserTab;
  timeoutMs: number;
}): Promise<{
  left: boolean;
  note: string;
}>;
export declare function readMeetingTranscriptWithBrowser<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(params: {
  adapter: BrowserAdapter<Session, Mode, Health, Transcript>;
  callBrowser: MeetingBrowserRequestCaller;
  finalize: boolean;
  meetingUrl: string;
  meetingSessionId: string;
  tab: MeetingBrowserTab;
  timeoutMs: number;
}): Promise<Transcript>;
//#endregion
//#region src/meeting-bot/browser-request.d.ts
export declare function asMeetingBrowserTabs(result: unknown): MeetingBrowserCandidateTab[];
export declare function readMeetingBrowserTab(result: unknown): MeetingBrowserCandidateTab | undefined;
export declare function resolveLocalMeetingBrowserRequest(runtime: PluginRuntime): Promise<MeetingBrowserRequestCaller>;
//#endregion
//#region src/meeting-bot/browser-node.d.ts
type MeetingBrowserNodeInfo = {
  caps?: string[];
  commands?: string[];
  connected?: boolean;
  nodeId?: string;
  displayName?: string;
  remoteIp?: string;
};
type NodeAdapter = Pick<MeetingPlatformAdapter$1<unknown, string, MeetingBrowserHealth, MeetingTranscriptSnapshot>, "displayName" | "nodeCommandName" | "nodeConfigPath">;
export declare function resolveMeetingBrowserNodeInfo(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  requestedNode?: string;
}): Promise<MeetingBrowserNodeInfo>;
export declare function resolveMeetingBrowserNode(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  requestedNode?: string;
}): Promise<string>;
export declare function callMeetingBrowserProxyOnNode(params: {
  runtime: PluginRuntime;
  adapter: NodeAdapter;
  nodeId: string;
} & MeetingBrowserRequestParams): Promise<unknown>;
//#endregion
//#region src/meeting-bot/agent-consult.d.ts
export declare function createMeetingRealtimeEngineBindings(params: {
  platform: MeetingPlatformRuntimeMetadata;
  config: {
    realtime: {
      agentId?: string;
      toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
    };
  };
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  logger: RuntimeLogger;
}): {
  platform: MeetingRuntimePlatform;
  consultAgent: (consult: MeetingAgentConsultParams) => Promise<{
    text: string;
  }>;
  tools: RealtimeVoiceTool[];
  handleToolCall: (call: MeetingRealtimeToolCallParams) => Promise<void>;
};
//#endregion
//#region src/meeting-bot/chrome-transport-types.d.ts
type MeetingChromeTransportConfig = MeetingRealtimeEngineConfig & {
  chrome: MeetingRealtimeEngineConfig["chrome"] & {
    audioBackend: MeetingAudioBackendSelection;
    audioBridgeCommand?: string[];
    audioBridgeHealthCommand?: string[];
    audioBufferBytes: number;
    audioInputCommand?: string[];
    audioInputCommandOverride?: string[];
    audioOutputCommand?: string[];
    audioOutputCommandOverride?: string[];
    autoJoin: boolean;
    bargeInCooldownMs: number;
    bargeInInputCommand?: string[];
    bargeInPeakThreshold: number;
    bargeInRmsThreshold: number;
    browserProfile?: string;
    guestName: string;
    joinTimeoutMs: number;
    launch: boolean;
    reuseExistingTab: boolean;
    waitForInCallMs: number;
  };
  chromeNode: {
    node?: string;
  };
  realtime: MeetingRealtimeEngineConfig["realtime"] & {
    agentId?: string;
    toolPolicy: Parameters<typeof createMeetingRealtimeEngineBindings>[0]["config"]["realtime"]["toolPolicy"];
  };
};
type MeetingBrowserNodeAdapter = Pick<MeetingPlatformAdapter$1<unknown, string, MeetingBrowserHealth, MeetingTranscriptSnapshot>, "displayName" | "nodeCommandName" | "nodeConfigPath">;
type MeetingChromeTransportOptions<Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot> = {
  browserNodeAdapter: MeetingBrowserNodeAdapter;
  isRealtimeRouteReady(mode: Mode, health: Health | undefined): boolean;
  isTalkBackMode(mode: Mode): boolean;
  meetingLabel: string;
  nodeCommandName: string;
  platform: Pick<MeetingPlatformAdapter$1<MeetingBrowserJoinSession<Mode>, Mode, Health, Transcript>, "browser" | "browserLabel" | "urls" | "nodeCommandName" | "nodeConfigPath"> & MeetingPlatformRuntimeMetadata;
  preserveTrackedBrowserOnEngineFailure: boolean;
  startupFailurePolicy?: "rollback" | "owned";
  runtime: {
    createBindings: typeof createMeetingRealtimeEngineBindings;
    createLocalAudioTransport: typeof createLocalMeetingRealtimeAudioTransport;
    createNodeAudioTransport: typeof createNodeMeetingRealtimeAudioTransport;
    startAgentRealtimeEngine: typeof startMeetingAgentRealtimeEngine;
    startRealtimeEngine: typeof startMeetingRealtimeEngine;
  };
};
type CommandPairAudioBridge = MeetingRealtimeAudioEngineHandle & {
  type: "command-pair";
};
type ExternalAudioBridge = {
  type: "external-command";
};
type MeetingChromeLaunchParams<Config, Mode extends string> = {
  runtime: PluginRuntime;
  config: Config;
  fullConfig: OpenClawConfig;
  meetingSessionId: string;
  requesterSessionKey?: string;
  mode: Mode;
  trackedTargetId?: string;
  url: string;
  logger: RuntimeLogger;
};
type NodeAudioBridge = MeetingRealtimeAudioEngineHandle & {
  type: "node-command-pair";
  nodeId: string;
  bridgeId: string;
};
type MeetingChromeRecoveryParams<Config, Mode extends string> = {
  runtime: PluginRuntime;
  config: Config;
  fullConfig?: OpenClawConfig;
  meetingSessionId?: string;
  mode: Mode;
  nodeId?: string;
  readOnly?: boolean;
  trackedMeetingUrl?: string;
  trackedTargetId?: string;
  transport: "chrome" | "chrome-node";
  timeoutMs?: number;
  url?: string;
};
//#endregion
//#region src/meeting-bot/chrome-transport.d.ts
declare function createMeetingChromeTransport<Config extends MeetingChromeTransportConfig, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(options: MeetingChromeTransportOptions<Mode, Health, Transcript>): {
  assertAudioDeviceAvailable: (params: {
    runtime: PluginRuntime;
    config: Config;
    timeoutMs: number;
  }) => Promise<void>;
  launchInChrome: (params: MeetingChromeLaunchParams<Config, Mode>) => Promise<{
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: CommandPairAudioBridge | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  launchOnNode: (params: MeetingChromeLaunchParams<Config, Mode>) => Promise<{
    nodeId: string;
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: NodeAudioBridge | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  leaveInBrowser: (params: {
    runtime: PluginRuntime;
    config: Config;
    meetingSessionId: string;
    meetingUrl: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<{
    left: boolean;
    note: string;
  }>;
  readTranscript: (params: {
    runtime: PluginRuntime;
    config: Config;
    finalize?: boolean;
    meetingUrl: string;
    meetingSessionId: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<Transcript>;
  recoverCurrentTab: (params: MeetingChromeRecoveryParams<Config, Mode>) => Promise<{
    found: boolean;
    targetId?: string;
    tab?: MeetingBrowserCandidateTab;
    browser?: Health | undefined;
    message: string;
    transport: "chrome" | "chrome-node";
    nodeId?: string | undefined;
  }>;
};
declare function createMeetingChromeTransportWithExternalAudio<Config extends MeetingChromeTransportConfig, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(options: MeetingChromeTransportOptions<Mode, Health, Transcript>): {
  assertAudioDeviceAvailable: (params: {
    runtime: PluginRuntime;
    config: Config;
    timeoutMs: number;
  }) => Promise<void>;
  launchInChrome: (params: MeetingChromeLaunchParams<Config, Mode>) => Promise<{
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: ExternalAudioBridge | (MeetingRealtimeAudioEngineHandle & {
      type: "command-pair";
    } & Pick<MeetingAudioRuntime, "inputCommand" | "outputCommand">) | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  launchOnNode: (params: MeetingChromeLaunchParams<Config, Mode>) => Promise<{
    nodeId: string;
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: ExternalAudioBridge | NodeAudioBridge | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  leaveInBrowser: (params: {
    runtime: PluginRuntime;
    config: Config;
    meetingSessionId: string;
    meetingUrl: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<{
    left: boolean;
    note: string;
  }>;
  readTranscript: (params: {
    runtime: PluginRuntime;
    config: Config;
    finalize?: boolean;
    meetingUrl: string;
    meetingSessionId: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<Transcript>;
  recoverCurrentTab: (params: MeetingChromeRecoveryParams<Config, Mode>) => Promise<{
    found: boolean;
    targetId?: string;
    tab?: MeetingBrowserCandidateTab;
    browser?: Health | undefined;
    message: string;
    transport: "chrome" | "chrome-node";
    nodeId?: string | undefined;
  }>;
};
//#endregion
//#region src/meeting-bot/node-audio-config.d.ts
type MeetingNodeAudioConfig = {
  backend: MeetingAudioBackendSelection;
  bufferBytes: number;
  format: MeetingRealtimeAudioFormat;
  inputCommand?: string[];
  outputCommand?: string[];
  bargeInInputCommand?: string[];
};
//#endregion
//#region src/meeting-bot/node-host.d.ts
type MeetingNodeHostOptions = {
  commandName: string;
  displayName: string;
  browserLabel: string;
  bridgeIdPrefix: string;
  defaultAudioInputCommand: readonly string[];
  defaultAudioOutputCommand: readonly string[];
  defaultAudio?: {
    backend?: MeetingAudioBackendSelection;
    bufferBytes: number;
    format: MeetingRealtimeAudioFormat;
  };
  talkBackModes: ReadonlySet<string>;
  agentMode: string;
  normalizeUrl(input: unknown): string;
  normalizeMeetingKey(url?: string): string | undefined;
  assertAudioAvailable(timeoutMs: number): void | Promise<void>;
  prepareAudio?(config: MeetingNodeAudioConfig, timeoutMs: number): Promise<MeetingAudioRuntime>;
  browser: {
    application: string;
    buildProfileArgs(profile: string): string[];
    openedStatus: string;
    openedNotes: string[];
  };
};
export declare function createMeetingNodeHost(options: MeetingNodeHostOptions): {
  handleCommand: (paramsJSON?: string | null) => Promise<string>;
  hasActiveWork: () => boolean;
};
//#endregion
//#region src/meeting-bot/configured-node-host.d.ts
type MeetingConfiguredNodeHostOptions = Omit<MeetingNodeHostOptions, "assertAudioAvailable" | "prepareAudio"> & {
  meetingLabel: string;
  sharePrerequisiteDeadline: boolean;
};
declare function createMeetingConfiguredNodeHost(options: MeetingConfiguredNodeHostOptions): ((paramsJSON?: string | null) => Promise<string>) & {
  hasActiveWork: () => boolean;
};
//#endregion
//#region src/meeting-bot/meeting-modes.d.ts
declare function isMeetingTalkBackMode(mode: string): boolean;
declare function isMeetingRealtimeRouteReady(mode: string, health: (MeetingBrowserHealth & {
  audioInputRouted?: boolean;
  audioOutputRouted?: boolean;
}) | undefined): boolean;
//#endregion
//#region src/meeting-bot/plugin-config.d.ts
type MeetingPluginMode = "agent" | "bidi" | "transcribe";
type MeetingPluginConfig$1 = MeetingRealtimeEngineConfig & {
  enabled: boolean;
  defaultMode: MeetingPluginMode;
  chrome: MeetingRealtimeEngineConfig["chrome"] & {
    audioBackend: MeetingAudioBackendSelection;
    audioBufferBytes: number;
    launch: boolean;
    browserProfile?: string;
    guestName: string;
    reuseExistingTab: boolean;
    autoJoin: boolean;
    joinTimeoutMs: number;
    waitForInCallMs: number;
    audioInputCommand: string[];
    audioOutputCommand: string[];
    audioInputCommandOverride?: string[];
    audioOutputCommandOverride?: string[];
    bargeInInputCommand?: string[];
    bargeInRmsThreshold: number;
    bargeInPeakThreshold: number;
    bargeInCooldownMs: number;
  };
  chromeNode: {
    node?: string;
  };
  realtime: MeetingRealtimeEngineConfig["realtime"] & {
    strategy: "agent" | "bidi";
    toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  };
};
type MeetingPluginConfigOptions = {
  defaultRealtimeInstructions: string;
  resolveGatewayOperationTimeoutMs(config: MeetingPluginConfig$1): number;
};
declare function createMeetingPluginConfigSchema(options: MeetingPluginConfigOptions): {
  configSchema: {
    parse: (input: unknown) => MeetingPluginConfig$1;
    uiHints: {
      defaultMode: {
        label: string;
        help: string;
      };
      "chrome.audioBackend": {
        label: string;
        help: string;
      };
      "chrome.browserProfile": {
        label: string;
        advanced: true;
      };
      "chrome.guestName": {
        label: string;
      };
      "chrome.waitForInCallMs": {
        label: string;
        advanced: true;
      };
      "chrome.audioInputCommand": {
        label: string;
        advanced: true;
      };
      "chrome.audioOutputCommand": {
        label: string;
        advanced: true;
      };
      "chromeNode.node": {
        label: string;
        help: string;
        advanced: true;
      };
      "realtime.transcriptionProvider": {
        label: string;
      };
      "realtime.voiceProvider": {
        label: string;
      };
      "realtime.model": {
        label: string;
        advanced: true;
      };
      "realtime.instructions": {
        label: string;
        advanced: true;
      };
      "realtime.introMessage": {
        label: string;
      };
      "realtime.agentId": {
        label: string;
        advanced: true;
      };
      "realtime.toolPolicy": {
        label: string;
        advanced: true;
      };
    };
  };
  defaultAudioInputCommand: string[];
  defaultAudioOutputCommand: string[];
  resolveConfig: (input: unknown) => MeetingPluginConfig$1;
  resolveGatewayOperationTimeoutMs: (config: MeetingPluginConfig$1) => number;
};
//#endregion
//#region src/meeting-bot/plugin-cli.d.ts
type MeetingCliDescriptions = {
  root: string;
  join: string;
  leave: string;
  status: string;
  setup: string;
  testSpeech: string;
  testListen: string;
};
type MeetingCliOptions = {
  callGateway: typeof callGatewayFromCli;
  commandName: string;
  config: MeetingPluginConfig$1;
  descriptions: MeetingCliDescriptions;
  methodPrefix: string;
  program: Command;
  resolveGatewayTimeoutMs(params: {
    config: MeetingPluginConfig$1;
    method: string;
    requestedTimeoutMs?: number;
  }): number;
};
declare function registerMeetingPluginCli(options: MeetingCliOptions): void;
//#endregion
//#region src/meeting-bot/plugin-entry.d.ts
type MeetingMode = "agent" | "bidi" | "transcribe";
type MeetingTransport = "chrome" | "chrome-node";
type MeetingJoinRequest = MeetingPluginJoinRequest<MeetingTransport, MeetingMode>;
type MeetingPluginConfig = Pick<MeetingPluginConfig$1, "enabled" | "chromeNode">;
type MeetingPluginRuntime<Request extends MeetingJoinRequest> = Partial<MeetingTranscriptSourceRuntime> & {
  join(request: Request): Promise<unknown>;
  leave(sessionId: string): Promise<unknown>;
  ownsSession(agentId: string, sessionId: string): boolean;
  setupStatus(params: {
    mode?: MeetingMode;
    transport?: MeetingTransport;
  }): Promise<unknown>;
  speak(sessionId: string, message?: string): Promise<unknown>;
  status(sessionId?: string): Promise<unknown>;
  statusForAgent(agentId: string, sessionId?: string): Promise<unknown>;
  testListen(request: Request): Promise<unknown>;
  testSpeech(request: Request): Promise<unknown>;
  transcript(sessionId: string, options: {
    sinceIndex?: number;
  }): Promise<unknown>;
  reconcileTranscriptPolicy?(enabled: boolean): Promise<void>;
};
type MeetingPluginEntryOptions<Config extends MeetingPluginConfig, Request extends MeetingJoinRequest, Runtime extends MeetingPluginRuntime<Request>> = {
  cap: string;
  configSchema: OpenClawPluginConfigSchema & {
    parse(value: unknown): Config;
  };
  createNodePolicy(config: Config): OpenClawPluginNodeInvokePolicy;
  createRuntime(params: {
    api: OpenClawPluginApi;
    config: Config;
  }): Runtime;
  description: string;
  disabledMessage: string;
  gatewayMethodPrefix: string;
  id: string;
  invalidRequest(message: string): Error;
  isInvalidRequest(error: unknown): boolean;
  name: string;
  nodeCommand: string;
  nodeHandler: {
    (paramsJSON?: string | null): Promise<string>;
    hasActiveWork?: () => boolean;
  };
  normalizeRequesterSessionKey(value: unknown, trustedOwner: boolean): string | undefined;
  normalizeToolAgentId(agentId: string | undefined): string | undefined;
  normalizeUrl(url: string): string;
  registerCli(api: OpenClawPluginApi, config: Config): void;
  registerNodeWhen(config: Config): boolean;
  resolveGatewayTimeoutMs(config: Config): number;
  resolveToolRuntime(api: OpenClawPluginApi, agentId: string | undefined): Promise<OpenClawPluginApi["runtime"] | undefined>;
  toolDescription: string;
  toolLabel: string;
  toolName: string;
  toolParameters: TObject;
  transcriptSource?: {
    id: string;
    aliases?: readonly string[];
    name: string;
  };
  unknownActionMessage: string;
};
declare function createMeetingPluginEntryOptions<Config extends MeetingPluginConfig, Request extends MeetingJoinRequest, Runtime extends MeetingPluginRuntime<Request>>(options: MeetingPluginEntryOptions<Config, Request, Runtime>): {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema & {
    parse(value: unknown): Config;
  };
  register(api: OpenClawPluginApi): void;
};
//#endregion
//#region src/meeting-bot/node-invoke-policy.d.ts
type MeetingBrowserNodeStartConfig = {
  launch: boolean;
  browserProfile?: string;
  joinTimeoutMs: number;
  audioBackend?: MeetingAudioBackendSelection;
  audioBufferBytes?: number;
  audioFormat?: MeetingRealtimeAudioFormat;
  audioInputCommand?: string[];
  audioInputCommandOverride?: string[];
  audioOutputCommand?: string[];
  audioOutputCommandOverride?: string[];
  bargeInInputCommand?: string[];
  audioBridgeCommand?: string[];
  audioBridgeHealthCommand?: string[];
};
type MeetingBrowserNodePolicyOptions = {
  commandName: string;
  displayName: string;
  deniedCode: string;
  supportedModes: ReadonlySet<string>;
  normalizeUrl(input: unknown): string;
  useConfiguredSetupCommands?: boolean;
  start: MeetingBrowserNodeStartConfig;
};
export declare function createMeetingBrowserNodeInvokePolicy(options: MeetingBrowserNodePolicyOptions): OpenClawPluginNodeInvokePolicy;
//#endregion
//#region src/meeting-bot/runtime-probes.d.ts
declare function resolveMeetingProbeTimeoutMs(input: number | undefined, fallback: number, invalidRequest?: (message: string) => Error): number;
type MeetingProbeSession<Health extends MeetingPluginProbeHealth> = {
  id: string;
  chrome?: {
    launched: boolean;
    browserTab?: {
      targetId?: string;
    };
    health?: Health;
  };
};
type MeetingProbeRequest<Transport extends string> = MeetingPluginJoinRequest<Transport, string>;
type MeetingProbeConfig<Mode extends string> = {
  defaultMode: Mode;
  chrome: {
    joinTimeoutMs: number;
  };
  chromeNode: {
    node?: string;
  };
};
type MeetingProbeContext<Config extends MeetingProbeConfig<Mode>, Mode extends string, Transport extends string, Health extends MeetingPluginProbeHealth, Session extends MeetingProbeSession<Health>, Request extends MeetingProbeRequest<Transport>> = {
  config: Config;
  resolveAgentId(request: Request): string;
  list(): Session[];
  join(request: Request): Promise<{
    session: Session;
    spoken?: boolean;
  }>;
  isReusable(session: Session, resolved: {
    url: string;
    transport: Transport;
    mode: Mode;
    agentId: string;
  }): boolean;
  hasHealthHandle(sessionId: string): boolean;
  refreshHealth(sessionId: string): void;
  refreshCaptionHealth(session: Session, timeoutMs?: number): Promise<void>;
};
type MeetingRuntimeProbeOptions<Mode extends string, Health extends MeetingPluginProbeHealth, Session extends MeetingProbeSession<Health>> = {
  defaultSpeechMessage: string;
  invalidRequest(message: string): Error;
  resolveTimeoutMs(input: number | undefined, fallback: number): number;
  shouldWaitForListening(session: Session): boolean;
  talkBackMode(mode: Mode): boolean;
};
declare function createMeetingRuntimeProbes<Config extends MeetingProbeConfig<Mode>, Mode extends string, Transport extends string, Health extends MeetingPluginProbeHealth, Session extends MeetingProbeSession<Health>, Request extends MeetingProbeRequest<Transport>>(options: MeetingRuntimeProbeOptions<Mode, Health, Session> & {
  normalizeUrl?(url: string): string;
  resolveRequestMode?(mode: Request["mode"], config: Config): Mode | undefined;
  defaultTransport?(config: Config): Transport;
  validateListeningTransport?(transport: Transport): void;
  resolveSpeechTimeoutMs?(request: Request, config: Config): number;
  refreshCaptionHealth?(context: MeetingProbeContext<Config, Mode, Transport, Health, Session, Request>, session: Session, timeoutMs: number): Promise<void>;
  speechModeError?: string;
  listeningModeError?: string;
}): {
  testListening: (context: MeetingProbeContext<Config, Mode, Transport, Health, Session, Request>, request: Request) => Promise<{
    createdSession: boolean;
    inCall: boolean | undefined;
    manualAction: {
      reason: string;
      message: string;
    } | undefined;
    listenVerified: boolean;
    listenTimedOut: boolean;
    captioning: boolean | undefined;
    captionsEnabledAttempted: boolean | undefined;
    transcriptLines: number | undefined;
    lastCaptionAt: string | undefined;
    lastCaptionSpeaker: string | undefined;
    lastCaptionText: string | undefined;
    recentTranscript: {
      at?: string;
      speaker?: string;
      text: string;
    }[] | undefined;
    session: Session;
  }>;
  testSpeech: (context: MeetingProbeContext<Config, Mode, Transport, Health, Session, Request>, request: Request) => Promise<{
    createdSession: boolean;
    inCall: boolean | undefined;
    manualAction: {
      reason: string;
      message: string;
    } | undefined;
    spoken: boolean;
    speechOutputVerified: boolean;
    speechOutputTimedOut: boolean;
    speechReady: boolean | undefined;
    speechBlockedReason: string | undefined;
    speechBlockedMessage: string | undefined;
    audioOutputActive: boolean | undefined;
    lastOutputBytes: number | undefined;
    outputLoopbackSignalBytes: number | undefined;
    lastOutputLoopbackAt: string | undefined;
    lastOutputLoopbackCorrelation: number | undefined;
    lastOutputLoopbackRms: number | undefined;
    lastOutputLoopbackPeak: number | undefined;
    outputGeneration: number | undefined;
    verifiedOutputGeneration: number | undefined;
    session: Session;
  }>;
};
//#endregion
//#region src/meeting-bot/plugin-shell.d.ts
type MeetingPluginShellPlatform = {
  browserLabel: string;
  displayName: string;
  id: string;
  nodeCommandName: string;
  session: {
    idPrefix: string;
  };
  urls: {
    validateAndNormalize(input: unknown): string;
    normalizeForReuse(url: string | undefined): string | undefined;
  };
};
type MeetingPluginNodeHostOptions = {
  browserPageName: string;
  defaultAudioInputCommand: readonly string[];
  defaultAudioOutputCommand: readonly string[];
  meetingLabel: string;
  platform: MeetingPluginShellPlatform;
  sharePrerequisiteDeadline: boolean;
};
declare function createMeetingPluginNodeHostHandler(options: MeetingPluginNodeHostOptions): ((paramsJSON?: string | null) => Promise<string>) & {
  hasActiveWork: () => boolean;
};
declare function createMeetingPluginNodeInvokePolicy(config: {
  chrome: Parameters<typeof createMeetingBrowserNodeInvokePolicy>[0]["start"];
}, options: {
  deniedCode: string;
  platform: MeetingPluginShellPlatform;
}): OpenClawPluginNodeInvokePolicy;
declare function createMeetingChromeRuntimeBindings(): {
  createBindings: typeof createMeetingRealtimeEngineBindings;
  createLocalAudioTransport: typeof createLocalMeetingRealtimeAudioTransport;
  createNodeAudioTransport: typeof createNodeMeetingRealtimeAudioTransport;
  startAgentRealtimeEngine: typeof startMeetingAgentRealtimeEngine;
  startRealtimeEngine: typeof startMeetingRealtimeEngine;
};
declare function createMeetingPluginChromeTransport<Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot>(options: Omit<MeetingChromeTransportOptions<Mode, Health, Transcript>, "browserNodeAdapter" | "isRealtimeRouteReady" | "isTalkBackMode" | "nodeCommandName">): {
  assertAudioDeviceAvailable: (params: {
    runtime: PluginRuntime;
    config: MeetingChromeTransportConfig;
    timeoutMs: number;
  }) => Promise<void>;
  launchInChrome: (params: MeetingChromeLaunchParams<MeetingChromeTransportConfig, Mode>) => Promise<{
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: CommandPairAudioBridge | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  launchOnNode: (params: MeetingChromeLaunchParams<MeetingChromeTransportConfig, Mode>) => Promise<{
    nodeId: string;
    launched: boolean;
    audioBackend?: MeetingAudioBackend;
    audioBridge?: NodeAudioBridge | undefined;
    browser?: Health | undefined;
    tab?: MeetingBrowserTab;
  }>;
  leaveInBrowser: (params: {
    runtime: PluginRuntime;
    config: MeetingChromeTransportConfig;
    meetingSessionId: string;
    meetingUrl: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<{
    left: boolean;
    note: string;
  }>;
  readTranscript: (params: {
    runtime: PluginRuntime;
    config: MeetingChromeTransportConfig;
    finalize?: boolean;
    meetingUrl: string;
    meetingSessionId: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }) => Promise<Transcript>;
  recoverCurrentTab: (params: MeetingChromeRecoveryParams<MeetingChromeTransportConfig, Mode>) => Promise<{
    found: boolean;
    targetId?: string;
    tab?: MeetingBrowserCandidateTab;
    browser?: Health | undefined;
    message: string;
    transport: "chrome" | "chrome-node";
    nodeId?: string | undefined;
  }>;
};
type MeetingPluginShellEntryOptions<Config extends MeetingPluginConfig, Request extends MeetingJoinRequest, Runtime extends MeetingPluginRuntime<Request>> = Omit<MeetingPluginEntryOptions<Config, Request, Runtime>, "cap" | "createRuntime" | "description" | "disabledMessage" | "gatewayMethodPrefix" | "id" | "name" | "nodeCommand" | "normalizeUrl" | "registerCli" | "toolDescription" | "toolLabel" | "toolName" | "transcriptSource" | "unknownActionMessage"> & {
  cli: {
    descriptor: OpenClawPluginCliRootCommandDescriptor;
    load(): Promise<(params: {
      program: Command;
      config: Config;
    }) => void>;
  };
  browserGuestLabel: string;
  platform: MeetingPluginShellPlatform;
  runtime: new (params: {
    config: Config;
    fullConfig: OpenClawPluginApi["config"];
    logger: OpenClawPluginApi["logger"];
    runtime: OpenClawPluginApi["runtime"];
  }) => Runtime;
  transcriptSource: {
    aliases?: readonly string[];
    id: string;
  };
};
declare function createMeetingPluginShellEntry<Config extends MeetingPluginConfig, Request extends MeetingJoinRequest, Runtime extends MeetingPluginRuntime<Request>>(options: MeetingPluginShellEntryOptions<Config, Request, Runtime>): {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema & {
    parse(value: unknown): Config;
  };
  register(api: OpenClawPluginApi): void;
};
declare function createMeetingPluginTypes<Config extends MeetingPluginConfig$1, Transport extends string, Mode extends string, ManualReason extends string, SpeechBlockedReason extends string, ExtraHealth extends object = object>(): {
  BrowserTab: MeetingBrowserTab;
  ChromeHealth: MeetingBrowserHealth<ManualReason, SpeechBlockedReason> & MeetingBrowserHealth<string, string> & {
    audioOutputActive?: boolean;
    captioning?: boolean;
    captionsEnabledAttempted?: boolean;
    lastCaptionAt?: string;
    lastCaptionSpeaker?: string;
    lastCaptionText?: string;
    lastOutputBytes?: number;
    recentTranscript?: Array<{
      at?: string;
      speaker?: string;
      text: string;
    }>;
    transcriptLines?: number;
  } & {
    cameraOff?: boolean;
    lobbyWaiting?: boolean;
    captionCaptureRequested?: boolean;
    audioInputRouted?: boolean;
    audioInputDeviceLabel?: string;
    audioInputRouteError?: string;
    audioOutputRouted?: boolean;
    audioOutputDeviceLabel?: string;
    audioOutputRouteError?: string;
    audioOutputRouteRetryable?: boolean;
    providerConnected?: boolean;
    realtimeReady?: boolean;
    audioInputActive?: boolean;
    lastInputAt?: string;
    lastOutputAt?: string;
    lastInputBytes?: number;
    bridgeClosed?: boolean;
    browserUrl?: string;
    browserTitle?: string;
    status?: string;
    notes?: string[];
  } & ExtraHealth;
  JoinRequest: MeetingPluginJoinRequest<Transport, Mode>;
  JoinResult: MeetingPluginJoinResult<MeetingPluginSession<Transport, Mode, MeetingBrowserHealth<ManualReason, SpeechBlockedReason> & MeetingBrowserHealth<string, string> & {
    audioOutputActive?: boolean;
    captioning?: boolean;
    captionsEnabledAttempted?: boolean;
    lastCaptionAt?: string;
    lastCaptionSpeaker?: string;
    lastCaptionText?: string;
    lastOutputBytes?: number;
    recentTranscript?: Array<{
      at?: string;
      speaker?: string;
      text: string;
    }>;
    transcriptLines?: number;
  } & {
    cameraOff?: boolean;
    lobbyWaiting?: boolean;
    captionCaptureRequested?: boolean;
    audioInputRouted?: boolean;
    audioInputDeviceLabel?: string;
    audioInputRouteError?: string;
    audioOutputRouted?: boolean;
    audioOutputDeviceLabel?: string;
    audioOutputRouteError?: string;
    audioOutputRouteRetryable?: boolean;
    providerConnected?: boolean;
    realtimeReady?: boolean;
    audioInputActive?: boolean;
    lastInputAt?: string;
    lastOutputAt?: string;
    lastInputBytes?: number;
    bridgeClosed?: boolean;
    browserUrl?: string;
    browserTitle?: string;
    status?: string;
    notes?: string[];
  } & ExtraHealth>>;
  ProbeContext: MeetingProbeContext<Config & {
    defaultMode: Mode;
  }, Mode, Transport, MeetingBrowserHealth<ManualReason, SpeechBlockedReason> & MeetingBrowserHealth<string, string> & {
    audioOutputActive?: boolean;
    captioning?: boolean;
    captionsEnabledAttempted?: boolean;
    lastCaptionAt?: string;
    lastCaptionSpeaker?: string;
    lastCaptionText?: string;
    lastOutputBytes?: number;
    recentTranscript?: Array<{
      at?: string;
      speaker?: string;
      text: string;
    }>;
    transcriptLines?: number;
  } & {
    cameraOff?: boolean;
    lobbyWaiting?: boolean;
    captionCaptureRequested?: boolean;
    audioInputRouted?: boolean;
    audioInputDeviceLabel?: string;
    audioInputRouteError?: string;
    audioOutputRouted?: boolean;
    audioOutputDeviceLabel?: string;
    audioOutputRouteError?: string;
    audioOutputRouteRetryable?: boolean;
    providerConnected?: boolean;
    realtimeReady?: boolean;
    audioInputActive?: boolean;
    lastInputAt?: string;
    lastOutputAt?: string;
    lastInputBytes?: number;
    bridgeClosed?: boolean;
    browserUrl?: string;
    browserTitle?: string;
    status?: string;
    notes?: string[];
  } & ExtraHealth, MeetingPluginSession<Transport, Mode, MeetingBrowserHealth<ManualReason, SpeechBlockedReason> & MeetingBrowserHealth<string, string> & {
    audioOutputActive?: boolean;
    captioning?: boolean;
    captionsEnabledAttempted?: boolean;
    lastCaptionAt?: string;
    lastCaptionSpeaker?: string;
    lastCaptionText?: string;
    lastOutputBytes?: number;
    recentTranscript?: Array<{
      at?: string;
      speaker?: string;
      text: string;
    }>;
    transcriptLines?: number;
  } & {
    cameraOff?: boolean;
    lobbyWaiting?: boolean;
    captionCaptureRequested?: boolean;
    audioInputRouted?: boolean;
    audioInputDeviceLabel?: string;
    audioInputRouteError?: string;
    audioOutputRouted?: boolean;
    audioOutputDeviceLabel?: string;
    audioOutputRouteError?: string;
    audioOutputRouteRetryable?: boolean;
    providerConnected?: boolean;
    realtimeReady?: boolean;
    audioInputActive?: boolean;
    lastInputAt?: string;
    lastOutputAt?: string;
    lastInputBytes?: number;
    bridgeClosed?: boolean;
    browserUrl?: string;
    browserTitle?: string;
    status?: string;
    notes?: string[];
  } & ExtraHealth>, MeetingPluginJoinRequest<Transport, Mode>>;
  Session: MeetingPluginSession<Transport, Mode, MeetingBrowserHealth<ManualReason, SpeechBlockedReason> & MeetingBrowserHealth<string, string> & {
    audioOutputActive?: boolean;
    captioning?: boolean;
    captionsEnabledAttempted?: boolean;
    lastCaptionAt?: string;
    lastCaptionSpeaker?: string;
    lastCaptionText?: string;
    lastOutputBytes?: number;
    recentTranscript?: Array<{
      at?: string;
      speaker?: string;
      text: string;
    }>;
    transcriptLines?: number;
  } & {
    cameraOff?: boolean;
    lobbyWaiting?: boolean;
    captionCaptureRequested?: boolean;
    audioInputRouted?: boolean;
    audioInputDeviceLabel?: string;
    audioInputRouteError?: string;
    audioOutputRouted?: boolean;
    audioOutputDeviceLabel?: string;
    audioOutputRouteError?: string;
    audioOutputRouteRetryable?: boolean;
    providerConnected?: boolean;
    realtimeReady?: boolean;
    audioInputActive?: boolean;
    lastInputAt?: string;
    lastOutputAt?: string;
    lastInputBytes?: number;
    bridgeClosed?: boolean;
    browserUrl?: string;
    browserTitle?: string;
    status?: string;
    notes?: string[];
  } & ExtraHealth>;
  TranscriptSnapshot: MeetingTranscriptSnapshot;
};
//#endregion
//#region src/meeting-bot/runtime-facade-types.d.ts
type MeetingRuntimeParams<Config extends MeetingPluginConfig$1> = {
  config: Config;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  logger: RuntimeLogger;
};
type MeetingRuntimePlatform$1<Mode extends string, Health extends MeetingBrowserHealth> = MeetingPlatformAdapter$1<MeetingBrowserJoinSession<Mode>, Mode, Health, MeetingTranscriptSnapshot> & MeetingPlatformRuntimeMetadata;
type MeetingRuntimeAudioBridge<Health extends MeetingBrowserHealth> = MeetingSessionRuntimeHandles<Health> & {
  providerId?: string;
  type: "command-pair" | "node-command-pair";
};
type MeetingRuntimeLaunchResult<Health extends MeetingBrowserHealth> = {
  launched: boolean;
  audioBackend?: MeetingAudioBackend;
  audioBridge?: MeetingRuntimeAudioBridge<Health>;
  browser?: Health;
  nodeId?: string;
  tab?: MeetingBrowserTab;
};
type MeetingRuntimeLaunchParams<Config extends MeetingPluginConfig$1, Mode extends string> = {
  runtime: PluginRuntime;
  config: Config;
  fullConfig: OpenClawConfig;
  meetingSessionId: string;
  requesterSessionKey?: string;
  mode: Mode;
  trackedTargetId?: string;
  url: string;
  logger: RuntimeLogger;
};
type MeetingRuntimeTransport<Config extends MeetingPluginConfig$1, Mode extends string, Health extends MeetingBrowserHealth> = {
  launchInChrome(params: MeetingRuntimeLaunchParams<Config, Mode>): Promise<MeetingRuntimeLaunchResult<Health>>;
  launchOnNode(params: MeetingRuntimeLaunchParams<Config, Mode>): Promise<MeetingRuntimeLaunchResult<Health> & {
    nodeId: string;
  }>;
  leaveInBrowser(params: {
    runtime: PluginRuntime;
    config: Config;
    meetingSessionId: string;
    meetingUrl: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }): Promise<{
    left: boolean;
    note: string;
  }>;
  readTranscript(params: {
    runtime: PluginRuntime;
    config: Config;
    finalize?: boolean;
    meetingUrl: string;
    meetingSessionId: string;
    nodeId?: string;
    tab: MeetingBrowserTab;
  }): Promise<MeetingTranscriptSnapshot>;
  recoverCurrentTab(params: {
    runtime: PluginRuntime;
    config: Config;
    fullConfig?: OpenClawConfig;
    meetingSessionId?: string;
    mode: Mode;
    nodeId?: string;
    readOnly?: boolean;
    trackedMeetingUrl?: string;
    trackedTargetId?: string;
    transport: "chrome" | "chrome-node";
    timeoutMs?: number;
    url?: string;
  }): Promise<{
    browser?: Health;
    found: boolean;
    message: string;
    tab?: MeetingBrowserCandidateTab;
  }>;
};
type MeetingRuntimeManualActionReason<Health extends MeetingBrowserHealth> = NonNullable<Health["manualAction"]>["reason"];
type MeetingRuntimeSpeechBlockedReason<Health extends MeetingBrowserHealth> = NonNullable<Health["speechBlockedReason"]>;
type MeetingRuntimeSession<Transport extends string, Mode extends string, Health extends MeetingBrowserHealth> = MeetingPluginSession<Transport, Mode, Health>;
type MeetingRuntimeRequest<Transport extends string, Mode extends string> = MeetingPluginJoinRequest<Transport, Mode>;
type MeetingRuntimeProbeResults = {
  setup: unknown;
  listening: unknown;
  speech: unknown;
};
type MeetingRuntimeOwner<Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingBrowserHealth> = MeetingSessionRuntime<MeetingRuntimeSession<Transport, Mode, Health>, MeetingRuntimeRequest<Transport, Mode>, Transport, Mode, Health, MeetingBrowserTab, MeetingRuntimeManualActionReason<Health>, MeetingRuntimeSpeechBlockedReason<Health>>;
type MeetingRuntimeFacadeInstance<Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingPluginChromeHealth<string, string>, Results extends MeetingRuntimeProbeResults> = Pick<MeetingRuntimeOwner<Transport, Mode, Health>, "join" | "leave" | "reconcileTranscriptPolicy" | "speak" | "startTranscriptSource" | "status" | "stopTranscriptSource" | "transcript"> & {
  list(): MeetingRuntimeSession<Transport, Mode, Health>[];
  ownsSession(agentId: string, sessionId: string): boolean;
  setupStatus(options?: {
    mode?: Mode;
    transport?: Transport;
  }): Promise<Results["setup"]>;
  statusForAgent(agentId: string, sessionId?: string): Promise<{
    found: boolean;
    session?: MeetingRuntimeSession<Transport, Mode, Health>;
    sessions?: MeetingRuntimeSession<Transport, Mode, Health>[];
  }>;
  testListen(request: MeetingRuntimeRequest<Transport, Mode>): Promise<Results["listening"]>;
  testSpeech(request: MeetingRuntimeRequest<Transport, Mode>): Promise<Results["speech"]>;
};
type MeetingRuntimeFacadeConstructor<Config extends MeetingPluginConfig$1, Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingPluginChromeHealth<string, string>, Results extends MeetingRuntimeProbeResults> = new (params: MeetingRuntimeParams<Config>) => MeetingRuntimeFacadeInstance<Transport, Mode, Health, Results>;
type MeetingRuntimeHookContext<Session extends MeetingPluginSession<Transport, Mode, Health>, Request extends MeetingPluginJoinRequest<Transport, Mode>, Transport extends string, Mode extends string, Health extends MeetingBrowserHealth> = {
  deleteRequesterSessionKey(sessionId: string): void;
  endSession(sessionId: string, options?: {
    keepBrowserTab?: boolean;
  }): Promise<void>;
  noteSession(session: Session, note: string): void;
  refreshBrowserHealth(session: Session, options?: {
    force?: boolean;
    readOnly?: boolean;
  }): Promise<void>;
  resolvedJoin(request: Request): MeetingResolvedJoin<Transport, Mode>;
};
type MeetingRuntimeHooks<Session extends MeetingPluginSession<Transport, Mode, Health>, Request extends MeetingPluginJoinRequest<Transport, Mode>, Transport extends string, Mode extends string, Health extends MeetingBrowserHealth> = {
  afterStatusRefresh?(session: Session, context: MeetingRuntimeHookContext<Session, Request, Transport, Mode, Health>): Promise<void>;
  afterAudioBridgeAttached?(session: Session): void;
  isAudioBridgeActive?(session: Session): boolean;
  isAwaitingAdmission?(session: Session): boolean;
  normalizeJoinRequest?(request: Request, context: MeetingRuntimeHookContext<Session, Request, Transport, Mode, Health>): Request;
  recordBrowserRecoveryFailure?(session: Session, failure: {
    kind: "missing" | "error";
    message: string;
  }): void;
  refreshReusableSession?(session: Session, request: Request, context: MeetingRuntimeHookContext<Session, Request, Transport, Mode, Health>): Promise<{
    keepBrowserTab: boolean;
  } | void>;
  validateLaunchResult?(result: MeetingRuntimeLaunchResult<Health>): void;
};
type MeetingRuntimeMessages<Health extends MeetingBrowserHealth> = {
  browserReadinessFailed?(error: string): string;
  durableTranscripts: {
    providerId: string;
    providerName: string;
  };
  joined: {
    local: string;
    node: string;
    transcribe: string;
    waiting: string;
  };
  leaveFailed(error: string): string;
  noTrackedTab: string;
  sessionRuntime: MeetingSessionRuntimeMessages<MeetingRuntimeSpeechBlockedReason<Health>>;
  sharedTab: string;
};
type MeetingRuntimeProbeContext<Config extends MeetingPluginConfig$1 & {
  defaultMode: Mode;
}, Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingPluginChromeHealth<string, string>> = MeetingProbeContext<Config, Mode, Transport, Health, MeetingRuntimeSession<Transport, Mode, Health>, MeetingRuntimeRequest<Transport, Mode>>;
type MeetingRuntimeFacadeOptions<Config extends MeetingPluginConfig$1 & {
  defaultMode: Mode;
}, Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingPluginChromeHealth<string, string>, Results extends MeetingRuntimeProbeResults> = {
  hooks?: MeetingRuntimeHooks<MeetingRuntimeSession<Transport, Mode, Health>, MeetingRuntimeRequest<Transport, Mode>, Transport, Mode, Health>;
  messages: MeetingRuntimeMessages<Health>;
  platform: MeetingRuntimePlatform$1<Mode, Health>;
  probes: {
    setupStatus(params: MeetingRuntimeParams<Config> & {
      options?: {
        mode?: Mode;
        transport?: Transport;
      };
    }): Promise<Results["setup"]>;
    testListening(context: MeetingRuntimeProbeContext<Config, Transport, Mode, Health>, request: MeetingRuntimeRequest<Transport, Mode>): Promise<Results["listening"]>;
    testSpeech(context: MeetingRuntimeProbeContext<Config, Transport, Mode, Health>, request: MeetingRuntimeRequest<Transport, Mode>): Promise<Results["speech"]>;
  };
  transport: MeetingRuntimeTransport<Config, Mode, Health>;
};
//#endregion
//#region src/meeting-bot/runtime-facade.d.ts
declare function createMeetingRuntimeFacade<Config extends MeetingPluginConfig$1 & {
  defaultMode: Mode;
}, Transport extends "chrome" | "chrome-node", Mode extends string, Health extends MeetingPluginChromeHealth<string, string>, Results extends MeetingRuntimeProbeResults>(options: MeetingRuntimeFacadeOptions<Config, Transport, Mode, Health, Results>): MeetingRuntimeFacadeConstructor<Config, Transport, Mode, Health, Results>;
//#endregion
//#region src/meeting-bot/setup-checks.d.ts
type MeetingSetupCheck = {
  id: string;
  ok: boolean;
  message: string;
};
type MeetingSetupStatus = {
  ok: boolean;
  checks: MeetingSetupCheck[];
};
export declare function createMeetingSetupStatus(checks: MeetingSetupCheck[]): MeetingSetupStatus;
export declare function addMeetingSetupCheck(status: MeetingSetupStatus, check: MeetingSetupCheck): MeetingSetupStatus;
//#endregion
//#region src/meeting-bot/runtime-setup.d.ts
type MeetingSetupNodeAdapter = {
  displayName: string;
  nodeCommandName: string;
  nodeConfigPath: string;
};
type MeetingRuntimeSetupOptions<Config extends MeetingPluginConfig$1, Mode extends string> = {
  assertAudioDeviceAvailable(params: {
    config: Config;
    runtime: PluginRuntime;
    timeoutMs: number;
  }): Promise<void>;
  captionsMessage(mode: Mode): string;
  connectedNodeMessage(nodeLabel: string | undefined): string;
  guestJoinCheck(config: Config): {
    message: string;
    ok: boolean;
  };
  missingNodeIdMessage: string;
  nodeAdapter: MeetingSetupNodeAdapter;
};
declare function createMeetingRuntimeSetup<Config extends MeetingPluginConfig$1, Mode extends string>(options: MeetingRuntimeSetupOptions<Config, Mode>): (params: {
  config: Config;
  fullConfig: OpenClawConfig;
  runtime: PluginRuntime;
  options?: {
    mode?: Mode;
    transport?: "chrome" | "chrome-node";
  };
}) => Promise<MeetingSetupStatus>;
//#endregion
//#region src/meeting-bot/status-call-source.d.ts
type MeetingStatusCallSourceOptions = {
  captionEnableSource: string;
  captionSettleMs?: number;
  platform: {
    audioOutputElementIdPrefix: string;
    displayName: string;
    globals: {
      audioOutputs: string;
      captions: string;
      meeting: string;
    };
    manualActionReasonPrefix: string;
  };
  extraResultSource?: string;
  transcriptMaxLines?: number;
};
declare function createMeetingStatusCallSource(options: MeetingStatusCallSourceOptions): string;
//#endregion
//#region src/meeting-bot/status-prejoin-source.d.ts
type MeetingStatusPreludeParams = {
  allowMicrophone: boolean;
  allowSessionAdoption: boolean;
  autoJoin: boolean;
  captureCaptions: boolean;
  expectedIdentity?: string;
  guestName: string;
  meetingSessionId?: string;
  pageIdentitySource: string;
  readOnly?: boolean;
  selectors: string;
  toggleStateFunction: string;
  waitForInCallMs: number;
};
type MeetingStatusPreludeSourceOptions = {
  controlLookupSource: string;
  lifecycleSource: string;
  manualActionSource: string;
  platform: {
    displayName: string;
    globals: {
      audioOutputs: string;
      captionArchive: string;
      captions: string;
      meeting: string;
    };
    manualActionReasonPrefix: string;
  };
  setupSource?: string;
  transcriptMaxLines?: number;
};
declare function createMeetingStatusPreludeSource(params: MeetingStatusPreludeParams, options: MeetingStatusPreludeSourceOptions): string;
//#endregion
//#region src/meeting-bot/platform-adapter.d.ts
export interface MeetingPlatformAdapter<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot, CreateParams = never, CreateResult = never, DialInParams = never, DialInPlan = never> extends MeetingPlatformAdapter$1<Session, Mode, Health, Transcript, CreateParams, CreateResult, DialInParams, DialInPlan> {}
type MeetingPlatformAdapterOptions<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot, CreateParams = never, CreateResult = never, DialInParams = never, DialInPlan = never> = Omit<MeetingPlatformAdapter<Session, Mode, Health, Transcript, CreateParams, CreateResult, DialInParams, DialInPlan>, "agentConsult" | "browser" | "session"> & {
  agentConsult: MeetingPlatformRuntimeMetadata["agentConsult"];
  browser: Omit<MeetingBrowserAdapter<Mode, Health, Transcript>, "captions" | "classifyManualAction" | "parseLeaveResult" | "parseStatus" | "permissionNotes"> & {
    captions: Omit<MeetingBrowserAdapter<Mode, Health, Transcript>["captions"], "parseTranscript">;
    permissionNotes?: MeetingBrowserAdapter<Mode, Health, Transcript>["permissionNotes"];
  };
  parsing: {
    classifyManualActionReason(reason: string): MeetingManualActionCategory;
    displayName: string;
    invalidTranscriptMessage: string;
    malformedStatusMessage: string;
    malformedTranscriptMessage: string;
    statusFields?(parsed: Record<string, unknown>): Partial<Health>;
  };
  session: MeetingPlatformRuntimeMetadata["session"];
};
declare function createMeetingPlatformAdapter<Session, Mode extends string, Health extends MeetingBrowserHealth, Transcript extends MeetingTranscriptSnapshot, CreateParams = never, CreateResult = never, DialInParams = never, DialInPlan = never>(options: MeetingPlatformAdapterOptions<Session, Mode, Health, Transcript, CreateParams, CreateResult, DialInParams, DialInPlan>): MeetingPlatformAdapter<Session, Mode, Health, Transcript, CreateParams, CreateResult, DialInParams, DialInPlan> & MeetingPlatformRuntimeMetadata;
export declare const MeetingPlatformAdapter: {
  create: typeof createMeetingPlatformAdapter;
  createChromeTransport: typeof createMeetingChromeTransport;
  createChromeTransportWithExternalAudio: typeof createMeetingChromeTransportWithExternalAudio;
  createChromeRuntimeBindings: typeof createMeetingChromeRuntimeBindings;
  createPluginChromeTransport: typeof createMeetingPluginChromeTransport;
  createPluginConfigSchema: typeof createMeetingPluginConfigSchema;
  createPluginNodeHostHandler: typeof createMeetingPluginNodeHostHandler;
  createPluginNodeInvokePolicy: typeof createMeetingPluginNodeInvokePolicy;
  createPluginShellEntry: typeof createMeetingPluginShellEntry;
  createRuntimeFacade: typeof createMeetingRuntimeFacade;
  createRuntimeSetup: typeof createMeetingRuntimeSetup;
  pluginTypes: typeof createMeetingPluginTypes;
  registerPluginCli: typeof registerMeetingPluginCli;
  resolveProbeTimeoutMs: typeof resolveMeetingProbeTimeoutMs;
  createRuntimeProbes: typeof createMeetingRuntimeProbes;
  createNodeHostHandler: typeof createMeetingConfiguredNodeHost;
  createPluginEntry: typeof createMeetingPluginEntryOptions;
  createStatusCallSource: typeof createMeetingStatusCallSource;
  createStatusPreludeSource: typeof createMeetingStatusPreludeSource;
  isRealtimeRouteReady: typeof isMeetingRealtimeRouteReady;
  isTalkBackMode: typeof isMeetingTalkBackMode;
  ensureAudioBackend: typeof ensureMeetingAudioBackend;
  resolveAudioRuntimeForFormat: typeof resolveMeetingAudioRuntimeForFormat;
};
//#endregion
//#region src/meeting-bot/voice-call-gateway.d.ts
type MeetingVoiceCallGatewayClient = {
  request(method: string, params: Record<string, unknown>, options: {
    timeoutMs: number;
  }): Promise<unknown>;
  stopAndWait(options: {
    timeoutMs: number;
  }): Promise<void>;
};
type MeetingVoiceCallGateway = {
  trustedPluginIdentity: boolean;
  request: <T>(method: string, params: Record<string, unknown>) => Promise<T>;
};
type MeetingVoiceCallConfig = {
  gatewayUrl?: string;
  token?: string;
  requestTimeoutMs: number;
  postDtmfSpeechDelayMs: number;
};
type MeetingVoiceCallSurface = {
  clientDisplayName: string;
  configPath: string;
  logScope: string;
  meetingLabel: string;
  providerLabel: string;
};
type MeetingVoiceCallStatusResult = {
  found?: boolean;
  call?: unknown;
};
type MeetingVoiceCallJoinResult = {
  callId: string;
  dtmfSent: boolean;
  introSent: boolean;
};
export declare function createMeetingVoiceCallGateway(params: {
  config: MeetingVoiceCallConfig;
  runtime: PluginRuntime;
  surface: MeetingVoiceCallSurface;
  connectClient: (params: {
    config: MeetingVoiceCallConfig;
    surface: MeetingVoiceCallSurface;
  }) => Promise<MeetingVoiceCallGatewayClient>;
}): MeetingVoiceCallGateway;
export declare function isMeetingVoiceCallMissingError(error: unknown): boolean;
export declare function joinMeetingViaVoiceCallGateway(params: {
  config: MeetingVoiceCallConfig;
  gateway: MeetingVoiceCallGateway;
  surface: MeetingVoiceCallSurface;
  dialInNumber: string;
  dtmfSequence?: string;
  logger?: RuntimeLogger;
  message?: string;
  requesterSessionKey?: string;
  agentId?: string;
  sessionKey?: string;
}): Promise<MeetingVoiceCallJoinResult>;
export declare function endMeetingVoiceCallGatewayCall(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
}): Promise<void>;
export declare function getMeetingVoiceCallGatewayCall(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
}): Promise<MeetingVoiceCallStatusResult>;
export declare function speakMeetingViaVoiceCallGateway(params: {
  gateway: MeetingVoiceCallGateway;
  callId: string;
  message: string;
}): Promise<void>;
//#endregion
//#region src/meeting-bot/sox-audio-command.d.ts
type MeetingSoxAudioFormat = {
  sampleRate: number;
  channels: number;
  encoding: string;
  bits: number;
  endian?: "little" | "big";
};
type MeetingSoxAudioCommandParams = {
  bufferBytes: number;
  device?: string;
  deviceType?: string;
  format: MeetingSoxAudioFormat;
  inputExecutable?: string;
  outputExecutable?: string;
};
export declare function buildMeetingSoxAudioCommands(params: MeetingSoxAudioCommandParams): {
  inputCommand: string[];
  outputCommand: string[];
};
//#endregion
export type { MeetingAgentConsultParams, MeetingBrowserCandidateTab, MeetingBrowserControllerConfig, MeetingBrowserHealth, MeetingBrowserJoinSession, MeetingBrowserLeaveStep, MeetingBrowserNodeInfo, MeetingBrowserNodePolicyOptions, MeetingBrowserNodeStartConfig, MeetingBrowserPermissionPlan, MeetingBrowserRequestCaller, MeetingBrowserRequestParams, MeetingBrowserSessionView, MeetingBrowserStatusScriptParams, MeetingBrowserTab, MeetingManualAction, MeetingManualActionCategory, MeetingNodeHostOptions, MeetingRealtimeAudioEngineHandle, MeetingRealtimeAudioEngineHealth, MeetingRealtimeAudioFormat, MeetingRealtimeAudioTransport, MeetingRealtimeAudioTransportHealth, MeetingRealtimeEngineConfig, MeetingRealtimeSessionBlock, MeetingRealtimeToolCallParams, MeetingRuntimePlatform, MeetingSessionLeaveResult, MeetingSessionRecord, MeetingSessionRuntimeHandles, MeetingSessionRuntimeJoinContext, MeetingSessionRuntimeMessages, MeetingSessionRuntimeOptions, MeetingSessionState, MeetingSetupCheck, MeetingSetupStatus, MeetingSoxAudioCommandParams, MeetingSoxAudioFormat, MeetingTranscriptLine, MeetingTranscriptSnapshot, MeetingVoiceCallConfig, MeetingVoiceCallGateway, MeetingVoiceCallGatewayClient, MeetingVoiceCallJoinResult, MeetingVoiceCallStatusResult, MeetingVoiceCallSurface };