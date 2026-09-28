//#region src/agents/subagents/registry/subagent-lifecycle-events.ts
/**
* Shared subagent lifecycle event literals.
*
* Event writers and readers use these constants to keep subagent target,
* end-reason, and outcome values stable across registry/runtime boundaries.
*/
/** Target kind used for subagent lifecycle events. */
const SUBAGENT_TARGET_KIND_SUBAGENT = "subagent";
/** End reason for a completed subagent run. */
const SUBAGENT_ENDED_REASON_COMPLETE = "subagent-complete";
/** End reason for a failed subagent run. */
const SUBAGENT_ENDED_REASON_ERROR = "subagent-error";
/** End reason for an explicitly killed subagent run. */
const SUBAGENT_ENDED_REASON_KILLED = "subagent-killed";
/** Error subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_ERROR = "error";
/** Timeout subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_TIMEOUT = "timeout";
/** Killed subagent lifecycle outcome. */
const SUBAGENT_ENDED_OUTCOME_KILLED = "killed";
//#endregion
export { SUBAGENT_ENDED_REASON_ERROR as a, SUBAGENT_ENDED_REASON_COMPLETE as i, SUBAGENT_ENDED_OUTCOME_KILLED as n, SUBAGENT_ENDED_REASON_KILLED as o, SUBAGENT_ENDED_OUTCOME_TIMEOUT as r, SUBAGENT_TARGET_KIND_SUBAGENT as s, SUBAGENT_ENDED_OUTCOME_ERROR as t };
