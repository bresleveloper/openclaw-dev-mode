import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { d as readPersistedMediaFacts, s as isMeaningfulMediaFact } from "./media-facts-CJdQ4R61.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as splitMediaOutput, t as isRelativeAssistantMediaReference } from "./parse-output-DA26FHkG.mjs";
import { r as isSuppressedControlReplyText } from "./control-reply-text-w0dVwMAz.mjs";
//#region src/gateway/chat-display-projection.helpers.ts
const DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS = 8e3;
/** Removes private yield inputs from a display copy without changing the source argument objects. */
function stripPrivateToolCallContextForDisplay(entry) {
	if (entry.type !== "toolCall" || entry.name !== "sessions_yield") return false;
	let changed = false;
	for (const field of ["arguments", "input"]) {
		const toolInput = asOptionalRecord(entry[field]);
		if (!toolInput || !("message" in toolInput)) continue;
		const { message: _, ...publicInput } = toolInput;
		entry[field] = publicInput;
		changed = true;
	}
	return changed;
}
function takeAssistantManagedMediaUrlsForDisplay(entry, role) {
	const delivery = role === "assistant" ? asOptionalRecord(entry.openclawDelivery) : void 0;
	const urls = Array.isArray(delivery?.mediaUrls) ? delivery.mediaUrls.filter((url) => typeof url === "string") : [];
	if (!delivery || !Object.hasOwn(delivery, "mediaUrls")) return {
		changed: false,
		urls
	};
	const projectedDelivery = { ...delivery };
	delete projectedDelivery.mediaUrls;
	if (Object.keys(projectedDelivery).length > 0) entry.openclawDelivery = projectedDelivery;
	else delete entry.openclawDelivery;
	return {
		changed: true,
		urls
	};
}
/** Keeps managed attachment commands in the raw transcript while removing them from display text. */
function stripAssistantMediaDirectivesForDisplay(text, managedMediaUrls) {
	if (managedMediaUrls.length === 0 || !/(?:^|\n)\s*MEDIA:/iu.test(text)) return text;
	const managed = new Set(managedMediaUrls.map((url) => url.trim()).filter(Boolean));
	const parsed = splitMediaOutput(text, { extractAudioDirectives: false });
	if (!parsed.mediaUrls?.some((url) => isRelativeAssistantMediaReference(url) && managed.has(url.trim()))) return text;
	return (parsed.segments ?? []).filter((segment) => segment.type !== "media" || !isRelativeAssistantMediaReference(segment.url) || !managed.has(segment.url.trim())).map((segment) => segment.type === "media" ? `MEDIA:${segment.url}` : segment.text).join("\n");
}
/** Resolve the text cap used when projecting chat history for display. */
function resolveEffectiveChatHistoryMaxChars(maxChars) {
	if (typeof maxChars === "number") return maxChars;
	return DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS;
}
function truncateChatHistoryText(text, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, preserveExactPrefix = false) {
	if (text.length <= maxChars) return {
		text,
		truncated: false
	};
	const prefix = truncateUtf16Safe(text, maxChars);
	return {
		text: preserveExactPrefix ? prefix : `${prefix}\n...(truncated)...`,
		truncated: true
	};
}
function extractAssistantTextForSilentCheck(message) {
	const entry = asOptionalObjectRecord(message);
	if (entry?.role !== "assistant") return;
	if (typeof entry.text === "string") return entry.text;
	if (typeof entry.content === "string") return entry.content;
	if (!Array.isArray(entry.content) || entry.content.length === 0) return;
	const texts = [];
	for (const block of entry.content) {
		const typed = asOptionalObjectRecord(block);
		if (!typed) return;
		if (isAssistantInternalReasoningContentType(typed.type)) continue;
		if (!isAssistantTextContentType(typed.type) || typeof typed.text !== "string") return;
		texts.push(typed.text);
	}
	return texts.length > 0 ? texts.join("\n") : void 0;
}
function isAssistantTextContentType(type) {
	return type === "text" || type === "input_text" || type === "output_text";
}
function isAssistantInternalReasoningContentType(type) {
	return type === "thinking" || type === "reasoning" || type === "redacted_thinking";
}
function hasAssistantNonTextContent(message) {
	const content = asOptionalObjectRecord(message)?.content;
	return Array.isArray(content) && content.some((block) => {
		const entry = asOptionalObjectRecord(block);
		return entry && !isAssistantTextContentType(entry.type);
	});
}
function hasAssistantDisplayableNonTextContent(message) {
	const content = asOptionalObjectRecord(message)?.content;
	return Array.isArray(content) && content.some((block) => {
		const entry = asOptionalObjectRecord(block);
		return entry && !isAssistantTextContentType(entry.type) && !isAssistantInternalReasoningContentType(entry.type);
	});
}
function shouldPreserveAssistantControlReplyText(message) {
	if (isProjectedForwardedMessage(message)) return true;
	if (!hasAssistantDisplayableNonTextContent(message)) return false;
	const content = message.text ?? message.content;
	const texts = typeof content === "string" ? [content] : Array.isArray(content) ? content.flatMap((block) => {
		const typed = asOptionalRecord(block);
		return isAssistantTextContentType(typed?.type) && typeof typed?.text === "string" ? [typed.text] : [];
	}) : [];
	return texts.length > 0 && texts.every((text) => isSuppressedControlReplyText(text));
}
function asRoleContentMessage(message) {
	const role = typeof message.role === "string" ? message.role.toLowerCase() : "";
	if (!role) return null;
	return {
		role,
		...message.content !== void 0 ? { content: message.content } : message.text !== void 0 ? { content: message.text } : {}
	};
}
function isEmptyTextOnlyContent(content) {
	if (typeof content === "string") return content.trim().length === 0;
	if (!Array.isArray(content)) return false;
	for (const block of content) {
		const entry = asOptionalObjectRecord(block);
		if (entry?.type !== "text" || typeof entry.text !== "string" || entry.text.trim().length > 0) return false;
	}
	return true;
}
function hasTranscriptMediaFacts(message) {
	return (readPersistedMediaFacts(message) ?? []).some(isMeaningfulMediaFact);
}
function extractProjectedText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const parts = [];
	for (const block of content) {
		const text = asOptionalObjectRecord(block)?.text;
		if (typeof text === "string") parts.push(text);
	}
	return parts.join("\n");
}
function isCronRunMessage(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	return provenance?.kind === "internal_system" && provenance.sourceTool === "cron" && Boolean(provenance.jobId && provenance.runId && provenance.sourceSessionKey);
}
function isForwardedUserMessage(message) {
	return message.role === "user" && hasForwardedMessageProvenance(message);
}
function isProjectedForwardedMessage(message) {
	return message.role === "assistant" && hasForwardedMessageProvenance(message);
}
function hasForwardedMessageProvenance(message) {
	const provenance = normalizeInputProvenance(message.provenance);
	return provenance?.kind === "inter_session" && provenance.sourceTool === "sessions_send" || isCronRunMessage(message);
}
//#endregion
export { stripPrivateToolCallContextForDisplay as _, hasAssistantDisplayableNonTextContent as a, isAssistantInternalReasoningContentType as c, isEmptyTextOnlyContent as d, isForwardedUserMessage as f, stripAssistantMediaDirectivesForDisplay as g, shouldPreserveAssistantControlReplyText as h, extractProjectedText as i, isAssistantTextContentType as l, resolveEffectiveChatHistoryMaxChars as m, asRoleContentMessage as n, hasAssistantNonTextContent as o, isProjectedForwardedMessage as p, extractAssistantTextForSilentCheck as r, hasTranscriptMediaFacts as s, DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS as t, isCronRunMessage as u, takeAssistantManagedMediaUrlsForDisplay as v, truncateChatHistoryText as y };
