//#region src/agents/agent-run-terminal-outcome-merge.ts
function completedBeforeOrAtTimeout(params) {
	return params.completed.reason === "completed" && typeof params.completed.endedAt === "number" && typeof params.timeout.endedAt === "number" && params.completed.endedAt <= params.timeout.endedAt;
}
/** Merges observations without overwriting a proven cancellation or hard timeout. */
function mergeAgentRunTerminalOutcome(current, incoming) {
	if (!current) return incoming;
	if (current.reason === "superseded" || current.reason === "cancelled") {
		if (incoming.reason === "hard_timeout" && typeof incoming.endedAt === "number" && typeof current.endedAt === "number" && incoming.endedAt <= current.endedAt) return incoming;
		return current.reason === "superseded" || incoming.reason !== "superseded" ? current : incoming;
	}
	if (current.reason === "hard_timeout") {
		if ((incoming.reason === "superseded" || incoming.reason === "cancelled") && typeof incoming.endedAt === "number" && typeof current.endedAt === "number" && incoming.endedAt < current.endedAt) return incoming;
		return completedBeforeOrAtTimeout({
			completed: incoming,
			timeout: current
		}) ? incoming : current;
	}
	if (incoming.reason === "superseded" || incoming.reason === "cancelled") return incoming;
	if (incoming.reason === "hard_timeout") return completedBeforeOrAtTimeout({
		completed: current,
		timeout: incoming
	}) ? current : incoming;
	return incoming;
}
//#endregion
export { mergeAgentRunTerminalOutcome as t };
