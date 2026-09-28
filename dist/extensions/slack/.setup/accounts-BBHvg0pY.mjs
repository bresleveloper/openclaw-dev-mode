import { t as hasSlackAccountCredentials } from "./account-configured-sUohAxZr.mjs";
import { DEFAULT_ACCOUNT_ID, createAccountListHelpers, hasConfiguredAccountValue, normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { mapAllowFromEntries, normalizeChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-helpers";
import { resolveAccountEntry } from "openclaw/plugin-sdk/routing";
//#region extensions/slack/src/token.ts
function formatSlackBotTokenIdentityWarning(params) {
	const userId = params.auth.user_id?.trim();
	const botId = params.auth.bot_id?.trim();
	if (!userId || botId) return;
	const accountId = params.accountId?.trim() || "default";
	return `Slack auth.test identified account "${accountId}" as user ${userId} without bot_id. ${accountId === "default" ? "channels.slack.botToken, channels.slack.accounts.default.botToken, or SLACK_BOT_TOKEN" : `channels.slack.accounts.${accountId}.botToken`} appears to contain a user token; replace it with a Bot User OAuth Token. Until replaced, explicit bot-mention detection is disabled and required-mention channels fail closed.`;
}
function resolveSlackBotToken(raw, path = "channels.slack.botToken") {
	return normalizeResolvedSecretInputString({
		value: raw,
		path
	});
}
function resolveSlackAppToken(raw, path = "channels.slack.appToken") {
	return normalizeResolvedSecretInputString({
		value: raw,
		path
	});
}
function resolveSlackUserToken(raw, path = "channels.slack.userToken") {
	return normalizeResolvedSecretInputString({
		value: raw,
		path
	});
}
//#endregion
//#region extensions/slack/src/accounts.ts
function resolveSlackOperationToken(account, operation) {
	if (account.identity === "user") return normalizeOptionalString(account.userToken);
	const userToken = normalizeOptionalString(account.userToken);
	const botToken = normalizeOptionalString(account.botToken);
	if (operation === "read") return userToken ?? botToken;
	return account.config.userTokenReadOnly === false ? botToken ?? userToken : botToken;
}
function hasImplicitDefaultSlackAccount(cfg) {
	const slack = cfg.channels?.slack;
	const userIdentity = slack?.postAs === "user";
	return hasSlackAccountCredentials({
		config: slack ?? {},
		identityTokenConfigured: hasConfiguredAccountValue(userIdentity ? slack?.userToken : slack?.botToken) || hasConfiguredAccountValue(userIdentity ? process.env.SLACK_USER_TOKEN : process.env.SLACK_BOT_TOKEN),
		appTokenConfigured: hasConfiguredAccountValue(slack?.appToken) || hasConfiguredAccountValue(process.env.SLACK_APP_TOKEN)
	});
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
function asStreamingConfigObject(value) {
	return asOptionalRecord(value);
}
function asLegacyStreamingScalar(value) {
	return typeof value === "boolean" || typeof value === "string" ? value : void 0;
}
function mergeSlackStreamingConfig(base, account) {
	const accountObject = asStreamingConfigObject(account);
	if (account !== void 0 && !accountObject) return asLegacyStreamingScalar(account);
	const baseObject = asStreamingConfigObject(base);
	if (base !== void 0 && !baseObject) return accountObject ?? asLegacyStreamingScalar(base);
	const baseConfig = baseObject;
	const accountConfig = accountObject;
	if (!baseConfig || !accountConfig) return accountConfig ?? baseConfig;
	return {
		...baseConfig,
		...accountConfig,
		...baseConfig.preview || accountConfig.preview ? { preview: {
			...baseConfig.preview,
			...accountConfig.preview
		} } : {},
		...baseConfig.progress || accountConfig.progress ? { progress: {
			...baseConfig.progress,
			...accountConfig.progress
		} } : {},
		...baseConfig.block || accountConfig.block ? { block: {
			...baseConfig.block,
			...accountConfig.block,
			...baseConfig.block?.coalesce || accountConfig.block?.coalesce ? { coalesce: {
				...baseConfig.block?.coalesce,
				...accountConfig.block?.coalesce
			} } : {}
		} } : {}
	};
}
function mergeSlackAccountConfig(cfg, accountId) {
	const accountConfig = resolveSlackAccountConfig(cfg, accountId);
	const merged = resolveMergedSlackAccountConfig(cfg, accountId);
	const streaming = mergeSlackStreamingConfig((cfg.channels?.slack)?.streaming, accountConfig?.streaming);
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
		groupPolicy: merged.groupPolicy,
		textChunkLimit: merged.textChunkLimit,
		mediaMaxMb: merged.mediaMaxMb,
		reactionNotifications: merged.reactionNotifications,
		reactionAllowlist: merged.reactionAllowlist,
		replyToMode: merged.replyToMode,
		replyToModeByChatType: merged.replyToModeByChatType,
		actions: merged.actions,
		slashCommand: merged.slashCommand,
		dm: merged.dm,
		channels: merged.channels
	};
}
function listEnabledSlackAccounts(cfg) {
	return listSlackAccountIds(cfg).map((accountId) => resolveSlackAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { resolveDefaultSlackAccountId as a, resolveSlackAccountDmPolicy as c, formatSlackBotTokenIdentityWarning as d, resolveSlackAppToken as f, mergeSlackAccountConfig as i, resolveSlackConfigAccessorAccount as l, listEnabledSlackAccounts as n, resolveSlackAccount as o, resolveSlackBotToken as p, listSlackAccountIds as r, resolveSlackAccountAllowFrom as s, hasImplicitDefaultSlackAccount as t, resolveSlackOperationToken as u };
