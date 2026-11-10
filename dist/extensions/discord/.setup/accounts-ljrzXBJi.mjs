import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { hasConfiguredSecretInput, normalizeResolvedSecretInputString, normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { createAccountActionGate, createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { mapAllowFromEntries, normalizeChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-helpers";
import { resolveConfiguredFromCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1, resolveAccountEntry } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getRuntimeConfigSnapshot, getRuntimeConfigSourceSnapshot, selectApplicableRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
//#region extensions/discord/src/account-token-inspect.ts
function inspectDiscordConfiguredToken(value) {
	const normalized = normalizeSecretInputString(value);
	if (normalized || hasConfiguredSecretInput(value)) return {
		token: normalized ? normalized.replace(/^Bot\s+/i, "") : "",
		tokenSource: "config",
		tokenStatus: normalized ? "available" : "configured_unavailable"
	};
	return null;
}
function inspectDiscordAccountTokenState(params) {
	const configuredToken = inspectDiscordConfiguredToken(params.accountToken) ?? (params.hasAccountToken ? null : inspectDiscordConfiguredToken(params.channelToken));
	if (configuredToken) return {
		...params.base,
		...configuredToken,
		configured: true,
		config: params.config
	};
	const fallback = params.hasAccountToken ? void 0 : params.resolveFallbackToken();
	return {
		...params.base,
		token: fallback?.token || "",
		tokenSource: fallback?.token ? fallback.source : "none",
		tokenStatus: fallback?.token ? "available" : "missing",
		configured: Boolean(fallback?.token),
		config: params.config
	};
}
/** Runtime and inspection keep the first enabled owner, preferring config over env tokens. */
function resolveDiscordAccountAvailability(params) {
	if (!params.account.enabled) return {
		enabled: false,
		stateReason: "disabled"
	};
	const token = params.account.token.trim();
	let owner;
	if (token) for (const account of params.resolveAccounts()) {
		if (!account.enabled || account.token.trim() !== token) continue;
		const priority = account.tokenSource === "config" ? 2 : account.tokenSource === "env" ? 1 : 0;
		if (!owner || priority > owner.priority) owner = {
			accountId: account.accountId,
			priority
		};
	}
	const duplicateOwner = owner && owner.accountId !== params.account.accountId ? owner.accountId : void 0;
	return {
		enabled: !duplicateOwner,
		stateReason: duplicateOwner ? `duplicate bot token; using account "${duplicateOwner}"` : void 0
	};
}
//#endregion
//#region extensions/discord/src/runtime-config.ts
function selectDiscordRuntimeConfig(inputConfig) {
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? inputConfig;
}
function withSourceActivities(runtimeAccount, sourceAccount) {
	const { activities: _runtimeActivities, ...runtimeRest } = runtimeAccount ?? {};
	return {
		...runtimeRest,
		...sourceAccount?.activities ? { activities: sourceAccount.activities } : {}
	};
}
/** Restores plugin-owned sensitive Activity config onto the resolved runtime shape. */
function selectDiscordActivitiesRuntimeConfig(inputConfig) {
	const runtimeConfig = selectDiscordRuntimeConfig(inputConfig);
	const sourceDiscord = getRuntimeConfigSourceSnapshot()?.channels?.discord;
	if (!sourceDiscord) return runtimeConfig;
	const runtimeDiscord = runtimeConfig.channels?.discord;
	const accountIds = /* @__PURE__ */ new Set([...Object.keys(runtimeDiscord?.accounts ?? {}), ...Object.keys(sourceDiscord.accounts ?? {})]);
	const accounts = Object.fromEntries([...accountIds].map((accountId) => [accountId, withSourceActivities(runtimeDiscord?.accounts?.[accountId], sourceDiscord.accounts?.[accountId])]));
	return {
		...runtimeConfig,
		channels: {
			...runtimeConfig.channels,
			discord: {
				...withSourceActivities(runtimeDiscord, sourceDiscord),
				...accountIds.size > 0 ? { accounts } : {}
			}
		}
	};
}
//#endregion
//#region extensions/discord/src/token.ts
function stripDiscordBotPrefix(token) {
	return token.replace(/^Bot\s+/i, "");
}
function normalizeDiscordToken(raw, path) {
	const trimmed = normalizeResolvedSecretInputString({
		value: raw,
		path
	});
	return trimmed ? stripDiscordBotPrefix(trimmed) : void 0;
}
function resolveDiscordTokenValue(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") {
		const token = stripDiscordBotPrefix(resolved.value);
		return token ? {
			token,
			source: "config",
			tokenStatus: "available"
		} : void 0;
	}
	if (resolved.status === "configured_unavailable") return {
		token: "",
		source: "config",
		tokenStatus: "configured_unavailable"
	};
}
function resolveDiscordToken(cfg, opts = {}) {
	const selectedCfg = selectDiscordRuntimeConfig(cfg);
	const accountId = normalizeAccountId$1(opts.accountId);
	const discordCfg = selectedCfg?.channels?.discord;
	const accountCfg = resolveAccountEntry(discordCfg?.accounts, accountId);
	const hasAccountToken = Boolean(accountCfg && Object.hasOwn(accountCfg, "token"));
	const accountToken = resolveDiscordTokenValue({
		cfg: selectedCfg,
		value: accountCfg?.token,
		path: `channels.discord.accounts.${accountId}.token`
	});
	if (accountToken) return accountToken;
	if (hasAccountToken) return {
		token: "",
		source: "none",
		tokenStatus: "missing"
	};
	const configToken = resolveDiscordTokenValue({
		cfg: selectedCfg,
		value: discordCfg?.token,
		path: "channels.discord.token"
	});
	if (configToken) return configToken;
	const envToken = accountId === DEFAULT_ACCOUNT_ID$1 ? normalizeDiscordToken(opts.envToken ?? process.env.DISCORD_BOT_TOKEN, "DISCORD_BOT_TOKEN") : void 0;
	if (envToken) return {
		token: envToken,
		source: "env",
		tokenStatus: "available"
	};
	return {
		token: "",
		source: "none",
		tokenStatus: "missing"
	};
}
//#endregion
//#region extensions/discord/src/accounts.ts
const { listAccountIds: listDiscordAccountIds, resolveDefaultAccountId: resolveDefaultDiscordAccountId, resolveAccountConfig: mergeDiscordAccountConfig } = createAccountListHelpers("discord", {
	implicitDefaultAccount: {
		channelKeys: ["token"],
		envVars: ["DISCORD_BOT_TOKEN"]
	},
	nestedObjectKeys: [
		"activities",
		"agentComponents",
		"botLoopProtection"
	]
});
function resolveDiscordAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.discord?.accounts, accountId);
}
function inspectDiscordAccountConfig(params, options) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const config = mergeDiscordAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.discord?.enabled !== false && config.enabled !== false;
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const hasAccountToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "token"));
	return inspectDiscordAccountTokenState({
		base: {
			accountId,
			enabled,
			...options.includeName ? { name: normalizeOptionalString(config.name) } : {}
		},
		config,
		accountToken: accountConfig?.token,
		hasAccountToken,
		channelToken: params.cfg.channels?.discord?.token,
		resolveFallbackToken: () => options.resolveFallbackToken(accountId)
	});
}
function readConfiguredAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	return resolveDiscordAccountConfig(params.cfg, accountId);
}
function resolveDiscordAccountAllowFrom(params) {
	const accountConfig = readConfiguredAccount(params);
	const rootConfig = params.cfg.channels?.discord;
	const allowFrom = accountConfig?.allowFrom ?? rootConfig?.allowFrom;
	return allowFrom ? mapAllowFromEntries(allowFrom) : void 0;
}
function resolveDiscordAccountDmPolicy(params) {
	const accountConfig = readConfiguredAccount(params);
	const rootConfig = params.cfg.channels?.discord;
	return normalizeChannelDmPolicy(accountConfig?.dmPolicy ?? rootConfig?.dmPolicy ?? "pairing");
}
function createDiscordActionGate(params) {
	const accountConfig = readConfiguredAccount(params);
	return createAccountActionGate({
		baseActions: params.cfg.channels?.discord?.actions,
		accountActions: accountConfig?.actions
	});
}
function resolveDiscordAccount(params) {
	const cfg = selectDiscordRuntimeConfig(params.cfg);
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(cfg));
	const baseEnabled = cfg.channels?.discord?.enabled !== false;
	const merged = mergeDiscordAccountConfig(cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const tokenResolution = resolveDiscordToken(cfg, { accountId });
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: tokenResolution.token,
		tokenSource: tokenResolution.source,
		tokenStatus: tokenResolution.tokenStatus,
		config: merged
	};
}
function resolveDiscordMaxLinesPerMessage(params) {
	if (typeof params.discordConfig?.maxLinesPerMessage === "number") return params.discordConfig.maxLinesPerMessage;
	return resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.maxLinesPerMessage;
}
function inspectDiscordRuntimeAvailability(account, cfg) {
	return resolveDiscordAccountAvailability({
		account,
		resolveAccounts: () => listDiscordAccountIds(cfg).map((accountId) => resolveDiscordAccount({
			cfg,
			accountId
		}))
	});
}
function isDiscordAccountEnabledForRuntime(account, cfg) {
	return inspectDiscordRuntimeAvailability(account, cfg).enabled;
}
function resolveDiscordAccountDisabledReason(account, cfg) {
	return inspectDiscordRuntimeAvailability(account, cfg).stateReason ?? "disabled";
}
function listEnabledDiscordAccounts(cfg) {
	return listDiscordAccountIds(cfg).map((accountId) => resolveDiscordAccount({
		cfg,
		accountId
	})).filter((account) => isDiscordAccountEnabledForRuntime(account, cfg));
}
function listDiscordStartupAccountIds(cfg) {
	const startupAccountIds = listEnabledDiscordAccounts(cfg).filter((candidate) => resolveConfiguredFromCredentialStatuses(candidate) ?? Boolean(normalizeOptionalString(candidate.token))).map((candidate) => candidate.accountId);
	const defaultAccountId = resolveDefaultDiscordAccountId(cfg);
	if (!startupAccountIds.includes(defaultAccountId)) return startupAccountIds;
	return [defaultAccountId, ...startupAccountIds.filter((candidateId) => candidateId !== defaultAccountId)];
}
//#endregion
export { selectDiscordActivitiesRuntimeConfig as _, listDiscordStartupAccountIds as a, resolveDefaultDiscordAccountId as c, resolveDiscordAccountConfig as d, resolveDiscordAccountDisabledReason as f, resolveDiscordToken as g, normalizeDiscordToken as h, listDiscordAccountIds as i, resolveDiscordAccount as l, resolveDiscordMaxLinesPerMessage as m, inspectDiscordAccountConfig as n, listEnabledDiscordAccounts as o, resolveDiscordAccountDmPolicy as p, isDiscordAccountEnabledForRuntime as r, mergeDiscordAccountConfig as s, createDiscordActionGate as t, resolveDiscordAccountAllowFrom as u, resolveDiscordAccountAvailability as v };
