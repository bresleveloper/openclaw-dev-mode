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
//#region src/agents/agent-run-terminal-delivery.ts
/** Rejects malformed lifecycle/RPC input and projects only the bounded delivery fact. */
function normalizeAgentRunTerminalDeliverySnapshot(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const delivery = value;
	if (typeof delivery.resultCount !== "number" || !Number.isSafeInteger(delivery.resultCount) || delivery.resultCount < 0) return;
	switch (delivery.status) {
		case "sent":
		case "suppressed":
		case "partial_failed":
		case "failed": return {
			status: delivery.status,
			resultCount: delivery.resultCount
		};
		default: return;
	}
}
//#endregion
export { isNonTerminalAgentRunStatus as n, normalizeAgentRunTerminalDeliverySnapshot as t };
