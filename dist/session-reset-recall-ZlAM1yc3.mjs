//#region packages/memory-host-sdk/src/host/session-reset-recall.ts
function eventId(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const id = event.id;
	return typeof id === "string" && id.trim() ? id : void 0;
}
/** Resolves the first raw transcript line owned by the current reset generation. */
function resolveSessionResetRecallCutoff(events) {
	const resetIndex = events.findLastIndex((event) => event !== null && typeof event === "object" && !Array.isArray(event) && event.type === "reset");
	if (resetIndex < 0) return { state: "absent" };
	const reset = events[resetIndex];
	if (reset.firstKeptEntryId === void 0) return {
		state: "valid",
		cutoffLine: resetIndex + 1
	};
	if (typeof reset.firstKeptEntryId !== "string" || !reset.firstKeptEntryId.trim()) return { state: "invalid" };
	const keptIndex = events.findIndex((event, index) => index < resetIndex && eventId(event) === reset.firstKeptEntryId);
	return keptIndex < 0 ? { state: "invalid" } : {
		state: "valid",
		cutoffLine: keptIndex + 1
	};
}
//#endregion
export { resolveSessionResetRecallCutoff as t };
