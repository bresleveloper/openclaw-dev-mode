import { a as coerceSecretRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { n as readProviderEnvValue, r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-DSE2VVU-.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import { t as resolveReadOnlyEnvSecretRef } from "./secret-ref-readonly-COngYS0C.mjs";
import { i as resolveProviderWebSearchPluginConfig } from "./web-search-provider-config-CW8dwkHd.mjs";
//#region extensions/xai/src/tool-auth-shared.ts
const XAI_API_KEY_ENV_VAR = "XAI_API_KEY";
const XAI_PROVIDER_ID = "xai";
function readConfiguredOrManagedApiKey(value) {
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	const ref = coerceSecretRef(value);
	return ref ? resolveNonEnvSecretRefApiKeyMarker(ref.source) : void 0;
}
function readConfiguredRuntimeApiKey(value, path, cfg) {
	return resolveReadOnlyEnvSecretRef({
		value,
		path,
		cfg,
		expectedEnvId: XAI_API_KEY_ENV_VAR,
		normalizeValue: normalizeSecretInputString
	});
}
function readPluginXaiWebSearchApiKeyResult(cfg) {
	return readConfiguredRuntimeApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey, "plugins.entries.xai.config.webSearch.apiKey", cfg);
}
function resolveConfiguredXaiToolApiKeyResult(params) {
	const runtimePlugin = readPluginXaiWebSearchApiKeyResult(params.runtimeConfig);
	if (runtimePlugin.status === "available" || runtimePlugin.status === "blocked") return runtimePlugin;
	const sourcePlugin = readPluginXaiWebSearchApiKeyResult(params.sourceConfig);
	if (sourcePlugin.status === "available" || sourcePlugin.status === "blocked") return sourcePlugin;
	return { status: "missing" };
}
function hasXaiAuthProfile(auth) {
	return auth?.hasAuthForProvider?.(XAI_PROVIDER_ID) === true;
}
async function resolveXaiAuthProfileApiKey(auth) {
	const value = await auth?.resolveApiKeyForProvider?.(XAI_PROVIDER_ID);
	return normalizeSecretInputString(value);
}
function resolveFallbackXaiAuth(cfg) {
	const pluginApiKey = readConfiguredOrManagedApiKey(resolveProviderWebSearchPluginConfig(cfg, "xai")?.apiKey);
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
	return hasXaiAuthProfile(params.auth) || Boolean(readProviderEnvValue([XAI_API_KEY_ENV_VAR]));
}
//#endregion
export { resolveFallbackXaiAuth as n, resolveXaiToolApiKeyWithAuth as r, isXaiToolEnabled as t };
