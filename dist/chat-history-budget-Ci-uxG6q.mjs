import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as jsonUtf8BytesOrInfinity, r as jsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { a as readToolErrorFlag, i as isToolResultContentType, n as isToolCallContentType } from "./tool-content-SH_V-fgH.mjs";
import { a as readTranscriptDisplayPosition } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import { t as logLargePayload } from "./diagnostic-payload-cGmngu3I.mjs";
import { n as readChatHistoryMessageId } from "./session-history-tail-B4XoDl5j.mjs";
//#region src/gateway/server-methods/chat-history-budget.ts
const CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES = 131072;
const CHAT_HISTORY_OVERSIZED_PLACEHOLDER = "[chat.history omitted: message too large]";
const CHAT_HISTORY_UNAVAILABLE_SENTINEL = "[chat.history unavailable: transcript too large to display; the full history is preserved on disk]";
let chatHistoryOmittedEmitCount = 0;
function createChatHistoryActivityProjection(messages, activity = []) {
	const byId = new Map(activity.map((entry) => [entry.messageId, entry]));
	return new Map(messages.flatMap((message) => {
		const messageId = readChatHistoryMessageId(message);
		const entry = messageId ? byId.get(messageId) : void 0;
		const record = asOptionalRecord(message);
		const toolBearing = record && (isToolResultContentType(record.role) || record.role === "tool" || record.role === "function" || Array.isArray(record.content) && record.content.some((block) => {
			const type = asOptionalRecord(block)?.type;
			return isToolCallContentType(type) || isToolResultContentType(type);
		}));
		return entry && toolBearing ? [[message, entry]] : [];
	}));
}
function createChatHistoryByteCounter(activity) {
	const sizes = /* @__PURE__ */ new Map();
	const messageBytes = (message) => {
		const cached = sizes.get(message);
		if (cached !== void 0) return cached;
		const descriptor = activity?.get(message);
		const bytes = jsonUtf8Bytes(message) + (descriptor ? jsonUtf8Bytes(descriptor) + 1 : 0);
		sizes.set(message, bytes);
		return bytes;
	};
	return {
		messageBytes,
		framingBytes: (messages) => messages.some((message) => activity?.has(message)) ? 13 : 0,
		messagesBytes: (messages) => (messages.some((message) => activity?.has(message)) ? 15 : 2) + messages.reduce((bytes, message) => bytes + messageBytes(message), 0) + Math.max(0, messages.length - 1)
	};
}
function chatHistoryActivityBytes(activity) {
	return activity.length > 0 ? jsonUtf8Bytes({ activity }) - 1 : 0;
}
/** Delta envelopes share one prepared plain-data snapshot throughout their synchronous projection. */
function createChatHistoryDeltaByteCounter(sessionSnapshot) {
	let snapshot;
	return (envelope) => {
		snapshot ??= {
			bytes: jsonUtf8BytesOrInfinity(sessionSnapshot),
			keys: new Set(Object.keys(sessionSnapshot))
		};
		const fields = {};
		for (const key in envelope) if (!snapshot.keys.has(key) && Object.hasOwn(envelope, key)) fields[key] = envelope[key];
		const fieldsBytes = jsonUtf8BytesOrInfinity(fields);
		return snapshot.bytes + fieldsBytes - 2 + (snapshot.bytes > 2 && fieldsBytes > 2 ? 1 : 0);
	};
}
function buildChatHistoryUnavailableSentinel() {
	return {
		role: "assistant",
		timestamp: Date.now(),
		content: [{
			type: "text",
			text: CHAT_HISTORY_UNAVAILABLE_SENTINEL
		}]
	};
}
function buildOversizedHistoryPlaceholder(message) {
	const entry = asOptionalRecord(message) ?? {};
	const role = typeof entry.role === "string" ? entry.role : "assistant";
	const timestamp = typeof entry.timestamp === "number" ? entry.timestamp : Date.now();
	const metadata = asOptionalRecord(entry["__openclaw"]) ?? {};
	const toolIdentity = Object.fromEntries([
		"toolCallId",
		"tool_call_id",
		"toolUseId",
		"tool_use_id",
		"toolName",
		"tool_name",
		"name"
	].filter((key) => typeof entry[key] === "string").map((key) => [key, entry[key]]));
	const isError = readToolErrorFlag(entry);
	const metadataId = typeof metadata.id === "string" ? metadata.id : void 0;
	const metadataSeq = typeof metadata.seq === "number" ? metadata.seq : void 0;
	const metadataIdempotencyKey = typeof metadata.idempotencyKey === "string" ? metadata.idempotencyKey : void 0;
	const turnBoundary = metadata.turnBoundary === true;
	const transcriptPosition = readTranscriptDisplayPosition(metadata.transcriptPosition);
	return {
		role,
		timestamp,
		content: [{
			type: "text",
			text: CHAT_HISTORY_OVERSIZED_PLACEHOLDER
		}],
		...toolIdentity,
		...isError !== void 0 ? { isError } : {},
		__openclaw: {
			...metadata.toolOutput ? { toolOutput: metadata.toolOutput } : {},
			...metadataId ? { id: metadataId } : {},
			...typeof metadata.runId === "string" ? { runId: metadata.runId } : {},
			...metadataSeq !== void 0 ? { seq: metadataSeq } : {},
			...metadataIdempotencyKey ? { idempotencyKey: metadataIdempotencyKey } : {},
			...turnBoundary ? { turnBoundary: true } : {},
			...transcriptPosition ? { transcriptPosition } : {},
			truncated: true,
			reason: "oversized"
		}
	};
}
function replaceOversizedChatHistoryMessages(params) {
	const { messages, maxSingleMessageBytes } = params;
	const byteCounter = params.byteCounter ?? createChatHistoryByteCounter();
	let replacedCount = 0;
	const next = messages.map((message) => {
		if (byteCounter.messageBytes(message) <= maxSingleMessageBytes) return message;
		replacedCount += 1;
		const placeholder = buildOversizedHistoryPlaceholder(message);
		return byteCounter.messageBytes(placeholder) <= maxSingleMessageBytes ? placeholder : buildChatHistoryUnavailableSentinel();
	});
	return {
		messages: replacedCount > 0 ? next : messages,
		replacedCount
	};
}
function reportOmittedChatHistory(params) {
	const { omittedCount, normalizedBytes, maxHistoryBytes, logDebug } = params;
	if (omittedCount === 0) return 0;
	chatHistoryOmittedEmitCount += omittedCount;
	logLargePayload({
		surface: "gateway.chat.history",
		action: "truncated",
		bytes: normalizedBytes,
		limitBytes: maxHistoryBytes,
		count: omittedCount,
		reason: "chat_history_budget"
	});
	logDebug(`chat.history omitted oversized payloads count=${omittedCount} total=${chatHistoryOmittedEmitCount}`);
	return omittedCount;
}
function boundInFlightRunSnapshotForChatHistory(params) {
	if (!params.snapshot) return;
	const messagesBytes = params.getMessagesBytes?.() ?? jsonUtf8Bytes(params.messages);
	if (messagesBytes + jsonUtf8Bytes(params.snapshot) <= params.maxBytes) return params.snapshot;
	let bounded = {
		runId: params.snapshot.runId,
		text: "",
		...params.snapshot.sessionAbortable ? { sessionAbortable: true } : {},
		...params.snapshot.events ? { events: [] } : {},
		...params.snapshot.plan ? { plan: { steps: [] } } : {}
	};
	const retainIfWithinBudget = (candidate) => {
		if (!(messagesBytes + jsonUtf8Bytes(candidate) <= params.maxBytes)) return false;
		bounded = candidate;
		return true;
	};
	if (params.snapshot.startedAt !== void 0) retainIfWithinBudget({
		...bounded,
		startedAt: params.snapshot.startedAt
	});
	if (params.snapshot.events) {
		const events = params.snapshot.events;
		let start = 0;
		let end = events.length;
		let middle = 0;
		while (start < end) {
			if (retainIfWithinBudget({
				...bounded,
				events: events.slice(middle)
			})) end = middle;
			else start = middle + 1;
			middle = Math.floor((start + end) / 2);
		}
	}
	if (params.snapshot.plan) retainIfWithinBudget({
		...bounded,
		plan: params.snapshot.plan
	});
	if (params.snapshot.text) retainIfWithinBudget({
		...bounded,
		text: params.snapshot.text
	});
	return bounded;
}
//#endregion
export { createChatHistoryByteCounter as a, reportOmittedChatHistory as c, createChatHistoryActivityProjection as i, boundInFlightRunSnapshotForChatHistory as n, createChatHistoryDeltaByteCounter as o, chatHistoryActivityBytes as r, replaceOversizedChatHistoryMessages as s, CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES as t };
