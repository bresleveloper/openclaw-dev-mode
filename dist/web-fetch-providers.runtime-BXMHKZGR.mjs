import { a as mapRegistryProviders, n as resolveBundledWebFetchProvidersFromPublicArtifacts, o as resolveBundledWebProviderResolutionConfig, s as resolveManifestDeclaredWebProviderCandidatePluginIds, t as resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts-Cdpg3t6u.mjs";
import { t as resolvePluginWebProviders } from "./web-provider-runtime-shared-BnMW6RxT.mjs";
//#region src/plugins/web-fetch-providers.runtime.ts
const providerResolution = {
	resolveBundledResolutionConfig: (params) => resolveBundledWebProviderResolutionConfig({
		...params,
		contract: "webFetchProviders"
	}),
	resolveCandidatePluginIds: (params) => resolveManifestDeclaredWebProviderCandidatePluginIds({
		...params,
		contract: "webFetchProviders",
		configKey: "webFetch"
	}),
	mapRegistryProviders: ({ registry, onlyPluginIds }) => mapRegistryProviders({
		registry,
		entries: registry.webFetchProviders,
		onlyPluginIds
	})
};
/** Resolves web fetch providers, activating plugin runtimes when requested. */
function resolvePluginWebFetchProviders(params) {
	return resolvePluginWebProviders(params, {
		...providerResolution,
		resolveBundledPublicArtifactProviders: resolveBundledWebFetchProvidersFromPublicArtifacts,
		resolveBundledRuntimeArtifactProviders: resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts
	});
}
/** Resolves already-eligible runtime web fetch providers without setup-mode activation. */
function resolveRuntimeWebFetchProviders(params) {
	return resolvePluginWebProviders(params, {
		...providerResolution,
		resolveBundledRuntimeArtifactProviders: resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts
	});
}
//#endregion
export { resolveRuntimeWebFetchProviders as n, resolvePluginWebFetchProviders as t };
