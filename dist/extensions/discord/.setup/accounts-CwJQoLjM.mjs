import { createAccountActionGate, createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { mapAllowFromEntries, normalizeChannelDmPolicy } from "openclaw/plugin-sdk/channel-config-helpers";
import { resolveConfiguredFromCredentialStatuses } from "openclaw/plugin-sdk/channel-status";
import { DEFAULT_ACCOUNT_ID as DEFAULT_ACCOUNT_ID$1, normalizeAccountId as normalizeAccountId$1, resolveAccountEntry } from "openclaw/plugin-sdk/routing";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { hasConfiguredSecretInput, normalizeResolvedSecretInputString, normalizeSecretInputString, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { getRuntimeConfigSnapshot, getRuntimeConfigSourceSnapshot, selectApplicableRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
//#region extensions/discord/src/account-token-inspect.ts
function inspectDiscordConfiguredToken(value) {
	const normalized = normalizeSecretInputString(value);
	if (normalized) return {
		token: normalized.replace(/^Bot\s+/i, ""),
		tokenSource: "config",
		tokenStatus: "available"
	};
	if (hasConfiguredSecretInput(value)) return {
		token: "",
		tokenSource: "config",
		tokenStatus: "configured_unavailable"
	};
	return null;
}
function inspectDiscordAccountTokenState(params) {
	const accountToken = inspectDiscordConfiguredToken(params.accountToken);
	if (accountToken) return {
		...params.base,
		...accountToken,
		configured: true,
		config: params.config
	};
	if (params.hasAccountToken) return {
		...params.base,
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		config: params.config
	};
	const channelToken = inspectDiscordConfiguredToken(params.channelToken);
	if (channelToken) return {
		...params.base,
		...channelToken,
		configured: true,
		config: params.config
	};
	const fallback = params.resolveFallbackToken();
	if (fallback.token) return {
		...params.base,
		token: fallback.token,
		tokenSource: fallback.source,
		tokenStatus: "available",
		configured: true,
		config: params.config
	};
	return {
		...params.base,
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
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
	if (!trimmed) return;
	return stripDiscordBotPrefix(trimmed);
}
function resolveDiscordTokenValue(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: stripDiscordBotPrefix(resolved.value)
	};
	if (resolved.status === "configured_unavailable") return { status: "configured_unavailable" };
	return { status: "missing" };
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
	if (accountToken.status === "available" && accountToken.value) return {
		token: accountToken.value,
		source: "config",
		tokenStatus: "available"
	};
	if (accountToken.status === "configured_unavailable") return {
		token: "",
		source: "config",
		tokenStatus: "configured_unavailable"
	};
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
	if (configToken.status === "available" && configToken.value) return {
		token: configToken.value,
		source: "config",
		tokenStatus: "available"
	};
	if (configToken.status === "configured_unavailable") return {
		token: "",
		source: "config",
		tokenStatus: "configured_unavailable"
	};
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
const { listAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedDiscordAccountConfig } = createAccountListHelpers("discord", {
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
const listDiscordAccountIds = listAccountIds;
const resolveDefaultDiscordAccountId = resolveDefaultAccountId;
function resolveDiscordAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.discord?.accounts, accountId);
}
function mergeDiscordAccountConfig(cfg, accountId) {
	return resolveMergedDiscordAccountConfig(cfg, accountId);
}
function resolveDiscordAccountAllowFrom(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.discord;
	const allowFrom = accountConfig?.allowFrom ?? rootConfig?.allowFrom;
	return allowFrom ? mapAllowFromEntries(allowFrom) : void 0;
}
function resolveDiscordAccountDmPolicy(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.discord;
	return normalizeChannelDmPolicy(accountConfig?.dmPolicy ?? rootConfig?.dmPolicy ?? "pairing");
}
function createDiscordActionGate(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	return createAccountActionGate({
		baseActions: params.cfg.channels?.discord?.actions,
		accountActions: resolveDiscordAccountConfig(params.cfg, accountId)?.actions
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
export { inspectDiscordAccountTokenState as _, listEnabledDiscordAccounts as a, resolveDiscordAccount as c, resolveDiscordAccountDisabledReason as d, resolveDiscordAccountDmPolicy as f, selectDiscordActivitiesRuntimeConfig as g, resolveDiscordToken as h, listDiscordStartupAccountIds as i, resolveDiscordAccountAllowFrom as l, normalizeDiscordToken as m, isDiscordAccountEnabledForRuntime as n, mergeDiscordAccountConfig as o, resolveDiscordMaxLinesPerMessage as p, listDiscordAccountIds as r, resolveDefaultDiscordAccountId as s, createDiscordActionGate as t, resolveDiscordAccountConfig as u, resolveDiscordAccountAvailability as v };
