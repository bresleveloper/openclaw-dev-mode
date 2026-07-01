/**
 * Shared agent run termination constants.
 *
 * Runtime and stream consumers use these stable literals to recognize user or
 * controller aborts without matching free-form error text.
 */
/** Stop reason emitted when an agent run is aborted. */
declare const AGENT_RUN_ABORTED_STOP_REASON: "aborted";
/** Error text used for aborted agent runs. */
export declare const AGENT_RUN_ABORTED_ERROR: "agent run aborted";
export declare const AGENT_RUN_RESTART_ABORT_STOP_REASON: "restart";
export declare function createAgentRunRestartAbortError(): Error;
export declare function isAgentRunRestartAbortReason(value: unknown): boolean;
export declare function resolveAgentRunAbortLifecycleFields(signal: AbortSignal | undefined): {
    aborted?: true;
    stopReason?: typeof AGENT_RUN_ABORTED_STOP_REASON | typeof AGENT_RUN_RESTART_ABORT_STOP_REASON | "timeout";
};
/** Returns whether a stop reason is the stable aborted-run reason. */
export declare function isAbortedAgentStopReason(value: unknown): value is typeof AGENT_RUN_ABORTED_STOP_REASON | typeof AGENT_RUN_RESTART_ABORT_STOP_REASON;
export {};
