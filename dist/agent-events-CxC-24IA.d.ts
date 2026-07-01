//#region src/infra/agent-events.d.ts
/** Stream name for agent events delivered to gateway listeners and plugin host hooks. */
type AgentEventStream = "lifecycle" | "tool" | "assistant" | "error" | "item" | "plan" | "approval" | "command_output" | "patch" | "compaction" | "thinking" | (string & {});
/** Approval event phase for request/resolution transitions. */
type AgentApprovalEventPhase = "requested" | "resolved";
/** Approval status after routing, user action, or delivery failure. */
type AgentApprovalEventStatus = "pending" | "unavailable" | "approved" | "denied" | "failed";
/** Approval family used by renderers and host hooks. */
type AgentApprovalEventKind = "exec" | "plugin" | "unknown";
/** Payload for approval requests and their later resolution events. */
type AgentApprovalEventData = {
  phase: AgentApprovalEventPhase;
  kind: AgentApprovalEventKind;
  status: AgentApprovalEventStatus;
  title: string;
  itemId?: string;
  toolCallId?: string;
  approvalId?: string;
  approvalSlug?: string;
  command?: string;
  host?: string;
  reason?: string;
  scope?: "turn" | "session";
  message?: string;
};
/** Enriched event delivered to subscribers after sequencing and context stamping. */
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<string, unknown>; /** Internal, non-enumerable gateway lifecycle generation that owns this run. */
  lifecycleGeneration?: string;
  sessionKey?: string;
  /**
   * sessionId the run was bound to when it started. Lifecycle persistence uses
   * this to reject terminal events from a pre-`sessions.reset` run that would
   * otherwise clobber the rotated session row resolved by the shared sessionKey.
   */
  sessionId?: string;
  agentId?: string;
};
/** Starts a new ownership generation before an in-process gateway restart. */
declare function rotateAgentEventLifecycleGeneration(): string;
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
declare function emitAgentEvent(event: Omit<AgentEventPayload, "seq" | "ts">): void;
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
declare function onAgentEvent(listener: (evt: AgentEventPayload) => void): () => void;
/** Clears all agent event state, including listeners; test-only helper. */
declare function resetAgentEventsForTest(): void;
//#endregion
export { onAgentEvent as a, emitAgentEvent as i, AgentEventPayload as n, resetAgentEventsForTest as o, AgentEventStream as r, rotateAgentEventLifecycleGeneration as s, AgentApprovalEventData as t };