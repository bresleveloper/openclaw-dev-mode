import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isSessionTranscriptLeafControl, o as parseSessionTranscriptTreeEntry, r as isSessionTranscriptSideAppendEntry, t as isCanonicalSessionTranscriptEntry } from "./transcript-tree-D61jhi_i.mjs";
//#region src/config/sessions/session-transcript-projection-append.ts
function readMessageText(message) {
	if (!isRecord(message) || message.role !== "user" && message.role !== "assistant") return;
	if (typeof message.content === "string") return message.content.trim() || void 0;
	if (typeof message.text === "string") return message.text.trim() || void 0;
	if (!Array.isArray(message.content)) return;
	const parts = message.content.flatMap((block) => {
		if (!isRecord(block) || block.type !== "text" && block.type !== "input_text" && block.type !== "output_text") return [];
		return typeof block.text === "string" && block.text.trim() ? [block.text] : [];
	});
	return parts.length > 0 ? parts.join("\n") : void 0;
}
/** Extracts the searchable user/assistant text from one transcript event. */
function extractTranscriptIndexEntry(event, fallbackTimestamp) {
	if (!isRecord(event) || event.type !== "message" || typeof event.id !== "string") return;
	const message = isRecord(event.message) ? event.message : void 0;
	const role = message?.role;
	const id = event.id.trim();
	if (!id || role !== "user" && role !== "assistant") return;
	const text = readMessageText(message);
	if (!text) return;
	const timestamp = typeof event.timestamp === "number" ? event.timestamp : typeof event.timestamp === "string" ? Date.parse(event.timestamp) : NaN;
	return {
		messageId: id,
		role,
		text,
		timestamp: Number.isFinite(timestamp) ? timestamp : fallbackTimestamp
	};
}
function hasTranscriptMessage(event) {
	return isRecord(event) && Object.hasOwn(event, "message") && event.message !== void 0;
}
/** Control facts still belong in bounded context acquisition, even without a replay message. */
function transcriptEventContextEligibility(event) {
	const message = isRecord(event) && (event.type === "custom_message" ? event : event.message);
	return isRecord(message) && message.excludeFromContext === true ? 0 : 1;
}
function shouldProjectActiveEvent(event) {
	return isRecord(event) && event.type !== "session" && (isCanonicalSessionTranscriptEntry(event) || parseSessionTranscriptTreeEntry(event) !== void 0 || hasTranscriptMessage(event));
}
/** Resolves one append against an already-complete projection without mutating storage. */
function prepareSessionTranscriptProjectionAppend(params) {
	const { cursor } = params;
	const treeEntry = parseSessionTranscriptTreeEntry(params.event);
	const isCanonicalEvent = isCanonicalSessionTranscriptEntry(params.event);
	const initializesProjection = cursor.indexedSeq === -1;
	if (params.seq !== cursor.indexedSeq + 1 || !initializesProjection && (isSessionTranscriptLeafControl(params.event) || isSessionTranscriptSideAppendEntry(params.event) || isCanonicalEvent && cursor.leafEventId === null && cursor.activeEventCount > 0 || !isCanonicalEvent && cursor.leafEventId !== null && shouldProjectActiveEvent(params.event) || treeEntry && treeEntry.parentId !== cursor.leafEventId)) return;
	const ftsRow = extractTranscriptIndexEntry(params.event, params.createdAt);
	const projectsActiveEvent = shouldProjectActiveEvent(params.event);
	const projectsMessage = projectsActiveEvent && hasTranscriptMessage(params.event);
	const activeRow = projectsActiveEvent ? {
		activePosition: cursor.activeEventCount,
		contextEligible: transcriptEventContextEligibility(params.event),
		eventSeq: params.seq,
		messagePosition: projectsMessage ? cursor.activeMessageCount : null
	} : void 0;
	return {
		...activeRow ? { activeRow } : {},
		cursor: {
			activeEventCount: cursor.activeEventCount + (projectsActiveEvent ? 1 : 0),
			activeMessageCount: cursor.activeMessageCount + (projectsMessage ? 1 : 0),
			indexedSeq: params.seq,
			leafEventId: params.eventId !== null && isCanonicalEvent ? params.eventId : cursor.leafEventId
		},
		...ftsRow ? { ftsRow } : {}
	};
}
//#endregion
export { transcriptEventContextEligibility as a, shouldProjectActiveEvent as i, hasTranscriptMessage as n, prepareSessionTranscriptProjectionAppend as r, extractTranscriptIndexEntry as t };
