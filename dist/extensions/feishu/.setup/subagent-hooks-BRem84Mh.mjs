import { _ as __exportAll } from "./doctor-contract-ItAh0keT.mjs";
import { d as stripFeishuProviderPrefix, l as normalizeFeishuTarget, r as parseFeishuConversationId, t as buildFeishuConversationId } from "./conversation-id-N6q3vKm-.mjs";
import { n as getFeishuThreadBindingManager } from "./thread-bindings-6eyktxK_.mjs";
import { normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/feishu/src/subagent-hooks.ts
var subagent_hooks_exports = /* @__PURE__ */ __exportAll({
	handleFeishuSubagentDeliveryTarget: () => handleFeishuSubagentDeliveryTarget,
	handleFeishuSubagentEnded: () => handleFeishuSubagentEnded
});
function handleFeishuSubagentDeliveryTarget(event) {
	if (!event.expectsCompletionMessage) return;
	if (normalizeOptionalLowercaseString(event.requesterOrigin?.channel) !== "feishu") return;
	const { requesterOrigin, childSessionKey, requesterSessionKey } = event;
	const requesterAccountId = requesterOrigin?.accountId;
	function resolveMatchingChildBinding() {
		const manager = getFeishuThreadBindingManager(requesterAccountId);
		if (!manager) return null;
		const childBindings = manager.listBySessionKey(childSessionKey.trim());
		if (childBindings.length === 0) return null;
		const requesterTo = requesterOrigin?.to;
		const requesterThreadId = requesterOrigin?.threadId;
		const resolveFeishuRequesterConversation = () => {
			const rawTo = requesterTo?.trim();
			const withoutProviderPrefix = rawTo ? stripFeishuProviderPrefix(rawTo) : "";
			const normalizedTarget = rawTo ? normalizeFeishuTarget(rawTo) : null;
			const threadId = requesterThreadId != null && requesterThreadId !== "" ? String(requesterThreadId).trim() : "";
			const isChatTarget = /^(chat|group|channel):/i.test(withoutProviderPrefix);
			const parsedRequesterTopic = normalizedTarget && threadId && isChatTarget ? parseFeishuConversationId({
				conversationId: buildFeishuConversationId({
					chatId: normalizedTarget,
					scope: "group_topic",
					topicId: threadId
				}),
				parentConversationId: normalizedTarget
			}) : null;
			const normalizedRequesterSessionKey = requesterSessionKey?.trim();
			if (normalizedRequesterSessionKey) {
				const existingBindings = manager.listBySessionKey(normalizedRequesterSessionKey);
				if (existingBindings.length === 1) return existingBindings[0];
				if (existingBindings.length > 1) {
					if (rawTo && normalizedTarget && !threadId && !isChatTarget) {
						const directMatches = existingBindings.filter((entry) => entry.conversationId === normalizedTarget && !entry.parentConversationId);
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
		};
		const requesterConversation = resolveFeishuRequesterConversation();
		if (requesterConversation) {
			const matched = childBindings.find((entry) => entry.accountId === requesterConversation.accountId && entry.conversationId === requesterConversation.conversationId && entry.parentConversationId === requesterConversation.parentConversationId);
			if (matched) return matched;
		}
		return childBindings.length === 1 ? childBindings[0] : null;
	}
	const binding = resolveMatchingChildBinding();
	if (!binding) return;
	const deliveryTo = binding.deliveryTo;
	const parsed = deliveryTo ? null : parseFeishuConversationId({
		conversationId: binding.conversationId,
		parentConversationId: binding.parentConversationId
	});
	const threadId = deliveryTo ? binding.deliveryThreadId : parsed?.topicId;
	return { origin: {
		channel: "feishu",
		accountId: binding.accountId,
		to: deliveryTo || (parsed?.topicId ? `chat:${binding.parentConversationId || parsed.chatId}` : `user:${binding.conversationId}`),
		...threadId ? { threadId } : {}
	} };
}
function handleFeishuSubagentEnded(event) {
	getFeishuThreadBindingManager(event.accountId)?.unbindBySessionKey(event.targetSessionKey);
}
export { handleFeishuSubagentEnded as n, subagent_hooks_exports as r, handleFeishuSubagentDeliveryTarget as t };
