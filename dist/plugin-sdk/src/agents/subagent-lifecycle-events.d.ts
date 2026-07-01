/**
 * Shared subagent lifecycle event literals.
 *
 * Event writers and readers use these constants to keep subagent target,
 * end-reason, and outcome values stable across registry/runtime boundaries.
 */
/** Target kind used for subagent lifecycle events. */
export declare const SUBAGENT_TARGET_KIND_SUBAGENT: "subagent";
/** End reason for a completed subagent run. */
export declare const SUBAGENT_ENDED_REASON_COMPLETE: "subagent-complete";
/** End reason for a failed subagent run. */
export declare const SUBAGENT_ENDED_REASON_ERROR: "subagent-error";
/** End reason for an explicitly killed subagent run. */
export declare const SUBAGENT_ENDED_REASON_KILLED: "subagent-killed";
/** Allowed subagent lifecycle end reason literals. */
export type SubagentLifecycleEndedReason = typeof SUBAGENT_ENDED_REASON_COMPLETE | typeof SUBAGENT_ENDED_REASON_ERROR | typeof SUBAGENT_ENDED_REASON_KILLED;
/** Successful subagent lifecycle outcome. */
export declare const SUBAGENT_ENDED_OUTCOME_OK: "ok";
/** Error subagent lifecycle outcome. */
export declare const SUBAGENT_ENDED_OUTCOME_ERROR: "error";
/** Timeout subagent lifecycle outcome. */
export declare const SUBAGENT_ENDED_OUTCOME_TIMEOUT: "timeout";
/** Killed subagent lifecycle outcome. */
export declare const SUBAGENT_ENDED_OUTCOME_KILLED: "killed";
/** Allowed subagent lifecycle outcome literals. */
export type SubagentLifecycleEndedOutcome = typeof SUBAGENT_ENDED_OUTCOME_OK | typeof SUBAGENT_ENDED_OUTCOME_ERROR | typeof SUBAGENT_ENDED_OUTCOME_TIMEOUT | typeof SUBAGENT_ENDED_OUTCOME_KILLED;
