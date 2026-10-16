import { createHash } from "node:crypto";
//#region src/sessions/transcript-display-position.ts
/** Keep source namespaces and rewrite generations separate without exposing storage paths. */
function createTranscriptDisplaySource(parts) {
	return createHash("sha256").update(JSON.stringify(parts)).digest("base64url");
}
/** Archive indexes retain validated placement facts without retaining tool input/output. */
function createTranscriptDisplayPositionFromActivity(source, rawSeq, activity, entrySeq) {
	const position = {
		source,
		rawSeq
	};
	if (!activity) return position;
	const { afterEntryId, scopeId, startOrder } = activity;
	const afterRawSeq = afterEntryId === null ? null : entrySeq(afterEntryId);
	if (afterRawSeq === null || afterRawSeq !== void 0 && afterRawSeq < rawSeq) position.activity = {
		afterRawSeq,
		scopeId,
		startOrder
	};
	return position;
}
//#endregion
export { createTranscriptDisplaySource as n, createTranscriptDisplayPositionFromActivity as t };
