import { d as asPositiveSafeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveTranscriptPageEnd } from "./transcript-anchor-page-CKxnXLW4.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { c as projectChatDisplayMessagesWithState, r as isChatHistoryRecoveryUserBoundary, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { o as isHeartbeatHistoryTurnBoundaryMessage, r as dropPreSessionStartAnnouncePairs, t as createPreSessionStartAnnouncePairFilter } from "./chat-display-projection.history-DKYX-kD-.mjs";
//#region src/gateway/session-history-tail.ts
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES = 8e3;
const SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES = 100;
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_CHUNK_MESSAGES = 400;
const HISTORY_PAGE_MAX_BYTES = 1048576;
function resolveCursorSeq(cursor) {
	if (!cursor) return;
	const normalized = cursor.startsWith("seq:") ? cursor.slice(4) : cursor;
	if (!/^\d+$/.test(normalized)) return;
	const value = Number(normalized);
	return Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function buildPaginatedSessionHistory(params) {
	return {
		items: params.messages,
		messages: params.messages,
		hasMore: params.hasMore,
		...params.nextCursor ? { nextCursor: params.nextCursor } : {}
	};
}
function paginateSessionMessages(messages, limit, cursor) {
	const cursorSeq = resolveCursorSeq(cursor);
	let endExclusive = messages.length;
	if (typeof cursorSeq === "number") {
		endExclusive = messages.findIndex((message, index) => {
			const seq = readChatHistoryMessageSeq(message);
			if (typeof seq === "number") return seq >= cursorSeq;
			return index + 1 >= cursorSeq;
		});
		if (endExclusive < 0) endExclusive = messages.length;
	}
	let start = typeof limit === "number" && limit > 0 ? Math.max(0, endExclusive - limit) : 0;
	if (start > 0) {
		const pageSeqs = /* @__PURE__ */ new Set();
		let indexedStart = endExclusive;
		for (let index = start - 1; index >= 0; index--) {
			while (indexedStart > start) {
				const pageSeq = readChatHistoryMessageSeq(messages[--indexedStart]);
				if (pageSeq !== void 0) pageSeqs.add(pageSeq);
			}
			const seq = readChatHistoryMessageSeq(messages[index]);
			if (seq !== void 0 && pageSeqs.has(seq)) start = index;
		}
	}
	const paginatedMessages = messages.slice(start, endExclusive);
	const firstSeq = readChatHistoryMessageSeq(paginatedMessages[0]);
	return buildPaginatedSessionHistory({
		messages: paginatedMessages,
		hasMore: start > 0,
		...start > 0 && typeof firstSeq === "number" ? { nextCursor: String(firstSeq) } : {}
	});
}
function readChatHistoryMessageId(message) {
	const id = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id;
	return typeof id === "string" && id ? id : void 0;
}
function readChatHistoryMessageSeq(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return asPositiveSafeInteger(metadata?.seq);
}
function readChatHistoryPaginationKey(message) {
	const id = readChatHistoryMessageId(message);
	if (id) return `id:${id}`;
	const seq = readChatHistoryMessageSeq(message);
	return seq === void 0 ? void 0 : `seq:${seq}`;
}
function capOffsetChatHistoryProjectedMessages(messages, max, sequence = readChatHistoryMessageSeq) {
	if (messages.length <= max) return messages;
	const start = Math.max(0, messages.length - max);
	const boundarySeq = sequence(messages[start]);
	if (boundarySeq === void 0) return messages.slice(start);
	let safeStart = start;
	while (safeStart > 0 && sequence(messages[safeStart - 1]) === boundarySeq) safeStart--;
	return messages.slice(safeStart);
}
function dropChatHistoryOverreadContextMessage(messages, contextMessage) {
	if (contextMessage === void 0) return messages;
	const index = messages.indexOf(contextMessage);
	return index < 0 ? messages : [...messages.slice(0, index), ...messages.slice(index + 1)];
}
/** Keep each worker reply bounded even when the anchor and its neighbor cannot fit together. */
async function readChatHistoryAnchorPage(readers, scope, options) {
	const page = await readers.readSessionMessagesAroundIdWithStatsAsync(scope, {
		...options,
		captureReadWindow: Boolean(options.direction)
	});
	if (!options.direction || !page.found || page.windowReset || page.messages.length !== 1 || readChatHistoryMessageId(page.messages[0]) !== options.messageId || (options.direction === "older" ? readChatHistoryMessageSeq(page.messages[0]) === 1 : page.offset === 0)) return page;
	const next = await readers.readSessionMessagesAroundIdWithStatsAsync(scope, {
		...options,
		excludeAnchor: true,
		expectedReadWindow: page.readWindow
	});
	if (!next.found || next.windowReset || next.displaySource !== page.displaySource) return {
		...next,
		messages: [],
		windowReset: true
	};
	return {
		...next,
		messages: options.direction === "older" ? [...next.messages, ...page.messages] : [...page.messages, ...next.messages]
	};
}
async function readNewerChatHistoryMessages(params) {
	const page = await readChatHistoryAnchorPage(params.readers, params.readScope, {
		messageId: params.anchorId,
		maxMessages: params.limit + 1,
		direction: "newer",
		expectedReadWindow: params.expectedReadWindow,
		allowResetArchiveFallback: true,
		readOnly: params.readOnly
	});
	if (page.windowReset || !page.found || page.displaySource !== params.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId, "window-changed");
	const anchorIndex = page.messages.findIndex((message) => readChatHistoryMessageId(message) === params.anchorId);
	if (anchorIndex < 0) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId, "window-changed");
	return page.messages.slice(anchorIndex + 1, anchorIndex + 1 + params.limit);
}
/** Resolve only the newer turn context a historical page needs to classify its pending error. */
async function readChatHistoryRecoveryContext(params) {
	const context = [];
	const filterAnnounces = createPreSessionStartAnnouncePairFilter(params.sessionStartedAt);
	let recovery;
	let anchorId = readChatHistoryMessageId(params.messages.at(-1));
	let scannedBytes = 0;
	let scannedMessages = 0;
	while (anchorId && scannedMessages < SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES) {
		const chunkSize = Math.min(SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES, SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES - scannedMessages);
		const newer = await readNewerChatHistoryMessages({
			anchorId,
			limit: chunkSize,
			readScope: params.readScope,
			readers: params.readers,
			displaySource: params.displaySource,
			expectedReadWindow: params.expectedReadWindow,
			readOnly: params.readOnly
		});
		if (newer.length === 0) break;
		const previousContextLength = context.length;
		let boundaryReached = false;
		for (const message of newer) {
			scannedMessages++;
			scannedBytes += Buffer.byteLength(JSON.stringify(message), "utf8");
			if (scannedBytes > params.maxBytes) return context;
			anchorId = readChatHistoryMessageId(message);
			if (filterAnnounces([message]).length === 0) continue;
			context.push(message);
			if (isChatHistoryRecoveryUserBoundary(message)) {
				boundaryReached = true;
				break;
			}
		}
		if (boundaryReached) break;
		recovery ??= params.createRecovery(params.messages);
		recovery.append(context.slice(previousContextLength));
		if (!recovery.pending) break;
	}
	return context;
}
/** Scans indexed transcript records until one bounded visible history page is filled. */
async function readIncrementalChatHistoryTailAttempt(params) {
	const { resolveCurrentUserProfileDisplay } = params;
	const readSequence = params.readMessageSequence ?? readChatHistoryMessageSeq;
	let offset = params.offset ?? 0;
	const requestedBeforeSeq = params.beforeSeq;
	const rawHistoryWindowMessages = Math.max(1, Math.floor(params.max)) * 20 + 20;
	let initialMessages = requestedBeforeSeq !== void 0 ? Math.min(rawHistoryWindowMessages, Math.max(1, params.max)) : params.preserveProjectionContext && offset === 0 ? rawHistoryWindowMessages : Math.min(rawHistoryWindowMessages, Math.max(1, offset === 0 ? params.max * 3 : params.max));
	const readPage = offset === 0 && requestedBeforeSeq === void 0 ? await params.readers.readRecentSessionMessagesWithStatsAsync(params.readScope, {
		maxMessages: initialMessages + 1,
		maxLines: initialMessages + 1,
		maxBytes: HISTORY_PAGE_MAX_BYTES,
		allowResetArchiveFallback: true,
		captureReadWindow: true,
		readOnly: params.readOnly
	}) : await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
		offset,
		...requestedBeforeSeq === void 0 ? {} : { beforeSeq: requestedBeforeSeq },
		maxMessages: initialMessages + 1,
		maxBytes: HISTORY_PAGE_MAX_BYTES,
		allowOversizedFirst: true,
		...requestedBeforeSeq !== void 0 && params.preserveProjectionContext ? { recentAtHead: {
			maxMessages: rawHistoryWindowMessages + 1,
			maxLines: rawHistoryWindowMessages + 1,
			maxBytes: HISTORY_PAGE_MAX_BYTES
		} } : {},
		allowResetArchiveFallback: true,
		captureReadWindow: true,
		readOnly: params.readOnly
	});
	const readWindow = readPage.readWindow;
	const availableMessages = resolveTranscriptPageEnd(readPage.totalMessages, {
		beforeSeq: requestedBeforeSeq,
		offset
	});
	const beforeSeq = availableMessages + 1;
	if (requestedBeforeSeq !== void 0) {
		offset = readPage.totalMessages - availableMessages;
		if (offset === 0 && params.preserveProjectionContext) initialMessages = rawHistoryWindowMessages;
	}
	const sessionStartedAt = typeof params.entry?.sessionStartedAt === "number" ? params.entry.sessionStartedAt : void 0;
	let rawPageMessages = Math.min(initialMessages, Math.max(readPage.messages.length, availableMessages > 0 ? 1 : 0));
	let overreadContextMessage = readPage.messages.length > initialMessages ? readPage.messages[0] : void 0;
	let rawMessages = dropChatHistoryOverreadContextMessage(readPage.messages, overreadContextMessage);
	let recoveryContext = offset === 0 ? [] : void 0;
	const newestPageSeq = readSequence(rawMessages.at(-1));
	const filterWindowMessages = (messages, contextMessage) => sessionStartedAt === void 0 ? messages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(contextMessage === void 0 ? messages : [contextMessage, ...messages], sessionStartedAt), contextMessage);
	const project = (messages = rawMessages, contextMessage = overreadContextMessage, resolveProfileDisplay = true, newerContext = recoveryContext ?? []) => {
		const filteredRawMessages = filterWindowMessages(messages, contextMessage);
		const projection = projectChatDisplayMessagesWithState(newerContext.length > 0 ? [...filteredRawMessages, ...newerContext] : filteredRawMessages, {
			subagentCoordination: params.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.effectiveMaxChars,
			toolResultMaxChars: params.toolResultMaxChars,
			resolveCronJobName: params.resolveCronJobName,
			...resolveProfileDisplay && !params.deferProfileDisplay ? { resolveCurrentUserProfileDisplay } : {},
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(contextMessage)
		});
		if (newerContext.length > 0) projection.messages = projection.messages.filter((message) => (readSequence(message) ?? Infinity) <= (newestPageSeq ?? -1));
		return {
			filteredRawMessages,
			projected: offset === 0 ? projection.messages.length > params.max ? projection.messages.slice(-params.max) : projection.messages : capOffsetChatHistoryProjectedMessages(projection.messages, params.max, readSequence),
			projection
		};
	};
	const projectWindow = async () => {
		const result = project();
		if (recoveryContext !== void 0 || newestPageSeq === void 0 || !result.projection.assistantErrorPending) return result;
		recoveryContext = await readChatHistoryRecoveryContext({
			messages: result.filteredRawMessages,
			createRecovery: (messages) => {
				const recovery = createChatHistoryRecoveryProjection({
					subagentCoordination: params.readers.subagentCoordination,
					maxChars: params.effectiveMaxChars
				});
				recovery.append(messages);
				return recovery;
			},
			readScope: params.readScope,
			readers: params.readers,
			displaySource: readPage.displaySource,
			expectedReadWindow: readWindow,
			maxBytes: params.maxBytes,
			readOnly: params.readOnly,
			sessionStartedAt
		});
		return project();
	};
	let result = await projectWindow();
	let estimatedProjection = result.projection;
	let projectionDirty = false;
	let scanLimit = rawHistoryWindowMessages;
	let scannedBytes = 0;
	const unmeasuredPages = [];
	let nextChunkMessages = SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES;
	while (rawPageMessages < availableMessages) {
		if (projectionDirty && (estimatedProjection.messages.length >= params.max || params.isPageFull?.(estimatedProjection))) {
			result = await projectWindow();
			projectionDirty = false;
			estimatedProjection = result.projection;
		}
		if (result.projected.length >= params.max || !projectionDirty && params.isPageFull?.(result.projection)) break;
		if (rawPageMessages >= rawHistoryWindowMessages) scanLimit = rawHistoryWindowMessages + SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES;
		if (rawPageMessages >= scanLimit) break;
		const chunkMessages = Math.min(nextChunkMessages, scanLimit - rawPageMessages);
		const page = await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
			beforeSeq,
			offset: rawPageMessages,
			expectedReadWindow: readWindow,
			maxMessages: chunkMessages + 1,
			maxBytes: HISTORY_PAGE_MAX_BYTES,
			allowOversizedFirst: true,
			allowResetArchiveFallback: true,
			readOnly: params.readOnly
		});
		if (page.windowReset || page.displaySource !== readPage.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId, "window-changed");
		if (page.messages.length === 0) break;
		const contextMessage = page.messages.length > chunkMessages ? page.messages[0] : void 0;
		const chunkRawMessages = dropChatHistoryOverreadContextMessage(page.messages, contextMessage);
		rawPageMessages += chunkRawMessages.length;
		rawMessages = chunkRawMessages.concat(rawMessages);
		overreadContextMessage = contextMessage;
		const chunkProjection = project(chunkRawMessages, contextMessage, false, []).projection;
		estimatedProjection = {
			messages: chunkProjection.messages.concat(estimatedProjection.messages),
			activity: chunkProjection.activity.concat(estimatedProjection.activity)
		};
		projectionDirty = true;
		unmeasuredPages.push(page.messages);
		if (rawPageMessages > rawHistoryWindowMessages) {
			for (const messages of unmeasuredPages) scannedBytes += Buffer.byteLength(JSON.stringify(messages), "utf8");
			unmeasuredPages.length = 0;
			if (scannedBytes >= params.maxBytes) break;
		}
		nextChunkMessages = Math.min(nextChunkMessages * 2, SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_CHUNK_MESSAGES);
	}
	if (projectionDirty) result = await projectWindow();
	params.readers.subagentCoordination?.assertCurrent?.();
	return {
		overreadContextMessage,
		projected: result.projected,
		projection: result.projection,
		rawMessages: result.filteredRawMessages,
		rawPageMessages,
		readPage
	};
}
async function readIncrementalChatHistoryTail(params) {
	try {
		return await readIncrementalChatHistoryTailAttempt(params);
	} catch (error) {
		if (!(error instanceof SessionTranscriptProjectionUnavailableError) || error.reason !== "window-changed") throw error;
		return {
			...await readIncrementalChatHistoryTailAttempt({
				...params,
				offset: 0,
				beforeSeq: void 0
			}),
			windowReset: true
		};
	}
}
//#endregion
export { readChatHistoryMessageId as a, readChatHistoryRecoveryContext as c, readChatHistoryAnchorPage as i, readIncrementalChatHistoryTail as l, dropChatHistoryOverreadContextMessage as n, readChatHistoryMessageSeq as o, paginateSessionMessages as r, readChatHistoryPaginationKey as s, buildPaginatedSessionHistory as t, resolveCursorSeq as u };
