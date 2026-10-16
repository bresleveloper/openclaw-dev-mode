//#region src/shared/agent-run-status.ts
/**
* Shared agent-run status predicates for gateway wait loops and delivery announcements.
* Keep the status set aligned with the gateway protocol values that can still transition.
*/
/** Statuses that are not final and should keep waiters/subscribers attached. */
const NON_TERMINAL_AGENT_RUN_STATUSES = /* @__PURE__ */ new Set([
	"accepted",
	"started",
	"in_flight"
]);
/** Returns true for agent-run statuses that still need polling or live updates. */
function isNonTerminalAgentRunStatus(status) {
	return typeof status === "string" && NON_TERMINAL_AGENT_RUN_STATUSES.has(status);
}
//#endregion
export { isNonTerminalAgentRunStatus as t };
