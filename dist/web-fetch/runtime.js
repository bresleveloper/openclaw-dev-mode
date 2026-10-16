import { o as normalizeLowercaseStringOrEmpty } from "../string-coerce-1VuiLaaR.mjs";
import { C as resolveRuntimeConfigCacheKey } from "../runtime-snapshot-DYptB0Cf.mjs";
import { d as getActivePluginRegistryVersion } from "../runtime-D4MkflNJ.mjs";
import { i as logVerbose } from "../globals-BXbZ1A_g.mjs";
import { S as getActiveRuntimeWebToolsMetadataFromState } from "../runtime-state-D5wZ6Dom.mjs";
import { n as sortPluginEntriesForAutoDetect } from "../plugin-entry-order-DxrT0ucv.mjs";
import { n as resolveRuntimeWebFetchProviders, t as resolvePluginWebFetchProviders } from "../web-fetch-providers.runtime-IahMVK-P.mjs";
import { i as resolveWebProviderConfig, n as providerRequiresCredential, r as readWebProviderEnvValue, t as hasWebProviderEntryCredential } from "../provider-runtime-shared-rD0cvENJ.mjs";
//#region src/web-fetch/runtime.ts
const webFetchProviderCache = /* @__PURE__ */ new WeakMap();
function hasEntryCredential(provider, config) {
	return hasWebProviderEntryCredential({
		provider,
		config,
		resolveEnvValue: () => readWebProviderEnvValue(provider.envVars)
	});
}
/** Reports whether a web_fetch provider has usable credentials. */
function isWebFetchProviderConfigured(params) {
	return hasEntryCredential(params.provider, params.config);
}
/** Lists web_fetch providers available to runtime selection. */
function listWebFetchProviders(params) {
	return resolvePluginWebFetchProviders({ config: params?.config });
}
/** Auto-detects a web_fetch provider after explicit selections have been resolved. */
function resolveAutoWebFetchProviderId(params) {
	for (const provider of params.providers) {
		const requiresCredential = providerRequiresCredential(provider);
		if (!hasEntryCredential(requiresCredential ? provider : {
			...provider,
			requiresCredential: true
		}, params.config)) continue;
		const source = requiresCredential ? `"${provider.id}" from available API keys` : `keyless provider "${provider.id}"`;
		logVerbose(`web_fetch: ${params.configuredProviderId ? `invalid configured provider "${params.configuredProviderId}", ` : ""}auto-detected ${source}`);
		return provider.id;
	}
	return "";
}
function resolveWebFetchProvidersForOptions(options) {
	const config = options?.config;
	const cacheKey = config ? JSON.stringify([
		getActivePluginRegistryVersion(),
		options?.sandboxed === true,
		options?.preferRuntimeProviders === true
	]) : "";
	const configFingerprint = config ? resolveRuntimeConfigCacheKey(config) : "";
	const cached = config ? webFetchProviderCache.get(config) : void 0;
	if (cached?.cacheKey === cacheKey && cached.configFingerprint === configFingerprint) return cached.providers;
	const providers = sortPluginEntriesForAutoDetect(options?.sandboxed ? resolvePluginWebFetchProviders({
		config: options?.config,
		sandboxed: true
	}) : options?.preferRuntimeProviders ? resolveRuntimeWebFetchProviders({ config: options?.config }) : resolvePluginWebFetchProviders({ config: options?.config }));
	if (config && providers.length > 0) webFetchProviderCache.set(config, {
		cacheKey,
		configFingerprint,
		providers
	});
	return providers;
}
/** Resolves the executable web_fetch provider tool definition. */
function resolveWebFetchDefinition(options) {
	const fetch = resolveWebProviderConfig(options?.config, "fetch");
	if (fetch?.enabled === false) return null;
	const runtimeWebFetch = options?.runtimeWebFetch ?? getActiveRuntimeWebToolsMetadataFromState()?.fetch;
	const providers = resolveWebFetchProvidersForOptions(options);
	if (providers.length === 0) return null;
	const configuredProviderId = normalizeLowercaseStringOrEmpty(fetch?.provider);
	const providerId = options?.providerId ?? (configuredProviderId ? providers.find((entry) => entry.id === configuredProviderId)?.id : void 0) ?? runtimeWebFetch?.selectedProvider ?? resolveAutoWebFetchProviderId({
		config: options?.config,
		configuredProviderId,
		providers
	});
	const provider = providers.find((entry) => entry.id === providerId);
	if (!provider) return null;
	const definition = provider.createTool({
		config: options?.config,
		fetchConfig: fetch,
		runtimeMetadata: runtimeWebFetch
	});
	return definition ? {
		provider,
		definition
	} : null;
}
//#endregion
export { isWebFetchProviderConfigured, listWebFetchProviders, resolveWebFetchDefinition };
