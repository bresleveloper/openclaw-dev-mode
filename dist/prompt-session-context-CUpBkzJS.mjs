import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as channelRouteTargetsMatchExact } from "./channel-route-Czo5mOSj.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as resolveEffectiveReplyRoute, t as normalizeEffectiveReplyTarget } from "./effective-reply-route-D4lEFMTQ.mjs";
import { t as extractExplicitGroupId } from "./group-id-BfVOxJcE.mjs";
//#region src/auto-reply/reply/prompt-session-context.ts
function normalizePromptRouteChannel(raw) {
	const normalized = normalizeOptionalString(raw);
	return normalized && normalized !== "none" ? normalized : void 0;
}
function resolvePersistedPromptProvider(entry) {
	return normalizePromptRouteChannel(sessionDeliveryChannel(entry));
}
function resolvePersistedPromptSurface(entry) {
	return normalizePromptRouteChannel(sessionDeliveryOrigin(entry)?.surface) ?? resolvePersistedPromptProvider(entry);
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
	const currentChannel = normalizeMessageChannel(groupResolution?.channel ?? ctx.OriginatingChannel);
	const currentTo = normalizeEffectiveReplyTarget(groupResolution?.id ?? ctx.OriginatingTo, currentChannel, ctx.MessageThreadId);
	const hasCurrentRoute = Boolean(groupResolution || ctx.OriginatingChannel || ctx.OriginatingTo);
	const conversationEntry = !isSystemEvent || !hasCurrentRoute || Boolean(currentChannel && currentTo && channelRouteTargetsMatchExact({
		left: {
			channel: currentChannel,
			to: currentTo,
			accountId: ctx.AccountId,
			threadId: ctx.MessageThreadId
		},
		right: {
			channel: normalizeMessageChannel(persisted?.channel),
			to: normalizeEffectiveReplyTarget(persisted?.to, normalizeMessageChannel(persisted?.channel), persisted?.threadId),
			accountId: persisted?.accountId,
			threadId: persisted?.threadId
		}
	})) ? sessionEntry : void 0;
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
		fields.Provider = normalizePromptRouteChannel(ctx.Provider) ?? normalizePromptRouteChannel(ctx.OriginatingChannel) ?? resolvePersistedPromptProvider(inherited);
		fields.Surface = normalizePromptRouteChannel(ctx.Surface) ?? normalizePromptRouteChannel(ctx.OriginatingChannel) ?? resolvePersistedPromptSurface(inherited);
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
export { prepareReplyConversation as t };
