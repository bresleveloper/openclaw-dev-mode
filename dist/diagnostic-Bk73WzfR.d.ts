import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { X as DiagnosticSessionActiveWorkKind, qt as DiagnosticMemoryUsage, rt as DiagnosticSessionState, y as DiagnosticLivenessWarningReason } from "./diagnostic-events-Bs1JVD6b.js";
//#region src/logging/diagnostic-memory.d.ts
type DiagnosticMemoryThresholds = {
  rssWarningBytes?: number;
  rssCriticalBytes?: number;
  heapUsedWarningBytes?: number;
  heapUsedCriticalBytes?: number;
  rssGrowthWarningBytes?: number;
  rssGrowthCriticalBytes?: number;
  growthWindowMs?: number;
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
}): DiagnosticMemoryUsage;
type EmitDiagnosticMemorySample = (options?: NonNullable<Parameters<typeof emitDiagnosticMemorySample>[0]> & {
  writeCriticalBundle?: boolean;
  stateDir?: string;
  sessionStorePaths?: string[];
  resolveSessionStorePaths?: () => string[] | undefined;
}) => ReturnType<typeof emitDiagnosticMemorySample>;
//#endregion
//#region src/logging/diagnostic-session-recovery.d.ts
type DiagnosticSessionRecoverySkipReason = "active_embedded_run" | "active_reply_work" | "human_input_wait" | "runtime_owned_wait" | "deferred_maintenance_wait" | "terminal_outcome_committed" | "global_lane_wait" | "active_lane_task" | "already_in_flight" | "missing_session_ref" | "stale_session_state";
type StuckSessionRecoveryRequest = {
  sessionId?: string;
  sessionKey?: string;
  sessionFile?: string;
  ageMs: number;
  queueDepth?: number;
  allowActiveAbort?: boolean;
  expectedState?: DiagnosticSessionState;
  stateGeneration?: number;
  /**
   * Built-in no-forward-progress age after
   * which an "active" run with queued work is treated as a leaked/dead handle and
   * reclaimed. Honors an operator-raised threshold; falls back to a safe floor.
   */
  staleActiveProgressAbortMs?: number;
  /**
   * Resolved compaction safety timeout. Ownerless lane recovery waits at least
   * this long plus settle grace so queued compaction cannot be double-run.
   */
  compactionSafetyTimeoutMs?: number;
};
type DiagnosticSessionRecoveryBaseOutcome = {
  sessionId?: string;
  sessionKey?: string;
  activeSessionId?: string;
  lane?: string;
  activeWorkKind?: DiagnosticSessionActiveWorkKind;
};
type StuckSessionRecoveryOutcome = (DiagnosticSessionRecoveryBaseOutcome & {
  status: "aborted";
  action: "abort_embedded_run";
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
  released: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "released";
  action: "release_lane";
  reason?: "no_active_work" | "stale_lane_task";
  released: number;
  queuedCount?: number;
}) | (DiagnosticSessionRecoveryBaseOutcome & {
  status: "skipped";
  action: "observe_only" | "keep_lane";
  reason: DiagnosticSessionRecoverySkipReason;
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
//#endregion
//#region src/logging/diagnostic-session-recovery-coordinator.d.ts
type RecoverStuckSession = (params: StuckSessionRecoveryRequest) => void | StuckSessionRecoveryOutcome | Promise<void | StuckSessionRecoveryOutcome>;
//#endregion
//#region src/logging/diagnostic.d.ts
type DiagnosticWorkSnapshot = {
  activeCount: number;
  waitingCount: number;
  queuedCount: number;
  activeLabels: string[];
  waitingLabels: string[];
  queuedLabels: string[];
};
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
type SampleDiagnosticLiveness = (now: number, work: DiagnosticWorkSnapshot) => DiagnosticLivenessSample | null;
type StartDiagnosticHeartbeatOptions = {
  getConfig?: () => OpenClawConfig;
  emitMemorySample?: EmitDiagnosticMemorySample;
  sampleLiveness?: SampleDiagnosticLiveness;
  recoverStuckSession?: RecoverStuckSession;
  startupGraceMs?: number;
  /** Keeps fake-timer recovery tests fast without reopening runtime config tuning. */
  testTimings?: {
    stuckSessionWarnMs: number;
    stuckSessionAbortMs: number;
  };
};
declare function logWebhookReceived(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
}): void;
declare function logWebhookProcessed(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
  durationMs?: number;
}): void;
declare function logWebhookError(params: {
  channel: string;
  updateType?: string;
  chatId?: number | string;
  error: string;
}): void;
declare function startDiagnosticHeartbeat(config?: OpenClawConfig, opts?: StartDiagnosticHeartbeatOptions): void;
declare function stopDiagnosticHeartbeat(): void;
//#endregion
export { stopDiagnosticHeartbeat as a, startDiagnosticHeartbeat as i, logWebhookProcessed as n, logWebhookReceived as r, logWebhookError as t };