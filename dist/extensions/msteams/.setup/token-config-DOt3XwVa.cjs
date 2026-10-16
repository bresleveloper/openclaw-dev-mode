const require_runtime = require("./runtime-gZTAuFux.cjs");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
//#region extensions/msteams/src/delegated-state.ts
const MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME = "msteams-delegated.json";
const MSTEAMS_DELEGATED_TOKEN_NAMESPACE = "delegated-token";
const MSTEAMS_DELEGATED_TOKEN_KEY = "current";
function openDelegatedTokenStore(env) {
	return require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: MSTEAMS_DELEGATED_TOKEN_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function normalizeMSTeamsDelegatedTokens(value) {
	if (!value || typeof value !== "object") return null;
	const token = value;
	if (typeof token.accessToken !== "string" || !token.accessToken || typeof token.refreshToken !== "string" || !token.refreshToken || typeof token.expiresAt !== "number" || !Number.isFinite(token.expiresAt) || !Array.isArray(token.scopes) || !token.scopes.every((scope) => typeof scope === "string" && scope.length > 0)) return null;
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		expiresAt: token.expiresAt,
		scopes: [...token.scopes],
		...typeof token.userPrincipalName === "string" ? { userPrincipalName: token.userPrincipalName } : {}
	};
}
async function loadMSTeamsDelegatedTokens(env) {
	return normalizeMSTeamsDelegatedTokens(await openDelegatedTokenStore(env).lookup("current")) ?? void 0;
}
async function saveMSTeamsDelegatedTokens(tokens, env) {
	const normalized = normalizeMSTeamsDelegatedTokens(tokens);
	if (!normalized) throw new Error("Invalid Microsoft Teams delegated token payload");
	await openDelegatedTokenStore(env).register(MSTEAMS_DELEGATED_TOKEN_KEY, normalized);
}
//#endregion
//#region extensions/msteams/src/token-config.ts
function resolveAuthType(cfg) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if (process.env.MSTEAMS_AUTH_TYPE === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	return (0, openclaw_plugin_sdk_string_coerce_runtime.readNonBlankString)(configValue) ?? (0, openclaw_plugin_sdk_string_coerce_runtime.readNonBlankString)(envValue);
}
function hasConfiguredMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const hasAppId = Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID));
	const hasTenantId = Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID));
	if (authType === "federated") {
		const hasCert = Boolean(resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH));
		const hasManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		return hasAppId && hasTenantId && (hasCert || hasManagedIdentity);
	}
	return Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) && (0, openclaw_plugin_sdk_secret_input.hasConfiguredSecretInput)(cfg?.appPassword) && (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId));
}
function resolveMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const appId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID);
	const tenantId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH);
		const certificateThumbprint = cfg?.certificateThumbprint || process.env.MSTEAMS_CERTIFICATE_THUMBPRINT || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		const managedIdentityClientId = cfg?.managedIdentityClientId || process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID || void 0;
		if (!certificatePath && !useManagedIdentity) return;
		return {
			type: "federated",
			appId,
			tenantId,
			certificatePath,
			certificateThumbprint,
			useManagedIdentity: useManagedIdentity || void 0,
			managedIdentityClientId
		};
	}
	const appPassword = (0, openclaw_plugin_sdk_secret_input.normalizeResolvedSecretInputString)({
		value: cfg?.appPassword,
		path: "channels.msteams.appPassword"
	}) || (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_PASSWORD);
	if (!appPassword) return;
	return {
		type: "secret",
		appId,
		appPassword,
		tenantId
	};
}
//#endregion
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_KEY", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_KEY;
	}
});
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME;
	}
});
Object.defineProperty(exports, "MSTEAMS_DELEGATED_TOKEN_NAMESPACE", {
	enumerable: true,
	get: function() {
		return MSTEAMS_DELEGATED_TOKEN_NAMESPACE;
	}
});
Object.defineProperty(exports, "hasConfiguredMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return hasConfiguredMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "loadMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return loadMSTeamsDelegatedTokens;
	}
});
Object.defineProperty(exports, "normalizeMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return normalizeMSTeamsDelegatedTokens;
	}
});
Object.defineProperty(exports, "resolveMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "saveMSTeamsDelegatedTokens", {
	enumerable: true,
	get: function() {
		return saveMSTeamsDelegatedTokens;
	}
});
