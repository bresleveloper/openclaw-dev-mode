import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-DbRsdayc.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as mergeAccountConfig } from "./channel-account-config-BJXLiQtV.mjs";
import { i as hasConfiguredAccountValue, o as resolveListedDefaultAccountId, t as createAccountListHelpers } from "./account-helpers-DLhdydCj.mjs";
import "./account-core-BE1fOhGS.mjs";
import { r as resolveDefaultAgentBoundAccountId } from "./bindings-DZZ-X6IG.mjs";
import "./routing-CEr1aXk1.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
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
function resolveTelegramLegacyWebhookListener(configured) {
	if (!configured) return;
	return {
		port: configured.port,
		host: configured.host ?? "127.0.0.1"
	};
}
//#endregion
//#region extensions/telegram/src/account-selection.ts
function resolveTelegramBindingAccountId(value) {
	if (!value || typeof value !== "object") return null;
	const binding = value;
	if (normalizeLowercaseStringOrEmpty(binding.match?.channel) !== "telegram") return null;
	const accountId = typeof binding.match?.accountId === "string" ? binding.match.accountId : "";
	if (!accountId.trim() || accountId.trim() === "*") return null;
	return normalizeAccountId(accountId);
}
function hasTelegramAccountConfig(cfg, accountId) {
	const normalized = normalizeAccountId(accountId);
	if (resolveTelegramAccountConfig(cfg, normalized)) return true;
	const channel = cfg.channels?.telegram;
	if (normalized !== "default" && (Object.keys(channel?.accounts ?? {}).length > 0 || !cfg.bindings?.some((binding) => resolveTelegramBindingAccountId(binding) === normalized))) return false;
	return hasConfiguredAccountValue(channel?.botToken) || hasConfiguredAccountValue(channel?.tokenFile) || normalized === "default" && hasConfiguredAccountValue(process.env.TELEGRAM_BOT_TOKEN);
}
const { listAccountIds: listTelegramAccountIds } = createAccountListHelpers("telegram", {
	normalizeAccountId,
	additionalAccountIds: (cfg) => [...new Set((cfg.bindings ?? []).map(resolveTelegramBindingAccountId).filter((id) => id !== null))].toSorted((left, right) => left.localeCompare(right)),
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
export { mergeTelegramAccountConfig as a, resolveDefaultTelegramAccountSelection as i, listTelegramAccountIds as n, resolveTelegramAccountConfig as o, resolveDefaultTelegramAccountId as r, resolveTelegramLegacyWebhookListener as s, hasTelegramAccountConfig as t };
