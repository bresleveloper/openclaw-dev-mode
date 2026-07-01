import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { t as DiagnosticTraceContext } from "./diagnostic-trace-context-c5mRZYEt.js";

//#region src/talk/talk-events.d.ts
/**
 * Canonical event names emitted by Talk sessions across realtime and STT/TTS flows.
 */
declare const TALK_EVENT_TYPES: readonly ["session.started", "session.ready", "session.closed", "session.error", "session.replaced", "turn.started", "turn.ended", "turn.cancelled", "capture.started", "capture.stopped", "capture.cancelled", "capture.once", "input.audio.delta", "input.audio.committed", "transcript.delta", "transcript.done", "output.text.delta", "output.text.done", "output.audio.started", "output.audio.delta", "output.audio.done", "tool.call", "tool.progress", "tool.result", "tool.error", "usage.metrics", "latency.metrics", "health.changed"];
/**
 * Talk event name accepted by the event sequencer.
 */
type TalkEventType = (typeof TALK_EVENT_TYPES)[number];
/**
 * High-level media mode used to group Talk session telemetry.
 */
type TalkMode = "realtime" | "stt-tts" | "transcription";
/**
 * Transport family carrying Talk audio and session control.
 */
type TalkTransport = "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
/**
 * Brain mode that explains whether Talk output is agent-mediated, tool-only, or passive.
 */
type TalkBrain = "agent-consult" | "direct-tools" | "none";
/**
 * Session-level correlation fields copied onto every Talk event.
 */
type TalkEventContext = {
  sessionId: string;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
};
/**
 * Sequenced Talk event envelope delivered to observers and gateway clients.
 */
type TalkEvent<TPayload = unknown> = TalkEventContext & {
  id: string;
  type: TalkEventType;
  turnId?: string;
  captureId?: string;
  seq: number;
  timestamp: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
  payload: TPayload;
};
/**
 * Caller-supplied event payload before session context, id, sequence, and timestamp are attached.
 */
type TalkEventInput<TPayload = unknown> = {
  type: TalkEventType;
  payload: TPayload;
  turnId?: string;
  captureId?: string;
  timestamp?: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
};
/**
 * Per-session event sequencer that enforces correlation ids before emitting events.
 */
type TalkEventSequencer = {
  next<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
};
/**
 * Creates a sequencer that stamps Talk events with stable session context and monotonic ids.
 */
