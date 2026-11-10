import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { Et as _enum, Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { n as readLegacyCompactionMetrics } from "./legacy-compaction-history-DS8GebGO.mjs";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-BNfLH5hX.mjs";
import { a as readChatHistoryMessageId, o as readChatHistoryMessageSeq, s as readChatHistoryPaginationKey } from "./session-history-tail-C5LEM5f_.mjs";
import { a as createChatHistoryActivityProjection, c as replaceOversizedChatHistoryMessages, o as createChatHistoryByteCounter, r as buildOversizedHistoryPlaceholder, t as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES } from "./chat-history-budget-Dk8b7BOY.mjs";
//#region src/gateway/server-methods/chat-history-page-cursor.ts
const PREFIX = "history-page:";
const MAX_CURSOR_CHARS = 4096;
const cursorSchema = object({
	sessionId: string().min(1).max(1024),
	source: string().min(1).max(128),
	messageId: string().min(1).max(1024),
	direction: _enum(["older", "newer"])
});
function encodeChatHistoryPageCursor(cursor) {
	if (!cursorSchema.safeParse(cursor).success) return;
	const encoded = PREFIX + Buffer.from(JSON.stringify(cursor)).toString("base64url");
	return encoded.length <= MAX_CURSOR_CHARS ? encoded : void 0;
}
/** Undefined is a delta cursor; null is a malformed page cursor. Neither grants access. */
function decodeChatHistoryPageCursor(cursor) {
	if (!cursor?.startsWith(PREFIX)) return;
	if (cursor.length > MAX_CURSOR_CHARS) return null;
	try {
		const parsed = cursorSchema.safeParse(JSON.parse(Buffer.from(cursor.slice(13), "base64url").toString("utf8")));
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}
function resolveChatHistoryPageCursors(anchor, capped, original) {
	if (!anchor) return {};
	const oldest = readChatHistoryMessageId(capped[0]) ?? anchor.oldestMessageId;
	const newest = readChatHistoryMessageId(capped.at(-1)) ?? anchor.newestMessageId;
	const cursor = (messageId, direction) => encodeChatHistoryPageCursor({
		sessionId: anchor.sessionId,
		source: anchor.source,
		messageId,
		direction
	});
	return {
		...oldest && (anchor.hasOlder || capped.length > 0 && oldest !== readChatHistoryMessageId(original[0])) ? { olderCursor: cursor(oldest, "older") } : {},
		...newest && (anchor.hasNewer || capped.length > 0 && newest !== readChatHistoryMessageId(original.at(-1))) ? { newerCursor: cursor(newest, "newer") } : {}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-history-response-page.ts
function readPageMessageSequence(message, messageSequences) {
	if (typeof messageSequences === "function") return messageSequences(message);
	return messageSequences?.[readChatHistoryPaginationKey(message) ?? ""] ?? readChatHistoryMessageSeq(message);
}
function resolveChatHistoryNextOffset(params) {
	const sequence = (message) => readPageMessageSequence(message, params.messageSequences);
	let oldestSeq;
	for (const message of params.messages) {
		oldestSeq = sequence(message);
		if (oldestSeq !== void 0) break;
	}
	if (oldestSeq === void 0) return params.offset + params.rawPageMessages;
	const recordOffset = params.totalMessages - oldestSeq + 1;
	return Math.max(params.offset + 1, recordOffset);
}
/** Preserve token metrics saved by pre-removal builds; new markers own their metrics. */
function enrichChatHistoryCompactionMarkers(messages, entry, metrics = readLegacyCompactionMetrics(entry)) {
	if (metrics.length === 0) return messages;
	const checkpointByEntryId = new Map(metrics.map((metric) => [metric.entryId, metric]));
	let changed = false;
	const enriched = messages.map((message) => {
		const record = asOptionalRecord(message);
		const metadata = asOptionalRecord(record?.["__openclaw"]);
		if (metadata?.kind !== "compaction" || typeof metadata.id !== "string") return message;
		const checkpoint = checkpointByEntryId.get(metadata.id);
		if (!checkpoint) return message;
		const tokensBefore = checkpoint.tokensBefore;
		const tokensAfter = checkpoint.tokensAfter;
		if (tokensBefore === void 0 && tokensAfter === void 0) return message;
		changed = true;
		return {
			...record,
			__openclaw: {
				...metadata,
				...tokensBefore !== void 0 ? { tokensBefore } : {},
				...tokensAfter !== void 0 ? { tokensAfter } : {}
			}
		};
	});
	return changed ? enriched : messages;
}
function resolveChatHistoryMessageGroup(messages, index, messageCost, messageSequences) {
	const sequence = (message) => readPageMessageSequence(message, messageSequences);
	const seq = sequence(messages[index]);
	let start = index;
	let end = index + 1;
	let cost = messageCost(messages[index]);
	if (seq === void 0) return {
		start,
		end,
		cost
	};
	while (start > 0 && sequence(messages[start - 1]) === seq) {
		start -= 1;
		cost += messageCost(messages[start]);
	}
	while (end < messages.length && sequence(messages[end]) === seq) {
		cost += messageCost(messages[end]);
		end += 1;
	}
	return {
		start,
		end,
		cost
	};
}
function capChatHistoryTail(params) {
	let start = params.messages.length;
	let cost = 0;
	while (start > 0) {
		const group = resolveChatHistoryMessageGroup(params.messages, start - 1, params.messageCost, params.messageSequences);
		if (cost + group.cost > params.maxCost) break;
		start = group.start;
		cost += group.cost;
	}
	return start > 0 ? params.messages.slice(start) : params.messages;
}
function capChatHistoryAroundMessage(params) {
	const anchorIndex = params.messages.findIndex((message) => readChatHistoryMessageId(message) === params.messageId);
	if (anchorIndex === -1) return [];
	const groupAt = (index) => resolveChatHistoryMessageGroup(params.messages, index, params.messageCost, params.messageSequences);
	const anchorGroup = groupAt(anchorIndex);
	if (!(anchorGroup.cost <= params.maxCost)) return [params.messages[anchorIndex]];
	let { start, end, cost } = anchorGroup;
	const grow = (index) => {
		const group = groupAt(index);
		if (!(cost + group.cost <= params.maxCost)) return false;
		start = Math.min(start, group.start);
		end = Math.max(end, group.end);
		cost += group.cost;
		return true;
	};
	let canGrowOlder = start > 0;
	let canGrowNewer = end < params.messages.length;
	while (canGrowOlder || canGrowNewer) {
		canGrowOlder &&= grow(start - 1) && start > 0;
		canGrowNewer &&= grow(end) && end < params.messages.length;
	}
	return params.messages.slice(start, end);
}
function prepareChatHistoryResponsePage(historyPage, { entry: historyEntry, compactionMetrics, maxHistoryBytes, responseHistoryBytes = maxHistoryBytes, messageId }, messageSequences = historyPage.pagination?.messageSequences ?? historyPage.anchor?.messageSequences) {
	const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry, compactionMetrics);
	const activity = createChatHistoryActivityProjection(normalized, historyPage.activity);
	const byteCounter = createChatHistoryByteCounter(activity);
	const maxCost = responseHistoryBytes - (1 + byteCounter.framingBytes(normalized));
	const messageCost = (message) => byteCounter.messageBytes(message) + 1;
	const groups = [];
	for (let index = 0; index < normalized.length;) {
		const group = resolveChatHistoryMessageGroup(normalized, index, messageCost, messageSequences);
		groups.push(...group.cost > maxCost ? [buildOversizedHistoryPlaceholder(normalized.slice(group.start, group.end).find((message) => readChatHistoryMessageId(message) === messageId) ?? normalized[group.end - 1])] : normalized.slice(group.start, group.end));
		index = group.end;
	}
	const replaced = replaceOversizedChatHistoryMessages({
		byteCounter,
		messages: groups,
		maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxCost - 1)
	});
	const capParams = {
		messages: replaced.messages,
		maxCost,
		messageCost,
		messageSequences
	};
	const capped = messageId ? capChatHistoryAroundMessage({
		...capParams,
		messageId: historyPage.anchor?.direction ? readChatHistoryMessageId(historyPage.anchor.direction === "newer" ? replaced.messages[0] : replaced.messages.at(-1)) ?? messageId : messageId
	}) : capChatHistoryTail(capParams);
	const pagination = historyPage.pagination;
	const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
		messages: capped,
		totalMessages: pagination.totalMessages,
		offset: pagination.offset,
		rawPageMessages: pagination.rawPageMessages,
		messageSequences: pagination.messageSequences
	});
	const hasMore = pagination !== void 0 && candidateNextOffset !== void 0 ? candidateNextOffset < pagination.totalMessages : void 0;
	const survivors = new Set(capped);
	const omittedCount = normalized.reduce((count, message) => count + (survivors.has(message) ? 0 : 1), 0);
	return {
		messages: composeTranscriptDisplay(capped),
		...capped.some((message) => activity.has(message)) ? { activity: capped.flatMap((message) => activity.get(message) ?? []) } : {},
		messagesBytes: byteCounter.messagesBytes(capped),
		...omittedCount > 0 ? { omission: {
			omittedCount,
			normalizedBytes: byteCounter.messagesBytes(normalized),
			...capped.length < replaced.messages.length ? { byteLimited: true } : {}
		} } : {},
		responseHistoryBytes,
		...resolveChatHistoryPageCursors(historyPage.anchor, capped, normalized),
		...hasMore ? { nextOffset: candidateNextOffset } : {},
		...hasMore !== void 0 ? { hasMore } : {},
		...pagination !== void 0 ? { totalMessages: pagination.totalMessages } : {}
	};
}
function encodeChatHistoryResponsePage(page, params) {
	if (!params.encodeResponse) return page;
	const response = prepareChatHistoryResponsePage(page, params);
	return {
		...page,
		messages: [],
		activity: void 0,
		pagination: void 0,
		anchor: void 0,
		encodedResponse: {
			...response,
			messages: new TextEncoder().encode(JSON.stringify(response.messages))
		}
	};
}
//#endregion
export { decodeChatHistoryPageCursor as i, enrichChatHistoryCompactionMarkers as n, prepareChatHistoryResponsePage as r, encodeChatHistoryResponsePage as t };
