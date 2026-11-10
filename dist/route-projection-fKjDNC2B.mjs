import { u as normalizeOptionalStringifiedId } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
//#region src/utils/conversation-target.ts
function normalizeConversationTargetParams(params) {
	return {
		channel: typeof params.channel === "string" ? normalizeMessageChannel(params.channel) ?? params.channel.trim() : void 0,
		conversationId: normalizeOptionalStringifiedId(params.conversationId),
		parentConversationId: normalizeOptionalStringifiedId(params.parentConversationId)
	};
}
//#endregion
//#region src/channels/route-projection.ts
function resolveConversationDeliveryTarget({ channel, conversationId, parentConversationId }) {
	if (!channel || !conversationId) return;
	return getChannelPlugin(normalizeAnyChannelId(channel) ?? channel)?.messaging?.resolveDeliveryTarget?.({
		conversationId,
		parentConversationId
	}) ?? { to: `channel:${conversationId}` };
}
/** Formats a conversation id into a target, including a fallback for thread-only hook results. */
function formatConversationTarget(params) {
	const normalized = normalizeConversationTargetParams(params);
	return resolveConversationDeliveryTarget(normalized)?.to?.trim() || (normalized.channel && normalized.conversationId ? `channel:${normalized.conversationId}` : void 0);
}
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
