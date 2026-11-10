import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as hasInterSessionUserProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { o as isOpenClawDeliveryMirrorAssistantMessage } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { n as selectVisibleTranscriptEvents } from "./transcript-visible-events-Ct6pwJvk.mjs";
import { f as loadTranscriptReadSnapshotSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { n as readSessionTranscriptBoundedMessageTailPageFromProjection } from "./session-accessor.sqlite-active-events-read-AJh0lWpC.mjs";
import { t as withCurrentProjectionSnapshot } from "./session-accessor.sqlite-active-projection-BECHzdvs.mjs";
import { r as sanitizeModelSpecialTokens } from "./external-content-Bkm4w5qo.mjs";
import { t as classifySessionMessageOrigin } from "./session-provenance-2cpkCo2r.mjs";
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
//#region src/hooks/bundled/session-memory/capture.worker.ts
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
function captureRecentSessionMemoryEvents(projection, messageCount) {
	const captured = [];
	let capturedBytes = 0;
	let offset = 0;
	let totalMessages = Number.POSITIVE_INFINITY;
	while (offset < totalMessages && offset < SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES && capturedBytes < SESSION_MEMORY_CAPTURE_MAX_BYTES && countSessionMemoryMessages(selectVisibleTranscriptEvents(relinkCapturedActiveMessageEvents(captured))) < messageCount) {
		const page = readSessionTranscriptBoundedMessageTailPageFromProjection(projection, {
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
function captureAuthoritativeMemoryEvents(scope, resolvedScope) {
	const messages = selectCurrentMemoryWindow(loadTranscriptReadSnapshotSync(scope, {
		readOnly: true,
		resolvedScope
	}).events).filter((event) => isRecord(event) && event.type === "message").slice(-4096);
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
/** The retained history reader owns SQL; only the bounded excerpt leaves its snapshot. */
function readSessionMemoryCapture({ scope, resolvedScope, messageCount }) {
	let events;
	try {
		events = withCurrentProjectionSnapshot(scope, (projection) => captureRecentSessionMemoryEvents(projection, messageCount), {
			readOnly: true,
			resolvedScope
		});
	} catch {
		events = captureAuthoritativeMemoryEvents(scope, resolvedScope);
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
}
//#endregion
export { readSessionMemoryCapture };
