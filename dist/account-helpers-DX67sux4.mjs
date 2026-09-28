import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { n as resolveMergedAccountConfig } from "./channel-account-config-DBuJQlcg.mjs";
//#region src/channels/plugins/account-helpers.ts
/**
* Channel plugin account helper factory.
*
* Lists configured accounts and resolves default-account behavior for plugin configs.
*/
/**
* Creates reusable account listing, default selection, and merged config helpers for a channel.
*/
function createAccountListHelpers(channelKey, options) {
	function hasImplicitDefaultAccount(cfg) {
		const channel = cfg.channels?.[channelKey];
		return Boolean(options?.hasImplicitDefaultAccount?.(cfg) || options?.implicitDefaultAccount?.channelKeys?.some((key) => hasConfiguredAccountValue(channel?.[key])) || options?.implicitDefaultAccount?.envVars?.some((key) => hasConfiguredAccountValue(process.env[key])));
	}
	function resolveConfiguredDefaultAccountId(cfg) {
		const channel = cfg.channels?.[channelKey];
		return normalizeOptionalAccountId(typeof channel?.defaultAccount === "string" ? channel.defaultAccount : void 0);
	}
	function listConfiguredAccountIds(cfg) {
		const accounts = (cfg.channels?.[channelKey])?.accounts;
		if (!accounts || typeof accounts !== "object") return [];
		const ids = Object.keys(accounts).filter(Boolean);
		const normalizeConfiguredAccountId = options?.normalizeAccountId;
		if (!normalizeConfiguredAccountId) return ids;
		return normalizeUniqueStringEntries(ids.map((id) => normalizeConfiguredAccountId(id)));
	}
	function listAccountIds(cfg) {
		return listCombinedAccountIds({
			configuredAccountIds: listConfiguredAccountIds(cfg),
			additionalAccountIds: options?.additionalAccountIds?.(cfg),
			implicitAccountId: options?.resolveImplicitAccountId ? options.resolveImplicitAccountId(cfg) : hasImplicitDefaultAccount(cfg) ? DEFAULT_ACCOUNT_ID : void 0,
			fallbackAccountIdWhenEmpty: options?.fallbackAccountIdWhenEmpty === false ? void 0 : options?.fallbackAccountIdWhenEmpty ?? "default"
		});
	}
	function resolveDefaultAccountId(cfg) {
		return resolveListedDefaultAccountId({
			accountIds: listAccountIds(cfg),
			configuredDefaultAccountId: resolveConfiguredDefaultAccountId(cfg),
			allowUnlistedDefaultAccount: options?.allowUnlistedDefaultAccount
		});
	}
	return {
		listConfiguredAccountIds,
		listAccountIds,
		resolveDefaultAccountId,
		resolveAccountConfig: (cfg, accountId) => {
			const channelConfig = cfg.channels?.[channelKey];
			const accounts = channelConfig?.accounts;
			return resolveMergedAccountConfig({
				channelConfig,
				channelId: channelKey,
				accounts,
				accountId,
				omitKeys: options?.omitKeys,
				normalizeAccountId: options?.normalizeAccountId,
				nestedObjectKeys: options?.nestedObjectKeys
			});
		}
	};
}
/**
* Checks whether a config/env value should count as an account being configured.
*/
function hasConfiguredAccountValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
/**
* Combines configured, additional, implicit, and fallback account ids into stable order.
*/
function listCombinedAccountIds(params) {
	const ids = /* @__PURE__ */ new Set();
	for (const accountIds of [
		params.configuredAccountIds,
		params.additionalAccountIds ?? [],
		params.implicitAccountId ? [params.implicitAccountId] : []
	]) for (const accountId of accountIds) if (accountId) ids.add(accountId);
	if (ids.size === 0 && params.fallbackAccountIdWhenEmpty) return [params.fallbackAccountIdWhenEmpty];
	return [...ids].toSorted((a, b) => a.localeCompare(b));
}
/**
* Resolves the default account id from a listed account set and optional configured preference.
*/
function resolveListedDefaultAccountId(params) {
	const preferred = params.configuredDefaultAccountId;
	const normalizeListedAccountId = params.normalizeListedAccountId ?? normalizeAccountId;
	if (preferred && (params.allowUnlistedDefaultAccount || params.accountIds.some((accountId) => normalizeListedAccountId(accountId) === preferred))) return preferred;
	if (params.accountIds.includes("default")) return DEFAULT_ACCOUNT_ID;
	if (params.ambiguousFallbackAccountId && params.accountIds.length > 1) return params.ambiguousFallbackAccountId;
	return params.accountIds[0] ?? "default";
}
/**
* Builds a safe account snapshot for status/setup surfaces.
*/
function describeAccountSnapshot(params) {
	return {
		accountId: params.account.accountId ?? "default",
		name: normalizeOptionalString(params.account.name),
		enabled: params.account.enabled !== false,
		configured: params.configured,
		...params.extra
	};
}
/**
* Builds a webhook-mode account snapshot with the standard mode field.
*/
function describeWebhookAccountSnapshot(params) {
	return describeAccountSnapshot({
		account: params.account,
		configured: params.configured,
		extra: {
			mode: params.mode ?? "webhook",
			...params.extra
		}
	});
}
//#endregion
export { listCombinedAccountIds as a, hasConfiguredAccountValue as i, describeAccountSnapshot as n, resolveListedDefaultAccountId as o, describeWebhookAccountSnapshot as r, createAccountListHelpers as t };
