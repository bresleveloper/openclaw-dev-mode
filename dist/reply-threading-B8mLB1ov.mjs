import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import { D as setReplyPayloadMetadata, _ as isReplyPayloadStatusNotice, o as copyReplyPayloadMetadata } from "./reply-payload-BLX_BF2U.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { n as isSingleUseReplyToMode } from "./reply-reference-CLjC4hNl.mjs";
import { t as getLoadedChannelThreadingAdapter } from "./thread-addressing-BRMhsBnD.mjs";
//#region src/auto-reply/reply/reply-threading.ts
function resolveConfiguredReplyToMode(cfg, provider, chatType, accountId) {
	if (!provider) return "all";
	const channelConfig = cfg.channels?.[provider];
	const accountConfig = accountId ? resolveChannelAccountEntry(channelConfig?.accounts, normalizeAccountId(accountId), provider, normalizeAccountId) : void 0;
	if (chatType === "direct" || chatType === "group" || chatType === "channel") return accountConfig?.replyToModeByChatType?.[chatType] ?? accountConfig?.replyToMode ?? channelConfig?.replyToModeByChatType?.[chatType] ?? channelConfig?.replyToMode ?? "all";
	return accountConfig?.replyToMode ?? channelConfig?.replyToMode ?? "all";
}
function resolveReplyToMode(cfg, channel, accountId, chatType) {
	const normalizedAccountId = normalizeOptionalLowercaseString(accountId);
	const provider = normalizeAnyChannelId(channel) ?? normalizeOptionalLowercaseString(channel);
	return (normalizedAccountId && provider ? getChannelPlugin(provider)?.threading : void 0)?.resolveReplyToMode?.({
		cfg,
		accountId: normalizedAccountId,
		chatType
	}) ?? resolveConfiguredReplyToMode(cfg, provider, chatType, normalizedAccountId);
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
function createReplyDeliveryContext(replyToMode, chatType) {
	const normalizedChatType = normalizeChatType(chatType ?? void 0);
	return {
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		replyToMode
	};
}
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
			if (hasThreaded) return setReplyPayloadMetadata(copyReplyPayloadMetadata(payload, {
				...payload,
				replyToId: void 0,
				replyToCurrent: false,
				replyToTag: false
			}), { replyTargetSuppressed: true });
			if (!preview) hasThreaded = true;
		}
		return payload;
	};
	return Object.assign((payload) => apply(payload), { preview: (payload) => apply(payload, true) });
}
function resolveImplicitCurrentMessageReplyAllowance(mode, policy) {
	const implicitCurrentMessage = policy?.implicitCurrentMessage ?? "default";
	return implicitCurrentMessage === "allow" || implicitCurrentMessage !== "deny" && mode !== "batched";
}
function resolveBatchedReplyThreadingPolicy(mode, isBatched) {
	if (mode !== "batched") return;
	return { implicitCurrentMessage: isBatched ? "allow" : "deny" };
}
//#endregion
export { resolveReplyDeliveryAccountId as a, resolveImplicitCurrentMessageReplyAllowance as i, createReplyToModeFilterForChannel as n, resolveReplyToMode as o, resolveBatchedReplyThreadingPolicy as r, createReplyDeliveryContext as t };
