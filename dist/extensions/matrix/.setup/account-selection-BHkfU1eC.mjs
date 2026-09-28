import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { n as listMatrixEnvAccountIds, t as getMatrixScopedEnvVarNames } from "./env-vars-dGqak9dN.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { listCombinedAccountIds, listConfiguredAccountIds, resolveListedDefaultAccountId, resolveNormalizedAccountEntry } from "openclaw/plugin-sdk/account-core";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/secret-input";
//#region extensions/matrix/src/auth-precedence.ts
const MATRIX_DEFAULT_ACCOUNT_AUTH_ONLY_FIELDS = /* @__PURE__ */ new Set([
	"userId",
	"accessToken",
	"password",
	"deviceId"
]);
function resolveMatrixStringSourceValue(value) {
	return typeof value === "string" ? value : "";
}
function shouldAllowBaseAuthFallback(accountId, field) {
	return normalizeAccountId(accountId) === DEFAULT_ACCOUNT_ID || !MATRIX_DEFAULT_ACCOUNT_AUTH_ONLY_FIELDS.has(field);
}
function resolveMatrixAccountStringValues(params) {
	const fields = [
		"homeserver",
		"userId",
		"accessToken",
		"password",
		"deviceId",
		"deviceName"
	];
	const resolved = {};
	for (const field of fields) resolved[field] = resolveMatrixStringSourceValue(params.account?.[field]) || resolveMatrixStringSourceValue(params.scopedEnv?.[field]) || (shouldAllowBaseAuthFallback(params.accountId, field) ? resolveMatrixStringSourceValue(params.channel?.[field]) || resolveMatrixStringSourceValue(params.globalEnv?.[field]) : "");
	return resolved;
}
//#endregion
//#region extensions/matrix/src/matrix/client/env-auth.ts
function cleanEnv(value) {
	return normalizeOptionalString(value) ?? "";
}
function resolveGlobalMatrixEnvConfig(env) {
	return {
		homeserver: cleanEnv(env.MATRIX_HOMESERVER),
		userId: cleanEnv(env.MATRIX_USER_ID),
		accessToken: cleanEnv(env.MATRIX_ACCESS_TOKEN) || void 0,
		password: cleanEnv(env.MATRIX_PASSWORD) || void 0,
		deviceId: cleanEnv(env.MATRIX_DEVICE_ID) || void 0,
		deviceName: cleanEnv(env.MATRIX_DEVICE_NAME) || void 0
	};
}
function hasReadyMatrixEnvAuth(config) {
	const homeserver = cleanEnv(config.homeserver);
	const userId = cleanEnv(config.userId);
	const accessToken = cleanEnv(config.accessToken);
	const password = cleanEnv(config.password);
	return Boolean(homeserver && (accessToken || userId && password));
}
function resolveScopedMatrixEnvConfig(accountId, env = process.env) {
	const keys = getMatrixScopedEnvVarNames(accountId);
	return {
		homeserver: cleanEnv(env[keys.homeserver]),
		userId: cleanEnv(env[keys.userId]),
		accessToken: cleanEnv(env[keys.accessToken]) || void 0,
		password: cleanEnv(env[keys.password]) || void 0,
		deviceId: cleanEnv(env[keys.deviceId]) || void 0,
		deviceName: cleanEnv(env[keys.deviceName]) || void 0
	};
}
function resolveMatrixEnvAuthReadiness(accountId, env = process.env) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const scoped = resolveScopedMatrixEnvConfig(normalizedAccountId, env);
	const scopedReady = hasReadyMatrixEnvAuth(scoped);
	if (normalizedAccountId !== DEFAULT_ACCOUNT_ID) {
		const keys = getMatrixScopedEnvVarNames(normalizedAccountId);
		return {
			ready: scopedReady,
			homeserver: scoped.homeserver || void 0,
			userId: scoped.userId || void 0,
			sourceHint: `${keys.homeserver} (+ auth vars)`,
			missingMessage: `Set per-account env vars for "${normalizedAccountId}" (for example ${keys.homeserver} + ${keys.accessToken} or ${keys.userId} + ${keys.password}).`
		};
	}
	const defaultScoped = resolveScopedMatrixEnvConfig(DEFAULT_ACCOUNT_ID, env);
	const global = resolveGlobalMatrixEnvConfig(env);
	const defaultScopedReady = hasReadyMatrixEnvAuth(defaultScoped);
	const globalReady = hasReadyMatrixEnvAuth(global);
	const defaultKeys = getMatrixScopedEnvVarNames(DEFAULT_ACCOUNT_ID);
	return {
		ready: defaultScopedReady || globalReady,
		homeserver: defaultScoped.homeserver || global.homeserver || void 0,
		userId: defaultScoped.userId || global.userId || void 0,
		sourceHint: "MATRIX_* or MATRIX_DEFAULT_*",
		missingMessage: `Set Matrix env vars for the default account (for example MATRIX_HOMESERVER + MATRIX_ACCESS_TOKEN, MATRIX_USER_ID + MATRIX_PASSWORD, or ${defaultKeys.homeserver} + ${defaultKeys.accessToken}).`
	};
}
//#endregion
//#region extensions/matrix/src/account-selection.ts
var account_selection_exports = /* @__PURE__ */ __exportAll({
	findMatrixAccountEntry: () => findMatrixAccountEntry,
	hasImplicitMatrixAccountConfig: () => hasImplicitMatrixAccountConfig,
	requiresExplicitMatrixDefaultAccount: () => requiresExplicitMatrixDefaultAccount,
	resolveConfiguredMatrixAccountIds: () => resolveConfiguredMatrixAccountIds,
	resolveMatrixChannelConfig: () => resolveMatrixChannelConfig,
	resolveMatrixDefaultOrOnlyAccountId: () => resolveMatrixDefaultOrOnlyAccountId
});
function readConfiguredMatrixString(value) {
	return normalizeOptionalString(value) ?? "";
}
function readConfiguredMatrixSecretSource(value) {
	return hasConfiguredSecretInput(value) ? "configured" : "";
}
function resolveMatrixChannelStringSources(entry) {
	if (!entry) return {};
	return {
		homeserver: readConfiguredMatrixString(entry.homeserver),
		userId: readConfiguredMatrixString(entry.userId),
		accessToken: readConfiguredMatrixSecretSource(entry.accessToken),
		password: readConfiguredMatrixSecretSource(entry.password),
		deviceId: readConfiguredMatrixString(entry.deviceId),
		deviceName: readConfiguredMatrixString(entry.deviceName)
	};
}
function hasUsableResolvedMatrixAuth(values) {
	return Boolean(values.homeserver && (values.accessToken || values.userId));
}
function hasFreshResolvedMatrixAuth(values) {
	return Boolean(values.homeserver && (values.accessToken || values.userId && values.password));
}
function resolveEffectiveMatrixAccountSources(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	return resolveMatrixAccountStringValues({
		accountId: normalizedAccountId,
		scopedEnv: resolveScopedMatrixEnvConfig(normalizedAccountId, params.env),
		channel: resolveMatrixChannelStringSources(params.channel),
		globalEnv: resolveGlobalMatrixEnvConfig(params.env)
	});
}
function hasUsableEffectiveMatrixAccountSource(params) {
	return hasUsableResolvedMatrixAuth(resolveEffectiveMatrixAccountSources(params));
}
function hasFreshEffectiveMatrixAccountSource(params) {
	return hasFreshResolvedMatrixAuth(resolveEffectiveMatrixAccountSources(params));
}
function hasConfiguredDefaultMatrixAccountSource(params) {
	return hasFreshEffectiveMatrixAccountSource({
		channel: params.channel,
		accountId: DEFAULT_ACCOUNT_ID,
		env: params.env
	});
}
function resolveMatrixChannelConfig(cfg) {
	return isRecord(cfg.channels?.matrix) ? cfg.channels.matrix : null;
}
function findMatrixAccountEntry(cfg, accountId) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return null;
	const accounts = isRecord(channel.accounts) ? channel.accounts : null;
	if (!accounts) return null;
	const entry = resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId);
	return isRecord(entry) ? entry : null;
}
function hasImplicitMatrixAccountConfig(cfg, accountId, env = process.env) {
	const normalized = normalizeAccountId(accountId);
	return (normalized === DEFAULT_ACCOUNT_ID || listMatrixEnvAccountIds(env).some((id) => normalizeAccountId(id) === normalized)) && hasUsableEffectiveMatrixAccountSource({
		channel: resolveMatrixChannelConfig(cfg),
		accountId: normalized,
		env
	});
}
function resolveConfiguredMatrixAccountIds(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	const configuredAccountIds = listConfiguredAccountIds({
		accounts: channel && isRecord(channel.accounts) ? channel.accounts : void 0,
		normalizeAccountId
	});
	if (hasConfiguredDefaultMatrixAccountSource({
		channel,
		env
	})) configuredAccountIds.push(DEFAULT_ACCOUNT_ID);
	const readyEnvAccountIds = listMatrixEnvAccountIds(env).filter((accountId) => normalizeAccountId(accountId) === DEFAULT_ACCOUNT_ID ? hasConfiguredDefaultMatrixAccountSource({
		channel,
		env
	}) : hasUsableEffectiveMatrixAccountSource({
		channel,
		accountId,
		env
	}));
	return listCombinedAccountIds({
		configuredAccountIds,
		additionalAccountIds: readyEnvAccountIds,
		fallbackAccountIdWhenEmpty: channel ? DEFAULT_ACCOUNT_ID : void 0
	});
}
function resolveMatrixDefaultOrOnlyAccountId(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return DEFAULT_ACCOUNT_ID;
	const configuredDefault = normalizeOptionalAccountId(typeof channel.defaultAccount === "string" ? channel.defaultAccount : void 0);
	const configuredAccountIds = resolveConfiguredMatrixAccountIds(cfg, env);
	return resolveListedDefaultAccountId({
		accountIds: configuredAccountIds,
		configuredDefaultAccountId: configuredDefault,
		ambiguousFallbackAccountId: DEFAULT_ACCOUNT_ID
	});
}
function requiresExplicitMatrixDefaultAccount(cfg, env = process.env) {
	const channel = resolveMatrixChannelConfig(cfg);
	if (!channel) return false;
	const configuredAccountIds = resolveConfiguredMatrixAccountIds(cfg, env);
	if (configuredAccountIds.length <= 1) return false;
	if (configuredAccountIds.includes(DEFAULT_ACCOUNT_ID)) return false;
	const configuredDefault = normalizeOptionalAccountId(typeof channel.defaultAccount === "string" ? channel.defaultAccount : void 0);
	return !(configuredDefault && configuredAccountIds.includes(configuredDefault));
}
//#endregion
export { resolveConfiguredMatrixAccountIds as a, resolveGlobalMatrixEnvConfig as c, resolveMatrixAccountStringValues as d, requiresExplicitMatrixDefaultAccount as i, resolveMatrixEnvAuthReadiness as l, findMatrixAccountEntry as n, resolveMatrixChannelConfig as o, hasImplicitMatrixAccountConfig as r, resolveMatrixDefaultOrOnlyAccountId as s, account_selection_exports as t, resolveScopedMatrixEnvConfig as u };
