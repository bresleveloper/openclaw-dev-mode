import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import "./registry-B3Y-vjit.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-BvpWSO2L.mjs";
import { t as normalizeChatType } from "./chat-type-D-T98NfH.mjs";
import { E as setReplyPayloadMetadata, g as isReplyPayloadStatusNotice, o as copyReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { t as getChannelPlugin } from "./registry-DOE8N7Jo.mjs";
import "./plugins-Z9_SzFi0.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-DZm_0i8_.mjs";
import { t as getLoadedChannelThreadingAdapter } from "./thread-addressing-BlOSfiVQ.mjs";
//#region src/auto-reply/reply/reply-threading.ts
/** Reply threading policy helpers for channel replies and status notices. */
function normalizeReplyToModeChatType(chatType) {
	return chatType === "direct" || chatType === "group" || chatType === "channel" ? chatType : void 0;
}
/** Resolve configured reply-to mode from channel and chat-type config. */
function resolveConfiguredReplyToMode(cfg, channel, chatType, accountId) {
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	if (!provider) return "all";
	const channelConfig = cfg.channels?.[provider];
	const normalizedAccountId = accountId?.trim();
	const accountConfig = normalizedAccountId ? resolveChannelAccountEntry(channelConfig?.accounts, normalizeAccountId(normalizedAccountId), provider, normalizeAccountId) : void 0;
	const normalizedChatType = normalizeReplyToModeChatType(chatType);
	if (normalizedChatType) return accountConfig?.replyToModeByChatType?.[normalizedChatType] ?? accountConfig?.replyToMode ?? channelConfig?.replyToModeByChatType?.[normalizedChatType] ?? channelConfig?.replyToMode ?? "all";
	return accountConfig?.replyToMode ?? channelConfig?.replyToMode ?? "all";
}
/** Resolve effective reply-to mode for a channel/account/chat tuple. */
function resolveReplyToMode(cfg, channel, accountId, chatType) {
	const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
	if (!normalizedAccountId) return resolveConfiguredReplyToMode(cfg, channel, chatType);
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	return (provider ? getChannelPlugin(provider)?.threading : void 0)?.resolveReplyToMode?.({
		cfg,
		accountId: normalizedAccountId,
		chatType
	}) ?? resolveConfiguredReplyToMode(cfg, channel, chatType, normalizedAccountId);
}
/** Resolve the account that routed reply delivery will use when none is explicit. */
function resolveReplyDeliveryAccountId(cfg, channel, accountId) {
	const explicitAccountId = normalizeOptionalLowercaseString(accountId);
	if (explicitAccountId) return explicitAccountId;
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	if (!provider) return;
	const plugin = getChannelPlugin(provider);
	if (!plugin) return;
	const configuredDefault = normalizeOptionalLowercaseString(plugin.config.defaultAccountId?.(cfg));
	if (configuredDefault) return configuredDefault;
	const channelConfiguredDefault = normalizeOptionalLowercaseString(cfg.channels?.[provider]?.defaultAccount);
	if (channelConfiguredDefault) return channelConfiguredDefault;
	return plugin.config.listAccountIds(cfg).map((listedAccountId) => normalizeOptionalLowercaseString(listedAccountId)).find((listedAccountId) => Boolean(listedAccountId)) ?? "default";
}
/** Build the canonical reply policy context consumed by delivery adapters. */
function createReplyDeliveryContext(replyToMode, chatType) {
	const normalizedChatType = normalizeChatType(chatType ?? void 0);
	return {
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		replyToMode
	};
}
function suppressReplyTarget(payload) {
	return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: void 0,
		replyToCurrent: false,
		replyToTag: false
	}), { replyTargetSuppressed: true });
}
/** Create a reply-to filter using channel-specific explicit-tag defaults. */
function createReplyToModeFilterForChannel(mode, channel) {
	const normalized = normalizeOptionalLowercaseString(channel);
	const adapter = getLoadedChannelThreadingAdapter(normalized);
	const allowExplicitReplyTagsWhenOff = adapter?.allowExplicitReplyTagsWhenOff ?? adapter?.allowTagsWhenOff ?? Boolean(normalized);
	let hasThreaded = false;
	const apply = (payload, preview = false) => {
		const isStatusNotice = isReplyPayloadStatusNotice(payload);
		if (!payload.replyToId) return payload;
		if (mode === "off") {
			const isExplicit = Boolean(payload.replyToTag) || Boolean(payload.replyToCurrent);
			if (allowExplicitReplyTagsWhenOff && isExplicit && !isStatusNotice) return payload;
			return copyReplyPayloadMetadata(payload, {
				...payload,
				replyToId: void 0,
				replyToCurrent: payload.replyToCurrent === true ? false : payload.replyToCurrent
			});
		}
		if (mode === "all") return payload;
		if (isSingleUseReplyToMode(mode) && !isStatusNotice) {
			if (hasThreaded) return suppressReplyTarget(payload);
			if (!preview) hasThreaded = true;
		}
		return payload;
	};
	return Object.assign((payload) => apply(payload), { preview: (payload) => apply(payload, true) });
}
/** Resolve whether implicit current-message replies are allowed under threading policy. */
function resolveImplicitCurrentMessageReplyAllowance(mode, policy) {
	const implicitCurrentMessage = policy?.implicitCurrentMessage ?? "default";
	return implicitCurrentMessage === "allow" || implicitCurrentMessage !== "deny" && mode !== "batched";
}
/** Build threading policy for batched reply-to mode. */
function resolveBatchedReplyThreadingPolicy(mode, isBatched) {
	if (mode !== "batched") return;
	return { implicitCurrentMessage: isBatched ? "allow" : "deny" };
}
//#endregion
export { resolveReplyDeliveryAccountId as a, resolveImplicitCurrentMessageReplyAllowance as i, createReplyToModeFilterForChannel as n, resolveReplyToMode as o, resolveBatchedReplyThreadingPolicy as r, createReplyDeliveryContext as t };
