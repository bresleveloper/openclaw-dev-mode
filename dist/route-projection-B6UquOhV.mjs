import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { i as normalizeChannelId, t as getChannelPlugin } from "./registry-D3wOWFDo.mjs";
//#region src/utils/conversation-target.ts
function normalizeConversationId(value) {
	return typeof value === "number" && Number.isFinite(value) ? String(Math.trunc(value)) : typeof value === "string" ? normalizeOptionalString(value) : void 0;
}
function normalizeConversationTargetParams(params) {
	return {
		channel: typeof params.channel === "string" ? normalizeMessageChannel(params.channel) ?? params.channel.trim() : void 0,
		conversationId: normalizeConversationId(params.conversationId),
		parentConversationId: normalizeConversationId(params.parentConversationId)
	};
}
//#endregion
//#region src/channels/route-projection.ts
function resolveConversationDeliveryTarget({ channel, conversationId, parentConversationId }) {
	if (!channel || !conversationId) return;
	return getChannelPlugin(normalizeChannelId(channel) ?? channel)?.messaging?.resolveDeliveryTarget?.({
		conversationId,
		parentConversationId
	}) ?? { to: `channel:${conversationId}` };
}
/** Formats a conversation id into a target, including a fallback for thread-only hook results. */
function formatConversationTarget(params) {
	const normalized = normalizeConversationTargetParams(params);
	return resolveConversationDeliveryTarget(normalized)?.to?.trim() || (normalized.channel && normalized.conversationId ? `channel:${normalized.conversationId}` : void 0);
}
/** Resolves a persisted conversation reference directly into normalized delivery fields. */
function deliveryContextFromConversation(conversation) {
	if (!conversation) return;
	const target = resolveConversationDeliveryTarget(normalizeConversationTargetParams(conversation));
	return normalizeDeliveryContext({
		channel: conversation.channel,
		accountId: conversation.accountId,
		to: target?.to,
		threadId: target?.threadId
	});
}
//#endregion
export { formatConversationTarget as n, deliveryContextFromConversation as t };
