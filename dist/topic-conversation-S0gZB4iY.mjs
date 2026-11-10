import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
//#region extensions/telegram/src/targets.ts
const TELEGRAM_NUMERIC_CHAT_ID_REGEX = /^-?\d+$/;
const TELEGRAM_USERNAME_REGEX = /^[A-Za-z0-9_]{5,}$/i;
const TELEGRAM_TOPIC_SUFFIX_REGEX = /^(.+?):(?:(direct-topic|topic):)?(\d+)$/;
const TELEGRAM_INVALID_TOPIC_ID_MESSAGE = "Telegram topic ID must be a positive safe integer.";
const TELEGRAM_INTERNAL_PREFIXES_RE = /^(?:telegram|tg):(?:\s*(?:telegram|tg|group):)*/i;
function stripTelegramInternalPrefixes(to) {
	return to.trim().replace(TELEGRAM_INTERNAL_PREFIXES_RE, "").trim();
}
function normalizeTelegramChatId(raw) {
	const stripped = stripTelegramInternalPrefixes(raw);
	return TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(stripped) ? stripped : void 0;
}
function isNumericTelegramChatId(raw) {
	return TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(raw.trim());
}
function normalizeTelegramOutboundTarget(raw) {
	const trimmed = raw.trim();
	return /^group:(-?\d+(?::(?:direct-topic|topic):\d+|:\d+)?)$/i.exec(trimmed)?.[1] ?? raw;
}
function normalizeTelegramLookupTarget(raw) {
	const stripped = stripTelegramInternalPrefixes(raw);
	if (TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(stripped)) return stripped;
	const tmeMatch = /^(?:https?:\/\/)?t\.me\/([A-Za-z0-9_]+)$/i.exec(stripped);
	if (tmeMatch?.[1]) return `@${tmeMatch[1]}`;
	const handle = stripped.startsWith("@") ? stripped.slice(1) : stripped;
	return TELEGRAM_USERNAME_REGEX.test(handle) ? `@${handle}` : void 0;
}
function resolveTelegramChatType(chatId) {
	const trimmed = chatId.trim();
	if (TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(trimmed)) return trimmed.startsWith("-") ? "group" : "direct";
	return "unknown";
}
/**
* Supported delivery targets:
* - `chatId` (plain chat ID, t.me link, @username, or internal prefixes like `telegram:...`)
* - `chatId:topicId` (numeric topic/thread ID)
* - `chatId:topic:topicId` (explicit topic marker; preferred)
* - `chatId:direct-topic:topicId` (channel Direct Messages topic)
*/
function parseTelegramTarget(to) {
	const normalized = stripTelegramInternalPrefixes(to);
	const match = TELEGRAM_TOPIC_SUFFIX_REGEX.exec(normalized);
	const chatId = match?.[1];
	const topicIdText = match?.[3];
	if (chatId && topicIdText) {
		const directTopic = match[2] === "direct-topic";
		const topicId = parseStrictPositiveInteger(topicIdText);
		if (topicId !== void 0) return directTopic ? {
			chatId,
			directMessagesTopicId: topicId,
			chatType: resolveTelegramChatType(chatId)
		} : {
			chatId,
			messageThreadId: topicId,
			chatType: resolveTelegramChatType(chatId)
		};
	}
	return {
		chatId: normalized,
		chatType: match ? "unknown" : resolveTelegramChatType(normalized)
	};
}
/**
* True when a valid chat target carries a topic suffix whose id was rejected.
* The parser then keeps the whole string as the chat id, so the suffix is still
* attached to it. A garbage base target keeps the plain invalid-recipient error.
*/
function hasRejectedTelegramTopic(raw) {
	const normalized = stripTelegramInternalPrefixes(raw);
	const base = TELEGRAM_TOPIC_SUFFIX_REGEX.exec(normalized)?.[1];
	return base !== void 0 && normalizeTelegramLookupTarget(base) !== void 0 && parseTelegramTarget(normalized).chatId === normalized;
}
function resolveTelegramTargetChatType(target) {
	return parseTelegramTarget(target).chatType;
}
//#endregion
//#region extensions/telegram/src/topic-conversation.ts
function serializeTelegramTopicConversation(params) {
	const chatId = normalizeTelegramLookupTarget(params.chatId);
	const id = params.thread.id == null ? void 0 : Math.trunc(params.thread.id);
	if (!chatId || id == null || !Number.isFinite(id)) return null;
	const marker = params.thread.scope === "direct-messages" && id > 0 ? "direct-topic" : params.thread.scope === "forum" && id >= 0 ? "topic" : null;
	return marker ? `${chatId}:${marker}:${id}` : null;
}
function buildTelegramConversationId(params) {
	const chatId = String(params.chatId).trim();
	return serializeTelegramTopicConversation({
		chatId,
		thread: params.thread
	}) ?? chatId;
}
function parseTelegramTopicConversation(params) {
	const conversationId = params.conversationId.trim().replace(/:(direct-topic|topic):/i, (_match, marker) => `:${marker.toLowerCase()}:`);
	const target = parseTelegramTarget(conversationId);
	let chatId = normalizeTelegramLookupTarget(target.chatId);
	let thread = target.directMessagesTopicId != null ? {
		id: target.directMessagesTopicId,
		scope: "direct-messages"
	} : target.messageThreadId == null ? null : {
		id: target.messageThreadId,
		scope: "forum"
	};
	if (!chatId || !thread) {
		const parent = params.parentConversationId?.trim();
		if (!/^\d+$/.test(conversationId) || !parent || parent === conversationId) return null;
		chatId = parent;
		thread = {
			id: Number(conversationId),
			scope: "forum"
		};
	}
	const canonicalConversationId = serializeTelegramTopicConversation({
		chatId,
		thread
	});
	return canonicalConversationId ? {
		chatId,
		thread,
		canonicalConversationId
	} : null;
}
//#endregion
export { isNumericTelegramChatId as a, normalizeTelegramOutboundTarget as c, stripTelegramInternalPrefixes as d, hasRejectedTelegramTopic as i, parseTelegramTarget as l, parseTelegramTopicConversation as n, normalizeTelegramChatId as o, TELEGRAM_INVALID_TOPIC_ID_MESSAGE as r, normalizeTelegramLookupTarget as s, buildTelegramConversationId as t, resolveTelegramTargetChatType as u };
