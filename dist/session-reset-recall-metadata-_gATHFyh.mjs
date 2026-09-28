//#region extensions/memory-core/src/session-reset-recall-metadata.ts
const RESET_RECALL_CUTOFF = Symbol.for("openclaw.memory.sessionResetRecallCutoff");
function readSessionResetRecallCutoffMetadata(value) {
	if (!value || typeof value !== "object") return { state: "invalid" };
	const cutoff = value[RESET_RECALL_CUTOFF];
	if (!cutoff || typeof cutoff !== "object") return { state: "invalid" };
	const state = cutoff.state;
	if (state === "absent" || state === "invalid") return { state };
	const cutoffLine = cutoff.cutoffLine;
	return state === "valid" && typeof cutoffLine === "number" && Number.isInteger(cutoffLine) ? {
		state,
		cutoffLine
	} : { state: "invalid" };
}
function readSessionArchiveReasonFromHitPath(hitPath) {
	const reason = /\.jsonl\.(reset|deleted)\.\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:\.\d{3})?Z(?:\.zst)?$/.exec(hitPath)?.[1];
	return reason === "reset" || reason === "deleted" ? reason : void 0;
}
//#endregion
export { readSessionResetRecallCutoffMetadata as n, readSessionArchiveReasonFromHitPath as t };
