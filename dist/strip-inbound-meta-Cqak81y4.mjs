import "./src-CZ2wJvNB.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "./message-tool-delivery-hints-8OSBEg_c.mjs";
//#region src/auto-reply/reply/inbound-context-marker.ts
/**
* Provenance marker appended to every OpenClaw-injected inbound context header
* (see `buildInboundUserContextPrefix`). Strippers key on this marker rather
* than on label text so detection is label-agnostic and never collides with
* user-typed headings. Fixed (not per-turn random): strippers run on stored
* text with no out-of-band value, and forging it only strips the forger's own
* text — no trust boundary depends on it.
*
* Duplicated (never imported) in:
*   - extensions/memory-lancedb/memory-capture-sanitization.ts (extension boundary
*     forbids core imports)
*   - apps/shared/OpenClawKit/Sources/OpenClawChatUI/ChatMarkdownPreprocessor.swift, which spells the
*     same two code points as `\u{27E6}`/`\u{27E7}` escapes
* Keep every copy equal to this value; a drifted copy silently stops stripping.
*/
const INBOUND_CONTEXT_MARKER = "⟦openclaw:ctx⟧";
/** Appends the provenance marker to a context header label. */
function markInboundContextLabel(label) {
	return `${label} ${INBOUND_CONTEXT_MARKER}`;
}
//#endregion
//#region src/auto-reply/reply/strip-inbound-meta.ts
const LEADING_TIMESTAMP_PREFIX_RE = /^\[[A-Za-z]{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}[^\]]*\] */;
const CHANNEL_CONTEXT_HEADER = `Context: ${INBOUND_CONTEXT_MARKER}`;
const ACTIVE_MEMORY_CONTEXT_HEADER = "Context:";
const ACTIVE_MEMORY_OPEN_TAG = "<active_memory_plugin>";
const ACTIVE_MEMORY_CLOSE_TAG = "</active_memory_plugin>";
const INBOUND_METADATA_MARKERS = [
	"[",
	INBOUND_CONTEXT_MARKER,
	...MESSAGE_TOOL_DELIVERY_HINTS,
	ACTIVE_MEMORY_CONTEXT_HEADER
];
const METADATA_TOKENS_RE = new RegExp([INBOUND_CONTEXT_MARKER, ...MESSAGE_TOOL_DELIVERY_HINTS].map(escapeRegExp).join("|"), "g");
function readTextLine(text, start) {
	if (start > text.length) return;
	const newline = text.indexOf("\n", start);
	const end = newline < 0 ? text.length : newline;
	return {
		start,
		end,
		next: end + 1,
		trimmed: text.slice(start, end).trim()
	};
}
function findTextLine(text, value, from = 0) {
	let index = text.indexOf(value, from);
	while (index >= 0) {
		const line = readTextLine(text, text.lastIndexOf("\n", index - 1) + 1);
		if (line.trimmed === value) return line;
		index = text.indexOf(value, line.next);
	}
}
function skipEmptyLines(text, start, trimmed = true) {
	let next = start;
	let line = readTextLine(text, next);
	while (line && (trimmed ? line.trimmed === "" : line.start === line.end)) {
		next = line.next;
		line = readTextLine(text, next);
	}
	return next;
}
function isInboundContextHeaderLine(line) {
	return line.length > 14 && line.endsWith("⟦openclaw:ctx⟧");
}
function isMessageToolDeliveryHintLine(line) {
	return MESSAGE_TOOL_DELIVERY_HINTS.some((hint) => hint === line);
}
/** Fast check for whether text contains any inbound metadata sentinel. */
function hasInboundMetadataSentinel(text) {
	return text.includes("⟦openclaw:ctx⟧") || MESSAGE_TOOL_DELIVERY_HINTS.some((hint) => text.includes(hint)) || text.includes(ACTIVE_MEMORY_CONTEXT_HEADER) && /^[ \t]*Context:[ \t]*$/m.test(text);
}
function metadataBlockEnd(text, header) {
	let line = readTextLine(text, header.next);
	if (line?.trimmed === "```json") return findTextLine(text, "```", line.next)?.next ?? text.length + 1;
	while (line && line.trimmed !== "") line = readTextLine(text, line.next);
	return skipEmptyLines(text, line?.start ?? text.length + 1);
}
function removeLineSpans(text, spans) {
	if (spans.length === 0) return text;
	const parts = [];
	let cursor = 0;
	for (const span of spans) {
		const start = span.next > text.length && span.start > 0 ? span.start - 1 : span.start;
		parts.push(text.slice(cursor, Math.max(cursor, start)));
		cursor = span.next;
	}
	parts.push(text.slice(cursor));
	return parts.join("");
}
function stripActiveMemoryPromptPrefixBlocks(text) {
	if (!text.includes(ACTIVE_MEMORY_OPEN_TAG)) return text;
	const spans = [];
	let header = findTextLine(text, ACTIVE_MEMORY_CONTEXT_HEADER);
	while (header) {
		const open = readTextLine(text, header.next);
		const close = open?.trimmed === ACTIVE_MEMORY_OPEN_TAG ? findTextLine(text, ACTIVE_MEMORY_CLOSE_TAG, open.next) : void 0;
		const next = close ? skipEmptyLines(text, close.next) : header.next;
		if (close) spans.push({
			start: header.start,
			next
		});
		header = findTextLine(text, ACTIVE_MEMORY_CONTEXT_HEADER, next);
	}
	return removeLineSpans(text, spans);
}
function stripTrailingContextBlockSuffix(text) {
	const header = findTextLine(text, CHANNEL_CONTEXT_HEADER);
	if (!header) return text;
	let end = header.start;
	while (end > 0) {
		const previous = end === 1 ? 0 : text.lastIndexOf("\n", end - 2) + 1;
		if (text.slice(previous, end - 1).trim() !== "") break;
		end = previous;
	}
	return text.slice(0, Math.max(0, end - 1));
}
/** Strips all injected inbound metadata blocks from user-visible text. */
function stripInboundMetadata(text) {
	const withoutTimestamp = text.replace(LEADING_TIMESTAMP_PREFIX_RE, "");
	if (!hasInboundMetadataSentinel(withoutTimestamp)) return withoutTimestamp;
	const source = stripActiveMemoryPromptPrefixBlocks(withoutTimestamp);
	const spans = [];
	const tokens = new RegExp(METADATA_TOKENS_RE);
	let match;
	while (match = tokens.exec(source)) {
		const start = source.lastIndexOf("\n", match.index - 1) + 1;
		const line = readTextLine(source, start);
		tokens.lastIndex = line.next;
		if (line.trimmed === CHANNEL_CONTEXT_HEADER) {
			spans.push({
				start,
				next: source.length + 1
			});
			break;
		}
		if (isInboundContextHeaderLine(line.trimmed)) {
			tokens.lastIndex = metadataBlockEnd(source, line);
			spans.push({
				start,
				next: tokens.lastIndex
			});
		} else if (isMessageToolDeliveryHintLine(line.trimmed)) spans.push({
			start,
			next: line.next
		});
	}
	return removeLineSpans(source, spans).replace(/^\n+/, "").replace(/\n+$/, "").replace(LEADING_TIMESTAMP_PREFIX_RE, "");
}
/** Strips only leading inbound metadata blocks while preserving later user text. */
function stripLeadingInboundMetadata(text) {
	if (!hasInboundMetadataSentinel(text)) return text;
	const source = stripActiveMemoryPromptPrefixBlocks(text);
	let start = skipEmptyLines(source, 0, false);
	let line = readTextLine(source, start);
	const strippedDeliveryHint = Boolean(line && isMessageToolDeliveryHintLine(line.trimmed));
	while (line && isMessageToolDeliveryHintLine(line.trimmed)) {
		start = skipEmptyLines(source, line.next, false);
		line = readTextLine(source, start);
	}
	if (!line) return "";
	if (!isInboundContextHeaderLine(line.trimmed)) return stripTrailingContextBlockSuffix(strippedDeliveryHint ? source.slice(start) : source);
	while (line && isInboundContextHeaderLine(line.trimmed)) {
		start = skipEmptyLines(source, metadataBlockEnd(source, line));
		line = readTextLine(source, start);
	}
	return stripTrailingContextBlockSuffix(source.slice(start));
}
function parseInboundMetaBlock(text, label) {
	const header = findTextLine(text, `${label} ${INBOUND_CONTEXT_MARKER}`);
	const open = header && readTextLine(text, header.next);
	if (open?.trimmed !== "```json") return null;
	const close = findTextLine(text, "```", open.next);
	return close ? safeParseJsonRecord(text.slice(open.next, close.start).trim()) ?? null : null;
}
function firstNonEmptyString(...values) {
	for (const value of values) if (typeof value === "string" && value.trim()) return value.trim().replaceAll("`​``", "```");
	return null;
}
/** Extracts the sender label from injected inbound metadata when present. */
function extractInboundSenderLabel(text) {
	if (!text.includes("⟦openclaw:ctx⟧")) return null;
	const sender = parseInboundMetaBlock(text, "Sender:");
	const label = firstNonEmptyString(sender?.label, sender?.name, sender?.username, sender?.e164, sender?.id);
	if (label) return label;
	const conversationSender = parseInboundMetaBlock(text, "Conversation info:")?.sender;
	return conversationSender && typeof conversationSender === "object" && !Array.isArray(conversationSender) ? firstNonEmptyString(conversationSender.name, conversationSender.username, conversationSender.e164, conversationSender.id) : firstNonEmptyString(conversationSender);
}
//#endregion
export { stripLeadingInboundMetadata as a, stripInboundMetadata as i, extractInboundSenderLabel as n, INBOUND_CONTEXT_MARKER as o, hasInboundMetadataSentinel as r, markInboundContextLabel as s, INBOUND_METADATA_MARKERS as t };
