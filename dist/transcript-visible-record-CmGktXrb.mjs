import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-DLJtDQoI.mjs";
import { o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
import { t as extractStoredAssistantText } from "./chat-history-text-BbisCKtB.mjs";
import { o as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
//#region src/sessions/transcript-visible-record.ts
function isVisibleTranscriptRecord(value) {
	const record = asOptionalRecord(value);
	return Boolean(record?.message) || record?.type === "compaction" || record?.type === "reset" || record?.type === "custom_message" && record.display === true && record.customType !== OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE;
}
function isVisibleAssistantResultEventForRun(event, runId) {
	if (!isRecord(event) || !isRecord(event.message) || readSessionTranscriptRunId(event.message) !== runId || resolveTerminalAssistantTranscriptRunId(event.message, runId) === void 0 || event.message.endTurn === false) return false;
	const mirror = event.message.openclawDeliveryMirror;
	if (isRecord(mirror) && mirror.kind === "message-tool-source-reply" && mirror.final !== true) return false;
	const text = extractStoredAssistantText(event.message);
	return Boolean(text?.trim()) && !isSilentReplyText(text, "NO_REPLY");
}
/** Navigation only filters candidates; canonical content and active identity remain authoritative. */
function matchesTranscriptEvent(event, match, projection) {
	if (match.kind === "latest") return true;
	if (match.kind === "visible-final" && projection !== "navigation") return isVisibleAssistantResultEventForRun(event, match.runId);
	const message = asOptionalRecord(asOptionalRecord(event)?.message);
	if (match.kind === "idempotency") return message?.idempotencyKey === match.key && (!match.assistant || message.role === "assistant") && (match.runId === void 0 || readSessionTranscriptRunId(message) === match.runId) && (projection === "navigation" || !match.deliveryMirror || isOpenClawDeliveryMirrorAssistantMessage(message));
	return message?.role === "assistant" && readSessionTranscriptRunId(message) === match.runId;
}
//#endregion
export { isVisibleTranscriptRecord as n, matchesTranscriptEvent as r, isVisibleAssistantResultEventForRun as t };
