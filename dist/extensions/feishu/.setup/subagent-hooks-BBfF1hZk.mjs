import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { d as stripFeishuProviderPrefix, l as normalizeFeishuTarget, r as parseFeishuConversationId, t as buildFeishuConversationId } from "./conversation-id-H-lUayji.mjs";
import { n as getFeishuThreadBindingManager } from "./thread-bindings-BiL1wGqK.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	handleFeishuSubagentDeliveryTarget: () => handleFeishuSubagentDeliveryTarget,
	handleFeishuSubagentEnded: () => handleFeishuSubagentEnded
});
function resolveFeishuRequesterConversation(params) {
	const manager = getFeishuThreadBindingManager(params.accountId);
	if (!manager) return null;
	const rawTo = params.to?.trim();
	const withoutProviderPrefix = rawTo ? stripFeishuProviderPrefix(rawTo) : "";
	const normalizedTarget = rawTo ? normalizeFeishuTarget(rawTo) : null;
	const threadId = params.threadId != null && params.threadId !== "" ? String(params.threadId).trim() : "";
	const isChatTarget = /^(chat|group|channel):/i.test(withoutProviderPrefix);
	const parsedRequesterTopic = normalizedTarget && threadId && isChatTarget ? parseFeishuConversationId({
		conversationId: buildFeishuConversationId({
			chatId: normalizedTarget,
			scope: "group_topic",
			topicId: threadId
		}),
		parentConversationId: normalizedTarget
	}) : null;
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (requesterSessionKey) {
		const existingBindings = manager.listBySessionKey(requesterSessionKey);
		if (existingBindings.length === 1) {
			const existing = existingBindings.at(0);
			if (existing === void 0) return null;
			return {
				accountId: existing.accountId,
				conversationId: existing.conversationId,
				parentConversationId: existing.parentConversationId
			};
		}
		if (existingBindings.length > 1) {
			if (rawTo && normalizedTarget && !threadId && !isChatTarget) {
				const directMatches = existingBindings.filter((entry) => entry.accountId === manager.accountId && entry.conversationId === normalizedTarget && !entry.parentConversationId);
				if (directMatches.length === 1) {
					const existing = directMatches.at(0);
					if (existing === void 0) return null;
					return {
						accountId: existing.accountId,
						conversationId: existing.conversationId,
						parentConversationId: existing.parentConversationId
					};
				}
				return null;
			}
			if (parsedRequesterTopic) {
				const matchingTopicBindings = existingBindings.filter((entry) => {
					const parsed = parseFeishuConversationId({
						conversationId: entry.conversationId,
						parentConversationId: entry.parentConversationId
					});
					return parsed?.chatId === parsedRequesterTopic.chatId && parsed?.topicId === parsedRequesterTopic.topicId;
				});
				if (matchingTopicBindings.length === 1) {
					const existing = matchingTopicBindings.at(0);
					if (existing === void 0) return null;
					return {
						accountId: existing.accountId,
						conversationId: existing.conversationId,
						parentConversationId: existing.parentConversationId
					};
				}
				return null;
			}
		}
	}
	if (!rawTo) return null;
	if (!normalizedTarget) return null;
	if (threadId) {
		if (!isChatTarget) return null;
		return {
			accountId: manager.accountId,
			conversationId: buildFeishuConversationId({
				chatId: normalizedTarget,
				scope: "group_topic",
				topicId: threadId
			}),
			parentConversationId: normalizedTarget
		};
	}
	if (isChatTarget) return null;
	return {
		accountId: manager.accountId,
		conversationId: normalizedTarget
	};
}
function resolveFeishuDeliveryOrigin(params) {
	const deliveryTo = params.deliveryTo?.trim();
	const deliveryThreadId = params.deliveryThreadId?.trim();
	if (deliveryTo) return {
		channel: "feishu",
		accountId: params.accountId,
		to: deliveryTo,
		...deliveryThreadId ? { threadId: deliveryThreadId } : {}
	};
	const parsed = parseFeishuConversationId({
		conversationId: params.conversationId,
		parentConversationId: params.parentConversationId
	});
	if (parsed?.topicId) return {
		channel: "feishu",
		accountId: params.accountId,
		to: `chat:${params.parentConversationId?.trim() || parsed.chatId}`,
		threadId: parsed.topicId
	};
	return {
		channel: "feishu",
		accountId: params.accountId,
		to: `user:${params.conversationId}`
	};
}
function resolveMatchingChildBinding(params) {
	const manager = getFeishuThreadBindingManager(params.accountId);
	if (!manager) return null;
	const childBindings = manager.listBySessionKey(params.childSessionKey.trim());
	if (childBindings.length === 0) return null;
	const requesterConversation = resolveFeishuRequesterConversation({
		accountId: manager.accountId,
		to: params.requesterOrigin?.to,
		threadId: params.requesterOrigin?.threadId,
		requesterSessionKey: params.requesterSessionKey
	});
	if (requesterConversation) {
		const matched = childBindings.find((entry) => entry.accountId === requesterConversation.accountId && entry.conversationId === requesterConversation.conversationId && normalizeOptionalString(entry.parentConversationId) === normalizeOptionalString(requesterConversation.parentConversationId));
		if (matched) return matched;
	}
	return childBindings.length === 1 ? childBindings[0] : null;
}
function handleFeishuSubagentDeliveryTarget(event) {
	if (!event.expectsCompletionMessage) return;
	if (normalizeOptionalLowercaseString(event.requesterOrigin?.channel) !== "feishu") return;
	const binding = resolveMatchingChildBinding({
		accountId: event.requesterOrigin?.accountId,
		childSessionKey: event.childSessionKey,
		requesterSessionKey: event.requesterSessionKey,
		requesterOrigin: {
			to: event.requesterOrigin?.to,
			threadId: event.requesterOrigin?.threadId
		}
	});
	if (!binding) return;
	return { origin: resolveFeishuDeliveryOrigin({
		conversationId: binding.conversationId,
		parentConversationId: binding.parentConversationId,
		accountId: binding.accountId,
		deliveryTo: binding.deliveryTo,
		deliveryThreadId: binding.deliveryThreadId
	}) };
}
function handleFeishuSubagentEnded(event) {
	getFeishuThreadBindingManager(event.accountId)?.unbindBySessionKey(event.targetSessionKey);
}
//#endregion
export { handleFeishuSubagentEnded as n, subagent_hooks_exports as r, handleFeishuSubagentDeliveryTarget as t };
