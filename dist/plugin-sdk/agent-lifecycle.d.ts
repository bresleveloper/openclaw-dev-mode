import { o as resolveAgentRunLifecycleTerminalFacts } from "../agent-run-terminal-outcome-BupHamA3.js";
/** Shared classification for an ended model turn whose parent task is still waiting. */
type AgentLifecycleParentStateEvent = {
  phase?: unknown;
  yielded?: unknown;
  livenessState?: unknown;
  stopReason?: unknown;
  aborted?: unknown;
  status?: unknown;
  timeoutPhase?: unknown;
  error?: unknown;
};
export declare function isAgentLifecycleYieldedWaiting(event: AgentLifecycleParentStateEvent): boolean;
export { resolveAgentRunLifecycleTerminalFacts };