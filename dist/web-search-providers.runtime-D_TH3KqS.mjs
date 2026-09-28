import { a as mapRegistryProviders, i as resolveEnabledBundledWebSearchProvidersFromPublicArtifacts, o as resolveBundledWebProviderResolutionConfig, r as resolveBundledWebSearchProvidersFromPublicArtifacts, s as resolveManifestDeclaredWebProviderCandidatePluginIds } from "./web-provider-public-artifacts-Cdpg3t6u.mjs";
import { t as resolvePluginWebProviders } from "./web-provider-runtime-shared-CXKDQADp.mjs";
//#region src/plugins/web-search-providers.runtime.ts
const providerResolution = {
	resolveBundledResolutionConfig: (params) => resolveBundledWebProviderResolutionConfig({
		...params,
		contract: "webSearchProviders"
	}),
	resolveCandidatePluginIds: (params) => resolveManifestDeclaredWebProviderCandidatePluginIds({
		...params,
		contract: "webSearchProviders",
		configKey: "webSearch"
	}),
	mapRegistryProviders: ({ registry, onlyPluginIds }) => mapRegistryProviders({
		registry,
		entries: registry.webSearchProviders,
		onlyPluginIds
	})
};
function resolveLazyBundledWebSearchProviders(params) {
	return resolveEnabledBundledWebSearchProvidersFromPublicArtifacts(params)?.map((provider) => {
		const lazyProvider = Object.assign({}, provider);
		lazyProvider.createTool = (context) => {
			return resolvePluginWebProviders({
				...params,
				onlyPluginIds: [provider.pluginId]
			}, providerResolution).find((entry) => entry.pluginId === provider.pluginId && entry.id === provider.id)?.createTool(context) ?? null;
		};
		return lazyProvider;
	}) ?? null;
}
function resolvePluginWebSearchProviders(params) {
	return resolvePluginWebProviders(params, {
		...providerResolution,
		resolveBundledPublicArtifactProviders: resolveBundledWebSearchProvidersFromPublicArtifacts
	});
}
function resolveRuntimeWebSearchProviders(params) {
	return resolvePluginWebProviders(params, {
		...providerResolution,
		resolveBundledRuntimeArtifactProviders: resolveLazyBundledWebSearchProviders
	});
}
//#endregion
export { resolveRuntimeWebSearchProviders as n, resolvePluginWebSearchProviders as t };
