import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/targets.ts
const CHAT_ID_PREFIX = "oc_";
const OPEN_ID_PREFIX = "ou_";
const USER_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
function stripFeishuProviderPrefix(raw) {
	return raw.replace(/^(feishu|lark):/i, "").trim();
}
function detectIdType(id) {
	const trimmed = id.trim();
	if (trimmed.startsWith(CHAT_ID_PREFIX)) return "chat_id";
	if (trimmed.startsWith(OPEN_ID_PREFIX)) return "open_id";
	if (USER_ID_REGEX.test(trimmed)) return "user_id";
	return null;
}
function normalizeFeishuTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const withoutProvider = stripFeishuProviderPrefix(trimmed);
	const lowered = normalizeLowercaseStringOrEmpty(withoutProvider);
	if (lowered.startsWith("chat:")) return withoutProvider.slice(5).trim() || null;
	if (lowered.startsWith("group:")) return withoutProvider.slice(6).trim() || null;
	if (lowered.startsWith("channel:")) return withoutProvider.slice(8).trim() || null;
	if (lowered.startsWith("user:")) return withoutProvider.slice(5).trim() || null;
	if (lowered.startsWith("dm:")) return withoutProvider.slice(3).trim() || null;
	if (lowered.startsWith("open_id:")) return withoutProvider.slice(8).trim() || null;
	return withoutProvider;
}
function resolveReceiveIdType(id) {
	const trimmed = id.trim();
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered.startsWith("chat:") || lowered.startsWith("group:") || lowered.startsWith("channel:")) return "chat_id";
	if (lowered.startsWith("open_id:")) return "open_id";
	if (lowered.startsWith("user:") || lowered.startsWith("dm:")) return trimmed.replace(/^(user|dm):/i, "").trim().startsWith(OPEN_ID_PREFIX) ? "open_id" : "user_id";
	if (trimmed.startsWith(CHAT_ID_PREFIX)) return "chat_id";
	if (trimmed.startsWith(OPEN_ID_PREFIX)) return "open_id";
	return "user_id";
}
function looksLikeFeishuId(raw) {
	const trimmed = stripFeishuProviderPrefix(raw.trim());
	if (!trimmed) return false;
	if (/^(chat|group|channel|user|dm|open_id):/i.test(trimmed)) return true;
	if (trimmed.startsWith(CHAT_ID_PREFIX)) return true;
	if (trimmed.startsWith(OPEN_ID_PREFIX)) return true;
	return false;
}
//#endregion
//#region extensions/feishu/src/conversation-id.ts
function resolveConfiguredFeishuGroupSessionScope(params) {
	const legacyTopicSessionMode = params.groupConfig?.topicSessionMode ?? params.feishuCfg?.topicSessionMode ?? "disabled";
	return params.groupConfig?.groupSessionScope ?? params.feishuCfg?.groupSessionScope ?? (legacyTopicSessionMode === "enabled" ? "group_topic" : "group");
}
function buildFeishuConversationId(params) {
	const chatId = normalizeOptionalString(params.chatId) ?? "unknown";
	const senderOpenId = normalizeOptionalString(params.senderOpenId);
	const topicId = normalizeOptionalString(params.topicId);
	switch (params.scope) {
		case "group_sender": return senderOpenId ? `${chatId}:sender:${senderOpenId}` : chatId;
		case "group_topic": return topicId ? `${chatId}:topic:${topicId}` : chatId;
		case "group_topic_sender":
			if (topicId && senderOpenId) return `${chatId}:topic:${topicId}:sender:${senderOpenId}`;
			if (topicId) return `${chatId}:topic:${topicId}`;
			return senderOpenId ? `${chatId}:sender:${senderOpenId}` : chatId;
		default: return chatId;
	}
}
function parseFeishuTargetId(raw) {
	const target = normalizeOptionalString(raw);
	if (!target) return;
	return normalizeFeishuTarget(target) || void 0;
}
function parseFeishuDirectConversationId(raw) {
	const target = normalizeOptionalString(raw);
	if (!target) return;
	const withoutProvider = stripFeishuProviderPrefix(target);
	if (!withoutProvider) return;
	const lowered = normalizeLowercaseStringOrEmpty(withoutProvider);
	for (const prefix of [
		"user:",
		"dm:",
		"open_id:"
	]) if (lowered.startsWith(prefix)) return normalizeOptionalString(withoutProvider.slice(prefix.length));
	const id = parseFeishuTargetId(target);
	if (!id) return;
	if (id.startsWith("ou_") || id.startsWith("on_")) return id;
}
function parseFeishuConversationId(params) {
	const conversationId = normalizeOptionalString(params.conversationId);
	const parentConversationId = normalizeOptionalString(params.parentConversationId);
	if (!conversationId) return null;
	const topicSenderMatch = conversationId.match(/^(.+):topic:([^:]+):sender:([^:]+)$/i);
	if (topicSenderMatch) {
		const [, chatId, topicId, senderOpenId] = topicSenderMatch;
		if (chatId === void 0 || topicId === void 0 || senderOpenId === void 0) return null;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_topic_sender",
				topicId,
				senderOpenId
			}),
			chatId,
			topicId,
			senderOpenId,
			scope: "group_topic_sender"
		};
	}
	const topicMatch = conversationId.match(/^(.+):topic:([^:]+)$/i);
	if (topicMatch) {
		const [, chatId, topicId] = topicMatch;
		if (chatId === void 0 || topicId === void 0) return null;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_topic",
				topicId
			}),
			chatId,
			topicId,
			scope: "group_topic"
		};
	}
	const senderMatch = conversationId.match(/^(.+):sender:([^:]+)$/i);
	if (senderMatch) {
		const [, chatId, senderOpenId] = senderMatch;
		if (chatId === void 0 || senderOpenId === void 0) return null;
		return {
			canonicalConversationId: buildFeishuConversationId({
				chatId,
				scope: "group_sender",
				senderOpenId
			}),
			chatId,
			senderOpenId,
			scope: "group_sender"
		};
	}
	if (parentConversationId) return {
		canonicalConversationId: buildFeishuConversationId({
			chatId: parentConversationId,
			scope: "group_topic",
			topicId: conversationId
		}),
		chatId: parentConversationId,
		topicId: conversationId,
		scope: "group_topic"
	};
	return {
		canonicalConversationId: conversationId,
		chatId: conversationId,
		scope: "group"
	};
}
function buildFeishuModelOverrideParentCandidates(parentConversationId) {
	const rawId = normalizeOptionalString(parentConversationId);
	if (!rawId) return [];
	const topicSenderMatch = rawId.match(/^(.+):topic:([^:]+):sender:([^:]+)$/i);
	if (topicSenderMatch) {
		const chatId = normalizeLowercaseStringOrEmpty(topicSenderMatch[1]);
		const topicId = normalizeLowercaseStringOrEmpty(topicSenderMatch[2]);
		if (chatId && topicId) return [`${chatId}:topic:${topicId}`, chatId];
		return [];
	}
	const topicMatch = rawId.match(/^(.+):topic:([^:]+)$/i);
	if (topicMatch) {
		const chatId = normalizeLowercaseStringOrEmpty(topicMatch[1]);
		return chatId ? [chatId] : [];
	}
	const senderMatch = rawId.match(/^(.+):sender:([^:]+)$/i);
	if (senderMatch) {
		const chatId = normalizeLowercaseStringOrEmpty(senderMatch[1]);
		return chatId ? [chatId] : [];
	}
	return [];
}
//#endregion
export { parseFeishuTargetId as a, looksLikeFeishuId as c, stripFeishuProviderPrefix as d, parseFeishuDirectConversationId as i, normalizeFeishuTarget as l, buildFeishuModelOverrideParentCandidates as n, resolveConfiguredFeishuGroupSessionScope as o, parseFeishuConversationId as r, detectIdType as s, buildFeishuConversationId as t, resolveReceiveIdType as u };
