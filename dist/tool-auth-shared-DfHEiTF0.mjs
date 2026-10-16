import { a as coerceSecretRef, f as normalizeSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { n as readProviderEnvValue, r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import "./secret-input-BXhRrpGu.mjs";
import { t as resolveReadOnlyEnvSecretRef } from "./secret-ref-readonly-CV8L1W2H.mjs";
import { s as resolvePluginWebSearchConfig } from "./web-search-provider-config-COuPfUzM.mjs";
//#region extensions/xai/src/tool-auth-shared.ts
const XAI_API_KEY_ENV_VAR = "XAI_API_KEY";
const XAI_PROVIDER_ID = "xai";
function readConfiguredOrManagedApiKey(value) {
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	const ref = coerceSecretRef(value);
	return ref ? resolveNonEnvSecretRefApiKeyMarker(ref.source) : void 0;
}
function readPluginXaiWebSearchApiKeyResult(cfg) {
	return resolveReadOnlyEnvSecretRef({
		value: resolvePluginWebSearchConfig(cfg, "xai")?.apiKey,
		path: "plugins.entries.xai.config.webSearch.apiKey",
		cfg,
		expectedEnvId: XAI_API_KEY_ENV_VAR,
		normalizeValue: normalizeSecretInputString
	});
}
function resolveConfiguredXaiToolApiKeyResult(params) {
	const runtimePlugin = readPluginXaiWebSearchApiKeyResult(params.runtimeConfig);
	return runtimePlugin.status === "missing" ? readPluginXaiWebSearchApiKeyResult(params.sourceConfig) : runtimePlugin;
}
async function resolveXaiAuthProfileApiKey(auth) {
	const value = await auth?.resolveApiKeyForProvider?.(XAI_PROVIDER_ID);
	return normalizeSecretInputString(value);
}
function resolveFallbackXaiAuth(cfg) {
	const pluginApiKey = readConfiguredOrManagedApiKey(resolvePluginWebSearchConfig(cfg, "xai")?.apiKey);
	if (pluginApiKey) return {
		apiKey: pluginApiKey,
		source: "plugins.entries.xai.config.webSearch.apiKey"
	};
}
async function resolveXaiToolApiKeyWithAuth(params) {
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return configured.value;
	if (configured.status === "blocked") return;
	return await resolveXaiAuthProfileApiKey(params.auth) ?? readProviderEnvValue([XAI_API_KEY_ENV_VAR]);
}
function isXaiToolEnabled(params) {
	if (params.enabled === false) return false;
	const configured = resolveConfiguredXaiToolApiKeyResult(params);
	if (configured.status === "available") return true;
	if (configured.status === "blocked") return false;
	return params.auth?.hasAuthForProvider?.(XAI_PROVIDER_ID) === true || Boolean(readProviderEnvValue([XAI_API_KEY_ENV_VAR]));
}
//#endregion
export { resolveFallbackXaiAuth as n, resolveXaiToolApiKeyWithAuth as r, isXaiToolEnabled as t };
