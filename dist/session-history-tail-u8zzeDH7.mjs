import { d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { n as resolveTranscriptPageEnd } from "./transcript-anchor-page-VHli4oQ1.mjs";
import { o as isHeartbeatHistoryTurnBoundaryMessage, r as dropPreSessionStartAnnouncePairs, t as createPreSessionStartAnnouncePairFilter } from "./chat-display-projection.history-C3UZzKPr.mjs";
import { o as projectChatDisplayMessagesWithState, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DpiCCyQ3.mjs";
//#region src/gateway/session-history-tail.ts
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES = 8e3;
const SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES = 100;
const SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_CHUNK_MESSAGES = 400;
function readChatHistoryMessageId(message) {
	const id = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"])?.id;
	return typeof id === "string" && id ? id : void 0;
}
function readChatHistoryMessageSeq(message) {
	const metadata = asOptionalRecord(asOptionalRecord(message)?.["__openclaw"]);
	return asPositiveSafeInteger(metadata?.seq);
}
function capOffsetChatHistoryProjectedMessages(messages, max) {
	if (messages.length <= max) return messages;
	const start = Math.max(0, messages.length - max);
	const boundarySeq = readChatHistoryMessageSeq(messages[start]);
	if (boundarySeq === void 0) return messages.slice(start);
	let safeStart = start;
	while (safeStart > 0 && readChatHistoryMessageSeq(messages[safeStart - 1]) === boundarySeq) safeStart--;
	return messages.slice(safeStart);
}
function dropChatHistoryOverreadContextMessage(messages, contextMessage) {
	if (contextMessage === void 0) return messages;
	const index = messages.indexOf(contextMessage);
	return index < 0 ? messages : [...messages.slice(0, index), ...messages.slice(index + 1)];
}
async function readAdjacentChatHistoryMessages(params) {
	const page = await params.readers.readSessionMessagesAroundIdWithStatsAsync(params.readScope, {
		messageId: params.anchorId,
		maxMessages: params.limit + 1,
		direction: params.direction,
		expectedReadWindow: params.expectedReadWindow,
		allowResetArchiveFallback: true,
		readOnly: params.readOnly
	});
	if (!page.found || page.displaySource !== params.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
	const anchorIndex = page.messages.findIndex((message) => readChatHistoryMessageId(message) === params.anchorId);
	if (anchorIndex < 0) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
	return params.direction === "newer" ? page.messages.slice(anchorIndex + 1, anchorIndex + 1 + params.limit) : page.messages.slice(Math.max(0, anchorIndex - params.limit), anchorIndex);
}
/** Resolve only the newer turn context a historical page needs to classify its pending error. */
async function readChatHistoryRecoveryContext(params) {
	const context = [];
	let recovery;
	let anchorId = readChatHistoryMessageId(params.messages.at(-1));
	let scannedBytes = 0;
	while (anchorId && context.length < SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES) {
		const chunkSize = Math.min(SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES, SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES - context.length);
		const newer = await readAdjacentChatHistoryMessages({
			anchorId,
			direction: "newer",
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
			scannedBytes += Buffer.byteLength(JSON.stringify(message), "utf8");
			if (scannedBytes > params.maxBytes) return context;
			context.push(message);
			if (asOptionalRecord(message)?.role === "user") {
				boundaryReached = true;
				break;
			}
		}
		if (boundaryReached) break;
		recovery ??= params.createRecovery(params.messages);
		recovery.append(context.slice(previousContextLength));
		if (!recovery.pending) break;
		anchorId = readChatHistoryMessageId(context.at(-1));
	}
	return context;
}
/** Scans indexed transcript records until one bounded visible history page is filled. */
async function readIncrementalChatHistoryTail(params) {
	const { resolveCurrentUserProfileDisplay } = params;
	let offset = params.offset ?? 0;
	const requestedBeforeSeq = params.beforeSeq;
	const rawHistoryWindowMessages = Math.max(1, Math.floor(params.max)) * 20 + 20;
	let initialMessages = requestedBeforeSeq !== void 0 ? Math.min(rawHistoryWindowMessages, Math.max(1, params.max)) : params.preserveProjectionContext && offset === 0 ? rawHistoryWindowMessages : Math.min(rawHistoryWindowMessages, Math.max(1, offset === 0 ? params.max * 3 : params.max));
	const readPage = offset === 0 && requestedBeforeSeq === void 0 ? await params.readers.readRecentSessionMessagesWithStatsAsync(params.readScope, {
		maxMessages: initialMessages + 1,
		maxLines: initialMessages + 1,
		maxBytes: Math.max(params.maxBytes * 2, 1048576),
		allowResetArchiveFallback: true,
		captureReadWindow: true,
		readOnly: params.readOnly
	}) : await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
		offset,
		...requestedBeforeSeq === void 0 ? {} : { beforeSeq: requestedBeforeSeq },
		maxMessages: initialMessages + 1,
		...requestedBeforeSeq !== void 0 && params.preserveProjectionContext ? { recentAtHead: {
			maxMessages: rawHistoryWindowMessages + 1,
			maxLines: rawHistoryWindowMessages + 1,
			maxBytes: Math.max(params.maxBytes * 2, 1048576)
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
	const newestPageSeq = readChatHistoryMessageSeq(rawMessages.at(-1));
	const filterWindowMessages = (messages, contextMessage) => sessionStartedAt === void 0 ? messages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(contextMessage === void 0 ? messages : [contextMessage, ...messages], sessionStartedAt), contextMessage);
	const project = (messages = rawMessages, contextMessage = overreadContextMessage, resolveProfileDisplay = true, newerContext = recoveryContext ?? []) => {
		const filteredRawMessages = filterWindowMessages(messages, contextMessage);
		const projection = projectChatDisplayMessagesWithState(newerContext.length > 0 ? [...filteredRawMessages, ...newerContext] : filteredRawMessages, {
			subagentCoordination: params.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.effectiveMaxChars,
			resolveCronJobName: params.resolveCronJobName,
			...resolveProfileDisplay && !params.deferProfileDisplay ? { resolveCurrentUserProfileDisplay } : {},
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(contextMessage)
		});
		if (newerContext.length > 0) projection.messages = projection.messages.filter((message) => (readChatHistoryMessageSeq(message) ?? Infinity) <= (newestPageSeq ?? -1));
		return {
			filteredRawMessages,
			projected: offset === 0 ? projection.messages.length > params.max ? projection.messages.slice(-params.max) : projection.messages : capOffsetChatHistoryProjectedMessages(projection.messages, params.max),
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
				if (sessionStartedAt === void 0) {
					recovery.append(messages);
					return recovery;
				}
				const filter = createPreSessionStartAnnouncePairFilter(sessionStartedAt);
				let contextRemoved = overreadContextMessage === void 0;
				const append = (chunk) => {
					const filtered = filter(chunk);
					const prepared = contextRemoved ? filtered : dropChatHistoryOverreadContextMessage(filtered, overreadContextMessage);
					contextRemoved ||= prepared.length !== filtered.length;
					recovery.append(prepared);
				};
				append(overreadContextMessage === void 0 ? messages : [overreadContextMessage, ...messages]);
				return {
					append,
					get pending() {
						return recovery.pending;
					}
				};
			},
			readScope: params.readScope,
			readers: params.readers,
			displaySource: readPage.displaySource,
			expectedReadWindow: readWindow,
			maxBytes: params.maxBytes,
			readOnly: params.readOnly
		});
		return project();
	};
	let result = await projectWindow();
	let estimatedVisibleMessages = result.projected.length;
	let projectionDirty = false;
	let scanLimit = rawHistoryWindowMessages;
	let scannedBytes = 0;
	const unmeasuredPages = [];
	let nextChunkMessages = SILENT_CHAT_HISTORY_TAIL_SCAN_CHUNK_MESSAGES;
	while (rawPageMessages < availableMessages) {
		if (projectionDirty && estimatedVisibleMessages >= params.max) {
			result = await projectWindow();
			projectionDirty = false;
			estimatedVisibleMessages = result.projected.length;
		}
		if (result.projected.length >= params.max) break;
		if (rawPageMessages >= rawHistoryWindowMessages) scanLimit = rawHistoryWindowMessages + SILENT_CHAT_HISTORY_TAIL_SCAN_MAX_MESSAGES;
		if (rawPageMessages >= scanLimit) break;
		const chunkMessages = Math.min(nextChunkMessages, scanLimit - rawPageMessages);
		const oldestId = readChatHistoryMessageId(rawMessages[0]);
		const page = offset > 0 && recoveryContext !== void 0 && oldestId ? {
			...readPage,
			messages: await readAdjacentChatHistoryMessages({
				anchorId: oldestId,
				direction: "older",
				limit: chunkMessages + 1,
				readScope: params.readScope,
				readers: params.readers,
				displaySource: readPage.displaySource,
				expectedReadWindow: readWindow,
				readOnly: params.readOnly
			})
		} : await params.readers.readSessionMessagesPageWithStatsAsync(params.readScope, {
			beforeSeq,
			offset: rawPageMessages,
			expectedReadWindow: readWindow,
			maxMessages: chunkMessages + 1,
			allowResetArchiveFallback: true,
			readOnly: params.readOnly
		});
		if (page.displaySource !== readPage.displaySource) throw new SessionTranscriptProjectionUnavailableError(params.readScope.sessionId);
		if (page.messages.length === 0) break;
		const contextMessage = page.messages.length > chunkMessages ? page.messages[0] : void 0;
		const chunkRawMessages = dropChatHistoryOverreadContextMessage(page.messages, contextMessage);
		rawPageMessages += chunkRawMessages.length;
		rawMessages = chunkRawMessages.concat(rawMessages);
		overreadContextMessage = contextMessage;
		estimatedVisibleMessages += project(chunkRawMessages, contextMessage, false, []).projection.messages.length;
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
//#endregion
export { readChatHistoryRecoveryContext as a, readChatHistoryMessageSeq as i, dropChatHistoryOverreadContextMessage as n, readIncrementalChatHistoryTail as o, readChatHistoryMessageId as r, capOffsetChatHistoryProjectedMessages as t };
