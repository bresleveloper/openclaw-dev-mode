import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { n as hasSlackAccountCredentialsFromConfig } from "./account-configured-zcR9TJJN.mjs";
import { DEFAULT_ACCOUNT_ID, createAccountListHelpers, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { mapAllowFromEntries, normalizeChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-helpers";
import { resolveAccountEntry } from "openclaw/plugin-sdk/routing";
import { normalizeChatType } from "openclaw/plugin-sdk/account-core";
//#region extensions/slack/src/account-surface-fields.ts
function buildSlackAccountSurfaceFields(config) {
	return {
		groupPolicy: config.groupPolicy,
		textChunkLimit: config.textChunkLimit,
		mediaMaxMb: config.mediaMaxMb,
		reactionNotifications: config.reactionNotifications,
		reactionAllowlist: config.reactionAllowlist,
		replyToMode: config.replyToMode,
		replyToModeByChatType: config.replyToModeByChatType,
		actions: config.actions,
		slashCommand: config.slashCommand,
		dm: config.dm,
		channels: config.channels
	};
}
//#endregion
//#region extensions/slack/src/token.ts
function formatSlackBotTokenIdentityWarning(params) {
	const userId = params.auth.user_id?.trim();
	const botId = params.auth.bot_id?.trim();
	if (!userId || botId) return;
	const accountId = params.accountId?.trim() || "default";
	return `Slack auth.test identified account "${accountId}" as user ${userId} without bot_id. ${accountId === "default" ? "channels.slack.botToken, channels.slack.accounts.default.botToken, or SLACK_BOT_TOKEN" : `channels.slack.accounts.${accountId}.botToken`} appears to contain a user token; replace it with a Bot User OAuth Token. Until replaced, explicit bot-mention detection is disabled and required-mention channels ignore messages.`;
}
function createSlackTokenResolver(defaultPath) {
	return (raw, path = defaultPath) => normalizeResolvedSecretInputString({
		value: raw,
		path
	});
}
const resolveSlackBotToken = createSlackTokenResolver("channels.slack.botToken");
const resolveSlackAppToken = createSlackTokenResolver("channels.slack.appToken");
const resolveSlackUserToken = createSlackTokenResolver("channels.slack.userToken");
//#endregion
//#region extensions/slack/src/account-reply-mode.ts
function resolveSlackReplyToMode(account, chatType) {
	const normalized = normalizeChatType(chatType ?? void 0);
	if (normalized && account.replyToModeByChatType?.[normalized] !== void 0) return account.replyToModeByChatType[normalized] ?? "off";
	return account.replyToMode ?? "off";
}
//#endregion
//#region extensions/slack/src/accounts.ts
var accounts_exports = /* @__PURE__ */ __exportAll({
	hasImplicitDefaultSlackAccount: () => hasImplicitDefaultSlackAccount,
	listEnabledSlackAccounts: () => listEnabledSlackAccounts,
	listSlackAccountIds: () => listSlackAccountIds,
	mergeSlackAccountConfig: () => mergeSlackAccountConfig,
	resolveDefaultSlackAccountId: () => resolveDefaultSlackAccountId,
	resolveSlackAccount: () => resolveSlackAccount,
	resolveSlackAccountAllowFrom: () => resolveSlackAccountAllowFrom,
	resolveSlackAccountDmPolicy: () => resolveSlackAccountDmPolicy,
	resolveSlackConfigAccessorAccount: () => resolveSlackConfigAccessorAccount,
	resolveSlackOperationToken: () => resolveSlackOperationToken,
	resolveSlackReplyToMode: () => resolveSlackReplyToMode
});
function resolveSlackOperationToken(account, operation) {
	if (account.identity === "user") return normalizeOptionalString(account.userToken);
	const userToken = normalizeOptionalString(account.userToken);
	const botToken = normalizeOptionalString(account.botToken);
	if (operation === "read") return userToken ?? botToken;
	return account.config.userTokenReadOnly === false ? botToken ?? userToken : botToken;
}
function hasImplicitDefaultSlackAccount(cfg) {
	return hasSlackAccountCredentialsFromConfig(cfg.channels?.slack, process.env);
}
const { listAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedSlackAccountConfig } = createAccountListHelpers("slack", {
	nestedObjectKeys: [
		"botLoopProtection",
		"presenceEvents",
		"relay"
	],
	hasImplicitDefaultAccount: hasImplicitDefaultSlackAccount
});
const listSlackAccountIds = listAccountIds;
const resolveDefaultSlackAccountId = resolveDefaultAccountId;
function resolveSlackAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.slack?.accounts, accountId);
}
function mergeSlackStreamingConfig(baseConfig, accountConfig) {
	if (!baseConfig || !accountConfig) return accountConfig ?? baseConfig;
	const merged = {
		...baseConfig,
		...accountConfig
	};
	for (const key of [
		"preview",
		"progress",
		"block"
	]) if (baseConfig[key] || accountConfig[key]) merged[key] = {
		...baseConfig[key],
		...accountConfig[key]
	};
	const baseCoalesce = baseConfig.block?.coalesce;
	const accountCoalesce = accountConfig.block?.coalesce;
	if (merged.block && (baseCoalesce || accountCoalesce)) merged.block.coalesce = {
		...baseCoalesce,
		...accountCoalesce
	};
	return merged;
}
function mergeSlackAccountConfig(cfg, accountId) {
	const accountConfig = resolveSlackAccountConfig(cfg, accountId);
	const merged = resolveMergedSlackAccountConfig(cfg, accountId);
	const streaming = mergeSlackStreamingConfig(cfg.channels?.slack?.streaming, accountConfig?.streaming);
	return streaming !== void 0 ? {
		...merged,
		streaming
	} : merged;
}
function resolveSlackAccountAllowFrom(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const accountConfig = resolveSlackAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.slack;
	const allowFrom = accountConfig?.allowFrom ?? rootConfig?.allowFrom;
	return allowFrom ? mapAllowFromEntries(allowFrom) : void 0;
}
function resolveSlackConfigAccessorAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const config = mergeSlackAccountConfig(params.cfg, accountId);
	return {
		allowFrom: resolveSlackAccountAllowFrom({
			cfg: params.cfg,
			accountId
		}),
		defaultTo: config.defaultTo
	};
}
function resolveSlackAccountDmPolicy(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const accountConfig = resolveSlackAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.slack;
	return normalizeChannelDmPolicy(accountConfig?.dmPolicy ?? rootConfig?.dmPolicy ?? "pairing");
}
function resolveSlackAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const baseEnabled = params.cfg.channels?.slack?.enabled !== false;
	const merged = mergeSlackAccountConfig(params.cfg, accountId);
	const identity = merged.postAs ?? "bot";
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const mode = merged.mode ?? "socket";
	const baseAllowEnv = accountId === DEFAULT_ACCOUNT_ID;
	const botActive = enabled;
	const appActive = enabled && mode === "socket";
	const userActive = enabled;
	const envBot = botActive && baseAllowEnv ? resolveSlackBotToken(process.env.SLACK_BOT_TOKEN) : void 0;
	const envApp = appActive && baseAllowEnv ? resolveSlackAppToken(process.env.SLACK_APP_TOKEN) : void 0;
	const envUser = userActive && baseAllowEnv ? resolveSlackUserToken(process.env.SLACK_USER_TOKEN) : void 0;
	const configBot = botActive ? resolveSlackBotToken(merged.botToken, `channels.slack.accounts.${accountId}.botToken`) : void 0;
	const configApp = appActive ? resolveSlackAppToken(merged.appToken, `channels.slack.accounts.${accountId}.appToken`) : void 0;
	const configUser = userActive ? resolveSlackUserToken(merged.userToken, `channels.slack.accounts.${accountId}.userToken`) : void 0;
	const botToken = configBot ?? envBot;
	const appToken = configApp ?? envApp;
	const userToken = configUser ?? envUser;
	const botTokenSource = configBot ? "config" : envBot ? "env" : "none";
	const appTokenSource = configApp ? "config" : envApp ? "env" : "none";
	const userTokenSource = configUser ? "config" : envUser ? "env" : "none";
	return {
		accountId,
		enabled,
		identity,
		name: normalizeOptionalString(merged.name),
		botToken,
		appToken,
		userToken,
		botTokenSource,
		appTokenSource,
		userTokenSource,
		config: merged,
		...buildSlackAccountSurfaceFields(merged)
	};
}
function listEnabledSlackAccounts(cfg) {
	return listSlackAccountIds(cfg).map((accountId) => resolveSlackAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { mergeSlackAccountConfig as a, resolveSlackAccountAllowFrom as c, resolveSlackOperationToken as d, resolveSlackReplyToMode as f, buildSlackAccountSurfaceFields as g, resolveSlackBotToken as h, listSlackAccountIds as i, resolveSlackAccountDmPolicy as l, resolveSlackAppToken as m, hasImplicitDefaultSlackAccount as n, resolveDefaultSlackAccountId as o, formatSlackBotTokenIdentityWarning as p, listEnabledSlackAccounts as r, resolveSlackAccount as s, accounts_exports as t, resolveSlackConfigAccessorAccount as u };
