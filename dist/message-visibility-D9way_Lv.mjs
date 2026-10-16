import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as normalizeSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { a as isSilentReplyPayloadText, r as SILENT_REPLY_TOKEN, s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { v as isReplyPayloadTerminalContent } from "./reply-payload-NzglYOOT.mjs";
import { l as resolveAssistantMessagePhase } from "./chat-message-content-C-d0FKNG.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-jHsxUGXm.mjs";
//#region src/agents/embedded-agent-runner/message-visibility.ts
function collectMediaUrlsFromRecord(record, output, seen = /* @__PURE__ */ new WeakSet()) {
	if (seen.has(record)) return;
	seen.add(record);
	for (const key of [
		"mediaUrl",
		"mediaUrls",
		"path",
		"url",
		"filePath"
	]) for (const value of normalizeSingleOrTrimmedStringList(record[key])) output.add(value);
	if (Array.isArray(record.attachments)) for (const attachment of record.attachments) {
		const nested = asOptionalRecord(attachment);
		if (nested) collectMediaUrlsFromRecord(nested, output, seen);
	}
}
function hasVisibleAttachmentReference(value) {
	if (!Array.isArray(value)) return false;
	const urls = /* @__PURE__ */ new Set();
	collectMediaUrlsFromRecord({ attachments: value }, urls);
	return urls.size > 0;
}
/** Applies the shared exact or payload-aware silent-reply contract. */
function isSilentAgentReplyText(value, mode = "exact") {
	if (typeof value !== "string") return false;
	return mode === "payload" ? isSilentReplyPayloadText(value, SILENT_REPLY_TOKEN) : isSilentReplyText(value, SILENT_REPLY_TOKEN);
}
/** Returns whether payload metadata contains user-visible content. */
function hasVisibleAgentPayload(result, options = {}) {
	return Array.isArray(result.payloads) && result.payloads.some((payload) => {
		if (!payload || typeof payload !== "object") return false;
		const record = payload;
		if (options.requireTerminalContent && (record.visible === false || !isReplyPayloadTerminalContent(record))) return false;
		if (options.includeErrorPayloads === false && record.isError === true) return false;
		if (options.includeReasoningPayloads === false && record.isReasoning === true) return false;
		const visibleText = hasNonEmptyString(record.text) && (options.includeSilentReplyPayloads !== false || !isSilentAgentReplyText(record.text, "payload"));
		return Boolean(visibleText || hasNonEmptyString(record.mediaUrl) || hasAnyNonEmptyString(record.mediaUrls) || hasVisibleAttachmentReference(record.attachments) || record.visible === true || record.presentation || record.interactive || record.channelData);
	});
}
/** Honors recorded visibility before deriving it from the payload's visible content. */
function hasExplicitlyVisibleAgentPayload(payload) {
	const visible = asOptionalRecord(payload)?.visible;
	if (typeof visible === "boolean") return visible;
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
/** Returns whether a payload intentionally contains only the silent-reply marker. */
function hasIntentionalSilentAgentPayload(result) {
	return (Array.isArray(result.payloads) ? result.payloads : []).some((payload) => {
		const record = asOptionalRecord(payload);
		if (!record) return false;
		return isSilentAgentReplyText(record.text, "payload") && !hasVisibleAgentPayload({ payloads: [{
			...record,
			text: void 0
		}] });
	});
}
/** Reads a transcript message role without trusting its boundary shape. */
function getTranscriptMessageRole(message) {
	const role = asOptionalObjectRecord(message)?.role;
	return typeof role === "string" ? role : void 0;
}
/** Reads a committed final source-reply mirror from a transcript message. */
function readTerminalSourceReplyDeliveryMirror(message) {
	const delivery = asOptionalObjectRecord(asOptionalObjectRecord(message)?.openclawDeliveryMirror);
	if (!delivery) return;
	const sourceTurnId = typeof delivery.sourceTurnId === "string" ? delivery.sourceTurnId.trim() : "";
	if (delivery.kind !== "message-tool-source-reply" || delivery.final !== true || !sourceTurnId) return;
	const toolCallId = typeof delivery.toolCallId === "string" ? delivery.toolCallId.trim() : "";
	return {
		sourceTurnId,
		...toolCallId ? { toolCallId } : {}
	};
}
/** System and malformed records do not constitute a resumable transcript tail. */
function isMeaningfulTranscriptMessage(message) {
	const role = getTranscriptMessageRole(message);
	return Boolean(role && role !== "system");
}
/** Recognizes persisted progress without mistaking an ordinary assistant answer for completion. */
function isIntermediateAssistantTranscriptMessage(message) {
	const record = asOptionalObjectRecord(message);
	if (record?.role !== "assistant") return false;
	if (record.stopReason !== void 0 && record.stopReason !== "stop") return false;
	if (hasNonEmptyString(asOptionalRecord(record.openclawAsyncDelivery)?.itemId)) return true;
	const phase = resolveAssistantMessagePhase(message);
	if (phase !== void 0) return phase === "commentary";
	const fallback = asOptionalRecord(record.openclawStreamFallback);
	return fallback?.source === "segment" && hasNonEmptyString(fallback.itemId);
}
/** Returns whether a stopped assistant turn contains only reasoning and a silent marker. */
function isTerminalSilentAssistantMessage(message) {
	const messageRecord = asOptionalObjectRecord(message);
	if (messageRecord?.role !== "assistant" || typeof messageRecord.stopReason !== "string" || messageRecord.stopReason.trim() !== "stop") return false;
	const content = messageRecord.content;
	if (!Array.isArray(content) || content.length === 0) return false;
	const textParts = [];
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const record = block;
		const type = typeof record.type === "string" ? record.type.trim() : void 0;
		if (type === "thinking") continue;
		if (type !== "text") return false;
		if (typeof record.text === "string" && record.text.trim()) textParts.push(record.text.trim());
	}
	return isSilentAgentReplyText(textParts.join("\n"), "payload");
}
//#endregion
export { hasVisibleAgentPayload as a, isSilentAgentReplyText as c, hasIntentionalSilentAgentPayload as i, isTerminalSilentAssistantMessage as l, getTranscriptMessageRole as n, isIntermediateAssistantTranscriptMessage as o, hasExplicitlyVisibleAgentPayload as r, isMeaningfulTranscriptMessage as s, collectMediaUrlsFromRecord as t, readTerminalSourceReplyDeliveryMirror as u };
