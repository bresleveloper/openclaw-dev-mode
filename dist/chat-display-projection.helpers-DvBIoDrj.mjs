import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { c as isMeaningfulMediaFact, f as readPersistedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { n as splitMediaOutput, t as isRelativeAssistantMediaReference } from "./parse-output-DRIp2d_R.mjs";
import { l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DHFPcfdZ.mjs";
//#region src/gateway/control-reply-text.ts
const SUPPRESSED_CONTROL_REPLY_TOKENS = [
	SILENT_REPLY_TOKEN,
	"ANNOUNCE_SKIP",
	"REPLY_SKIP"
];
const POSSIBLE_CONTROL_REPLY_START = new RegExp(`^(?:[\\s\\p{P}]{64}|[\\s\\p{P}]{0,63}(?:${SUPPRESSED_CONTROL_REPLY_TOKENS.join("|")}))`, "iu");
const CONTROL_REPLY_SEQUENCE_PREFIX = new RegExp(`^(?:(?:${SUPPRESSED_CONTROL_REPLY_TOKENS.join("|")})\\s+)+([A-Z_]+)$`, "i");
/**
* Recognize control-only replies, including a repeated marker's unfinished tail.
*/
function isSuppressedControlReplyText(text) {
	if (!POSSIBLE_CONTROL_REPLY_START.test(text)) return false;
	const normalized = text.trim();
	const repeatedFragment = CONTROL_REPLY_SEQUENCE_PREFIX.exec(normalized)?.[1]?.toUpperCase();
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => isSilentReplyText(normalized, token) || repeatedFragment !== void 0 && token.startsWith(repeatedFragment));
}
/** Remove internal control tokens when a model appends one to visible reply text. */
function stripSuppressedControlReplyToken(text) {
	if (isSuppressedControlReplyText(text)) return "";
	let stripped = text;
	for (const token of SUPPRESSED_CONTROL_REPLY_TOKENS) {
		const next = stripSilentToken(stripped, token);
		if (next !== stripped.trim()) stripped = next;
	}
	return stripped;
}
/**
* Return true when streamed assistant text looks like the leading fragment of a control token.
*/
function isSuppressedControlReplyLeadFragment(text) {
	const trimmed = text.trim();
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => {
		let fragment = trimmed;
		while (fragment.length > token.length && fragment.slice(0, token.length).toUpperCase() === token && /\s/.test(fragment.charAt(token.length))) fragment = fragment.slice(token.length).trimStart();
		return fragment.length > 0 && fragment.length < token.length && token.startsWith(fragment.toUpperCase());
	});
}
//#endregion
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
	if (managedMediaUrls.length === 0 || !/(?:^|[\r\n])\s*MEDIA:/iu.test(text)) return text;
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
function truncateChatHistoryText(text, maxChars = DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS, preserveExactPrefix = false, toolResultMaxChars) {
	let limit = maxChars;
	if (toolResultMaxChars !== void 0 && toolResultMaxChars < Math.min(text.length, maxChars)) {
		const preview = truncateUtf16Safe(text, maxChars);
		if (!/^\s*[[{]/u.test(preview) || safeParseJson(preview) === void 0) limit = toolResultMaxChars;
	}
	if (text.length <= limit) return {
		text,
		truncated: false
	};
	const prefix = truncateUtf16Safe(text, limit);
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
function hasAssistantNonTextContent(message, includeReasoning = true) {
	const content = asOptionalObjectRecord(message)?.content;
	return Array.isArray(content) && content.some((block) => {
		const entry = asOptionalObjectRecord(block);
		return entry && !isAssistantTextContentType(entry.type) && (includeReasoning || !isAssistantInternalReasoningContentType(entry.type));
	});
}
function hasAssistantDisplayableNonTextContent(message) {
	return hasAssistantNonTextContent(message, false);
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
export { stripSuppressedControlReplyToken as C, isSuppressedControlReplyText as S, stripPrivateToolCallContextForDisplay as _, hasAssistantDisplayableNonTextContent as a, SUPPRESSED_CONTROL_REPLY_TOKENS as b, isAssistantInternalReasoningContentType as c, isEmptyTextOnlyContent as d, isForwardedUserMessage as f, stripAssistantMediaDirectivesForDisplay as g, shouldPreserveAssistantControlReplyText as h, extractProjectedText as i, isAssistantTextContentType as l, resolveEffectiveChatHistoryMaxChars as m, asRoleContentMessage as n, hasAssistantNonTextContent as o, isProjectedForwardedMessage as p, extractAssistantTextForSilentCheck as r, hasTranscriptMediaFacts as s, DEFAULT_CHAT_HISTORY_TEXT_MAX_CHARS as t, isCronRunMessage as u, takeAssistantManagedMediaUrlsForDisplay as v, isSuppressedControlReplyLeadFragment as x, truncateChatHistoryText as y };
