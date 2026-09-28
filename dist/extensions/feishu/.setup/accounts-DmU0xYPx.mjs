import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { DEFAULT_ACCOUNT_ID, createAccountListHelpers, hasConfiguredAccountValue, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-resolution";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { coerceSecretRef } from "openclaw/plugin-sdk/provider-auth";
import { canResolveEnvSecretRefInReadOnlyPath } from "openclaw/plugin-sdk/secret-ref-readonly";
//#region extensions/feishu/src/accounts.ts
var accounts_exports = /* @__PURE__ */ __exportAll({
	FeishuSecretRefUnavailableError: () => FeishuSecretRefUnavailableError,
	inspectFeishuCredentials: () => inspectFeishuCredentials,
	listEnabledFeishuAccounts: () => listEnabledFeishuAccounts,
	listFeishuAccountIds: () => listFeishuAccountIds,
	resolveDefaultFeishuAccountId: () => resolveDefaultFeishuAccountId,
	resolveDefaultFeishuAccountSelection: () => resolveDefaultFeishuAccountSelection,
	resolveFeishuAccount: () => resolveFeishuAccount,
	resolveFeishuCredentials: () => resolveFeishuCredentials,
	resolveFeishuRuntimeAccount: () => resolveFeishuRuntimeAccount
});
const { listAccountIds: listFeishuAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedFeishuAccountConfig } = createAccountListHelpers("feishu", {
	allowUnlistedDefaultAccount: true,
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["tools"],
	hasImplicitDefaultAccount: (cfg) => {
		const feishu = cfg.channels?.feishu;
		return hasConfiguredAccountValue(feishu?.appId) && hasConfiguredAccountValue(feishu?.appSecret);
	}
});
function formatSecretRefLabel(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
var FeishuSecretRefUnavailableError = class extends Error {
	constructor(path, ref) {
		super(`${path}: unresolved SecretRef "${formatSecretRefLabel(ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`);
		this.name = "FeishuSecretRefUnavailableError";
		this.path = path;
	}
};
function resolveFeishuSecretLike(params) {
	const asString = normalizeOptionalString(params.value);
	if (asString) return asString;
	const ref = coerceSecretRef(params.value, params.cfg?.secrets?.defaults);
	if (!ref) return;
	if (params.mode === "inspect") {
		if (ref.source === "env" && canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: ref.provider,
			id: ref.id
		})) return normalizeOptionalString(process.env[ref.id]);
		return;
	}
	throw new FeishuSecretRefUnavailableError(params.path, ref);
}
function resolveFeishuBaseCredentials(cfg, mode, rootConfig) {
	const appId = resolveFeishuSecretLike({
		cfg: rootConfig,
		value: cfg?.appId,
		path: "channels.feishu.appId",
		mode
	});
	const appSecret = resolveFeishuSecretLike({
		cfg: rootConfig,
		value: cfg?.appSecret,
		path: "channels.feishu.appSecret",
		mode
	});
	if (!appId || !appSecret) return null;
	return {
		appId,
		appSecret,
		domain: cfg?.domain?.replace(/^https:/i, "https:") ?? "feishu"
	};
}
function resolveFeishuEventSecrets(cfg, mode, rootConfig) {
	return {
		encryptKey: (cfg?.connectionMode ?? "websocket") === "webhook" ? resolveFeishuSecretLike({
			cfg: rootConfig,
			value: cfg?.encryptKey,
			path: "channels.feishu.encryptKey",
			mode
		}) : normalizeOptionalString(cfg?.encryptKey),
		verificationToken: resolveFeishuSecretLike({
			cfg: rootConfig,
			value: cfg?.verificationToken,
			path: "channels.feishu.verificationToken",
			mode
		})
	};
}
/**
* Resolve the default account selection and its source.
*/
function resolveDefaultFeishuAccountSelection(cfg) {
	const preferred = normalizeOptionalAccountId((cfg.channels?.feishu)?.defaultAccount);
	if (preferred) return {
		accountId: preferred,
		source: "explicit-default"
	};
	const ids = listFeishuAccountIds(cfg);
	if (ids.includes(DEFAULT_ACCOUNT_ID)) return {
		accountId: DEFAULT_ACCOUNT_ID,
		source: "mapped-default"
	};
	return {
		accountId: ids[0] ?? DEFAULT_ACCOUNT_ID,
		source: "fallback"
	};
}
/**
* Resolve the default account ID.
*/
function resolveDefaultFeishuAccountId(cfg) {
	return resolveDefaultAccountId(cfg);
}
/**
* Merge top-level config with account-specific config.
* Account-specific fields override top-level fields.
*/
function mergeFeishuAccountConfig(cfg, accountId) {
	const feishuCfg = cfg.channels?.feishu;
	const merged = resolveMergedFeishuAccountConfig(cfg, accountId);
	const topTools = feishuCfg?.tools;
	if (merged.tools === void 0 && topTools !== void 0) return {
		...merged,
		tools: topTools
	};
	if (topTools?.bitable === false) return {
		...merged,
		tools: {
			...merged.tools,
			bitable: false
		}
	};
	return merged;
}
/**
* Resolve Feishu credentials from a config.
*/
function resolveFeishuCredentials(cfg, options) {
	const mode = options?.mode ?? "strict";
	const base = resolveFeishuBaseCredentials(cfg, mode, options?.rootConfig);
	if (!base) return null;
	const eventSecrets = resolveFeishuEventSecrets(cfg, mode, options?.rootConfig);
	return {
		...base,
		...eventSecrets
	};
}
function inspectFeishuCredentials(cfg, rootConfig) {
	return resolveFeishuCredentials(cfg, {
		mode: "inspect",
		rootConfig
	});
}
function buildResolvedFeishuAccount(params) {
	const hasExplicitAccountId = typeof params.accountId === "string" && params.accountId.trim() !== "";
	const defaultSelection = hasExplicitAccountId ? null : resolveDefaultFeishuAccountSelection(params.cfg);
	const accountId = hasExplicitAccountId ? normalizeAccountId(params.accountId) : defaultSelection?.accountId ?? DEFAULT_ACCOUNT_ID;
	const selectionSource = hasExplicitAccountId ? "explicit" : defaultSelection?.source ?? "fallback";
	const baseEnabled = (params.cfg.channels?.feishu)?.enabled !== false;
	const merged = mergeFeishuAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const baseCreds = resolveFeishuBaseCredentials(merged, params.baseMode, params.cfg);
	const eventSecrets = resolveFeishuEventSecrets(merged, params.eventSecretMode, params.cfg);
	const accountName = merged.name;
	return {
		accountId,
		selectionSource,
		enabled,
		configured: Boolean(baseCreds),
		name: typeof accountName === "string" ? accountName.trim() || void 0 : void 0,
		appId: baseCreds?.appId,
		appSecret: baseCreds?.appSecret,
		encryptKey: eventSecrets.encryptKey,
		verificationToken: eventSecrets.verificationToken,
		domain: baseCreds?.domain ?? "feishu",
		config: merged
	};
}
/**
* Resolve a read-only Feishu account snapshot for CLI/config surfaces.
* Unresolved SecretRefs are treated as unavailable instead of throwing.
*/
function resolveFeishuAccount(params) {
	return buildResolvedFeishuAccount({
		...params,
		baseMode: "inspect",
		eventSecretMode: "inspect"
	});
}
/**
* Resolve a runtime Feishu account.
* Required app credentials stay strict; event-only secrets can be required by callers.
*/
function resolveFeishuRuntimeAccount(params, options) {
	return buildResolvedFeishuAccount({
		...params,
		baseMode: "strict",
		eventSecretMode: options?.requireEventSecrets ? "strict" : "inspect"
	});
}
/**
* List all enabled and configured accounts.
*/
function listEnabledFeishuAccounts(cfg) {
	return listFeishuAccountIds(cfg).map((accountId) => resolveFeishuAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled && account.configured);
}
//#endregion
export { resolveDefaultFeishuAccountId as a, listFeishuAccountIds as i, inspectFeishuCredentials as n, resolveFeishuAccount as o, listEnabledFeishuAccounts as r, resolveFeishuRuntimeAccount as s, accounts_exports as t };
