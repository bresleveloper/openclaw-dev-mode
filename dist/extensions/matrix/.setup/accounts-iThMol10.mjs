import { a as resolveConfiguredMatrixAccountIds, c as resolveGlobalMatrixEnvConfig, d as resolveMatrixAccountStringValues, s as resolveMatrixDefaultOrOnlyAccountId, u as resolveScopedMatrixEnvConfig } from "./account-selection-BHkfU1eC.mjs";
import { a as resolveMatrixAccountConfig, o as resolveMatrixBaseConfig, t as findMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { a as loadMatrixCredentials, o as loadMatrixCredentialsAsync, r as credentialsMatchConfig, t as captureMatrixCredentialsEnv } from "./credentials-read-Q5sHkkHv.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/secret-input";
//#region extensions/matrix/src/matrix/accounts.ts
function clean(value) {
	return normalizeOptionalString(value) ?? "";
}
function resolveMatrixAccountAuthView(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const matrix = resolveMatrixBaseConfig(params.cfg);
	const account = findMatrixAccountConfig(params.cfg, normalizedAccountId) ?? {};
	const resolvedStrings = resolveMatrixAccountStringValues({
		accountId: normalizedAccountId,
		account: {
			homeserver: clean(account.homeserver),
			userId: clean(account.userId),
			accessToken: typeof account.accessToken === "string" ? clean(account.accessToken) : "",
			password: typeof account.password === "string" ? clean(account.password) : "",
			deviceId: clean(account.deviceId),
			deviceName: clean(account.deviceName)
		},
		scopedEnv: resolveScopedMatrixEnvConfig(normalizedAccountId, params.env),
		channel: {
			homeserver: clean(matrix.homeserver),
			userId: clean(matrix.userId),
			accessToken: typeof matrix.accessToken === "string" ? clean(matrix.accessToken) : "",
			password: typeof matrix.password === "string" ? clean(matrix.password) : "",
			deviceId: clean(matrix.deviceId),
			deviceName: clean(matrix.deviceName)
		},
		globalEnv: resolveGlobalMatrixEnvConfig(params.env)
	});
	return {
		homeserver: resolvedStrings.homeserver,
		userId: resolvedStrings.userId,
		accessToken: resolvedStrings.accessToken || void 0,
		password: resolvedStrings.password || void 0
	};
}
function resolveMatrixAccountUserId(authView, stored) {
	const configuredUserId = authView.userId.trim();
	if (configuredUserId) return configuredUserId;
	if (!stored) return null;
	if (authView.homeserver && stored.homeserver !== authView.homeserver) return null;
	if (authView.accessToken && stored.accessToken !== authView.accessToken) return null;
	return stored.userId.trim() || null;
}
function listMatrixAccountIds(cfg) {
	const ids = resolveConfiguredMatrixAccountIds(cfg, process.env);
	return ids.length > 0 ? ids : [DEFAULT_ACCOUNT_ID];
}
function resolveDefaultMatrixAccountId(cfg) {
	return normalizeAccountId(resolveMatrixDefaultOrOnlyAccountId(cfg));
}
async function resolveConfiguredMatrixBotUserIds(params) {
	const env = params.env ?? process.env;
	const currentAccountId = normalizeAccountId(params.accountId);
	const accounts = [.../* @__PURE__ */ new Set([...resolveConfiguredMatrixAccountIds(params.cfg, env), DEFAULT_ACCOUNT_ID])].filter((accountId) => normalizeAccountId(accountId) !== currentAccountId).map((accountId) => prepareMatrixAccount({
		cfg: params.cfg,
		accountId,
		env
	}));
	const ids = /* @__PURE__ */ new Set();
	if (accounts.length === 0 || params.abortSignal?.aborted) return ids;
	const credentialsEnv = captureMatrixCredentialsEnv(env);
	for (const prepared of accounts) {
		if (params.abortSignal?.aborted) break;
		const stored = await loadMatrixCredentialsAsync(credentialsEnv, prepared.account.accountId);
		if (!isMatrixAccountConfigured(prepared, stored)) continue;
		const userId = resolveMatrixAccountUserId(prepared.authView, stored);
		if (userId) ids.add(userId);
	}
	return ids;
}
function prepareMatrixAccount(params) {
	const env = params.env ?? process.env;
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultMatrixAccountId(params.cfg));
	const matrixBase = resolveMatrixBaseConfig(params.cfg);
	const base = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId,
		env
	});
	const explicitAuthConfig = accountId === DEFAULT_ACCOUNT_ID ? base : findMatrixAccountConfig(params.cfg, accountId) ?? {};
	const enabled = base.enabled !== false && matrixBase.enabled !== false;
	const authView = resolveMatrixAccountAuthView({
		cfg: params.cfg,
		accountId,
		env
	});
	const hasHomeserver = Boolean(authView.homeserver);
	const hasUserId = Boolean(authView.userId);
	const hasAccessToken = Boolean(authView.accessToken) || hasConfiguredSecretInput(explicitAuthConfig.accessToken);
	const hasPassword = Boolean(authView.password);
	const hasPasswordAuth = hasUserId && (hasPassword || hasConfiguredSecretInput(explicitAuthConfig.password));
	return {
		authView,
		hasHomeserver,
		hasConfiguredAuth: hasAccessToken || hasPasswordAuth,
		account: {
			accountId,
			enabled,
			name: normalizeOptionalString(base.name),
			homeserver: authView.homeserver || void 0,
			userId: authView.userId || void 0,
			config: base
		}
	};
}
function isMatrixAccountConfigured(prepared, stored) {
	const { authView } = prepared;
	const hasStored = stored && authView.homeserver ? credentialsMatchConfig(stored, {
		homeserver: authView.homeserver,
		userId: authView.userId || ""
	}) : false;
	return prepared.hasHomeserver && (prepared.hasConfiguredAuth || hasStored);
}
function resolveMatrixAccount(params) {
	const prepared = prepareMatrixAccount(params);
	const stored = loadMatrixCredentials(params.env ?? process.env, prepared.account.accountId);
	return {
		...prepared.account,
		configured: isMatrixAccountConfigured(prepared, stored)
	};
}
//#endregion
export { resolveMatrixAccount as i, resolveConfiguredMatrixBotUserIds as n, resolveDefaultMatrixAccountId as r, listMatrixAccountIds as t };
