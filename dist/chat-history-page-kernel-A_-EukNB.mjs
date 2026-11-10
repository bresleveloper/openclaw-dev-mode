import { s as resolveSessionTranscriptActiveLeafEntryId } from "./transcript-tree-D61jhi_i.mjs";
import { n as createTranscriptDisplaySource } from "./transcript-display-position-BHW0T3ai.mjs";
import { r as augmentChatHistoryWithCanvasBlocks } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { c as projectChatDisplayMessagesWithState, t as createChatHistoryRecoveryProjection } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { o as isHeartbeatHistoryTurnBoundaryMessage, r as dropPreSessionStartAnnouncePairs } from "./chat-display-projection.history-DKYX-kD-.mjs";
import { a as readChatHistoryMessageId, c as readChatHistoryRecoveryContext, i as readChatHistoryAnchorPage, l as readIncrementalChatHistoryTail, n as dropChatHistoryOverreadContextMessage, o as readChatHistoryMessageSeq } from "./session-history-tail-C5LEM5f_.mjs";
import { r as prepareChatHistoryResponsePage } from "./chat-history-response-page-dk61A4nE.mjs";
import { t as attachChatHistoryReplyMessages } from "./chat-history-reply-messages-Cs9kWyEM.mjs";
//#region src/gateway/server-methods/chat-history-page-kernel.ts
function resolveChatHistoryActiveLeafEntryId(readPage) {
	if (readPage.transcriptSource !== "active") return null;
	if (Object.hasOwn(readPage, "activeLeafEntryId")) return readPage.activeLeafEntryId ?? null;
	return resolveSessionTranscriptActiveLeafEntryId(readPage.transcriptEvents ?? []) ?? null;
}
/** Assemble one page from admitted readers; host imports and profile discovery stay outside. */
async function readChatHistoryPageKernel(params, options) {
	const { entry, sessionId, storePath, sessionAgentId, canonicalKey, max, maxHistoryBytes, effectiveMaxChars, offset, messageId, pageCursor } = params;
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
	const attachReplyMessages = (messages) => attachChatHistoryReplyMessages(augmentChatHistoryWithCanvasBlocks(messages), params, options);
	const readSequence = options.readMessageSequence ?? readChatHistoryMessageSeq;
	if (messageId) {
		const direction = pageCursor?.direction;
		const readPage = await readChatHistoryAnchorPage(options.readers, readScope, {
			messageId,
			maxMessages: max + (direction === "older" ? 2 : direction === "newer" ? 1 : 0),
			direction,
			allowResetArchiveFallback: true,
			readOnly: options.readOnly
		});
		const source = readPage.displaySource ? createTranscriptDisplaySource([readPage.displaySource]) : void 0;
		if (pageCursor && (!readPage.found || readPage.windowReset || source !== pageCursor.source)) return {
			messages: [],
			windowReset: true
		};
		if (!readPage.found) return { messages: [] };
		let pageMessages = readPage.messages;
		let overreadContextMessage = readPage.hasOverreadContext ? pageMessages[0] : void 0;
		if (direction) {
			const anchorIndex = pageMessages.findIndex((message) => readChatHistoryMessageId(message) === messageId);
			if (anchorIndex < 0) return {
				messages: [],
				windowReset: true
			};
			const anchorSeq = readSequence(pageMessages[anchorIndex]);
			let start = anchorIndex;
			let end = anchorIndex + 1;
			if (anchorSeq !== void 0) {
				while (start > 0 && readSequence(pageMessages[start - 1]) === anchorSeq) start -= 1;
				while (end < pageMessages.length && readSequence(pageMessages[end]) === anchorSeq) end += 1;
			}
			if (direction === "newer") {
				overreadContextMessage = pageMessages[end - 1];
				pageMessages = pageMessages.slice(end - 1);
			} else {
				pageMessages = pageMessages.slice(0, start);
				const firstSeq = readSequence(pageMessages[0]);
				if (anchorSeq !== void 0 && firstSeq !== void 0 && anchorSeq - firstSeq > max) {
					overreadContextMessage = pageMessages[0];
					pageMessages = [overreadContextMessage, ...pageMessages.filter((message) => readSequence(message) !== firstSeq)];
				}
			}
		}
		const localMessages = dropChatHistoryOverreadContextMessage(dropPreSessionStartAnnouncePairs(pageMessages, typeof entry?.sessionStartedAt === "number" ? entry.sessionStartedAt : void 0), overreadContextMessage);
		const project = (messages) => projectChatDisplayMessagesWithState(messages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: effectiveMaxChars,
			toolResultMaxChars: params.toolResultMaxChars,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay },
			turnBoundaryPending: isHeartbeatHistoryTurnBoundaryMessage(overreadContextMessage)
		});
		const projection = project(localMessages);
		let projected = projection.messages;
		const newestPageSeq = readSequence(localMessages.at(-1));
		if ((direction === "older" || readPage.offset > 0) && newestPageSeq !== void 0 && projection.assistantErrorPending) {
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
				readOnly: options.readOnly,
				sessionStartedAt: entry?.sessionStartedAt
			});
			if (recoveryContext.length > 0) projected = project([...localMessages, ...recoveryContext]).messages.filter((message) => (readSequence(message) ?? Infinity) <= newestPageSeq);
		}
		const cursorMessages = dropChatHistoryOverreadContextMessage(pageMessages, overreadContextMessage);
		const oldestSeq = readSequence(cursorMessages[0]);
		return {
			messages: await attachReplyMessages(projected),
			...projection.activity.length ? { activity: projection.activity } : {},
			...source ? { anchor: {
				sessionId,
				source,
				direction,
				hasOlder: direction === "newer" || oldestSeq !== void 0 && oldestSeq > 1,
				hasNewer: direction === "older" || readPage.offset > 0,
				oldestMessageId: readChatHistoryMessageId(cursorMessages[0]),
				newestMessageId: readChatHistoryMessageId(cursorMessages.at(-1))
			} } : {}
		};
	}
	const incrementalTail = await readIncrementalChatHistoryTail({
		entry,
		readScope,
		effectiveMaxChars,
		max,
		toolResultMaxChars: params.toolResultMaxChars,
		maxBytes: maxHistoryBytes,
		isPageFull: (projection) => prepareChatHistoryResponsePage(projection, params, options.readMessageSequence).omission?.byteLimited === true,
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
		messages: await attachReplyMessages(incrementalTail.projected),
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
export { readChatHistoryPageKernel as t };
