import { t as parseGenerationModelRef } from "./model-ref-BgkLPn2O.js";
import { a as normalizeCapabilityProviderId, i as buildCapabilityProviderMaps, r as resolvePluginCapabilityProviders } from "./capability-provider-runtime-D7E1O4Tn.js";
//#region src/video-generation/model-ref.ts
function parseVideoGenerationModelRef(raw) {
	return parseGenerationModelRef(raw);
}
//#endregion
//#region src/video-generation/provider-registry.ts
const BUILTIN_VIDEO_GENERATION_PROVIDERS = [];
function resolvePluginVideoGenerationProviders(cfg) {
	return resolvePluginCapabilityProviders({
		key: "videoGenerationProviders",
		cfg
	});
}
function buildProviderMaps(cfg) {
	return buildCapabilityProviderMaps([...BUILTIN_VIDEO_GENERATION_PROVIDERS, ...resolvePluginVideoGenerationProviders(cfg)], normalizeCapabilityProviderId);
}
function listVideoGenerationProviders(cfg) {
	return [...buildProviderMaps(cfg).canonical.values()];
}
function getVideoGenerationProvider(providerId, cfg) {
	const normalized = normalizeCapabilityProviderId(providerId);
	if (!normalized) return;
	return buildProviderMaps(cfg).aliases.get(normalized);
}
//#endregion
export { listVideoGenerationProviders as n, parseVideoGenerationModelRef as r, getVideoGenerationProvider as t };
