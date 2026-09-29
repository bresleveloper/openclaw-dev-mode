import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as resolveSessionTranscriptActiveLeafEntryId } from "./transcript-tree-3xvvNd9-.mjs";
import { t as readLegacyCompactionHistory } from "./legacy-compaction-history-D-x7k5QQ.mjs";
import { r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-C78Q4iVY.mjs";
import { o as isHeartbeatHistoryTurnBoundaryMessage, r as dropPreSessionStartAnnouncePairs } from "./chat-display-projection.history-C3UZzKPr.mjs";
import { o as projectChatDisplayMessagesWithState, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-x-JzVWZh.mjs";
import { a as readChatHistoryRecoveryContext, i as readChatHistoryMessageSeq, n as dropChatHistoryOverreadContextMessage, o as readIncrementalChatHistoryTail, r as readChatHistoryMessageId, t as capOffsetChatHistoryProjectedMessages } from "./session-history-tail-Ve6Mx3al.mjs";
//#region src/gateway/server-methods/chat-history-page-kernel.ts
function resolveChatHistoryNextOffset(params) {
	let oldestSeq;
	let boundedSiblings = 0;
	for (const message of params.messages) {
		const seq = readChatHistoryMessageSeq(message);
		oldestSeq ??= seq;
		if (seq !== void 0 && seq === oldestSeq) boundedSiblings += 1;
	}
	if (oldestSeq === void 0) return params.offset + params.rawPageMessages;
	const recordOffset = params.totalMessages - oldestSeq + 1;
	const replayOffset = recordOffset - 1;
	if (replayOffset > params.offset) {
		let projectedSiblings = 0;
		for (const message of params.projected) if (readChatHistoryMessageSeq(message) === oldestSeq) {
			projectedSiblings += 1;
			if (projectedSiblings > boundedSiblings) return replayOffset;
		}
	}
	return Math.max(params.offset + 1, recordOffset);
}
function resolveChatHistoryActiveLeafEntryId(readPage) {
	if (readPage.transcriptSource !== "active") return null;
	if (Object.hasOwn(readPage, "activeLeafEntryId")) return readPage.activeLeafEntryId ?? null;
	return resolveSessionTranscriptActiveLeafEntryId(readPage.transcriptEvents ?? []) ?? null;
}
/** Preserve token metrics saved by pre-removal builds; new markers own their metrics. */
function enrichChatHistoryCompactionMarkers(messages, entry) {
	let checkpoints;
	try {
		checkpoints = readLegacyCompactionHistory(entry);
	} catch {
		return messages;
	}
	if (checkpoints.length === 0) return messages;
	const checkpointByEntryId = new Map(checkpoints.flatMap((checkpoint) => {
		const entryId = checkpoint.postCompaction.entryId;
		return entryId ? [[entryId, checkpoint]] : [];
	}));
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
function resolveChatHistoryMessageGroup(messages, index, messageCost) {
	const seq = readChatHistoryMessageSeq(messages[index]);
	let start = index;
	let end = index + 1;
	let cost = messageCost(messages[index]);
	if (seq === void 0) return {
		start,
		end,
		cost
	};
	while (start > 0 && readChatHistoryMessageSeq(messages[start - 1]) === seq) {
		start -= 1;
		cost += messageCost(messages[start]);
	}
	while (end < messages.length && readChatHistoryMessageSeq(messages[end]) === seq) {
		cost += messageCost(messages[end]);
		end += 1;
	}
	return {
		start,
		end,
		cost
	};
}
function capChatHistoryAroundMessage(params) {
	const anchorIndex = params.messages.findIndex((message) => readChatHistoryMessageId(message) === params.messageId);
	if (anchorIndex === -1) return [];
	const messageCost = params.messageCost ?? (() => 1);
	const anchorGroup = resolveChatHistoryMessageGroup(params.messages, anchorIndex, messageCost);
	if (!(anchorGroup.cost <= params.maxCost)) return [params.messages[anchorIndex]];
	let { start, end, cost } = anchorGroup;
	let canGrowOlder = start > 0;
	let canGrowNewer = end < params.messages.length;
	while (canGrowOlder || canGrowNewer) {
		if (canGrowOlder) {
			const olderGroup = resolveChatHistoryMessageGroup(params.messages, start - 1, messageCost);
			if (cost + olderGroup.cost <= params.maxCost) {
				start = olderGroup.start;
				cost += olderGroup.cost;
			} else canGrowOlder = false;
		}
		canGrowOlder &&= start > 0;
		if (canGrowNewer) {
			const newerGroup = resolveChatHistoryMessageGroup(params.messages, end, messageCost);
			if (cost + newerGroup.cost <= params.maxCost) {
				end = newerGroup.end;
				cost += newerGroup.cost;
			} else canGrowNewer = false;
		}
		canGrowNewer &&= end < params.messages.length;
	}
	return params.messages.slice(start, end);
}
/** Assemble one page from admitted readers; host imports and profile discovery stay outside. */
async function readChatHistoryPageKernel(params, options) {
	const { entry, sessionId, storePath, sessionAgentId, canonicalKey, max, maxHistoryBytes, effectiveMaxChars, offset, messageId } = params;
	if (!sessionId || !storePath) {
		if (messageId) return { messages: [] };
		return {
			...(offset ?? 0) === 0 ? { activeLeafEntryId: null } : {},
			messages: [],
			...offset !== void 0 ? { responseOffset: offset } : {},
			pagination: {
				offset: offset ?? 0,
				totalMessages: 0,
				rawPageMessages: 0
			}
		};
	}
	const readScope = {
		agentId: sessionAgentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: canonicalKey,
		storePath
	};
	const cliSessionId = options.cliSessionId;
	if ((offset !== void 0 || messageId) && !cliSessionId) {
		let pageOffset = offset ?? 0;
		let hasOverreadContext = false;
		let readPage;
		let incrementalTail;
		if (messageId) {
			const anchoredPage = await options.readers.readSessionMessagesAroundIdWithStatsAsync(readScope, {
				messageId,
				maxMessages: max,
				allowResetArchiveFallback: true,
				readOnly: options.readOnly
			});
			if (!anchoredPage.found) return { messages: [] };
			pageOffset = anchoredPage.offset;
			hasOverreadContext = anchoredPage.hasOverreadContext;
			readPage = anchoredPage;
		} else {
			incrementalTail = await readIncrementalChatHistoryTail({
				entry,
				readScope,
				effectiveMaxChars,
				max,
				maxBytes: maxHistoryBytes,
				offset: pageOffset,
				...options
			});
			readPage = incrementalTail.readPage;
		}
		const isTailPage = !messageId && pageOffset === 0;
		const overreadContextMessage = incrementalTail ? incrementalTail.overreadContextMessage : hasOverreadContext || readPage.messages.length > max ? readPage.messages[0] : void 0;
		const localMessages = incrementalTail ? incrementalTail.rawMessages : dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const rawPageMessages = incrementalTail ? incrementalTail.rawPageMessages : Math.min(max, Math.max(readPage.messages.length, readPage.totalMessages > pageOffset ? 1 : 0));
		const project = (messages) => projectChatDisplayMessagesWithState(messages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: effectiveMaxChars,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay },
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const projection = incrementalTail?.projection ?? project(localMessages);
		let projected = incrementalTail?.projected ?? projection.messages;
		const newestPageSeq = readChatHistoryMessageSeq(localMessages.at(-1));
		if (!incrementalTail && pageOffset > 0 && newestPageSeq !== void 0 && projection.assistantErrorPending) {
			const recoveryContext = await readChatHistoryRecoveryContext({
				messages: localMessages,
				createRecovery: (messages) => {
					const recovery = createChatHistoryRecoveryProjection({
						maxChars: effectiveMaxChars,
						subagentCoordination: options.readers.subagentCoordination
					});
					recovery.append(messages);
					return recovery;
				},
				readScope,
				readers: options.readers,
				displaySource: readPage.displaySource,
				maxBytes: maxHistoryBytes,
				readOnly: options.readOnly
			});
			if (recoveryContext.length > 0) projected = project([...localMessages, ...recoveryContext]).messages.filter((message) => (readChatHistoryMessageSeq(message) ?? Infinity) <= newestPageSeq);
		}
		const windowed = messageId ? capChatHistoryAroundMessage({
			messages: projected,
			messageId,
			maxCost: max
		}) : projected;
		if (messageId) return {
			messages: augmentChatHistoryWithCanvasBlocks(windowed),
			...projection.activity.length ? { activity: projection.activity } : {}
		};
		return {
			...isTailPage ? {
				activeLeafEntryId: resolveChatHistoryActiveLeafEntryId(readPage),
				...readPage.transcriptSource === "active" && readPage.deltaCursor && !incrementalTail?.projection.assistantErrorPending ? { deltaCursor: readPage.deltaCursor } : {}
			} : {},
			messages: augmentChatHistoryWithCanvasBlocks(windowed),
			...projection.activity.length ? { activity: projection.activity } : {},
			responseOffset: pageOffset,
			pagination: {
				offset: pageOffset,
				totalMessages: readPage.totalMessages,
				rawPageMessages
			}
		};
	}
	const incrementalTail = await readIncrementalChatHistoryTail({
		entry,
		readScope,
		effectiveMaxChars,
		max,
		maxBytes: maxHistoryBytes,
		offset,
		...options
	});
	const { readPage } = incrementalTail;
	const activeLeafEntryId = resolveChatHistoryActiveLeafEntryId(readPage);
	const buildTailPage = (messages) => {
		const windowedTailMessages = offset === void 0 ? messages.length > max ? messages.slice(-max) : messages : capOffsetChatHistoryProjectedMessages(messages, max);
		return {
			activeLeafEntryId,
			...readPage.transcriptSource === "active" && readPage.deltaCursor && !incrementalTail.projection.assistantErrorPending ? { deltaCursor: readPage.deltaCursor } : {},
			messages: augmentChatHistoryWithCanvasBlocks(windowedTailMessages),
			...incrementalTail.projection.activity.length ? { activity: incrementalTail.projection.activity } : {},
			pagination: {
				offset: offset ?? 0,
				totalMessages: readPage.totalMessages,
				rawPageMessages: incrementalTail.rawPageMessages
			}
		};
	};
	return options.readCliTailPage ? options.readCliTailPage({
		readScope,
		incrementalTail,
		activeLeafEntryId,
		buildTailPage
	}) : buildTailPage(incrementalTail.projected);
}
//#endregion
export { resolveChatHistoryNextOffset as i, enrichChatHistoryCompactionMarkers as n, readChatHistoryPageKernel as r, capChatHistoryAroundMessage as t };
