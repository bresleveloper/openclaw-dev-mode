import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as formatHookErrorForLog } from "./hooks-ADSXph0M.mjs";
import { t as resolveHookConfig } from "./policy-DntIYegk.mjs";
import { r as sanitizeModelSpecialTokens } from "./external-content-Bkm4w5qo.mjs";
import { a as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-CzjHCvH2.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { N as selectVisibleTranscriptEvents, l as loadTranscriptEventsSync } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as classifySessionMessageOrigin } from "./session-provenance-2cpkCo2r.mjs";
import "./config-DGzoNfBQ.mjs";
//#region src/hooks/bundled/session-memory/transcript.ts
const SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX = String.raw`(?:(?:\|DSML\|)|(?:\uFF5CDSML\uFF5C))?`;
const SESSION_MEMORY_TOOL_DIRECTIVE_KIND = String.raw`(?:tool_calls?|function_calls?|tool_use_error)`;
const SESSION_MEMORY_DROP_BLOCK_RE = new RegExp(String.raw`<${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}\b[^>]*>` + String.raw`[\s\S]*?(?:<\/${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}>|$)`, "gi");
const SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE = /<(system|assistant|user)\b[^>]*>[\s\S]*?<\/\1>/gi;
const SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE = /<\/?(?:system|assistant|user)\b[^>]*>/gi;
const SESSION_MEMORY_TRAILING_NO_REPLY_RE = /(?:^|\n)\s*NO_REPLY\s*$/i;
const SESSION_MEMORY_JSON_LINE_SEPARATOR_RE = /[\u0085\u2028\u2029]/gu;
function quoteSessionMemoryText(text) {
	return JSON.stringify(text).replace(SESSION_MEMORY_JSON_LINE_SEPARATOR_RE, (separator) => `\\u${separator.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function isNoReplyMarker(text) {
	const trimmed = text.trim();
	return /^NO_REPLY$/i.test(trimmed) || /^\{\s*"action"\s*:\s*"NO_REPLY"\s*\}$/i.test(trimmed);
}
function sanitizeSessionMemoryTranscriptText(text) {
	if (isNoReplyMarker(text)) return null;
	return sanitizeModelSpecialTokens(text).replace(SESSION_MEMORY_DROP_BLOCK_RE, "").replace(SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE, "").replace(SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE, "").replace(SESSION_MEMORY_TRAILING_NO_REPLY_RE, "").trim() || null;
}
function extractTextMessageContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const candidate = block;
		if (candidate.type === "text" && typeof candidate.text === "string") return candidate.text;
	}
}
function renderSessionMemoryRecords(events) {
	const allMessages = [];
	let lastAssistantText;
	let turnOrigin = "untrusted";
	for (const event of events) {
		if (!event || typeof event !== "object") continue;
		const record = event;
		if (record.type !== "message" || !record.message) continue;
		const role = record.message.role;
		if (role !== "user" && role !== "assistant" || !("content" in record.message)) continue;
		if (role === "user") turnOrigin = classifySessionMessageOrigin(record.message, turnOrigin);
		const originClass = classifySessionMessageOrigin(record.message, turnOrigin);
		if (role === "user" && hasInterSessionUserProvenance(record.message)) continue;
		const text = extractTextMessageContent(record.message.content);
		const sanitized = text ? sanitizeSessionMemoryTranscriptText(text) : null;
		if (!sanitized) continue;
		if (role === "user") lastAssistantText = void 0;
		if (sanitized.startsWith("/")) continue;
		if (isOpenClawDeliveryMirrorAssistantMessage(record.message) && sanitized === lastAssistantText) continue;
		allMessages.push({
			line: `${role}: ${quoteSessionMemoryText(sanitized)}`,
			originClass
		});
		if (role === "assistant") lastAssistantText = sanitized;
	}
	return allMessages;
}
/** Counts transcript events that remain after session-memory filtering and deduplication. */
function countSessionMemoryMessages(events) {
	return renderSessionMemoryRecords(events).length;
}
function getRecentSessionProjectionFromEvents(events, messageCount = 15) {
	const limit = Number.isFinite(messageCount) ? Math.max(0, Math.floor(messageCount)) : 0;
	if (limit === 0) return null;
	const records = renderSessionMemoryRecords(events).slice(-limit);
	if (records.length === 0) return null;
	return {
		content: records.map((record) => record.line).join("\n"),
		originClass: records.some((record) => record.originClass === "untrusted" || record.originClass === "system") ? "untrusted" : "agent"
	};
}
//#endregion
//#region src/hooks/bundled/session-memory/capture.ts
const SESSION_MEMORY_CAPTURE_MAX_BYTES = 8388608;
const SESSION_MEMORY_CAPTURE_PAGE_MESSAGES = 256;
const SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES = 4096;
function relinkCapturedActiveMessageEvents(events) {
	let parentId = null;
	return events.map((event, index) => {
		if (!isRecord(event) || event.type !== "message") return event;
		const id = typeof event.id === "string" ? event.id : `session-memory-${index + 1}`;
		const linked = {
			...event,
			id,
			parentId
		};
		parentId = id;
		return linked;
	});
}
function captureRecentSessionMemoryEvents(scope, messageCount) {
	const captured = [];
	let capturedBytes = 0;
	let offset = 0;
	let totalMessages = Number.POSITIVE_INFINITY;
	while (offset < totalMessages && offset < SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES && capturedBytes < SESSION_MEMORY_CAPTURE_MAX_BYTES && countSessionMemoryMessages(selectVisibleTranscriptEvents(relinkCapturedActiveMessageEvents(captured))) < messageCount) {
		const page = readSessionTranscriptBoundedMessageTailPage(scope, {
			maxBytes: SESSION_MEMORY_CAPTURE_MAX_BYTES - capturedBytes,
			maxMessages: Math.min(SESSION_MEMORY_CAPTURE_PAGE_MESSAGES, SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES - offset),
			offset
		});
		totalMessages = page.totalMessages;
		if (page.scannedMessages === 0) break;
		captured.unshift(...page.events.map(({ event }) => event));
		capturedBytes += page.serializedBytes;
		offset += page.scannedMessages;
	}
	return relinkCapturedActiveMessageEvents(captured);
}
function selectCurrentMemoryWindow(events) {
	const active = selectVisibleTranscriptEvents(events);
	const boundaryIndex = active.findLastIndex((event) => isRecord(event) && event.type === "reset");
	const boundary = active[boundaryIndex];
	if (!isRecord(boundary)) return active;
	const firstKeptIndex = typeof boundary.firstKeptEntryId === "string" ? active.findIndex((event) => isRecord(event) && event.id === boundary.firstKeptEntryId) : -1;
	return [...(firstKeptIndex >= 0 && firstKeptIndex < boundaryIndex ? active.slice(firstKeptIndex, boundaryIndex) : []).filter((event) => isRecord(event) && event.type === "message" && isRecord(event.message) && (event.message.role === "user" || event.message.role === "assistant")), ...active.slice(boundaryIndex + 1)];
}
function captureAuthoritativeMemoryEvents(scope) {
	const messages = selectCurrentMemoryWindow(loadTranscriptEventsSync(scope)).filter((event) => isRecord(event) && event.type === "message").slice(-4096);
	const captured = [];
	let bytes = 0;
	for (const event of messages.toReversed()) {
		const size = Buffer.byteLength(JSON.stringify(event)) + 1;
		if (bytes + size <= SESSION_MEMORY_CAPTURE_MAX_BYTES) {
			captured.unshift(event);
			bytes += size;
		}
	}
	return relinkCapturedActiveMessageEvents(captured);
}
/** Capture while the caller still owns the departing session's active window. */
function captureSessionMemoryTranscript(scope, cfg) {
	const hookConfig = resolveHookConfig(cfg, "session-memory");
	const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
	try {
		let events;
		try {
			events = captureRecentSessionMemoryEvents(scope, messageCount);
		} catch {
			events = captureAuthoritativeMemoryEvents(scope);
		}
		const projection = getRecentSessionProjectionFromEvents(events, messageCount);
		return projection ? {
			status: "available",
			...projection
		} : {
			status: "available",
			content: null,
			originClass: "agent"
		};
	} catch (error) {
		return {
			status: "unavailable",
			reason: formatHookErrorForLog(error)
		};
	}
}
//#endregion
export { captureSessionMemoryTranscript as t };
