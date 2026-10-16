import { _ as __exportAll } from "./doctor-contract-DyOo8NvC.mjs";
import { d as stripFeishuProviderPrefix, l as normalizeFeishuTarget, r as parseFeishuConversationId, t as buildFeishuConversationId } from "./conversation-id-C1ofUfU8.mjs";
import { n as getFeishuThreadBindingManager } from "./thread-bindings--wJ9fHq5.mjs";
import { normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/feishu/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	handleFeishuSubagentDeliveryTarget: () => handleFeishuSubagentDeliveryTarget,
	handleFeishuSubagentEnded: () => handleFeishuSubagentEnded
});
function resolveFeishuRequesterConversation(manager, params) {
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
		if (existingBindings.length === 1) return existingBindings[0];
		if (existingBindings.length > 1) {
			if (rawTo && normalizedTarget && !threadId && !isChatTarget) {
				const directMatches = existingBindings.filter((entry) => entry.accountId === manager.accountId && entry.conversationId === normalizedTarget && !entry.parentConversationId);
				if (directMatches.length === 1) return directMatches[0];
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
				if (matchingTopicBindings.length === 1) return matchingTopicBindings[0];
				return null;
			}
		}
	}
	if (!rawTo || !normalizedTarget) return null;
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
	const requesterConversation = resolveFeishuRequesterConversation(manager, {
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
		requesterOrigin: event.requesterOrigin
	});
	if (!binding) return;
	return { origin: resolveFeishuDeliveryOrigin(binding) };
}
function handleFeishuSubagentEnded(event) {
	getFeishuThreadBindingManager(event.accountId)?.unbindBySessionKey(event.targetSessionKey);
}
//#endregion
export { handleFeishuSubagentEnded as n, subagent_hooks_exports as r, handleFeishuSubagentDeliveryTarget as t };
