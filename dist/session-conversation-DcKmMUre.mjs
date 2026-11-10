import { n as parseTelegramTopicConversation, s as normalizeTelegramLookupTarget } from "./topic-conversation-S0gZB4iY.mjs";
//#region extensions/telegram/src/session-conversation.ts
function resolveTelegramSessionConversation(params) {
	const parsed = parseTelegramTopicConversation({ conversationId: params.rawId });
	if (!parsed) return null;
	return {
		id: parsed.chatId,
		threadId: `${parsed.thread.scope === "direct-messages" ? "direct-topic:" : ""}${parsed.thread.id}`,
		baseConversationId: parsed.chatId,
		parentConversationCandidates: [parsed.chatId]
	};
}
function resolveTelegramSessionTarget(params) {
	const raw = params.kind === "group" ? `telegram:group:${params.id}` : `telegram:${params.id}`;
	const chatId = normalizeTelegramLookupTarget(raw);
	const threadId = params.threadId?.startsWith("direct-topic:") ? params.threadId : params.threadId && `topic:${params.threadId}`;
	return chatId && threadId ? `${chatId}:${threadId}` : chatId;
}
//#endregion
export { resolveTelegramSessionTarget as n, resolveTelegramSessionConversation as t };
