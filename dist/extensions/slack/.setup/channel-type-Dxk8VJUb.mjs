import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { o as resolveSlackAccount, u as resolveSlackOperationToken } from "./accounts-BBHvg0pY.mjs";
import { f as assertSlackDetachedTargetAllowed } from "./session-status-Cf7AvWOt.mjs";
import { T as normalizeAllowListLower, p as createSlackWebClient, u as createSlackReadClient } from "./probe-DiYIMPJo.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
//#region extensions/slack/src/channel-type.ts
var channel_type_exports = /* @__PURE__ */ __exportAll({
	resolveSlackChannelType: () => resolveSlackChannelType,
	resolveSlackConversationInfo: () => resolveSlackConversationInfo
});
const SLACK_CONVERSATION_INFO_CACHE_MAX_ENTRIES = 1024;
const SLACK_CONVERSATION_INFO_CACHE = /* @__PURE__ */ new Map();
function getCachedSlackConversationInfo(cacheKey) {
	const cached = SLACK_CONVERSATION_INFO_CACHE.get(cacheKey);
	if (cached) {
		SLACK_CONVERSATION_INFO_CACHE.delete(cacheKey);
		SLACK_CONVERSATION_INFO_CACHE.set(cacheKey, cached);
	}
	return cached;
}
function setCachedSlackConversationInfo(cacheKey, conversationInfo) {
	SLACK_CONVERSATION_INFO_CACHE.delete(cacheKey);
	SLACK_CONVERSATION_INFO_CACHE.set(cacheKey, conversationInfo);
	pruneMapToMaxSize(SLACK_CONVERSATION_INFO_CACHE, SLACK_CONVERSATION_INFO_CACHE_MAX_ENTRIES);
}
function fingerprintSlackCredential(token) {
	return createHash("sha256").update(token).digest("hex");
}
function resolveConfiguredSlackConversationInfo(params) {
	if (/^D/i.test(params.channelId)) return { type: "dm" };
	const channelIdLower = normalizeLowercaseStringOrEmpty(params.channelId);
	const groupChannels = normalizeAllowListLower(params.account.dm?.groupChannels);
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
	const credentialFingerprint = token ? fingerprintSlackCredential(token) : "none";
	const teamId = normalizeLowercaseStringOrEmpty(params.teamId) || "no-team-id";
	const cacheKey = `${account.accountId}:${teamId}:${operation}:${credentialRole}:${credentialFingerprint}:${channelId}`;
	if (!params.requireFreshName) {
		const cached = getCachedSlackConversationInfo(cacheKey);
		if (cached) return cached;
	}
	const isNativeImChannel = /^D/i.test(channelId);
	const configuredInfo = resolveConfiguredSlackConversationInfo({
		account,
		channelId
	});
	if (token) try {
		if (isNativeImChannel && operation === "write") {
			const opened = await (params.assertDirectAdapterHandoff ? createSlackWebClient(token, { teamId: params.teamId }, params.assertDirectAdapterHandoff) : createSlackWebClient(token, { teamId: params.teamId })).conversations.open({
				channel: channelId,
				prevent_creation: true,
				return_im: true
			});
			const user = typeof opened.channel?.user === "string" && opened.channel.user.trim() ? opened.channel.user.trim() : void 0;
			const result = user ? {
				type: "dm",
				user
			} : { type: "dm" };
			if (user) setCachedSlackConversationInfo(cacheKey, result);
			return result;
		}
		const channel = (await (params.assertDirectAdapterHandoff ? createSlackReadClient(token, { teamId: params.teamId }, void 0, params.assertDirectAdapterHandoff) : createSlackReadClient(token, { teamId: params.teamId })).conversations.info({ channel: channelId })).channel;
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
	const result = configuredInfo;
	if (!isNativeImChannel) setCachedSlackConversationInfo(cacheKey, result);
	return result;
}
async function resolveSlackChannelType(params) {
	return (await resolveSlackConversationInfo(params)).type;
}
//#endregion
export { resolveSlackChannelType as n, resolveSlackConversationInfo as r, channel_type_exports as t };
