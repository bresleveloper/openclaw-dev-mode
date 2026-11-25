declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
declare const AGENT_RUN_SUPERSEDED_STOP_REASON: "superseded";
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "tool_execution", "post_turn", "gateway_draining"];
type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
type AgentRunWaitStatus = "ok" | "error" | "timeout";
type AgentRunTerminalReason = "completed" | "hard_timeout" | "timed_out" | "superseded" | "cancelled" | "aborted" | "blocked" | "abandoned" | "failed";
type AgentRunTerminalFacts = {
  reason: AgentRunTerminalReason;
  status: AgentRunWaitStatus;
  stopReason?: string;
  livenessState?: string;
  timeoutPhase?: AgentRunTimeoutPhase;
  providerStarted?: boolean;
};
type AgentRunTerminalFactInput = {
  status: AgentRunWaitStatus;
  stopReason?: unknown;
  livenessState?: unknown;
  timeoutPhase?: unknown;
  providerStarted?: unknown;
};
type AgentRunWaitTerminalFactInput = Omit<AgentRunTerminalFactInput, "status"> & {
  status?: unknown;
};
/** Applies lifecycle flags before interpreting the same canonical terminal metadata. */
declare function resolveAgentRunLifecycleTerminalFacts(input: {
  phase: "end" | "error";
  data?: AgentRunWaitTerminalFactInput & {
    aborted?: unknown;
  };
  abortFields?: {
    aborted?: true;
    stopReason?: string;
  };
}): AgentRunTerminalFacts;
export { AgentRunTimeoutPhase as a, AgentRunTerminalFacts as i, AGENT_RUN_RESTART_ABORT_STOP_REASON as n, resolveAgentRunLifecycleTerminalFacts as o, AGENT_RUN_SUPERSEDED_STOP_REASON as r, AGENT_RUN_ABORTED_STOP_REASON as t };