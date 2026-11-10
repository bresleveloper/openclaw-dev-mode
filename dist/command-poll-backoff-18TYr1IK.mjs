//#region src/agents/command-poll-backoff.ts
const BACKOFF_SCHEDULE_MS = [
	5e3,
	1e4,
	3e4,
	6e4
];
function recordCommandPoll(state, commandId, hasNewOutput) {
	const counts = state.commandPollCounts ??= /* @__PURE__ */ new Map();
	const existing = counts.get(commandId);
	const now = Date.now();
	const count = hasNewOutput ? 0 : (existing?.count ?? -1) + 1;
	counts.set(commandId, {
		count,
		lastPollAt: now
	});
	return BACKOFF_SCHEDULE_MS[Math.min(count, BACKOFF_SCHEDULE_MS.length - 1)] ?? 6e4;
}
function resetCommandPollCount(state, commandId) {
	state.commandPollCounts?.delete(commandId);
}
function pruneStaleCommandPollsCore(state, maxAgeMs = 36e5) {
	if (!state.commandPollCounts) return;
	const now = Date.now();
	for (const [commandId, data] of state.commandPollCounts.entries()) if (now - data.lastPollAt > maxAgeMs) state.commandPollCounts.delete(commandId);
}
//#endregion
export { recordCommandPoll as n, resetCommandPollCount as r, pruneStaleCommandPollsCore as t };
