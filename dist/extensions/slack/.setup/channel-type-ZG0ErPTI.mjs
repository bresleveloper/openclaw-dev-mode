import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { f as resolveSlackOperationToken, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { T as assertSlackDetachedTargetAllowed } from "./probe-BHqvMbno.mjs";
import { i as createSlackReadClient, o as createSlackTokenCacheKey, p as readLruMapEntry, s as createSlackWebClient } from "./cursor-pages-jVn3Vkfi.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeStringEntriesLower } from "openclaw/plugin-sdk/string-normalization-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
// extensions/slack/src/channel-type.ts
var channel_type_exports = /* @__PURE__ */ __exportAll({
	resolveSlackChannelType: () => resolveSlackChannelType,
	resolveSlackConversationInfo: () => resolveSlackConversationInfo
});
const SLACK_CONVERSATION_INFO_CACHE_MAX_ENTRIES = 1024;
const SLACK_CONVERSATION_INFO_CACHE = /* @__PURE__ */ new Map();
function setCachedSlackConversationInfo(cacheKey, conversationInfo) {
	SLACK_CONVERSATION_INFO_CACHE.delete(cacheKey);
	SLACK_CONVERSATION_INFO_CACHE.set(cacheKey, conversationInfo);
	pruneMapToMaxSize(SLACK_CONVERSATION_INFO_CACHE, SLACK_CONVERSATION_INFO_CACHE_MAX_ENTRIES);
}
function resolveConfiguredSlackConversationInfo(params) {
	if (/^D/i.test(params.channelId)) return { type: "dm" };
	const channelIdLower = normalizeLowercaseStringOrEmpty(params.channelId);
	const groupChannels = normalizeStringEntriesLower(params.account.dm?.groupChannels);
	if (groupChannels.includes(channelIdLower) || groupChannels.includes(`slack:${channelIdLower}`) || groupChannels.includes(`channel:${channelIdLower}`) || groupChannels.includes(`group:${channelIdLower}`) || groupChannels.includes(`mpim:${channelIdLower}`)) return { type: "group" };
	return { type: Object.keys(params.account.channels ?? {}).some((key) => {
		const normalized = normalizeLowercaseStringOrEmpty(key);
		return normalized === channelIdLower || normalized === `channel:${channelIdLower}` || normalized.replace(/^#/, "") === channelIdLower;
	}) ? "channel" : "unknown" };
}
async function resolveSlackConversationInfo(params) {
	const channelId = params.channelId.trim();
	if (!channelId) return { type: "unknown" };
	const account = resolveSlackAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	assertSlackDetachedTargetAllowed(account.accountId, params.teamId);
	const operation = params.operation ?? "read";
	const token = resolveSlackOperationToken(account, operation);
	const userToken = normalizeOptionalString(account.userToken);
	const credentialRole = token ? token === userToken ? "user" : "bot" : "none";
	const credentialFingerprint = token ? createSlackTokenCacheKey(token) : "none";
	const teamId = normalizeLowercaseStringOrEmpty(params.teamId) || "no-team-id";
	const cacheKey = `${account.accountId}:${teamId}:${operation}:${credentialRole}:${credentialFingerprint}:${channelId}`;
	if (!params.requireFreshName) {
		const cached = readLruMapEntry(SLACK_CONVERSATION_INFO_CACHE, cacheKey);
		if (cached) return cached;
	}
	const isNativeImChannel = /^D/i.test(channelId);
	const configuredInfo = resolveConfiguredSlackConversationInfo({
		account,
		channelId
	});
	if (token) try {
		if (isNativeImChannel && operation === "write") {
			const opened = await createSlackWebClient(token, { teamId: params.teamId }, params.assertDirectAdapterHandoff).conversations.open({
				channel: channelId,
				prevent_creation: true,
				return_im: true
			});
			const user = normalizeOptionalString(opened.channel?.user);
			const result = user ? {
				type: "dm",
				user
			} : { type: "dm" };
			if (user) setCachedSlackConversationInfo(cacheKey, result);
			return result;
		}
		const channel = (await createSlackReadClient(token, { teamId: params.teamId }, void 0, params.assertDirectAdapterHandoff).conversations.info({ channel: channelId })).channel;
		const type = channel?.is_im ? "dm" : channel?.is_mpim ? "group" : "channel";
		const name = normalizeOptionalString(channel?.name);
		const user = normalizeOptionalString(channel?.user);
		const result = {
			type,
			...name ? { name } : {},
			...user ? { user } : {}
		};
		setCachedSlackConversationInfo(cacheKey, {
			type,
			...user ? { user } : {}
		});
		return result;
	} catch {
		params.assertDirectAdapterHandoff?.();
		return { type: isNativeImChannel ? "dm" : "unknown" };
	}
	if (!isNativeImChannel) setCachedSlackConversationInfo(cacheKey, configuredInfo);
	return configuredInfo;
}
async function resolveSlackChannelType(params) {
	return (await resolveSlackConversationInfo(params)).type;
}
export { resolveSlackChannelType as n, resolveSlackConversationInfo as r, channel_type_exports as t };
