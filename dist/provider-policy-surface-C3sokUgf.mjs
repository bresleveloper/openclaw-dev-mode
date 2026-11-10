import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getPluginRegistryState, r as getPluginRegistryVersion } from "./runtime-state-Cd-Ga9cg.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import { o as getPluginValueInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Dmwzhxit.mjs";
//#region src/plugins/provider-policy-surface.ts
/** Lightweight direct loader for bundled provider policy public artifacts. */
const PROVIDER_POLICY_ARTIFACT = "provider-policy-api.js";
const PROVIDER_POLICY_HOOK_KEYS = [
	"resolveModelAuthPolicy",
	"resolveFastModeSupport",
	"resolveServiceTiers",
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
	const cacheable = !getPluginRegistryState()?.registrationContext && (!registry || version !== void 0 || getPluginRuntimeLoadContextState(registry)?.loaderCacheIdentity !== void 0);
	const metadata = getPluginCache().metadata;
	resolveBundledPluginsDir();
	const selection = metadata.bundledPluginsDir;
	const owner = registry ?? metadata;
	let surfaces = metadata.bundledProviderPolicySurfaces.get(owner);
	const cached = cacheable ? surfaces?.get(pluginId) : void 0;
	if (cached && cached.version === version && cached.selection === selection) return cached.read();
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: pluginId,
		artifactCandidates: [PROVIDER_POLICY_ARTIFACT]
	});
	const surface = mod ? extractBundledProviderPolicySurface(mod) : null;
	if (cacheable) {
		if (!surfaces) {
			surfaces = /* @__PURE__ */ new Map();
			metadata.bundledProviderPolicySurfaces.set(owner, surfaces);
		}
		const instance = mod ? getPluginValueInstance(mod) : void 0;
		surfaces.set(pluginId, {
			version,
			selection,
			read: instance ? () => instance.run(() => surface) : () => surface
		});
	}
	return surface;
}
//#endregion
export { extractProviderPolicySurface as n, resolveDirectBundledProviderPolicySurface as r, PROVIDER_POLICY_ARTIFACT as t };
