import { l as getMaxChatHistoryMessagesBytes } from "./server-constants-BH_EolwD.mjs";
import { _ as capArrayByJsonBytes } from "./session-transcript-readers-CDyCeaj9.mjs";
import { i as composeTranscriptDisplay } from "./transcript-image-artifacts-DqNH9hLC.mjs";
import { a as createChatHistoryByteCounter, i as createChatHistoryActivityProjection, s as replaceOversizedChatHistoryMessages, t as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES } from "./chat-history-budget-Ci-uxG6q.mjs";
import { i as resolveChatHistoryNextOffset, n as enrichChatHistoryCompactionMarkers, t as capChatHistoryAroundMessage } from "./chat-history-page-kernel-DvkJyoHR.mjs";
//#region src/gateway/server-methods/chat-history-response-page.ts
function prepareChatHistoryResponsePage(historyPage, { entry: historyEntry, compactionMetrics, maxHistoryBytes: responseHistoryBytes, messageId }) {
	const normalized = enrichChatHistoryCompactionMarkers(historyPage.messages, historyEntry, compactionMetrics);
	const activity = createChatHistoryActivityProjection(normalized, historyPage.activity);
	const byteCounter = createChatHistoryByteCounter(activity);
	const replaced = replaceOversizedChatHistoryMessages({
		byteCounter,
		messages: normalized,
		maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, getMaxChatHistoryMessagesBytes())
	});
	const capped = messageId ? capChatHistoryAroundMessage({
		messages: replaced.messages,
		messageId,
		maxCost: responseHistoryBytes - 1 - byteCounter.framingBytes(replaced.messages),
		messageCost: (message) => byteCounter.messageBytes(message) + 1
	}) : capArrayByJsonBytes(replaced.messages, responseHistoryBytes - byteCounter.framingBytes(replaced.messages), byteCounter.messageBytes).items;
	const pagination = historyPage.pagination;
	const candidateNextOffset = pagination === void 0 ? void 0 : resolveChatHistoryNextOffset({
		messages: capped,
		totalMessages: pagination.totalMessages,
		offset: pagination.offset,
		rawPageMessages: pagination.rawPageMessages,
		projected: normalized,
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
			normalizedBytes: byteCounter.messagesBytes(normalized)
		} } : {},
		responseHistoryBytes,
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
		encodedResponse: {
			...response,
			messages: new TextEncoder().encode(JSON.stringify(response.messages))
		}
	};
}
//#endregion
export { prepareChatHistoryResponsePage as n, encodeChatHistoryResponsePage as t };
