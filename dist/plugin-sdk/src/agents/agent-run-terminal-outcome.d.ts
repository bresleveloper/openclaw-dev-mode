import { type AgentRunTimeoutPhase } from "./run-timeout-attribution.js";
/** Wait status reported by agent run terminal wait paths. */
type AgentRunWaitStatus = "ok" | "error" | "timeout";
/** Normalized terminal reason for an agent run. */
type AgentRunTerminalReason = "completed" | "hard_timeout" | "timed_out" | "cancelled" | "aborted" | "blocked" | "failed";
/** Normalized terminal outcome for an agent run. */
export type AgentRunTerminalOutcome = {
    reason: AgentRunTerminalReason;
    status: AgentRunWaitStatus;
    error?: string;
    stopReason?: string;
    livenessState?: string;
    timeoutPhase?: AgentRunTimeoutPhase;
    providerStarted?: boolean;
    startedAt?: number;
    endedAt?: number;
};
/** Raw terminal input collected from run wait/liveness/timeout paths. */
type AgentRunTerminalInput = {
    status: AgentRunWaitStatus;
    error?: unknown;
    stopReason?: unknown;
    livenessState?: unknown;
    timeoutPhase?: unknown;
    providerStarted?: unknown;
    startedAt?: unknown;
    endedAt?: unknown;
};
/** Terminal wait input where pending/unknown status may still be present. */
type AgentRunTerminalWaitInput = Omit<AgentRunTerminalInput, "status"> & {
    status?: unknown;
};
/** True when an outcome should not be overwritten by ordinary later status. */
export declare function isStickyAgentRunTerminalOutcome(outcome: AgentRunTerminalOutcome | undefined | null): boolean;
/** Builds the normalized terminal outcome from raw run status metadata. */
export declare function buildAgentRunTerminalOutcome(input: AgentRunTerminalInput): AgentRunTerminalOutcome;
/** Builds a terminal outcome from a wait result, ignoring pending/unknown status. */
/** Builds a terminal outcome from wait paths where status may still be pending/unknown. */
export declare function buildAgentRunTerminalOutcomeFromWaitResult(wait: AgentRunTerminalWaitInput | undefined): AgentRunTerminalOutcome | undefined;
/** Merges terminal outcomes while preserving cancellation and hard-timeout ownership. */
/** Merges later terminal observations without overwriting sticky cancellation/hard-timeout state. */
export declare function mergeAgentRunTerminalOutcome(current: AgentRunTerminalOutcome | undefined, incoming: AgentRunTerminalOutcome): AgentRunTerminalOutcome;
export {};
