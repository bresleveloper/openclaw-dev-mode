import { w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import "./number-runtime-CgyXj1A5.mjs";
//#region extensions/telegram/src/targets.ts
const TELEGRAM_NUMERIC_CHAT_ID_REGEX = /^-?\d+$/;
const TELEGRAM_USERNAME_REGEX = /^[A-Za-z0-9_]{5,}$/i;
const TELEGRAM_TOPIC_SUFFIX_REGEX = /^(.+?):(?:(direct-topic|topic):)?(\d+)$/;
const TELEGRAM_INVALID_TOPIC_ID_MESSAGE = "Telegram topic ID must be a positive safe integer.";
function stripTelegramInternalPrefixes(to) {
	let trimmed = to.trim();
	let strippedTelegramPrefix = false;
	while (true) if (/^(telegram|tg):/i.test(trimmed)) {
		strippedTelegramPrefix = true;
		trimmed = trimmed.replace(/^(telegram|tg):/i, "").trim();
	} else if (strippedTelegramPrefix && /^group:/i.test(trimmed)) trimmed = trimmed.replace(/^group:/i, "").trim();
	else return trimmed;
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
	const legacyGroupMatch = /^group:(-?\d+(?::(?:direct-topic|topic):\d+|:\d+)?)$/i.exec(trimmed);
	if (legacyGroupMatch?.[1]) return legacyGroupMatch[1];
	return raw;
}
function normalizeTelegramLookupTarget(raw) {
	const stripped = stripTelegramInternalPrefixes(raw);
	if (!stripped) return;
	if (isNumericTelegramChatId(stripped)) return stripped;
	const tmeMatch = /^(?:https?:\/\/)?t\.me\/([A-Za-z0-9_]+)$/i.exec(stripped);
	if (tmeMatch?.[1]) return `@${tmeMatch[1]}`;
	const handle = stripped.startsWith("@") ? stripped.slice(1) : stripped;
	return TELEGRAM_USERNAME_REGEX.test(handle) ? `@${handle}` : void 0;
}
/**
* Parse a Telegram delivery target into chatId and optional topic/thread ID.
*
* Supported formats:
* - `chatId` (plain chat ID, t.me link, @username, or internal prefixes like `telegram:...`)
* - `chatId:topicId` (numeric topic/thread ID)
* - `chatId:topic:topicId` (explicit topic marker; preferred)
* - `chatId:direct-topic:topicId` (channel Direct Messages topic)
*/
function resolveTelegramChatType(chatId) {
	const trimmed = chatId.trim();
	if (isNumericTelegramChatId(trimmed)) return trimmed.startsWith("-") ? "group" : "direct";
	return "unknown";
}
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
	return base !== void 0 && (normalizeTelegramChatId(base) !== void 0 || normalizeTelegramLookupTarget(base) !== void 0) && parseTelegramTarget(normalized).chatId === normalized;
}
function resolveTelegramTargetChatType(target) {
	return parseTelegramTarget(target).chatType;
}
//#endregion
//#region extensions/telegram/src/topic-conversation.ts
function threadSpecFromTarget(target) {
	if (target.directMessagesTopicId != null) return {
		id: target.directMessagesTopicId,
		scope: "direct-messages"
	};
	return target.messageThreadId == null ? null : {
		id: target.messageThreadId,
		scope: "forum"
	};
}
function serializeTelegramTopicConversation(params) {
	const chatId = normalizeTelegramChatId(params.chatId) ?? normalizeTelegramLookupTarget(params.chatId);
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
	const chatId = normalizeTelegramChatId(target.chatId) ?? normalizeTelegramLookupTarget(target.chatId);
	const thread = threadSpecFromTarget(target);
	if (chatId && thread) {
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
	const parent = params.parentConversationId?.trim();
	if (!/^\d+$/.test(conversationId) || !parent || parent === conversationId) return null;
	const parentThread = {
		id: Number(conversationId),
		scope: "forum"
	};
	const canonicalConversationId = serializeTelegramTopicConversation({
		chatId: parent,
		thread: parentThread
	});
	return canonicalConversationId ? {
		chatId: parent,
		thread: parentThread,
		canonicalConversationId
	} : null;
}
//#endregion
export { isNumericTelegramChatId as a, normalizeTelegramOutboundTarget as c, stripTelegramInternalPrefixes as d, hasRejectedTelegramTopic as i, parseTelegramTarget as l, parseTelegramTopicConversation as n, normalizeTelegramChatId as o, TELEGRAM_INVALID_TOPIC_ID_MESSAGE as r, normalizeTelegramLookupTarget as s, buildTelegramConversationId as t, resolveTelegramTargetChatType as u };
