import { o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { i as getPluginRegistryVersion, r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
//#region src/plugins/provider-policy-surface.ts
/** Lightweight direct loader for bundled provider policy public artifacts. */
const PROVIDER_POLICY_ARTIFACT = "provider-policy-api.js";
const PROVIDER_POLICY_HOOK_KEYS = [
	"resolveFastModeSupport",
	"normalizeConfig",
	"applyConfigDefaults",
	"resolveConfigApiKey",
	"resolveThinkingProfile",
	"resolveToolSearchMode",
	"resolveNativeWebSearch",
	"resolveModelRoutes",
	"normalizeModelCatalogId",
	"isResponseModelEquivalent",
	"inspectEmbeddingProviderSetup"
];
function extractProviderPolicySurface(mod) {
	const surface = {};
	if (Array.isArray(mod.deprecatedProfileIds) && mod.deprecatedProfileIds.every((value) => typeof value === "string")) surface.deprecatedProfileIds = mod.deprecatedProfileIds;
	for (const key of PROVIDER_POLICY_HOOK_KEYS) {
		const hook = mod[key];
		if (typeof hook === "function") Object.assign(surface, { [key]: hook });
	}
	return Object.keys(surface).length > 0 ? surface : null;
}
function extractBundledProviderPolicySurface(mod) {
	const surface = extractProviderPolicySurface(mod) ?? {};
	if (typeof mod.projectConfiguredModelRow === "function") surface.projectConfiguredModelRow = mod.projectConfiguredModelRow;
	if (typeof mod.projectRealtimeVoicePublicProjection === "function") Object.assign(surface, { projectRealtimeVoicePublicProjection: mod.projectRealtimeVoicePublicProjection });
	return Object.keys(surface).length > 0 ? surface : null;
}
/** Loads policy hooks directly by canonical bundled plugin id. */
function resolveDirectBundledProviderPolicySurface(pluginId) {
	if (pluginId === "." || pluginId === ".." || pluginId.includes("/") || pluginId.includes("\\") || pluginId.includes(":")) return null;
	const registry = getPluginRegistryForContext();
	const version = getPluginRegistryVersion(registry);
	const cacheable = !getPluginRegistryState()?.registrationContext && (!registry || version !== void 0);
	const metadata = getPluginCache().metadata;
	resolveBundledPluginsDir();
	const selection = metadata.bundledPluginsDir;
	const cached = cacheable ? metadata.bundledProviderPolicySurfaces.get(pluginId) : void 0;
	if (cached && cached.registry === registry && cached.version === version && cached.selection === selection) return cached.read();
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: pluginId,
		artifactCandidates: [PROVIDER_POLICY_ARTIFACT]
	});
	const surface = mod ? extractBundledProviderPolicySurface(mod) : null;
	if (cacheable) {
		const instance = mod ? getPluginValueInstance(mod) : void 0;
		metadata.bundledProviderPolicySurfaces.set(pluginId, {
			registry,
			version,
			selection,
			read: instance ? () => instance.run(() => surface) : () => surface
		});
	}
	return surface;
}
//#endregion
export { extractProviderPolicySurface as n, resolveDirectBundledProviderPolicySurface as r, PROVIDER_POLICY_ARTIFACT as t };
