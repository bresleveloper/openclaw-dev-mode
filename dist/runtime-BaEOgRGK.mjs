import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { T as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DbgWcCyV.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-B2zZQffc.mjs";
import { S as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-state-CtZtwiOt.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { n as resolveRuntimeWebFetchProviders, t as resolvePluginWebFetchProviders } from "./web-fetch-providers.runtime.js";
import { i as resolveWebProviderConfig, n as providerRequiresCredential, r as readWebProviderEnvValue, t as hasWebProviderEntryCredential } from "./provider-runtime-shared-BIVdnoDH.mjs";
//#region src/web-fetch/runtime.ts
/** Runtime provider selection and tool construction for the `web_fetch` tool. */
const webFetchProviderCache = /* @__PURE__ */ new WeakMap();
function resolveFetchConfig(config) {
	return resolveWebProviderConfig(config, "fetch");
}
function hasEntryCredential(provider, config, fetch) {
	return hasWebProviderEntryCredential({
		provider,
		config,
		toolConfig: fetch,
		resolveRawValue: ({ provider: currentProvider, config: currentConfig }) => currentProvider.getConfiguredCredentialValue?.(currentConfig),
		resolveFallbackRawValue: ({ provider: currentProvider, config: currentConfig }) => currentProvider.getConfiguredCredentialFallback?.(currentConfig)?.value,
		resolveEnvValue: ({ provider: currentProvider }) => readWebProviderEnvValue(currentProvider.envVars)
	});
}
function hasAutoDetectCredential(provider, config, fetch) {
	return hasEntryCredential({
		...provider,
		requiresCredential: true
	}, config, fetch);
}
/** Reports whether a web_fetch provider has usable credentials. */
function isWebFetchProviderConfigured(params) {
	return hasEntryCredential(params.provider, params.config, resolveFetchConfig(params.config));
}
/** Lists web_fetch providers available to runtime selection. */
function listWebFetchProviders(params) {
	return resolvePluginWebFetchProviders({ config: params?.config });
}
/** Auto-detects a web_fetch provider after explicit selections have been resolved. */
function resolveAutoWebFetchProviderId(params) {
	const raw = params.fetch && "provider" in params.fetch ? normalizeLowercaseStringOrEmpty(params.fetch.provider) : "";
	for (const provider of params.providers) {
		if (!providerRequiresCredential(provider)) {
			if (!hasAutoDetectCredential(provider, params.config, params.fetch)) continue;
			logVerbose(`web_fetch: ${raw ? `invalid configured provider "${raw}", ` : ""}auto-detected keyless provider "${provider.id}"`);
			return provider.id;
		}
		if (!hasEntryCredential(provider, params.config, params.fetch)) continue;
		logVerbose(`web_fetch: ${raw ? `invalid configured provider "${raw}", ` : ""}auto-detected "${provider.id}" from available API keys`);
		return provider.id;
	}
	return "";
}
function resolveConfiguredWebFetchProviderId(params) {
	const raw = params.fetch && "provider" in params.fetch ? normalizeLowercaseStringOrEmpty(params.fetch.provider) : "";
	if (!raw) return;
	return params.providers.find((provider) => provider.id === raw)?.id;
}
function resolveWebFetchProviderCacheKey(options) {
	return JSON.stringify([
		getActivePluginRegistryVersion(),
		options?.sandboxed === true,
		options?.preferRuntimeProviders === true
	]);
}
function resolveCachedWebFetchProviders(params) {
	const cached = webFetchProviderCache.get(params.config);
	if (cached?.cacheKey === params.cacheKey && cached.configFingerprint === params.configFingerprint) return cached.providers;
	const loaded = params.load();
	if (loaded.length > 0) webFetchProviderCache.set(params.config, {
		cacheKey: params.cacheKey,
		configFingerprint: params.configFingerprint,
		providers: loaded
	});
	return loaded;
}
function resolveWebFetchProvidersForOptions(options) {
	const load = () => sortPluginEntriesForAutoDetect(options?.sandboxed ? resolvePluginWebFetchProviders({
		config: options?.config,
		sandboxed: true
	}) : options?.preferRuntimeProviders ? resolveRuntimeWebFetchProviders({ config: options?.config }) : resolvePluginWebFetchProviders({ config: options?.config }));
	if (options?.config) return resolveCachedWebFetchProviders({
		config: options.config,
		cacheKey: resolveWebFetchProviderCacheKey(options),
		configFingerprint: resolveRuntimeConfigCacheKey(options.config),
		load
	});
	return load();
}
/** Resolves the executable web_fetch provider tool definition. */
function resolveWebFetchDefinition(options) {
	const fetch = resolveFetchConfig(options?.config);
	if (fetch?.enabled === false) return null;
	const runtimeWebFetch = options?.runtimeWebFetch ?? getActiveRuntimeWebToolsMetadataFromState()?.fetch;
	const providers = resolveWebFetchProvidersForOptions(options);
	if (providers.length === 0) return null;
	const providerId = options?.providerId ?? resolveConfiguredWebFetchProviderId({
		fetch,
		providers
	}) ?? runtimeWebFetch?.selectedProvider ?? resolveAutoWebFetchProviderId({
		config: options?.config,
		fetch,
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
export { listWebFetchProviders as n, resolveWebFetchDefinition as r, isWebFetchProviderConfigured as t };