declare function createTalkEventSequencer(context: TalkEventContext, options?: {
  now?: () => Date | string;
}): TalkEventSequencer;
//#endregion
//#region src/infra/diagnostic-events.d.ts
type DiagnosticSessionState = "idle" | "processing" | "waiting";
type DiagnosticBaseEvent = {
  ts: number;
  seq: number;
  trace?: DiagnosticTraceContext;
};
type DiagnosticUsageEvent = DiagnosticBaseEvent & {
  type: "model.usage";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  agentId?: string;
  provider?: string;
  model?: string;
  usage: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    promptTokens?: number;
    total?: number;
  };
  lastCallUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  context?: {
    limit?: number;
    used?: number;
  };
  costUsd?: number;
  durationMs?: number;
};
type DiagnosticFailoverEvent = DiagnosticBaseEvent & {
  type: "model.failover";
  sessionId?: string;
  sessionKey?: string;
  lane?: string;
  fromProvider?: string;
  fromModel?: string;
  toProvider?: string;
  toModel?: string;
  reason: string;
  cascadeDepth?: number;
  suspended?: boolean;
};
type DiagnosticSecurityEventActor = {
  kind: "operator" | "node" | "agent" | "plugin" | "channel_sender" | "system";
  idHash?: string;
  deviceIdHash?: string;
  channel?: string;
  role?: string;
  scopes?: string[];
};
type DiagnosticSecurityEventTarget = {
  kind: "gateway" | "device" | "node" | "tool" | "plugin" | "secret_ref" | "channel" | "config" | "session";
  idHash?: string;
  name?: string;
  owner?: string;
};
type DiagnosticSecurityEventPolicy = {
  id?: string;
  decision?: "allow" | "deny" | "ask" | "auto" | "full" | "not_applicable";
  reason?: string;
};
type DiagnosticSecurityEventControl = {
  id?: string;
  family?: "auth" | "authorization" | "approval" | "sandbox" | "secret" | "supply_chain";
};
type DiagnosticSecurityEvent = DiagnosticBaseEvent & {
  type: "security.event";
  eventId: string;
  category: "auth" | "approval" | "tool" | "plugin" | "secret" | "channel" | "config" | "audit" | "telemetry";
  action: string;
  outcome: "success" | "failure" | "denied" | "error";
  severity: "info" | "low" | "medium" | "high" | "critical";
  actor?: DiagnosticSecurityEventActor;
  target?: DiagnosticSecurityEventTarget;
  policy?: DiagnosticSecurityEventPolicy;
  control?: DiagnosticSecurityEventControl;
  reason?: string;
  attributes?: Record<string, string | number | boolean>;
};
type DiagnosticSecurityEventInput = Omit<DiagnosticSecurityEvent, "eventId" | "seq" | "ts" | "type"> & {
  eventId?: string;
};
type DiagnosticWebhookReceivedEvent = DiagnosticBaseEvent & {
  type: "webhook.received";
  channel: string;
  updateType?: string;
  chatId?: number | string;
};
type DiagnosticWebhookProcessedEvent = DiagnosticBaseEvent & {
  type: "webhook.processed";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  durationMs?: number;
};
type DiagnosticWebhookErrorEvent = DiagnosticBaseEvent & {
  type: "webhook.error";
  channel: string;
  updateType?: string;
  chatId?: number | string;
  error: string;
};
type DiagnosticMessageQueuedEvent = DiagnosticBaseEvent & {
  type: "message.queued";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
  queueDepth?: number;
};
type DiagnosticMessageReceivedEvent = DiagnosticBaseEvent & {
  type: "message.received";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  messageId?: number | string;
  chatId?: number | string;
  source: string;
};
type DiagnosticMessageDispatchStartedEvent = DiagnosticBaseEvent & {
  type: "message.dispatch.started";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
};
type DiagnosticMessageDispatchCompletedEvent = DiagnosticBaseEvent & {
  type: "message.dispatch.completed";
  sessionKey?: string;
  sessionId?: string;
  channel?: string;
  source: string;
  durationMs: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageProcessedEvent = DiagnosticBaseEvent & {
  type: "message.processed";
  channel: string;
  messageId?: number | string;
  chatId?: number | string;
  sessionKey?: string;
  sessionId?: string;
  durationMs?: number;
  outcome: "completed" | "skipped" | "error";
  reason?: string;
  error?: string;
};
type DiagnosticMessageDeliveryKind = "text" | "media" | "edit" | "reaction" | "other";
type DiagnosticMessageDeliveryBaseEvent = DiagnosticBaseEvent & {
  channel: string;
  sessionKey?: string;
  deliveryKind: DiagnosticMessageDeliveryKind;
};
type DiagnosticMessageDeliveryStartedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.started";
};
type DiagnosticMessageDeliveryCompletedEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.completed";
  durationMs: number;
  resultCount: number;
};
type DiagnosticMessageDeliveryErrorEvent = DiagnosticMessageDeliveryBaseEvent & {
  type: "message.delivery.error";
  durationMs: number;
  errorCategory: string;
};
type DiagnosticTalkEvent = DiagnosticBaseEvent & {
  type: "talk.event";
  sessionId?: string;
  turnId?: string;
  captureId?: string;
  talkEventType: TalkEventType;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
  final?: boolean;
  durationMs?: number;
  byteLength?: number;
};
type DiagnosticSessionStateEvent = DiagnosticBaseEvent & {
  type: "session.state";
  sessionKey?: string;
  sessionId?: string;
  prevState?: DiagnosticSessionState;
  state: DiagnosticSessionState;
  reason?: string;
  queueDepth?: number;
};
type DiagnosticSessionActiveWorkKind = "embedded_run" | "model_call" | "tool_call";
type DiagnosticSessionAttentionClassification = "long_running" | "blocked_tool_call" | "stalled_agent_run" | "stale_session_state";
type DiagnosticSessionAttentionBaseEvent = DiagnosticBaseEvent & {
  sessionKey?: string;
  sessionId?: string;
  state: DiagnosticSessionState;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  classification: DiagnosticSessionAttentionClassification;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  terminalProgressStale?: boolean;
};
type DiagnosticSessionLongRunningEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.long_running";
  classification: "long_running";
};
type DiagnosticSessionStalledEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stalled";
  classification: "blocked_tool_call" | "stalled_agent_run";
};
type DiagnosticSessionStuckEvent = DiagnosticSessionAttentionBaseEvent & {
  type: "session.stuck";
  classification: "stale_session_state";
};
type DiagnosticSessionRecoveryStatus = "aborted" | "released" | "skipped" | "noop" | "failed";
type DiagnosticSessionRecoveryBaseEvent = DiagnosticBaseEvent & {
  sessionKey?: string;
  sessionId?: string;
  state: DiagnosticSessionState;
  stateGeneration?: number;
  ageMs: number;
  queueDepth?: number;
  reason?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
  allowActiveAbort?: boolean;
};
type DiagnosticSessionRecoveryRequestedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.requested";
};
type DiagnosticSessionRecoveryCompletedEvent = DiagnosticSessionRecoveryBaseEvent & {
  type: "session.recovery.completed";
  status: DiagnosticSessionRecoveryStatus;
  action: string;
  outcomeReason?: string;
  released?: number;
  stale?: boolean;
};
type DiagnosticSessionTurnCreatedEvent = DiagnosticBaseEvent & {
  type: "session.turn.created";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  channel?: string;
  trigger: "user" | "heartbeat";
};
type DiagnosticLaneEnqueueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.enqueue";
  lane: string;
  queueSize: number;
};
type DiagnosticLaneDequeueEvent = DiagnosticBaseEvent & {
  type: "queue.lane.dequeue";
  lane: string;
  queueSize: number;
  waitMs: number;
};
type DiagnosticRunAttemptEvent = DiagnosticBaseEvent & {
  type: "run.attempt";
  sessionKey?: string;
  sessionId?: string;
  runId: string;
  attempt: number;
};
type DiagnosticRunProgressEvent = DiagnosticBaseEvent & {
  type: "run.progress";
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  reason: string;
};
type DiagnosticHeartbeatEvent = DiagnosticBaseEvent & {
  type: "diagnostic.heartbeat";
  webhooks: {
    received: number;
    processed: number;
    errors: number;
  };
  active: number;
  waiting: number;
  queued: number;
};
type DiagnosticLivenessWarningReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type DiagnosticPhaseDetails = Record<string, string | number | boolean>;
type DiagnosticPhaseSnapshot = {
  name: string;
  startedAt: number;
  endedAt?: number;
  durationMs?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  details?: DiagnosticPhaseDetails;
};
type DiagnosticLivenessWarningEvent = DiagnosticBaseEvent & {
  type: "diagnostic.liveness.warning";
  reasons: DiagnosticLivenessWarningReason[];
  intervalMs: number;
  eventLoopDelayP99Ms?: number;
  eventLoopDelayMaxMs?: number;
  eventLoopUtilization?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
  active: number;
  waiting: number;
  queued: number;
  phase?: string;
  recentPhases?: DiagnosticPhaseSnapshot[];
  activeWorkLabels?: string[];
  waitingWorkLabels?: string[];
  queuedWorkLabels?: string[];
};
type DiagnosticPhaseCompletedEvent = DiagnosticBaseEvent & DiagnosticPhaseSnapshot & {
  type: "diagnostic.phase.completed";
};
type DiagnosticToolLoopEvent = DiagnosticBaseEvent & {
  type: "tool.loop";
  sessionKey?: string;
  sessionId?: string;
  toolName: string;
  level: "warning" | "critical";
  action: "warn" | "block";
  detector: "generic_repeat" | "unknown_tool_repeat" | "known_poll_no_progress" | "global_circuit_breaker" | "ping_pong";
  count: number;
  message: string;
  pairedToolName?: string;
};
type DiagnosticToolParamsSummary = {
  kind: "object";
} | {
  kind: "array";
  length: number;
} | {
  kind: "string";
  length: number;
} | {
  kind: "number" | "boolean" | "null" | "undefined" | "other";
};
type DiagnosticToolSource = "channel" | "core" | "mcp" | "plugin";
type DiagnosticToolExecutionBaseEvent = DiagnosticBaseEvent & {
  runId?: string;
  sessionKey?: string;
  sessionId?: string;
  toolName: string;
  toolSource?: DiagnosticToolSource;
  toolOwner?: string;
  toolCallId?: string;
  paramsSummary?: DiagnosticToolParamsSummary;
};
type DiagnosticToolExecutionStartedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.started";
};
type DiagnosticToolExecutionCompletedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.completed";
  durationMs: number;
};
type DiagnosticToolExecutionErrorEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.error";
  durationMs: number;
  errorCategory: string;
  errorCode?: string;
};
type DiagnosticToolExecutionBlockedEvent = DiagnosticToolExecutionBaseEvent & {
  type: "tool.execution.blocked";
  deniedReason: string;
  reason: string;
};
type DiagnosticSkillTelemetrySource = "bundled" | "unknown" | "workspace";
type DiagnosticSkillActivation = "command" | "read";
type DiagnosticSkillUsedEvent = DiagnosticBaseEvent & {
  type: "skill.used";
  runId?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
  skillName: string;
  skillSource: DiagnosticSkillTelemetrySource;
  activation: DiagnosticSkillActivation;
  toolName?: string;
  toolCallId?: string;
};
type DiagnosticExecProcessCompletedEvent = DiagnosticBaseEvent & {
  type: "exec.process.completed";
  sessionKey?: string;
  target: "host" | "sandbox";
  mode: "child" | "pty";
  outcome: "completed" | "failed";
  durationMs: number;
  commandLength: number;
  exitCode?: number;
  exitSignal?: string;
  timedOut?: boolean;
  failureKind?: "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "signal" | "aborted" | "runtime-error";
};
type DiagnosticRunBaseEvent = DiagnosticBaseEvent & {
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider?: string;
  model?: string;
  trigger?: string;
  channel?: string;
};
type DiagnosticRunStartedEvent = DiagnosticRunBaseEvent & {
  type: "run.started";
};
type DiagnosticRunCompletedEvent = DiagnosticRunBaseEvent & {
  type: "run.completed";
  durationMs: number;
  outcome: "completed" | "aborted" | "blocked" | "error";
  errorCategory?: string;
  blockedBy?: string;
};
type DiagnosticHarnessRunPhase = "prepare" | "start" | "send" | "resolve" | "cleanup";
type DiagnosticHarnessRunOutcome = "completed" | "aborted" | "timed_out" | "error";
type DiagnosticHarnessRunBaseEvent = DiagnosticBaseEvent & {
  type: "harness.run.started" | "harness.run.completed" | "harness.run.error";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider?: string;
  model?: string;
  trigger?: string;
  channel?: string;
  harnessId: string;
  pluginId?: string;
};
type DiagnosticHarnessRunStartedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.started";
};
type DiagnosticHarnessRunCompletedEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.completed";
  durationMs: number;
  outcome: DiagnosticHarnessRunOutcome;
  resultClassification?: "empty" | "reasoning-only" | "planning-only";
  yieldDetected?: boolean;
  itemLifecycle?: {
    startedCount: number;
    completedCount: number;
    activeCount: number;
  };
};
type DiagnosticHarnessRunErrorEvent = DiagnosticHarnessRunBaseEvent & {
  type: "harness.run.error";
  durationMs: number;
  phase: DiagnosticHarnessRunPhase;
  errorCategory: string;
  cleanupFailed?: boolean;
};
type DiagnosticModelCallBaseEvent = DiagnosticBaseEvent & {
  type: "model.call.started" | "model.call.completed" | "model.call.error";
  runId: string;
  callId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string;
  contextTokenBudget?: number;
  contextWindowSource?: "model" | "modelsConfig" | "agentContextTokens" | "default";
  contextWindowReferenceTokens?: number;
  upstreamRequestIdHash?: string;
};
type DiagnosticModelCallStartedEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.started";
};
type DiagnosticModelCallCompletedEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.completed";
  durationMs: number;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
};
type DiagnosticModelCallErrorEvent = DiagnosticModelCallBaseEvent & {
  type: "model.call.error";
  durationMs: number;
  errorCategory: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  memory?: DiagnosticMemoryUsage;
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
};
type DiagnosticContextAssembledEvent = DiagnosticBaseEvent & {
  type: "context.assembled";
  runId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  channel?: string;
  trigger?: string;
  messageCount: number;
  historyTextChars: number;
  historyImageBlocks: number;
  maxMessageTextChars: number;
  systemPromptChars: number;
  promptChars: number;
  promptImages: number;
  contextTokenBudget?: number;
  reserveTokens?: number;
};
type DiagnosticMemoryUsage = {
  rssBytes: number;
  heapTotalBytes: number;
  heapUsedBytes: number;
  externalBytes: number;
  arrayBuffersBytes: number;
};
type DiagnosticMemorySampleEvent = DiagnosticBaseEvent & {
  type: "diagnostic.memory.sample";
  memory: DiagnosticMemoryUsage;
  uptimeMs?: number;
};
type DiagnosticMemoryPressureEvent = DiagnosticBaseEvent & {
  type: "diagnostic.memory.pressure";
  level: "warning" | "critical";
  reason: "rss_threshold" | "heap_threshold" | "rss_growth";
  memory: DiagnosticMemoryUsage;
  thresholdBytes?: number;
  rssGrowthBytes?: number;
  windowMs?: number;
};
type DiagnosticPayloadLargeEvent = DiagnosticBaseEvent & {
  type: "payload.large";
  surface: string;
  action: "rejected" | "truncated" | "chunked";
  bytes?: number;
  limitBytes?: number;
  count?: number;
  channel?: string;
  pluginId?: string;
  reason?: string;
};
type DiagnosticLogRecordEvent = DiagnosticBaseEvent & {
  type: "log.record";
  level: string;
  message: string;
  loggerName?: string;
  loggerParents?: string[];
  attributes?: Record<string, string | number | boolean>;
  code?: {
    line?: number;
    functionName?: string;
  };
};
type DiagnosticTelemetryExporterEvent = DiagnosticBaseEvent & {
  type: "telemetry.exporter";
  exporter: string;
  signal: "traces" | "metrics" | "logs";
  status: "started" | "failure" | "dropped";
  reason?: "configured" | "emit_failed" | "handler_failed" | "queue_full" | "shutdown_failed" | "start_failed" | "unsupported_protocol";
  errorCategory?: string;
};
type DiagnosticAsyncQueueDroppedEvent = DiagnosticBaseEvent & {
  type: "diagnostic.async_queue.dropped";
  droppedEvents: number;
  droppedTrustedEvents?: number;
  droppedUntrustedEvents?: number;
  droppedPriorityEvents?: number;
  queueLength: number;
  maxQueueLength: number;
  drainBatchSize: number;
};
type DiagnosticEventPayload = DiagnosticUsageEvent | DiagnosticWebhookReceivedEvent | DiagnosticWebhookProcessedEvent | DiagnosticWebhookErrorEvent | DiagnosticMessageQueuedEvent | DiagnosticMessageReceivedEvent | DiagnosticMessageDispatchStartedEvent | DiagnosticMessageDispatchCompletedEvent | DiagnosticMessageProcessedEvent | DiagnosticMessageDeliveryStartedEvent | DiagnosticMessageDeliveryCompletedEvent | DiagnosticMessageDeliveryErrorEvent | DiagnosticTalkEvent | DiagnosticSessionStateEvent | DiagnosticSessionLongRunningEvent | DiagnosticSessionStalledEvent | DiagnosticSessionStuckEvent | DiagnosticSessionRecoveryRequestedEvent | DiagnosticSessionRecoveryCompletedEvent | DiagnosticSessionTurnCreatedEvent | DiagnosticLaneEnqueueEvent | DiagnosticLaneDequeueEvent | DiagnosticRunAttemptEvent | DiagnosticRunProgressEvent | DiagnosticHeartbeatEvent | DiagnosticLivenessWarningEvent | DiagnosticPhaseCompletedEvent | DiagnosticToolLoopEvent | DiagnosticToolExecutionStartedEvent | DiagnosticToolExecutionCompletedEvent | DiagnosticToolExecutionErrorEvent | DiagnosticToolExecutionBlockedEvent | DiagnosticSkillUsedEvent | DiagnosticExecProcessCompletedEvent | DiagnosticRunStartedEvent | DiagnosticRunCompletedEvent | DiagnosticHarnessRunStartedEvent | DiagnosticHarnessRunCompletedEvent | DiagnosticHarnessRunErrorEvent | DiagnosticModelCallStartedEvent | DiagnosticModelCallCompletedEvent | DiagnosticModelCallErrorEvent | DiagnosticContextAssembledEvent | DiagnosticMemorySampleEvent | DiagnosticMemoryPressureEvent | DiagnosticPayloadLargeEvent | DiagnosticLogRecordEvent | DiagnosticSecurityEvent | DiagnosticTelemetryExporterEvent | DiagnosticAsyncQueueDroppedEvent | DiagnosticFailoverEvent;
type DiagnosticNonSecurityEventPayload = Exclude<DiagnosticEventPayload, DiagnosticSecurityEvent>;
type DiagnosticEventInput = DiagnosticNonSecurityEventPayload extends infer Event ? Event extends DiagnosticEventPayload ? Omit<Event, "seq" | "ts"> : never : never;
type DiagnosticEventMetadata = Readonly<{
  internal?: boolean;
  trustedTraceContext?: boolean;
  trusted: boolean;
}>;
type DiagnosticModelCallContent = Readonly<{
  inputMessages?: unknown;
  outputMessages?: unknown;
  systemPrompt?: string;
  toolDefinitions?: unknown;
}>;
type DiagnosticToolCallContent = Readonly<{
  toolInput?: unknown;
  toolOutput?: unknown;
}>;
type DiagnosticEventPrivateData = Readonly<{
  modelContent?: DiagnosticModelCallContent;
  toolContent?: DiagnosticToolCallContent;
}>;
type DiagnosticEventListener = (evt: DiagnosticEventPayload, metadata: DiagnosticEventMetadata) => void;
type TrustedDiagnosticEventListener = (evt: DiagnosticEventPayload, metadata: DiagnosticEventMetadata, privateData: DiagnosticEventPrivateData) => void;
/** Returns whether diagnostics are enabled for a loaded config; missing config defaults enabled. */
declare function isDiagnosticsEnabled(config?: OpenClawConfig): boolean;
/** Sets the process-wide diagnostic dispatcher enable flag. */
declare function setDiagnosticsEnabledForProcess(enabled: boolean): void;
/** Returns the current process-wide diagnostic dispatcher enable flag. */
declare function areDiagnosticsEnabledForProcess(): boolean;
/** Waits until queued async diagnostic events have been delivered to listeners. */
declare function waitForDiagnosticEventsDrained(): Promise<void>;
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
declare function emitDiagnosticEvent(event: DiagnosticEventInput): void;
/** Emits an untrusted event whose trace context came from OpenClaw-owned scope. */
declare function emitDiagnosticEventWithTrustedTraceContext(event: DiagnosticEventInput): void;
/** Emits an untrusted diagnostic event tagged as internal dispatcher provenance. */
declare function emitInternalDiagnosticEvent(event: DiagnosticEventInput): void;
/** Returns the latest diagnostic event sequence number assigned in this process. */
declare function getInternalDiagnosticEventSequence(): number;
/** Emits a trusted diagnostic event from core/runtime-owned instrumentation. */
declare function emitTrustedDiagnosticEvent(event: DiagnosticEventInput): void;
/** Emits a trusted diagnostic event with private listener-only payload data. */
declare function emitTrustedDiagnosticEventWithPrivateData(event: DiagnosticEventInput, privateData?: DiagnosticEventPrivateData): void;
/** Emits a trusted canonical security event from core-owned enforcement boundaries. */
declare function emitTrustedSecurityEvent(event: DiagnosticSecurityEventInput): void;
/** Emits a trusted model failover diagnostic event. */
declare function emitFailoverEvent(event: Omit<DiagnosticFailoverEvent, "seq" | "ts" | "type">): void;
/** Subscribes to all diagnostic events with dispatcher metadata. */
declare function onInternalDiagnosticEvent(listener: DiagnosticEventListener): () => void;
/** Subscribes to all diagnostic events plus trusted private payload data. */
declare function onTrustedInternalDiagnosticEvent(listener: TrustedDiagnosticEventListener): () => void;
/** Checks currently queued async diagnostic events without draining the queue. */
declare function hasPendingInternalDiagnosticEvent(predicate: (event: DiagnosticEventPayload, metadata: DiagnosticEventMetadata) => boolean): boolean;
/** Subscribes to public untrusted diagnostic events only. */
declare function onDiagnosticEvent(listener: (evt: DiagnosticEventPayload) => void): () => void;
/** Formats traceparent only for trusted metadata created by the diagnostic dispatcher. */
declare function formatDiagnosticTraceparentForPropagation(event: {
  trace?: DiagnosticTraceContext;
}, metadata: DiagnosticEventMetadata): string | undefined;
/** Returns whether listener metadata marks dispatcher-internal provenance. */
declare function isInternalDiagnosticEventMetadata(metadata: DiagnosticEventMetadata): boolean;
/** Resets dispatcher state between tests. */
declare function resetDiagnosticEventsForTest(): void;
//#endregion
export { DiagnosticSessionRecoveryCompletedEvent as $, DiagnosticMessageQueuedEvent as A, emitTrustedDiagnosticEventWithPrivateData as At, DiagnosticRunAttemptEvent as B, resetDiagnosticEventsForTest as Bt, DiagnosticMessageDeliveryCompletedEvent as C, DiagnosticWebhookReceivedEvent as Ct, DiagnosticMessageDispatchCompletedEvent as D, emitFailoverEvent as Dt, DiagnosticMessageDeliveryStartedEvent as E, emitDiagnosticEventWithTrustedTraceContext as Et, DiagnosticModelCallStartedEvent as F, isDiagnosticsEnabled as Ft, DiagnosticSecurityEventActor as G, TalkEvent as Gt, DiagnosticRunProgressEvent as H, waitForDiagnosticEventsDrained as Ht, DiagnosticPayloadLargeEvent as I, isInternalDiagnosticEventMetadata as It, DiagnosticSecurityEventPolicy as J, TalkEventSequencer as Jt, DiagnosticSecurityEventControl as K, TalkEventContext as Kt, DiagnosticPhaseCompletedEvent as L, onDiagnosticEvent as Lt, DiagnosticModelCallCompletedEvent as M, formatDiagnosticTraceparentForPropagation as Mt, DiagnosticModelCallContent as N, getInternalDiagnosticEventSequence as Nt, DiagnosticMessageDispatchStartedEvent as O, emitInternalDiagnosticEvent as Ot, DiagnosticModelCallErrorEvent as P, hasPendingInternalDiagnosticEvent as Pt, DiagnosticSessionLongRunningEvent as Q, createTalkEventSequencer as Qt, DiagnosticPhaseDetails as R, onInternalDiagnosticEvent as Rt, DiagnosticMemoryUsage as S, DiagnosticWebhookProcessedEvent as St, DiagnosticMessageDeliveryKind as T, emitDiagnosticEvent as Tt, DiagnosticRunStartedEvent as U, TALK_EVENT_TYPES as Ut, DiagnosticRunCompletedEvent as V, setDiagnosticsEnabledForProcess as Vt, DiagnosticSecurityEvent as W, TalkBrain as Wt, DiagnosticSessionActiveWorkKind as X, TalkMode as Xt, DiagnosticSecurityEventTarget as Y, TalkEventType as Yt, DiagnosticSessionAttentionClassification as Z, TalkTransport as Zt, DiagnosticLivenessWarningEvent as _, DiagnosticToolLoopEvent as _t, DiagnosticEventPayload as a, DiagnosticSessionStuckEvent as at, DiagnosticMemoryPressureEvent as b, DiagnosticUsageEvent as bt, DiagnosticFailoverEvent as c, DiagnosticSkillTelemetrySource as ct, DiagnosticHarnessRunOutcome as d, DiagnosticTelemetryExporterEvent as dt, DiagnosticSessionRecoveryRequestedEvent as et, DiagnosticHarnessRunPhase as f, DiagnosticToolCallContent as ft, DiagnosticLaneEnqueueEvent as g, DiagnosticToolExecutionStartedEvent as gt, DiagnosticLaneDequeueEvent as h, DiagnosticToolExecutionErrorEvent as ht, DiagnosticEventMetadata as i, DiagnosticSessionStateEvent as it, DiagnosticMessageReceivedEvent as j, emitTrustedSecurityEvent as jt, DiagnosticMessageProcessedEvent as k, emitTrustedDiagnosticEvent as kt, DiagnosticHarnessRunCompletedEvent as l, DiagnosticSkillUsedEvent as lt, DiagnosticHeartbeatEvent as m, DiagnosticToolExecutionCompletedEvent as mt, DiagnosticContextAssembledEvent as n, DiagnosticSessionStalledEvent as nt, DiagnosticEventPrivateData as o, DiagnosticSessionTurnCreatedEvent as ot, DiagnosticHarnessRunStartedEvent as p, DiagnosticToolExecutionBlockedEvent as pt, DiagnosticSecurityEventInput as q, TalkEventInput as qt, DiagnosticEventInput as r, DiagnosticSessionState as rt, DiagnosticExecProcessCompletedEvent as s, DiagnosticSkillActivation as st, DiagnosticAsyncQueueDroppedEvent as t, DiagnosticSessionRecoveryStatus as tt, DiagnosticHarnessRunErrorEvent as u, DiagnosticTalkEvent as ut, DiagnosticLivenessWarningReason as v, DiagnosticToolParamsSummary as vt, DiagnosticMessageDeliveryErrorEvent as w, areDiagnosticsEnabledForProcess as wt, DiagnosticMemorySampleEvent as x, DiagnosticWebhookErrorEvent as xt, DiagnosticLogRecordEvent as y, DiagnosticToolSource as yt, DiagnosticPhaseSnapshot as z, onTrustedInternalDiagnosticEvent as zt };