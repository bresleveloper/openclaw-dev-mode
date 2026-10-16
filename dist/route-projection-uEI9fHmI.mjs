import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
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
