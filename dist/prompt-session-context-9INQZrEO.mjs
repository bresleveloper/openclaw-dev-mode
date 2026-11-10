import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { i as channelRouteTargetsMatchExact } from "./channel-route-2bD3dZs2.mjs";
import { c as resolveEffectiveReplyRoute, s as normalizeEffectiveReplyTarget } from "./session-event-handoff-BLWR3ywE.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as extractExplicitGroupId } from "./group-id-DQ0Qewqt.mjs";
//#region src/auto-reply/reply/prompt-session-context.ts
function normalizePromptRouteChannel(raw) {
	const normalized = normalizeOptionalString(raw);
	return normalized && normalized !== "none" ? normalized : void 0;
}
/** Whether an explicit route names the stored conversation, before inheritance fills coordinates. */
function isStoredConversationRoute(params) {
	const channel = normalizeMessageChannel(params.channel);
	const to = normalizeEffectiveReplyTarget(params.to, channel, params.threadId);
	const persisted = deliveryContextFromSession(params.entry);
	const persistedChannel = normalizeMessageChannel(persisted?.channel);
	return Boolean(channel && to && channelRouteTargetsMatchExact({
		left: {
			channel,
			to,
			accountId: params.accountId,
			threadId: params.threadId
		},
		right: {
			channel: persistedChannel,
			to: normalizeEffectiveReplyTarget(persisted?.to, persistedChannel, persisted?.threadId),
			accountId: persisted?.accountId,
			threadId: persisted?.threadId
		}
	}));
}
/** Prepares descriptive conversation facts without borrowing execution or sender authority. */
function prepareReplyConversation(params) {
	const { ctx, sessionEntry, groupResolution } = params;
	const isSystemEvent = params.isHeartbeat === true || ctx.InternalTurnSource !== void 0;
	const route = isSystemEvent ? resolveEffectiveReplyRoute({
		ctx,
		entry: sessionEntry
	}) : void 0;
	const persisted = deliveryContextFromSession(sessionEntry);
	const hasCurrentRoute = Boolean(groupResolution || ctx.OriginatingChannel || ctx.OriginatingTo);
	const conversationEntry = !isSystemEvent || !hasCurrentRoute || isStoredConversationRoute({
		channel: groupResolution?.channel ?? ctx.OriginatingChannel,
		to: groupResolution?.id ?? ctx.OriginatingTo,
		accountId: ctx.AccountId,
		threadId: ctx.MessageThreadId,
		entry: sessionEntry
	}) ? sessionEntry : void 0;
	const inherited = isSystemEvent ? conversationEntry : void 0;
	const origin = sessionDeliveryOrigin(inherited);
	const chatType = normalizeChatType(ctx.ChatType) ?? groupResolution?.chatType ?? normalizeChatType(inherited?.chatType) ?? normalizeChatType(origin?.chatType);
	const isSharedChat = chatType === "group" || chatType === "channel";
	const fields = {
		Provider: ctx.Provider,
		Surface: ctx.Surface,
		ChatType: ctx.ChatType,
		OriginatingChannel: ctx.OriginatingChannel,
		OriginatingTo: ctx.OriginatingTo,
		AccountId: ctx.AccountId,
		MessageThreadId: ctx.MessageThreadId,
		GroupSubject: ctx.GroupSubject,
		GroupChannel: ctx.GroupChannel,
		GroupSpace: ctx.GroupSpace
	};
	if (isSystemEvent) {
		const persistedProvider = normalizePromptRouteChannel(sessionDeliveryChannel(inherited));
		const originatingChannel = normalizePromptRouteChannel(ctx.OriginatingChannel);
		fields.Provider = normalizePromptRouteChannel(ctx.Provider) ?? originatingChannel ?? persistedProvider;
		fields.Surface = normalizePromptRouteChannel(ctx.Surface) ?? originatingChannel ?? normalizePromptRouteChannel(origin?.surface) ?? persistedProvider;
		fields.ChatType = chatType;
		fields.OriginatingChannel ??= inherited ? route?.channel ?? persisted?.channel : void 0;
		fields.OriginatingTo ??= inherited ? route?.to ?? persisted?.to : void 0;
		fields.AccountId ??= inherited ? route?.accountId ?? persisted?.accountId : void 0;
		fields.MessageThreadId ??= inherited ? persisted?.threadId ?? origin?.threadId : void 0;
		fields.GroupSubject = normalizeOptionalString(ctx.GroupSubject) ?? (isSharedChat ? normalizeOptionalString(inherited?.subject) : void 0);
		fields.GroupChannel = normalizeOptionalString(ctx.GroupChannel) ?? (isSharedChat ? normalizeOptionalString(inherited?.groupChannel) : void 0);
		fields.GroupSpace = normalizeOptionalString(ctx.GroupSpace) ?? (isSharedChat ? normalizeOptionalString(inherited?.space) : void 0);
	}
	const channel = groupResolution?.channel ?? (isSystemEvent ? fields.OriginatingChannel : void 0) ?? fields.Provider;
	const rawGroupId = normalizeOptionalString(ctx.From);
	return {
		fields,
		group: {
			channel,
			groupId: isSystemEvent ? normalizeEffectiveReplyTarget(inherited?.groupId ?? groupResolution?.id ?? fields.OriginatingTo, normalizeMessageChannel(channel), fields.MessageThreadId) : groupResolution?.id ?? extractExplicitGroupId(rawGroupId) ?? rawGroupId,
			groupChannel: normalizeOptionalString(fields.GroupChannel) ?? normalizeOptionalString(fields.GroupSubject),
			groupSpace: normalizeOptionalString(fields.GroupSpace),
			accountId: fields.AccountId
		},
		activation: conversationEntry?.groupActivation
	};
}
//#endregion
export { prepareReplyConversation as n, isStoredConversationRoute as t };
