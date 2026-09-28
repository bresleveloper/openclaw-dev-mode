import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId, resolveNormalizedAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { normalizeLowercaseStringOrEmpty, normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { createChannelDmPolicy } from "openclaw/plugin-sdk/channel-dm-policy";
import { defineChannelSetupContract } from "openclaw/plugin-sdk/channel-setup";
import { getChatChannelMeta } from "openclaw/plugin-sdk/core";
import { createSetupTranslator, formatDocsLink, normalizeAccountId as normalizeAccountId$1, patchTopLevelChannelConfigSection, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
//#region extensions/twitch/src/token.ts
/**
* Twitch access token resolution with environment variable support.
*
* Supports reading Twitch OAuth access tokens from config or environment variable.
* The OPENCLAW_TWITCH_ACCESS_TOKEN env var is only used for the default account.
*
* Token resolution priority:
* 1. Account access token from merged config (accounts.{id} or base-level for default)
* 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
*/
/**
* Normalize a Twitch OAuth token - ensure it has the oauth: prefix
*/
function normalizeTwitchToken(raw) {
	if (!raw) return;
	const trimmed = raw.trim();
	if (!trimmed) return;
	return trimmed.startsWith("oauth:") ? trimmed : `oauth:${trimmed}`;
}
/**
* Resolve Twitch access token from config or environment variable.
*
* Priority:
* 1. Account access token (from merged config - base-level for default, or accounts.{accountId})
* 2. Environment variable: OPENCLAW_TWITCH_ACCESS_TOKEN (default account only)
*
* The getAccountConfig function handles merging base-level config with accounts.default,
* so this logic works for both simplified and multi-account patterns.
*
* @param cfg - OpenClaw config
* @param opts - Options including accountId and optional envToken override
* @returns Token resolution with source
*/
function resolveTwitchToken(cfg, opts = {}) {
	const accountId = normalizeAccountId(opts.accountId);
	const twitchCfg = cfg?.channels?.twitch;
	const accounts = twitchCfg?.accounts;
	const accountCfg = resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId);
	let token;
	if (accountId === DEFAULT_ACCOUNT_ID) token = normalizeTwitchToken((typeof twitchCfg?.accessToken === "string" ? twitchCfg.accessToken : void 0) || accountCfg?.accessToken);
	else token = normalizeTwitchToken(accountCfg?.accessToken);
	if (token) return {
		token,
		source: "config"
	};
	const envToken = accountId === DEFAULT_ACCOUNT_ID ? normalizeTwitchToken(opts.envToken ?? process.env.OPENCLAW_TWITCH_ACCESS_TOKEN) : void 0;
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	return {
		token: "",
		source: "none"
	};
}
//#endregion
//#region extensions/twitch/src/utils/twitch.ts
/**
* Twitch-specific utility functions
*/
/**
* Normalize Twitch channel names.
*
* Removes the '#' prefix if present, converts to lowercase, and trims whitespace.
* Twitch channel names are case-insensitive and don't use the '#' prefix in the API.
*
* @param channel - The channel name to normalize
* @returns Normalized channel name
*
* @example
* normalizeTwitchChannel("#TwitchChannel") // "twitchchannel"
* normalizeTwitchChannel("MyChannel") // "mychannel"
*/
function normalizeTwitchChannel(channel) {
	const trimmed = normalizeLowercaseStringOrEmpty(channel);
	return trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;
}
/**
* Create a standardized error message for missing target.
*
* @param provider - The provider name (e.g., "Twitch")
* @param hint - Optional hint for how to fix the issue
* @returns Error object with descriptive message
*/
function missingTargetError(provider, hint) {
	return /* @__PURE__ */ new Error(`Delivering to ${provider} requires target${hint ? ` ${hint}` : ""}`);
}
/**
* Normalize OAuth token by removing the "oauth:" prefix if present.
*
* Twurple doesn't require the "oauth:" prefix, so we strip it for consistency.
*
* @param token - The OAuth token to normalize
* @returns Normalized token without "oauth:" prefix
*
* @example
* normalizeToken("oauth:abc123") // "abc123"
* normalizeToken("abc123") // "abc123"
*/
function normalizeToken(token) {
	return token.startsWith("oauth:") ? token.slice(6) : token;
}
/**
* Check if an account is properly configured with required credentials.
*
* @param account - The Twitch account config to check
* @returns true if the account has required credentials
*/
function isAccountConfigured(account, resolvedToken) {
	const token = resolvedToken ?? account?.accessToken;
	return Boolean(account?.username && token && account?.clientId);
}
//#endregion
//#region extensions/twitch/src/config.ts
const { listAccountIds, resolveDefaultAccountId: resolveDefaultTwitchAccountId } = createAccountListHelpers("twitch", {
	normalizeAccountId,
	fallbackAccountIdWhenEmpty: false,
	hasImplicitDefaultAccount: (cfg) => {
		const twitch = cfg.channels?.twitch;
		return typeof twitch?.username === "string" || typeof twitch?.accessToken === "string" || typeof twitch?.channel === "string";
	}
});
/**
* Get account config from core config
*
* Handles two patterns:
* 1. Simplified single-account: base-level properties create implicit "default" account
* 2. Multi-account: explicit accounts object
*
* For "default" account, base-level properties take precedence over accounts.default
* For other accounts, only the accounts object is checked
*/
function getAccountConfig(coreConfig, accountId) {
	if (!coreConfig || typeof coreConfig !== "object") return null;
	const cfg = coreConfig;
	const normalizedAccountId = normalizeAccountId(accountId);
	const twitchRaw = cfg.channels?.twitch;
	const accounts = twitchRaw?.accounts;
	if (normalizedAccountId === DEFAULT_ACCOUNT_ID$1) {
		const accountFromAccounts = resolveNormalizedAccountEntry(accounts, DEFAULT_ACCOUNT_ID$1, normalizeAccountId);
		const baseLevel = {
			username: typeof twitchRaw?.username === "string" ? twitchRaw.username : void 0,
			accessToken: typeof twitchRaw?.accessToken === "string" ? twitchRaw.accessToken : void 0,
			clientId: typeof twitchRaw?.clientId === "string" ? twitchRaw.clientId : void 0,
			channel: typeof twitchRaw?.channel === "string" ? twitchRaw.channel : void 0,
			enabled: typeof twitchRaw?.enabled === "boolean" ? twitchRaw.enabled : void 0,
			allowFrom: Array.isArray(twitchRaw?.allowFrom) ? twitchRaw.allowFrom : void 0,
			allowedRoles: Array.isArray(twitchRaw?.allowedRoles) ? twitchRaw.allowedRoles : void 0,
			requireMention: typeof twitchRaw?.requireMention === "boolean" ? twitchRaw.requireMention : void 0,
			clientSecret: typeof twitchRaw?.clientSecret === "string" ? twitchRaw.clientSecret : void 0,
			refreshToken: typeof twitchRaw?.refreshToken === "string" ? twitchRaw.refreshToken : void 0,
			expiresIn: typeof twitchRaw?.expiresIn === "number" ? twitchRaw.expiresIn : void 0,
			obtainmentTimestamp: typeof twitchRaw?.obtainmentTimestamp === "number" ? twitchRaw.obtainmentTimestamp : void 0
		};
		const merged = {
			...accountFromAccounts,
			...baseLevel
		};
		if (merged.username) return merged;
		if (accountFromAccounts) return accountFromAccounts;
		return null;
	}
	const account = resolveNormalizedAccountEntry(accounts, normalizedAccountId, normalizeAccountId);
	if (!account) return null;
	return account;
}
function resolveTwitchAccountContext(cfg, accountId) {
	const resolvedAccountId = accountId?.trim() ? normalizeAccountId(accountId) : resolveDefaultTwitchAccountId(cfg);
	const account = getAccountConfig(cfg, resolvedAccountId);
	const tokenResolution = resolveTwitchToken(cfg, { accountId: resolvedAccountId });
	return {
		accountId: resolvedAccountId,
		account,
		tokenResolution,
		configured: account ? isAccountConfigured(account, tokenResolution.token) : false,
		availableAccountIds: listAccountIds(cfg)
	};
}
/** Keep runtime and setup on the same normalized, account-scoped credential path. */
function resolveTwitchAccount(cfg, accountId) {
	const resolvedAccountId = normalizeAccountId(accountId ?? resolveDefaultTwitchAccountId(cfg));
	const account = getAccountConfig(cfg, resolvedAccountId);
	return account ? {
		accountId: resolvedAccountId,
		...account
	} : {
		accountId: resolvedAccountId,
		username: "",
		accessToken: "",
		clientId: "",
		channel: "",
		enabled: false
	};
}
/** Share account selection and configured-state checks across both Twitch entrypoints. */
const twitchConfigAdapter = {
	listAccountIds,
	resolveAccount: resolveTwitchAccount,
	defaultAccountId: resolveDefaultTwitchAccountId,
	resolveDefaultTo: ({ cfg, accountId }) => resolveTwitchAccountContext(cfg, accountId).account?.channel,
	isConfigured: (account, cfg) => resolveTwitchAccountContext(cfg, account.accountId).configured,
	isEnabled: (account) => account?.enabled !== false
};
function resolveTwitchSnapshotAccountId(cfg, account) {
	const accountMap = (cfg.channels?.twitch)?.accounts ?? {};
	return Object.entries(accountMap).find(([, value]) => value === account)?.[0] ?? DEFAULT_ACCOUNT_ID$1;
}
//#endregion
//#region extensions/twitch/src/setup-surface.ts
/**
* Twitch setup wizard surface for CLI setup.
*/
const channel = "twitch";
const t = createSetupTranslator();
const INVALID_ACCOUNT_ID_MESSAGE = "Invalid Twitch account id";
function normalizeRequestedSetupAccountId(accountId) {
	const normalized = normalizeOptionalAccountId(accountId);
	if (!normalized) throw new Error(INVALID_ACCOUNT_ID_MESSAGE);
	return normalized;
}
function resolveSetupAccountId(cfg, requestedAccountId) {
	const requested = requestedAccountId?.trim();
	if (requested) return normalizeRequestedSetupAccountId(requested);
	const preferred = cfg.channels?.twitch?.defaultAccount?.trim();
	return preferred ? normalizeAccountId$1(preferred) : resolveDefaultTwitchAccountId(cfg);
}
function setTwitchAccount(cfg, account, accountId = resolveSetupAccountId(cfg)) {
	const resolvedAccountId = accountId.trim() ? normalizeRequestedSetupAccountId(accountId) : resolveSetupAccountId(cfg);
	const existing = getAccountConfig(cfg, resolvedAccountId);
	const merged = {
		username: account.username ?? existing?.username ?? "",
		accessToken: account.accessToken ?? existing?.accessToken ?? "",
		clientId: account.clientId ?? existing?.clientId ?? "",
		channel: account.channel ?? existing?.channel ?? "",
		enabled: account.enabled ?? existing?.enabled ?? true,
		allowFrom: account.allowFrom ?? existing?.allowFrom,
		allowedRoles: account.allowedRoles ?? existing?.allowedRoles,
		requireMention: account.requireMention ?? existing?.requireMention,
		clientSecret: account.clientSecret ?? existing?.clientSecret,
		refreshToken: account.refreshToken ?? existing?.refreshToken,
		expiresIn: account.expiresIn ?? existing?.expiresIn,
		obtainmentTimestamp: account.obtainmentTimestamp ?? existing?.obtainmentTimestamp
	};
	return patchTopLevelChannelConfigSection({
		cfg,
		channel,
		enabled: true,
		patch: { accounts: {
			...cfg.channels?.twitch?.accounts,
			[resolvedAccountId]: merged
		} }
	});
}
async function noteTwitchSetupHelp(prompter) {
	await prompter.note([
		t("wizard.twitch.helpRequiresBot"),
		t("wizard.twitch.helpCreateApp"),
		t("wizard.twitch.helpGenerateToken"),
		t("wizard.twitch.helpTokenTools"),
		t("wizard.twitch.helpCopyToken"),
		t("wizard.twitch.helpEnvVars"),
		`Docs: ${formatDocsLink("/channels/twitch", "channels/twitch")}`
	].join("\n"), t("wizard.twitch.setupTitle"));
}
async function promptToken(prompter, account) {
	const existingToken = account?.accessToken ?? "";
	if (existingToken) {
		if (await prompter.confirm({
			message: t("wizard.twitch.accessTokenKeep"),
			initialValue: true
		})) return existingToken;
	}
	return (await prompter.text({
		message: t("wizard.twitch.oauthTokenPrompt"),
		sensitive: true,
		validate: (value) => {
			const raw = value?.trim() ?? "";
			if (!raw) return "Required";
			if (!raw.startsWith("oauth:")) return "Token should start with 'oauth:'";
		}
	})).trim();
}
async function promptRequiredTwitchAccountValue(prompter, message, initialValue) {
	return (await prompter.text({
		message,
		initialValue: initialValue ?? "",
		validate: (value) => value?.trim() ? void 0 : "Required"
	})).trim();
}
async function promptUsername(prompter, account) {
	return await promptRequiredTwitchAccountValue(prompter, t("wizard.twitch.botUsernamePrompt"), account?.username);
}
async function promptClientId(prompter, account) {
	return await promptRequiredTwitchAccountValue(prompter, t("wizard.twitch.clientIdPrompt"), account?.clientId);
}
async function promptChannelName(prompter, account) {
	return await promptRequiredTwitchAccountValue(prompter, t("wizard.twitch.channelJoinPrompt"), account?.channel);
}
async function promptRefreshCredential(params) {
	const existingValue = params.existingValue?.trim();
	if (existingValue) {
		if (await params.prompter.confirm({
			message: params.keepMessage,
			initialValue: true
		})) return existingValue;
	}
	return (await params.prompter.text({
		message: params.inputMessage,
		sensitive: true,
		validate: (input) => input?.trim() ? void 0 : "Required"
	})).trim() || void 0;
}
async function promptRefreshTokenSetup(prompter, account) {
	if (!await prompter.confirm({
		message: t("wizard.twitch.refreshTokenPrompt"),
		initialValue: Boolean(account?.clientSecret && account?.refreshToken)
	})) return {};
	return {
		clientSecret: await promptRefreshCredential({
			prompter,
			existingValue: account?.clientSecret,
			keepMessage: t("wizard.twitch.clientSecretKeep"),
			inputMessage: t("wizard.twitch.clientSecretPrompt")
		}),
		refreshToken: await promptRefreshCredential({
			prompter,
			existingValue: account?.refreshToken,
			keepMessage: t("wizard.twitch.refreshTokenKeep"),
			inputMessage: t("wizard.twitch.refreshTokenInputPrompt")
		})
	};
}
async function configureWithEnvToken(cfg, prompter, account, envToken, forceAllowFrom, dmPolicy, accountId = resolveSetupAccountId(cfg)) {
	const resolvedAccountId = accountId.trim() ? normalizeRequestedSetupAccountId(accountId) : resolveSetupAccountId(cfg);
	if (resolvedAccountId !== DEFAULT_ACCOUNT_ID$1) return null;
	if (!await prompter.confirm({
		message: t("wizard.twitch.envPrompt"),
		initialValue: true
	})) return null;
	const cfgWithAccount = setTwitchAccount(cfg, {
		username: await promptUsername(prompter, account),
		clientId: await promptClientId(prompter, account),
		accessToken: envToken,
		enabled: true
	}, resolvedAccountId);
	if (forceAllowFrom && dmPolicy.promptAllowFrom) return { cfg: await dmPolicy.promptAllowFrom({
		cfg: cfgWithAccount,
		prompter,
		accountId: resolvedAccountId
	}) };
	return { cfg: cfgWithAccount };
}
function setTwitchAccessControl(cfg, allowedRoles, requireMention, accountId) {
	const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
	const account = getAccountConfig(cfg, resolvedAccountId);
	if (!account) return cfg;
	return setTwitchAccount(cfg, {
		...account,
		allowedRoles,
		requireMention
	}, resolvedAccountId);
}
function resolveTwitchGroupPolicy(cfg, accountId) {
	const account = getAccountConfig(cfg, resolveSetupAccountId(cfg, accountId));
	if (account?.allowedRoles?.includes("all")) return "open";
	if (account?.allowedRoles?.includes("moderator")) return "allowlist";
	return "disabled";
}
function setTwitchGroupPolicy(cfg, policy, accountId) {
	return setTwitchAccessControl(cfg, policy === "open" ? ["all"] : policy === "allowlist" ? ["moderator", "vip"] : [], true, accountId);
}
const twitchDmPolicy = createChannelDmPolicy({
	label: "Twitch",
	channel,
	policyKey: "channels.twitch.accounts.default.allowedRoles",
	allowFromKey: "channels.twitch.accounts.default.allowFrom",
	policyPath: "allowedRoles",
	resolveAccount: (cfg, accountId) => {
		const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
		const account = getAccountConfig(cfg, resolvedAccountId);
		return {
			accountId: resolvedAccountId,
			config: {
				dmPolicy: account?.allowedRoles?.includes("all") ? "open" : account?.allowFrom?.length ? "allowlist" : "disabled",
				allowFrom: account?.allowFrom
			}
		};
	},
	resolveConfigKeys: ({ account }) => ({
		policyKey: `channels.twitch.accounts.${account.accountId}.allowedRoles`,
		allowFromKey: `channels.twitch.accounts.${account.accountId}.allowFrom`
	}),
	resolveAllowFrom: () => void 0,
	buildPatch: ({ policy }) => {
		return { allowedRoles: policy === "open" ? ["all"] : policy === "allowlist" ? [] : ["moderator"] };
	},
	applyPatch: ({ cfg, account, patch }) => setTwitchAccessControl(cfg, patch.allowedRoles, true, account.accountId),
	promptAllowFrom: async ({ cfg, prompter, accountId }) => {
		const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
		const account = getAccountConfig(cfg, resolvedAccountId);
		const existingAllowFrom = account?.allowFrom ?? [];
		const entry = await prompter.text({
			message: t("wizard.twitch.allowFromPrompt"),
			placeholder: "123456789",
			initialValue: existingAllowFrom[0] || void 0
		});
		const allowFrom = normalizeStringEntries((entry ?? "").split(/[\n,;]+/g));
		return setTwitchAccount(cfg, {
			...account ?? void 0,
			allowFrom
		}, resolvedAccountId);
	}
});
const twitchGroupAccess = {
	label: "Twitch chat",
	placeholder: "",
	skipAllowlistEntries: true,
	currentPolicy: ({ cfg, accountId }) => resolveTwitchGroupPolicy(cfg, accountId),
	currentEntries: ({ cfg, accountId }) => {
		return getAccountConfig(cfg, resolveSetupAccountId(cfg, accountId))?.allowFrom ?? [];
	},
	updatePrompt: ({ cfg, accountId }) => {
		const account = getAccountConfig(cfg, resolveSetupAccountId(cfg, accountId));
		return Boolean(account?.allowedRoles?.length || account?.allowFrom?.length);
	},
	setPolicy: ({ cfg, accountId, policy }) => setTwitchGroupPolicy(cfg, policy, accountId),
	resolveAllowlist: async () => [],
	applyAllowlist: ({ cfg }) => cfg
};
const twitchSetupContract = defineChannelSetupContract({
	fields: {},
	legacyAdapter: {
		singleAccountKeysToMove: ["accessToken"],
		resolveAccountId: ({ cfg }) => resolveSetupAccountId(cfg),
		applyAccountConfig: ({ cfg, accountId }) => setTwitchAccount(cfg, { enabled: true }, accountId)
	}
});
const twitchSetupWizard = {
	channel,
	resolveAccountIdForConfigure: ({ cfg, accountOverride }) => resolveSetupAccountId(cfg, accountOverride),
	resolveShouldPromptAccountIds: () => false,
	status: {
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsUsernameTokenClientId"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsSetup"),
		resolveConfigured: ({ cfg, accountId }) => {
			return resolveTwitchAccountContext(cfg, resolveSetupAccountId(cfg, accountId)).configured;
		},
		resolveStatusLines: ({ cfg, accountId }) => {
			const resolvedAccountId = resolveSetupAccountId(cfg, accountId);
			const configured = resolveTwitchAccountContext(cfg, resolvedAccountId).configured;
			return [`Twitch${resolvedAccountId !== DEFAULT_ACCOUNT_ID$1 ? ` (${resolvedAccountId})` : ""}: ${configured ? t("wizard.channels.statusConfigured") : t("wizard.channels.statusNeedsUsernameTokenClientId")}`];
		}
	},
	credentials: [],
	finalize: async ({ cfg, accountId: requestedAccountId, prompter, forceAllowFrom }) => {
		const accountId = resolveSetupAccountId(cfg, requestedAccountId);
		const account = getAccountConfig(cfg, accountId);
		if (!account || !isAccountConfigured(account)) await noteTwitchSetupHelp(prompter);
		const envToken = process.env.OPENCLAW_TWITCH_ACCESS_TOKEN?.trim();
		if (accountId === DEFAULT_ACCOUNT_ID$1 && envToken && !account?.accessToken) {
			const envResult = await configureWithEnvToken(cfg, prompter, account, envToken, forceAllowFrom, twitchDmPolicy, accountId);
			if (envResult) return envResult;
		}
		const username = await promptUsername(prompter, account);
		const token = await promptToken(prompter, account);
		const clientId = await promptClientId(prompter, account);
		const channelName = await promptChannelName(prompter, account);
		const { clientSecret, refreshToken } = await promptRefreshTokenSetup(prompter, account);
		const cfgWithAccount = setTwitchAccount(cfg, {
			username,
			accessToken: token,
			clientId,
			channel: channelName,
			clientSecret,
			refreshToken,
			enabled: true
		}, accountId);
		return { cfg: forceAllowFrom && twitchDmPolicy.promptAllowFrom ? await twitchDmPolicy.promptAllowFrom({
			cfg: cfgWithAccount,
			prompter,
			accountId
		}) : cfgWithAccount };
	},
	dmPolicy: twitchDmPolicy,
	groupAccess: twitchGroupAccess,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
const twitchSetupPlugin = {
	id: channel,
	meta: getChatChannelMeta(channel),
	reload: { configPrefixes: ["channels.twitch"] },
	capabilities: { chatTypes: ["group"] },
	config: twitchConfigAdapter,
	setupContract: twitchSetupContract,
	setupWizard: twitchSetupWizard
};
//#endregion
export { resolveTwitchAccountContext as a, isAccountConfigured as c, normalizeTwitchChannel as d, resolveTwitchToken as f, resolveDefaultTwitchAccountId as i, missingTargetError as l, DEFAULT_ACCOUNT_ID$1 as n, resolveTwitchSnapshotAccountId as o, getAccountConfig as r, twitchConfigAdapter as s, twitchSetupPlugin as t, normalizeToken as u };
