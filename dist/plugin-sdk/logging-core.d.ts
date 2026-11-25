import { JT as ReplyOperation, KE as GatewayScheduler, Lb as redactSensitiveFieldValue, Rb as redactSensitiveText, zb as redactToolPayloadText } from "../config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "../types.openclaw-D8uW-XQA.js";
import { i as DiagnosticMemoryUsage } from "../diagnostic-process-types-BIzAFG7u.js";
import { n as RuntimeEnv } from "../runtime-C7vMCRi6.js";
import { n as createSubsystemLogger } from "../subsystem-wnS6DJyq.js";
import { i as DiagnosticLivenessWarningReason, n as DiagnosticEventPayload, o as DiagnosticSessionActiveWorkKind, s as DiagnosticSessionState } from "../diagnostic-events-ClGLRZ6Y.js";
import { a as LoggerResolvedSettings, o as getChildLogger, u as LoggerSettings } from "../runtime-env-CERK9fjD.js";
type DiagnosticLivenessSample = {
  reasons: DiagnosticLivenessWarningReason[];
  intervalMs: number;
  degradedSinceMs?: number;
  eventLoopDelayP99Ms?: number;
  eventLoopDelayMaxMs?: number;
  eventLoopUtilization?: number;
  cpuUserMs?: number;
  cpuSystemMs?: number;
  cpuTotalMs?: number;
  cpuCoreRatio?: number;
};
type DiagnosticMemoryThresholds = {
  rssWarningBytes?: number;
  rssCriticalBytes?: number;
  heapUsedWarningBytes?: number;
  heapUsedCriticalBytes?: number;
  pressureRepeatMs?: number;
};
declare function emitDiagnosticMemorySample(options?: {
  now?: number;
  memoryUsage?: NodeJS.MemoryUsage;
  heapSizeLimitBytes?: number;
  processMemoryLimitBytes?: number;
  physicalMemoryBytes?: number;
  isBunRuntime?: boolean;
  uptimeMs?: number;
  thresholds?: DiagnosticMemoryThresholds;
  emitSample?: boolean;
}, collectDiagnostics?: boolean): DiagnosticMemoryUsage;
type EmitDiagnosticMemorySample = (options?: NonNullable<Parameters<typeof emitDiagnosticMemorySample>[0]> & {
  thresholds?: DiagnosticMemoryThresholds & {
    rssGrowthWarningBytes?: number;
    rssGrowthCriticalBytes?: number;
    growthWindowMs?: number;
  };
  writeCriticalBundle?: boolean;
  stateDir?: string;
  sessionStorePaths?: string[];
  resolveSessionStorePaths?: () => string[] | undefined;
}) => ReturnType<typeof emitDiagnosticMemorySample>;
type SessionAttentionClassification = {
  eventType: "session.long_running";
  reason: string;
  classification: "long_running";
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
} | {
  eventType: "session.stalled";
  reason: string;
  classification: "blocked_tool_call" | "stalled_agent_run";
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
} | {
  eventType: "session.stuck";
  reason: string;
  classification: "stale_session_state";
  activeWorkKind?: undefined;
};
type StuckSessionRecoveryRequest = {
  /** Exact captured controller owner; diagnostic IDs and map absence grant no authority. */
  operation?: ReplyOperation;
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  ageMs: number;
  queueDepth?: number;
  /** Recorded controller decision for SDK recovery callbacks, never independent authority. */
  allowActiveAbort?: boolean;
  /** Legacy diagnostic threshold metadata retained by the logging-core SDK callback contract. */
  repeatedRequestNoProgressAbortMs?: number;
  expectedState?: DiagnosticSessionState;
  stateGeneration?: number;
  /**
   * Legacy observation threshold retained for SDK callback compatibility.
   * The captured controller alone decides whether its work can be recovered.
   */
  staleActiveProgressAbortMs?: number;
  /**
   * Resolved compaction timeout metadata retained for SDK callbacks.
   * It never grants ownerless recovery or changes the controller deadline.
   */
  compactionSafetyTimeoutMs?: number;
  /**
   * Attention classification that triggered this recovery. Carried through so the
   * abort branch can report the semantic cause (e.g. `blocked_tool_call`) instead
   * of a cause-free literal. Never grants recovery authority on its own.
   */
  classification?: SessionAttentionClassification;
};
type DiagnosticSessionRecoveryBaseOutcome = {
  sessionId?: string;
  sessionKey?: string;
  activeSessionId?: string;
  lane?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
};
type StuckSessionRecoveryOutcome = (DiagnosticSessionRecoveryBaseOutcome & {
  status: "noop";
  action: "reconcile_state";
  reason: "no_active_work" | "pending_session_work";
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "aborted";
  action: "abort_embedded_run";
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
  released: number;
  queuedCount?: number;
  /**
   * Semantic cause the recovery acted on when it killed the run (e.g.
   * `blocked_tool_call`). The other terminal branches each carry a reason;
   * this one previously dropped it, leaving a cause-free history entry.
   */
  reason?: string;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "released";
  action: "release_lane";
  reason?: "no_active_work" | "stale_lane_task";
  released: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "skipped";
  action: "observe_only" | "keep_lane";
  reason: "active_embedded_run" | "model_attempt_recovery" | "active_reply_work" | "human_input_wait" | "runtime_owned_wait" | "deferred_maintenance_wait" | "terminal_outcome_committed" | "global_lane_wait" | "active_lane_task" | "already_in_flight" | "missing_session_ref" | "stale_session_state";
  activeCount?: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "failed";
  action: "none";
  reason: "exception";
  error: string;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "failed";
  action: "fail_worker_turn";
  reason: "terminal_worker";
  error: string;
});
type RecoverStuckSession = (params: StuckSessionRecoveryRequest) => void | StuckSessionRecoveryOutcome | Promise<void | StuckSessionRecoveryOutcome>;
type DiagnosticWorkSnapshot = {
  activeCount: number;
  waitingCount: number;
  queuedCount: number;
  activeLabels: string[];
  waitingLabels: string[];
  queuedLabels: string[];
};
type StartDiagnosticHeartbeatOptions = {
  getConfig?: () => OpenClawConfig;
  emitMemorySample?: EmitDiagnosticMemorySample;
  sampleLiveness?: (now: number, work: DiagnosticWorkSnapshot) => DiagnosticLivenessSample | null;
  recoverStuckSession?: RecoverStuckSession;
  startupGraceMs?: number;
  /** Bounds diagnostic reporting in tests, never the controller-owned watchdog policy. */
  testTimings?: {
    stuckSessionWarnMs: number;
    stuckSessionAbortMs: number;
  };
};
type DiagnosticLogParams<T extends DiagnosticEventPayload["type"]> = Omit<Extract<DiagnosticEventPayload, {
  type: T;
}>, "type" | "seq" | "ts" | "trace">;
export declare function logWebhookReceived(params: DiagnosticLogParams<"webhook.received">): void;
export declare function logWebhookProcessed(params: DiagnosticLogParams<"webhook.processed">): void;
export declare function logWebhookError(params: DiagnosticLogParams<"webhook.error">): void;
declare function startGatewayDiagnosticHeartbeat(scheduler: GatewayScheduler, initialConfig?: OpenClawConfig, initialOpts?: StartDiagnosticHeartbeatOptions): void;
export declare function logInfo(message: string, runtime?: RuntimeEnv): void;
export declare function logError(message: string, runtime?: RuntimeEnv): void;
export declare function logDebug(message: string): void;
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
export declare function redactIdentifier(value: string | undefined, opts?: {
  len?: number;
}): string;
/** Standalone SDK callers own this schedule; Gateway plugins use their bound host. */
export declare function startDiagnosticHeartbeat(config?: Parameters<typeof startGatewayDiagnosticHeartbeat>[1], opts?: Parameters<typeof startGatewayDiagnosticHeartbeat>[2]): void;
export declare function stopDiagnosticHeartbeat(): void;
export { type LoggerResolvedSettings, type LoggerSettings, createSubsystemLogger, getChildLogger, redactSensitiveFieldValue, redactSensitiveText, redactToolPayloadText };