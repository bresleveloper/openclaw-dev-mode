import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as resolveSessionTranscriptActiveLeafEntryId } from "./transcript-tree-CaYJo8Xs.mjs";
import { n as readLegacyCompactionMetrics } from "./legacy-compaction-history-DS8GebGO.mjs";
import { r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-DwEc-tyR.mjs";
import { o as isHeartbeatHistoryTurnBoundaryMessage, r as dropPreSessionStartAnnouncePairs } from "./chat-display-projection.history-C7mOEuaq.mjs";
import { s as projectChatDisplayMessagesWithState, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-BSNrSH5r.mjs";
import { a as readChatHistoryRecoveryContext, i as readChatHistoryPaginationKey, n as readChatHistoryMessageId, o as readIncrementalChatHistoryTail, r as readChatHistoryMessageSeq, t as dropChatHistoryOverreadContextMessage } from "./session-history-tail-B4XoDl5j.mjs";
//#region src/gateway/server-methods/chat-history-page-kernel.ts
function resolveChatHistoryNextOffset(params) {
	const sequence = (message) => params.messageSequences?.[readChatHistoryPaginationKey(message) ?? ""] ?? readChatHistoryMessageSeq(message);
	let oldestSeq;
	let boundedSiblings = 0;
	for (const message of params.messages) {
		const seq = sequence(message);
		oldestSeq ??= seq;
		if (seq !== void 0 && seq === oldestSeq) boundedSiblings += 1;
	}
	if (oldestSeq === void 0) return params.offset + params.rawPageMessages;
	const recordOffset = params.totalMessages - oldestSeq + 1;
	const replayOffset = recordOffset - 1;
	if (replayOffset > params.offset) {
		let projectedSiblings = 0;
		for (const message of params.projected) if (sequence(message) === oldestSeq) {
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
	const readSequence = options.readMessageSequence ?? readChatHistoryMessageSeq;
	if (messageId) {
		const readPage = await options.readers.readSessionMessagesAroundIdWithStatsAsync(readScope, {
			messageId,
			maxMessages: max,
			allowResetArchiveFallback: true,
			readOnly: options.readOnly
		});
		if (!readPage.found) return { messages: [] };
		const overreadContextMessage = readPage.hasOverreadContext || readPage.messages.length > max ? readPage.messages[0] : void 0;
		const localMessages = dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(readPage.messages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const project = (messages) => projectChatDisplayMessagesWithState(messages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: effectiveMaxChars,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay },
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const projection = project(localMessages);
		let projected = projection.messages;
		const newestPageSeq = readSequence(localMessages.at(-1));
		if (readPage.offset > 0 && newestPageSeq !== void 0 && projection.assistantErrorPending) {
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
			if (recoveryContext.length > 0) projected = project([...localMessages, ...recoveryContext]).messages.filter((message) => (readSequence(message) ?? Infinity) <= newestPageSeq);
		}
		return {
			messages: augmentChatHistoryWithCanvasBlocks(capChatHistoryAroundMessage({
				messages: projected,
				messageId,
				maxCost: max
			})),
			...projection.activity.length ? { activity: projection.activity } : {}
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
	const currentOffset = incrementalTail.windowReset ? 0 : offset;
	const isOffsetPage = currentOffset !== void 0;
	const includeActiveLeaf = !isOffsetPage || currentOffset === 0;
	const activeLeafEntryId = includeActiveLeaf ? resolveChatHistoryActiveLeafEntryId(readPage) : null;
	return {
		...incrementalTail.windowReset ? { windowReset: true } : {},
		...includeActiveLeaf ? { activeLeafEntryId } : {},
		...includeActiveLeaf && readPage.transcriptSource === "active" && readPage.deltaCursor && !incrementalTail.projection.assistantErrorPending ? { deltaCursor: readPage.deltaCursor } : {},
		messages: augmentChatHistoryWithCanvasBlocks(incrementalTail.projected),
		...incrementalTail.projection.activity.length ? { activity: incrementalTail.projection.activity } : {},
		...isOffsetPage ? { responseOffset: currentOffset } : {},
		pagination: {
			offset: currentOffset ?? 0,
			totalMessages: readPage.totalMessages,
			rawPageMessages: incrementalTail.rawPageMessages
		}
	};
}
//#endregion
export { resolveChatHistoryNextOffset as i, enrichChatHistoryCompactionMarkers as n, readChatHistoryPageKernel as r, capChatHistoryAroundMessage as t };
