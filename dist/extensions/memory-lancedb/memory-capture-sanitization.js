import { escapeRegExp, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES } from "openclaw/plugin-sdk/chat-channel-ids";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import { MESSAGE_TOOL_DELIVERY_HINTS } from "openclaw/plugin-sdk/message-tool-delivery-hints";
//#region extensions/memory-lancedb/memory-capture-sanitization.ts
const MEDIA_NOTE_HEADER = /^\[media attached(?: \d+\/\d+)?: /;
function dropMediaNoteLines(text) {
	return text.split("\n").filter((line) => !(MEDIA_NOTE_HEADER.test(line) && line.endsWith("]"))).join("\n");
}
const MARKER_HEADER_LINE_RE = /^[^\n]*⟦openclaw:ctx⟧[ \t]*$/m;
const MARKER_JSON_BLOCK_RE = /^[^\n]*⟦openclaw:ctx⟧[ \t]*\n[ \t]*```json[ \t]*\n[\s\S]*?\n[ \t]*```[ \t]*\n?/gm;
const LEADING_CHRONOLOGICAL_MARKER_HEADER_RE = /^\s*[^\n]*chronological[^\n]*⟦openclaw:ctx⟧[ \t]*(?:\n|$)/;
const MESSAGE_TOOL_DELIVERY_HINT_RE = new RegExp(`^\\s*(?:${MESSAGE_TOOL_DELIVERY_HINTS.map(escapeRegExp).join("|")})\\s*$`, "m");
const HISTORY_CONTEXT_MARKER = "[Chat messages since your last reply - for context]";
const CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
const HISTORY_CONTEXT_MARKERS = [
	HISTORY_CONTEXT_MARKER,
	"[Chat messages since your last reply — CONTEXT ONLY]",
	"[Merged earlier messages — CONTEXT ONLY]"
];
const CURRENT_MESSAGE_MARKERS = [
	CURRENT_MESSAGE_MARKER,
	"[CURRENT MESSAGE — reply to this]",
	"[CURRENT MESSAGE — reply using the context above]"
];
const ACTIVE_TURN_RECOVERY_RE = /active-turn-recovery/i;
const BRACKETED_PREFIX_RE = /\[[^\]\n]{1,500}\]\s/g;
const LEADING_CURRENT_MESSAGE_CONTEXT_RE = /^\s*Current message:[ \t]*(?:\n|$)/;
const LEADING_CURRENT_MESSAGE_REPLY_LINE_RE = /^\s*\[Replying to:[^\n]{0,1000}\]\s*\n/;
const LEADING_CURRENT_MESSAGE_ID_SENDER_RE = /^#\d+\s+[^\n:]{1,100}:\s*/;
const CONTEXT_HEADER_RE = /^Context:[ \t]*⟦openclaw:ctx⟧[ \t]*$/m;
const ENVELOPE_JSON_LINE_RE = /^\s*\{\s*(?:\n\s*)?"(?:chat_id|message_id|reply_to_id|sender_id|conversation_label|conversation_info|sender_name|channel_id|channel_type|group_subject|group_channel|group_space|topic_id|thread_label)"\s*:/m;
const INBOUND_ENVELOPE_PREFIX_RE = /^\[([^\]\n]{0,300}?(?:\s\+(?:\d+[smhdwy]|just now)\b|\s[A-Za-z]{3}\s\d{4}-\d{2}-\d{2})[^\]\n]{0,200})\]\s/;
const ENVELOPE_KNOWN_CHANNEL_PATTERN = BUNDLED_CHAT_CHANNEL_ENVELOPE_PREFIXES.map(escapeRegExp).join("|");
const INBOUND_ENVELOPE_KNOWN_CHANNEL_PREFIX_RE = ENVELOPE_KNOWN_CHANNEL_PATTERN ? new RegExp(`^\\[((?:${ENVELOPE_KNOWN_CHANNEL_PATTERN})\\s+[^\\]\\n\\s][^\\]\\n]{0,299})\\]\\s`, "i") : null;
const ENVELOPE_BODY_SENDER_PREFIX_RE = /^([^\n:]{1,120}):\s/;
const ENVELOPE_BODY_DIRECT_PREFIX = "(sender)";
const ENVELOPE_BODY_SELF_PREFIX = "(self)";
const SENDER_PREFIXED_ENVELOPE_CHANNEL_RE = /^(?:discord|imessage|line|mattermost|qqbot|signal|slack|telegram|whatsapp)(?:\s|$)/i;
const NON_DIRECT_ENVELOPE_HEADER_RE = /(?:^|\s)(?:#[^\s]+|group:[^\s]+|group\s+id:[^\s]+|room:[^\s]+|channel\s+id:[^\s]+|id:-[^\s]+|unknown-group|[^\s]+@g\.us)(?:\s|$)/i;
const USER_AUTHORED_BODY_LABEL_RE = /^(?:action|decision|fixme|note|question|reminder|todo)$/i;
function matchKnownChannelMarkerFreeEnvelopePrefix(text, options) {
	const match = INBOUND_ENVELOPE_KNOWN_CHANNEL_PREFIX_RE?.exec(text);
	if (!match) return null;
	const headerInside = match[1] ?? "";
	if (NON_DIRECT_ENVELOPE_HEADER_RE.test(headerInside)) return match;
	const body = text.slice(match[0].length);
	if (stripEnvelopeBodySenderPrefix(body, headerInside) !== body) return match;
	return options?.allowAmbiguousDirect ? match : null;
}
function looksLikeEnvelopeSludge(text) {
	return MARKER_HEADER_LINE_RE.test(text) || MESSAGE_TOOL_DELIVERY_HINT_RE.test(text) || HISTORY_CONTEXT_MARKERS.some((marker) => text.includes(marker)) || CURRENT_MESSAGE_MARKERS.some((marker) => text.includes(marker)) || ACTIVE_TURN_RECOVERY_RE.test(text) || ENVELOPE_JSON_LINE_RE.test(text) || INBOUND_ENVELOPE_PREFIX_RE.test(text) || matchKnownChannelMarkerFreeEnvelopePrefix(text) !== null;
}
const LEADING_TIMESTAMP_PREFIX_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
function stripEnvelopeBodySenderPrefix(body, headerInside) {
	const match = body.match(ENVELOPE_BODY_SENDER_PREFIX_RE);
	if (!match) return body;
	const label = expectDefined(match[1], "envelope body sender capture");
	if (label === ENVELOPE_BODY_SELF_PREFIX || label === ENVELOPE_BODY_DIRECT_PREFIX) return body.slice(match[0].length);
	if (SENDER_PREFIXED_ENVELOPE_CHANNEL_RE.test(headerInside) && NON_DIRECT_ENVELOPE_HEADER_RE.test(headerInside) && !USER_AUTHORED_BODY_LABEL_RE.test(label)) return body.slice(match[0].length);
	if (headerInside.includes(label)) return body.slice(match[0].length);
	return body;
}
function stripLeadingMessageToolDeliveryHints(text) {
	const lines = text.split("\n");
	let index = 0;
	let stripped = false;
	while (index < lines.length) {
		const trimmed = lines[index]?.trim();
		if (!trimmed) {
			index += 1;
			continue;
		}
		if (!MESSAGE_TOOL_DELIVERY_HINTS.some((hint) => hint === trimmed)) break;
		stripped = true;
		index += 1;
	}
	return stripped ? lines.slice(index).join("\n") : text;
}
function findFirstInboundEnvelopeIndex(text, options) {
	for (const match of text.matchAll(BRACKETED_PREFIX_RE)) {
		const index = match.index;
		if (options?.skipReplyQuoteLine) {
			const lineStart = text.lastIndexOf("\n", index - 1) + 1;
			if (text.slice(lineStart, index).includes("[Replying to:")) continue;
		}
		const candidate = text.slice(index);
		if (INBOUND_ENVELOPE_PREFIX_RE.test(candidate) || matchKnownChannelMarkerFreeEnvelopePrefix(candidate, { allowAmbiguousDirect: options?.allowAmbiguousMarkerFree })) return index;
	}
	return -1;
}
function stripPendingHistoryContextBeforeCurrentMessage(text) {
	const candidateText = text.trimStart();
	if (!HISTORY_CONTEXT_MARKERS.some((marker) => candidateText.startsWith(marker))) return text;
	return stripToCurrentMessageMarker(candidateText) ?? text;
}
function stripToCurrentMessageMarker(text) {
	const currentMarker = findLastContextMarker(text, CURRENT_MESSAGE_MARKERS);
	if (!currentMarker) return null;
	return text.slice(currentMarker.index + currentMarker.marker.length);
}
function findLastContextMarker(text, markers) {
	let result = null;
	for (const marker of markers) {
		const index = text.lastIndexOf(marker);
		if (index !== -1 && (!result || index > result.index)) result = {
			index,
			marker
		};
	}
	return result;
}
function stripLeadingCurrentMessageContextBeforeEnvelope(text) {
	const candidateText = text.trimStart();
	if (!LEADING_CURRENT_MESSAGE_CONTEXT_RE.test(candidateText)) return text;
	const envelopeIndex = findFirstInboundEnvelopeIndex(candidateText, {
		allowAmbiguousMarkerFree: true,
		skipReplyQuoteLine: true
	});
	if (envelopeIndex === -1) {
		let plainBody = candidateText.replace(LEADING_CURRENT_MESSAGE_CONTEXT_RE, "").trimStart();
		for (let pass = 0; pass < 4; pass += 1) {
			const replyLineMatch = plainBody.match(LEADING_CURRENT_MESSAGE_REPLY_LINE_RE);
			if (!replyLineMatch) break;
			plainBody = plainBody.slice(replyLineMatch[0].length).trimStart();
		}
		const currentMessagePrefixMatch = plainBody.match(LEADING_CURRENT_MESSAGE_ID_SENDER_RE);
		return currentMessagePrefixMatch ? plainBody.slice(currentMessagePrefixMatch[0].length) : text;
	}
	return candidateText.slice(envelopeIndex);
}
function stripLeadingPlainTextMetadataBody(text) {
	const candidateText = text.trimStart();
	const markerBody = stripToCurrentMessageMarker(candidateText);
	if (markerBody !== null) return markerBody;
	const currentMessageBody = stripLeadingCurrentMessageContextBeforeEnvelope(candidateText);
	return currentMessageBody === candidateText ? "" : currentMessageBody;
}
function stripLeadingInboundEnvelope(text, options) {
	const strippedCandidate = stripLeadingCurrentMessageContextBeforeEnvelope(stripPendingHistoryContextBeforeCurrentMessage(stripLeadingMessageToolDeliveryHints(text)));
	const candidateText = strippedCandidate.trimStart();
	const allowAmbiguousMarkerFree = options?.allowAmbiguousMarkerFree || strippedCandidate !== text;
	const envelopePrefixMatch = candidateText.match(INBOUND_ENVELOPE_PREFIX_RE) ?? matchKnownChannelMarkerFreeEnvelopePrefix(candidateText, { allowAmbiguousDirect: allowAmbiguousMarkerFree });
	if (!envelopePrefixMatch) return strippedCandidate === text ? text : candidateText;
	const headerInside = envelopePrefixMatch[1] ?? "";
	return stripEnvelopeBodySenderPrefix(candidateText.slice(envelopePrefixMatch[0].length), headerInside);
}
function stripLeadingChronologicalContextBlocks(text) {
	let cleaned = text;
	let remainingPasses = 16;
	while (remainingPasses > 0) {
		remainingPasses -= 1;
		const match = cleaned.match(LEADING_CHRONOLOGICAL_MARKER_HEADER_RE);
		if (!match) return cleaned;
		const afterLabel = cleaned.slice(match[0].length);
		const bodyStart = afterLabel.search(/\S/);
		if (bodyStart === -1) return "";
		const bodyLineEnd = afterLabel.indexOf("\n", bodyStart);
		const firstBodyLine = bodyLineEnd === -1 ? afterLabel.slice(bodyStart) : afterLabel.slice(bodyStart, bodyLineEnd);
		let lineEnvelopeIndex = firstBodyLine.trimStart().startsWith("[") ? findFirstInboundEnvelopeIndex(firstBodyLine, {
			allowAmbiguousMarkerFree: true,
			skipReplyQuoteLine: true
		}) : -1;
		if (lineEnvelopeIndex === -1 && match[0].includes("selected for current message")) {
			const inlineEnvelopeIndex = findFirstInboundEnvelopeIndex(firstBodyLine, {
				allowAmbiguousMarkerFree: true,
				skipReplyQuoteLine: true
			});
			const prefix = inlineEnvelopeIndex === -1 ? "" : firstBodyLine.slice(0, inlineEnvelopeIndex);
			lineEnvelopeIndex = /^#\d+\s/.test(prefix.trimStart()) ? inlineEnvelopeIndex : -1;
		}
		const envelopeIndex = lineEnvelopeIndex === -1 ? -1 : bodyStart + lineEnvelopeIndex;
		if (envelopeIndex === -1) {
			const separatorMatch = /\n[ \t]*\n/.exec(afterLabel);
			cleaned = separatorMatch ? afterLabel.slice(separatorMatch.index + separatorMatch[0].length) : "";
		} else cleaned = afterLabel.slice(envelopeIndex);
		if (!cleaned) return "";
	}
	return cleaned;
}
/** Remove injected transport context before capture; empty means no user text survived. */
function sanitizeForMemoryCapture(text) {
	if (!text) return "";
	const MAX_SANITIZE_CHARS = 1e4;
	let cleaned = text.length > MAX_SANITIZE_CHARS ? truncateUtf16Safe(text, MAX_SANITIZE_CHARS) : text;
	let strippedInjectedContext = false;
	cleaned = cleaned.replace(LEADING_TIMESTAMP_PREFIX_RE, "");
	cleaned = dropMediaNoteLines(cleaned);
	const afterDeliveryHints = stripLeadingMessageToolDeliveryHints(cleaned);
	strippedInjectedContext ||= afterDeliveryHints !== cleaned;
	cleaned = afterDeliveryHints;
	const afterJsonMetaBlocks = cleaned.replace(MARKER_JSON_BLOCK_RE, "");
	strippedInjectedContext ||= afterJsonMetaBlocks !== cleaned;
	cleaned = afterJsonMetaBlocks;
	const afterChronologicalContext = stripLeadingChronologicalContextBlocks(cleaned);
	strippedInjectedContext ||= afterChronologicalContext !== cleaned;
	cleaned = afterChronologicalContext;
	for (let pass = 0; pass < 16; pass += 1) {
		const headerMatch = cleaned.match(MARKER_HEADER_LINE_RE);
		if (headerMatch?.index === void 0) break;
		const before = cleaned.slice(0, headerMatch.index);
		if (before.trim().length > 0) {
			cleaned = before;
			break;
		}
		const lineEnd = cleaned.indexOf("\n");
		const afterHeader = lineEnd === -1 ? "" : cleaned.slice(lineEnd + 1);
		const afterPlainTextMetadata = afterHeader.trimStart().startsWith("```json") ? afterHeader : stripLeadingPlainTextMetadataBody(afterHeader);
		strippedInjectedContext ||= afterPlainTextMetadata !== cleaned;
		cleaned = afterPlainTextMetadata;
	}
	const afterActiveMemoryContext = cleaned.replace(/^Context:[ \t]*\n<active_memory_plugin>[\s\S]*?<\/active_memory_plugin>\s*/gm, "");
	strippedInjectedContext ||= afterActiveMemoryContext !== cleaned;
	cleaned = afterActiveMemoryContext;
	const untrustedLineMatch = CONTEXT_HEADER_RE.exec(cleaned);
	if (untrustedLineMatch) {
		strippedInjectedContext = true;
		cleaned = cleaned.slice(0, untrustedLineMatch.index);
	}
	cleaned = stripLeadingInboundEnvelope(cleaned, { allowAmbiguousMarkerFree: strippedInjectedContext });
	cleaned = cleaned.replace(/<active_memory_plugin>[\s\S]*?<\/active_memory_plugin>/g, "");
	cleaned = cleaned.replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
	return cleaned;
}
//#endregion
export { dropMediaNoteLines, looksLikeEnvelopeSludge, sanitizeForMemoryCapture };
