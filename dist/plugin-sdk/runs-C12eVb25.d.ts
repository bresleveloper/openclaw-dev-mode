import { a as SourceReplyDeliveryMode } from "./types-DNy-f8Hr.js";

//#region src/agents/embedded-agent-runner/run-state.d.ts
/**
 * Shared process state for embedded-agent runs, queues, and snapshots.
 *
 * The maps are global-singleton backed so reloads and lazy imports inside the same gateway process
 * do not split active-run bookkeeping.
 */
type EmbeddedAgentQueueHandle = {
  kind?: "embedded";
  queueMessage: (text: string, options?: EmbeddedAgentQueueMessageOptions) => Promise<void>;
  isStreaming: () => boolean;
  isCompacting: () => boolean;
  supportsTranscriptCommitWait?: boolean;
  cancel?: (reason?: "user_abort" | "restart" | "superseded") => void;
  abort: (reason?: "restart") => void;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
type EmbeddedAgentQueueMessageOptions = {
  steeringMode?: "all";
  debounceMs?: number;
  deliveryTimeoutMs?: number;
  waitForTranscriptCommit?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
/** Resolves the current session id for an active run after resets or compaction. */
declare function resolveActiveEmbeddedRunSessionId(sessionKey: string): string | undefined;
//#endregion
//#region src/agents/embedded-agent-runner/runs.d.ts
type EmbeddedAgentQueueFailureReason = "no_active_run" | "not_streaming" | "compacting" | "source_reply_delivery_mode_mismatch" | "transcript_commit_wait_unsupported" | "runtime_rejected";
type EmbeddedAgentQueueMessageOutcome = {
  queued: true;
  sessionId: string;
  target: "embedded_run" | "reply_run";
  gatewayHealth: "live";
  deliveredAtMs?: number;
  enqueuedAtMs?: number;
} | {
  queued: false;
  sessionId: string;
  reason: EmbeddedAgentQueueFailureReason;
  gatewayHealth: "live";
  errorMessage?: string;
};
/**
 * Abort embedded OpenClaw runs.
 *
 * - With a sessionId, aborts that single run.
 * - With no sessionId, supports targeted abort modes (for example, compacting runs only).
 */
declare function abortEmbeddedAgentRun(sessionId: string): boolean;
declare function abortEmbeddedAgentRun(sessionId: undefined, opts: {
  mode: "all" | "compacting";
  reason?: "restart";
}): boolean;
type AbortAndDrainEmbeddedAgentRunResult = {
  aborted: boolean;
  drained: boolean;
  forceCleared: boolean;
};
declare function abortAndDrainEmbeddedAgentRun(params: {
  sessionId: string;
  sessionKey?: string;
  settleMs?: number;
  forceClear?: boolean;
  reason?: string;
}): Promise<AbortAndDrainEmbeddedAgentRunResult>;
declare function setActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string): void;
declare function clearActiveEmbeddedRun(sessionId: string, handle: EmbeddedAgentQueueHandle, sessionKey?: string, sessionFile?: string): void;
//#endregion
export { clearActiveEmbeddedRun as a, resolveActiveEmbeddedRunSessionId as c, abortEmbeddedAgentRun as i, EmbeddedAgentQueueMessageOutcome as n, setActiveEmbeddedRun as o, abortAndDrainEmbeddedAgentRun as r, EmbeddedAgentQueueMessageOptions as s, AbortAndDrainEmbeddedAgentRunResult as t };