import { a as coerceSecretRef, s as isLegacySecretRefEnvMarker, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
//#region src/web/provider-runtime-shared.ts
function resolveWebProviderConfig(cfg, kind) {
	const webConfig = cfg?.tools?.web;
	if (!webConfig || typeof webConfig !== "object") return;
	const toolConfig = webConfig[kind];
	if (!toolConfig || typeof toolConfig !== "object") return;
	return toolConfig;
}
function readWebProviderEnvValue(envVars, processEnv = process.env) {
	for (const envVar of envVars) {
		const value = normalizeSecretInput(processEnv[envVar]);
		if (value) return value;
	}
}
function providerRequiresCredential(provider) {
	return provider.requiresCredential !== false;
}
function hasWebProviderEntryCredential(params) {
	if (!providerRequiresCredential(params.provider)) return true;
	const rawValue = params.resolveRawValue({
		provider: params.provider,
		config: params.config,
		toolConfig: params.toolConfig
	});
	if (isLegacySecretRefEnvMarker(rawValue)) return false;
	const configuredRef = coerceSecretRef(rawValue);
	if (configuredRef && configuredRef.source !== "env") return true;
	if (configuredRef ? "" : normalizeSecretInput(normalizeSecretInputString(rawValue))) return true;
	if (params.provider.authProviderId && params.resolveProviderAuthValue?.(params.provider.authProviderId)) return true;
	if (params.resolveEnvValue({
		provider: params.provider,
		configuredEnvVarId: configuredRef?.source === "env" ? configuredRef.id : void 0
	})) return true;
	const fallbackRawValue = params.resolveFallbackRawValue?.({
		provider: params.provider,
		config: params.config,
		toolConfig: params.toolConfig
	});
	if (isLegacySecretRefEnvMarker(fallbackRawValue)) return false;
	const fallbackRef = coerceSecretRef(fallbackRawValue);
	if (fallbackRef && fallbackRef.source !== "env") return true;
	if (fallbackRef ? "" : normalizeSecretInput(normalizeSecretInputString(fallbackRawValue))) return true;
	return Boolean(fallbackRef?.source === "env" ? params.resolveEnvValue({
		provider: params.provider,
		configuredEnvVarId: fallbackRef.id
	}) : void 0);
}
//#endregion
export { resolveWebProviderConfig as i, providerRequiresCredential as n, readWebProviderEnvValue as r, hasWebProviderEntryCredential as t };
