import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as mergeAccountConfig } from "./channel-account-config-DBuJQlcg.mjs";
import { i as resolveDefaultAgentBoundAccountId } from "./bindings-CUbRLEEv.mjs";
import { i as hasConfiguredAccountValue, o as resolveListedDefaultAccountId, t as createAccountListHelpers } from "./account-helpers-DX67sux4.mjs";
import "./account-core-CZZ_BKA9.mjs";
import "./routing-JKvWkBDR.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
//#region extensions/telegram/src/account-config.ts
function resolveTelegramAccountConfig(cfg, accountId) {
	const normalized = normalizeAccountId(accountId);
	return resolveNormalizedAccountEntry(cfg.channels?.telegram?.accounts, normalized, normalizeAccountId);
}
function mergeTelegramAccountConfig(cfg, accountId) {
	const channelConfig = cfg.channels?.telegram;
	const isMultiAccount = Object.keys(channelConfig?.accounts ?? {}).length > 1;
	return mergeAccountConfig({
		channelConfig,
		accountConfig: resolveTelegramAccountConfig(cfg, accountId),
		omitKeys: ["defaultAccount"],
		inheritEmptyKeys: {
			capabilities: "array",
			...isMultiAccount ? {} : { groups: "object" }
		},
		preserveRootAllowFrom: true
	});
}
//#endregion
//#region extensions/telegram/src/account-selection.ts
function resolveBindingAccount(params) {
	if (!params.binding || typeof params.binding !== "object") return null;
	const binding = params.binding;
	if (normalizeLowercaseStringOrEmpty(binding.match?.channel) !== params.channelId) return null;
	const accountId = typeof binding.match?.accountId === "string" ? binding.match.accountId : "";
	if (!accountId.trim() || accountId.trim() === "*") return null;
	return { accountId: normalizeAccountId(accountId) };
}
function listBoundAccountIds(cfg, channelId) {
	const ids = /* @__PURE__ */ new Set();
	for (const binding of cfg.bindings ?? []) {
		const resolved = resolveBindingAccount({
			binding,
			channelId
		});
		if (resolved) ids.add(resolved.accountId);
	}
	return [...ids].toSorted((left, right) => left.localeCompare(right));
}
function hasTelegramAccountConfig(cfg, accountId) {
	const normalized = normalizeAccountId(accountId);
	if (resolveTelegramAccountConfig(cfg, normalized)) return true;
	const channel = cfg.channels?.telegram;
	if (normalized !== "default" && (Object.keys(channel?.accounts ?? {}).length > 0 || !cfg.bindings?.some((binding) => resolveBindingAccount({
		binding,
		channelId: "telegram"
	})?.accountId === normalized))) return false;
	return hasConfiguredAccountValue(channel?.botToken) || hasConfiguredAccountValue(channel?.tokenFile) || normalized === "default" && hasConfiguredAccountValue(process.env.TELEGRAM_BOT_TOKEN);
}
const { listAccountIds: listTelegramAccountIds } = createAccountListHelpers("telegram", {
	normalizeAccountId,
	additionalAccountIds: (cfg) => listBoundAccountIds(cfg, "telegram"),
	hasImplicitDefaultAccount: (cfg) => hasTelegramAccountConfig(cfg, DEFAULT_ACCOUNT_ID)
});
function resolveDefaultTelegramAccountSelection(cfg) {
	const boundDefault = cfg.agents?.ownership === "explicit" && listAgentIds(cfg).length !== 1 ? null : resolveDefaultAgentBoundAccountId(cfg, "telegram");
	if (boundDefault) return {
		accountId: boundDefault,
		accountIds: listTelegramAccountIds(cfg),
		shouldWarnMissingDefault: false
	};
	const accountIds = listTelegramAccountIds(cfg);
	const configuredDefaultAccountId = normalizeOptionalAccountId(cfg.channels?.telegram?.defaultAccount) ?? void 0;
	const hasExplicitDefaultAccount = configuredDefaultAccountId ? accountIds.includes(configuredDefaultAccountId) : false;
	const resolved = resolveListedDefaultAccountId({
		accountIds,
		configuredDefaultAccountId
	});
	return {
		accountId: resolved,
		accountIds,
		shouldWarnMissingDefault: resolved === accountIds[0] && !hasExplicitDefaultAccount && !accountIds.includes("default") && accountIds.length > 1
	};
}
function resolveDefaultTelegramAccountId(cfg) {
	return resolveDefaultTelegramAccountSelection(cfg).accountId;
}
//#endregion
export { mergeTelegramAccountConfig as a, resolveDefaultTelegramAccountSelection as i, listTelegramAccountIds as n, resolveTelegramAccountConfig as o, resolveDefaultTelegramAccountId as r, hasTelegramAccountConfig as t };
