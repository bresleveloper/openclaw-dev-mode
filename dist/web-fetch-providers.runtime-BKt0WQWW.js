import "./loader-Bz_7hBop.js";
import { a as sortWebFetchProviders, c as resolveManifestDeclaredWebProviderCandidatePluginIds, i as resolveBundledWebFetchResolutionConfig, s as mapRegistryProviders } from "./web-search-providers.shared-CdowTmsR.js";
import { t as resolveBundledWebFetchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts-C-jOjc6L.js";
import { n as resolveRuntimeWebProviders, t as resolvePluginWebProviders } from "./web-provider-runtime-shared-Bt27d7Ag.js";
//#region src/plugins/web-fetch-providers.runtime.ts
function resolveWebFetchCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidatePluginIds({
		contract: "webFetchProviders",
		configKey: "webFetch",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		origin: params.origin,
		sandboxed: params.sandboxed
	});
}
function mapRegistryWebFetchProviders(params) {
	return mapRegistryProviders({
		entries: params.registry.webFetchProviders,
		onlyPluginIds: params.onlyPluginIds,
		sortProviders: sortWebFetchProviders
	});
}
/** Resolves web fetch providers, activating plugin runtimes when requested. */
function resolvePluginWebFetchProviders(params) {
	return resolvePluginWebProviders(params, {
		resolveBundledResolutionConfig: resolveBundledWebFetchResolutionConfig,
		resolveCandidatePluginIds: resolveWebFetchCandidatePluginIds,
		mapRegistryProviders: mapRegistryWebFetchProviders,
		resolveBundledPublicArtifactProviders: resolveBundledWebFetchProvidersFromPublicArtifacts
	});
}
/** Resolves already-eligible runtime web fetch providers without setup-mode activation. */
function resolveRuntimeWebFetchProviders(params) {
	return resolveRuntimeWebProviders(params, {
		resolveBundledResolutionConfig: resolveBundledWebFetchResolutionConfig,
		resolveCandidatePluginIds: resolveWebFetchCandidatePluginIds,
		mapRegistryProviders: mapRegistryWebFetchProviders
	});
}
//#endregion
export { resolveRuntimeWebFetchProviders as n, resolvePluginWebFetchProviders as t };
