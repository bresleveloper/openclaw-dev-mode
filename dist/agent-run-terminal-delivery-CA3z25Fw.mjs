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
export { normalizeAgentRunTerminalDeliverySnapshot as t };
