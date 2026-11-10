let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
//#region extensions/msteams/src/token-config.ts
function resolveAuthType(cfg, options) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if ((options?.allowEnvFallback === false ? void 0 : process.env.MSTEAMS_AUTH_TYPE) === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	return (0, openclaw_plugin_sdk_string_coerce_runtime.readNonBlankString)(configValue) ?? (0, openclaw_plugin_sdk_string_coerce_runtime.readNonBlankString)(envValue);
}
function resolveMSTeamsAppId(cfg, allowEnvFallback) {
	return (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appId) || (allowEnvFallback ? (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_ID) : void 0);
}
function resolveMSTeamsTenantId(cfg, allowEnvFallback) {
	return (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.tenantId) || (allowEnvFallback ? (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_TENANT_ID) : void 0);
}
function hasConfiguredMSTeamsCredentials(cfg, options) {
	return inspectMSTeamsCredentials(cfg, options).status !== "missing";
}
function resolveMSTeamsCredentials(cfg, options) {
	const allowEnvFallback = options?.allowEnvFallback ?? true;
	const pathPrefix = options?.pathPrefix ?? "channels.msteams";
	const authType = resolveAuthType(cfg, { allowEnvFallback });
	const appId = resolveMSTeamsAppId(cfg, allowEnvFallback);
	const tenantId = resolveMSTeamsTenantId(cfg, allowEnvFallback);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, allowEnvFallback ? process.env.MSTEAMS_CERTIFICATE_PATH : void 0);
		const certificateThumbprint = cfg?.certificateThumbprint || (allowEnvFallback ? process.env.MSTEAMS_CERTIFICATE_THUMBPRINT : void 0) || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? (allowEnvFallback ? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true" : false);
		const managedIdentityClientId = cfg?.managedIdentityClientId || (allowEnvFallback ? process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID : void 0) || void 0;
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
		path: `${pathPrefix}.appPassword`
	}) || (allowEnvFallback ? (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_PASSWORD) : void 0);
	if (!appPassword) return;
	return {
		type: "secret",
		appId,
		appPassword,
		tenantId
	};
}
/** Read credential availability for diagnostics without redeeming unresolved SecretRefs. */
function inspectMSTeamsCredentials(cfg, options) {
	const allowEnvFallback = options?.allowEnvFallback ?? true;
	const authType = resolveAuthType(cfg, { allowEnvFallback });
	const appId = resolveMSTeamsAppId(cfg, allowEnvFallback);
	const tenantId = resolveMSTeamsTenantId(cfg, allowEnvFallback);
	if (!appId || !tenantId) return { status: "missing" };
	if (authType === "federated") {
		const credentials = resolveMSTeamsCredentials(cfg, { allowEnvFallback });
		return credentials?.type === "federated" ? {
			credentials,
			status: "available"
		} : { status: "missing" };
	}
	if ((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(cfg?.appPassword)) return { status: "available" };
	if ((0, openclaw_plugin_sdk_secret_input.hasConfiguredSecretInput)(cfg?.appPassword)) return { status: "configured_unavailable" };
	return (allowEnvFallback ? (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(process.env.MSTEAMS_APP_PASSWORD) : void 0) ? { status: "available" } : { status: "missing" };
}
//#endregion
Object.defineProperty(exports, "hasConfiguredMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return hasConfiguredMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "inspectMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return inspectMSTeamsCredentials;
	}
});
Object.defineProperty(exports, "resolveMSTeamsCredentials", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsCredentials;
	}
});
