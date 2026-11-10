import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/memory-host-sdk/src/host/session-reset-recall.ts
/** Resolves the first raw transcript line owned by the current reset generation. */
function resolveSessionResetRecallCutoff(events) {
	const resetIndex = events.findLastIndex((event) => asOptionalRecord(event)?.type === "reset");
	if (resetIndex < 0) return { state: "absent" };
	const reset = events[resetIndex];
	if (reset.firstKeptEntryId === void 0) return {
		state: "valid",
		cutoffLine: resetIndex + 1
	};
	if (typeof reset.firstKeptEntryId !== "string" || !reset.firstKeptEntryId.trim()) return { state: "invalid" };
	const keptIndex = events.findIndex((event, index) => index < resetIndex && asOptionalRecord(event)?.id === reset.firstKeptEntryId);
	return keptIndex < 0 ? { state: "invalid" } : {
		state: "valid",
		cutoffLine: keptIndex + 1
	};
}
//#endregion
export { resolveSessionResetRecallCutoff as t };
