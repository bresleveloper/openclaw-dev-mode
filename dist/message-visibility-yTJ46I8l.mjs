import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-BTKQYTUd.mjs";
import { _ as isReplyPayloadTerminalContent } from "./reply-payload-B2ZQhznY.mjs";
import { l as resolveAssistantMessagePhase } from "./chat-message-content-D14VlZZc.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-hxU4G9Np.mjs";
//#region src/agents/embedded-agent-runner/message-visibility.ts
function collectStringValues(value, output) {
	if (typeof value === "string" && value.trim()) {
		output.add(value.trim());
		return;
	}
	if (!Array.isArray(value)) return;
	for (const entry of value) if (typeof entry === "string" && entry.trim()) output.add(entry.trim());
}
function collectMediaUrlsFromRecord(record, output, seen = /* @__PURE__ */ new WeakSet()) {
	if (seen.has(record)) return;
	seen.add(record);
	collectStringValues(record.mediaUrl, output);
	collectStringValues(record.mediaUrls, output);
	collectStringValues(record.path, output);
	collectStringValues(record.url, output);
	collectStringValues(record.filePath, output);
	if (Array.isArray(record.attachments)) {
		for (const attachment of record.attachments) if (attachment && typeof attachment === "object" && !Array.isArray(attachment)) collectMediaUrlsFromRecord(attachment, output, seen);
	}
}
function hasVisibleAttachmentReference(value) {
	if (!Array.isArray(value)) return false;
	const urls = /* @__PURE__ */ new Set();
	for (const attachment of value) if (attachment && typeof attachment === "object" && !Array.isArray(attachment)) collectMediaUrlsFromRecord(attachment, urls);
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
	if (payload && typeof payload === "object" && !Array.isArray(payload) && "visible" in payload) {
		if (typeof payload.visible === "boolean") return payload.visible;
	}
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
/** Returns whether a payload intentionally contains only the silent-reply marker. */
function hasIntentionalSilentAgentPayload(result) {
	return (Array.isArray(result.payloads) ? result.payloads : []).some((payload) => {
		if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
		const record = payload;
		return isSilentAgentReplyText(record.text, "payload") && !hasVisibleAgentPayload({ payloads: [{
			...record,
			text: void 0
		}] });
	});
}
/** Reads a transcript message role without trusting its boundary shape. */
function getTranscriptMessageRole(message) {
	if (!message || typeof message !== "object") return;
	const role = message.role;
	return typeof role === "string" ? role : void 0;
}
/** Reads a committed final source-reply mirror from a transcript message. */
function readTerminalSourceReplyDeliveryMirror(message) {
	if (!message || typeof message !== "object") return;
	const marker = message.openclawDeliveryMirror;
	if (!marker || typeof marker !== "object") return;
	const delivery = marker;
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
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant") return false;
	const record = message;
	if (record.stopReason !== void 0 && record.stopReason !== "stop") return false;
	const asyncDelivery = record.openclawAsyncDelivery;
	if (asyncDelivery && typeof asyncDelivery === "object" && !Array.isArray(asyncDelivery)) {
		const itemId = asyncDelivery.itemId;
		if (typeof itemId === "string" && itemId.trim().length > 0) return true;
	}
	const phase = resolveAssistantMessagePhase(message);
	if (phase !== void 0) return phase === "commentary";
	const fallback = record.openclawStreamFallback;
	if (!fallback || typeof fallback !== "object" || Array.isArray(fallback)) return false;
	const { itemId, source } = fallback;
	return source === "segment" && typeof itemId === "string" && itemId.trim().length > 0;
}
/** Returns whether a stopped assistant turn contains only reasoning and a silent marker. */
function isTerminalSilentAssistantMessage(message) {
	if (!message || typeof message !== "object" || getTranscriptMessageRole(message) !== "assistant" || typeof message.stopReason !== "string" || message.stopReason.trim() !== "stop") return false;
	const content = message.content;
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
